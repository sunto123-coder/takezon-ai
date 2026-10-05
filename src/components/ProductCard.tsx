import React from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { 
  Star, 
  ExternalLink, 
  Flame, 
  Eye, 
  Play, 
  ShoppingCart,
  Sparkles
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateTo, handleAffiliateClick } = useStore();

  const handleCardClick = () => {
    navigateTo('product', undefined, product);
  };

  const amazonUrl = (product.amazonUrl && product.amazonUrl.trim().length > 0)
    ? product.amazonUrl
    : (product.affiliateUrl || product.productUrl || `https://www.amazon.com/s?k=${encodeURIComponent(product.name)}&tag=takezon-20`);

  const walmartUrl = (product.walmartUrl && product.walmartUrl.trim().length > 0)
    ? product.walmartUrl
    : `https://www.walmart.com/search?q=${encodeURIComponent(product.name)}`;

  const videoUrl = (product.videoUrl && product.videoUrl.trim().length > 0)
    ? product.videoUrl
    : `https://www.youtube.com/results?search_query=${encodeURIComponent(product.name + ' review')}`;

  const handleAmazonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleAffiliateClick(amazonUrl, `${product.name} (Amazon)`);
  };

  const handleWalmartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleAffiliateClick(walmartUrl, `${product.name} (Walmart)`);
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(videoUrl, '_blank', 'noopener,noreferrer');
  };

  const hasSavings = product.originalPrice > product.discountPrice;
  const savingsAmount = hasSavings ? (product.originalPrice - product.discountPrice).toFixed(2) : 0;

  // Visibility checks
  const showImage = product.showImage !== false;
  const showTitle = product.showTitle !== false;
  const showDescription = product.showDescription !== false;
  const isCheckDetailsMode = product.displayMode === 'checkDetails';
  const showAmount = product.showAmount !== false && !isCheckDetailsMode;
  const showCheckDetails = product.showCheckDetails === true || isCheckDetailsMode;

  // Action links checks: reflect the toggle switches directly so all enabled buttons are visible!
  const canShowAmazon = product.showAmazonButton !== false;
  const canShowWalmart = product.showWalmartButton !== false;
  const canShowVideo = product.showVideoButton !== false;

  const activeButtonsCount = (canShowAmazon ? 1 : 0) + (canShowWalmart ? 1 : 0) + (canShowVideo ? 1 : 0);

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

        {showAmount && product.discountPercentage > 0 && (
          <span className="px-2 py-0.5 rounded-md text-xs font-black bg-emerald-600 text-white shadow-sm">
            -{product.discountPercentage}%
          </span>
        )}
      </div>

      {/* Product Image Area */}
      {showImage && (
        <div className="relative pt-[75%] w-full bg-slate-100 overflow-hidden">
          <img
            src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80'}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={(e) => {
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
      )}

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
          {showTitle && (
            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
              {product.name}
            </h3>
          )}

          {/* Short description */}
          {showDescription && product.shortDescription && (
            <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          {/* Optional Custom Display Text */}
          {product.customDisplayText && (
            <div className="mt-2 text-xs font-semibold text-indigo-600 bg-indigo-50/80 px-2.5 py-1 rounded-lg inline-block">
              {product.customDisplayText}
            </div>
          )}

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

        {/* Pricing / Check Details Presentation Area */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3 min-h-[32px]">
            {/* OPTION A: Show Amount */}
            {showAmount && (
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg sm:text-xl font-heading font-extrabold text-slate-950">
                    {product.amountText || `$${product.discountPrice.toFixed(2)}`}
                  </span>
                  {!product.amountText && hasSavings && (
                    <span className="text-xs text-slate-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                {!product.amountText && hasSavings && (
                  <span className="text-[10px] text-emerald-600 font-semibold block">
                    Save ${savingsAmount}
                  </span>
                )}
              </div>
            )}

            {/* OPTION B: Show Check Details presentation */}
            {showCheckDetails && (
              <button
                type="button"
                onClick={handleCardClick}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-indigo-700 hover:text-indigo-800 text-xs font-extrabold transition-colors cursor-pointer border border-slate-200/80 shadow-2xs"
              >
                <span>{product.checkDetailsText || 'Check Details'}</span>
                <Eye className="w-3.5 h-3.5" />
              </button>
            )}

            {/* If neither amount nor check details is enabled */}
            {!showAmount && !showCheckDetails && (
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Featured Product
              </span>
            )}
          </div>

          {/* Three Product Action Links (Amazon, Walmart, Video View) */}
          {activeButtonsCount > 0 && (
            <div className={`grid gap-1.5 ${
              activeButtonsCount === 1 
                ? 'grid-cols-1' 
                : activeButtonsCount === 2 
                  ? 'grid-cols-2' 
                  : 'grid-cols-3'
            }`}>
              {/* 1. Check Amazon */}
              {canShowAmazon && (
                <button
                  type="button"
                  onClick={handleAmazonClick}
                  className="w-full py-2 px-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-black flex items-center justify-center gap-1 shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer truncate"
                  title={product.amazonButtonText || 'Check Amazon'}
                >
                  <ShoppingCart className="w-3 h-3 shrink-0" />
                  <span className="truncate">{product.amazonButtonText || 'Check Amazon'}</span>
                </button>
              )}

              {/* 2. Check Walmart */}
              {canShowWalmart && (
                <button
                  type="button"
                  onClick={handleWalmartClick}
                  className="w-full py-2 px-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black flex items-center justify-center gap-1 shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer truncate"
                  title={product.walmartButtonText || 'Check Walmart'}
                >
                  <Sparkles className="w-3 h-3 shrink-0 text-amber-300" />
                  <span className="truncate">{product.walmartButtonText || 'Check Walmart'}</span>
                </button>
              )}

              {/* 3. Video View */}
              {canShowVideo && (
                <button
                  type="button"
                  onClick={handleVideoClick}
                  className="w-full py-2 px-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-black flex items-center justify-center gap-1 shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer truncate"
                  title={product.videoButtonText || 'Video View'}
                >
                  <Play className="w-3 h-3 shrink-0 fill-current" />
                  <span className="truncate">{product.videoButtonText || 'Video View'}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
