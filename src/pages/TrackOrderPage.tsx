import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  CreditCard, 
  ExternalLink, 
  Check, 
  Truck, 
  ShoppingBag, 
  Sparkles,
  Heart,
  User,
  Package,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, Order, Product } from "../types";
import { SEED_ORDERS } from "../data/orders";

interface TrackOrderPageProps {
  userProfile: UserProfile | null;
  wishlistCount: number;
  cartCount: number;
  onBackToCatalog: () => void;
  onWishlistClick: () => void;
  onProfileClick: () => void;
  onCartClick: () => void;
  onProductSelect: (product: Product) => void;
}

export default function TrackOrderPage({
  userProfile,
  wishlistCount,
  cartCount,
  onBackToCatalog,
  onWishlistClick,
  onProfileClick,
  onCartClick,
  onProductSelect
}: TrackOrderPageProps) {
  const [searchParams] = useSearchParams();
  const queryOrderId = searchParams.get("id");
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let list: Order[] = [];
    if (userProfile && userProfile.orderHistory && userProfile.orderHistory.length > 0) {
      list = [...userProfile.orderHistory];
    } else {
      list = [...SEED_ORDERS];
    }
    setOrders(list);

    // Dynamic redirect if we have a legacy queryOrderId (?id=...)
    if (queryOrderId) {
      const found = list.find(o => 
        o.id.toUpperCase() === queryOrderId.toUpperCase() ||
        o.id.toUpperCase() === `#${queryOrderId.toUpperCase()}` ||
        `#${o.id.toUpperCase()}` === queryOrderId.toUpperCase()
      );
      if (found) {
        navigate(`/track-order/${found.id.replace('#', '')}`, { replace: true });
      }
    }
  }, [userProfile, queryOrderId, navigate]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getStepperStatus = (status: Order["status"]) => {
    switch (status) {
      case "Processing":
        return {
          badge: "PROCESSING",
          badgeStyle: "bg-amber-50 text-amber-700 border-amber-200"
        };
      case "Shipped":
        return {
          badge: "IN TRANSIT",
          badgeStyle: "bg-slate-900 text-white border-transparent"
        };
      case "Delivered":
        return {
          badge: "DELIVERED",
          badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200"
        };
      case "Return Requested":
        return {
          badge: "RETURN REQUEST",
          badgeStyle: "bg-purple-50 text-purple-700 border-purple-200"
        };
      default:
        return {
          badge: "UNKNOWN",
          badgeStyle: "bg-gray-100 text-gray-700"
        };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] font-sans relative" id="track-order-list-page-view">
      
      {/* FREE SHIPPING HEADER NOTICE */}
      <div className="bg-black text-white text-[10px] sm:text-xs font-semibold py-2.5 px-4 text-center tracking-[0.15em] select-none" id="shipping-banner">
        FREE SHIPPING ON ORDERS OVER $75
      </div>

      {/* HEADER NAVBAR */}
      <header className="bg-white border-b border-gray-100 py-5 sticky top-0 z-40 shadow-[0_2px_15px_rgba(0,0,0,0.015)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          <button 
            onClick={onBackToCatalog}
            className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors shrink-0"
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
            <span className="font-sans font-bold text-lg sm:text-xl tracking-[0.15em] text-slate-900 uppercase">
              LUXE<span className="font-light text-gray-500">MARKET</span>
            </span>
          </button>

          <div className="flex items-center gap-1 sm:gap-3.5 shrink-0">
            <button
              onClick={onBackToCatalog}
              className="p-1.5 sm:p-2 text-gray-700 hover:text-slate-900 hover:bg-gray-50 rounded-full transition-all"
              aria-label="Search"
            >
              <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-slate-600" />
            </button>
            <button
              onClick={onWishlistClick}
              className="relative p-1.5 sm:p-2 text-gray-700 hover:text-red-500 hover:bg-red-50/50 rounded-full transition-all"
              aria-label="Wishlist"
              id="wishlist-action-btn"
            >
              <Heart className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-slate-600" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            <button
              onClick={onCartClick}
              className="relative p-1.5 sm:p-2 text-gray-700 hover:text-slate-950 hover:bg-gray-50 rounded-full transition-all"
              aria-label="Cart"
              id="cart-action-btn"
            >
              <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-slate-600" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-4.5 sm:h-4.5 bg-slate-900 text-[8px] sm:text-[9px] font-bold text-white rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={onProfileClick}
              className="p-1.5 sm:p-2 text-gray-700 hover:text-slate-900 hover:bg-gray-50 rounded-full transition-all"
              aria-label="Profile"
              id="cart-profile-btn"
            >
              <User className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </header>

      {/* TOAST MESSAGE */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        
        {/* TOP TITLE HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-gray-100 pb-6">
          <div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-950 tracking-tight">
              Track Your Orders
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Select an order to view live transit timelines, courier services, expected arrival, and detailed consignment info.
            </p>
          </div>
          
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-900">
            <a 
              href="/order-history" 
              className="flex items-center gap-1.5 hover:text-slate-600 bg-white border border-gray-100 px-4 py-2.5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:shadow-md transition-all shrink-0"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>View Order History</span>
            </a>
          </div>
        </div>

        {/* LIST OF ORDERS - PREMIUM LIST UI */}
        <div className="flex flex-col gap-4" id="track-orders-list-container">
          {orders.map((order) => {
            const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
            const badgeConfig = getStepperStatus(order.status);
            
            return (
              <motion.div
                key={order.id}
                whileHover={{ y: -2, scale: 1.005 }}
                className="bg-white border border-gray-150 rounded-2xl p-5 md:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.03)] hover:border-slate-400 transition-all duration-300 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-6 group"
                onClick={() => navigate(`/track-order/${order.id.replace('#', '')}`)}
              >
                {/* Section 1: Order ID, Thumbnails, Details */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 lg:w-[55%]">
                  {/* Overlapping Thumbnails Stack */}
                  <div className="flex -space-x-3 overflow-hidden p-1 shrink-0">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <div 
                        key={idx} 
                        className="relative w-12 h-12 rounded-xl border-2 border-white bg-slate-50 overflow-hidden shadow-sm flex items-center justify-center shrink-0"
                        style={{ zIndex: 10 - idx }}
                      >
                        <img 
                          src={item.image} 
                          alt={item.productName} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {idx === 2 && order.items.length > 3 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px] font-black text-white">
                            +{order.items.length - 2}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* ID & Core Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-widest text-gray-400">ID:</span>
                      <span className="text-sm font-bold text-slate-950 font-mono tracking-tight">{order.id}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      Placed on {order.date} • <strong className="text-slate-800 font-bold">{totalItems} {totalItems === 1 ? 'item' : 'items'}</strong>
                    </p>
                  </div>
                </div>

                {/* Section 2: Status Badge */}
                <div className="flex items-center sm:w-auto lg:w-[20%]">
                  <div className={`px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${badgeConfig.badgeStyle}`}>
                    {badgeConfig.badge}
                  </div>
                </div>

                {/* Section 3: Cost & Navigation CTA */}
                <div className="flex items-center justify-between lg:justify-end gap-6 border-t border-gray-50 pt-4 lg:pt-0 lg:border-t-0 lg:w-[25%]">
                  <div className="lg:text-right">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 block">Grand Total</span>
                    <span className="text-sm sm:text-base font-black text-slate-950 font-sans block mt-0.5">
                      ${(order.grandTotal || order.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <span className="text-xs font-black text-slate-900 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform shrink-0">
                    <span className="hidden sm:inline">Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {orders.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center max-w-md mx-auto">
            <Package className="w-12 h-12 mx-auto text-gray-300 mb-4 animate-bounce" />
            <p className="text-sm font-semibold text-slate-900">No Orders Placed Yet</p>
            <p className="text-xs text-gray-400 mt-1 mb-6">You don't have any active tracking queries or shopping histories on file.</p>
            <button
              onClick={onBackToCatalog}
              className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
            >
              Start Shopping
            </button>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 bg-white py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-400">
          <p>© 2026 Luxe Market Inc. All rights reserved.</p>
          <p className="mt-1">All premium delivery tracking queries are serviced via DHL Express and FedEx Priority carriers.</p>
        </div>
      </footer>

    </div>
  );
}
