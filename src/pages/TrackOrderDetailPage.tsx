import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  ExternalLink, 
  Check, 
  Truck, 
  ShoppingBag, 
  Heart, 
  User, 
  Package, 
  Calendar, 
  FileText, 
  Clock, 
  Search,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, Order, Product } from "../types";
import { SEED_ORDERS } from "../data/orders";

interface TrackOrderDetailPageProps {
  userProfile: UserProfile | null;
  wishlistCount: number;
  cartCount: number;
  onBackToCatalog: () => void;
  onWishlistClick: () => void;
  onProfileClick: () => void;
  onCartClick: () => void;
  onProductSelect: (product: Product) => void;
}

export default function TrackOrderDetailPage({
  userProfile,
  wishlistCount,
  cartCount,
  onBackToCatalog,
  onWishlistClick,
  onProfileClick,
  onCartClick,
  onProductSelect
}: TrackOrderDetailPageProps) {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let list: Order[] = [];
    if (userProfile && userProfile.orderHistory && userProfile.orderHistory.length > 0) {
      list = [...userProfile.orderHistory];
    } else {
      list = [...SEED_ORDERS];
    }
    setOrders(list);

    if (orderId) {
      // Look for match (ignoring case or hash prefix if needed)
      const cleanTargetId = orderId.toUpperCase();
      const found = list.find(o => 
        o.id.toUpperCase() === cleanTargetId || 
        o.id.toUpperCase() === `#${cleanTargetId}` || 
        `#${o.id.toUpperCase()}` === cleanTargetId
      );
      if (found) {
        setSelectedOrder(found);
      }
    }
  }, [userProfile, orderId]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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
          badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200"
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

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] font-sans relative" id="track-order-detail-page-view">
      
      {/* FREE SHIPPING BANNER */}
      <div className="bg-black text-white text-[10px] sm:text-xs font-semibold py-2.5 px-4 text-center tracking-[0.15em] select-none">
        FREE SHIPPING ON ORDERS OVER $75
      </div>

      {/* HEADER NAVBAR */}
      <header className="bg-white border-b border-gray-100 py-5 sticky top-0 z-40 shadow-[0_2px_15px_rgba(0,0,0,0.015)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          <button 
            onClick={() => navigate("/track-order")}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Track Orders</span>
          </button>

          <button onClick={onBackToCatalog} className="flex items-center">
            <span className="font-sans font-bold text-lg sm:text-xl tracking-[0.15em] text-slate-900 uppercase">
              LUXE<span className="font-light text-gray-500">MARKET</span>
            </span>
          </button>

          <div className="flex items-center gap-1 sm:gap-3.5 shrink-0">
            <button
              onClick={onBackToCatalog}
              className="p-1.5 sm:p-2 text-gray-700 hover:text-slate-900 hover:bg-gray-50 rounded-full transition-all"
            >
              <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-slate-600" />
            </button>
            <button
              onClick={onWishlistClick}
              className="relative p-1.5 sm:p-2 text-gray-700 hover:text-red-500 hover:bg-red-50/50 rounded-full transition-all"
            >
              <Heart className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-slate-600" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            <button
              onClick={onCartClick}
              className="relative p-1.5 sm:p-2 text-gray-700 hover:text-slate-950 hover:bg-gray-50 rounded-full transition-all"
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

      {/* MAIN CONTENT AREA - 100vw friendly max-w-none with padding for massive cinematic detail layout */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-16 py-8 md:py-12 space-y-8">
        
        <AnimatePresence mode="wait">
          {selectedOrder ? (
            <motion.div
              key={selectedOrder.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Back to list and ID Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  <span>Track Orders</span>
                  <ChevronRight className="w-3 h-3 text-gray-300" />
                  <span className="text-slate-900 font-bold">{selectedOrder.id}</span>
                </div>
                <button
                  onClick={() => navigate("/track-order")}
                  className="text-xs font-bold text-slate-900 hover:text-slate-600 flex items-center gap-1.5 hover:underline"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View All Orders List</span>
                </button>
              </div>

              {/* Order Details Header */}
              <div className="border border-slate-900 bg-white rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.03)]">
                {/* Meta Header */}
                <div className="border-b border-gray-100 bg-slate-50/50 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-x-8 sm:gap-x-12 gap-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">Order ID</span>
                      <span className="text-sm font-bold text-slate-900 font-mono mt-0.5 block">{selectedOrder.id}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">Date Placed</span>
                      <span className="text-sm font-semibold text-slate-700 mt-0.5 block">{selectedOrder.date}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">Carrier Partner</span>
                      <span className="text-sm font-semibold text-slate-700 mt-0.5 block">{selectedOrder.carrier || "DHL Express"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">Total</span>
                      <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">
                        ${(selectedOrder.grandTotal || selectedOrder.total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <div className={`px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider shadow-sm self-start md:self-auto ${getStepperStatus(selectedOrder.status).badgeStyle}`}>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      {getStepperStatus(selectedOrder.status).badge}
                    </span>
                  </div>
                </div>

                {/* Live Stepper Tracker */}
                <div className="p-6 sm:p-10 border-b border-gray-100 overflow-x-auto scrollbar-none">
                  <div className="relative py-4 min-w-[550px] sm:min-w-0">
                    <div className="absolute top-[28px] left-0 right-0 h-1 bg-gray-100 rounded-full" />
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${getStepperStatus(selectedOrder.status).percent}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="absolute top-[28px] left-0 h-1 bg-slate-950 rounded-full"
                    />

                    <div className="relative flex justify-between">
                      {getStepperStatus(selectedOrder.status).steps.map((step, idx) => {
                        const isDone = step.done;
                        const isCurrent = step.current;
                        return (
                          <div key={idx} className="flex flex-col items-center group relative z-10">
                            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                              isDone 
                                ? 'bg-slate-950 border-slate-950 text-white' 
                                : 'bg-white border-gray-200 text-gray-300'
                            } ${isCurrent ? 'ring-4 ring-slate-150 scale-110 shadow-md' : ''}`}>
                              {idx === 2 ? (
                                <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              ) : isDone ? (
                                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              ) : (
                                <span className="w-2 h-2 rounded-full bg-gray-200" />
                              )}
                            </div>
                            
                            <span className={`text-[10px] sm:text-xs font-bold mt-3 transition-colors ${
                              isDone ? 'text-slate-900 font-bold' : 'text-gray-400 font-medium'
                            }`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Expected Delivery Alert Block */}
                <div className="bg-slate-50 p-5 px-6 sm:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-500" />
                    <div>
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Estimated Arrival</span>
                      <span className="text-sm sm:text-base font-bold text-slate-950">
                        {selectedOrder.expectedDelivery}
                      </span>
                    </div>
                  </div>
                  <a 
                    href={selectedOrder.carrierUrl || "https://dhl.com"}
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs font-bold bg-white border border-gray-200 text-slate-950 hover:bg-slate-900 hover:text-white hover:border-slate-900 px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] shrink-0"
                  >
                    <span>Track on {selectedOrder.carrier || "DHL Express"} Services</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Grid Split Content - Cinematic full width layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 border-t border-gray-100">
                  
                  {/* Left Column: Order Items */}
                  <div className="lg:col-span-7 p-6 sm:p-10 space-y-6 lg:border-r border-gray-100">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
                        Shipment breakdown
                      </h3>
                      <p className="text-xs text-gray-500">Review the luxurious products enclosed in this consignment.</p>
                    </div>
                    
                    <div className="divide-y divide-gray-100">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="py-5 first:pt-0 last:pb-0 flex gap-5">
                          <div className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.productName} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 hover:text-slate-700 transition-colors cursor-pointer">
                                {item.productName}
                              </h4>
                              {item.details && (
                                <p className="text-[11px] sm:text-xs text-gray-400 font-medium mt-1">
                                  {item.details}
                                </p>
                              )}
                              <p className="text-[11px] sm:text-xs text-gray-500 font-semibold mt-1">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <span className="font-mono font-bold text-xs sm:text-sm text-slate-950 mt-1 self-start">
                              ${(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Address, Payment, Totals, Actions */}
                  <div className="lg:col-span-5 p-6 sm:p-10 bg-slate-50/20 flex flex-col gap-8 justify-between">
                    
                    <div className="space-y-6">
                      {/* Shipping Address */}
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                          Delivery destination
                        </h4>
                        {selectedOrder.shippingAddress ? (
                          <div className="text-xs text-slate-700 leading-relaxed font-sans bg-white p-4 rounded-2xl border border-gray-100">
                            <p className="font-bold text-slate-900">{selectedOrder.shippingAddress.name}</p>
                            <p className="mt-0.5">{selectedOrder.shippingAddress.line1}</p>
                            <p>{selectedOrder.shippingAddress.line2}</p>
                            <p className="text-gray-500 mt-1">{selectedOrder.shippingAddress.country}</p>
                          </div>
                        ) : (
                          <div className="text-xs text-slate-700 leading-relaxed font-sans bg-white p-4 rounded-2xl border border-gray-100">
                            <p className="font-bold text-slate-900">Alexander Sterling</p>
                            <p className="mt-0.5">1200 Avenue of the Americas, Ste 4200</p>
                            <p>New York, NY 10036</p>
                            <p className="text-gray-500 mt-1">United States</p>
                          </div>
                        )}
                      </div>

                      {/* Payment Method */}
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                          Billing credentials
                        </h4>
                        <div className="flex items-center gap-2.5 text-xs text-slate-800 font-sans font-semibold bg-white p-4 rounded-2xl border border-gray-100">
                          <CreditCard className="w-4.5 h-4.5 text-slate-400" />
                          <span>{selectedOrder.paymentMethod || "Visa ending in •••• 4242"}</span>
                        </div>
                      </div>

                      {/* Cost Summary Box */}
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                          Consolidated charges
                        </h4>
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-3">
                          <div className="flex justify-between text-xs text-slate-600 font-medium">
                            <span>Consignment Subtotal</span>
                            <span className="font-mono">${selectedOrder.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-600 font-medium">
                            <span>Delivery Partner Fee</span>
                            <span className="text-emerald-600 font-bold">{selectedOrder.shipping === 0 ? 'Free Priority Shipping' : `$${selectedOrder.shipping?.toFixed(2)}`}</span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-600 font-medium">
                            <span>Estimated Tax</span>
                            <span className="font-mono">${(selectedOrder.tax || (selectedOrder.total * 0.0825)).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                          </div>
                          
                          <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
                            <span className="text-xs font-bold text-slate-900">Amount Charged</span>
                            <span className="text-xl font-black text-slate-950 font-sans">
                              ${(selectedOrder.grandTotal || (selectedOrder.total * 1.0825)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-4">
                      <button 
                        onClick={() => triggerToast("Consignment items have been appended to your shopping cart.")}
                        className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl tracking-wider uppercase transition-all shadow-md active:scale-[0.99] cursor-pointer"
                      >
                        Buy This Consignment Again
                      </button>
                      
                      <button 
                        onClick={() => triggerToast("A support representative has been dispatched to coordinate with you shortly.")}
                        className="w-full py-3.5 bg-white hover:bg-gray-50 text-slate-900 border border-slate-200 font-bold text-xs rounded-xl tracking-wider uppercase transition-all active:scale-[0.99] cursor-pointer"
                      >
                        Contact Support Agent
                      </button>

                      <button 
                        onClick={() => triggerToast("Customer assistance channel opened. Connecting to Luxe Support...")}
                        className="w-full text-center text-[11px] font-bold text-gray-400 hover:text-slate-950 transition-colors py-1 hover:underline cursor-pointer"
                      >
                        File an Inquiry or Claim
                      </button>
                    </div>

                  </div>

                </div>
              </div>

            </motion.div>
          ) : (
            <div className="bg-white border border-gray-150 rounded-3xl p-16 text-center max-w-lg mx-auto">
              <Package className="w-12 h-12 mx-auto text-gray-300 mb-4 animate-bounce" />
              <p className="text-sm font-semibold text-slate-900">Consignment Not Found</p>
              <p className="text-xs text-gray-400 mt-1 mb-6">The specified tracking ID does not exist in our systems or is inaccessible.</p>
              <button
                onClick={() => navigate("/track-order")}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
              >
                Back to Track Orders List
              </button>
            </div>
          )}
        </AnimatePresence>

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
