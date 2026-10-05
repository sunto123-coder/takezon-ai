import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Flame, 
  Star, 
  Sparkles, 
  Check, 
  X,
  Tag,
  ArrowLeft
} from 'lucide-react';

export const SearchPageView: React.FC = () => {
  const { 
    products, 
    categories, 
    searchQuery, 
    setSearchQuery, 
    navigateTo,
    goBack
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyDeals, setOnlyDeals] = useState<boolean>(false);
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Filter products based on search term & filters
  const searchResults = useMemo(() => {
    let result = products.filter((prod) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        prod.name.toLowerCase().includes(q) ||
        prod.brand.toLowerCase().includes(q) ||
        prod.shortDescription.toLowerCase().includes(q) ||
        (prod.tags && prod.tags.some(t => t.toLowerCase().includes(q)));

      const matchesCategory = 
        selectedCategory === 'all' || prod.category === selectedCategory;

      const matchesDeals = !onlyDeals || prod.isDeal;
      const matchesFeatured = !onlyFeatured || prod.isFeatured;
      const matchesRating = !minRating || (prod.rating || 0) >= minRating;
      const matchesPrice = prod.discountPrice <= maxPrice;

      return matchesSearch && matchesCategory && matchesDeals && matchesFeatured && matchesRating && matchesPrice;
    });

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'price-asc':
        result.sort((a, b) => a.discountPrice - b.discountPrice);
        break;
      case 'price-desc':
        result.sort((a, b) => b.discountPrice - a.discountPrice);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, onlyDeals, onlyFeatured, minRating, maxPrice, sortBy]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setOnlyDeals(false);
    setOnlyFeatured(false);
    setMinRating(0);
    setMaxPrice(3000);
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Navigation Row: Back Button */}
      <div className="mb-6 flex items-center justify-between">
        <button 
          type="button"
          onClick={goBack}
          className="group inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 hover:text-slate-950 text-xs font-bold border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
          title="Return to previous view"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-indigo-600" />
          <span>Back to Store</span>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          Home Storefront
        </button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-slate-950 tracking-tight">
          Product Discovery & Search
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Search across our verified USA catalogue of tech, gear, accessories, and culinary essentials.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search by keywords (e.g. OLED monitor, Sony lens, espresso, wireless mic, gym)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-12 py-4 text-base sm:text-lg rounded-2xl bg-white border border-slate-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 shadow-sm transition-all focus:outline-hidden"
          autoFocus
        />
        <Search className="w-6 h-6 text-slate-400 absolute left-4 top-4.5" />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="group absolute right-3 top-3.5 h-10 px-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all active:scale-90 cursor-pointer flex items-center gap-1 text-xs font-bold"
            title="Clear search query"
          >
            <X className="w-4 h-4 stroke-[2.5] transition-transform group-hover:rotate-90 duration-200" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs mb-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <span>Refine Results ({searchResults.length} Products Found)</span>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort:</span>
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
          {/* Category Select */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Quick Badges Filter */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Deal Badges
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOnlyDeals(!onlyDeals)}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all ${
                  onlyDeals 
                    ? 'bg-red-600 text-white border-red-600' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Deals</span>
              </button>

              <button
                type="button"
                onClick={() => setOnlyFeatured(!onlyFeatured)}
                className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all ${
                  onlyFeatured 
                    ? 'bg-indigo-600 text-white border-indigo-600' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Featured</span>
              </button>
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Minimum Rating
            </label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value={0}>Any Rating</option>
              <option value={4.5}>4.5★ & Higher</option>
              <option value={4.0}>4.0★ & Higher</option>
              <option value={3.5}>3.5★ & Higher</option>
            </select>
          </div>

          {/* Max Price Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Max Price</span>
              <span className="text-indigo-600">${maxPrice}</span>
            </div>
            <input
              type="range"
              min={50}
              max={3000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer mt-2"
            />
          </div>
        </div>

        {/* Clear filters row */}
        {(selectedCategory !== 'all' || onlyDeals || onlyFeatured || minRating > 0 || maxPrice < 3000 || searchQuery) && (
          <div className="pt-2 flex items-center justify-end">
            <button
              onClick={handleReset}
              className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Results Grid */}
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {searchResults.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-lg text-slate-800">
            No products match your criteria
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Try broadening your search term or adjusting your price and filter options.
          </p>
          <button
            onClick={handleReset}
            className="mt-4 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer hover:bg-indigo-600 transition-colors"
          >
            Clear All Search Filters
          </button>
        </div>
      )}
    </div>
  );
};
