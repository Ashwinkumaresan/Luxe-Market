import { useState } from "react";
import { X, Trash2, Plus, Minus, Tag, Ticket, Sparkles, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CartItem } from "../types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (pId: string, color: string, qty: number, size?: string) => void;
  onRemoveItem: (pId: string, color: string, size?: string) => void;
  onCheckoutTrigger: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onCheckoutTrigger
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState("");
  const [activeDiscount, setActiveDiscount] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState("");

  const handleApplyPromo = () => {
    setPromoError("");
    const code = promoCode.toUpperCase().trim();
    if (code === "WELCOME20") {
      setActiveDiscount({ code: "WELCOME20", percent: 20 });
    } else if (code === "LUXE10") {
      setActiveDiscount({ code: "LUXE10", percent: 10 });
    } else {
      setPromoError("Invalid promo code. Try WELCOME20 or LUXE10");
    }
  };

  const handleRemovePromo = () => {
    setActiveDiscount(null);
    setPromoCode("");
  };

  // Pricing calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = activeDiscount ? subtotal * (activeDiscount.percent / 100) : 0;
  const discountedSubtotal = subtotal - discountAmount;
  
  // Free shipping above $150
  const shipping = discountedSubtotal > 150 || subtotal === 0 ? 0 : 15.00;
  const taxRate = 0.0825; // 8.25%
  const tax = discountedSubtotal * taxRate;
  const grandTotal = discountedSubtotal + shipping + tax;

  // Calculate accumulated points
  const pointsEarned = cartItems.reduce((acc, item) => acc + item.product.points * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            id="cart-backdrop"
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col justify-between"
            id="cart-drawer-container"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-slate-800" />
                <h2 className="font-display font-bold text-lg text-slate-900">Your Cart</h2>
                <span className="bg-slate-100 text-slate-800 font-mono text-xs font-bold px-2.5 py-0.5 rounded-full" id="cart-item-count">
                  {cartItems.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-black rounded-full transition-colors"
                aria-label="Close"
                id="close-cart-drawer-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of items */}
            <div className="flex-1 overflow-y-auto scrollbar-none p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="p-4 bg-gray-50 text-gray-400 rounded-full mb-4">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <h3 className="font-display font-semibold text-slate-800 text-base">Your cart is empty</h3>
                  <p className="text-xs text-gray-400 max-w-xs mt-1.5">
                    Explore our premium curated collection and add items to begin your luxury shopping experience.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 px-6 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors"
                    id="cart-explore-btn"
                  >
                    Start Exploring
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <motion.div
                    key={`${item.product.id}-${item.selectedColor}-${item.selectedSize || "nosize"}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-4 p-3 bg-slate-50 border border-slate-100/50 rounded-2xl relative group"
                    id={`cart-item-${item.product.id}-${item.selectedSize || "nosize"}`}
                  >
                    {/* Item Image */}
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-18 h-18 object-cover rounded-xl bg-white shrink-0 shadow-sm"
                    />

                    {/* Information and quantity */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-semibold text-sm text-slate-900 truncate pr-4">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.product.id, item.selectedColor, item.selectedSize)}
                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 absolute top-2.5 right-2.5 cursor-pointer"
                            aria-label="Remove item"
                            id={`remove-cart-item-${item.product.id}-${item.selectedSize || "nosize"}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-gray-400 font-medium mt-1">
                          <span>
                            Accent: <span className="text-slate-700 font-semibold">{item.selectedColor}</span>
                          </span>
                          {item.selectedSize && (
                            <>
                              <span className="text-gray-200">•</span>
                              <span>
                                Size: <span className="text-slate-700 font-semibold">{item.selectedSize}</span>
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Controls and final price */}
                      <div className="flex justify-between items-center mt-2.5">
                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2 bg-white h-7">
                          <button
                            onClick={() => onUpdateQty(item.product.id, item.selectedColor, item.quantity - 1, item.selectedSize)}
                            className="text-gray-400 hover:text-black font-semibold text-sm px-1.5 cursor-pointer"
                            id={`qty-minus-cart-${item.product.id}-${item.selectedSize || "nosize"}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-xs font-semibold px-1 min-w-[12px] text-center select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQty(item.product.id, item.selectedColor, item.quantity + 1, item.selectedSize)}
                            className="text-gray-400 hover:text-black font-semibold text-sm px-1.5 cursor-pointer"
                            id={`qty-plus-cart-${item.product.id}-${item.selectedSize || "nosize"}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="font-display font-bold text-sm text-slate-950">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Price Calculations and checkout */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-100 p-6 bg-slate-50/50 space-y-5">
                {/* Promo Code area */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-slate-700" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Promo Code</span>
                  </div>
                  
                  {activeDiscount ? (
                    <div className="flex items-center justify-between p-2 bg-amber-50 rounded-xl border border-amber-100">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                        <Ticket className="w-4 h-4" />
                        <span>Code Applied: {activeDiscount.code} ({activeDiscount.percent}% OFF)</span>
                      </div>
                      <button
                        onClick={handleRemovePromo}
                        className="text-xs text-amber-800 hover:text-amber-950 underline font-medium px-2 py-1"
                        id="remove-promo-btn"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Try WELCOME20 or LUXE10"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-sans placeholder-gray-400 uppercase tracking-wide focus:outline-none focus:border-slate-400"
                        id="promo-code-input"
                      />
                      <button
                        onClick={handleApplyPromo}
                        className="bg-slate-900 text-white font-semibold px-4 rounded-lg text-xs hover:bg-slate-800 transition-colors"
                        id="apply-promo-btn"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  {promoError && (
                    <p className="text-[10px] text-red-500 font-semibold" id="promo-error-msg">{promoError}</p>
                  )}
                </div>

                {/* Subtotal calculations */}
                <div className="space-y-2 text-xs sm:text-sm text-gray-500 border-t border-gray-100 pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-900">${subtotal.toFixed(2)}</span>
                  </div>
                  {activeDiscount && (
                    <div className="flex justify-between text-red-500 font-medium">
                      <span>Discount ({activeDiscount.percent}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Estimated Shipping</span>
                    <span className="font-medium text-slate-900">
                      {shipping === 0 ? <span className="text-emerald-600 font-semibold">Free</span> : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8.25%)</span>
                    <span className="font-medium text-slate-900">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-slate-950 pt-3 border-t border-dashed border-gray-200">
                    <span className="font-display">Total</span>
                    <span className="font-display" id="cart-grand-total">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Rewards alert */}
                {pointsEarned > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800 font-medium">
                    <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>You will earn <strong className="text-emerald-950 font-bold">{pointsEarned}</strong> gold member points from this order!</span>
                  </div>
                )}

                {/* Checkout Trigger button */}
                <button
                  onClick={onCheckoutTrigger}
                  className="w-full bg-slate-900 text-white font-semibold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all duration-300 shadow-md shadow-slate-100 group"
                  id="cart-proceed-checkout-btn"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
