import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShieldCheck, 
  MapPin, 
  Mail, 
  Phone, 
  ExternalLink,
  UserCog,
  X as CloseIcon
} from 'lucide-react';
import { SocialIcon } from './SocialIcon';
import { defaultSocialLinks } from '../data/seedData';

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

              {/* Social media icons */}
              {(() => {
                const enabledSocialLinks = (settings.socialLinks && settings.socialLinks.length > 0 
                  ? settings.socialLinks 
                  : defaultSocialLinks)
                  .filter(s => s.enabled !== false && s.url && s.url.trim().length > 0)
                  .sort((a, b) => a.order - b.order);

                if (enabledSocialLinks.length === 0) return null;

                return (
                  <div className="pt-2">
                    <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                      Follow TakeZon
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      {enabledSocialLinks.map((social) => (
                        <a 
                          key={social.id}
                          href={social.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          aria-label={social.label || social.platform}
                          title={social.label || social.platform}
                          className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center border border-slate-800 transition-colors"
                        >
                          <SocialIcon platform={social.platform} className="w-4 h-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })()}
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
                    onClick={() => navigateTo('search')} 
                    className="hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    Trending Products
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
            <div className="flex items-center gap-2">
              <span>&copy; {new Date().getFullYear()} TakeZon Inc. All Rights Reserved. Engineered for USA Product Discovery.</span>
              <button 
                type="button"
                onClick={() => navigateTo('admin')} 
                className="text-slate-700 hover:text-slate-400 transition-colors cursor-pointer p-1 rounded-md"
                title="Admin Portal"
                aria-label="Admin Portal"
              >
                <UserCog className="w-3.5 h-3.5" />
              </button>
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
