import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Sparkles, 
  Flame, 
  Search, 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronDown, 
  Mail, 
  ArrowUpRight, 
  Laptop, 
  Camera, 
  Cpu, 
  Coffee, 
  Activity,
  UserCog
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'smart-gadgets': <Cpu className="w-4 h-4 text-cyan-500" />,
  'camera-gear': <Camera className="w-4 h-4 text-amber-500" />,
  'pc-accessories': <Laptop className="w-4 h-4 text-indigo-500" />,
  'kitchen-apps': <Coffee className="w-4 h-4 text-rose-500" />,
  'fitness-gear': <Activity className="w-4 h-4 text-emerald-500" />,
};

export const Header: React.FC = () => {
  const { 
    categories, 
    products, 
    currentView, 
    selectedCategorySlug, 
    navigateTo, 
    settings,
    searchQuery,
    setSearchQuery
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // The 5 core categories
  const mainCategories = categories.filter(c => c.enabled !== false).slice(0, 5);

  const handleCategoryClick = (slug: string) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    navigateTo('category', slug);
  };

  return (
    <>
      {/* Top USA Notice & Deals Announcement Bar */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
              USA EXCLUSIVE
            </span>
            <span className="text-slate-300 hover:text-white transition-colors cursor-pointer" onClick={() => navigateTo('offers')}>
              {settings.announcementText || 'Fall Tech Blowout: Up to 50% Off Verified USA Deals & Daily Curated Gear!'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-slate-400 shrink-0">
            <span className="flex items-center gap-1.5 text-xs text-slate-300">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Price Tracking
            </span>
            <div className="h-3 w-px bg-slate-800" />
            <button
              onClick={() => navigateTo('admin')}
              className="flex items-center gap-1 hover:text-amber-400 font-medium transition-colors cursor-pointer"
              title="Admin Control Panel"
            >
              <UserCog className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            
            {/* LEFT SIDE: Brand Logo + Immediately 5 Main Categories */}
            <div className="flex items-center gap-6 lg:gap-8">
              {/* TakeZon Brand Logo */}
              <button 
                onClick={() => navigateTo('home')}
                className="flex items-center gap-2.5 text-left group focus:outline-hidden"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-900 flex items-center justify-center text-white shadow-md shadow-indigo-950/20 group-hover:scale-105 transition-transform">
                  <span className="font-heading font-black text-xl text-amber-400 tracking-tighter">T</span>
                  <span className="font-heading font-extrabold text-lg text-white -ml-0.5">Z</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-black text-2xl tracking-tight text-slate-950 leading-none group-hover:text-indigo-600 transition-colors">
                    Take<span className="text-amber-500">Zon</span>
                  </span>
                  <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest leading-tight">
                    USA Tech & Deals
                  </span>
                </div>
              </button>

              {/* 5 Main Category Navigation Menus (Desktop) */}
              <nav className="hidden xl:flex items-center space-x-1" onMouseLeave={() => setActiveDropdown(null)}>
                {mainCategories.map((cat) => {
                  const isCurrent = currentView === 'category' && selectedCategorySlug === cat.slug;
                  const catProducts = products.filter(p => p.category === cat.slug);
                  const isHovered = activeDropdown === cat.slug;

                  return (
                    <div 
                      key={cat.id} 
                      className="relative"
                      onMouseEnter={() => setActiveDropdown(cat.slug)}
                    >
                      <button
                        onClick={() => handleCategoryClick(cat.slug)}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                          isCurrent
                            ? 'text-indigo-600 bg-indigo-50 font-bold'
                            : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/80'
                        }`}
                      >
                        {CATEGORY_ICONS[cat.slug] || <Cpu className="w-4 h-4 text-slate-500" />}
                        <span>{cat.name}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-400 ${isHovered ? 'rotate-180 text-slate-700' : ''}`} />
                      </button>

                      {/* Mega Dropdown preview */}
                      {isHovered && (
                        <div className="absolute top-full left-0 w-80 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 overflow-hidden">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                {cat.name} Collection
                              </span>
                              <span className="text-xs bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded-full">
                                {catProducts.length} Deals
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 my-2 leading-relaxed line-clamp-2">
                              {cat.description}
                            </p>

                            <div className="space-y-1.5 my-2">
                              {catProducts.slice(0, 3).map((prod) => (
                                <div 
                                  key={prod.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDropdown(null);
                                    navigateTo('product', undefined, prod);
                                  }}
                                  className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer group/item transition-colors"
                                >
                                  <img 
                                    src={prod.images[0]} 
                                    alt={prod.name} 
                                    className="w-10 h-10 rounded-md object-cover border border-slate-200 shrink-0" 
                                  />
                                  <div className="min-w-0 flex-1">
                                    <h4 className="text-xs font-semibold text-slate-800 truncate group-hover/item:text-indigo-600">
                                      {prod.name}
                                    </h4>
                                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                                      <span>${prod.discountPrice.toFixed(2)}</span>
                                      <span className="text-slate-400 line-through text-[11px] font-normal">
                                        ${prod.originalPrice.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <button
                              onClick={() => handleCategoryClick(cat.slug)}
                              className="w-full mt-2 py-2 px-3 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors"
                            >
                              <span>View All {cat.name}</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* RIGHT SIDE: Offer Card & Contact (+ Search & Admin) */}
            <div className="flex items-center gap-3">
              
              {/* Quick Search Bar (Desktop) */}
              <div className="hidden md:flex items-center relative">
                <input
                  type="text"
                  placeholder="Search products, brands, tech..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (currentView !== 'search' && e.target.value.trim().length > 0) {
                      navigateTo('search');
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') navigateTo('search');
                  }}
                  className="w-56 lg:w-64 pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-100 hover:bg-slate-200/70 focus:bg-white focus:w-72 transition-all duration-200 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-hidden"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="group absolute right-2.5 top-2 p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer active:scale-90"
                    title="Clear search (সার্চ মুছুন)"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.5] transition-transform group-hover:rotate-90 duration-200" />
                  </button>
                )}
              </div>

              {/* 6. Offer Card Navigation Item */}
              <button
                type="button"
                onClick={() => navigateTo('offers')}
                className={`relative px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer active:scale-95 ${
                  currentView === 'offers'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-800 hover:text-amber-600 hover:bg-amber-50/80 border border-amber-200/60 bg-amber-50/40'
                }`}
              >
                <Flame className={`w-4 h-4 ${currentView === 'offers' ? 'text-slate-950' : 'text-amber-500 animate-bounce'}`} />
                <span>Offer Card</span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-full text-[10px] font-extrabold uppercase bg-red-600 text-white">
                  Hot
                </span>
              </button>

              {/* 7. Contact Navigation Item */}
              <button
                type="button"
                onClick={() => navigateTo('contact')}
                className={`px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                  currentView === 'contact'
                    ? 'text-indigo-600 bg-indigo-50 font-bold'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <Mail className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline">Contact</span>
              </button>

              {/* Admin Dashboard shortcut button */}
              <button
                type="button"
                onClick={() => navigateTo('admin')}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all cursor-pointer active:scale-95"
              >
                <UserCog className="w-3.5 h-3.5 text-indigo-500" />
                <span>Admin</span>
              </button>

              {/* Mobile Hamburger / Cross Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden w-11 h-11 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-950 active:scale-90 transition-all cursor-pointer border border-transparent hover:border-slate-200 flex items-center justify-center"
                aria-label="Toggle menu"
                title={mobileMenuOpen ? 'Close Menu (মেনু বন্ধ করুন)' : 'Open Menu (মেনু খুলুন)'}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 stroke-[2.5] text-rose-600 transition-transform rotate-90 duration-200" />
                ) : (
                  <Menu className="w-6 h-6 stroke-[2.2]" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer with backdrop */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop for easy click outside to close */}
            <div 
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-30 xl:hidden animate-in fade-in duration-150"
              onClick={() => setMobileMenuOpen(false)}
            />

            <div className="relative z-40 xl:hidden bg-white border-t border-slate-200 shadow-2xl px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2">
              {/* Drawer Top Header with quick close */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs text-slate-500">
                <span className="font-bold text-slate-800 uppercase tracking-wider">Navigation Menu</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="group flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 px-3 py-1.5 rounded-xl transition-all active:scale-95 cursor-pointer shadow-2xs"
                  title="Close Menu (বন্ধ করুন)"
                >
                  <X className="w-4 h-4 stroke-[2.5] transition-transform group-hover:rotate-90 duration-200" />
                  <span>Close (বন্ধ করুন)</span>
                </button>
              </div>

              {/* Mobile Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products, brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setMobileMenuOpen(false);
                      navigateTo('search');
                    }
                  }}
                  className="w-full pl-9 pr-9 py-2.5 text-sm rounded-xl bg-slate-100 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="group absolute right-2.5 top-2.5 p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer active:scale-90"
                    title="Clear search"
                  >
                    <X className="w-4 h-4 stroke-[2.5] transition-transform group-hover:rotate-90 duration-200" />
                  </button>
                )}
              </div>

              {/* 5 Main Categories list */}
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                  Main Categories
                </div>
                <div className="space-y-1">
                  {mainCategories.map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.slug)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-98 cursor-pointer ${
                        currentView === 'category' && selectedCategorySlug === cat.slug
                          ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/80 shadow-2xs'
                          : 'text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {CATEGORY_ICONS[cat.slug] || <Cpu className="w-4 h-4" />}
                        <span>{cat.name}</span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {products.filter(p => p.category === cat.slug).length} items
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Offer Card & Contact & Admin */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigateTo('offers');
                  }}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-sm shadow-sm transition-all active:scale-98 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4" />
                    <span>Offer Card (Hot Deals & Offers)</span>
                  </div>
                  <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase">
                    Active
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigateTo('contact');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-800 hover:bg-slate-100 active:bg-slate-200 transition-all active:scale-98 cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span>Contact & Inquiries</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigateTo('admin');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-indigo-600 bg-indigo-50/70 hover:bg-indigo-100/70 active:bg-indigo-200/70 transition-all active:scale-98 cursor-pointer border border-indigo-200/60"
                >
                  <UserCog className="w-4 h-4" />
                  <span>Admin Dashboard (/admin)</span>
                </button>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
};
