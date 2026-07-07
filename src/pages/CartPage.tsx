import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Heart, 
  User, 
  Gift, 
  Minus, 
  Plus, 
  Lock, 
  Check, 
  Sparkles, 
  Trash2, 
  ChevronRight,
  ShoppingBag
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CartItem, Product, UserProfile } from "../types";

interface CartPageProps {
  cartItems: CartItem[];
  userProfile: UserProfile | null;
  wishlistCount: number;
  onUpdateQty: (pId: string, color: string, qty: number, size?: string) => void;
  onRemoveItem: (pId: string, color: string, size?: string) => void;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, color: string, qty: number, size?: string) => void;
  onCheckoutTrigger: () => void;
  onProductSelect: (product: Product) => void;
  onBackToCatalog: () => void;
  onWishlistClick: () => void;
  onProfileClick: () => void;
}

// Custom recommendation products that match the image exactly!
const RECOMMENDED_ITEMS: Product[] = [
  {
    id: "reco-1",
    name: "Scandi Candle Holder",
    description: "A beautifully ribbed, minimalist ceramic candle holder that brings Scandinavian simplicity and cozy warmth to any space.",
    price: 45.00,
    rating: 4.8,
    reviewsCount: 34,
    category: "Home",
    subcategory: "Decor",
    brand: "Nordic Craft",
    image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=500&q=80",
    stock: 20,
    ecoFriendly: true,
    points: 20,
    colors: [{ name: "Cream White", hex: "#f5f5f4" }],
    specs: [{ label: "Material", value: "Ribbed Ceramic" }],
    reviews: []
  },
  {
    id: "reco-2",
    name: "Pure Silk Mask",
    description: "Indulge in deep, uninterrupted sleep with this ultra-soft, 100% pure Mulberry silk sleep eye mask, designed to be gentle on skin and eyes.",
    price: 65.00,
    rating: 4.9,
    reviewsCount: 88,
    category: "Beauty",
    subcategory: "Wellness",
    brand: "Luxe Rest",
    image: "https://images.unsplash.com/photo-1615396899839-c99c121888b0?auto=format&fit=crop&w=500&q=80",
    stock: 12,
    ecoFriendly: true,
    points: 30,
    colors: [{ name: "Midnight Blue", hex: "#1e3a8a" }],
    specs: [{ label: "Material", value: "100% Mulberry Silk" }],
    reviews: []
  },
  {
    id: "reco-3",
    name: "Insulated Steel Bottle",
    description: "A premium double-walled, vacuum-insulated stainless steel water bottle. Finished in elegant matte black to keep your drinks cold for 24 hours.",
    price: 38.00,
    rating: 4.7,
    reviewsCount: 56,
    category: "Sports",
    subcategory: "Accessories",
    brand: "Aether",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=500&q=80",
    stock: 25,
    ecoFriendly: true,
    points: 15,
    colors: [{ name: "Matte Black", hex: "#111111" }],
    specs: [{ label: "Capacity", value: "500ml" }],
    reviews: []
  }
];

export default function CartPage({
  cartItems,
  userProfile,
  wishlistCount,
  onUpdateQty,
  onRemoveItem,
  onToggleWishlist,
  onAddToCart,
  onCheckoutTrigger,
  onProductSelect,
  onBackToCatalog,
  onWishlistClick,
  onProfileClick
}: CartPageProps) {
  const [promoInput, setPromoInput] = useState("");
  const [activeDiscount, setActiveDiscount] = useState<{ code: string; percent?: number; amount?: number } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [giftNoteOpen, setGiftNoteOpen] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [redeemPoints, setRedeemPoints] = useState(false);

  // Default auto-apply WELCOME10 for demo/accuracy matching image!
  useEffect(() => {
    if (cartItems.length > 0 && !activeDiscount) {
      setActiveDiscount({ code: "WELCOME10", amount: 9.00 });
      setPromoSuccess("WELCOME10 applied successfully");
    }
  }, [cartItems]);

  const handleApplyPromo = () => {
    setPromoError("");
    setPromoSuccess("");
    const code = promoInput.toUpperCase().trim();

    if (!code) {
      setPromoError("Please enter a promo code");
      return;
    }

    if (code === "WELCOME10") {
      setActiveDiscount({ code: "WELCOME10", amount: 9.00 });
      setPromoSuccess("WELCOME10 applied ✓ -$9.00");
    } else if (code === "WELCOME20") {
      setActiveDiscount({ code: "WELCOME20", percent: 20 });
      setPromoSuccess("WELCOME20 applied ✓ 20% Off");
    } else if (code === "LUXE10") {
      setActiveDiscount({ code: "LUXE10", percent: 10 });
      setPromoSuccess("LUXE10 applied ✓ 10% Off");
    } else {
      setPromoError("Invalid promo code. Try WELCOME20 or LUXE10");
    }
  };

  // Math calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal >= 75;
  const shipping = subtotal > 0 ? (isFreeShipping ? 0 : 15.00) : 0;
  const tax = subtotal * 0.08; // 8% tax matching image precisely

  let discountAmount = 0;
  if (activeDiscount) {
    if (activeDiscount.amount !== undefined) {
      discountAmount = activeDiscount.amount;
    } else if (activeDiscount.percent !== undefined) {
      discountAmount = (subtotal * activeDiscount.percent) / 100;
    }
  }

  // Points redemption discount ($10 for 1000 points)
  const pointsDiscount = redeemPoints ? 10.00 : 0;
  
  const originalTotal = subtotal + shipping + tax;
  const finalTotal = Math.max(0, originalTotal - discountAmount - pointsDiscount);

  const totalPointsEarned = cartItems.reduce((sum, item) => sum + (item.product.points || 15) * item.quantity, 0);

  // Points variables
  const availablePoints = userProfile?.points || 1240;
  const pointsToNextReward = 240;

  const handleSaveForLater = (product: Product, color: string, size?: string) => {
    onToggleWishlist(product);
    onRemoveItem(product.id, color, size);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] font-sans scrollbar-none" id="cart-page-view">
      
      {/* FREE SHIPPING BAR */}
      <div className="bg-black text-white text-[10px] sm:text-xs font-semibold py-2.5 px-4 text-center tracking-[0.15em] select-none" id="shipping-banner">
        FREE SHIPPING ON ORDERS OVER $75
      </div>

      {/* HEADER BAR */}
      <header className="bg-white border-b border-gray-100 py-5 sticky top-0 z-40 shadow-[0_2px_15px_rgba(0,0,0,0.015)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button 
            onClick={onBackToCatalog}
            className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            id="continue-shopping-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Continue Shopping</span>
          </button>

          <button 
            onClick={onBackToCatalog}
            className="flex items-center"
            id="cart-logo-btn"
          >
            <span className="font-display font-bold text-xl tracking-widest text-slate-900">
              LUXE <span className="font-light text-gray-500">MARKET</span>
            </span>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={onWishlistClick}
              className="relative p-2 text-gray-700 hover:text-red-500 hover:bg-red-50/50 rounded-full transition-all"
              aria-label="Wishlist"
              id="cart-wishlist-btn"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-[9px] font-bold text-white rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button
              onClick={onProfileClick}
              className="p-2 text-gray-700 hover:text-slate-900 hover:bg-gray-50 rounded-full transition-all"
              aria-label="Profile"
              id="cart-profile-btn"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* CART HEADER TITLE */}
        <div className="flex items-baseline gap-3 mb-8" id="cart-title-container">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-950 tracking-tight">
            Your Cart
          </h1>
          <span className="text-gray-400 font-medium text-sm sm:text-base">
            ({cartItems.reduce((acc, curr) => acc + curr.quantity, 0)} {cartItems.reduce((acc, curr) => acc + curr.quantity, 0) === 1 ? 'item' : 'items'})
          </span>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-3xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-5">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="font-display font-semibold text-lg text-slate-900 mb-2">Your cart is currently empty</h3>
            <p className="text-xs sm:text-sm text-gray-400 max-w-md mb-8">
              Explore our curated collections of premium consumer electronics, designer apparel, and beautiful home decor.
            </p>
            <button 
              onClick={onBackToCatalog}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold tracking-wide transition-all"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: LIST AND GIFT NOTE AND RECOMMENDATIONS */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* CART ITEMS STACK */}
              <div className="space-y-4" id="cart-items-stack">
                <AnimatePresence initial={false}>
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={`${item.product.id}-${item.selectedColor}-${item.selectedSize || "none"}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.01)] flex flex-col sm:flex-row gap-4 sm:gap-5 relative"
                    >
                      {/* Product Image */}
                      <div className="w-full sm:w-32 h-44 sm:h-32 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center shrink-0">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Product Details info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          {/* Title and Price */}
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="font-display font-bold text-base text-slate-900 tracking-tight hover:text-slate-700 cursor-pointer" onClick={() => onProductSelect(item.product)}>
                              {item.product.name}
                            </h3>
                            <div className="text-right shrink-0">
                              <span className="font-mono font-bold text-base text-slate-950">
                                ${ (item.product.price).toFixed(2) }
                              </span>
                              {item.product.originalPrice && (
                                <div className="font-mono text-xs text-gray-400 line-through mt-0.5">
                                  ${item.product.originalPrice.toFixed(2)}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Options specs */}
                          <p className="text-xs text-gray-400 mt-1.5 font-medium flex flex-wrap gap-x-2">
                            <span>Color: {item.selectedColor}</span>
                            {item.selectedSize && (
                              <>
                                <span className="text-gray-300">•</span>
                                <span>Size: {item.selectedSize}</span>
                              </>
                            )}
                          </p>

                          {/* Loyalty Points Badge */}
                          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50/50 rounded-lg text-[10px] font-semibold text-indigo-600 border border-indigo-100/30">
                            <Sparkles className="w-3 h-3" />
                            Earn { (item.product.points || 15) * item.quantity } points with this item
                          </div>
                        </div>

                        {/* Quantity controls and Actions */}
                        <div className="flex items-center justify-between mt-5 gap-4 pt-4 border-t border-slate-50">
                          {/* Qty Selector Pill */}
                          <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden h-9">
                            <button
                              onClick={() => onUpdateQty(item.product.id, item.selectedColor, item.quantity - 1, item.selectedSize)}
                              className="px-2.5 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-xs font-bold text-slate-800 min-w-[2rem] text-center select-none">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQty(item.product.id, item.selectedColor, item.quantity + 1, item.selectedSize)}
                              className="px-2.5 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Action Links */}
                          <div className="flex items-center gap-3 text-xs font-semibold text-slate-400 select-none">
                            <button
                              onClick={() => onRemoveItem(item.product.id, item.selectedColor, item.selectedSize)}
                              className="hover:text-red-500 transition-colors text-slate-500 hover:underline"
                            >
                              Remove
                            </button>
                            <span className="text-gray-200">|</span>
                            <button
                              onClick={() => handleSaveForLater(item.product, item.selectedColor, item.selectedSize)}
                              className="hover:text-slate-800 transition-colors text-slate-500 hover:underline"
                            >
                              Save for later
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* GIFT NOTE EXPANDABLE SECTION */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.01)]" id="gift-note-card">
                <button
                  onClick={() => setGiftNoteOpen(!giftNoteOpen)}
                  className="w-full flex items-center gap-2.5 text-xs font-bold text-slate-800 hover:text-slate-900 transition-colors text-left"
                >
                  <Gift className="w-4 h-4 text-slate-500" />
                  <span>+ Add a gift note</span>
                </button>
                <AnimatePresence>
                  {giftNoteOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <textarea
                        value={giftNote}
                        onChange={(e) => setGiftNote(e.target.value)}
                        placeholder="Write a lovely note to accompany your luxury gift package..."
                        className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all resize-none"
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button 
                          onClick={() => setGiftNoteOpen(false)}
                          className="px-3.5 py-1.5 text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => setGiftNoteOpen(false)}
                          className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-[11px] font-semibold hover:bg-slate-800 transition-colors"
                        >
                          Save Note
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* RECOMMENDATION SECTION */}
              <div className="pt-4" id="recommendations-container">
                <h2 className="font-display font-bold text-lg text-slate-900 mb-5">
                  You may also like
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {RECOMMENDED_ITEMS.map((reco) => (
                    <div 
                      key={reco.id}
                      className="bg-white border border-gray-100 rounded-2xl overflow-hidden p-3 shadow-[0_4px_24px_rgba(0,0,0,0.01)] group hover:shadow-md transition-all duration-300"
                    >
                      <div className="relative aspect-square bg-slate-50 rounded-xl overflow-hidden mb-3 border border-slate-100">
                        <img 
                          src={reco.image} 
                          alt={reco.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <h4 className="font-display font-bold text-xs text-slate-900 line-clamp-1 mb-1 tracking-tight">
                        {reco.name}
                      </h4>
                      <p className="font-mono font-bold text-xs text-slate-950 mb-3">
                        ${reco.price.toFixed(2)}
                      </p>
                      <button
                        onClick={() => onAddToCart(reco, reco.colors[0].name, 1, reco.specs[0]?.value)}
                        className="w-full py-2 bg-slate-50 hover:bg-slate-900 hover:text-white text-[10px] font-bold tracking-wider text-slate-700 rounded-lg transition-all"
                      >
                        ADD TO CART
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: ORDER SUMMARY SIDEBAR */}
            <div className="lg:col-span-5 sticky top-28" id="cart-summary-sidebar">
              
              <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.015)] space-y-6">
                <h2 className="font-display font-bold text-xl text-slate-950 tracking-tight pb-2 border-b border-slate-50">
                  Order Summary
                </h2>

                {/* Subtotal, Shipping, Tax Breakdown */}
                <div className="space-y-3 text-xs sm:text-sm font-medium">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-mono text-slate-900 font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Estimated Shipping</span>
                    <span className="font-mono font-bold text-indigo-600">
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Estimated Tax</span>
                    <span className="font-mono text-slate-900 font-semibold">${tax.toFixed(2)}</span>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="pt-2 border-t border-slate-50 space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-sans placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all uppercase tracking-wider"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="px-5 py-3 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs tracking-widest rounded-xl transition-all"
                    >
                      APPLY
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[11px] font-semibold text-red-500">{promoError}</p>
                  )}
                  {promoSuccess && (
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50/50 px-3 py-1.5 rounded-lg border border-emerald-100/30">
                      <Check className="w-3.5 h-3.5" />
                      <span>{promoSuccess}</span>
                    </div>
                  )}
                </div>

                {/* LOYALTY POINTS REDEMPTION SYSTEM CARD */}
                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-3.5" id="points-redemption-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-900">
                          {availablePoints.toLocaleString()} points available
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          Redeem 1,000 points to save $10.00
                        </p>
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      onClick={() => setRedeemPoints(!redeemPoints)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        redeemPoints ? "bg-slate-900" : "bg-slate-200"
                      }`}
                      id="points-redeem-toggle"
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          redeemPoints ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Loyalty progress bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="h-1.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-slate-900 transition-all duration-500" 
                        style={{ width: `${Math.min(100, (availablePoints / 1500) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold text-right select-none">
                      {pointsToNextReward} more points unlocks $5 off
                    </p>
                  </div>
                </div>

                {/* TOTAL AMOUNT AND REWARDS PREVIEW */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  {discountAmount + pointsDiscount > 0 && (
                    <div className="text-right">
                      <span className="font-mono text-xs sm:text-sm text-gray-400 line-through">
                        ${originalTotal.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-base sm:text-lg text-slate-950">Total</span>
                    <span className="font-mono font-bold text-2xl sm:text-3xl text-slate-950 tracking-tight" id="cart-final-total-display">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 font-medium text-center bg-slate-50 py-2 rounded-lg">
                    You'll earn <span className="font-bold text-slate-900">{totalPointsEarned} points</span> on this order
                  </p>
                </div>

                {/* PROCEED TO CHECKOUT BUTTON */}
                <button
                  onClick={onCheckoutTrigger}
                  className="w-full py-4 bg-slate-950 hover:bg-slate-900 text-white text-xs sm:text-sm font-bold tracking-widest rounded-xl transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.08)] active:scale-[0.99] flex items-center justify-center gap-2"
                  id="checkout-proceed-btn"
                >
                  <Lock className="w-4 h-4" />
                  PROCEED TO CHECKOUT
                </button>

                {/* Secure checkout notes & badges */}
                <div className="pt-2 text-center space-y-3 select-none">
                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Secure Checkout</span>
                  </div>
                  
                  {/* Payment Card Badges */}
                  <div className="flex items-center justify-center gap-3.5 opacity-40 grayscale" id="payment-badges">
                    <img src="https://cdn-icons-png.flaticon.com/128/349/349221.png" alt="Visa" className="h-4 object-contain" referrerPolicy="no-referrer" />
                    <img src="https://cdn-icons-png.flaticon.com/128/349/349228.png" alt="MasterCard" className="h-4 object-contain" referrerPolicy="no-referrer" />
                    <img src="https://cdn-icons-png.flaticon.com/128/349/349230.png" alt="Amex" className="h-4 object-contain" referrerPolicy="no-referrer" />
                    <img src="https://cdn-icons-png.flaticon.com/128/196/196565.png" alt="Paypal" className="h-4 object-contain" referrerPolicy="no-referrer" />
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 py-8 mt-20 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-2">
            <span>© 2024 LUXE MARKET.</span>
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3" /> Secure Checkout.
            </span>
          </div>
          <div className="flex gap-6">
            <span className="hover:text-slate-800 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-800 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-800 cursor-pointer">Help Center</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
