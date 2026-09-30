import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Flame, 
  Cpu, 
  Camera, 
  Laptop, 
  Coffee, 
  Activity,
  Star
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { settings, navigateTo, products } = useStore();

  // Find high-impact deal for the hero card
  const heroDeal = products.find(p => p.isDeal && p.isFeatured) || products[0];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background radial glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline, Subtitle, CTA, Category pills */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-amber-400 text-xs font-bold tracking-wide backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>{settings.heroBadgeText || 'Verified USA Deals & Top Rated Tech'}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.08]">
              {settings.heroTitle || 'Discover Smart Products. Find Better Deals.'}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {settings.heroSubtitle || 'Explore trending gadgets, camera gear, PC accessories, kitchen products and fitness gear in one curated, USA-focused discovery platform.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById('featured-deals-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else navigateTo('offers');
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 group transition-all cursor-pointer"
              >
                <span>{settings.heroCtaText || 'Explore Products'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigateTo('offers')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 backdrop-blur-xs transition-all cursor-pointer"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Browse Offer Cards</span>
              </button>
            </div>

            {/* Trust and USA Perks bar */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Genuine USA Sellers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Real-Time Price Drops</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Curated Affiliate Integrity</span>
              </div>
            </div>

            {/* Quick 5 Categories Chips */}
            <div className="pt-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Quick Category Jump
              </div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <button
                  onClick={() => navigateTo('category', 'smart-gadgets')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-600/80 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Smart Gadgets</span>
                </button>
                <button
                  onClick={() => navigateTo('category', 'camera-gear')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-600/80 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span>Camera Gear</span>
                </button>
                <button
                  onClick={() => navigateTo('category', 'pc-accessories')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-600/80 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Laptop className="w-3.5 h-3.5 text-indigo-400" />
                  <span>PC Accessories</span>
                </button>
                <button
                  onClick={() => navigateTo('category', 'kitchen-apps')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-600/80 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Coffee className="w-3.5 h-3.5 text-rose-400" />
                  <span>Kitchen Apps</span>
                </button>
                <button
                  onClick={() => navigateTo('category', 'fitness-gear')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-600/80 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Fitness Gear</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Product Spotlight Showcase Card */}
          <div className="lg:col-span-5 relative">
            {/* Glow backdrop */}
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-indigo-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-100 transition duration-1000" />

            <div className="relative bg-slate-900 border border-slate-700/80 rounded-3xl p-5 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <span className="flex items-center gap-1.5 font-bold text-amber-400">
                  <Flame className="w-4 h-4 fill-current" />
                  Today's Featured Spotlight
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-[10px]">
                  Verified Deal
                </span>
              </div>

              {heroDeal && (
                <div 
                  onClick={() => navigateTo('product', undefined, heroDeal)}
                  className="mt-3 cursor-pointer group"
                >
                  <div className="relative pt-[62%] rounded-2xl overflow-hidden bg-slate-950">
                    <img
                      src={heroDeal.images[0]}
                      alt={heroDeal.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-md shadow-md">
                      SAVE {heroDeal.discountPercentage}%
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                      {heroDeal.brand}
                    </span>
                    <h3 className="font-heading font-bold text-base sm:text-lg text-white group-hover:text-amber-400 transition-colors mt-0.5 line-clamp-2">
                      {heroDeal.name}
                    </h3>

                    <div className="flex items-center gap-1 text-amber-400 mt-2 text-xs">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                      <span className="text-white font-bold ml-1">{heroDeal.rating}</span>
                      <span className="text-slate-400">({heroDeal.reviewCount} reviews)</span>
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-800">
                      <div>
                        <div className="text-xl sm:text-2xl font-black font-heading text-white">
                          ${heroDeal.discountPrice.toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-400 line-through">
                          Regular: ${heroDeal.originalPrice.toFixed(2)}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateTo('product', undefined, heroDeal);
                        }}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-amber-400 hover:text-slate-950 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                      >
                        Inspect Deal
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
