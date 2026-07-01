import { useState } from "react";
import { X, Star, Heart, ShoppingBag, Sparkles, ShieldCheck, HelpCircle, Check, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product } from "../types";
import { PRODUCTS } from "../data/products";

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (p: Product, selectedColor: string, qty: number) => void;
  onToggleWishlist: (p: Product) => void;
  isWishlisted: boolean;
  onProductSelect: (p: Product) => void; // For related product clicks
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onProductSelect
}: ProductDetailModalProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "Default");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"specs" | "reviews">("specs");
  const [isAdded, setIsAdded] = useState(false);
  const [helpfulReviews, setHelpfulReviews] = useState<Record<string, boolean>>({});

  // Fetch 2 related products in same category (excluding current)
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 2);

  const handleAddToCart = () => {
    onAddToCart(product, selectedColor, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1200);
  };

  const handleToggleHelpful = (reviewId: string) => {
    setHelpfulReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          id="detail-modal-backdrop"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
          id={`detail-modal-${product.id}`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-black rounded-full transition-all duration-200"
            aria-label="Close"
            id="close-detail-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Scrollable Content wrapper */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              
              {/* Left Side: Product Images & Color Options */}
              <div className="lg:col-span-6 space-y-5">
                {/* Main Hero Image */}
                <div className="relative aspect-[4/3] sm:aspect-video lg:aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    id="detail-main-img"
                  />
                  {product.isBestSeller && (
                    <span className="absolute top-4 left-4 bg-slate-900 text-white text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-lg uppercase">
                      Best Seller
                    </span>
                  )}
                  {product.ecoFriendly && (
                    <span className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-lg uppercase flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Eco-Friendly
                    </span>
                  )}
                </div>

                {/* Swatches Visual Indicator (Select color) */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Selected Accent: <span className="text-slate-950 font-semibold">{selectedColor}</span>
                  </h4>
                  <div className="flex items-center gap-3">
                    {product.colors.map((color) => {
                      const isSelected = selectedColor === color.name;
                      return (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color.name)}
                          className={`relative p-1 rounded-full border-2 transition-all duration-300 ${
                            isSelected ? "border-slate-900 scale-105" : "border-transparent hover:scale-105"
                          }`}
                          title={color.name}
                          id={`color-swatch-${color.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <span
                            className="block w-7 h-7 rounded-full shadow-inner border border-black/10"
                            style={{ backgroundColor: color.hex }}
                          />
                          {isSelected && (
                            <span className="absolute -bottom-1 -right-1 bg-slate-950 text-white p-0.5 rounded-full border border-white">
                              <Check className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mini descriptions */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-2 gap-3.5 text-xs text-gray-600">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4.5 h-4.5 text-slate-800 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">Warranty Included</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">2-Year global luxury protection</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">Points & Rewards</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">Earn {product.points} points with purchase</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Product info & Specs/Reviews */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  {/* Category & Brand info */}
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-gray-400 mb-1.5">
                    <span id="detail-category">{product.category}</span>
                    <span>•</span>
                    <span id="detail-brand">{product.brand}</span>
                  </div>

                  {/* Product Title */}
                  <h1 className="font-display font-bold text-xl sm:text-2xl lg:text-3xl text-slate-900 tracking-tight leading-tight mb-3" id="detail-title">
                    {product.name}
                  </h1>

                  {/* Rating summary */}
                  <div className="flex items-center gap-2 mb-5">
                    <div className="flex items-center text-amber-500 gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-current" : "text-gray-200"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-slate-800" id="detail-rating">
                      {product.rating} / 5.0
                    </span>
                    <span className="text-sm text-gray-400 font-medium">
                      ({product.reviewsCount} verified reviews)
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-6" id="detail-description">
                    {product.description}
                  </p>

                  {/* Price Block */}
                  <div className="flex items-baseline gap-3 mb-6 bg-slate-50/50 p-4 rounded-2xl border border-gray-100">
                    <div>
                      <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">Price</div>
                      <span className="font-display font-bold text-2xl sm:text-3xl text-slate-950" id="detail-price">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                    {product.originalPrice && (
                      <div className="ml-4 pl-4 border-l border-gray-200">
                        <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">MSRP</div>
                        <span className="text-base sm:text-lg text-gray-400 line-through font-medium" id="detail-original-price">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                        <span className="text-xs text-red-500 font-bold ml-2">
                          Save {product.discount}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Controls: Qty Selector, Add to Cart, Wishlist */}
                  <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-8">
                    {/* Qty Selector */}
                    <div className="flex items-center justify-between border border-gray-200 rounded-xl px-3 bg-gray-50/50 min-h-[46px] sm:w-32">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-1 text-gray-500 hover:text-black hover:bg-white rounded-lg transition-colors font-bold text-lg"
                        id="qty-minus-btn"
                      >
                        -
                      </button>
                      <span className="font-mono text-sm font-semibold px-3" id="qty-display">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="p-1 text-gray-500 hover:text-black hover:bg-white rounded-lg transition-colors font-bold text-lg"
                        id="qty-plus-btn"
                      >
                        +
                      </button>
                    </div>

                    {/* Add to Cart button */}
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      className={`flex-1 font-semibold py-3 px-6 rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-sm ${
                        product.stock === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : isAdded
                          ? "bg-emerald-600 text-white shadow-emerald-100"
                          : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-100"
                      }`}
                      id="modal-add-to-cart-btn"
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3px]" />
                          Added to Cart
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          Add to Cart • ${(product.price * quantity).toFixed(2)}
                        </>
                      )}
                    </button>

                    {/* Wishlist toggle */}
                    <button
                      onClick={() => onToggleWishlist(product)}
                      className={`p-3 border rounded-xl active:scale-95 transition-all duration-200 flex items-center justify-center bg-white ${
                        isWishlisted 
                          ? "border-[#1e3a8a] text-[#1e3a8a] bg-blue-50/10" 
                          : "border-gray-200 hover:border-[#1e3a8a] text-gray-400 hover:text-[#1e3a8a]"
                      }`}
                      aria-label="Wishlist"
                      id="modal-wishlist-toggle"
                    >
                      <Heart className={`w-5 h-5 transition-transform duration-300 ${isWishlisted ? "fill-[#1e3a8a] text-[#1e3a8a] scale-110" : ""}`} />
                    </button>
                  </div>
                </div>

                {/* Tabs Panel (Specs or Reviews) */}
                <div className="border border-gray-100 rounded-2xl overflow-hidden mb-8">
                  {/* Tab headers */}
                  <div className="flex border-b border-gray-100 bg-gray-50/50">
                    <button
                      onClick={() => setActiveTab("specs")}
                      className={`flex-1 py-3 text-center text-xs sm:text-sm font-semibold tracking-wide transition-colors ${
                        activeTab === "specs"
                          ? "bg-white text-slate-900 border-b-2 border-slate-900"
                          : "text-gray-400 hover:text-slate-900"
                      }`}
                      id="tab-specs-header"
                    >
                      Specifications
                    </button>
                    <button
                      onClick={() => setActiveTab("reviews")}
                      className={`flex-1 py-3 text-center text-xs sm:text-sm font-semibold tracking-wide transition-colors ${
                        activeTab === "reviews"
                          ? "bg-white text-slate-900 border-b-2 border-slate-900"
                          : "text-gray-400 hover:text-slate-900"
                      }`}
                      id="tab-reviews-header"
                    >
                      Reviews ({product.reviews.length})
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="p-4 bg-white max-h-48 overflow-y-auto">
                    {activeTab === "specs" ? (
                      <table className="w-full text-xs sm:text-sm">
                        <tbody>
                          {product.specs.map((spec, index) => (
                            <tr
                              key={index}
                              className={`border-b border-gray-50 last:border-0 ${
                                index % 2 === 0 ? "bg-slate-50/30" : ""
                              }`}
                            >
                              <td className="py-2.5 px-3 font-semibold text-slate-800 w-1/3">
                                {spec.label}
                              </td>
                              <td className="py-2.5 px-3 text-gray-600">
                                {spec.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="space-y-4">
                        {product.reviews.map((rev) => {
                          const isHelpful = !!helpfulReviews[rev.id];
                          return (
                            <div key={rev.id} className="border-b border-gray-50 pb-3 last:border-0">
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-semibold text-xs text-slate-800">{rev.author}</span>
                                <span className="text-[10px] text-gray-400">{rev.date}</span>
                              </div>
                              <div className="flex items-center text-amber-500 gap-0.5 mb-1.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${i < rev.rating ? "fill-current" : "text-gray-200"}`}
                                  />
                                ))}
                              </div>
                              <p className="text-xs text-gray-600 mb-2 leading-relaxed">{rev.comment}</p>
                              
                              <button
                                onClick={() => handleToggleHelpful(rev.id)}
                                className={`text-[10px] flex items-center gap-1 font-medium transition-colors ${
                                  isHelpful ? "text-emerald-600" : "text-gray-400 hover:text-slate-800"
                                }`}
                                id={`helpful-btn-${rev.id}`}
                              >
                                <span>Was this helpful?</span>
                                <span className="underline">
                                  {isHelpful ? rev.helpfulCount + 1 : rev.helpfulCount}
                                </span>
                              </button>
                            </div>
                          );
                        })}
                        {product.reviews.length === 0 && (
                          <p className="text-xs text-gray-400 italic text-center py-4">No reviews yet.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Related Products Panel */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <span>You May Also Like</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {relatedProducts.map((rel) => (
                      <div
                        key={rel.id}
                        onClick={() => {
                          onProductSelect(rel);
                          setQuantity(1); // Reset qty on navigation
                        }}
                        className="flex items-center gap-2.5 p-2 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors border border-slate-100/50"
                        id={`related-item-${rel.id}`}
                      >
                        <img
                          src={rel.image}
                          alt={rel.name}
                          className="w-10 h-10 object-cover rounded-lg bg-white shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-900 truncate">{rel.name}</div>
                          <div className="text-[11px] text-gray-400 font-medium mt-0.5">${rel.price.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
