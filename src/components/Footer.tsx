import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShieldCheck, 
  MapPin, 
  Mail, 
  Phone, 
  ExternalLink,
  X as CloseIcon
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, categories, navigateTo } = useStore();
  const [activePolicy, setActivePolicy] = useState<string | null>(null);

  const mainCategories = categories.filter(c => c.enabled !== false).slice(0, 5);

  const policyContent: Record<string, { title: string; content: string }> = {
    privacy: {
      title: 'Privacy Policy',
      content: 'At TakeZon, accessible from takezon.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document outlines the types of information collected and how we use it.\n\nWe do not sell personal data. Information submitted via our contact forms is used solely to reply to inquiries. Anonymous analytics help us improve product discovery and deals tracking.\n\nCookies: TakeZon uses standard session cookies to remember user preferences and filter selections.',
    },
    terms: {
      title: 'Terms & Conditions',
      content: 'By accessing the TakeZon website, you agree to comply with our Terms of Service.\n\nAll pricing, product descriptions, and availability are subject to change by respective third-party retailers without notice. TakeZon acts as a curated discovery guide and does not process payments or directly ship products.',
    },
    affiliate: {
      title: 'Affiliate Disclosure',
      content: 'TakeZon is an independent discovery platform and participant in affiliate advertising programs (including Amazon Services LLC Associates Program, B&H Photo, Best Buy, and other affiliate networks).\n\nWhen you click on links to various merchants on this site and make a purchase, this can result in this site earning a commission. This incurs no additional cost to you as the buyer. Editorial opinions are completely independent and based on merit, performance, and real value.',
    },
    cookie: {
      title: 'Cookie Policy',
      content: 'This Cookie Policy explains what cookies are and how we use them. We use first-party cookies to remember your display preferences and third-party partner cookies when you redirect to verified merchant stores to ensure affiliate attribution.',
    },
  };

  return (
    <>
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
        {/* Main Links Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
            
            {/* 1. Brand & About (4 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div 
                onClick={() => navigateTo('home')}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-900 flex items-center justify-center text-white border border-slate-700 shadow-md">
                  <span className="font-heading font-black text-xl text-amber-400">T</span>
                  <span className="font-heading font-black text-lg text-white -ml-0.5">Z</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-black text-2xl tracking-tight text-white leading-none group-hover:text-amber-400 transition-colors">
                    Take<span className="text-amber-400">Zon</span>
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest leading-tight">
                    USA Tech & Deals
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed pr-4">
                {settings.footerText || 'TakeZon is your premier USA destination for discovering innovative consumer electronics, professional creator tools, ergonomic workspaces, and healthy living gear with verified price drops.'}
              </p>

              <div className="pt-2">
                <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                  Follow TakeZon
                </div>
                {/* Social media icons */}
                <div className="flex items-center gap-2.5">
                  {/* Facebook */}
                  <a 
                    href={settings.facebookUrl || 'https://facebook.com'} 
                    target="_blank" 
                    rel="noreferrer" 
                    aria-label="Facebook"
                    className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center border border-slate-800 transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  {/* Instagram */}
                  <a 
                    href={settings.instagramUrl || 'https://instagram.com'} 
                    target="_blank" 
                    rel="noreferrer" 
                    aria-label="Instagram"
                    className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-pink-600 text-slate-300 hover:text-white flex items-center justify-center border border-slate-800 transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                  {/* TikTok */}
                  <a 
                    href={settings.tiktokUrl || 'https://tiktok.com'} 
                    target="_blank" 
                    rel="noreferrer" 
                    aria-label="TikTok"
                    className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-slate-800 transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.99v7.92c-.01 2.37-.88 4.73-2.52 6.44-1.67 1.74-4.08 2.69-6.52 2.58-2.61-.1-5.06-1.37-6.56-3.52-1.52-2.18-1.84-5.05-.86-7.51 1-2.49 3.28-4.28 5.95-4.66.4-.06.8-.08 1.21-.08v4.06c-1.19.16-2.28.87-2.84 1.93-.57 1.07-.48 2.42.22 3.4.71.99 1.93 1.54 3.15 1.41 1.24-.13 2.3-1.02 2.58-2.24.08-.34.12-.69.12-1.04V.02z"/></svg>
                  </a>
                  {/* YouTube */}
                  <a 
                    href={settings.youtubeUrl || 'https://youtube.com'} 
                    target="_blank" 
                    rel="noreferrer" 
                    aria-label="YouTube"
                    className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center border border-slate-800 transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                  {/* X */}
                  <a 
                    href={settings.xUrl || 'https://x.com'} 
                    target="_blank" 
                    rel="noreferrer" 
                    aria-label="X"
                    className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-slate-800 transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* 2. Quick Links (2 Cols) */}
            <div className="lg:col-span-2 space-y-3">
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Quick Links
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <button 
                    onClick={() => navigateTo('home')} 
                    className="hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateTo('offers')} 
                    className="hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    Special Offers & Cards
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateTo('search')} 
                    className="hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    Product Discovery Engine
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateTo('contact')} 
                    className="hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    Contact & Partnerships
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateTo('admin')} 
                    className="text-amber-400 hover:underline transition-colors cursor-pointer font-semibold"
                  >
                    Admin Dashboard
                  </button>
                </li>
              </ul>
            </div>

            {/* 3. The 5 Main Categories (3 Cols) */}
            <div className="lg:col-span-3 space-y-3">
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                5 Core Categories
              </div>
              <ul className="space-y-2 text-xs">
                {mainCategories.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => navigateTo('category', c.slug)}
                      className="hover:text-amber-400 transition-colors flex items-center justify-between w-full group text-left cursor-pointer"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform">{c.name}</span>
                      <span className="text-[10px] text-slate-500">{c.badge || 'Explore'}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. USA Contact & Trust (3 Cols) */}
            <div className="lg:col-span-3 space-y-3 text-xs">
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                USA Office & Support
              </div>
              <p className="flex items-start gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>{settings.contactAddress || '100 Congress Avenue, Suite 2100, Austin, TX 78701'}</span>
              </p>
              <p className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{settings.contactEmail || 'contact@takezon.com'}</span>
              </p>
              <p className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{settings.contactPhone || '+1 (800) 825-3966'}</span>
              </p>

              <div className="pt-3 border-t border-slate-900 flex items-center gap-2 text-[11px] text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>256-Bit SSL Encrypted USA Discovery</span>
              </div>
            </div>

          </div>
        </div>

        {/* Affiliate Disclosure Compliance Box */}
        <div className="border-t border-slate-900 bg-slate-950/70 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-[11px] text-slate-400 leading-relaxed space-y-1">
            <span className="font-bold text-slate-300 block">
              Federal Trade Commission (FTC) Affiliate Disclosure:
            </span>
            <p>
              {settings.affiliateDisclosure || 'TakeZon participates in various affiliate marketing programs, which means we may get paid commissions on editorially chosen products purchased through our links to retailer sites at no additional cost to you. Product prices and availability are accurate as of the time indicated and are subject to change.'}
            </p>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal Policies */}
        <div className="border-t border-slate-900 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              &copy; {new Date().getFullYear()} TakeZon Inc. All Rights Reserved. Engineered for USA Product Discovery.
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <button 
                onClick={() => setActivePolicy('privacy')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button 
                onClick={() => setActivePolicy('terms')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Terms & Conditions
              </button>
              <span>•</span>
              <button 
                onClick={() => setActivePolicy('affiliate')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Affiliate Disclosure
              </button>
              <span>•</span>
              <button 
                onClick={() => setActivePolicy('cookie')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Legal Policy Modal */}
      {activePolicy && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-black text-xl text-slate-950">
                {policyContent[activePolicy]?.title}
              </h3>
              <button
                onClick={() => setActivePolicy(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line max-h-80 overflow-y-auto">
              {policyContent[activePolicy]?.content}
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button
                onClick={() => setActivePolicy(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-colors"
              >
                Close Policy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
