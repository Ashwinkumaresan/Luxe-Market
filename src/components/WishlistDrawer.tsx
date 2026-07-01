import { X, Heart, Trash2, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product } from "../types";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (p: Product) => void;
  onMoveToCart: (p: Product) => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onMoveToCart
}: WishlistDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-50"
            id="wishlist-backdrop"
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[410px] bg-white shadow-2xl z-50 flex flex-col justify-between font-sans border-l border-slate-100"
            id="wishlist-drawer-container"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100/60">
              <div className="flex items-center gap-2.5">
                <Heart className="w-5 h-5 text-[#1e3a8a] fill-[#1e3a8a]" />
                <h2 className="font-sans font-bold text-[19px] tracking-tight text-slate-900">Your Wishlist</h2>
                <span className="bg-blue-50/80 text-[#1e3a8a] font-sans text-xs font-bold px-2.5 py-0.5 rounded-full" id="wishlist-item-count">
                  {wishlist.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-800 rounded-full transition-colors"
                aria-label="Close"
                id="close-wishlist-drawer-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of Wishlist items */}
            <div className="flex-1 overflow-y-auto scrollbar-none p-6 space-y-4">
              {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="p-4 bg-slate-50 text-slate-300 rounded-full mb-4">
                    <Heart className="w-10 h-10" />
                  </div>
                  <h3 className="font-sans font-semibold text-slate-800 text-base">Your wishlist is empty</h3>
                  <p className="text-xs text-slate-400 max-w-xs mt-1.5">
                    Click the heart icon on any product to save it to your wishlist.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 px-6 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors"
                    id="wishlist-explore-btn"
                  >
                    Explore Products
                  </button>
                </div>
              ) : (
                wishlist.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex gap-4 p-4 bg-[#f8fafc] border border-slate-100 rounded-[22px] relative group"
                    id={`wishlist-item-${product.id}`}
                  >
                    {/* Item Image */}
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-[84px] h-[84px] object-cover rounded-xl bg-white border border-slate-100 shrink-0"
                    />

                    {/* Information and Actions */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-sm text-slate-900 truncate pr-4" title={product.name}>
                            {product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveFromWishlist(product)}
                            className="text-slate-300 hover:text-red-500 p-1 absolute top-3.5 right-3.5 transition-colors"
                            aria-label="Remove item"
                            id={`remove-wishlist-item-${product.id}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-xs font-bold text-slate-500 mt-0.5">
                          ${product.price.toFixed(2)}
                        </div>
                      </div>

                      {/* Move to Cart Button */}
                      <button
                        onClick={() => onMoveToCart(product)}
                        className="mt-3 w-full bg-[#0f172a] text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-slate-800 transition-all active:scale-[0.98]"
                        id={`move-to-cart-${product.id}`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Move to Cart</span>
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Bottom Info Section matching the design */}
            <div className="p-6 border-t border-slate-100 text-center text-xs text-slate-400 font-medium">
              Save your favorite items across devices securely.
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
