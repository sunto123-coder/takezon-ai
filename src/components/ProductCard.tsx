import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Star, ExternalLink, ShieldCheck, Flame, Eye, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateTo, handleAffiliateClick } = useStore();

  const handleCtaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = product.affiliateUrl || product.productUrl;
    handleAffiliateClick(url, product.name);
  };

  const handleCardClick = () => {
    navigateTo('product', undefined, product);
  };

  const hasSavings = product.originalPrice > product.discountPrice;
  const savingsAmount = hasSavings ? (product.originalPrice - product.discountPrice).toFixed(2) : 0;

  return (
    <div 
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl border border-slate-200 hover:border-indigo-400/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer transform hover:-translate-y-1"
    >
      {/* Top Badges */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-wrap gap-1">
          {product.isDeal && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-red-600 text-white shadow-sm">
              <Flame className="w-3 h-3 fill-current" />
              Deal
            </span>
          )}
          {product.isTrending && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-400 text-slate-950 shadow-sm">
              Trending
            </span>
          )}
          {product.isNew && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-600 text-white shadow-sm">
              New
            </span>
          )}
        </div>

        {product.discountPercentage > 0 && (
          <span className="px-2 py-0.5 rounded-md text-xs font-black bg-emerald-600 text-white shadow-sm">
            -{product.discountPercentage}%
          </span>
        )}
      </div>

      {/* Product Image Area */}
      <div className="relative pt-[75%] w-full bg-slate-100 overflow-hidden">
        <img
          src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            // Fallback gracefully
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Hover overlay quick view button */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="px-3.5 py-1.5 rounded-full bg-white/95 text-slate-900 text-xs font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-xs transform translate-y-2 group-hover:translate-y-0 transition-all">
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            Quick View
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Stock */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-indigo-600 uppercase tracking-wider text-[11px]">
              {product.brand || 'Verified Brand'}
            </span>
            <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${
              product.availability === 'In Stock' 
                ? 'text-emerald-700' 
                : 'text-amber-700'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                product.availability === 'In Stock' ? 'bg-emerald-500' : 'bg-amber-500'
              }`} />
              {product.availability || 'In Stock'}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Ratings */}
          <div className="flex items-center gap-1.5 mt-2.5">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating || 5)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-200 fill-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-700">{product.rating ? product.rating.toFixed(1) : '4.8'}</span>
            <span className="text-xs text-slate-400">({product.reviewCount || 120})</span>
          </div>
        </div>

        {/* Price & CTA Button */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-heading font-extrabold text-slate-950">
                ${product.discountPrice.toFixed(2)}
              </span>
              {hasSavings && (
                <span className="text-xs text-slate-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {hasSavings && (
              <span className="text-[10px] text-emerald-600 font-semibold block">
                Save ${savingsAmount}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleCtaClick}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all duration-150 active:scale-95 cursor-pointer shrink-0"
            title={`Open deal on verified store`}
          >
            <span>{product.ctaText || 'View Deal'}</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
