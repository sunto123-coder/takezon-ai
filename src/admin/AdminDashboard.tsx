import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { 
  createProduct, 
  updateProduct, 
  createCategory, 
  updateCategory, 
  createOffer, 
  updateOffer, 
  createAdvertisement, 
  updateAdvertisement, 
  updateWebsiteSettings,
  markMessageRead
} from '../services/firebaseService';
import { Product, Category, OfferCard, Advertisement, WebsiteSettings, SocialMediaLink, TopBarSettings, NavigationItem } from '../types';
import { AdCodeRenderer } from '../components/AdCodeRenderer';
import { SocialLinksManager } from './SocialLinksManager';
import { TopBarManager } from './TopBarManager';
import { NavigationManager } from './NavigationManager';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Flame, 
  Megaphone, 
  Mail, 
  Settings, 
  BarChart3, 
  LogOut, 
  ExternalLink, 
  Plus, 
  Pencil, 
  Trash2, 
  Check, 
  X, 
  Search, 
  RotateCcw, 
  Star, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Eye, 
  EyeOff,
  ChevronRight,
  Sliders,
  DollarSign,
  Code2,
  AlertTriangle,
  FileCode,
  Layers,
  Copy,
  ArrowLeft,
  Share2,
  Compass,
  Play,
  ShoppingCart
} from 'lucide-react';

const AD_CODE_TEMPLATES = [
  {
    name: 'Google AdSense Responsive Unit',
    dimensions: 'responsive',
    code: `<!-- Google AdSense Responsive Unit -->
<script async src="https://pagead2.googlesyndicationhub.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456" crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block; text-align:center;"
     data-ad-layout="in-article"
     data-ad-format="fluid"
     data-ad-client="ca-pub-1234567890123456"
     data-ad-slot="9876543210"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`,
  },
  {
    name: 'Amazon Deals / Affiliate Banner (728x90)',
    dimensions: '728x90',
    code: `<div style="text-align:center; padding: 14px; background: #0f172a; border-radius: 12px; border: 1px solid #334155; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
  <div style="display:flex; align-items:center; gap:12px;">
    <span style="background: #f59e0b; color: #0f172a; padding: 4px 10px; border-radius: 6px; font-weight: 800; font-size: 11px;">AMAZON EXCLUSIVE</span>
    <span style="color:#ffffff; font-weight:700; font-size: 14px;">Today's Verified Daily USA Tech Deals & Discounts</span>
  </div>
  <a href="https://amazon.com/deals?tag=takezon-20" target="_blank" rel="noopener noreferrer" style="background: #f59e0b; color: #0f172a; padding: 6px 14px; border-radius: 8px; font-weight: 800; font-size: 12px; text-decoration:none;">Shop Now &rarr;</a>
</div>`,
  },
  {
    name: 'Modern Gradient Promotional Ribbon',
    dimensions: 'responsive',
    code: `<div style="background: linear-gradient(135deg, #312e81 0%, #4338ca 50%, #d97706 100%); padding: 22px; border-radius: 16px; color: #ffffff; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);">
  <div>
    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #fde68a;">Affiliate Sponsored Highlight</div>
    <h3 style="font-size: 20px; font-weight: 900; margin: 4px 0;">Flash Sale: Save Up to 50% on Premium Electronics</h3>
    <p style="font-size: 12px; color: #e0e7ff; margin: 0;">Verified authentic seller deals direct from top US distributors.</p>
  </div>
  <a href="https://takezon.com/deals" target="_blank" rel="noopener noreferrer" style="background: #ffffff; color: #0f172a; font-weight: 800; padding: 10px 20px; border-radius: 12px; text-decoration: none; font-size: 13px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">Explore Flash Deals &rarr;</a>
</div>`,
  },
  {
    name: 'Custom iFrame Embed Widget',
    dimensions: '728x90',
    code: `<iframe 
  src="https://takezon.com" 
  width="100%" 
  height="120" 
  style="border:none; border-radius: 12px; overflow:hidden;" 
  scrolling="no">
</iframe>`,
  }
];

type AdminTab = 'dashboard' | 'products' | 'categories' | 'offers' | 'advertisements' | 'social' | 'topbar' | 'navigation' | 'messages' | 'settings' | 'analytics';

export const AdminDashboard: React.FC = () => {
  const { user, logOut } = useAuth();
  const { 
    products, 
    categories, 
    offers, 
    advertisements, 
    settings, 
    messages, 
    navigateTo, 
    addToast,
    reseedDatabase,
    deleteProduct,
    deleteOffer,
    deleteAdvertisement,
    deleteCategory,
    deleteMessage
  } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Delete Confirmation Modal State (replaces blocked window.confirm)
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    name: string;
    type: 'product' | 'offer' | 'ad' | 'category' | 'message';
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Search & Filter state for products in admin
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('all');

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    brand: '',
    category: 'smart-gadgets',
    shortDescription: '',
    fullDescription: '',
    images: [''],
    originalPrice: 199.99,
    discountPrice: 149.99,
    discountPercentage: 25,
    rating: 4.8,
    reviewCount: 150,
    tags: ['Tech', 'USA Deal'],
    availability: 'In Stock',
    productUrl: 'https://takezon.com/deal',
    affiliateUrl: 'https://amazon.com/dp/example?tag=takezon-20',
    ctaText: 'View Deal',
    isFeatured: true,
    isNew: false,
    isDeal: true,
    isTrending: false,

    // 4. Product Display Control
    displayMode: 'amount',
    amountText: '',
    checkDetailsText: 'Check Details',
    customDisplayText: '',

    // 5. Three Product Action Links
    amazonUrl: 'https://amazon.com/dp/example?tag=takezon-20',
    walmartUrl: '',
    videoUrl: '',

    // 8. Custom Button Labels
    amazonButtonText: 'Check Amazon',
    walmartButtonText: 'Check Walmart',
    videoButtonText: 'Video View',

    // 7. Product-Level Visibility Controls
    showImage: true,
    showTitle: true,
    showDescription: true,
    showAmount: true,
    showCheckDetails: false,
    showAmazonButton: true,
    showWalmartButton: false,
    showVideoButton: false,
  });

  // Offer Modal State
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<OfferCard | null>(null);
  const [offerForm, setOfferForm] = useState<Partial<OfferCard>>({
    title: '',
    subtitle: '',
    badge: 'HOT DEAL',
    description: '',
    image: '',
    discount: '30% OFF',
    originalPrice: 299,
    offerPrice: 199,
    expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().slice(0, 10),
    ctaButtonText: 'Claim Deal',
    affiliateUrl: 'https://takezon.com/offer',
    isActive: true,
    order: 1,
  });

  // Advertisement Modal State
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [adForm, setAdForm] = useState<Partial<Advertisement>>({
    title: '',
    subtitle: '',
    placement: 'homepage_top',
    adType: 'image',
    imageUrl: '',
    targetUrl: '',
    ctaText: 'Explore Deals',
    badgeText: 'LIMITED PROMO',
    customCode: '',
    codeType: 'html',
    adDimensions: 'responsive',
    isActive: true,
    priority: 1,
  });

  // Category Edit Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    image: '',
    badge: 'Trending',
    order: 1,
    enabled: true,
  });

  // Website Settings Form State
  const [settingsForm, setSettingsForm] = useState<WebsiteSettings>({ ...settings });

  // Sync settingsForm when settings change
  React.useEffect(() => {
    setSettingsForm({ ...settings });
  }, [settings]);

  // Close any open admin modal on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsProductModalOpen(false);
        setIsOfferModalOpen(false);
        setIsAdModalOpen(false);
        setIsCategoryModalOpen(false);
        setItemToDelete(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for Products
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      brand: '',
      category: categories[0]?.slug || 'smart-gadgets',
      shortDescription: '',
      fullDescription: '',
      images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80'],
      originalPrice: 199.99,
      discountPrice: 149.99,
      discountPercentage: 25,
      rating: 4.8,
      reviewCount: 120,
      tags: ['USA Deal', 'Trending'],
      availability: 'In Stock',
      productUrl: 'https://takezon.com/deal',
      affiliateUrl: 'https://amazon.com/dp/example?tag=takezon-20',
      ctaText: 'View Deal',
      isFeatured: true,
      isNew: true,
      isDeal: true,
      isTrending: false,

      // 4. Product Display Control
      displayMode: 'amount',
      amountText: '',
      checkDetailsText: 'Check Details',
      customDisplayText: '',

      // 5. Three Product Action Links
      amazonUrl: 'https://amazon.com/dp/example?tag=takezon-20',
      walmartUrl: '',
      videoUrl: '',

      // 8. Custom Button Labels
      amazonButtonText: 'Check Amazon',
      walmartButtonText: 'Check Walmart',
      videoButtonText: 'Video View',

      // 7. Product-Level Visibility Controls
      showImage: true,
      showTitle: true,
      showDescription: true,
      showAmount: true,
      showCheckDetails: false,
      showAmazonButton: true,
      showWalmartButton: false,
      showVideoButton: false,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      ...prod,
      displayMode: prod.displayMode || (prod.showCheckDetails ? 'checkDetails' : 'amount'),
      amountText: prod.amountText || (prod.discountPrice !== undefined ? `$${prod.discountPrice.toFixed(2)}` : ''),
      checkDetailsText: prod.checkDetailsText || 'Check Details',
      customDisplayText: prod.customDisplayText || '',
      amazonUrl: prod.amazonUrl || prod.affiliateUrl || prod.productUrl || '',
      walmartUrl: prod.walmartUrl || '',
      videoUrl: prod.videoUrl || '',
      amazonButtonText: prod.amazonButtonText || 'Check Amazon',
      walmartButtonText: prod.walmartButtonText || 'Check Walmart',
      videoButtonText: prod.videoButtonText || 'Video View',
      showImage: prod.showImage !== false,
      showTitle: prod.showTitle !== false,
      showDescription: prod.showDescription !== false,
      showAmount: prod.showAmount !== false,
      showCheckDetails: prod.showCheckDetails === true || prod.displayMode === 'checkDetails',
      showAmazonButton: prod.showAmazonButton !== false,
      showWalmartButton: prod.showWalmartButton !== false,
      showVideoButton: prod.showVideoButton !== false,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const orig = Number(productForm.originalPrice) || 0;
      const disc = Number(productForm.discountPrice) || 0;
      const pct = orig > disc && orig > 0 ? Math.round(((orig - disc) / orig) * 100) : 0;

      const payload: Partial<Product> = {
        name: productForm.name || 'Untitled Product',
        brand: productForm.brand || 'Verified Brand',
        category: productForm.category || 'smart-gadgets',
        shortDescription: productForm.shortDescription || '',
        fullDescription: productForm.fullDescription || productForm.shortDescription || '',
        images: productForm.images?.filter(img => img.trim().length > 0) || ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80'],
        originalPrice: orig,
        discountPrice: disc,
        discountPercentage: pct,
        rating: Number(productForm.rating) || 4.8,
        reviewCount: Number(productForm.reviewCount) || 100,
        tags: Array.isArray(productForm.tags) ? productForm.tags : typeof productForm.tags === 'string' ? (productForm.tags as string).split(',').map((t: string) => t.trim()) : [],
        availability: productForm.availability || 'In Stock',
        productUrl: productForm.productUrl || 'https://takezon.com/deal',
        affiliateUrl: productForm.affiliateUrl || 'https://takezon.com/deal',
        ctaText: productForm.ctaText || 'View Deal',
        isFeatured: !!productForm.isFeatured,
        isNew: !!productForm.isNew,
        isDeal: !!productForm.isDeal,
        isTrending: !!productForm.isTrending,

        // 4. Product Display Control
        displayMode: productForm.displayMode || 'amount',
        amountText: productForm.amountText || '',
        checkDetailsText: productForm.checkDetailsText || 'Check Details',
        customDisplayText: productForm.customDisplayText || '',

        // 5. Three Product Action Links
        amazonUrl: productForm.amazonUrl || '',
        walmartUrl: productForm.walmartUrl || '',
        videoUrl: productForm.videoUrl || '',

        // 8. Custom Button Labels
        amazonButtonText: productForm.amazonButtonText || 'Check Amazon',
        walmartButtonText: productForm.walmartButtonText || 'Check Walmart',
        videoButtonText: productForm.videoButtonText || 'Video View',

        // 7. Granular Visibility Controls
        showImage: productForm.showImage !== false,
        showTitle: productForm.showTitle !== false,
        showDescription: productForm.showDescription !== false,
        showAmount: productForm.showAmount !== false,
        showCheckDetails: !!productForm.showCheckDetails,
        showAmazonButton: productForm.showAmazonButton !== false,
        showWalmartButton: productForm.showWalmartButton !== false,
        showVideoButton: productForm.showVideoButton !== false,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        addToast('Product successfully updated in Firestore!', 'success');
      } else {
        await createProduct(payload as any);
        addToast('New product added to TakeZon catalog!', 'success');
      }
      setIsProductModalOpen(false);
    } catch (err: any) {
      addToast('Error saving product: ' + err.message, 'error');
    }
  };

  // Handlers for Social Media Links, Top Bar, Navigation Menu
  const handleSaveSocialLinks = async (links: SocialMediaLink[]) => {
    await updateWebsiteSettings({ socialLinks: links });
  };

  const handleSaveTopBar = async (tb: TopBarSettings) => {
    await updateWebsiteSettings({ topBar: tb });
  };

  const handleSaveNavigation = async (navItems: NavigationItem[]) => {
    await updateWebsiteSettings({ navigationItems: navItems });
  };

  const handleDeleteProduct = (id: string, name: string) => {
    setItemToDelete({ id, name, type: 'product' });
  };

  const handleDeleteOffer = (id: string, name: string) => {
    setItemToDelete({ id, name, type: 'offer' });
  };

  const handleDeleteAd = (id: string, name: string) => {
    setItemToDelete({ id, name, type: 'ad' });
  };

  const handleDeleteCategory = (id: string, name: string) => {
    setItemToDelete({ id, name, type: 'category' });
  };

  const handleDeleteMessage = (id: string, name: string) => {
    setItemToDelete({ id, name, type: 'message' });
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      if (itemToDelete.type === 'product') {
        await deleteProduct(itemToDelete.id);
        addToast(`Product "${itemToDelete.name}" was deleted successfully!`, 'success');
      } else if (itemToDelete.type === 'offer') {
        await deleteOffer(itemToDelete.id);
        addToast(`Offer card "${itemToDelete.name}" was deleted successfully!`, 'success');
      } else if (itemToDelete.type === 'ad') {
        await deleteAdvertisement(itemToDelete.id);
        addToast(`Banner advertisement "${itemToDelete.name}" was deleted successfully!`, 'success');
      } else if (itemToDelete.type === 'category') {
        await deleteCategory(itemToDelete.id);
        addToast(`Category "${itemToDelete.name}" was deleted successfully!`, 'success');
      } else if (itemToDelete.type === 'message') {
        await deleteMessage(itemToDelete.id);
        addToast(`Message deleted successfully!`, 'success');
      }
      setItemToDelete(null);
    } catch (err: any) {
      addToast('Error deleting item: ' + err.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handlers for Offers
  const handleOpenAddOffer = () => {
    setEditingOffer(null);
    setOfferForm({
      title: '',
      subtitle: '',
      badge: 'HOT DEAL',
      description: '',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80',
      discount: '35% OFF',
      originalPrice: 499,
      offerPrice: 329,
      expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
      ctaButtonText: 'Claim Offer',
      affiliateUrl: 'https://takezon.com/offers',
      isActive: true,
      order: offers.length + 1,
    });
    setIsOfferModalOpen(true);
  };

  const handleOpenEditOffer = (offer: OfferCard) => {
    setEditingOffer(offer);
    setOfferForm({ ...offer });
    setIsOfferModalOpen(true);
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: offerForm.title || 'Special Promotion',
        subtitle: offerForm.subtitle || '',
        badge: offerForm.badge || 'HOT DEAL',
        description: offerForm.description || '',
        image: offerForm.image || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80',
        discount: offerForm.discount || 'Special Discount',
        originalPrice: Number(offerForm.originalPrice) || 0,
        offerPrice: Number(offerForm.offerPrice) || 0,
        expirationDate: offerForm.expirationDate || new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
        ctaButtonText: offerForm.ctaButtonText || 'View Deal',
        affiliateUrl: offerForm.affiliateUrl || 'https://takezon.com',
        isActive: offerForm.isActive !== false,
        order: Number(offerForm.order) || 1,
      };

      if (editingOffer) {
        await updateOffer(editingOffer.id, payload);
        addToast('Offer Card updated in Firestore.', 'success');
      } else {
        await createOffer(payload as any);
        addToast('New Offer Card created in Firestore.', 'success');
      }
      setIsOfferModalOpen(false);
    } catch (err: any) {
      addToast('Error saving offer: ' + err.message, 'error');
    }
  };

  // Handlers for Advertisements
  const handleOpenAddAd = () => {
    setEditingAd(null);
    setAdForm({
      title: '',
      subtitle: '',
      placement: 'homepage_top',
      adType: 'image',
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      targetUrl: 'https://takezon.com/deals',
      ctaText: 'Shop Now',
      badgeText: 'LIMITED RUN',
      customCode: '',
      codeType: 'html',
      adDimensions: 'responsive',
      isActive: true,
      priority: 1,
    });
    setIsAdModalOpen(true);
  };

  const handleOpenEditAd = (ad: Advertisement) => {
    setEditingAd(ad);
    setAdForm({
      ...ad,
      adType: ad.adType || (ad.customCode ? 'code' : 'image'),
      customCode: ad.customCode || '',
      adDimensions: ad.adDimensions || 'responsive',
    });
    setIsAdModalOpen(true);
  };

  const handleSaveAd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isCode = adForm.adType === 'code';
      const payload: any = {
        title: adForm.title || (isCode ? 'Custom Ad Banner' : 'Promotional Banner'),
        subtitle: adForm.subtitle || '',
        placement: adForm.placement || 'homepage_top',
        adType: adForm.adType || 'image',
        imageUrl: adForm.imageUrl || (isCode ? 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80' : ''),
        targetUrl: adForm.targetUrl || 'https://takezon.com',
        ctaText: adForm.ctaText || 'Check Deal',
        badgeText: adForm.badgeText || '',
        customCode: adForm.customCode || '',
        codeType: adForm.codeType || 'html',
        adDimensions: adForm.adDimensions || 'responsive',
        isActive: adForm.isActive !== false,
        priority: Number(adForm.priority) || 1,
      };

      if (editingAd) {
        await updateAdvertisement(editingAd.id, payload);
        addToast('Banner updated in Firestore.', 'success');
      } else {
        await createAdvertisement(payload as any);
        addToast('New Banner published to website.', 'success');
      }
      setIsAdModalOpen(false);
    } catch (err: any) {
      addToast('Error saving banner: ' + err.message, 'error');
    }
  };

  // Handlers for Category Edit
  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryForm({ ...cat });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      await updateCategory(editingCategory.id, {
        name: categoryForm.name,
        description: categoryForm.description,
        image: categoryForm.image,
        badge: categoryForm.badge,
        order: Number(categoryForm.order),
        enabled: categoryForm.enabled !== false,
      });
      addToast('Category details updated in Firestore.', 'success');
      setIsCategoryModalOpen(false);
    } catch (err: any) {
      addToast('Error updating category: ' + err.message, 'error');
    }
  };

  // Handlers for Website Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateWebsiteSettings(settingsForm);
      addToast('Website settings updated in Firestore! Reflected across storefront.', 'success');
    } catch (err: any) {
      addToast('Error saving settings: ' + err.message, 'error');
    }
  };

  // Filtered products in admin table
  const adminFilteredProducts = products.filter(p => {
    const matchesSearch = !productSearch || 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
      p.brand.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = productCatFilter === 'all' || p.category === productCatFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Logo & Admin Badge */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-amber-500 flex items-center justify-center font-heading font-black text-white text-lg shadow-md">
              TZ
            </div>
            <div>
              <div className="font-heading font-black text-lg text-white leading-tight">
                Take<span className="text-amber-400">Zon</span>
              </div>
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                Admin Console
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="mt-6 space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Products Catalog</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Tags className="w-4 h-4" />
                <span>5 Core Categories</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">
                {categories.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('offers')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'offers'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Offer Cards</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300">
                {offers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('advertisements')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'advertisements'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Megaphone className="w-4 h-4" />
                <span>Banners & Ads</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">
                {advertisements.length}
              </span>
            </button>

            {/* Social Media Links Management */}
            <button
              onClick={() => setActiveTab('social')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'social'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Share2 className="w-4 h-4 text-indigo-400" />
                <span>Social Media Links</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-500/20 text-indigo-300">
                {(settings.socialLinks || []).filter(s => s.enabled !== false).length}
              </span>
            </button>

            {/* Top Bar / Header Control */}
            <button
              onClick={() => setActiveTab('topbar')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'topbar'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Top Bar & Header</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${settings.topBar?.enabled !== false ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                {settings.topBar?.enabled !== false ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Main Navigation Menu Control */}
            <button
              onClick={() => setActiveTab('navigation')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'navigation'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>Navigation Menu</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300">
                {(settings.navigationItems || []).filter(n => n.enabled !== false).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'messages'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>Contact Messages</span>
              </div>
              {messages.filter(m => !m.read).length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white">
                  {messages.filter(m => !m.read).length} new
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Website Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Affiliate Telemetry</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions: Storefront, Re-seed, User Info, Logout */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="group w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-xs text-white font-bold transition-all cursor-pointer border border-slate-700 hover:border-amber-400/50 shadow-md active:scale-95"
            title="Return to public storefront"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400 transition-transform group-hover:-translate-x-1" />
              <span>Back to Storefront</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            onClick={reseedDatabase}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-700 hover:border-amber-400 text-xs text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
            title="Reset Firestore to full verified USA dataset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Catalog</span>
          </button>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 overflow-hidden">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Admin'}
                  className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-amber-400"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'A')}
                </div>
              )}
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">
                  {user?.displayName || user?.email || 'Admin Session'}
                </div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Active Authenticated
                </div>
              </div>
            </div>

            <button
              onClick={logOut}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto max-h-screen">
        
        {/* ================= TAB 1: DASHBOARD OVERVIEW ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
                  Executive Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Cloud Firestore synced. Updates made here reflect instantaneously on the customer storefront.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
                <button
                  onClick={handleOpenAddOffer}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Flame className="w-4 h-4" />
                  <span>Create Offer Card</span>
                </button>
              </div>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span className="font-semibold uppercase tracking-wider">Total Products</span>
                  <Package className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-3xl font-black font-heading text-white">{products.length}</div>
                <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Across 5 USA collections</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span className="font-semibold uppercase tracking-wider">Active Deals</span>
                  <Flame className="w-4 h-4 text-red-400" />
                </div>
                <div className="text-3xl font-black font-heading text-white">
                  {products.filter(p => p.isDeal).length}
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  <span>With price-drop badges</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span className="font-semibold uppercase tracking-wider">Offer Cards</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-black font-heading text-white">
                  {offers.filter(o => o.isActive).length}
                </div>
                <div className="text-xs text-amber-400 mt-2">
                  <span>Live countdown timers active</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span className="font-semibold uppercase tracking-wider">Contact Inquiries</span>
                  <Mail className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-3xl font-black font-heading text-white">{messages.length}</div>
                <div className="text-xs text-slate-400 mt-2">
                  <span>{messages.filter(m => !m.read).length} unread in inbox</span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left: Quick Actions Panel */}
              <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="font-heading font-black text-lg text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>Quick Content Tools</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Perform immediate content modifications across products, banners, and store promotions.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleOpenAddProduct}
                    className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left transition-colors cursor-pointer group"
                  >
                    <Package className="w-5 h-5 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="text-xs font-bold text-white">New Product</div>
                    <div className="text-[11px] text-slate-400">Add to any category</div>
                  </button>

                  <button
                    onClick={handleOpenAddOffer}
                    className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left transition-colors cursor-pointer group"
                  >
                    <Flame className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="text-xs font-bold text-white">New Offer Card</div>
                    <div className="text-[11px] text-slate-400">Limited-time coupon</div>
                  </button>

                  <button
                    onClick={handleOpenAddAd}
                    className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left transition-colors cursor-pointer group"
                  >
                    <Megaphone className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="text-xs font-bold text-white">Create Banner</div>
                    <div className="text-[11px] text-slate-400">Top/Mid/Section ads</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-left transition-colors cursor-pointer group"
                  >
                    <Settings className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="text-xs font-bold text-white">Edit Store Copy</div>
                    <div className="text-[11px] text-slate-400">Hero & announcements</div>
                  </button>
                </div>
              </div>

              {/* Right: Recent Inbound Inquiries */}
              <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-black text-lg text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-cyan-400" />
                    <span>Recent Customer Messages</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="text-xs font-bold text-indigo-400 hover:underline"
                  >
                    View All
                  </button>
                </div>

                {messages.length > 0 ? (
                  <div className="space-y-3">
                    {messages.slice(0, 4).map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3.5 rounded-xl border text-xs transition-colors ${
                          !msg.read 
                            ? 'bg-indigo-950/40 border-indigo-700/60' 
                            : 'bg-slate-800/50 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-white">{msg.name}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-indigo-300 font-medium truncate">{msg.subject}</div>
                        <p className="text-slate-400 line-clamp-1 mt-1">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-slate-500 text-xs">
                    No inquiries received yet. Submissions from the public Contact form will appear here.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: PRODUCTS CATALOG ================= */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading font-black text-2xl text-white">
                  Products Management ({products.length})
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Manage products, discounts, affiliate links, and category assignments.
                </p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Filter bar */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Filter by name or brand..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-indigo-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <label className="text-xs text-slate-400 shrink-0">Category:</label>
                <select
                  value={productCatFilter}
                  onChange={(e) => setProductCatFilter(e.target.value)}
                  className="text-xs bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-hidden cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Display Mode / Value</th>
                      <th className="py-3 px-4">Action Links</th>
                      <th className="py-3 px-4">Badges</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {adminFilteredProducts.map((prod) => {
                      const isCheckDetails = prod.displayMode === 'checkDetails';
                      const hasAmazon = prod.showAmazonButton !== false && Boolean((prod.amazonUrl || prod.affiliateUrl || prod.productUrl)?.trim());
                      const hasWalmart = prod.showWalmartButton !== false && Boolean(prod.walmartUrl?.trim());
                      const hasVideo = prod.showVideoButton !== false && Boolean(prod.videoUrl?.trim());

                      return (
                        <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 flex items-center gap-3 max-w-xs">
                            <img
                              src={prod.images[0]}
                              alt=""
                              className="w-12 h-12 rounded-lg object-cover bg-slate-800 shrink-0 border border-slate-700"
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-white truncate">{prod.name}</div>
                              <div className="text-[11px] text-slate-400">{prod.brand}</div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-indigo-300 border border-slate-700">
                              {categories.find(c => c.slug === prod.category)?.name || prod.category}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            {isCheckDetails ? (
                              <div>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                  <Eye className="w-3 h-3 text-cyan-400" />
                                  <span>{prod.checkDetailsText || 'Check Details'}</span>
                                </span>
                                <div className="text-[10px] text-slate-400 mt-0.5">Mode: Check Details</div>
                              </div>
                            ) : (
                              <div>
                                <div className="font-bold text-white">
                                  {prod.amountText || `$${prod.discountPrice.toFixed(2)}`}
                                </div>
                                {!prod.amountText && prod.originalPrice > prod.discountPrice && (
                                  <div className="text-[11px] text-slate-400 line-through">
                                    ${prod.originalPrice.toFixed(2)} (-{prod.discountPercentage}%)
                                  </div>
                                )}
                                <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">Mode: Amount</div>
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                                hasAmazon 
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                                  : 'bg-slate-800 text-slate-500 line-through'
                              }`}>
                                <ShoppingCart className="w-2.5 h-2.5" />
                                <span>Amazon</span>
                              </span>

                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                                hasWalmart 
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                                  : 'bg-slate-800 text-slate-500 line-through'
                              }`}>
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>Walmart</span>
                              </span>

                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                                hasVideo 
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                                  : 'bg-slate-800 text-slate-500 line-through'
                              }`}>
                                <Play className="w-2.5 h-2.5 fill-current" />
                                <span>Video</span>
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1">
                              {prod.isDeal && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-950 text-red-400 border border-red-800">
                                  DEAL
                                </span>
                              )}
                              {prod.isFeatured && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-950 text-indigo-400 border border-indigo-800">
                                  FEAT
                                </span>
                              )}
                              {prod.isTrending && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-950 text-amber-400 border border-amber-800">
                                  TREND
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditProduct(prod)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                title="Edit product"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                title="Delete product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: CATEGORIES MANAGEMENT ================= */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h1 className="font-heading font-black text-2xl text-white">
                5 Core Categories Management
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Customize titles, images, descriptions, and storefront visibility for the 5 main categories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="relative pt-[45%] bg-slate-950">
                      <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          cat.enabled !== false ? 'bg-emerald-500 text-slate-950' : 'bg-rose-600 text-white'
                        }`}>
                          {cat.enabled !== false ? 'ENABLED' : 'DISABLED'}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-heading font-bold text-lg text-white">{cat.name}</h3>
                        <span className="text-[11px] text-amber-400 font-mono">Order: #{cat.order}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2">{cat.description}</p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {products.filter(p => p.category === cat.slug).length} Products Assigned
                    </span>

                    <button
                      onClick={() => handleOpenEditCategory(cat)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-xs text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit Category</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: OFFER CARDS ================= */}
        {activeTab === 'offers' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading font-black text-2xl text-white">
                  Special Offer Cards & Deals
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Create high-converting offer cards with countdown timers, CPA links, and custom badges.
                </p>
              </div>

              <button
                onClick={handleOpenAddOffer}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>New Offer Card</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <div key={offer.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="relative pt-[45%] bg-slate-950">
                      <img src={offer.image} alt={offer.title} className="absolute inset-0 w-full h-full object-cover opacity-70" />
                      <div className="absolute top-3 left-3 bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded">
                        {offer.badge}
                      </div>
                      <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded">
                        {offer.discount}
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-heading font-bold text-base text-white line-clamp-1">{offer.title}</h3>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2">{offer.description}</p>
                      
                      <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
                        <span>Price: <strong className="text-white">${offer.offerPrice?.toFixed(2)}</strong></span>
                        <span className="text-[11px] text-amber-400 font-mono">
                          Expires: {offer.expirationDate?.slice(0, 10)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/80">
                    <span className={`text-[10px] font-bold uppercase ${offer.isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {offer.isActive ? 'Active on Store' : 'Inactive'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditOffer(offer)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-white transition-colors cursor-pointer"
                        title="Edit Offer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteOffer(offer.id, offer.title)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                        title="Delete Offer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: BANNERS & ADS ================= */}
        {activeTab === 'advertisements' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading font-black text-2xl text-white">
                  Advertisement & Banner Management
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Place banners dynamically across Top, Middle, Between Sections, Bottom, or Sidebar using Images or Custom Code.
                </p>
              </div>

              <button
                onClick={handleOpenAddAd}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create Banner / Ad Code</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {advertisements.map((ad) => {
                const isCodeAd = ad.adType === 'code' || (!!ad.customCode && ad.customCode.trim().length > 0);
                return (
                  <div key={ad.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-5 flex flex-col justify-between shadow-lg">
                    <div className="space-y-3">
                      {/* Banner Visual or Code Preview */}
                      {isCodeAd ? (
                        <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 p-3 min-h-[120px] flex flex-col justify-center">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2 border-b border-slate-800 pb-1">
                            <span className="font-mono text-amber-400 flex items-center gap-1">
                              <Code2 className="w-3 h-3" />
                              Custom Ad Code Embed
                            </span>
                            <span className="bg-indigo-600 text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">
                              {ad.placement}
                            </span>
                          </div>
                          <AdCodeRenderer 
                            code={ad.customCode || ''} 
                            adDimensions={ad.adDimensions} 
                            className="w-full"
                          />
                        </div>
                      ) : (
                        <div className="relative pt-[35%] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                          <img src={ad.imageUrl} alt={ad.title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                          <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                            Placement: {ad.placement}
                          </div>
                          <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                            Image Banner
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading font-bold text-base text-white">{ad.title}</h3>
                          {isCodeAd && (
                            <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-amber-400 text-slate-950 rounded uppercase">
                              CODE
                            </span>
                          )}
                        </div>
                        {ad.subtitle && <p className="text-xs text-slate-400 mt-1 line-clamp-1">{ad.subtitle}</p>}
                        {ad.customCode && (
                          <div className="mt-2 p-2 rounded-lg bg-slate-950 font-mono text-[10px] text-slate-400 truncate border border-slate-800">
                            {ad.customCode.slice(0, 80)}...
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${ad.isActive ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                        <span className="text-xs font-semibold text-slate-300">
                          {ad.isActive ? 'Active on Store' : 'Disabled'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditAd(ad)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-xs text-white font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteAd(ad.id, ad.title)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                          title="Delete Banner"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 6: CONTACT MESSAGES ================= */}
        {activeTab === 'messages' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h1 className="font-heading font-black text-2xl text-white">
                Customer & Partnership Inquiries ({messages.length})
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Real-time transmissions submitted via the public Contact page stored in Cloud Firestore.
              </p>
            </div>

            {messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`bg-slate-900 border rounded-2xl p-6 transition-all ${
                      !msg.read ? 'border-indigo-600 ring-1 ring-indigo-500/20' : 'border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                      <div>
                        <span className="text-xs font-bold text-indigo-400 block">{msg.category || 'Inquiry'}</span>
                        <h3 className="font-heading font-bold text-lg text-white">{msg.subject}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400">
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="py-4 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {msg.message}
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-4 text-slate-400">
                        <span>From: <strong className="text-white">{msg.name}</strong></span>
                        <span>Email: <a href={`mailto:${msg.email}`} className="text-indigo-400 hover:underline">{msg.email}</a></span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={async () => {
                            await markMessageRead(msg.id, !msg.read);
                            addToast(msg.read ? 'Marked unread' : 'Marked as read', 'info');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                        >
                          {msg.read ? 'Mark Unread' : 'Mark as Read'}
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(msg.id, `${msg.name} (${msg.subject})`)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Delete message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-3xl p-8">
                <Mail className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="font-heading font-bold text-lg text-white">No Messages in Inbox</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  When visitors submit inquiries through the public Contact page, they will appear here instantly.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: SOCIAL MEDIA LINKS MANAGEMENT ================= */}
        {activeTab === 'social' && (
          <SocialLinksManager 
            settings={settings} 
            onSave={handleSaveSocialLinks} 
            addToast={addToast} 
          />
        )}

        {/* ================= TAB: TOP BAR / HEADER CONTROL ================= */}
        {activeTab === 'topbar' && (
          <TopBarManager 
            settings={settings} 
            onSave={handleSaveTopBar} 
            addToast={addToast} 
          />
        )}

        {/* ================= TAB: MAIN NAVIGATION MENU CONTROL ================= */}
        {activeTab === 'navigation' && (
          <NavigationManager 
            settings={settings} 
            categories={categories}
            onSave={handleSaveNavigation} 
            addToast={addToast} 
          />
        )}

        {/* ================= TAB 7: WEBSITE SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h1 className="font-heading font-black text-2xl text-white">
                Storefront Settings & Content Copy
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Update headlines, hero banners, top announcements, social links, and legal disclosures without editing code.
              </p>
            </div>

            {/* Quick Management Shortcuts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl">
              <button
                type="button"
                onClick={() => setActiveTab('social')}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 text-left transition-all cursor-pointer group shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <Share2 className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                    {(settings.socialLinks || []).filter(s => s.enabled !== false).length} Active
                  </span>
                </div>
                <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                  Social Media Links
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Add, edit, reorder & toggle platforms
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('topbar')}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/60 text-left transition-all cursor-pointer group shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <Sliders className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${settings.topBar?.enabled !== false ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                    {settings.topBar?.enabled !== false ? 'ENABLED' : 'HIDDEN'}
                  </span>
                </div>
                <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                  Top Header / Bar Control
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Full border, announcement, badge & button controls
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('navigation')}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/60 text-left transition-all cursor-pointer group shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <Compass className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    {(settings.navigationItems || []).filter(n => n.enabled !== false).length} Visible
                  </span>
                </div>
                <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                  Main Navigation Menu
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Labels, routes, categories, ordering & visibility
                </div>
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 max-w-4xl">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="font-heading font-bold text-base text-amber-400 uppercase tracking-wider">
                  Brand & Header Bar
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Site Title
                  </label>
                  <input
                    type="text"
                    value={settingsForm.siteTitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, siteTitle: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Top Announcement Bar
                  </label>
                  <input
                    type="text"
                    value={settingsForm.announcementText}
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="border-b border-slate-800 pb-4 pt-4">
                <h3 className="font-heading font-bold text-base text-amber-400 uppercase tracking-wider">
                  Hero Section Setup
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Hero Headline
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroTitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Hero Subtitle
                  </label>
                  <textarea
                    rows={3}
                    value={settingsForm.heroSubtitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Hero CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={settingsForm.heroCtaText}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroCtaText: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Hero Badge Text
                    </label>
                    <input
                      type="text"
                      value={settingsForm.heroBadgeText}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroBadgeText: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border-b border-slate-800 pb-4 pt-4">
                <h3 className="font-heading font-bold text-base text-amber-400 uppercase tracking-wider">
                  Contact Information & Disclosures
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={settingsForm.contactEmail}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Support Phone
                  </label>
                  <input
                    type="text"
                    value={settingsForm.contactPhone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    HQ Address
                  </label>
                  <input
                    type="text"
                    value={settingsForm.contactAddress}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactAddress: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  FTC Affiliate Disclosure Notice
                </label>
                <textarea
                  rows={3}
                  value={settingsForm.affiliateDisclosure}
                  onChange={(e) => setSettingsForm({ ...settingsForm, affiliateDisclosure: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all cursor-pointer"
                >
                  Save Website Settings to Firebase
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= TAB 8: ANALYTICS & TELEMETRY ================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h1 className="font-heading font-black text-2xl text-white">
                Affiliate Performance & Telemetry
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Monitored outbound click metrics, category interest breakdown, and USA conversion tracking.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Total Tracked Clicks
                </div>
                <div className="text-4xl font-heading font-black text-white">2,842</div>
                <div className="text-xs text-emerald-400 mt-2">+18.4% from last week</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Estimated Outbound CTR
                </div>
                <div className="text-4xl font-heading font-black text-white">4.82%</div>
                <div className="text-xs text-indigo-400 mt-2">Above industry benchmark</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Top Converting Category
                </div>
                <div className="text-2xl font-heading font-black text-amber-400">PC Accessories</div>
                <div className="text-xs text-slate-400 mt-2">Driven by QD-OLED monitors</div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
              <h3 className="font-heading font-bold text-base text-white mb-4">
                Category Click Momentum Breakdown
              </h3>
              <div className="space-y-4">
                {categories.map((cat, idx) => {
                  const shares = [32, 24, 21, 14, 9];
                  const share = shares[idx] || 10;
                  return (
                    <div key={cat.id} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-white">{cat.name}</span>
                        <span className="text-slate-400">{share}% of total clicks</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 rounded-full" 
                          style={{ width: `${share}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL: ADD / EDIT PRODUCT ================= */}
      {isProductModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsProductModalOpen(false);
          }}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl text-white animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="font-heading font-black text-xl text-white">
                {editingProduct ? 'Edit Product in Firestore' : 'Add New Product to TakeZon'}
              </h2>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="group p-2 rounded-xl bg-slate-800 hover:bg-rose-950/70 text-slate-400 hover:text-rose-300 border border-slate-700/80 hover:border-rose-700/80 transition-all cursor-pointer active:scale-90"
                title="Close modal (ESC)"
              >
                <X className="w-5 h-5 stroke-[2.5] transition-transform group-hover:rotate-90 duration-200" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Category Assignment *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Original Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Discount Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.discountPrice}
                    onChange={(e) => setProductForm({ ...productForm, discountPrice: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    CTA Button Text
                  </label>
                  <select
                    value={productForm.ctaText}
                    onChange={(e) => setProductForm({ ...productForm, ctaText: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden cursor-pointer"
                  >
                    <option value="View Deal">View Deal</option>
                    <option value="Shop Now">Shop Now</option>
                    <option value="Learn More">Learn More</option>
                    <option value="Get Offer">Get Offer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Affiliate / Product URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://amazon.com/dp/example?tag=takezon-20"
                  value={productForm.affiliateUrl}
                  onChange={(e) => setProductForm({ ...productForm, affiliateUrl: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Primary Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={productForm.images?.[0] || ''}
                  onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Short Description *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.shortDescription}
                  onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Full Detailed Description
                </label>
                <textarea
                  rows={3}
                  value={productForm.fullDescription}
                  onChange={(e) => setProductForm({ ...productForm, fullDescription: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                />
              </div>

              {/* ================= 4. PRODUCT DISPLAY CONTROL ================= */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-amber-400" />
                    <span className="font-heading font-bold text-xs uppercase tracking-wider text-amber-400">
                      Product Display & Presentation System
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Configure Amount vs Check Details
                  </span>
                </div>

                {/* Display Mode Choice: Option A (Amount) vs Option B (Check Details) */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                    Presentation Display Mode *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setProductForm({ 
                        ...productForm, 
                        displayMode: 'amount',
                        showAmount: true,
                        showCheckDetails: false
                      })}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        productForm.displayMode !== 'checkDetails'
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-xs ring-1 ring-indigo-500'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                        <span>OPTION A: Show Amount / Price</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Displays dollar value or custom formatted price
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setProductForm({ 
                        ...productForm, 
                        displayMode: 'checkDetails',
                        showAmount: false,
                        showCheckDetails: true
                      })}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        productForm.displayMode === 'checkDetails'
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-xs ring-1 ring-indigo-500'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        <span>OPTION B: "Check Details"</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Displays text button instead of price
                      </div>
                    </button>
                  </div>
                </div>

                {/* Amount text & Check Details text inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Custom Amount / Value Text
                    </label>
                    <input
                      type="text"
                      placeholder={`e.g. $${productForm.discountPrice || '49.99'} or From $29`}
                      value={productForm.amountText || ''}
                      onChange={(e) => setProductForm({ ...productForm, amountText: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-indigo-500"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Leave empty to auto-format as ${Number(productForm.discountPrice || 0).toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Check Details Button / Text
                    </label>
                    <input
                      type="text"
                      placeholder="Check Details"
                      value={productForm.checkDetailsText || 'Check Details'}
                      onChange={(e) => setProductForm({ ...productForm, checkDetailsText: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-indigo-500"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Default: "Check Details"
                    </p>
                  </div>
                </div>

                {/* Optional Custom Display Text */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Optional Custom Badge / Display Subtext
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Verified USA Price Drop, In Stock Now"
                    value={productForm.customDisplayText || ''}
                    onChange={(e) => setProductForm({ ...productForm, customDisplayText: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-hidden"
                  />
                </div>

                {/* Explicit toggles for Show Amount and Show Check Details */}
                <div className="flex flex-wrap items-center gap-5 pt-2 border-t border-slate-700/80">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.showAmount !== false && productForm.displayMode !== 'checkDetails'}
                      onChange={(e) => setProductForm({ 
                        ...productForm, 
                        showAmount: e.target.checked,
                        displayMode: e.target.checked ? 'amount' : 'checkDetails'
                      })}
                      className="accent-indigo-600 rounded"
                    />
                    <span>Show Amount ON/OFF</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.showCheckDetails === true || productForm.displayMode === 'checkDetails'}
                      onChange={(e) => setProductForm({ 
                        ...productForm, 
                        showCheckDetails: e.target.checked,
                        displayMode: e.target.checked ? 'checkDetails' : 'amount'
                      })}
                      className="accent-cyan-500 rounded"
                    />
                    <span>Show Check Details ON/OFF</span>
                  </label>
                </div>
              </div>

              {/* ================= 5 & 8. THREE PRODUCT ACTION LINKS ================= */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-indigo-400" />
                    <span className="font-heading font-bold text-xs uppercase tracking-wider text-indigo-300">
                      Three Product Action Links (Amazon, Walmart, Video View)
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Configurable URLs & Labels
                  </span>
                </div>

                {/* 1. Amazon Link */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <ShoppingCart className="w-3.5 h-3.5" />
                      1. Check Amazon Action
                    </span>
                    <label className="flex items-center gap-1.5 text-xs text-slate-300 font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.showAmazonButton !== false}
                        onChange={(e) => setProductForm({ ...productForm, showAmazonButton: e.target.checked })}
                        className="accent-amber-500 rounded"
                      />
                      <span>Enable Button</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Amazon Product / Affiliate URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://amazon.com/dp/B00... or affiliate link"
                        value={productForm.amazonUrl || ''}
                        onChange={(e) => setProductForm({ ...productForm, amazonUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-amber-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Button Label Text
                      </label>
                      <input
                        type="text"
                        placeholder="Check Amazon"
                        value={productForm.amazonButtonText || 'Check Amazon'}
                        onChange={(e) => setProductForm({ ...productForm, amazonButtonText: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Walmart Link */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      2. Check Walmart Action
                    </span>
                    <label className="flex items-center gap-1.5 text-xs text-slate-300 font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.showWalmartButton !== false}
                        onChange={(e) => setProductForm({ ...productForm, showWalmartButton: e.target.checked })}
                        className="accent-blue-500 rounded"
                      />
                      <span>Enable Button</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Walmart Product / Deal URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://walmart.com/ip/... (leave empty if none)"
                        value={productForm.walmartUrl || ''}
                        onChange={(e) => setProductForm({ ...productForm, walmartUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Button Label Text
                      </label>
                      <input
                        type="text"
                        placeholder="Check Walmart"
                        value={productForm.walmartButtonText || 'Check Walmart'}
                        onChange={(e) => setProductForm({ ...productForm, walmartButtonText: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Video View Link */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5 fill-current" />
                      3. Video View Action (YouTube, Vimeo, TikTok, Facebook, etc.)
                    </span>
                    <label className="flex items-center gap-1.5 text-xs text-slate-300 font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.showVideoButton !== false}
                        onChange={(e) => setProductForm({ ...productForm, showVideoButton: e.target.checked })}
                        className="accent-rose-500 rounded"
                      />
                      <span>Enable Button</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Video Review / Demo URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://youtube.com/watch?v=... or TikTok/Vimeo"
                        value={productForm.videoUrl || ''}
                        onChange={(e) => setProductForm({ ...productForm, videoUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden focus:border-rose-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Button Label Text
                      </label>
                      <input
                        type="text"
                        placeholder="Video View"
                        value={productForm.videoButtonText || 'Video View'}
                        onChange={(e) => setProductForm({ ...productForm, videoButtonText: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= 7. PRODUCT-LEVEL VISIBILITY CONTROLS ================= */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                <div className="border-b border-slate-700 pb-2">
                  <span className="font-heading font-bold text-xs uppercase tracking-wider text-emerald-400">
                    Product-Level Element Visibility Controls
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Independently toggle visibility of each element on the public product card and details page.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={productForm.showImage !== false}
                      onChange={(e) => setProductForm({ ...productForm, showImage: e.target.checked })}
                      className="accent-indigo-600 rounded"
                    />
                    <span>Product Image</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={productForm.showTitle !== false}
                      onChange={(e) => setProductForm({ ...productForm, showTitle: e.target.checked })}
                      className="accent-indigo-600 rounded"
                    />
                    <span>Product Title</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={productForm.showDescription !== false}
                      onChange={(e) => setProductForm({ ...productForm, showDescription: e.target.checked })}
                      className="accent-indigo-600 rounded"
                    />
                    <span>Description</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={productForm.showAmount !== false}
                      onChange={(e) => setProductForm({ ...productForm, showAmount: e.target.checked })}
                      className="accent-indigo-600 rounded"
                    />
                    <span>Amount/Value</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={!!productForm.showCheckDetails}
                      onChange={(e) => setProductForm({ ...productForm, showCheckDetails: e.target.checked })}
                      className="accent-indigo-600 rounded"
                    />
                    <span>Check Details</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={productForm.showAmazonButton !== false}
                      onChange={(e) => setProductForm({ ...productForm, showAmazonButton: e.target.checked })}
                      className="accent-amber-500 rounded"
                    />
                    <span>Check Amazon</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={productForm.showWalmartButton !== false}
                      onChange={(e) => setProductForm({ ...productForm, showWalmartButton: e.target.checked })}
                      className="accent-blue-500 rounded"
                    />
                    <span>Check Walmart</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={productForm.showVideoButton !== false}
                      onChange={(e) => setProductForm({ ...productForm, showVideoButton: e.target.checked })}
                      className="accent-rose-500 rounded"
                    />
                    <span>Video View</span>
                  </label>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!productForm.isDeal}
                    onChange={(e) => setProductForm({ ...productForm, isDeal: e.target.checked })}
                    className="accent-red-600 rounded"
                  />
                  <span>Mark as Deal</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="accent-indigo-600 rounded"
                  />
                  <span>Mark as Featured</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!productForm.isTrending}
                    onChange={(e) => setProductForm({ ...productForm, isTrending: e.target.checked })}
                    className="accent-amber-500 rounded"
                  />
                  <span>Mark as Trending</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!productForm.isNew}
                    onChange={(e) => setProductForm({ ...productForm, isNew: e.target.checked })}
                    className="accent-emerald-500 rounded"
                  />
                  <span>Mark as New</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Product to Firestore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT OFFER CARD ================= */}
      {isOfferModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOfferModalOpen(false);
          }}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto text-white animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="font-heading font-black text-xl text-white">
                {editingOffer ? 'Edit Offer Card' : 'Create Offer Card'}
              </h2>
              <button 
                type="button"
                onClick={() => setIsOfferModalOpen(false)} 
                className="group p-2 rounded-xl bg-slate-800 hover:bg-rose-950/70 text-slate-400 hover:text-rose-300 border border-slate-700/80 hover:border-rose-700/80 transition-all cursor-pointer active:scale-90"
                title="Close modal (ESC)"
              >
                <X className="w-5 h-5 stroke-[2.5] transition-transform group-hover:rotate-90 duration-200" />
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Offer Title *</label>
                <input
                  type="text"
                  required
                  value={offerForm.title}
                  onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Badge</label>
                  <select
                    value={offerForm.badge}
                    onChange={(e) => setOfferForm({ ...offerForm, badge: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden cursor-pointer"
                  >
                    <option value="HOT DEAL">HOT DEAL</option>
                    <option value="LIMITED OFFER">LIMITED OFFER</option>
                    <option value="CPA OFFER">CPA OFFER</option>
                    <option value="EXCLUSIVE">EXCLUSIVE</option>
                    <option value="NEW">NEW</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Discount Tag *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 40% OFF or Save $350"
                    value={offerForm.discount}
                    onChange={(e) => setOfferForm({ ...offerForm, discount: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    value={offerForm.originalPrice}
                    onChange={(e) => setOfferForm({ ...offerForm, originalPrice: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Offer Price ($)</label>
                  <input
                    type="number"
                    value={offerForm.offerPrice}
                    onChange={(e) => setOfferForm({ ...offerForm, offerPrice: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={offerForm.image}
                  onChange={(e) => setOfferForm({ ...offerForm, image: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Affiliate Deal URL *</label>
                <input
                  type="url"
                  required
                  value={offerForm.affiliateUrl}
                  onChange={(e) => setOfferForm({ ...offerForm, affiliateUrl: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={offerForm.description}
                  onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="offerActive"
                  checked={offerForm.isActive !== false}
                  onChange={(e) => setOfferForm({ ...offerForm, isActive: e.target.checked })}
                  className="accent-amber-400"
                />
                <label htmlFor="offerActive" className="text-xs font-bold text-slate-300">
                  Publish Active on Storefront
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer"
                >
                  Save Offer Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT BANNER (IMAGE & AD CODING SYSTEM) ================= */}
      {isAdModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAdModalOpen(false);
          }}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 text-white my-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading font-black text-xl text-white">
                    {editingAd ? 'Edit Banner Advertisement' : 'Create Banner / Ad Code'}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Deploy image banners or custom ad codes (Google AdSense, Amazon, HTML, iFrame)
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsAdModalOpen(false)} 
                className="group p-2 rounded-xl bg-slate-800 hover:bg-rose-950/70 text-slate-400 hover:text-rose-300 border border-slate-700/80 hover:border-rose-700/80 transition-all cursor-pointer active:scale-90"
                title="Close modal (ESC)"
              >
                <X className="w-5 h-5 stroke-[2.5] transition-transform group-hover:rotate-90 duration-200" />
              </button>
            </div>

            {/* Ad Mode Selector (Image vs Custom Ad Code) */}
            <div className="mt-4 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAdForm({ ...adForm, adType: 'image' })}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  adForm.adType !== 'code'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🖼️ Image & Link Banner</span>
              </button>

              <button
                type="button"
                onClick={() => setAdForm({ ...adForm, adType: 'code' })}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  adForm.adType === 'code'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="w-4 h-4" />
                <span>💻 Custom Ad Code / Embed</span>
              </button>
            </div>

            <form onSubmit={handleSaveAd} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Banner / Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fall Tech Blowout 50% Off"
                  value={adForm.title}
                  onChange={(e) => setAdForm({ ...adForm, title: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Placement Location *
                  </label>
                  <select
                    value={adForm.placement}
                    onChange={(e) => setAdForm({ ...adForm, placement: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden cursor-pointer"
                  >
                    <option value="homepage_top">Homepage Top (Primary Hero Banner)</option>
                    <option value="homepage_middle">Homepage Middle (Category Highlights)</option>
                    <option value="between_sections">Between Sections (Sponsored Deals)</option>
                    <option value="bottom_listings">Bottom of Listings (Exit Intent Banner)</option>
                    <option value="sidebar">Sidebar (Vertical Display)</option>
                    <option value="footer">Footer Banner (Pre-footer Promo)</option>
                    <option value="product_details">Product View Details Page (Modal & Details View)</option>
                  </select>
                </div>

                {adForm.adType === 'code' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Ad Dimensions
                    </label>
                    <select
                      value={adForm.adDimensions || 'responsive'}
                      onChange={(e) => setAdForm({ ...adForm, adDimensions: e.target.value as any })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden cursor-pointer font-mono"
                    >
                      <option value="responsive">Responsive (Full Width Adaptable)</option>
                      <option value="728x90">Leaderboard (728 × 90 px)</option>
                      <option value="970x250">Billboard / Super Leaderboard (970 × 250 px)</option>
                      <option value="300x250">Medium Rectangle (300 × 250 px)</option>
                      <option value="320x100">Mobile Large Banner (320 × 100 px)</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      CTA Button Text
                    </label>
                    <input
                      type="text"
                      placeholder="Shop Now / View Deal"
                      value={adForm.ctaText}
                      onChange={(e) => setAdForm({ ...adForm, ctaText: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                    />
                  </div>
                )}
              </div>

              {/* Conditional Fields: Custom Ad Code System */}
              {adForm.adType === 'code' ? (
                <div className="space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-indigo-900/60">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-amber-400" />
                      Banner Ad Coding System
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Click below to insert sample code:
                    </span>
                  </div>

                  {/* Preset Template Buttons */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {AD_CODE_TEMPLATES.map((tpl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAdForm({
                            ...adForm,
                            customCode: tpl.code,
                            adDimensions: tpl.dimensions as any,
                          });
                          addToast(`Inserted template: ${tpl.name}`, 'info');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-indigo-950/70 border border-indigo-800 hover:border-amber-400 text-indigo-200 text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <FileCode className="w-3 h-3 text-amber-400" />
                        <span>{tpl.name}</span>
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1 mt-2">
                      Ad Embed Code (HTML / JavaScript / iFrame / AdSense) *
                    </label>
                    <textarea
                      rows={6}
                      required
                      placeholder="Paste your ad embed code, Google AdSense <ins> or <script>, Amazon banner iframe, or HTML banner snippet here..."
                      value={adForm.customCode || ''}
                      onChange={(e) => setAdForm({ ...adForm, customCode: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 text-xs font-mono focus:outline-hidden leading-relaxed"
                    />
                  </div>

                  {/* Live Real-Time Code Preview Box */}
                  <div className="mt-3 pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                      <span className="font-semibold text-slate-300">Live Ad Preview:</span>
                      <span className="font-mono text-amber-400 text-[10px]">
                        {adForm.adDimensions || 'responsive'}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 min-h-[80px] flex items-center justify-center">
                      <AdCodeRenderer
                        code={adForm.customCode || ''}
                        adDimensions={adForm.adDimensions}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Standard Image Banner Inputs */
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Banner Image URL *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/..."
                      value={adForm.imageUrl}
                      onChange={(e) => setAdForm({ ...adForm, imageUrl: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Destination Target / Affiliate URL *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://takezon.com/deal or affiliate link"
                      value={adForm.targetUrl}
                      onChange={(e) => setAdForm({ ...adForm, targetUrl: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Subtitle / Promo Text
                    </label>
                    <input
                      type="text"
                      placeholder="Special discount available for limited time"
                      value={adForm.subtitle}
                      onChange={(e) => setAdForm({ ...adForm, subtitle: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="adActive"
                  checked={adForm.isActive !== false}
                  onChange={(e) => setAdForm({ ...adForm, isActive: e.target.checked })}
                  className="accent-emerald-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="adActive" className="text-xs font-bold text-slate-300 cursor-pointer">
                  Enable Advertisement on Website
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  Save Advertisement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT CATEGORY ================= */}
      {isCategoryModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsCategoryModalOpen(false);
          }}
        >
          <div 
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="font-heading font-black text-xl text-white">Edit Category Details</h2>
              <button 
                type="button"
                onClick={() => setIsCategoryModalOpen(false)} 
                className="group p-2 rounded-xl bg-slate-800 hover:bg-rose-950/70 text-slate-400 hover:text-rose-300 border border-slate-700/80 hover:border-rose-700/80 transition-all cursor-pointer active:scale-90"
                title="Close modal (ESC)"
              >
                <X className="w-5 h-5 stroke-[2.5] transition-transform group-hover:rotate-90 duration-200" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Banner Image URL</label>
                <input
                  type="url"
                  required
                  value={categoryForm.image}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="catEnabled"
                  checked={categoryForm.enabled !== false}
                  onChange={(e) => setCategoryForm({ ...categoryForm, enabled: e.target.checked })}
                  className="accent-indigo-600"
                />
                <label htmlFor="catEnabled" className="text-xs font-bold text-slate-300">
                  Visible in Top Navigation & Storefront
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: IN-APP CONFIRM DELETE (REPLACES BLOCKED WINDOW.CONFIRM) ================= */}
      {itemToDelete && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setItemToDelete(null);
          }}
        >
          <div 
            className="bg-slate-900 border border-rose-800/80 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-950 border border-rose-700 flex items-center justify-center text-rose-400 shrink-0 shadow-lg shadow-rose-900/40">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-lg text-white">
                    Confirm Deletion
                  </h3>
                  <p className="text-xs text-rose-300 font-medium">
                    This item will be permanently removed from Firestore and the live website.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="group p-2 rounded-xl bg-slate-800 hover:bg-rose-950/70 text-slate-400 hover:text-rose-300 border border-slate-700/80 hover:border-rose-700/80 transition-all cursor-pointer active:scale-90"
                title="Cancel (ESC)"
              >
                <X className="w-5 h-5 stroke-[2.5] transition-transform group-hover:rotate-90 duration-200" />
              </button>
            </div>

            <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
              <p>Are you sure you want to permanently delete this item? This action cannot be undone.</p>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold break-words text-sm">
                &ldquo;{itemToDelete.name}&rdquo;
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Item Type:</span>
                <span className="uppercase font-mono text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-400/10">
                  {itemToDelete.type}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer active:scale-95 border border-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-xs font-bold transition-all shadow-lg shadow-rose-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? 'Deleting...' : 'Delete Permanently'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
