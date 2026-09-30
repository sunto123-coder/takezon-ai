import React from 'react';
import { useStore } from '../context/StoreContext';
import { HeroSection } from './HeroSection';
import { BannerCarousel } from './BannerCarousel';
import { OfferCardsSection } from './OfferCardsSection';
import { ProductCard } from './ProductCard';
import { Newsletter } from './Newsletter';
import { 
  Flame, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  ThumbsUp, 
  Cpu, 
  Camera, 
  Laptop, 
  Coffee, 
  Activity,
  CheckCircle2
} from 'lucide-react';

export const HomePageView: React.FC = () => {
  const { products, categories, navigateTo } = useStore();

  // 1. Featured Deals
  const featuredDeals = products.filter(p => p.isDeal).slice(0, 4);

  // 2. Smart Gadgets collection
  const smartGadgets = products.filter(p => p.category === 'smart-gadgets').slice(0, 4);

  // 3. Camera Gear collection
  const cameraGear = products.filter(p => p.category === 'camera-gear').slice(0, 4);

  // 4. PC Accessories collection
  const pcAccessories = products.filter(p => p.category === 'pc-accessories').slice(0, 4);

  // 5. Kitchen Apps collection
  const kitchenApps = products.filter(p => p.category === 'kitchen-apps').slice(0, 4);

  // 6. Fitness Gear collection
  const fitnessGear = products.filter(p => p.category === 'fitness-gear').slice(0, 4);

  // 7. Trending Products
  const trendingProducts = products.filter(p => p.isTrending).slice(0, 4);

  // 8. Recommended Products
  const recommendedProducts = products.filter(p => p.isFeatured).slice(0, 4);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      
      {/* 1. Hero Section */}
      <HeroSection />

      {/* Top Banner Advertisement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <BannerCarousel placement="homepage_top" />
      </div>

      {/* 2. Featured Deals Section */}
      <section id="featured-deals-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-red-600 mb-1">
              <Flame className="w-4 h-4 fill-current animate-bounce" />
              <span>Flash Reductions</span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-950 tracking-tight">
              Today's Featured Deals & Price Drops
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Verified savings up to 45% off MSRP with verified USA affiliate retailer guarantees.
            </p>
          </div>

          <button
            onClick={() => navigateTo('offers')}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors group cursor-pointer"
          >
            <span>View All Deals & Offers</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDeals.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 3. Category Showcase: Smart Gadgets */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-100 text-cyan-700">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-black text-2xl text-slate-950 tracking-tight">
                Smart Gadgets
              </h2>
              <p className="text-xs text-slate-500">
                Connected audio, intelligent home hubs, and personal lifestyle tech.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('category', 'smart-gadgets')}
            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Explore All Smart Gadgets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {smartGadgets.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* Middle Banner Advertisement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BannerCarousel placement="homepage_middle" />
      </div>

      {/* 4. Category Showcase: Camera Gear */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-black text-2xl text-slate-950 tracking-tight">
                Camera Gear & Filmmaking
              </h2>
              <p className="text-xs text-slate-500">
                Professional optics, motorized gimbals, broadcast audio, and creator rigs.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('category', 'camera-gear')}
            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Explore All Camera Gear</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cameraGear.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 5. Special Offers / Dedicated Offer Card Section */}
      <div className="bg-slate-100/70 border-y border-slate-200/80 py-4">
        <OfferCardsSection limit={4} />
      </div>

      {/* 6. Category Showcase: PC Accessories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-black text-2xl text-slate-950 tracking-tight">
                PC Accessories & Battlestation Gear
              </h2>
              <p className="text-xs text-slate-500">
                High-refresh OLED displays, custom acoustic mechanical keys, and esports mice.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('category', 'pc-accessories')}
            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Explore All PC Accessories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pcAccessories.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* Between Sections Advertisement Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BannerCarousel placement="between_sections" />
      </div>

      {/* 7. Category Showcase: Kitchen Apps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-black text-2xl text-slate-950 tracking-tight">
                Kitchen Apps & Culinary Tech
              </h2>
              <p className="text-xs text-slate-500">
                Precision dual-zone air fryers, cafe-grade espresso machines, and smart blenders.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('category', 'kitchen-apps')}
            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Explore All Kitchen Apps</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kitchenApps.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 8. Category Showcase: Fitness Gear */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-black text-2xl text-slate-950 tracking-tight">
                Fitness Gear & Athletic Recovery
              </h2>
              <p className="text-xs text-slate-500">
                Adjustable weights, hydro-rowers, and percussive deep-tissue therapy tools.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigateTo('category', 'fitness-gear')}
            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Explore All Fitness Gear</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {fitnessGear.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 9. Trending Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-black text-2xl text-slate-950 tracking-tight">
                Trending Across the USA
              </h2>
              <p className="text-xs text-slate-500">
                Products seeing highest click momentum and verified community upvotes this week.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 10. Recommended Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-800">
              <ThumbsUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-black text-2xl text-slate-950 tracking-tight">
                TakeZon Recommended Selections
              </h2>
              <p className="text-xs text-slate-500">
                Staff-verified items combining outstanding build durability with authentic price value.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* Bottom Listing Banner Advertisement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BannerCarousel placement="bottom_listings" />
      </div>

      {/* 12. Newsletter Section */}
      <Newsletter />
    </div>
  );
};
