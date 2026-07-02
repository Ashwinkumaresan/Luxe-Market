import React from "react";
import { ChevronRight, SlidersHorizontal, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product, FilterState, UserProfile } from "../types";
import Header from "../components/Header";
import FiltersSidebar from "../components/FiltersSidebar";
import ProductCard from "../components/ProductCard";

interface CatalogPageProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchText: string;
  setSearchText: (text: string) => void;
  sortType: "recommended" | "price-asc" | "price-desc" | "rating-desc";
  setSortType: (type: "recommended" | "price-asc" | "price-desc" | "rating-desc") => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  sortedProducts: Product[];
  cartCount: number;
  wishlistCount: number;
  wishlist: Product[];
  userProfile: UserProfile | null;
  setProfileOpen: (open: boolean) => void;
  setMobileFiltersOpen: (open: boolean) => void;
  onAddToCart: (product: Product, color: string) => void;
  onToggleWishlist: (product: Product) => void;
  onCartClick: () => void;
  onWishlistClick: () => void;
  onProfileClick: () => void;
  onProductSelect: (product: Product) => void;
}

export default function CatalogPage({
  activeCategory,
  setActiveCategory,
  searchText,
  setSearchText,
  sortType,
  setSortType,
  filters,
  setFilters,
  resetFilters,
  sortedProducts,
  cartCount,
  wishlistCount,
  wishlist,
  userProfile,
  setProfileOpen,
  setMobileFiltersOpen,
  onAddToCart,
  onToggleWishlist,
  onCartClick,
  onWishlistClick,
  onProfileClick,
  onProductSelect
}: CatalogPageProps) {
  
  // Get dynamic titles for categories
  const getCategoryTitle = () => {
    switch (activeCategory) {
      case "Electronics": return "Premium Electronics";
      case "Fashion": return "Luxury Fashion & Accessories";
      case "Home": return "Curated Home Decor";
      case "Beauty": return "Elite Beauty & Skincare";
      case "Sports": return "Professional Sports & Fitness";
      case "Top Offers": return "Exclusive Top Offers";
      case "Recommended": return "Recommended for You";
      default: return `${activeCategory} Collection`;
    }
  };

  return (
    <>
      <Header
        activeCategory={activeCategory}
        setActiveCategory={(category) => {
          setActiveCategory(category);
        }}
        searchText={searchText}
        setSearchText={setSearchText}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onCartClick={onCartClick}
        onWishlistClick={onWishlistClick}
        onProfileClick={onProfileClick}
        userPoints={userProfile ? userProfile.points : 0}
        userProfile={userProfile}
        onProductSelect={onProductSelect}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb line */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-4 select-none">
          <span className="hover:text-slate-900 cursor-pointer" onClick={() => setActiveCategory("Electronics")}>Home</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <span className="text-slate-950 font-semibold">{activeCategory}</span>
        </div>

        {/* Catalog Banner & Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-slate-950 tracking-tight leading-none" id="main-catalog-title">
              {getCategoryTitle()}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-2 font-medium" id="main-catalog-results-label">
              Showing {sortedProducts.length} results for curated premium items
            </p>
          </div>

          {/* Sort By & Mobile Filter Trigger */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-slate-800 hover:bg-gray-50 transition-colors shadow-sm"
              id="mobile-filters-trigger-btn"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
              <span className="text-xs text-gray-400 font-medium">Sort by:</span>
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value as any)}
                className="text-xs font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer pr-1"
                id="catalog-sort-select"
              >
                <option value="recommended">Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Customer Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Body: Sidebar + Grid */}
        <div className="flex gap-8 items-start">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden md:block shrink-0 w-64" id="desktop-filters-sidebar">
            <div className="sticky top-36 max-h-[calc(100vh-11rem)] overflow-y-auto scrollbar-none bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
              <FiltersSidebar
                activeCategory={activeCategory}
                filters={filters}
                setFilters={setFilters}
                resetFilters={resetFilters}
              />
            </div>
          </aside>

          {/* Products Catalog Display Grid */}
          <div className="flex-1">
            <AnimatePresence mode="popLayout">
              {sortedProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-3xl text-center p-6 shadow-sm"
                  id="catalog-empty-state"
                >
                  <div className="p-4 bg-slate-50 text-slate-400 rounded-full mb-4">
                    <SlidersHorizontal className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-bold text-slate-900 text-lg">No matches found</h3>
                  <p className="text-sm text-gray-500 max-w-sm mt-1.5 leading-relaxed">
                    Try refining your filters or query terms. We couldn't find any luxury items matching your current requirements.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-6 flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 text-white font-semibold rounded-xl text-xs hover:bg-slate-800 transition-all shadow-sm shadow-slate-200"
                    id="catalog-reset-filters-btn"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset All Filters
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                  id="catalog-products-grid"
                >
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={(p: Product, col: string) => onAddToCart(p, col)}
                      onToggleWishlist={(p: Product) => onToggleWishlist(p)}
                      isWishlisted={wishlist.some((p) => p.id === product.id)}
                      onProductClick={(p: Product) => onProductSelect(p)}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-white mt-20 border-t border-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <span className="font-display font-bold text-lg tracking-wider text-white">
              LUXE <span className="font-light text-slate-400">MARKET</span>
            </span>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              Curating premium consumer items with exquisite craftsmanship and timeless designs for our global members.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-3">Shop Collections</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-white cursor-pointer" onClick={() => { setActiveCategory("Electronics"); }}>High-End Electronics</li>
              <li className="hover:text-white cursor-pointer" onClick={() => { setActiveCategory("Fashion"); }}>Designer Apparel</li>
              <li className="hover:text-white cursor-pointer" onClick={() => { setActiveCategory("Home"); }}>Curated Home Decor</li>
              <li className="hover:text-white cursor-pointer" onClick={() => { setActiveCategory("Beauty"); }}>Premium Skincare</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-3">Luxe Assurances</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-white">Complimentary Priority Delivery</li>
              <li className="hover:text-white">2-Year Luxury Protection Cover</li>
              <li className="hover:text-white">24/7 Dedicated Concierge Support</li>
              <li className="hover:text-white">FSC Organic Eco Certifications</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-3">Newsletter</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">Join our private circle to unlock priority drops.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 min-w-0 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-sans placeholder-slate-500 focus:outline-none focus:border-slate-700"
              />
              <button className="bg-white text-slate-950 font-bold px-4 py-2 rounded-lg text-xs hover:bg-slate-100 transition-colors shrink-0">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-900 mt-12 pt-6 text-center text-[11px] text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>© 2026 Luxe Market. All Rights Reserved. Private membership terms apply.</div>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span className="hover:underline cursor-pointer">Support</span>
          </div>
        </div>
      </footer>
    </>
  );
}
