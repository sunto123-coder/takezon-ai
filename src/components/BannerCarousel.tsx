import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { AdPlacement, Advertisement } from '../types';
import { ChevronLeft, ChevronRight, ExternalLink, Sparkles, Code2 } from 'lucide-react';
import { AdCodeRenderer } from './AdCodeRenderer';

interface BannerCarouselProps {
  placement: AdPlacement;
  className?: string;
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({ placement, className = '' }) => {
  const { advertisements, handleAffiliateClick } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter active banners for this placement
  const activeBanners = advertisements.filter(
    (ad) => ad.placement === placement && ad.isActive !== false
  );

  // Auto-rotation timer if multiple banners
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const currentBanner = activeBanners[currentIndex] || activeBanners[0];
  const isCustomCodeAd = currentBanner.adType === 'code' || (!!currentBanner.customCode && currentBanner.customCode.trim().length > 0);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleBannerClick = () => {
    if (currentBanner.targetUrl && !isCustomCodeAd) {
      handleAffiliateClick(currentBanner.targetUrl, currentBanner.title);
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-md border border-slate-200/80 bg-slate-900 text-white ${className}`}>
      {/* If this is a custom ad code banner (AdSense, Affiliate embed, Script, HTML) */}
      {isCustomCodeAd ? (
        <div className="relative p-2 sm:p-4 bg-slate-950/90 flex flex-col items-center justify-center min-h-[140px]">
          <div className="w-full flex items-center justify-between px-2 mb-2 text-[10px] text-slate-400 border-b border-slate-800 pb-1">
            <span className="flex items-center gap-1 font-mono text-amber-400">
              <Code2 className="w-3 h-3" />
              <span>{currentBanner.title || 'Sponsored Advertisement'}</span>
            </span>
            <span className="uppercase tracking-wider font-semibold text-slate-500">Sponsored</span>
          </div>

          <AdCodeRenderer 
            code={currentBanner.customCode || ''} 
            adDimensions={currentBanner.adDimensions}
            className="w-full"
          />

          {/* Navigation arrows if multiple */}
          {activeBanners.length > 1 && (
            <div className="flex items-center justify-between w-full px-2 mt-2 pt-1 border-t border-slate-800 text-xs">
              <button
                onClick={handlePrev}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3 h-3" /> Prev Ad
              </button>
              <div className="flex items-center gap-1">
                {activeBanners.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentIndex ? 'w-4 bg-amber-400' : 'w-1.5 bg-slate-700'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 cursor-pointer"
              >
                Next Ad <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Standard Visual Banner */
        <div 
          onClick={handleBannerClick}
          className="relative min-h-[160px] sm:min-h-[220px] md:min-h-[260px] w-full flex items-center p-6 sm:p-10 cursor-pointer group"
        >
          <img
            src={currentBanner.imageUrl}
            alt={currentBanner.title}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-40 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

          {/* Content text */}
          <div className="relative z-10 max-w-2xl">
            {currentBanner.badgeText && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase bg-amber-400 text-slate-950 mb-3 shadow-md">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                {currentBanner.badgeText}
              </span>
            )}

            <h3 className="font-heading font-black text-xl sm:text-2xl md:text-3xl text-white tracking-tight leading-tight group-hover:text-amber-300 transition-colors">
              {currentBanner.title}
            </h3>

            {currentBanner.subtitle && (
              <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl line-clamp-2">
                {currentBanner.subtitle}
              </p>
            )}

            <div className="mt-4 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-950 text-xs sm:text-sm font-bold shadow-lg group-hover:bg-amber-400 transition-colors">
                <span>{currentBanner.ctaText || 'Check Deal'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Verified Partner
              </span>
            </div>
          </div>

          {/* Navigation arrows if multiple */}
          {activeBanners.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur-xs transition-all border border-slate-700 z-20"
                aria-label="Previous banner"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur-xs transition-all border border-slate-700 z-20"
                aria-label="Next banner"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Pagination dots */}
              <div className="absolute bottom-3 right-6 z-20 flex items-center gap-1.5">
                {activeBanners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentIndex ? 'w-6 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
