import { useState, useEffect } from "react";
import { ChevronRight, SlidersHorizontal, RotateCcw, LayoutGrid, Check, Sparkles, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Routes, Route, useNavigate, useParams, Navigate, useLocation } from "react-router-dom";

import { Product, CartItem, UserProfile, Order, FilterState } from "./types";
import { PRODUCTS } from "./data/products";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import ProfileDrawer from "./components/ProfileDrawer";
import WishlistDrawer from "./components/WishlistDrawer";
import AIChatbot from "./components/AIChatbot";
import FiltersSidebar from "./components/FiltersSidebar";

// Pages
import CatalogPage from "./pages/CatalogPage";
import WishlistPage from "./pages/WishlistPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import CartPage from "./pages/CartPage";
import ProductDetailPage from "./pages/ProductDetailPage";

import { WISHLIST_SEED_PRODUCTS } from "./data/wishlistSeed";

const INITIAL_FILTERS: FilterState = {
  category: "Recommended",
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
  const location = useLocation();
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
    <ProductDetailPage
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
          navigate("/signin", { state: { from: location.pathname } });
          return;
        }
        setCheckoutItems([{ product: prod, selectedColor: color, quantity: qty, selectedSize: size }]);
        setCheckoutOpen(true);
      }}
    />
  );
}

export default function App() {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState<string>("Recommended");
  const [filters, setFilters] = useState<FilterState>({
     ...INITIAL_FILTERS,
     category: "Recommended"
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
      navigate("/signin", { state: { from: location.pathname } });
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
      navigate("/signin", { state: { from: location.pathname } });
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
            <CatalogPage
              activeCategory={activeCategory}
              setActiveCategory={(cat) => {
                setActiveCategory(cat);
                navigate("/");
              }}
              searchText={searchText}
              setSearchText={setSearchText}
              sortType={sortType}
              setSortType={setSortType}
              filters={filters}
              setFilters={setFilters}
              resetFilters={resetFilters}
              sortedProducts={sortedProducts}
              cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
              wishlistCount={wishlist.length}
              wishlist={wishlist}
              userProfile={userProfile}
              setProfileOpen={setProfileOpen}
              setMobileFiltersOpen={setMobileFiltersOpen}
              onAddToCart={(p, col) => handleAddToCart(p, col, 1)}
              onToggleWishlist={handleToggleWishlist}
              onCartClick={() => {
                if (!userProfile) {
                  navigate("/signin", { state: { from: location.pathname } });
                } else {
                  navigate("/cart");
                }
              }}
              onWishlistClick={() => navigate("/wishlist")}
              onProfileClick={() => {
                if (userProfile) {
                  setProfileOpen(true);
                } else {
                  navigate("/signin", { state: { from: location.pathname } });
                }
              }}
              onProductSelect={(product) => {
                navigate(`/product/${product.id}`);
              }}
            />
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
                const redirectPath = location.state?.from || "/";
                navigate(redirectPath);
                setProfileOpen(true);
              }}
              onNavigateToSignUp={() => navigate("/signup", { state: location.state })}
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
                const redirectPath = location.state?.from || "/";
                navigate(redirectPath);
                setProfileOpen(true);
              }}
              onNavigateToSignIn={() => navigate("/signin", { state: location.state })}
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
                  navigate("/signin", { state: { from: location.pathname } });
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

      {/* AI shopping assistant chatbot - Hidden on product detail pages */}
      {!location.pathname.startsWith("/product/") && (
        <AIChatbot
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          setCartOpen={setCartOpen}
          setWishlistOpen={setWishlistOpen}
          setProfileOpen={setProfileOpen}
          setSearchText={setSearchText}
          onNavigateToProduct={(pId) => navigate(`/product/${pId}`)}
        />
      )}

    </div>
  );
}

