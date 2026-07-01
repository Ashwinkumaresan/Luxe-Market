import { Heart, Star, ShoppingCart, Sparkles, Check } from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";
import { Product } from "../types";

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onAddToCart: (p: Product, selectedColor: string) => void;
  onToggleWishlist: (p: Product) => void;
  isWishlisted: boolean;
  onProductClick: (p: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onProductClick
}: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening product detail modal
    setIsAdding(true);
    // Add default color (first color option)
    const defaultColor = product.colors[0]?.name || "Default";
    onAddToCart(product, defaultColor);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1200);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening product detail modal
    onToggleWishlist(product);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35 }}
      onClick={() => onProductClick(product)}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-slate-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 flex flex-col cursor-pointer select-none relative"
      id={`product-card-${product.id}`}
    >
      {/* Absolute Badges */}
      <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1.5 items-start">
        {product.isBestSeller && (
          <span className="bg-slate-900 text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md uppercase" id={`bestseller-badge-${product.id}`}>
            Best Seller
          </span>
        )}
        {product.discount && (
          <span className="bg-red-500 text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md uppercase" id={`discount-badge-${product.id}`}>
            {product.discount}% OFF
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        className={`absolute top-3.5 right-3.5 z-10 p-2.5 bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.08)] active:scale-90 transition-all duration-200 ${
          isWishlisted 
            ? "text-[#1e3a8a] hover:bg-white" 
            : "text-slate-400 hover:text-[#1e3a8a] hover:bg-white"
        }`}
        aria-label="Toggle Wishlist"
        id={`wishlist-toggle-${product.id}`}
      >
        <Heart className={`w-4 h-4 transition-all duration-300 ${isWishlisted ? "fill-[#1e3a8a] text-[#1e3a8a] scale-110" : "group-hover:scale-110"}`} />
      </button>

      {/* Image Container with Hover Scale */}
      <div className="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          id={`product-image-${product.id}`}
        />
        {product.stock <= 3 && product.stock > 0 && (
          <div className="absolute bottom-2.5 left-2.5 bg-amber-500/90 backdrop-blur-sm text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-md">
            Only {product.stock} Left
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg tracking-wider uppercase">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-slate-800" id={`product-rating-num-${product.id}`}>
              {product.rating}
            </span>
            <span className="text-xs text-gray-400 font-medium" id={`product-reviews-count-${product.id}`}>
              ({product.reviewsCount})
            </span>
            {product.ecoFriendly && (
              <span className="ml-auto text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" />
                Eco
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="font-display font-semibold text-sm sm:text-base text-slate-900 line-clamp-1 group-hover:text-slate-800 transition-colors mb-2" id={`product-title-${product.id}`}>
            {product.name}
          </h3>

          {/* Price area */}
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-display font-bold text-base sm:text-lg text-slate-950" id={`product-price-${product.id}`}>
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-xs sm:text-sm text-gray-400 line-through font-medium" id={`product-origprice-${product.id}`}>
                  ${product.originalPrice.toFixed(2)}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-red-500" id={`product-discount-label-${product.id}`}>
                  {product.discount}% OFF
                </span>
              </>
            )}
          </div>
        </div>

        {/* Bottom Points & Button */}
        <div className="space-y-3.5 pt-3.5 border-t border-gray-50">
          {/* Rewards display */}
          <div className="flex items-center justify-between text-[11px] font-medium text-gray-500">
            <span id={`rewards-tag-${product.id}`}>Earn {product.points} points</span>
            <span className="font-mono text-gray-400 text-[10px]" id={`brand-tag-${product.id}`}>{product.brand}</span>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full font-semibold py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-300 shadow-sm ${
              product.stock === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                : isAdding
                ? "bg-emerald-600 text-white shadow-emerald-100"
                : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-100"
            }`}
            id={`add-to-cart-btn-${product.id}`}
          >
            {isAdding ? (
              <>
                <Check className="w-4 h-4 stroke-[3px]" />
                Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
