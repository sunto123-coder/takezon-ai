/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePageView } from './components/HomePageView';
import { CategoryPageView } from './components/CategoryPageView';
import { OfferCardsSection } from './components/OfferCardsSection';
import { ContactPageView } from './components/ContactPageView';
import { SearchPageView } from './components/SearchPageView';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { BannerCarousel } from './components/BannerCarousel';
import { ToastContainer } from './components/ToastContainer';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminLogin } from './admin/AdminLogin';
import { Flame, Sparkles, ChevronRight, ArrowLeft } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentView, navigateTo, goBack } = useStore();
  const { isAdmin, loading: authLoading } = useAuth();

  // Support URL path / hash detection for /admin or #admin
  useEffect(() => {
    const handleUrlCheck = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || hash === '#admin') {
        navigateTo('admin');
      }
    };

    handleUrlCheck();
    window.addEventListener('popstate', handleUrlCheck);
    return () => window.removeEventListener('popstate', handleUrlCheck);
  }, [navigateTo]);

  // If in admin view, render Admin interface
  if (currentView === 'admin') {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-semibold">Authenticating Admin Portal...</span>
          </div>
        </div>
      );
    }

    if (!isAdmin) {
      return (
        <>
          <AdminLogin />
          <ToastContainer />
        </>
      );
    }

    return (
      <>
        <AdminDashboard />
        <ToastContainer />
      </>
    );
  }

  // Public Storefront
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-amber-400 selection:text-slate-950">
      {/* Sticky Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && <HomePageView />}
        {currentView === 'category' && <CategoryPageView />}
        {currentView === 'search' && <SearchPageView />}
        {currentView === 'contact' && <ContactPageView />}

        {/* Dedicated Offers & Deals View */}
        {currentView === 'offers' && (
          <div className="min-h-screen pb-16">
            <div className="relative bg-slate-950 text-white py-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
              <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <button 
                    type="button"
                    onClick={goBack}
                    className="group inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-700/95 active:bg-slate-900 text-slate-100 hover:text-white text-xs font-bold border border-slate-700 hover:border-amber-400/60 backdrop-blur-md transition-all duration-200 active:scale-95 cursor-pointer shadow-md"
                    title="Return to previous view"
                  >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-amber-400" />
                    <span>Back to Store</span>
                  </button>

                  <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                    <button onClick={() => navigateTo('home')} className="hover:text-white cursor-pointer">Home</button>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    <span className="text-amber-400 font-semibold">Special Offer Cards</span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-600 text-white shadow-md mb-3">
                  <Flame className="w-3.5 h-3.5 fill-current animate-bounce" />
                  <span>Verified Daily USA Deals</span>
                </div>

                <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
                  TakeZon Offer Vault & CPA Promotions
                </h1>
                <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl">
                  Explore curated manufacturer rebates, exclusive flash coupons, and high-value CPA partner promotions with verified live countdown expiration clocks.
                </p>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
              <BannerCarousel placement="homepage_top" />
            </div>

            <OfferCardsSection showHeader={true} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
              <BannerCarousel placement="bottom_listings" />
            </div>
          </div>
        )}
      </main>

      {/* Product Details Modal (Inspect Deal) */}
      <ProductDetailsModal />

      {/* Footer */}
      <Footer />

      {/* Global Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <MainAppContent />
      </StoreProvider>
    </AuthProvider>
  );
}
