import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Search, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
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
  X,
  RotateCcw,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, Order, Product } from "../types";
import { SEED_ORDERS } from "../data/orders";

interface OrderHistoryPageProps {
  userProfile: UserProfile | null;
  wishlistCount: number;
  cartCount: number;
  onBackToCatalog: () => void;
  onWishlistClick: () => void;
  onProfileClick: () => void;
  onCartClick: () => void;
  onProductSelect: (product: Product) => void;
}

export default function OrderHistoryPage({
  userProfile,
  wishlistCount,
  cartCount,
  onBackToCatalog,
  onWishlistClick,
  onProfileClick,
  onCartClick,
  onProductSelect
}: OrderHistoryPageProps) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest First");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Collect all orders: if user is logged in, use their history. Otherwise default to seeds.
    let list: Order[] = [];
    if (userProfile && userProfile.orderHistory && userProfile.orderHistory.length > 0) {
      list = [...userProfile.orderHistory];
    } else {
      list = [...SEED_ORDERS];
    }
    setOrders(list);
  }, [userProfile]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle order expanded state
  const toggleExpand = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setTimeFilter("All");
    setSortBy("Newest First");
    triggerToast("All history filters cleared");
  };

  // Helper to convert date string "Month DD, YYYY" into Date object for sorting
  const parseOrderDate = (dateStr: string) => {
    try {
      return new Date(dateStr);
    } catch {
      return new Date();
    }
  };

  // Filter & Sort Logic
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Search Query: Match Order ID or Product Name
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(o => 
        o.id.toLowerCase().includes(q) || 
        o.items.some(item => item.productName.toLowerCase().includes(q))
      );
    }

    // Status Filter
    if (statusFilter !== "All") {
      result = result.filter(o => {
        if (statusFilter === "Completed" || statusFilter === "Delivered") {
          return o.status === "Delivered";
        }
        if (statusFilter === "In Transit") {
          return o.status === "Shipped";
        }
        return o.status.toLowerCase() === statusFilter.toLowerCase();
      });
    }

    // Time Filter (mock implementation based on seed dates)
    if (timeFilter !== "All") {
      const today = new Date();
      result = result.filter(o => {
        const orderDate = parseOrderDate(o.date);
        const diffTime = Math.abs(today.getTime() - orderDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (timeFilter === "Last 30 Days") {
          return diffDays <= 30;
        }
        if (timeFilter === "Last 3 Months") {
          return diffDays <= 90;
        }
        if (timeFilter === "Last 6 Months") {
          return diffDays <= 180;
        }
        if (timeFilter === "Last Year") {
          return diffDays <= 365;
        }
        return true;
      });
    }

    // Sorting
    if (sortBy === "Newest First") {
      result.sort((a, b) => parseOrderDate(b.date).getTime() - parseOrderDate(a.date).getTime());
    } else if (sortBy === "Oldest First") {
      result.sort((a, b) => parseOrderDate(a.date).getTime() - parseOrderDate(b.date).getTime());
    } else if (sortBy === "Price: High to Low") {
      result.sort((a, b) => (b.grandTotal || b.total) - (a.grandTotal || a.total));
    } else if (sortBy === "Price: Low to High") {
      result.sort((a, b) => (a.grandTotal || a.total) - (b.grandTotal || b.total));
    }

    return result;
  }, [orders, searchQuery, statusFilter, timeFilter, sortBy]);

  // Stepper Configurations
  const getStepperStatus = (status: Order["status"]) => {
    switch (status) {
      case "Processing":
        return {
          steps: [
            { label: "Placed", done: true, current: false },
            { label: "Confirmed", done: true, current: true },
            { label: "Shipped", done: false, current: false },
            { label: "Out For Delivery", done: false, current: false },
            { label: "Delivered", done: false, current: false }
          ],
          percent: 25,
          badge: "PROCESSING",
          badgeStyle: "bg-amber-50 text-amber-700 border-amber-200"
        };
      case "Shipped":
        return {
          steps: [
            { label: "Placed", done: true, current: false },
            { label: "Confirmed", done: true, current: false },
            { label: "Shipped", done: true, current: true },
            { label: "Out For Delivery", done: false, current: false },
            { label: "Delivered", done: false, current: false }
          ],
          percent: 50,
          badge: "IN TRANSIT",
          badgeStyle: "bg-slate-900 text-white border-transparent"
        };
      case "Delivered":
        return {
          steps: [
            { label: "Placed", done: true, current: false },
            { label: "Confirmed", done: true, current: false },
            { label: "Shipped", done: true, current: false },
            { label: "Out For Delivery", done: true, current: false },
            { label: "Delivered", done: true, current: true }
          ],
          percent: 100,
          badge: "DELIVERED",
          badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200 animate-fade-in"
        };
      case "Return Requested":
        return {
          steps: [
            { label: "Placed", done: true, current: false },
            { label: "Confirmed", done: true, current: false },
            { label: "Delivered", done: true, current: false },
            { label: "Return Requested", done: true, current: true },
            { label: "Refund Processed", done: false, current: false }
          ],
          percent: 75,
          badge: "RETURN REQUESTED",
          badgeStyle: "bg-purple-50 text-purple-700 border-purple-200"
        };
      default:
        return {
          steps: [],
          percent: 0,
          badge: "UNKNOWN",
          badgeStyle: "bg-gray-100 text-gray-700"
        };
    }
  };

  const handleDownloadReport = () => {
    triggerToast("Your official purchase history report has been compiled and downloaded.");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] font-sans relative" id="order-history-page-view">
      
      {/* FREE SHIPPING HEADER NOTICE */}
      <div className="bg-black text-white text-[10px] sm:text-xs font-semibold py-2.5 px-4 text-center tracking-[0.15em] select-none" id="shipping-banner">
        FREE SHIPPING ON ORDERS OVER $75
      </div>

      {/* HEADER NAVBAR - Elegant and matches CatalogPage/ProductPage */}
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-950 tracking-tight">
              Order History
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {filteredOrders.length === orders.length
                ? `${orders.length} orders placed in the last 6 months.`
                : `${filteredOrders.length} of ${orders.length} orders match your filters.`}
            </p>
          </div>
          
          {/* Download Report Button */}
          <button 
            onClick={handleDownloadReport}
            className="flex items-center gap-2 text-xs font-bold text-slate-900 bg-white hover:bg-gray-50 border border-gray-100 hover:border-gray-200 px-5 py-3 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:shadow-md transition-all shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Download Report</span>
          </button>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4.5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.015)] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
            {/* Search Input (7 columns wide) */}
            <div className="md:col-span-6 relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input 
                type="text"
                placeholder="Search orders by item name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 hover:bg-gray-100/50 focus:bg-white border border-gray-100 focus:border-slate-400 rounded-xl text-xs sm:text-sm font-sans placeholder-gray-400 transition-all outline-none"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns (6 columns total) */}
            <div className="md:col-span-6 grid grid-cols-3 gap-1.5 sm:gap-2">
              {/* Status Select */}
              <div className="relative">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-2 pr-5.5 sm:pl-3 sm:pr-8 py-2.5 sm:py-3 bg-gray-50 hover:bg-gray-100/50 border border-gray-100 hover:border-slate-300 rounded-xl text-[10px] sm:text-xs font-semibold text-slate-800 transition-all outline-none appearance-none cursor-pointer"
                >
                  <option value="All">Status: All</option>
                  <option value="Processing">Processing</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Return Requested">Returns</option>
                </select>
                <ChevronDown className="w-3 h-3 absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Time Select */}
              <div className="relative">
                <select 
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="w-full pl-2 pr-5.5 sm:pl-3 sm:pr-8 py-2.5 sm:py-3 bg-gray-50 hover:bg-gray-100/50 border border-gray-100 hover:border-slate-300 rounded-xl text-[10px] sm:text-xs font-semibold text-slate-800 transition-all outline-none appearance-none cursor-pointer"
                >
                  <option value="All">Time: All</option>
                  <option value="Last 30 Days">30 Days</option>
                  <option value="Last 3 Months">3 Months</option>
                  <option value="Last 6 Months">6 Months</option>
                  <option value="Last Year">Last Year</option>
                </select>
                <ChevronDown className="w-3 h-3 absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Sort Select */}
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-2 pr-5.5 sm:pl-3 sm:pr-8 py-2.5 sm:py-3 bg-gray-50 hover:bg-gray-100/50 border border-gray-100 hover:border-slate-300 rounded-xl text-[10px] sm:text-xs font-semibold text-slate-800 transition-all outline-none appearance-none cursor-pointer"
                >
                  <option value="Newest First">Newest</option>
                  <option value="Oldest First">Oldest</option>
                  <option value="Price: High to Low">Price: H-L</option>
                  <option value="Price: Low to High">Price: L-H</option>
                </select>
                <ChevronDown className="w-3 h-3 absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Filters summary block */}
          {(searchQuery || statusFilter !== "All" || timeFilter !== "All" || sortBy !== "Newest First") && (
            <div className="border-t border-gray-100 pt-3 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-gray-400 font-medium">
                <span>Active filters:</span>
                {searchQuery && <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md font-bold">Search: "{searchQuery}"</span>}
                {statusFilter !== "All" && <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md font-bold">Status: {statusFilter}</span>}
                {timeFilter !== "All" && <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md font-bold">Time: {timeFilter}</span>}
                {sortBy !== "Newest First" && <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md font-bold">{sortBy}</span>}
              </div>
              <button 
                onClick={handleClearFilters}
                className="text-xs font-bold text-slate-900 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>CLEAR FILTERS</span>
              </button>
            </div>
          )}
        </div>

        {/* ORDER LIST STACK */}
        <div className="space-y-5" id="order-history-list">
          <AnimatePresence initial={false}>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const otherItemsCount = order.items.length - 1;

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white border border-gray-100 hover:border-slate-300 transition-all duration-300 rounded-3xl overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.03)] cursor-pointer group"
                    onClick={() => navigate(`/order-history/${order.id.replace('#', '')}`)}
                  >
                    <div className="p-5 sm:p-6.5 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
                      <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-10 gap-y-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">Order ID</span>
                          <span className="text-xs sm:text-sm font-bold text-slate-900 font-mono mt-0.5 block">{order.id}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">Date Placed</span>
                          <span className="text-xs sm:text-sm font-semibold text-slate-600 mt-0.5 block">{order.date}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">Total</span>
                          <span className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 block">
                            ${(order.grandTotal || order.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>

                      {/* Middle & Right interactive elements */}
                      <div className="flex items-center justify-between md:justify-end gap-4.5">
                        {/* Layered Product Thumbnails */}
                        <div className="flex items-center shrink-0">
                          <div className="flex -space-x-4.5 overflow-hidden">
                            {order.items.slice(0, 3).map((item, index) => (
                              <div key={index} className="w-10 h-10 rounded-lg border-2 border-white overflow-hidden bg-slate-50 shrink-0 shadow-sm">
                                <img 
                                  src={item.image} 
                                  alt={item.productName} 
                                  className="w-full h-full object-cover" 
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            ))}
                          </div>
                          {otherItemsCount > 0 && (
                            <span className="text-[11px] font-bold text-slate-500 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-0.5 ml-2 shadow-sm shrink-0 select-none">
                              +{otherItemsCount} {otherItemsCount === 1 ? "item" : "items"}
                            </span>
                          )}
                        </div>

                        {/* Status + Actions block */}
                        <div className="flex items-center gap-4.5">
                          {/* Status Pill */}
                          <div className={`px-3 py-1.5 rounded-full border text-[10px] sm:text-xs font-bold uppercase tracking-wider ${getStepperStatus(order.status).badgeStyle}`}>
                            {getStepperStatus(order.status).badge}
                          </div>

                          {/* Quick Interactive Actions */}
                          <div className="hidden sm:flex items-center gap-3">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerToast(`All items from order ${order.id} re-added to your shopping cart.`);
                              }}
                              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] tracking-wider rounded-lg uppercase transition-all shadow-sm cursor-pointer"
                            >
                              Buy Again
                            </button>
                          </div>

                          {/* View Details Indicator */}
                          <span className="text-xs font-bold text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all">
                            Details →
                          </span>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center shadow-sm">
                <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-5 mx-auto">
                  <RotateCcw className="w-6 h-6 text-gray-300" />
                </div>
                <h3 className="font-display font-semibold text-lg text-slate-900 mb-1">No orders found</h3>
                <p className="text-xs sm:text-sm text-gray-400 max-w-sm mx-auto mb-6">
                  No purchase history matches your selected criteria. Try typing a different product name or clearing filters.
                </p>
                <button 
                  onClick={handleClearFilters}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 bg-white py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-400">
          <p>© 2026 Luxe Market Inc. All rights reserved.</p>
          <p className="mt-1">All history statistics and statements are certified under SSL-secure transactions protocols.</p>
        </div>
      </footer>

    </div>
  );
}
