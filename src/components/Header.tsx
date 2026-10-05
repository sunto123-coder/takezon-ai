import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Sparkles, 
  Flame, 
  Search, 
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
  UserCog,
  ShoppingBag,
  ExternalLink,
  Tag
} from 'lucide-react';
import { NavigationItem, TopBarItem } from '../types';
import { defaultTopBarSettings, defaultNavigationItems, defaultSocialLinks } from '../data/seedData';
import { SocialIcon } from './SocialIcon';

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

  // ================= 2. TOP HEADER / TOP BORDER CONTROL =================
  const topBarEnabled = settings.topBar?.enabled !== false;
  const topBarItems: TopBarItem[] = (settings.topBar?.items && settings.topBar.items.length > 0 
    ? settings.topBar.items 
    : defaultTopBarSettings.items)
    .filter(item => item.enabled !== false)
    .sort((a, b) => a.order - b.order);

  const leftTopBarItems = topBarItems.filter(i => i.type === 'text' || i.type === 'badge' || i.type === 'custom');
  const rightTopBarItems = topBarItems.filter(i => i.type === 'status' || i.type === 'button' || i.type === 'link');

  const handleTopBarClick = (item: TopBarItem) => {
    if (!item.linkUrl) return;
    const rawUrl = item.linkUrl.trim();
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
      window.open(rawUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    const cleanUrl = rawUrl.replace(/^\/+/, '').replace(/^#/, '');
    if (cleanUrl.startsWith('category:')) {
      navigateTo('category', cleanUrl.replace('category:', ''));
      return;
    }
    switch (cleanUrl) {
      case 'offers':
        navigateTo('offers');
        break;
      case 'contact':
        navigateTo('contact');
        break;
      case 'home':
        navigateTo('home');
        break;
      case 'admin':
        navigateTo('admin');
        break;
      case 'search':
      case 'products':
        navigateTo('search');
        break;
      default:
        const matchedCat = categories.find(c => c.slug === cleanUrl);
        if (matchedCat) {
          navigateTo('category', matchedCat.slug);
        } else {
          navigateTo('offers');
        }
        break;
    }
  };

  // ================= 3. MAIN NAVIGATION MENU CONTROL =================
  const navItems: NavigationItem[] = (settings.navigationItems && settings.navigationItems.length > 0 
    ? settings.navigationItems 
    : defaultNavigationItems)
    .filter(item => item.enabled !== false)
    .sort((a, b) => a.order - b.order);

  const handleNavClick = (item: NavigationItem) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);

    const rawUrl = item.url.trim();
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
      window.open(rawUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    const cleanUrl = rawUrl.replace(/^\/+/, '').replace(/^#/, '');

    if (cleanUrl.startsWith('category:')) {
      const slug = cleanUrl.replace('category:', '');
      navigateTo('category', slug);
      return;
    }

    if (item.categorySlug) {
      navigateTo('category', item.categorySlug);
      return;
    }

    switch (cleanUrl) {
      case 'home':
        navigateTo('home');
        break;
      case 'offers':
        navigateTo('offers');
        break;
      case 'contact':
        navigateTo('contact');
        break;
      case 'search':
      case 'products':
        navigateTo('search');
        break;
      case 'admin':
        navigateTo('admin');
        break;
      default:
        const matchedCat = categories.find(c => c.slug === cleanUrl);
        if (matchedCat) {
          navigateTo('category', matchedCat.slug);
        } else {
          navigateTo('home');
        }
        break;
    }
  };

  const handleCategoryDropdownClick = (slug: string) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    navigateTo('category', slug);
  };

  return (
    <>
      {/* ================= TOP HEADER / TOP BORDER AREA ================= */}
      {topBarEnabled && topBarItems.length > 0 && (
        <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800 transition-all">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            
            {/* Left side items (editable text, badges, announcements) */}
            <div className="flex items-center gap-3 overflow-hidden text-ellipsis whitespace-nowrap">
              {leftTopBarItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  {item.badgeText && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                      {item.badgeText}
                    </span>
                  )}
                  {item.linkUrl ? (
                    <span 
                      onClick={() => handleTopBarClick(item)}
                      className="text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {item.text}
                    </span>
                  ) : (
                    <span className="text-slate-300">
                      {item.text}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Right side items (status indicators, buttons, shortcuts) */}
            <div className="flex items-center gap-4 text-slate-400 shrink-0">
              {rightTopBarItems.map((item, idx) => (
                <React.Fragment key={item.id}>
                  {idx > 0 && <div className="h-3 w-px bg-slate-800 hidden sm:block" />}
                  {item.type === 'status' && (
                    <span className="flex items-center gap-1.5 text-xs text-slate-300">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      {item.text}
                    </span>
                  )}
                  {item.type === 'button' && (
                    <button
                      type="button"
                      onClick={() => handleTopBarClick(item)}
                      className="flex items-center gap-1 hover:text-amber-400 font-medium transition-colors cursor-pointer text-xs"
                      title={item.label}
                    >
                      <UserCog className="w-3.5 h-3.5" />
                      <span>{item.text}</span>
                    </button>
                  )}
                  {item.type === 'link' && (
                    <button
                      type="button"
                      onClick={() => handleTopBarClick(item)}
                      className="hover:text-amber-400 font-medium transition-colors cursor-pointer text-xs"
                    >
                      {item.text}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            
            {/* LEFT SIDE: Brand Logo + Dynamic Navigation Menu (Desktop) */}
            <div className="flex items-center gap-4 lg:gap-6">
              {/* TakeZon Brand Logo */}
              <button 
                onClick={() => navigateTo('home')}
                className="flex items-center gap-2.5 text-left group focus:outline-hidden shrink-0"
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

              {/* Dynamic Main Navigation Items (Desktop) */}
              <nav className="hidden xl:flex items-center space-x-1" onMouseLeave={() => setActiveDropdown(null)}>
                {navItems.map((item) => {
                  const catSlug = item.categorySlug || (item.url.startsWith('category:') ? item.url.replace('category:', '') : null);
                  const cat = catSlug ? categories.find(c => c.slug === catSlug) : null;

                  if (cat) {
                    const isCurrent = currentView === 'category' && selectedCategorySlug === cat.slug;
                    const catProducts = products.filter(p => p.category === cat.slug);
                    const isHovered = activeDropdown === cat.slug;

                    return (
                      <div 
                        key={item.id} 
                        className="relative"
                        onMouseEnter={() => setActiveDropdown(cat.slug)}
                      >
                        <button
                          onClick={() => handleNavClick(item)}
                          className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                            isCurrent
                              ? 'text-indigo-600 bg-indigo-50 font-bold'
                              : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/80'
                          }`}
                        >
                          {CATEGORY_ICONS[cat.slug] || <Cpu className="w-4 h-4 text-slate-500" />}
                          <span>{item.label || cat.name}</span>
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
                                        <span>
                                          {prod.displayMode === 'checkDetails' 
                                            ? (prod.checkDetailsText || 'Check Details') 
                                            : (prod.amountText || `$${prod.discountPrice.toFixed(2)}`)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <button
                                onClick={() => handleCategoryDropdownClick(cat.slug)}
                                className="w-full mt-2 py-2 px-3 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                              >
                                <span>View All {cat.name}</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Non-category standard navigation button
                  const isCurrent = 
                    (item.url === 'home' && currentView === 'home') ||
                    (item.url === 'offers' && currentView === 'offers') ||
                    (item.url === 'contact' && currentView === 'contact') ||
                    ((item.url === 'search' || item.url === 'products') && currentView === 'search');

                  const isOffer = item.url === 'offers';

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item)}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isOffer
                          ? (isCurrent 
                              ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' 
                              : 'text-amber-700 bg-amber-50/60 hover:bg-amber-100/80 border border-amber-200/60')
                          : (isCurrent
                              ? 'text-indigo-600 bg-indigo-50 font-bold'
                              : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/80')
                      }`}
                    >
                      {item.url === 'home' && <Sparkles className="w-4 h-4 text-amber-500" />}
                      {item.url === 'offers' && <Flame className="w-4 h-4 text-amber-500" />}
                      {item.url === 'contact' && <Mail className="w-4 h-4 text-indigo-500" />}
                      {(item.url === 'search' || item.url === 'products') && <ShoppingBag className="w-4 h-4 text-cyan-500" />}
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold uppercase bg-red-600 text-white">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* RIGHT SIDE: Search Bar + Admin Shortcut + Mobile Toggle */}
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
                  className="w-52 lg:w-60 pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-100 hover:bg-slate-200/70 focus:bg-white focus:w-64 transition-all duration-200 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-hidden"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="group absolute right-2.5 top-2 p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer active:scale-90"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.5] transition-transform group-hover:rotate-90 duration-200" />
                  </button>
                )}
              </div>

              {/* Admin Portal Shortcut: Discreet Logo Only */}
              <button
                type="button"
                onClick={() => navigateTo('admin')}
                className="hidden lg:flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer active:scale-95 shadow-2xs"
                title="Admin Portal"
                aria-label="Admin Portal"
              >
                <UserCog className="w-4 h-4 text-slate-600" />
              </button>

              {/* Mobile Hamburger / Cross Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden w-11 h-11 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-slate-950 active:scale-90 transition-all cursor-pointer border border-transparent hover:border-slate-200 flex items-center justify-center"
                aria-label="Toggle menu"
                title={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
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
            <div 
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-30 xl:hidden animate-in fade-in duration-150"
              onClick={() => setMobileMenuOpen(false)}
            />

            <div className="relative z-40 xl:hidden bg-white border-t border-slate-200 shadow-2xl px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs text-slate-500">
                <span className="font-bold text-slate-800 uppercase tracking-wider">Navigation Menu</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="group flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 px-3 py-1.5 rounded-xl transition-all active:scale-95 cursor-pointer shadow-2xs"
                  title="Close Menu"
                >
                  <X className="w-4 h-4 stroke-[2.5] transition-transform group-hover:rotate-90 duration-200" />
                  <span>Close</span>
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

              {/* Dynamic Nav Items in configured Order */}
              <div className="space-y-1">
                {navItems.map((item) => {
                  const catSlug = item.categorySlug || (item.url.startsWith('category:') ? item.url.replace('category:', '') : null);
                  const cat = catSlug ? categories.find(c => c.slug === catSlug) : null;
                  const isCurrent = 
                    (cat && currentView === 'category' && selectedCategorySlug === cat.slug) ||
                    (item.url === 'home' && currentView === 'home') ||
                    (item.url === 'offers' && currentView === 'offers') ||
                    (item.url === 'contact' && currentView === 'contact') ||
                    ((item.url === 'search' || item.url === 'products') && currentView === 'search');

                  if (item.url === 'offers') {
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => handleNavClick(item)}
                        className="w-full flex items-center justify-between px-3 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-sm shadow-sm transition-all active:scale-98 cursor-pointer mt-2"
                      >
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  }

                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => handleNavClick(item)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-98 cursor-pointer ${
                        isCurrent
                          ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/80 shadow-2xs'
                          : 'text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {cat ? (CATEGORY_ICONS[cat.slug] || <Cpu className="w-4 h-4" />) : (
                          item.url === 'home' ? <Sparkles className="w-4 h-4 text-amber-500" /> :
                          item.url === 'contact' ? <Mail className="w-4 h-4 text-indigo-500" /> :
                          <Tag className="w-4 h-4 text-slate-400" />
                        )}
                        <span>{item.label}</span>
                      </div>
                      {cat && (
                        <span className="text-xs text-slate-400">
                          {products.filter(p => p.category === cat.slug).length} items
                        </span>
                      )}
                      {item.badge && (
                        <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full uppercase font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Admin Portal shortcut: Discreet Logo Only */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-2">
                <span className="text-[11px] text-slate-400 font-medium">TakeZon USA</span>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigateTo('admin');
                  }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
                  title="Admin Portal"
                  aria-label="Admin Portal"
                >
                  <UserCog className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* Enabled Social Media Links */}
              {(() => {
                const enabledSocial = (settings.socialLinks && settings.socialLinks.length > 0
                  ? settings.socialLinks
                  : defaultSocialLinks)
                  .filter(s => s.enabled !== false && s.url && s.url.trim().length > 0)
                  .sort((a, b) => a.order - b.order);

                if (enabledSocial.length === 0) return null;

                return (
                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">
                      Follow TakeZon
                    </span>
                    <div className="flex flex-wrap items-center gap-2 px-1">
                      {enabledSocial.map((social) => (
                        <a
                          key={social.id}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={social.label || social.platform}
                          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-indigo-600 text-slate-700 hover:text-white flex items-center justify-center transition-colors border border-slate-200"
                        >
                          <SocialIcon platform={social.platform} className="w-4 h-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </>
        )}
      </header>
    </>
  );
};
