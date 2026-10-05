import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { 
  Category, 
  Product, 
  OfferCard, 
  Advertisement, 
  WebsiteSettings, 
  ContactMessage 
} from '../types';
import { 
  listenToProducts, 
  listenToCategories, 
  listenToOffers, 
  listenToAdvertisements, 
  listenToSettings, 
  listenToMessages,
  seedFirestoreIfEmpty,
  forceReseedCatalog,
  deleteProduct as fbDeleteProduct,
  deleteOffer as fbDeleteOffer,
  deleteAdvertisement as fbDeleteAd,
  deleteCategory as fbDeleteCat,
  deleteMessage as fbDeleteMsg
} from '../services/firebaseService';
import { 
  defaultCategories, 
  defaultProducts, 
  defaultOffers, 
  defaultAdvertisements, 
  defaultSettings,
  normalizeProduct,
  normalizeSettings
} from '../data/seedData';

export type ViewType = 'home' | 'category' | 'offers' | 'contact' | 'admin' | 'search' | 'product';

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface StoreContextType {
  products: Product[];
  categories: Category[];
  offers: OfferCard[];
  advertisements: Advertisement[];
  settings: WebsiteSettings;
  messages: ContactMessage[];
  loading: boolean;
  currentView: ViewType;
  selectedCategorySlug: string | null;
  selectedProduct: Product | null;
  searchQuery: string;
  sortBy: string;
  filterBadge: string | null;
  priceRange: [number, number];
  toasts: ToastNotification[];
  // Actions
  navigateTo: (view: ViewType, categorySlug?: string, product?: Product) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: string) => void;
  setFilterBadge: (badge: string | null) => void;
  setPriceRange: (range: [number, number]) => void;
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  handleAffiliateClick: (targetUrl: string, title: string) => void;
  reseedDatabase: () => Promise<void>;
  // Full CRUD Deletion Actions
  deleteProduct: (id: string) => Promise<void>;
  deleteOffer: (id: string) => Promise<void>;
  deleteAdvertisement: (id: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  // Navigation & Modal Controls
  closeProductModal: () => void;
  goBack: () => void;
  canGoBack: boolean;
}

const StoreContext = createContext<StoreContextType>({} as StoreContextType);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => defaultProducts.map(p => normalizeProduct(p)));
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [offers, setOffers] = useState<OfferCard[]>(defaultOffers);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>(defaultAdvertisements);
  const [settings, setSettings] = useState<WebsiteSettings>(() => normalizeSettings(defaultSettings));
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Navigation & Filter state
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [filterBadge, setFilterBadge] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);

  // History stack for back navigation
  const [historyStack, setHistoryStack] = useState<{ view: ViewType; categorySlug: string | null }[]>([
    { view: 'home', categorySlug: null }
  ]);

  // Toast system
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getDeletedIds = (key: string): Set<string> => {
    try {
      const raw = localStorage.getItem(`takezon_deleted_${key}`);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  };

  const addDeletedId = (key: string, id: string) => {
    try {
      const current = getDeletedIds(key);
      current.add(id);
      localStorage.setItem(`takezon_deleted_${key}`, JSON.stringify(Array.from(current)));
    } catch {}
  };

  // Setup Firestore synchronization
  useEffect(() => {
    // Check initial seed
    seedFirestoreIfEmpty();

    const unsubProducts = listenToProducts((data) => {
      const deleted = getDeletedIds('products');
      const normalized = data.map((p) => normalizeProduct(p));
      setProducts(normalized.filter((p) => !deleted.has(p.id)));
    });
    const unsubCategories = listenToCategories((data) => {
      const deleted = getDeletedIds('categories');
      setCategories(data.filter((c) => !deleted.has(c.id)));
    });
    const unsubOffers = listenToOffers((data) => {
      const deleted = getDeletedIds('offers');
      setOffers(data.filter((o) => !deleted.has(o.id)));
    });
    const unsubAds = listenToAdvertisements((data) => {
      const deleted = getDeletedIds('ads');
      setAdvertisements(data.filter((a) => !deleted.has(a.id)));
    });
    const unsubSettings = listenToSettings((data) => setSettings(normalizeSettings(data)));
    
    // Only subscribe to customer messages for authenticated admin to adhere to Firestore Security Rules
    let unsubMessages: (() => void) | null = null;
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      if (unsubMessages) {
        unsubMessages();
        unsubMessages = null;
      }
      if (currentUser) {
        unsubMessages = listenToMessages((data) => {
          const deleted = getDeletedIds('messages');
          setMessages(data.filter((m) => !deleted.has(m.id)));
        });
      } else {
        setMessages([]);
      }
    });

    setLoading(false);

    return () => {
      unsubProducts();
      unsubCategories();
      unsubOffers();
      unsubAds();
      unsubSettings();
      if (unsubMessages) unsubMessages();
      unsubAuth();
    };
  }, []);

  const deleteProduct = async (id: string) => {
    addDeletedId('products', id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await fbDeleteProduct(id);
    } catch (e) {
      console.warn('Firestore delete product notice:', e);
    }
  };

  const deleteOffer = async (id: string) => {
    addDeletedId('offers', id);
    setOffers((prev) => prev.filter((o) => o.id !== id));
    try {
      await fbDeleteOffer(id);
    } catch (e) {
      console.warn('Firestore delete offer notice:', e);
    }
  };

  const deleteAdvertisement = async (id: string) => {
    addDeletedId('ads', id);
    setAdvertisements((prev) => prev.filter((a) => a.id !== id));
    try {
      await fbDeleteAd(id);
    } catch (e) {
      console.warn('Firestore delete ad notice:', e);
    }
  };

  const deleteCategory = async (id: string) => {
    addDeletedId('categories', id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    try {
      await fbDeleteCat(id);
    } catch (e) {
      console.warn('Firestore delete category notice:', e);
    }
  };

  const deleteMessage = async (id: string) => {
    addDeletedId('messages', id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    try {
      await fbDeleteMsg(id);
    } catch (e) {
      console.warn('Firestore delete message notice:', e);
    }
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    try {
      if (window.history.state?.modal === 'product') {
        window.history.back();
      }
    } catch {}
  };

  const goBack = () => {
    // 1. If a modal is currently open, close it smoothly
    if (selectedProduct) {
      closeProductModal();
      return;
    }

    // 2. If we have a view in the history stack, go back to previous view
    if (historyStack.length > 1) {
      setHistoryStack((prev) => {
        const copy = [...prev];
        copy.pop(); // Remove current view
        const previous = copy[copy.length - 1];
        if (previous) {
          setCurrentView(previous.view);
          setSelectedCategorySlug(previous.categorySlug);
        } else {
          setCurrentView('home');
          setSelectedCategorySlug(null);
        }
        return copy;
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 3. Always default to home storefront smoothly
    setCurrentView('home');
    setSelectedCategorySlug(null);
    setSelectedProduct(null);
    setHistoryStack([{ view: 'home', categorySlug: null }]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Browser back button popstate listener
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (selectedProduct) {
        setSelectedProduct(null);
        return;
      }
      if (e.state?.view) {
        setCurrentView(e.state.view);
        setSelectedCategorySlug(e.state.categorySlug || null);
        return;
      }
      if (historyStack.length > 1) {
        goBack();
      } else if (currentView !== 'home') {
        setCurrentView('home');
        setSelectedCategorySlug(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedProduct, historyStack, currentView]);

  const navigateTo = (view: ViewType, categorySlug?: string, product?: Product) => {
    if (product !== undefined) {
      setSelectedProduct(product);
      try {
        window.history.pushState({ modal: 'product', id: product.id }, '');
      } catch {}
    } else {
      setSelectedProduct(null);
      setCurrentView(view);
      const targetCat = categorySlug !== undefined ? categorySlug : (view === 'category' ? selectedCategorySlug : null);
      if (categorySlug !== undefined) {
        setSelectedCategorySlug(categorySlug);
      }
      setHistoryStack((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.view === view && last.categorySlug === targetCat) {
          return prev;
        }
        return [...prev, { view, categorySlug: targetCat }];
      });
      try {
        window.history.pushState({ view, categorySlug: targetCat }, '');
      } catch {}
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAffiliateClick = (targetUrl: string, title: string) => {
    if (!targetUrl || !targetUrl.trim()) return;
    addToast(`Opening verified merchant deal: ${title.slice(0, 36)}...`, 'success');
    try {
      const a = document.createElement('a');
      a.href = targetUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      try {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      } catch (e) {
        console.warn('Could not open external link:', e);
      }
    }
  };

  const reseedDatabase = async () => {
    try {
      localStorage.removeItem('takezon_deleted_products');
      localStorage.removeItem('takezon_deleted_offers');
      localStorage.removeItem('takezon_deleted_ads');
      localStorage.removeItem('takezon_deleted_categories');
      localStorage.removeItem('takezon_deleted_messages');
      await forceReseedCatalog();
      addToast('Catalog database re-seeded successfully with fresh USA deals!', 'success');
    } catch (err: any) {
      addToast('Failed to reseed database: ' + err.message, 'error');
    }
  };

  return (
    <StoreContext.Provider value={{
      products,
      categories,
      offers,
      advertisements,
      settings,
      messages,
      loading,
      currentView,
      selectedCategorySlug,
      selectedProduct,
      searchQuery,
      sortBy,
      filterBadge,
      priceRange,
      toasts,
      navigateTo,
      setSearchQuery,
      setSortBy,
      setFilterBadge,
      setPriceRange,
      addToast,
      removeToast,
      handleAffiliateClick,
      reseedDatabase,
      deleteProduct,
      deleteOffer,
      deleteAdvertisement,
      deleteCategory,
      deleteMessage,
      closeProductModal,
      goBack,
      canGoBack: historyStack.length > 1 || !!selectedProduct || currentView !== 'home',
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
