import React, { useState, useMemo } from "react";
import { 
  ArrowLeft, Heart, Trash2, ShoppingCart, Share2, 
  Plus, Grid, List, ChevronDown, Check, Search, User, ShoppingBag
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product, UserProfile } from "../types";

interface WishlistPageProps {
  wishlist: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product, color: string, qty: number, size?: string) => void;
  onProductSelect: (product: Product) => void;
  onBackToCatalog: () => void;
  cartCount: number;
  userProfile: UserProfile | null;
  onProfileClick: () => void;
  onCartClick: () => void;
}

export default function WishlistPage({
  wishlist,
  onRemoveFromWishlist,
  onAddToCart,
  onProductSelect,
  onBackToCatalog,
  cartCount,
  userProfile,
  onProfileClick,
  onCartClick
}: WishlistPageProps) {
  // Lists and filtering state
  const [activeList, setActiveList] = useState<string>("All Items");
  const [lists, setLists] = useState<string[]>(["All Items", "Shoes", "Apparel", "Gift Ideas"]);
  const [showNewListModal, setShowNewListModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  
  // Sorting state
  const [sortBy, setSortBy] = useState<"Recently Added" | "Price: Low to High" | "Price: High to Low" | "Rating">("Recently Added");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  // View mode state (Grid vs List)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Notification / Share states
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Pre-seed attributes / colors / sizes to match the beautiful layout if not already defined
  const getProductDisplayAttributes = (product: Product) => {
    // If we have custom details for these items, we display them, otherwise fallback to defaults
    if (product.name.includes("Sneaker")) {
      return {
        badge: { text: "PRICE DROP", style: "bg-[#1e3a8a] text-white" },
        attributes: "Color: Triple Black · Size: 8",
        priceNote: `Price dropped $${(product.originalPrice || 200) - product.price}`,
        priceNoteStyle: "text-emerald-600 font-semibold"
      };
    }
    if (product.name.includes("Blazer")) {
      return {
        badge: { text: "LOW STOCK", style: "bg-orange-500 text-white" },
        attributes: "Color: Charcoal · Size: 40R",
        priceNote: "Only 2 left",
        priceNoteStyle: "text-orange-600 font-semibold"
      };
    }
    if (product.name.includes("Chronograph") || product.name.includes("Watch")) {
      return {
        badge: { text: "BACK IN STOCK", style: "bg-emerald-600 text-white" },
        attributes: "Material: Stainless Steel · 42mm",
        priceNote: null,
        priceNoteStyle: ""
      };
    }
    if (product.name.includes("Carryall") || product.name.includes("Bag") || product.stock === 0) {
      return {
        badge: { text: "OUT OF STOCK", style: "bg-slate-400 text-white" },
        attributes: "Color: Mahogany · One Size",
        priceNote: "Out of Stock",
        priceNoteStyle: "text-slate-400 font-semibold"
      };
    }
    if (product.name.includes("Headphones")) {
      return {
        badge: { text: "LOW STOCK", style: "bg-orange-500 text-white" },
        attributes: "Color: Alpine White · Silver",
        priceNote: "Only 5 left",
        priceNoteStyle: "text-orange-600 font-semibold"
      };
    }
    if (product.name.includes("Chinos")) {
      return {
        badge: { text: "PRICE DROP", style: "bg-[#1e3a8a] text-white" },
        attributes: "Color: Sand · Size: 32/32",
        priceNote: `Price dropped $${(product.originalPrice || 125) - product.price}`,
        priceNoteStyle: "text-emerald-600 font-semibold"
      };
    }
    if (product.name.includes("Pullover") || product.name.includes("Sweater")) {
      return {
        badge: null,
        attributes: "Color: Navy · Size: L",
        priceNote: null,
        priceNoteStyle: ""
      };
    }
    if (product.name.includes("Candle")) {
      return {
        badge: null,
        attributes: "Set of 3 · Signature Blends",
        priceNote: null,
        priceNoteStyle: ""
      };
    }

    // Dynamic defaults for general products
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const isLowStock = product.stock > 0 && product.stock <= 5;
    
    return {
      badge: product.stock === 0 
        ? { text: "OUT OF STOCK", style: "bg-slate-400 text-white" } 
        : isLowStock 
          ? { text: "LOW STOCK", style: "bg-orange-500 text-white" } 
          : hasDiscount 
            ? { text: "PRICE DROP", style: "bg-[#1e3a8a] text-white" } 
            : product.isBestSeller 
              ? { text: "BEST SELLER", style: "bg-slate-800 text-white" }
              : null,
      attributes: `Category: ${product.category} · Brand: ${product.brand}`,
      priceNote: isLowStock 
        ? `Only ${product.stock} left` 
        : hasDiscount 
          ? `Price dropped $${((product.originalPrice || 0) - product.price).toFixed(0)}` 
          : null,
      priceNoteStyle: isLowStock ? "text-orange-600 font-semibold" : "text-emerald-600 font-semibold"
    };
  };

  // Filtering products
  const filteredProducts = useMemo(() => {
    let result = [...wishlist];

    // Filter based on selected list category
    if (activeList !== "All Items") {
      if (activeList === "Shoes") {
        result = result.filter(p => p.subcategory?.toLowerCase() === "shoes" || p.name.toLowerCase().includes("sneaker") || p.name.toLowerCase().includes("boot"));
      } else if (activeList === "Apparel") {
        result = result.filter(p => p.subcategory?.toLowerCase().includes("apparel") || p.subcategory?.toLowerCase().includes("outerwear") || p.name.toLowerCase().includes("blazer") || p.name.toLowerCase().includes("pullover") || p.name.toLowerCase().includes("chinos"));
      } else if (activeList === "Gift Ideas") {
        result = result.filter(p => p.ecoFriendly || p.points > 100 || p.rating >= 4.8 || p.name.toLowerCase().includes("candle") || p.name.toLowerCase().includes("watch") || p.name.toLowerCase().includes("chronograph"));
      } else {
        // Dynamic custom list (just matches subcategory or category for fun, or defaults to everything)
        result = result.filter(p => p.category === activeList || p.subcategory === activeList);
      }
    }

    // Sort products
    if (sortBy === "Price: Low to High") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High to Low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "Rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [wishlist, activeList, sortBy]);

  // Handle Create List
  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      const sanitized = newListName.trim();
      if (!lists.includes(sanitized)) {
        setLists([...lists, sanitized]);
        setActiveList(sanitized);
        triggerToast(`List "${sanitized}" created successfully!`);
      }
      setNewListName("");
      setShowNewListModal(false);
    }
  };

  // Copy link
  const handleShareWishlist = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl).then(() => {
      triggerToast("Wishlist link copied to clipboard!");
    }).catch(() => {
      triggerToast("Failed to copy link.");
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] font-sans relative" id="wishlist-page-view">
      
      {/* FREE SHIPPING BAR */}
      <div className="bg-black text-white text-[10px] sm:text-xs font-semibold py-2.5 px-4 text-center tracking-[0.15em] select-none" id="shipping-banner">
        FREE SHIPPING ON ORDERS OVER $75
      </div>

      {/* HEADER BAR */}
      <header className="bg-white border-b border-gray-100 py-5 sticky top-0 z-40 shadow-[0_2px_15px_rgba(0,0,0,0.015)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Back Button */}
          <button 
            onClick={onBackToCatalog}
            className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors shrink-0"
            id="continue-shopping-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Continue Shopping</span>
          </button>

          {/* Logo */}
          <button 
            onClick={onBackToCatalog}
            className="flex items-center"
            id="cart-logo-btn"
          >
            <span className="font-sans font-bold text-lg sm:text-xl tracking-[0.15em] text-slate-900 uppercase">
              LUXE<span className="font-light text-gray-500">MARKET</span>
            </span>
          </button>

          {/* Navigation Action Icons */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            <button
              onClick={onBackToCatalog}
              className="p-2 text-gray-700 hover:text-slate-900 hover:bg-gray-50 rounded-full transition-all"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-slate-600" />
            </button>
            <button
              onClick={onProfileClick}
              className="p-2 text-gray-700 hover:text-slate-900 hover:bg-gray-50 rounded-full transition-all"
              aria-label="Profile"
              id="cart-profile-btn"
            >
              <User className="w-5 h-5 text-slate-600" />
            </button>
            <button
              onClick={onCartClick}
              className="relative p-2 text-gray-700 hover:text-slate-900 hover:bg-gray-50 rounded-full transition-all"
              aria-label="Cart"
              id="wishlist-cart-btn"
            >
              <ShoppingBag className="w-5 h-5 text-slate-600" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#1e3a8a] text-[9px] font-bold text-white rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* TOAST MESSAGE */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl text-xs font-semibold shadow-xl flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTAINER */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Title Block */}
        <div className="mb-8">
          <h1 className="font-sans font-bold text-2xl sm:text-3xl text-slate-950 tracking-tight">
            Your Favorites
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
            ({wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved)
          </p>
        </div>

        {/* Toolbar & Filter Panel */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          
          {/* Horizontal List Filters */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 select-none shrink-0 max-w-full">
            {lists.map((listName) => (
              <button
                key={listName}
                onClick={() => setActiveList(listName)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  activeList === listName
                    ? "bg-[#1e3a8a] text-white shadow-sm"
                    : "bg-[#f1f3f9] hover:bg-slate-200 text-slate-600"
                }`}
              >
                {listName}
              </button>
            ))}
            
            {/* Create New List Button */}
            <button
              onClick={() => setShowNewListModal(true)}
              className="px-5 py-2.5 rounded-full text-xs font-bold border border-dashed border-slate-300 hover:border-[#1e3a8a] text-slate-500 hover:text-[#1e3a8a] bg-transparent flex items-center gap-1.5 transition-all shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New List</span>
            </button>
          </div>

          {/* Sort Menu and Layout Switcher */}
          <div className="flex items-center gap-3 self-end md:self-center shrink-0">
            
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:border-slate-300 transition-colors flex items-center gap-2 select-none"
              >
                <span className="text-slate-400 font-semibold">Sort:</span>
                <span>{sortBy}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <AnimatePresence>
                {showSortDropdown && (
                  <>
                    {/* Click-out overlay */}
                    <div className="fixed inset-0 z-40" onClick={() => setShowSortDropdown(false)} />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden py-1"
                    >
                      {(["Recently Added", "Price: Low to High", "Price: High to Low", "Rating"] as const).map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setSortBy(opt);
                            setShowSortDropdown(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left text-xs font-bold transition-colors flex items-center justify-between ${
                            sortBy === opt 
                              ? "bg-slate-50 text-[#1e3a8a]" 
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span>{opt}</span>
                          {sortBy === opt && <Check className="w-3.5 h-3.5 text-[#1e3a8a]" />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Layout Toggle */}
            <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden p-0.5 h-[38px]">
              <button
                onClick={() => setViewMode("grid")}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-[#1e3a8a] text-white"
                    : "text-slate-400 hover:text-slate-600"
                }`}
                aria-label="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-[#1e3a8a] text-white"
                    : "text-slate-400 hover:text-slate-600"
                }`}
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* WISHLIST CONTENT */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100/80 max-w-lg mx-auto mt-10 shadow-sm">
            <div className="w-16 h-16 bg-blue-50/50 text-[#1e3a8a] rounded-full flex items-center justify-center mb-5 mx-auto">
              <Heart className="w-7 h-7 fill-[#1e3a8a]" />
            </div>
            <h2 className="font-sans font-bold text-lg text-slate-900 mb-2">No Saved Items Found</h2>
            <p className="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
              {wishlist.length === 0 
                ? "Your wishlist is empty. Browse our premium collections and click the heart icon on any product to save it here."
                : `You don't have any saved items under the "${activeList}" list. Explore your other lists or add more favorites.`}
            </p>
            <button
              onClick={onBackToCatalog}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-md active:scale-95"
            >
              Explore Catalog
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => {
                const layoutDetails = getProductDisplayAttributes(product);
                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white rounded-[22px] border border-slate-100/60 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group h-full p-4"
                  >
                    {/* Card Upper: Image & Badges */}
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100/50 flex items-center justify-center shrink-0">
                      
                      {/* Product Image */}
                      <img
                        src={product.image}
                        alt={product.name}
                        onClick={() => onProductSelect(product)}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04] cursor-pointer"
                      />

                      {/* Badge (Top-Left) */}
                      {layoutDetails.badge && (
                        <span className={`absolute top-3.5 left-3.5 text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-sm uppercase ${layoutDetails.badge.style}`}>
                          {layoutDetails.badge.text}
                        </span>
                      )}

                      {/* Floating Heart Toggle Button (Top-Right) */}
                      <button
                        onClick={() => onRemoveFromWishlist(product)}
                        className="absolute top-3.5 right-3.5 z-10 p-2.5 bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.08)] active:scale-90 transition-all text-[#1e3a8a] hover:bg-slate-50"
                        aria-label="Remove from Favorites"
                        id={`wishlist-remove-${product.id}`}
                      >
                        <Heart className="w-4 h-4 fill-[#1e3a8a] text-[#1e3a8a]" />
                      </button>
                    </div>

                    {/* Card Lower: Title & Pricing & Buttons */}
                    <div className="flex flex-col justify-between flex-grow mt-3 px-1">
                      <div>
                        {/* Product Brand & Title */}
                        <h3 
                          onClick={() => onProductSelect(product)}
                          className="font-sans font-bold text-sm text-slate-900 group-hover:text-[#1e3a8a] transition-colors cursor-pointer line-clamp-1"
                          title={product.name}
                        >
                          {product.name}
                        </h3>
                        
                        {/* Additional Sub-attributes/Specifications */}
                        <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                          {layoutDetails.attributes}
                        </p>

                        {/* Price Line */}
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-sm font-extrabold text-slate-900">
                            ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-xs text-slate-400 line-through font-medium">
                              ${product.originalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          )}
                        </div>

                        {/* Price Drop Note or Low Stock Notice */}
                        <div className="h-4.5 mt-1">
                          {layoutDetails.priceNote && (
                            <p className={`text-[11px] ${layoutDetails.priceNoteStyle}`}>
                              {layoutDetails.priceNote}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center gap-2 mt-4">
                        {product.stock === 0 ? (
                          <button
                            disabled
                            className="flex-1 bg-white border border-slate-200 text-slate-400 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed uppercase tracking-wider"
                          >
                            Notify Me
                          </button>
                        ) : (
                          <button
                            onClick={() => onAddToCart(product, product.colors[0]?.name || "Default", 1)}
                            className="flex-1 bg-[#0f172a] hover:bg-[#1e3a8a] text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-[0.98] uppercase tracking-wider"
                            id={`grid-add-to-cart-${product.id}`}
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </button>
                        )}

                        <button
                          onClick={() => onRemoveFromWishlist(product)}
                          className="p-2.5 border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all"
                          aria-label="Delete"
                          id={`grid-delete-${product.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* LIST VIEW */
          <div className="space-y-4 max-w-4xl mx-auto">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => {
                const layoutDetails = getProductDisplayAttributes(product);
                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-2xl border border-slate-100/80 p-4 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 items-center relative group"
                    id={`wishlist-list-item-${product.id}`}
                  >
                    {/* List Left: Image */}
                    <div className="relative w-28 h-28 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0 flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        onClick={() => onProductSelect(product)}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                      />
                      {layoutDetails.badge && (
                        <span className={`absolute top-1.5 left-1.5 text-[7px] font-bold tracking-wider px-1.5 py-0.5 rounded-xs uppercase ${layoutDetails.badge.style}`}>
                          {layoutDetails.badge.text}
                        </span>
                      )}
                    </div>

                    {/* List Middle: Product Info */}
                    <div className="flex-grow text-center sm:text-left min-w-0">
                      <h3
                        onClick={() => onProductSelect(product)}
                        className="font-sans font-bold text-sm text-slate-900 group-hover:text-[#1e3a8a] transition-colors cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h3>
                      
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {layoutDetails.attributes}
                      </p>

                      <div className="flex items-center justify-center sm:justify-start gap-2 mt-1.5">
                        <span className="text-sm font-extrabold text-slate-900">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs text-slate-400 line-through font-semibold">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                        {layoutDetails.priceNote && (
                          <span className={`text-[11px] ml-1.5 ${layoutDetails.priceNoteStyle}`}>
                            • {layoutDetails.priceNote}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* List Right: Actions */}
                    <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto shrink-0 mt-3 sm:mt-0">
                      {product.stock === 0 ? (
                        <button
                          disabled
                          className="flex-grow sm:w-36 bg-white border border-slate-200 text-slate-400 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed uppercase"
                        >
                          Notify Me
                        </button>
                      ) : (
                        <button
                          onClick={() => onAddToCart(product, product.colors[0]?.name || "Default", 1)}
                          className="flex-grow sm:w-36 bg-[#0f172a] hover:bg-[#1e3a8a] text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-[0.98] uppercase"
                          id={`list-add-to-cart-${product.id}`}
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      )}

                      <button
                        onClick={() => onRemoveFromWishlist(product)}
                        className="p-2 border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all sm:w-full flex items-center justify-center gap-1.5 text-xs font-semibold"
                        id={`list-delete-${product.id}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="sm:hidden">Remove</span>
                      </button>
                    </div>

                    {/* List Close Button top-right (on Desktop) */}
                    <button
                      onClick={() => onRemoveFromWishlist(product)}
                      className="absolute top-3.5 right-3.5 hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-300 hover:text-red-500"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* BOTTOM ACTION SECTION: Share Wishlist */}
        {filteredProducts.length > 0 && (
          <div className="mt-14 flex justify-center">
            <button
              onClick={handleShareWishlist}
              className="px-6 py-3 border-2 border-slate-200 hover:border-[#1e3a8a] text-slate-700 hover:text-[#1e3a8a] rounded-full text-xs font-bold tracking-wide flex items-center gap-2 transition-all bg-white hover:shadow-md active:scale-95 cursor-pointer shadow-xs"
              id="share-wishlist-btn"
            >
              <Share2 className="w-4 h-4" />
              <span>Share your wishlist</span>
            </button>
          </div>
        )}

      </main>

      {/* NEW LIST CREATION DIALOG */}
      <AnimatePresence>
        {showNewListModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewListModal(false)}
              className="absolute inset-0 bg-slate-900"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full relative z-10 shadow-2xl border border-slate-100"
            >
              <h3 className="font-sans font-bold text-lg text-slate-900 mb-2">Create New List</h3>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                Organize your favorite luxury items into specialized lists.
              </p>

              <form onSubmit={handleCreateList} className="space-y-4">
                <div>
                  <label htmlFor="list-name" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    List Name
                  </label>
                  <input
                    type="text"
                    id="list-name"
                    required
                    maxLength={24}
                    placeholder="e.g. My Summer Styles"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1e3a8a] focus:bg-white transition-all shadow-inner"
                  />
                </div>

                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewListModal(false)}
                    className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#1e3a8a] hover:bg-[#152a60] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-900/10"
                  >
                    Create List
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* COMPLIANT LUXE FOOTER */}
      <footer className="bg-white border-t border-slate-100 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left select-none">
          <p className="text-[11px] font-medium text-slate-400 font-mono">
            © 2026 LUXE MARKET. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6 text-[11px] font-semibold text-slate-400 font-sans">
            <span className="hover:text-slate-800 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-800 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-slate-800 cursor-pointer transition-colors">Help Center</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
