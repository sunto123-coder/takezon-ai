import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { OfferCard } from '../types';
import { Flame, Clock, ExternalLink, ShieldCheck, Tag, Sparkles } from 'lucide-react';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function calculateTimeLeft(targetDateStr: string): CountdownTime {
  const difference = +new Date(targetDateStr) - +new Date();
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isExpired: false,
  };
}

const SingleOfferCard: React.FC<{ offer: OfferCard }> = ({ offer }) => {
  const { handleAffiliateClick } = useStore();
  const [timeLeft, setTimeLeft] = useState<CountdownTime>(calculateTimeLeft(offer.expirationDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(offer.expirationDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [offer.expirationDate]);

  const handleClaim = () => {
    handleAffiliateClick(offer.affiliateUrl, offer.title);
  };

  const getBadgeStyle = (badge: string) => {
    switch (badge.toUpperCase()) {
      case 'HOT DEAL':
        return 'bg-red-600 text-white shadow-red-500/20';
      case 'LIMITED OFFER':
        return 'bg-amber-500 text-slate-950 shadow-amber-500/20';
      case 'CPA OFFER':
        return 'bg-indigo-600 text-white shadow-indigo-500/20';
      case 'EXCLUSIVE':
        return 'bg-purple-600 text-white shadow-purple-500/20';
      default:
        return 'bg-emerald-600 text-white shadow-emerald-500/20';
    }
  };

  return (
    <div className="relative bg-white rounded-3xl border border-slate-200/90 hover:border-amber-400 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Top Media / Visual header */}
      <div className="relative pt-[55%] w-full bg-slate-950 overflow-hidden">
        <img
          src={offer.image}
          alt={offer.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Badge & Discount highlight */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md ${getBadgeStyle(offer.badge)}`}>
            {offer.badge}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 shadow-md">
            {offer.discount}
          </span>
        </div>

        {/* Live Countdown timer overlay */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/60 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            {timeLeft.isExpired ? (
              <span className="text-rose-400 font-bold">Offer Expired</span>
            ) : (
              <span>
                {timeLeft.days}d {timeLeft.hours.toString().padStart(2, '0')}h {timeLeft.minutes.toString().padStart(2, '0')}m {timeLeft.seconds.toString().padStart(2, '0')}s
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-300 font-medium bg-black/40 px-2 py-0.5 rounded">
            USA Verified
          </span>
        </div>
      </div>

      {/* Offer content details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-heading font-black text-lg text-slate-950 group-hover:text-amber-600 transition-colors leading-snug">
            {offer.title}
          </h3>

          {offer.subtitle && (
            <p className="text-xs font-semibold text-indigo-600 mt-1">
              {offer.subtitle}
            </p>
          )}

          <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
            {offer.description}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          {offer.offerPrice ? (
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-heading font-black text-slate-950">
                  ${offer.offerPrice.toFixed(2)}
                </span>
                {offer.originalPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    ${offer.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase">
                Guaranteed Price
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
              <Sparkles className="w-4 h-4" />
              <span>Special Promo</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleClaim}
            disabled={timeLeft.isExpired}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all duration-150 cursor-pointer ${
              timeLeft.isExpired
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-slate-950 hover:text-white text-slate-950 active:scale-95'
            }`}
          >
            <span>{offer.ctaButtonText || 'Claim Offer'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const OfferCardsSection: React.FC<{ limit?: number; showHeader?: boolean }> = ({ 
  limit, 
  showHeader = true 
}) => {
  const { offers } = useStore();
  const [filterBadge, setFilterBadge] = useState<string>('all');

  const activeOffers = offers.filter((o) => o.isActive !== false);

  const badges = ['all', ...Array.from(new Set(activeOffers.map((o) => o.badge)))];

  const filteredOffers = filterBadge === 'all' 
    ? activeOffers 
    : activeOffers.filter((o) => o.badge.toLowerCase() === filterBadge.toLowerCase());

  const displayedOffers = limit ? filteredOffers.slice(0, limit) : filteredOffers;

  if (activeOffers.length === 0) return null;

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {showHeader && (
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-500 text-xs font-extrabold uppercase tracking-widest mb-1.5">
              <Flame className="w-4 h-4 animate-pulse fill-current" />
              <span>Exclusive Promotion Vault</span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-950 tracking-tight">
              Featured Offer Cards & Special Deals
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              Limited-time discounts, CPA coupons, and manufacturer rebates verified across top USA retailers.
            </p>
          </div>

          {/* Filter badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            {badges.map((b) => (
              <button
                type="button"
                key={b}
                onClick={() => setFilterBadge(b)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer active:scale-95 ${
                  filterBadge === b
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {b === 'all' ? 'All Offers' : b}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedOffers.map((offer) => (
          <SingleOfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </section>
  );
};
