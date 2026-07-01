import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Star, RotateCcw, ShieldCheck, Leaf, Filter } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BRANDS_BY_CATEGORY, SUBCATEGORIES_BY_CATEGORY, PRODUCTS } from "../data/products";
import { FilterState } from "../types";

interface FiltersSidebarProps {
  activeCategory: string;
  filters: FilterState;
  setFilters: (filters: FilterState | ((prev: FilterState) => FilterState)) => void;
  resetFilters: () => void;
  mobile?: boolean;
  onCloseMobile?: () => void;
}

export default function FiltersSidebar({
  activeCategory,
  filters,
  setFilters,
  resetFilters,
  mobile = false,
  onCloseMobile
}: FiltersSidebarProps) {
  // Accordion open states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    brand: true,
    rating: true,
    availability: true
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const availableBrands = BRANDS_BY_CATEGORY[activeCategory] || (["Top Offers", "Recommended"].includes(activeCategory) ? Array.from(new Set(PRODUCTS.map(p => p.brand))) : []);
  const availableSubcategories = SUBCATEGORIES_BY_CATEGORY[activeCategory] || [];

  // Handle subcategory checkbox toggle
  const handleSubcategoryToggle = (sub: string) => {
    setFilters((prev) => {
      const isSelected = prev.subcategory.includes(sub);
      const updated = isSelected
        ? prev.subcategory.filter((s) => s !== sub)
        : [...prev.subcategory, sub];
      return { ...prev, subcategory: updated };
    });
  };

  // Handle brand checkbox toggle
  const handleBrandToggle = (brand: string) => {
    setFilters((prev) => {
      const isSelected = prev.brands.includes(brand);
      const updated = isSelected
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand];
      return { ...prev, brands: updated };
    });
  };

  // Handle rating selection (it will filter products with rating >= selectedRating)
  const handleRatingToggle = (rating: number) => {
    setFilters((prev) => {
      const isSelected = prev.ratings.includes(rating);
      const updated = isSelected
        ? prev.ratings.filter((r) => r !== rating)
        : [...prev.ratings, rating];
      return { ...prev, ratings: updated };
    });
  };

  // Handle slider price change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
    const val = parseInt(e.target.value) || 0;
    setFilters((prev) => {
      const range = [...prev.priceRange] as [number, number];
      range[index] = val;
      // Guarantee order
      if (index === 0 && range[0] > range[1]) range[0] = range[1];
      if (index === 1 && range[1] < range[0]) range[1] = range[0];
      return { ...prev, priceRange: range };
    });
  };

  // Generate rating rows
  const ratingOptions = [5, 4, 3];

  return (
    <div className={`flex flex-col h-full bg-white ${mobile ? "p-6" : "w-full py-1"}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-gray-100 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-800" />
          <div>
            <h2 className="font-display font-bold text-lg text-slate-900 leading-none">Filters</h2>
            <p className="text-xs text-gray-400 mt-1">Refine your search</p>
          </div>
        </div>
        
        {/* Reset button shown if filters are dirty */}
        {(filters.subcategory.length > 0 ||
          filters.brands.length > 0 ||
          filters.ratings.length > 0 ||
          filters.priceRange[0] > 0 ||
          filters.priceRange[1] < 2500 ||
          filters.inStockOnly ||
          filters.ecoFriendlyOnly) && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium px-2 py-1 hover:bg-amber-50 rounded-lg transition-all duration-200"
            id="reset-filters-btn"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Accordion scrollable container */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-1 py-1">
        
        {/* Category Accordion */}
        {availableSubcategories.length > 0 && (
          <div className="border-b border-gray-100 pb-4">
            <button
              onClick={() => toggleSection("category")}
              className="w-full flex items-center justify-between text-left font-display font-semibold text-sm text-slate-900 hover:text-black"
              id="toggle-filter-category"
            >
              <span>Category</span>
              {openSections.category ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            
            <AnimatePresence initial={false}>
              {openSections.category && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden mt-3 space-y-2.5"
                >
                  {availableSubcategories.map((sub) => {
                    const isChecked = filters.subcategory.includes(sub);
                    return (
                      <label key={sub} className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-slate-900 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSubcategoryToggle(sub)}
                          className="w-4 h-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                          id={`filter-sub-${sub.toLowerCase()}`}
                        />
                        <span>{sub}</span>
                      </label>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Price Range Accordion */}
        <div className="border-b border-gray-100 pb-4">
          <button
            onClick={() => toggleSection("price")}
            className="w-full flex items-center justify-between text-left font-display font-semibold text-sm text-slate-900 hover:text-black"
            id="toggle-filter-price"
          >
            <span>Price Range</span>
            {openSections.price ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>

          <AnimatePresence initial={false}>
            {openSections.price && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mt-3"
              >
                {/* Visual price range display */}
                <div className="flex items-center justify-between text-xs font-mono text-gray-500 mb-3 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                  <span>${filters.priceRange[0]}</span>
                  <span className="text-gray-300">to</span>
                  <span>${filters.priceRange[1] === 2500 ? "$2,500+" : `$${filters.priceRange[1]}`}</span>
                </div>

                {/* Slider bar */}
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="2500"
                      step="50"
                      value={filters.priceRange[1]}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], val] }));
                      }}
                      className="w-full accent-slate-900 cursor-pointer"
                      id="price-range-slider"
                    />
                  </div>
                  
                  {/* Min / Max manual entry */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-[11px] text-gray-400 font-mono">$</span>
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.priceRange[0] === 0 ? "" : filters.priceRange[0]}
                        onChange={(e) => handlePriceChange(e, 0)}
                        className="w-full pl-6 pr-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:border-slate-400"
                        id="price-min-input"
                      />
                    </div>
                    <span className="text-gray-300 text-xs">-</span>
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-[11px] text-gray-400 font-mono">$</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.priceRange[1] === 2500 ? "" : filters.priceRange[1]}
                        onChange={(e) => handlePriceChange(e, 1)}
                        className="w-full pl-6 pr-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:border-slate-400"
                        id="price-max-input"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Brand Accordion */}
        <div className="border-b border-gray-100 pb-4">
          <button
            onClick={() => toggleSection("brand")}
            className="w-full flex items-center justify-between text-left font-display font-semibold text-sm text-slate-900 hover:text-black"
            id="toggle-filter-brand"
          >
            <span>Brand</span>
            {openSections.brand ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>

          <AnimatePresence initial={false}>
            {openSections.brand && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mt-3 space-y-2.5"
              >
                {availableBrands.map((brand) => {
                  const isChecked = filters.brands.includes(brand);
                  return (
                    <label key={brand} className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-slate-900 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleBrandToggle(brand)}
                        className="w-4 h-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                        id={`filter-brand-${brand.toLowerCase()}`}
                      />
                      <span>{brand}</span>
                    </label>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Rating Accordion */}
        <div className="border-b border-gray-100 pb-4">
          <button
            onClick={() => toggleSection("rating")}
            className="w-full flex items-center justify-between text-left font-display font-semibold text-sm text-slate-900 hover:text-black"
            id="toggle-filter-rating"
          >
            <span>Rating</span>
            {openSections.rating ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>

          <AnimatePresence initial={false}>
            {openSections.rating && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mt-3 space-y-2"
              >
                {ratingOptions.map((rating) => {
                  const isChecked = filters.ratings.includes(rating);
                  return (
                    <button
                      key={rating}
                      onClick={() => handleRatingToggle(rating)}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-left text-xs sm:text-sm transition-all duration-200 ${
                        isChecked 
                          ? "bg-slate-100 text-slate-900 font-semibold" 
                          : "text-gray-600 hover:bg-gray-50 hover:text-black"
                      }`}
                      id={`filter-rating-${rating}`}
                    >
                      <div className="flex items-center text-amber-500 gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < rating ? "fill-current" : "text-gray-200"}`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-500">& Up</span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Availability Accordion */}
        <div>
          <button
            onClick={() => toggleSection("availability")}
            className="w-full flex items-center justify-between text-left font-display font-semibold text-sm text-slate-900 hover:text-black"
            id="toggle-filter-availability"
          >
            <span>Availability</span>
            {openSections.availability ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>

          <AnimatePresence initial={false}>
            {openSections.availability && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mt-3 space-y-3"
              >
                {/* Custom check indicators */}
                <label className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-slate-900 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={filters.inStockOnly}
                    onChange={(e) => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                    id="filter-availability-stock"
                  />
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                    In Stock Only
                  </span>
                </label>

                <label className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-slate-900 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={filters.ecoFriendlyOnly}
                    onChange={(e) => setFilters(prev => ({ ...prev, ecoFriendlyOnly: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                    id="filter-availability-eco"
                  />
                  <span className="flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-emerald-500" />
                    Eco-Friendly
                  </span>
                </label>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Standalone Checkboxes below dividers (matching mockup screenshot exactly!) */}
      {!mobile && (
        <div className="border-t border-gray-100 pt-5 mt-6 space-y-3">
          <label className="flex items-center gap-3 text-sm text-slate-700 hover:text-black cursor-pointer select-none font-medium">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
              id="sidebar-stock-only-btn"
            />
            <span>In Stock Only</span>
          </label>
          
          <label className="flex items-center gap-3 text-sm text-slate-700 hover:text-black cursor-pointer select-none font-medium">
            <input
              type="checkbox"
              checked={filters.ecoFriendlyOnly}
              onChange={(e) => setFilters(prev => ({ ...prev, ecoFriendlyOnly: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
              id="sidebar-eco-friendly-btn"
            />
            <span>Eco-Friendly</span>
          </label>
        </div>
      )}

      {/* Mobile action button */}
      {mobile && (
        <div className="pt-4 border-t border-gray-100 mt-6">
          <button
            onClick={onCloseMobile}
            className="w-full bg-slate-900 text-white font-semibold py-3 rounded-xl hover:bg-slate-800 transition-colors"
            id="mobile-apply-filters-btn"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
}
