import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { BannerCarousel } from './BannerCarousel';
import { 
  SlidersHorizontal, 
  ArrowUpDown, 
  Sparkles, 
  Flame, 
  ChevronRight, 
  Tag, 
  Star,
  Check,
  ArrowLeft
} from 'lucide-react';

export const CategoryPageView: React.FC = () => {
  const { 
    categories, 
    products, 
    selectedCategorySlug, 
    navigateTo,
    goBack
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [filterDealsOnly, setFilterDealsOnly] = useState(false);
  const [filterMinRating, setFilterMinRating] = useState<number>(0);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(2000);

  const category = categories.find(c => c.slug === selectedCategorySlug) || categories[0];

  // Get products for this category
  const categoryProducts = useMemo(() => {
    return products.filter(p => p.category === category.slug);
  }, [products, category.slug]);

  // Extract all tags in this category
  const allTags = useMemo(() => {
    const set = new Set<string>();
    categoryProducts.forEach(p => p.tags?.forEach(t => set.add(t)));
    return Array.from(set);
  }, [categoryProducts]);

  // Filter & sort
  const filteredProducts = useMemo(() => {
    let result = [...categoryProducts];

    if (filterDealsOnly) {
      result = result.filter(p => p.isDeal);
    }

    if (filterMinRating > 0) {
      result = result.filter(p => (p.rating || 0) >= filterMinRating);
    }

    if (selectedTag) {
      result = result.filter(p => p.tags && p.tags.includes(selectedTag));
    }

    result = result.filter(p => p.discountPrice <= maxPrice);

    // Sorting
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
  }, [categoryProducts, filterDealsOnly, filterMinRating, selectedTag, maxPrice, sortBy]);

  return (
    <div className="min-h-screen pb-20">
      {/* Category Header Hero */}
      <div className="relative bg-slate-900 text-white overflow-hidden py-14 px-4 sm:px-6 lg:px-8">
        <img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />

        <div className="relative max-w-7xl mx-auto">
          {/* Top Navigation Row: Back Button & Breadcrumbs */}
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

            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <button 
                type="button"
                onClick={() => navigateTo('home')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Home
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-amber-400 font-semibold">{category.name}</span>
            </div>
          </div>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>USA Verified Collection</span>
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">
              {category.name}
            </h1>

            <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
              {category.description}
            </p>

            <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
              <span className="font-semibold text-white">
                {categoryProducts.length} Products Found
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">
                {categoryProducts.filter(p => p.isDeal).length} Active Discounts
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Sidebar Filter + Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Showing {filteredProducts.length} of {categoryProducts.length} Deals
            </span>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort By:</span>
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-2xs"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="py-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterDealsOnly(!filterDealsOnly)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              filterDealsOnly 
                ? 'bg-red-600 text-white shadow-sm' 
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Deals & Sales Only</span>
          </button>

          <button
            onClick={() => setFilterMinRating(filterMinRating === 4 ? 0 : 4)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              filterMinRating === 4 
                ? 'bg-amber-500 text-slate-950 shadow-sm' 
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>4★ & Above</span>
          </button>

          {/* Tags */}
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedTag === tag
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              #{tag}
            </button>
          ))}

          {(filterDealsOnly || filterMinRating > 0 || selectedTag) && (
            <button
              onClick={() => {
                setFilterDealsOnly(false);
                setFilterMinRating(0);
                setSelectedTag(null);
              }}
              className="text-xs text-indigo-600 font-bold hover:underline ml-2"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 mt-6 p-8">
            <Tag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-heading font-bold text-lg text-slate-800">
              No matching products found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Try adjusting your active filters or clear them to see all available products in {category.name}.
            </p>
            <button
              onClick={() => {
                setFilterDealsOnly(false);
                setFilterMinRating(0);
                setSelectedTag(null);
                setMaxPrice(2000);
              }}
              className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Between section advertisement banner */}
        <div className="mt-14">
          <BannerCarousel placement="between_sections" />
        </div>
      </div>
    </div>
  );
};
