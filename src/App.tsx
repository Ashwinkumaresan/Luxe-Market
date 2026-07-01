import { useState, useEffect } from "react";
import { ChevronRight, SlidersHorizontal, RotateCcw, LayoutGrid, Check, Sparkles, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Routes, Route, useNavigate, useParams, Navigate } from "react-router-dom";

import { Product, CartItem, UserProfile, Order, FilterState } from "./types";
import { PRODUCTS } from "./data/products";
import Header from "./components/Header";
import FiltersSidebar from "./components/FiltersSidebar";
import ProductCard from "./components/ProductCard";
import ProductDetailModal from "./components/ProductDetailModal";
import ProductDetailView from "./components/ProductDetailView";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import ProfileDrawer from "./components/ProfileDrawer";
import WishlistDrawer from "./components/WishlistDrawer";
import WishlistPage from "./components/WishlistPage";
import SignInPage from "./components/SignInPage";
import SignUpPage from "./components/SignUpPage";
import CartPage from "./components/CartPage";
import { WISHLIST_SEED_PRODUCTS } from "./data/wishlistSeed";

const INITIAL_FILTERS: FilterState = {
  category: "Electronics",
  subcategory: [],
  priceRange: [0, 2500],
  brands: [],
  ratings: [],
  inStockOnly: false,
  ecoFriendlyOnly: false
};

const DEFAULT_PROFILE: UserProfile = {
  name: "Achusuchu",
  email: "achusuchu123@gmail.com",
  tier: "Gold",
  points: 1250,
  orderHistory: [
    {
      id: "LXM-848301-2026",
      date: "May 24, 2026",
      items: [
        {
          productName: "Solis Chronos Titanium Smartwatch",
          quantity: 1,
          price: 349.00,
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
        }
      ],
      total: 392.79,
      status: "Delivered",
      trackingNumber: "TRK-983210451"
    }
  ]
};

interface ProductDetailRouteProps {
  wishlist: Product[];
  cart: CartItem[];
  userProfile: UserProfile | null;
  handleAddToCart: (product: Product, selectedColor: string, qty: number, selectedSize?: string) => void;
  handleToggleWishlist: (product: Product) => void;
  setCheckoutItems: (items: CartItem[] | null) => void;
  setCheckoutOpen: (open: boolean) => void;
}

function ProductDetailRoute({
  wishlist,
  cart,
  userProfile,
  handleAddToCart,
  handleToggleWishlist,
  setCheckoutItems,
  setCheckoutOpen
}: ProductDetailRouteProps) {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const product = [...PRODUCTS, ...WISHLIST_SEED_PRODUCTS].find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#fafafa]">
        <p className="text-sm text-slate-500 font-semibold mb-4">Product not found</p>
        <button onClick={() => navigate("/")} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm">
          Back to Catalog
        </button>
      </div>
    );
  }

  return (
    <ProductDetailView
      product={product}
      onBack={() => navigate("/")}
      onAddToCart={handleAddToCart}
      onToggleWishlist={handleToggleWishlist}
      isWishlisted={wishlist.some((p) => p.id === product.id)}
      onProductSelect={(p) => navigate(`/product/${p.id}`)}
      cart={cart}
      wishlist={wishlist}
      onBuyNow={(prod, color, qty, size) => {
        if (!userProfile) {
          navigate("/signin");
          return;
        }
        setCheckoutItems([{ product: prod, selectedColor: color, quantity: qty, selectedSize: size }]);
        setCheckoutOpen(true);
      }}
    />
  );
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string>("Electronics");
  const [filters, setFilters] = useState<FilterState>({
    ...INITIAL_FILTERS,
    category: "Electronics"
  });
  const [searchText, setSearchText] = useState<string>("");
  const [sortType, setSortType] = useState<"recommended" | "price-asc" | "price-desc" | "rating-desc">("recommended");

  // Open Drawer States
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[] | null>(null);

  const navigate = useNavigate();

  // Loaded from LocalStorage States
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("luxe_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem("luxe_wishlist");
    return saved ? JSON.parse(saved) : WISHLIST_SEED_PRODUCTS;
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("luxe_profile");
    return saved ? JSON.parse(saved) : null;
  });

  // Save states to local storage on changes
  useEffect(() => {
    localStorage.setItem("luxe_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("luxe_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem("luxe_profile", JSON.stringify(userProfile));
    } else {
      localStorage.removeItem("luxe_profile");
    }
  }, [userProfile]);

  // Sync category filter when activeCategory changes
  useEffect(() => {
    setFilters((prev) => ({
      ...INITIAL_FILTERS,
      category: activeCategory
    }));
  }, [activeCategory]);

  // Cart operations
  const handleAddToCart = (product: Product, selectedColor: string, qty: number = 1, selectedSize?: string) => {
    if (!userProfile) {
      navigate("/signin");
      return;
    }
    setCart((prev) => {
      const exists = prev.find(
        (item) => item.product.id === product.id && 
                  item.selectedColor === selectedColor && 
                  item.selectedSize === selectedSize
      );
      if (exists) {
        return prev.map((item) =>
          item.product.id === product.id && 
          item.selectedColor === selectedColor && 
          item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, selectedColor, quantity: qty, selectedSize }];
    });
  };

  const handleUpdateCartQty = (pId: string, color: string, qty: number, size?: string) => {
    if (qty <= 0) {
      handleRemoveCartItem(pId, color, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === pId && 
        item.selectedColor === color && 
        item.selectedSize === size
          ? { ...item, quantity: qty }
          : item
      )
    );
  };

  const handleRemoveCartItem = (pId: string, color: string, size?: string) => {
    setCart((prev) => 
      prev.filter((item) => 
        !(item.product.id === pId && item.selectedColor === color && item.selectedSize === size)
      )
    );
  };

  const handleUpdateCheckoutQty = (pId: string, color: string, qty: number, size?: string) => {
    if (checkoutItems !== null) {
      if (qty <= 0) {
        setCheckoutItems((prev) =>
          prev ? prev.filter((item) => !(item.product.id === pId && item.selectedColor === color && item.selectedSize === size)) : null
        );
        return;
      }
      setCheckoutItems((prev) =>
        prev ? prev.map((item) =>
          item.product.id === pId && 
          item.selectedColor === color && 
          item.selectedSize === size
            ? { ...item, quantity: qty }
            : item
        ) : null
      );
    } else {
      handleUpdateCartQty(pId, color, qty, size);
    }
  };

  // Wishlist operations
  const handleToggleWishlist = (product: Product) => {
    if (!userProfile) {
      navigate("/signin");
      return;
    }
    setWishlist((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const handleMoveToCart = (product: Product) => {
    // Add to cart with its default color option
    const defaultColor = product.colors[0]?.name || "Default";
    handleAddToCart(product, defaultColor, 1);
    // Remove from wishlist
    handleToggleWishlist(product);
  };

  // Checkout order success
  const handleOrderSuccess = (order: Order) => {
    // Update profile (accumulate points and append order to log)
    const itemsPurchased = checkoutItems !== null ? checkoutItems : cart;
    const pointsEarned = itemsPurchased.reduce((acc, item) => acc + item.product.points * item.quantity, 0);
    
    if (userProfile) {
      const updatedProfile = {
        ...userProfile,
        points: userProfile.points + pointsEarned,
        orderHistory: [order, ...userProfile.orderHistory]
      };
      setUserProfile(updatedProfile);

      // Update the user's permanent record in localStorage registered list
      const savedUsers = localStorage.getItem("luxe_registered_users");
      if (savedUsers) {
        const users = JSON.parse(savedUsers);
        const userIdx = users.findIndex((u: any) => u.email.toLowerCase() === userProfile.email.toLowerCase());
        if (userIdx > -1) {
          users[userIdx].points = updatedProfile.points;
          localStorage.setItem("luxe_registered_users", JSON.stringify(users));
        }
      }

      // Also back up user orders
      localStorage.setItem(`orders_${userProfile.name}`, JSON.stringify(updatedProfile.orderHistory));
    }

    // Clear cart if we were doing a standard checkout from the cart
    if (checkoutItems === null) {
      setCart([]);
    }
  };

  const resetFilters = () => {
    setFilters({
      ...INITIAL_FILTERS,
      category: activeCategory
    });
  };

  // Filter & Sort Logic
  const filteredProducts = PRODUCTS.filter((product) => {
    // 1. Category filter
    if (activeCategory === "Top Offers") {
      const hasDiscount = product.discount && product.discount > 0;
      const isCheaper = product.originalPrice && product.originalPrice > product.price;
      if (!hasDiscount && !isCheaper) return false;
    } else if (activeCategory === "Recommended") {
      if (!product.isBestSeller && product.rating < 4.8) return false;
    } else {
      if (product.category !== activeCategory) return false;
    }

    // 2. Subcategory filter
    if (filters.subcategory.length > 0 && !filters.subcategory.includes(product.subcategory)) return false;

    // 3. Price Range
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) return false;

    // 4. Brand
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) return false;

    // 5. Ratings
    if (filters.ratings.length > 0) {
      const minRating = Math.min(...filters.ratings);
      if (product.rating < minRating) return false;
    }

    // 6. In Stock Only
    if (filters.inStockOnly && product.stock === 0) return false;

    // 7. Eco-Friendly Only
    if (filters.ecoFriendlyOnly && !product.ecoFriendly) return false;

    // 8. Search text query
    if (searchText) {
      const query = searchText.toLowerCase();
      const matchName = product.name.toLowerCase().includes(query);
      const matchDesc = product.description.toLowerCase().includes(query);
      const matchSub = product.subcategory.toLowerCase().includes(query);
      const matchBrand = product.brand.toLowerCase().includes(query);
      if (!matchName && !matchDesc && !matchSub && !matchBrand) return false;
    }

    return true;
  });

  // Sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortType === "price-asc") return a.price - b.price;
    if (sortType === "price-desc") return b.price - a.price;
    if (sortType === "rating-desc") return b.rating - a.rating;
    return 0; // "recommended" maintains original array structure
  });

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

  // Calculate cart pricing for checkout triggers
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Calculate active checkout items and their totals
  const activeCheckoutItems = checkoutItems !== null ? checkoutItems : cart;
  const activeCheckoutSubtotal = activeCheckoutItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const checkoutTaxRate = 0.0825;
  const checkoutShipping = activeCheckoutSubtotal > 150 ? 0 : 15.00;
  const checkoutGrandTotal = activeCheckoutSubtotal > 0 ? (activeCheckoutSubtotal + checkoutShipping + (activeCheckoutSubtotal * checkoutTaxRate)) : 0;
  const checkoutPointsEarned = activeCheckoutItems.reduce((acc, item) => acc + item.product.points * item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] font-sans">
      
      <Routes>
        {/* Catalog (Home) page */}
        <Route
          path="/"
          element={
            <>
              <Header
                activeCategory={activeCategory}
                setActiveCategory={(category) => {
                  setActiveCategory(category);
                  navigate("/");
                }}
                searchText={searchText}
                setSearchText={setSearchText}
                cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
                wishlistCount={wishlist.length}
                onCartClick={() => {
                  if (!userProfile) {
                    navigate("/signin");
                  } else {
                    navigate("/cart");
                  }
                }}
                onWishlistClick={() => navigate("/wishlist")}
                onProfileClick={() => {
                  if (userProfile) {
                    setProfileOpen(true);
                  } else {
                    navigate("/signin");
                  }
                }}
                userPoints={userProfile ? userProfile.points : 0}
                userProfile={userProfile}
                onProductSelect={(product) => {
                  navigate(`/product/${product.id}`);
                }}
              />

              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Breadcrumb line */}
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-4 select-none">
                  <span className="hover:text-slate-900 cursor-pointer">Home</span>
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
                              onAddToCart={(p: Product, col: string) => handleAddToCart(p, col, 1)}
                              onToggleWishlist={(p: Product) => handleToggleWishlist(p)}
                              isWishlisted={wishlist.some((p) => p.id === product.id)}
                              onProductClick={(p: Product) => navigate(`/product/${p.id}`)}
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
                      <li className="hover:text-white cursor-pointer" onClick={() => { setActiveCategory("Electronics"); navigate("/"); }}>High-End Electronics</li>
                      <li className="hover:text-white cursor-pointer" onClick={() => { setActiveCategory("Fashion"); navigate("/"); }}>Designer Apparel</li>
                      <li className="hover:text-white cursor-pointer" onClick={() => { setActiveCategory("Home"); navigate("/"); }}>Curated Home Decor</li>
                      <li className="hover:text-white cursor-pointer" onClick={() => { setActiveCategory("Beauty"); navigate("/"); }}>Premium Skincare</li>
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
          }
        />

        {/* SignInPage route */}
        <Route
          path="/signin"
          element={
            <SignInPage
              onBackToCatalog={() => navigate("/")}
              onAuthSuccess={(profile) => {
                setUserProfile(profile);
                navigate("/");
                setProfileOpen(true);
              }}
              onNavigateToSignUp={() => navigate("/signup")}
            />
          }
        />

        {/* SignUpPage route */}
        <Route
          path="/signup"
          element={
            <SignUpPage
              onBackToCatalog={() => navigate("/")}
              onAuthSuccess={(profile) => {
                setUserProfile(profile);
                navigate("/");
                setProfileOpen(true);
              }}
              onNavigateToSignIn={() => navigate("/signin")}
            />
          }
        />

        {/* CartPage route */}
        <Route
          path="/cart"
          element={
            <CartPage
              cartItems={cart}
              userProfile={userProfile}
              wishlistCount={wishlist.length}
              onUpdateQty={handleUpdateCartQty}
              onRemoveItem={handleRemoveCartItem}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
              onCheckoutTrigger={() => {
                setCheckoutItems(null);
                setCheckoutOpen(true);
              }}
              onProductSelect={(product) => {
                navigate(`/product/${product.id}`);
              }}
              onBackToCatalog={() => navigate("/")}
              onWishlistClick={() => navigate("/wishlist")}
              onProfileClick={() => setProfileOpen(true)}
            />
          }
        />

        {/* WishlistPage route */}
        <Route
          path="/wishlist"
          element={
            <WishlistPage
              wishlist={wishlist}
              onRemoveFromWishlist={handleToggleWishlist}
              onAddToCart={(product, color, qty) => {
                handleAddToCart(product, color, qty);
              }}
              onProductSelect={(product) => {
                navigate(`/product/${product.id}`);
              }}
              onBackToCatalog={() => navigate("/")}
              cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
              userProfile={userProfile}
              onProfileClick={() => setProfileOpen(true)}
              onCartClick={() => {
                if (!userProfile) {
                  navigate("/signin");
                } else {
                  navigate("/cart");
                }
              }}
            />
          }
        />

        {/* ProductDetailView route */}
        <Route
          path="/product/:productId"
          element={
            <ProductDetailRoute
              wishlist={wishlist}
              cart={cart}
              userProfile={userProfile}
              handleAddToCart={handleAddToCart}
              handleToggleWishlist={handleToggleWishlist}
              setCheckoutItems={setCheckoutItems}
              setCheckoutOpen={setCheckoutOpen}
            />
          }
        />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* MOBILE FILTERS SIDE DRAWER */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black z-50 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-white z-50 overflow-y-auto scrollbar-none md:hidden"
              id="mobile-filters-drawer"
            >
              <FiltersSidebar
                activeCategory={activeCategory}
                filters={filters}
                setFilters={setFilters}
                resetFilters={resetFilters}
                mobile={true}
                onCloseMobile={() => setMobileFiltersOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CART DRAWER */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onCheckoutTrigger={() => {
          setCartOpen(false);
          setCheckoutItems(null);
          setCheckoutOpen(true);
        }}
      />

      {/* WISHLIST DRAWER */}
      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleToggleWishlist}
        onMoveToCart={handleMoveToCart}
      />

      {/* MEMBERSHIP PROFILE DRAWER */}
      {userProfile && (
        <ProfileDrawer
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
          userProfile={userProfile}
          onSignOut={() => {
            setUserProfile(null);
            setCart([]);
            setWishlist([]);
          }}
        />
      )}

      {/* THE CHECKOUT MULTI-STEP MODAL */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={activeCheckoutItems}
        cartTotal={checkoutGrandTotal}
        pointsEarned={checkoutPointsEarned}
        onOrderSuccess={handleOrderSuccess}
        onUpdateQuantity={handleUpdateCheckoutQty}
      />

    </div>
  );
}

