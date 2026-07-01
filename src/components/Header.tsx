import React, { useState, useEffect } from "react";
import { Search, Heart, User, ShoppingBag, Menu, X, Sparkles, ArrowLeft, History, TrendingUp, Star, Tag, Flame, Cpu, Shirt, Home, Dumbbell } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CATEGORIES, PRODUCTS } from "../data/products";
import { UserProfile, Product } from "../types";

const TRENDING_SEARCHES = [
  "Wireless Headphones",
  "Leather Chelsea Boots",
  "Walnut Desk Organizer",
  "Peptide Serum",
  "Carbon Road Bike",
  "Geometric Brass Lamp"
];

const POPULAR_BRANDS = ["Aurum", "Solis", "Aether", "Vellum", "Terra"];

interface SuggestionItem {
  phrase: string;
  category?: string;
}

function getSuggestionsList(query: string): SuggestionItem[] {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  const suggestions: SuggestionItem[] = [];
  const phrasesSet = new Set<string>();

  // Find products matching query
  const matchedProds = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );

  // 1. Suggest category scopes first, e.g. "headphones in Electronics"
  matchedProds.forEach((p) => {
    const subcat = p.subcategory;
    const cat = p.category;
    const key = `${subcat.toLowerCase()} in ${cat.toLowerCase()}`;
    if (!phrasesSet.has(key)) {
      phrasesSet.add(key);
      suggestions.push({
        phrase: subcat,
        category: cat,
      });
    }
  });

  // 2. Suggest full brand names if matched
  const matchedBrands = Array.from(new Set(PRODUCTS.map((p) => p.brand))).filter((b) =>
    b.toLowerCase().includes(q)
  );
  matchedBrands.forEach((b) => {
    const key = b.toLowerCase();
    if (!phrasesSet.has(key)) {
      phrasesSet.add(key);
      suggestions.push({ phrase: b });
    }
  });

  // 3. Suggest full product names
  matchedProds.forEach((p) => {
    const key = p.name.toLowerCase();
    if (!phrasesSet.has(key)) {
      phrasesSet.add(key);
      suggestions.push({ phrase: p.name });
    }
  });

  return suggestions.slice(0, 6);
}

function getMatchingProducts(query: string): Product[] {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  ).slice(0, 4);
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query || !query.trim()) return text;
  const q = query.toLowerCase();
  const idx = text.toLowerCase().indexOf(q);
  if (idx === -1) return text;
  
  const before = text.substring(0, idx);
  const match = text.substring(idx, idx + query.length);
  const after = text.substring(idx + query.length);
  
  return (
    <>
      {before}
      <span className="font-bold text-slate-950">{match}</span>
      {after}
    </>
  );
}

interface HeaderProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  searchText: string;
  setSearchText: (text: string) => void;
  cartCount: number;
  wishlistCount: number;
  onCartClick: () => void;
  onWishlistClick: () => void;
  onProfileClick: () => void;
  userPoints: number;
  userProfile: UserProfile | null;
  onProductSelect?: (product: Product) => void;
}

export default function Header({
  activeCategory,
  setActiveCategory,
  searchText,
  setSearchText,
  cartCount,
  wishlistCount,
  onCartClick,
  onWishlistClick,
  onProfileClick,
  userPoints,
  userProfile,
  onProductSelect
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("luxe_recent_searches");
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Error loading recent searches", e);
    }
  }, []);

  const saveRecentSearch = (term: string) => {
    if (!term || !term.trim()) return;
    const trimmed = term.trim();
    const updated = [trimmed, ...recentSearches.filter((s) => s !== trimmed)].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem("luxe_recent_searches", JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving recent search", e);
    }
  };

  const removeRecentSearch = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== term);
    setRecentSearches(updated);
    try {
      localStorage.setItem("luxe_recent_searches", JSON.stringify(updated));
    } catch (e) {
      console.error("Error removing recent search", e);
    }
  };

  // Dynamic placeholder text
  const getPlaceholder = () => {
    switch (activeCategory) {
      case "Electronics": return "Search premium tech...";
      case "Fashion": return "Search luxury style...";
      case "Home": return "Search curated home decor...";
      case "Beauty": return "Search elite cosmetics & beauty...";
      case "Sports": return "Search professional gear...";
      default: return "Search Luxe Market...";
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2 sm:gap-4">
          
          {/* Logo & Mobile Menu Button */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-gray-700 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Open menu"
              id="mobile-menu-btn"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>

            <button 
              onClick={() => {
                setActiveCategory("Electronics");
                setSearchText("");
              }}
              className="flex items-center cursor-pointer"
              id="logo-btn"
            >
              <span className="font-display font-bold text-lg min-[375px]:text-xl sm:text-2xl tracking-wider text-slate-900 select-none">
                LUXE <span className="font-light text-gray-500">MARKET</span>
              </span>
            </button>
          </div>

          {/* Search container - occupying the center navbar space */}
          <div className="relative hidden sm:block flex-1 max-w-xl mx-2 lg:mx-8">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder={getPlaceholder()}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 250)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  saveRecentSearch(searchText);
                  (e.target as HTMLInputElement).blur();
                }
              }}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-sm font-sans placeholder-gray-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all duration-200"
              id="desktop-search-input"
            />
            {searchText && (
              <button
                onClick={() => setSearchText("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                id="clear-search-btn"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Amazon-style desktop search recommendations dropdown */}
            {isFocused && (
              <div 
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-150 rounded-2xl shadow-xl z-50 p-4 max-h-[485px] overflow-y-auto scrollbar-none"
                onMouseDown={(e) => e.preventDefault()}
              >
                {!searchText.trim() ? (
                  <div className="space-y-4">
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div>
                        <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1.5 select-none">
                          Recent Searches
                        </div>
                        <div className="space-y-0.5">
                          {recentSearches.map((term, i) => (
                            <div
                              key={i}
                              onClick={() => {
                                setSearchText(term);
                                saveRecentSearch(term);
                                setIsFocused(false);
                              }}
                              className="flex items-center justify-between px-2.5 py-1.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-black rounded-lg cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-2.5">
                                <History className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{term}</span>
                              </div>
                              <button
                                onClick={(e) => removeRecentSearch(term, e)}
                                className="p-0.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Trending Searches */}
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1.5 select-none">
                        Trending Searches
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {TRENDING_SEARCHES.map((term, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              setSearchText(term);
                              saveRecentSearch(term);
                              setIsFocused(false);
                            }}
                            className="flex items-center gap-2 px-3 py-2 bg-slate-50/50 hover:bg-slate-50 text-xs text-slate-700 hover:text-black rounded-xl cursor-pointer transition-colors"
                          >
                            <TrendingUp className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{term}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Popular Brands */}
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1.5 select-none">
                        Popular Brands
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {POPULAR_BRANDS.map((brand, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setSearchText(brand);
                              saveRecentSearch(brand);
                              setIsFocused(false);
                            }}
                            className="px-3 py-1 bg-slate-50 hover:bg-slate-900 hover:text-white border border-slate-200/40 text-xs font-medium text-slate-700 rounded-full transition-all"
                          >
                            {brand}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Autocomplete Suggestions */}
                    <div className="md:col-span-6 space-y-4">
                      <div>
                        <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2 select-none">
                          Suggestions
                        </div>
                        <div className="space-y-0.5">
                          {getSuggestionsList(searchText).map((item, i) => (
                            <div
                              key={i}
                              onClick={() => {
                                setSearchText(item.phrase);
                                saveRecentSearch(item.phrase);
                                if (item.category) {
                                  setActiveCategory(item.category);
                                }
                                setIsFocused(false);
                              }}
                              className="flex items-center gap-2.5 px-2.5 py-1.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-black rounded-lg cursor-pointer transition-colors"
                            >
                              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <div className="truncate text-slate-700">
                                {highlightMatch(item.phrase, searchText)}
                                {item.category && (
                                  <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full font-bold ml-2">
                                    in {item.category}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}

                          {getSuggestionsList(searchText).length === 0 && (
                            <div className="text-xs text-slate-400 italic px-2.5 py-2">
                              No suggestions matching "{searchText}"
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Recommended Products */}
                    <div className="md:col-span-6 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4 space-y-3">
                      <div>
                        <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2 select-none">
                          Products
                        </div>
                        <div className="space-y-2">
                          {getMatchingProducts(searchText).map((prod) => (
                            <div
                              key={prod.id}
                              onClick={() => {
                                saveRecentSearch(prod.name);
                                setIsFocused(false);
                                if (onProductSelect) {
                                  onProductSelect(prod);
                                }
                              }}
                              className="flex items-center gap-2.5 p-1.5 hover:bg-slate-50 rounded-xl cursor-pointer transition-all duration-200"
                            >
                              <div className="w-10 h-10 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 shrink-0 flex items-center justify-center">
                                <img
                                  src={prod.image}
                                  alt={prod.name}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-slate-900 truncate">
                                  {prod.name}
                                </h4>
                                <p className="text-[9px] text-slate-400 font-medium mt-0.5">
                                  {prod.brand} • {prod.category}
                                </p>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="font-mono text-xs font-bold text-slate-950">
                                  ${prod.price.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          ))}

                          {getMatchingProducts(searchText).length === 0 && (
                            <div className="text-xs text-slate-400 italic py-2">
                              No products found
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearching(!isSearching)}
              className="sm:hidden p-1.5 text-gray-700 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Toggle search"
              id="mobile-search-toggle"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Favorites Icon */}
            {userProfile && (
              <button
                onClick={onWishlistClick}
                className="relative p-1.5 text-gray-700 hover:text-[#1e3a8a] hover:bg-blue-50/50 rounded-full transition-all duration-300"
                aria-label="Wishlist"
                id="wishlist-btn"
              >
                <Heart className={`w-5 h-5 ${wishlistCount > 0 ? "fill-[#1e3a8a] text-[#1e3a8a]" : ""}`} />
                <AnimatePresence>
                  {wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-[#1e3a8a] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm"
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            )}

            {/* Profile Button with Loyalty point indicator */}
            {userProfile ? (
              <button
                onClick={onProfileClick}
                className="flex items-center gap-1 p-1.5 sm:p-2 text-gray-700 hover:text-slate-900 hover:bg-gray-50 rounded-full transition-all duration-300"
                aria-label="Profile"
                id="profile-btn"
              >
                <div className="relative">
                  <User className="w-5 h-5" />
                  <span className="absolute -bottom-1 -right-1 bg-emerald-500 border border-white w-2.5 h-2.5 rounded-full" />
                </div>
              </button>
            ) : (
              <button
                onClick={onProfileClick}
                className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-black rounded-full font-semibold text-xs tracking-wide transition-all duration-200 active:scale-[0.98]"
                id="login-btn-header"
              >
                <User className="w-3.5 h-3.5 text-slate-600" />
                <span>Sign In</span>
              </button>
            )}

            {/* Cart Icon */}
            {userProfile && (
              <button
                onClick={onCartClick}
                className="relative p-2 sm:p-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-full transition-all duration-300 shadow-sm flex items-center justify-center"
                aria-label="Cart"
                id="cart-btn"
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0, y: 5 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0, y: 5 }}
                      className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm border border-slate-900"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            )}

          </div>
        </div>

        {/* Separate Categories Div Below Navbar with Horizontal Scroll */}
        <div className="border-t border-gray-100/80 py-2 overflow-x-auto scrollbar-none flex justify-start md:justify-center" id="horizontal-categories-scroll">
          <div className="flex items-center gap-1 md:gap-2 whitespace-nowrap px-1">
            
            {/* Top Offers tab */}
            <button
              onClick={() => {
                setActiveCategory("Top Offers");
                setSearchText("");
              }}
              className={`relative px-4 py-1.5 font-medium text-xs md:text-sm tracking-wide rounded-full transition-all duration-300 flex items-center gap-1.5 ${
                activeCategory === "Top Offers" 
                  ? "text-amber-600 bg-amber-50 font-bold" 
                  : "text-amber-600/80 hover:text-amber-600 hover:bg-amber-50/50"
              }`}
              id="nav-cat-top-offers"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Top Offers</span>
            </button>

            {/* Recommended tab */}
            <button
              onClick={() => {
                setActiveCategory("Recommended");
                setSearchText("");
              }}
              className={`relative px-4 py-1.5 font-medium text-xs md:text-sm tracking-wide rounded-full transition-all duration-300 flex items-center gap-1.5 ${
                activeCategory === "Recommended" 
                  ? "text-rose-600 bg-rose-50 font-bold" 
                  : "text-rose-600/80 hover:text-rose-600 hover:bg-rose-50/50"
              }`}
              id="nav-cat-recommended"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Recommended</span>
            </button>

            {/* Separator divider */}
            <div className="h-4 w-[1px] bg-gray-200 mx-2" />

            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setSearchText(""); // Clear search when switching category
                  }}
                  className={`relative px-4 py-1.5 font-medium text-xs md:text-sm tracking-wide rounded-full transition-all duration-300 ${
                    isActive 
                      ? "text-slate-950 font-semibold" 
                      : "text-gray-500 hover:text-slate-900 hover:bg-gray-50"
                  }`}
                  id={`nav-cat-${category.toLowerCase()}`}
                >
                  <span className="relative z-10">{category}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryIndicator"
                      className="absolute inset-0 bg-slate-100 rounded-full -z-0"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </header>

    {/* Mobile/Desktop Left Drawer Navigation Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-50 p-6 flex flex-col justify-between shadow-2xl"
            >
              <div className="overflow-y-auto pr-1 scrollbar-none">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-display font-bold text-lg tracking-wider text-slate-900">
                    LUXE <span className="font-light text-gray-400">MARKET</span>
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-all duration-200"
                    id="mobile-close-menu-btn"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Section 1: Exclusive Offers & Picks */}
                <div className="space-y-1.5 mb-6">
                  <div className="text-[11px] font-bold text-gray-400 tracking-widest uppercase mb-3">Exclusive Offers</div>
                  
                  {/* Top Offers */}
                  <button
                    onClick={() => {
                      setActiveCategory("Top Offers");
                      setSearchText("");
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl font-medium text-base tracking-wide flex items-center justify-between transition-all duration-200 ${
                      activeCategory === "Top Offers"
                        ? "bg-amber-500 text-slate-950 font-semibold shadow-sm"
                        : "text-gray-700 hover:bg-amber-50 hover:text-amber-950"
                    }`}
                    id="mobile-nav-top-offers"
                  >
                    <div className="flex items-center gap-3">
                      <Tag className={`w-5 h-5 ${activeCategory === "Top Offers" ? "text-slate-950" : "text-amber-500"}`} />
                      <span>Top Offers</span>
                    </div>
                    {activeCategory === "Top Offers" ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                    ) : (
                      <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-bold">Hot</span>
                    )}
                  </button>

                  {/* Recommended */}
                  <button
                    onClick={() => {
                      setActiveCategory("Recommended");
                      setSearchText("");
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl font-medium text-base tracking-wide flex items-center justify-between transition-all duration-200 ${
                      activeCategory === "Recommended"
                        ? "bg-slate-900 text-white font-semibold shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:text-black"
                    }`}
                    id="mobile-nav-recommended"
                  >
                    <div className="flex items-center gap-3">
                      <Flame className={`w-5 h-5 ${activeCategory === "Recommended" ? "text-amber-400" : "text-amber-500 animate-pulse"}`} />
                      <span>Recommended</span>
                    </div>
                    {activeCategory === "Recommended" ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    ) : (
                      <span className="text-xs bg-rose-50 text-rose-600 px-2.5 py-0.5 rounded-full font-bold">New</span>
                    )}
                  </button>
                </div>

                {/* Section 2: Standard Categories */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-gray-400 tracking-widest uppercase mb-3">Shop Collections</div>
                  {CATEGORIES.map((category) => {
                    const isActive = activeCategory === category;
                    const getCategoryIcon = (cat: string) => {
                      switch (cat) {
                        case "Electronics": return <Cpu className="w-5 h-5" />;
                        case "Fashion": return <Shirt className="w-5 h-5" />;
                        case "Home": return <Home className="w-5 h-5" />;
                        case "Beauty": return <Sparkles className="w-5 h-5 text-pink-500" />;
                        case "Sports": return <Dumbbell className="w-5 h-5" />;
                        default: return <Star className="w-5 h-5" />;
                      }
                    };
                    return (
                      <button
                        key={category}
                        onClick={() => {
                          setActiveCategory(category);
                          setSearchText("");
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl font-medium text-base tracking-wide flex items-center justify-between transition-all duration-200 ${
                          isActive 
                            ? "bg-slate-950 text-white shadow-sm" 
                            : "text-gray-700 hover:bg-gray-50 hover:text-black"
                        }`}
                        id={`mobile-nav-${category.toLowerCase()}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={isActive ? "text-amber-400" : "text-gray-400"}>
                            {getCategoryIcon(category)}
                          </span>
                          <span>{category}</span>
                        </div>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Info inside Drawer */}
              <div className="border-t border-gray-100 pt-6">
                {userProfile ? (
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100 mb-4">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-emerald-800 font-medium">{userProfile.tier} Member Balance</div>
                      <div className="text-base font-bold text-emerald-950">{userPoints} Loyalty Points</div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onProfileClick();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl mb-4 transition-all active:scale-[0.98]"
                    id="mobile-drawer-login-btn"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In to Account</span>
                  </button>
                )}
                <div className="text-center text-xs text-gray-400">
                  Secure Luxury E-Commerce Marketplace
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Separate Search Page Overlay */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="fixed inset-0 bg-[#fafafa] z-[999] flex flex-col font-sans overflow-hidden sm:hidden"
            id="mobile-search-page"
          >
            {/* Header / Search bar */}
            <div className="bg-white border-b border-slate-100 py-3.5 px-4 flex items-center gap-3 shrink-0">
              <button
                onClick={() => setIsSearching(false)}
                className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-all"
                aria-label="Back"
                id="mobile-search-back-btn"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search products, brands, styles..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      saveRecentSearch(searchText);
                      setIsSearching(false);
                    }
                  }}
                  className="w-full pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-100 rounded-full text-sm font-sans placeholder-gray-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all duration-200"
                  autoFocus
                  id="mobile-fullscreen-search-input"
                />
                {searchText && (
                  <button
                    onClick={() => setSearchText("")}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600"
                    id="mobile-fullscreen-clear-btn"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Recommendations Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
              {!searchText.trim() ? (
                <div className="space-y-6">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-400 tracking-wider uppercase mb-2 select-none">
                        <span>Recent Searches</span>
                      </div>
                      <div className="space-y-1 bg-white border border-slate-100 rounded-2xl p-2 shadow-sm">
                        {recentSearches.map((term, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              setSearchText(term);
                              saveRecentSearch(term);
                              setIsSearching(false);
                            }}
                            className="flex items-center justify-between px-3 py-2.5 text-sm text-slate-700 active:bg-slate-50 hover:text-black rounded-xl cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <History className="w-4 h-4 text-slate-400 shrink-0" />
                              <span className="font-medium text-slate-800">{term}</span>
                            </div>
                            <button
                              onClick={(e) => removeRecentSearch(term, e)}
                              className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trending Searches */}
                  <div>
                    <div className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-2 select-none">
                      <span>Trending Searches</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {TRENDING_SEARCHES.map((term, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setSearchText(term);
                            saveRecentSearch(term);
                            setIsSearching(false);
                          }}
                          className="flex items-center gap-2.5 px-4 py-3 bg-white border border-slate-100 rounded-xl text-sm font-semibold text-slate-800 active:bg-slate-50 shadow-sm transition-colors"
                        >
                          <TrendingUp className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{term}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Popular Brands */}
                  <div>
                    <div className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-2.5 select-none">
                      <span>Popular Brands</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_BRANDS.map((brand, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setSearchText(brand);
                            saveRecentSearch(brand);
                            setIsSearching(false);
                          }}
                          className="px-4 py-2 bg-white active:bg-slate-900 active:text-white border border-slate-200/60 text-xs font-bold text-slate-700 rounded-full shadow-sm transition-all"
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Suggestions List */}
                  <div>
                    <div className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-2 select-none">
                      <span>Suggestions</span>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-2xl p-2 shadow-sm space-y-0.5">
                      {getSuggestionsList(searchText).map((item, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setSearchText(item.phrase);
                            saveRecentSearch(item.phrase);
                            if (item.category) {
                              setActiveCategory(item.category);
                            }
                            setIsSearching(false);
                          }}
                          className="flex items-center gap-3 px-3 py-3 text-sm text-slate-700 active:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                        >
                          <Search className="w-4 h-4 text-slate-400 shrink-0" />
                          <div className="truncate font-semibold text-slate-800 font-sans">
                            {highlightMatch(item.phrase, searchText)}
                            {item.category && (
                              <span className="text-[11px] text-indigo-500 font-bold bg-indigo-50 px-2 py-0.5 rounded-full ml-2">
                                in {item.category}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}

                      {getSuggestionsList(searchText).length === 0 && (
                        <div className="text-xs text-slate-400 italic p-4 text-center">
                          No suggestions found for "{searchText}"
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Matching Products */}
                  <div>
                    <div className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-2 select-none">
                      <span>Matching Products</span>
                    </div>
                    <div className="space-y-3">
                      {getMatchingProducts(searchText).map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => {
                            saveRecentSearch(prod.name);
                            setIsSearching(false);
                            if (onProductSelect) {
                              onProductSelect(prod);
                            }
                          }}
                          className="flex items-center gap-3.5 p-3 bg-white border border-slate-100 rounded-2xl active:bg-slate-50 shadow-sm transition-all"
                        >
                          <div className="w-14 h-14 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 shrink-0 flex items-center justify-center">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                              {prod.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-bold mt-1">
                              {prod.brand} • {prod.category}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-mono text-xs font-bold text-slate-950">
                              ${prod.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}

                      {getMatchingProducts(searchText).length === 0 && (
                        <div className="text-xs text-slate-400 italic p-4 text-center">
                          No products found matching "{searchText}"
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
