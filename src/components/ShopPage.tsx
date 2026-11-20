import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { ProductCard } from './ProductCard.tsx';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const {
    products,
    isLoadingProducts,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    formatPrice
  } = useStore();

  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(40000);
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'newest'>('featured');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const categories = [
    'All',
    'Everyday Essentials',
    'Elegant Pret',
    'Contemporary Formal',
    'Seasonal Edit',
    'Accessories'
  ];

  const availableSizes = ['All', 'XS', 'S', 'M', 'L', 'XL', 'One Size'];

  // Reactive filtering
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesTag = p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesTag) return false;
      }

      // Price
      const effectivePrice = p.salePrice || p.price;
      if (effectivePrice < minPrice || effectivePrice > maxPrice) return false;

      // Size
      if (selectedSize !== 'All' && !p.availableSizes.includes(selectedSize)) return false;

      // In Stock
      if (inStockOnly && p.stock <= 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') {
        return (a.salePrice || a.price) - (b.salePrice || b.price);
      }
      if (sortBy === 'price_desc') {
        return (b.salePrice || b.price) - (a.salePrice || a.price);
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      // 'featured'
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  }, [products, selectedCategory, searchQuery, minPrice, maxPrice, selectedSize, inStockOnly, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setMinPrice(0);
    setMaxPrice(40000);
    setSelectedSize('All');
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-7 sm:py-10 md:py-16 border-b border-[#E7E2DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#8A7D6B] font-medium">
            Curated pret & separates
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-medium text-[#1C1C1F]">
            The Fashion Catalogue
          </h1>
          <p className="text-sm text-[#555350]">
            Browse thoughtfully designed garments tailored from pure silks, breathable linens, and luxury organza.
          </p>
        </div>

        {/* Filter Bar & Controls */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E7E2DA] shadow-sm mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#7A7875] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by garment title, embroidery, or fabric..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-lg border border-[#DDD7CE] bg-[#FAF8F5] focus:outline-none focus:border-[#1C1C1F]"
              />
            </div>

            {/* Sort & Quick Filter Toggles */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-[#4A4845]">
                <span className="font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs px-2.5 py-2 rounded-lg border border-[#DDD7CE] bg-[#FAF8F5] focus:outline-none"
                >
                  <option value="featured">Featured First</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>

              <button
                onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
                className={`px-3 py-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  isFilterDrawerOpen
                    ? 'bg-[#1C1C1F] text-white border-[#1C1C1F]'
                    : 'bg-[#FAF8F5] text-[#4A4845] border-[#DDD7CE] hover:border-[#1C1C1F]'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters & Price</span>
              </button>

              {(selectedCategory !== 'All' || searchQuery || selectedSize !== 'All' || inStockOnly || maxPrice < 40000) && (
                <button
                  onClick={resetFilters}
                  className="px-3 py-2 rounded-lg border border-red-200 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 flex items-center gap-1 transition-colors"
                  title="Reset all active filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Category Tabs (Segmented control) */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 pt-1 border-t border-[#F2EEE9]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#1C1C1F] text-white shadow-sm'
                    : 'text-[#555350] hover:text-[#1C1C1F] hover:bg-[#F3EFEA]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Expanded Filter Panel */}
          {isFilterDrawerOpen && (
            <div className="pt-4 border-t border-[#E7E2DA] grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fadeIn">
              {/* Price Range */}
              <div>
                <label className="block text-xs font-medium text-[#1C1C1F] mb-1.5">
                  Max Price: <strong className="font-mono tabular-nums">{formatPrice(maxPrice)}</strong>
                </label>
                <input
                  type="range"
                  min={5000}
                  max={40000}
                  step={1000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#B89758] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#7A7875] font-mono mt-1">
                  <span>{formatPrice(5000)}</span>
                  <span>{formatPrice(40000)}</span>
                </div>
              </div>

              {/* Size Filter */}
              <div>
                <label className="block text-xs font-medium text-[#1C1C1F] mb-1.5">
                  Filter by Size
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {availableSizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                        selectedSize === sz
                          ? 'bg-[#1C1C1F] text-white border-[#1C1C1F]'
                          : 'bg-[#FAF8F5] text-[#4A4845] border-[#DDD7CE] hover:border-[#1C1C1F]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* In Stock Only Toggle */}
              <div className="flex items-center sm:justify-end">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-[#1C1C1F]">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded border-[#DDD7CE] text-[#1C1C1F] focus:ring-0 w-4 h-4"
                  />
                  <span>Show only in-stock pieces</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Results Metadata */}
        <div className="flex items-center justify-between text-xs text-[#7A7875] mb-6 px-1">
          <span>
            Showing <strong className="text-[#1C1C1F] font-mono tabular-nums">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'garment' : 'garments'}
          </span>
          {selectedCategory !== 'All' && (
            <span>Filtered by: <strong>{selectedCategory}</strong></span>
          )}
        </div>

        {/* Product Cards Grid */}
        {isLoadingProducts ? (
          <div className="text-center py-20 text-xs text-[#7A7875]">
            Loading catalog items...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#E7E2DA] space-y-4">
            <h3 className="font-serif text-xl font-medium text-[#1C1C1F]">No Matching Garments Found</h3>
            <p className="text-xs text-[#7A7875] max-w-sm mx-auto">
              We couldn&apos;t find any items matching your criteria. Try adjusting your filters or price slider.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-[#1C1C1F] text-white text-xs font-medium rounded-lg hover:bg-[#2D2D32]"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
