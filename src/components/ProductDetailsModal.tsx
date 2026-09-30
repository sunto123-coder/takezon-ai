import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { 
  X, 
  Star, 
  ExternalLink, 
  ShieldCheck, 
  Check, 
  Truck, 
  RotateCcw, 
  Sparkles, 
  Share2, 
  Heart,
  Tag,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { ProductCard } from './ProductCard';

export const ProductDetailsModal: React.FC = () => {
  const { 
    selectedProduct, 
    closeProductModal,
    navigateTo, 
    handleAffiliateClick, 
    products, 
    categories, 
    addToast 
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Close on Escape key press
  useEffect(() => {
    if (!selectedProduct) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeProductModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProduct, closeProductModal]);

  if (!selectedProduct) return null;

  const product = selectedProduct;
  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80'];

  const categoryObj = categories.find(c => c.slug === product.category);

  // Related products from the same category
  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const handleCta = () => {
    const url = product.affiliateUrl || product.productUrl;
    handleAffiliateClick(url, product.name);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this deal on TakeZon: ${product.name}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Product link copied to clipboard!', 'success');
    }
  };

  const hasSavings = product.originalPrice > product.discountPrice;
  const savings = hasSavings ? (product.originalPrice - product.discountPrice).toFixed(2) : 0;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md p-2.5 sm:p-6 lg:p-10 flex items-center justify-center animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeProductModal();
        }
      }}
    >
      <div 
        className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden my-3 sm:my-8 max-h-[94vh] flex flex-col border border-slate-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky modal header with smooth navigation */}
        <div className="flex items-center justify-between px-3.5 sm:px-6 py-3 border-b border-slate-100 bg-white/95 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Soft Back Button */}
            <button
              type="button"
              onClick={closeProductModal}
              className="group inline-flex items-center gap-1.5 h-10 px-3 sm:px-3.5 rounded-xl bg-slate-100 hover:bg-indigo-50 active:bg-indigo-100 text-slate-700 hover:text-indigo-600 font-bold text-xs transition-all duration-200 active:scale-95 cursor-pointer border border-slate-200/90 hover:border-indigo-300 shadow-xs"
              title="Go back (ফিরে যান / ESC)"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-indigo-600" />
              <span>Back (ফিরে যান)</span>
            </button>

            {/* Breadcrumb path */}
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <button 
                type="button"
                onClick={() => {
                  closeProductModal();
                  navigateTo('category', product.category);
                }}
                className="text-indigo-600 font-semibold hover:underline cursor-pointer"
              >
                {categoryObj?.name || product.category}
              </button>
              <span className="text-slate-300">/</span>
              <span className="text-slate-500 font-medium truncate max-w-xs sm:max-w-md">
                {product.name}
              </span>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="h-10 px-3 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100/70 hover:bg-slate-200/80 active:bg-slate-300 border border-slate-200/80 transition-all duration-200 active:scale-95 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Share deal"
            >
              <Share2 className="w-4 h-4 text-slate-600" />
              <span className="hidden md:inline">Share</span>
            </button>

            {/* Soft Smooth Cross (X) Close Button */}
            <button
              type="button"
              onClick={closeProductModal}
              className="group inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 hover:text-rose-800 border border-rose-200 hover:border-rose-300 transition-all duration-200 active:scale-90 cursor-pointer shadow-xs font-bold text-xs"
              title="Close window (বন্ধ করুন / ESC)"
              aria-label="Close"
            >
              <X className="w-4 h-4 stroke-[2.5] transition-transform group-hover:rotate-90 duration-200" />
              <span>Close (বন্ধ)</span>
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Product Images Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative pt-[80%] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={images[activeImageIndex] || images[0]}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
                />
                {product.discountPercentage > 0 && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white font-black text-xs px-3 py-1.5 rounded-lg shadow-md">
                    SAVE {product.discountPercentage}%
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                        activeImageIndex === idx 
                          ? 'border-indigo-600 ring-2 ring-indigo-200 scale-102' 
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* USA Guarantee Badges */}
              <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Truck className="w-4 h-4 mx-auto text-indigo-600 mb-1" />
                  <span className="font-semibold block text-slate-900">USA Verified</span>
                  <span className="text-[10px] text-slate-500">Fast Shipping</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <ShieldCheck className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
                  <span className="font-semibold block text-slate-900">Authentic</span>
                  <span className="text-[10px] text-slate-500">Direct From Partner</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <RotateCcw className="w-4 h-4 mx-auto text-amber-600 mb-1" />
                  <span className="font-semibold block text-slate-900">Warranty</span>
                  <span className="text-[10px] text-slate-500">Full Coverage</span>
                </div>
              </div>
            </div>

            {/* Right: Information, Pricing, CTA */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-extrabold text-indigo-600 uppercase tracking-widest">
                    {product.brand}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {product.availability}
                  </span>
                </div>

                <h1 className="font-heading font-black text-2xl sm:text-3xl text-slate-950 leading-tight">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-900">{product.rating}</span>
                  <span className="text-xs text-slate-500">({product.reviewCount} customer reviews)</span>
                </div>
              </div>

              {/* Pricing box */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-heading font-black text-slate-950">
                    ${product.discountPrice.toFixed(2)}
                  </span>
                  {hasSavings && (
                    <span className="text-base text-slate-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  {hasSavings && (
                    <span className="px-2.5 py-1 rounded-md text-xs font-black bg-emerald-600 text-white">
                      Save ${savings} ({product.discountPercentage}%)
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Price verified across authorized US dealers. Deal subject to stock and retailer terms.
                </p>
              </div>

              {/* Action buttons (Primary CTA + Soft Close Button) */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleCta}
                  className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-base shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer transform hover:scale-[1.01] active:scale-98"
                >
                  <span>{product.ctaText || 'View Deal at Verified Seller'}</span>
                  <ExternalLink className="w-5 h-5" />
                </button>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={closeProductModal}
                    className="w-full py-3.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 hover:text-slate-950 font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-slate-200/90 active:scale-98 shadow-xs"
                  >
                    <ArrowLeft className="w-4 h-4 text-indigo-600" />
                    <span>Return to Browsing (পেজে ফিরে যান)</span>
                  </button>
                </div>

                <p className="text-[11px] text-center text-slate-500">
                  Secure checkout directly on the authorized retailer’s official store.
                </p>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">
                  Product Overview
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {product.fullDescription || product.shortDescription}
                </p>
              </div>

              {/* Key Features checklist */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2.5">
                    Key Highlights
                  </h3>
                  <ul className="space-y-2">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specifications Table */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div>
                  <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2.5">
                    Technical Specifications
                  </h3>
                  <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
                    {Object.entries(product.specs).map(([key, val], idx) => (
                      <div 
                        key={key} 
                        className={`flex justify-between p-2.5 ${idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}
                      >
                        <span className="font-semibold text-slate-700">{key}</span>
                        <span className="text-slate-600 text-right">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 text-slate-600 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Affiliate Disclosure Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 leading-relaxed">
                <span className="font-bold text-slate-700 block mb-0.5">
                  USA Affiliate Disclosure
                </span>
                TakeZon participates in merchant referral programs. When you click through our partner links and make a purchase, we may receive an affiliate commission at zero additional cost to you.
              </div>
            </div>
          </div>

          {/* Related Category Deals */}
          {relatedProducts.length > 0 && (
            <div className="pt-8 border-t border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-heading font-black text-xl text-slate-950">
                    Related {categoryObj?.name || 'Category'} Deals
                  </h3>
                  <p className="text-xs text-slate-500">
                    Discover comparable products curated from our USA database.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {relatedProducts.map((rel) => (
                  <ProductCard key={rel.id} product={rel} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

