import React, { useState } from "react";
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  ShoppingBag, 
  ArrowLeft, 
  Loader2, 
  Plus, 
  Percent, 
  Coins, 
  Check, 
  MapPin, 
  Phone,
  Mail,
  User,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CartItem, Order } from "../types";
import { PRODUCTS } from "../data/products";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  cartTotal: number;
  pointsEarned: number;
  onOrderSuccess: (order: Order) => void;
  onUpdateQuantity: (productId: string, color: string, quantity: number, size?: string) => void;
}

interface Address {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  isDefault: boolean;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  cartTotal,
  pointsEarned,
  onOrderSuccess,
  onUpdateQuantity
}: CheckoutModalProps) {
  const [step, setStep] = useState<1 | 2>(1); // 1: Checkout, 2: Success
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("Securing payment portal...");

  // Addresses State
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "addr-1",
      name: "Alex Morgan",
      address: "123 Luxury Avenue",
      city: "New York",
      state: "NY",
      zip: "10001",
      phone: "(555) 000-0000",
      isDefault: true
    },
    {
      id: "addr-2",
      name: "Alex Morgan",
      address: "456 Business Plaza, Suite 200",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      phone: "(555) 999-8888",
      isDefault: false
    }
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState("addr-1");
  const [saveAddress, setSaveAddress] = useState(true);

  // Add Address Inline Form
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: ""
  });
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("express");

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<"gpay" | "phonepe" | "upi">("upi");
  const [upiId, setUpiId] = useState("user@upi");
  const [isUpiVerified, setIsUpiVerified] = useState(false);
  const [isVerifyingUpi, setIsVerifyingUpi] = useState(false);
  const [upiError, setUpiError] = useState("");
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  // Promo Code State
  const [couponCode, setCouponCode] = useState("SAVE20");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>({
    code: "SAVE20",
    discount: 18.00
  });
  const [couponError, setCouponError] = useState("");

  // Loyalty Points State
  const [pointsActive, setPointsActive] = useState(true);
  const [pointsRedeemed, setPointsRedeemed] = useState(1000); // 1,000 points = $10.00 default

  // Math Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  // Coupon Discount
  const couponDiscount = appliedCoupon 
    ? (appliedCoupon.code === "SAVE20" ? 18.00 : Math.min(subtotal * 0.1, subtotal)) 
    : 0;

  // Points Discount (100 points = $1.00)
  const pointsDiscount = pointsActive ? pointsRedeemed / 100 : 0;

  // Shipping Cost
  const shippingCost = shippingMethod === "standard" ? 5.99 : 15.00;

  // Tax calculation: 8.25% of the discounted subtotal
  const taxableAmount = Math.max(0, subtotal - couponDiscount - pointsDiscount);
  const tax = taxableAmount * 0.0825;

  // Final Total
  const grandTotal = Math.max(0, subtotal - couponDiscount - pointsDiscount + shippingCost + tax);

  // Unique Order IDs for success screen
  const [orderReference, setOrderReference] = useState("");
  const [pointsAwarded, setPointsAwarded] = useState(0);

  // Verify UPI ID handler
  const handleVerifyUpi = () => {
    if (!upiId.trim()) {
      setUpiError("UPI ID cannot be empty");
      return;
    }
    if (!upiId.includes("@")) {
      setUpiError("Invalid UPI ID format (must contain @)");
      return;
    }

    setIsVerifyingUpi(true);
    setUpiError("");
    setTimeout(() => {
      setIsVerifyingUpi(false);
      setIsUpiVerified(true);
    }, 1200);
  };

  // Add Address Action
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!addressForm.name.trim()) errors.name = "Full name is required";
    if (!addressForm.address.trim()) errors.address = "Street address is required";
    if (!addressForm.city.trim()) errors.city = "City is required";
    if (!addressForm.state.trim()) errors.state = "State is required";
    if (!addressForm.zip.trim()) errors.zip = "Postal code is required";
    if (!addressForm.phone.trim()) errors.phone = "Phone number is required";

    if (Object.keys(errors).length > 0) {
      setAddressErrors(errors);
      return;
    }

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      name: addressForm.name,
      address: addressForm.address,
      city: addressForm.city,
      state: addressForm.state,
      zip: addressForm.zip,
      phone: addressForm.phone,
      isDefault: false
    };

    setAddresses([...addresses, newAddr]);
    setSelectedAddressId(newAddr.id);
    setShowAddAddress(false);
    setAddressForm({
      name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      phone: ""
    });
    setAddressErrors({});
  };

  // Coupon Handler
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError("Enter a coupon code");
      return;
    }
    const code = couponCode.trim().toUpperCase();
    if (code === "SAVE20") {
      setAppliedCoupon({
        code: "SAVE20",
        discount: 18.00
      });
      setCouponError("");
    } else if (code === "WELCOME10") {
      setAppliedCoupon({
        code: "WELCOME10",
        discount: subtotal * 0.1
      });
      setCouponError("");
    } else {
      setCouponError("Invalid promo code. Try 'SAVE20' or 'WELCOME10'");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  // Place Order Transaction
  const handlePlaceOrder = () => {
    if (paymentMethod === "upi" && !isUpiVerified && upiId.trim()) {
      // Auto verify to avoid blocking the customer, but with a friendly simulation
      setIsVerifyingUpi(true);
      setTimeout(() => {
        setIsVerifyingUpi(false);
        setIsUpiVerified(true);
        triggerOrderSubmission();
      }, 800);
      return;
    }

    triggerOrderSubmission();
  };

  const triggerOrderSubmission = () => {
    setIsProcessing(true);
    
    // Staged processing messages for ultra-premium and real-world feel
    setProcessingStatus("Connecting to payment gateway...");
    setTimeout(() => {
      setProcessingStatus("Verifying transaction credentials...");
    }, 700);
    setTimeout(() => {
      setProcessingStatus("Deducting loyalty points & authorization...");
    }, 1400);
    setTimeout(() => {
      setProcessingStatus("Meticulously packaging your invoice...");
    }, 2100);

    setTimeout(() => {
      setIsProcessing(false);
      setStep(2); // Move to Success Screen

      const uniqueOrderNumber = `LXM-${Math.floor(100000 + Math.random() * 900000)}-2026`;
      const uniqueTrackingNumber = `TRK-${Math.floor(100000000 + Math.random() * 900000000)}`;
      const earned = Math.round(grandTotal);
      
      setOrderReference(uniqueOrderNumber);
      setPointsAwarded(earned);

      const newOrder: Order = {
        id: uniqueOrderNumber,
        date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        items: cartItems.map(item => ({
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.image
        })),
        total: grandTotal,
        status: "Processing",
        trackingNumber: uniqueTrackingNumber
      };

      onOrderSuccess(newOrder);
    }, 2800);
  };

  const activeAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#f8f9fc] overflow-y-auto scrollbar-none flex flex-col font-sans" id="full-checkout-container">
          {/* SECURE HEADER */}
          <div className="w-full bg-white border-b border-slate-200/80 py-4 px-4 sm:px-6 md:px-8 flex items-center justify-between sticky top-0 z-40 shadow-[0_2px_15px_rgba(0,0,0,0.015)]">
            <button 
              onClick={onClose}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-950 transition-colors select-none group"
              id="checkout-back-btn"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Store</span>
            </button>
            <div className="text-lg sm:text-xl font-display font-black tracking-wider text-slate-900 select-none text-center">
              LUXE <span className="font-light text-slate-500">MARKET</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl select-none">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-slate-900">Secure Checkout</span>
            </div>
          </div>

          {/* MAIN GRID BODY */}
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 min-w-0">
            {step === 1 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT BLOCK: Shipping details, options, payment */}
                <div className="lg:col-span-7 space-y-8 min-w-0">
                  
                  {/* 1. SHIPPING ADDRESS SECTION */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <h2 className="text-base sm:text-lg font-bold text-slate-950 font-display tracking-tight">
                        Shipping Address
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {addresses.map((addr) => {
                        const isSelected = selectedAddressId === addr.id;
                        return (
                          <div 
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={`border rounded-2xl p-5 relative cursor-pointer transition-all duration-200 flex flex-col justify-between min-h-[170px] select-none ${isSelected ? "border-slate-950 bg-[#fbfbfe] shadow-sm" : "border-slate-200 hover:border-slate-300 bg-white"}`}
                          >
                            {isSelected && (
                              <div className="absolute top-4 right-4 text-slate-950">
                                <CheckCircle2 className="w-5 h-5 fill-slate-950 text-white" />
                              </div>
                            )}
                            <div className="space-y-1">
                              <p className="font-bold text-slate-950 text-sm">{addr.name}</p>
                              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                {addr.address}
                                <br />
                                {addr.city}, {addr.state} {addr.zip}
                              </p>
                              <p className="text-xs text-slate-500 pt-1 flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-400" />
                                {addr.phone}
                              </p>
                            </div>
                            <div className="pt-4 mt-auto">
                              {isSelected ? (
                                <button className="w-full py-2 bg-slate-950 text-white font-bold text-[10px] sm:text-xs rounded-xl uppercase tracking-wider transition-colors pointer-events-none">
                                  DELIVER HERE
                                </button>
                              ) : (
                                <button className="w-full py-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 font-bold text-[10px] sm:text-xs rounded-xl uppercase tracking-wider transition-all">
                                  SELECT
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* ADD NEW ADDRESS CARD */}
                      <div 
                        onClick={() => setShowAddAddress(true)}
                        className="border border-dashed border-slate-300 hover:border-slate-400 rounded-2xl p-5 flex flex-col items-center justify-center min-h-[170px] bg-slate-50/20 hover:bg-slate-50/60 cursor-pointer transition-all group"
                      >
                        <div className="flex flex-col items-center gap-2.5 text-slate-500 group-hover:text-slate-800 transition-colors">
                          <div className="p-3 bg-white rounded-full border border-slate-200/60 shadow-sm group-hover:scale-105 transition-transform">
                            <Plus className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-xs uppercase tracking-wider">Add New Address</span>
                        </div>
                      </div>
                    </div>

                    {/* Checkbox */}
                    <label className="flex items-center gap-2.5 pt-1.5 select-none cursor-pointer text-xs font-semibold text-slate-600 max-w-fit">
                      <input 
                        type="checkbox" 
                        checked={saveAddress}
                        onChange={(e) => setSaveAddress(e.target.checked)}
                        className="w-4 h-4 rounded text-slate-900 border-slate-300 focus:ring-slate-900 cursor-pointer"
                      />
                      <span>Save this address for faster checkout</span>
                    </label>
                  </div>

                  {/* INLINE ADD ADDRESS FORM MODAL OVERLAY */}
                  <AnimatePresence>
                    {showAddAddress && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-xl border border-slate-100"
                        >
                          <div className="flex items-center justify-between pb-4 border-b border-slate-150">
                            <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-slate-500" />
                              Add New Shipping Address
                            </h3>
                            <button 
                              onClick={() => { setShowAddAddress(false); setAddressErrors({}); }}
                              className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-full transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <form onSubmit={handleAddAddress} className="space-y-4 pt-4">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                <User className="w-3 h-3 text-slate-400" /> Full Name
                              </label>
                              <input 
                                type="text"
                                value={addressForm.name}
                                onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                                placeholder="e.g. Alex Morgan"
                                className={`w-full px-3.5 py-2.5 bg-slate-50/50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white transition-all ${addressErrors.name ? "border-red-400" : "border-slate-200 focus:border-slate-400"}`}
                              />
                              {addressErrors.name && <p className="text-[10px] text-red-500 font-bold">{addressErrors.name}</p>}
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" /> Street Address
                              </label>
                              <input 
                                type="text"
                                value={addressForm.address}
                                onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                                placeholder="e.g. 123 Luxury Avenue"
                                className={`w-full px-3.5 py-2.5 bg-slate-50/50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white transition-all ${addressErrors.address ? "border-red-400" : "border-slate-200 focus:border-slate-400"}`}
                              />
                              {addressErrors.address && <p className="text-[10px] text-red-500 font-bold">{addressErrors.address}</p>}
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700">City</label>
                                <input 
                                  type="text"
                                  value={addressForm.city}
                                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                  placeholder="New York"
                                  className={`w-full px-3 py-2.5 bg-slate-50/50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white transition-all ${addressErrors.city ? "border-red-400" : "border-slate-200 focus:border-slate-400"}`}
                                />
                                {addressErrors.city && <p className="text-[10px] text-red-500 font-bold">{addressErrors.city}</p>}
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700">State</label>
                                <input 
                                  type="text"
                                  value={addressForm.state}
                                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                  placeholder="NY"
                                  className={`w-full px-3 py-2.5 bg-slate-50/50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white transition-all ${addressErrors.state ? "border-red-400" : "border-slate-200 focus:border-slate-400"}`}
                                />
                                {addressErrors.state && <p className="text-[10px] text-red-500 font-bold">{addressErrors.state}</p>}
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700">ZIP</label>
                                <input 
                                  type="text"
                                  value={addressForm.zip}
                                  onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                                  placeholder="10001"
                                  className={`w-full px-3 py-2.5 bg-slate-50/50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white transition-all ${addressErrors.zip ? "border-red-400" : "border-slate-200 focus:border-slate-400"}`}
                                />
                                {addressErrors.zip && <p className="text-[10px] text-red-500 font-bold">{addressErrors.zip}</p>}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-400" /> Phone Number
                              </label>
                              <input 
                                type="text"
                                value={addressForm.phone}
                                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                placeholder="(555) 000-0000"
                                className={`w-full px-3.5 py-2.5 bg-slate-50/50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white transition-all ${addressErrors.phone ? "border-red-400" : "border-slate-200 focus:border-slate-400"}`}
                              />
                              {addressErrors.phone && <p className="text-[10px] text-red-500 font-bold">{addressErrors.phone}</p>}
                            </div>

                            <div className="flex gap-3 pt-2">
                              <button 
                                type="button"
                                onClick={() => { setShowAddAddress(false); setAddressErrors({}); }}
                                className="flex-1 py-3 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                              >
                                Cancel
                              </button>
                              <button 
                                type="submit"
                                className="flex-1 py-3 bg-slate-950 text-white hover:bg-slate-900 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                              >
                                Save Address
                              </button>
                            </div>
                          </form>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>

                  {/* 2. SHIPPING METHOD SECTION */}
                  <div className="space-y-4">
                    <h2 className="text-base sm:text-lg font-bold text-slate-950 font-display tracking-tight border-b border-slate-200 pb-2">
                      Shipping Method
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Standard */}
                      <div 
                        onClick={() => setShippingMethod("standard")}
                        className={`border rounded-2xl p-5 cursor-pointer transition-all flex justify-between items-start select-none ${shippingMethod === "standard" ? "border-slate-950 bg-[#fbfbfe] shadow-xs" : "border-slate-200 hover:border-slate-300 bg-white"}`}
                      >
                        <div className="space-y-1">
                          <p className="font-bold text-slate-950 text-sm">Standard</p>
                          <p className="text-xs text-slate-500">Delivers in 3-5 business days</p>
                        </div>
                        <span className="font-bold text-slate-950 text-sm">$5.99</span>
                      </div>

                      {/* Express */}
                      <div 
                        onClick={() => setShippingMethod("express")}
                        className={`border rounded-2xl p-5 cursor-pointer transition-all flex justify-between items-start select-none ${shippingMethod === "express" ? "border-slate-950 bg-[#fbfbfe] shadow-xs" : "border-slate-200 hover:border-slate-300 bg-white"}`}
                      >
                        <div className="space-y-1">
                          <p className="font-bold text-slate-950 text-sm flex items-center gap-1">
                            <span>Express</span>
                            <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider">Fast</span>
                          </p>
                          <p className="text-xs text-slate-500">Next day delivery</p>
                        </div>
                        <span className="font-bold text-slate-950 text-sm">$15.00</span>
                      </div>
                    </div>
                  </div>

                  {/* 3. PAYMENT METHOD SECTION */}
                  <div className="space-y-4">
                    <h2 className="text-base sm:text-lg font-bold text-slate-950 font-display tracking-tight border-b border-slate-200 pb-2">
                      Payment Method
                    </h2>

                    {/* Three choice buttons side-by-side */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-slate-100 p-1.5 rounded-2xl select-none">
                      <button 
                        type="button"
                        onClick={() => setPaymentMethod("gpay")}
                        className={`py-3 text-[11px] sm:text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${paymentMethod === "gpay" ? "bg-white text-slate-950 shadow-sm border border-slate-200/50" : "text-slate-500 hover:text-slate-800"}`}
                      >
                        Google Pay
                      </button>
                      <button 
                        type="button"
                        onClick={() => setPaymentMethod("phonepe")}
                        className={`py-3 text-[11px] sm:text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${paymentMethod === "phonepe" ? "bg-white text-slate-950 shadow-sm border border-slate-200/50" : "text-slate-500 hover:text-slate-800"}`}
                      >
                        PhonePe
                      </button>
                      <button 
                        type="button"
                        onClick={() => setPaymentMethod("upi")}
                        className={`py-3 text-[11px] sm:text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${paymentMethod === "upi" ? "bg-white text-slate-950 shadow-sm border border-slate-200/50" : "text-slate-500 hover:text-slate-800"}`}
                      >
                        UPI ID
                      </button>
                    </div>

                    {/* Sub-container depending on selection */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-4 shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
                      {paymentMethod === "upi" && (
                        <div className="space-y-3.5">
                          <label className="block text-xs font-bold text-slate-700">Enter UPI ID</label>
                          <div className="flex gap-2 max-w-md">
                            <input 
                              type="text"
                              value={upiId}
                              onChange={(e) => {
                                setUpiId(e.target.value);
                                setIsUpiVerified(false);
                                setUpiError("");
                              }}
                              placeholder="e.g. user@upi"
                              className={`flex-1 min-w-0 px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white transition-all ${upiError ? "border-red-400" : "border-slate-200 focus:border-slate-400"}`}
                              id="upi-input"
                            />
                            <button 
                              type="button"
                              onClick={handleVerifyUpi}
                              disabled={isVerifyingUpi || isUpiVerified || !upiId.trim()}
                              className="px-5 py-2.5 bg-slate-950 text-white hover:bg-slate-900 disabled:bg-slate-100 disabled:text-slate-400 font-bold text-xs rounded-xl uppercase tracking-wider transition-all shrink-0 border border-transparent disabled:border-slate-200/60"
                            >
                              {isVerifyingUpi ? (
                                <span className="flex items-center gap-1"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Verifying</span>
                              ) : isUpiVerified ? (
                                "Verified ✓"
                              ) : (
                                "Verify"
                              )}
                            </button>
                          </div>
                          {upiError && <p className="text-[10px] text-red-500 font-bold">{upiError}</p>}
                          {isUpiVerified && !upiError && (
                            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> ID Verified successfully for Alex Morgan
                            </p>
                          )}
                          <p className="text-xs text-slate-400">
                            A payment request will be sent to your UPI app.
                          </p>
                        </div>
                      )}

                      {paymentMethod === "phonepe" && (
                        <div className="space-y-3.5">
                          <label className="block text-xs font-bold text-slate-700">PhonePe Number or UPI ID</label>
                          <div className="flex gap-2 max-w-md">
                            <input 
                              type="text"
                              placeholder="e.g. 9876543210@ybl"
                              className="flex-1 min-w-0 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-slate-400 transition-all"
                            />
                            <button 
                              type="button"
                              className="px-5 py-2.5 bg-slate-950 text-white hover:bg-slate-900 font-bold text-xs rounded-xl uppercase tracking-wider transition-all shrink-0"
                            >
                              Link
                            </button>
                          </div>
                          <p className="text-xs text-slate-400">
                            Receive secure instant prompt on your PhonePe device.
                          </p>
                        </div>
                      )}

                      {paymentMethod === "gpay" && (
                        <div className="flex flex-col items-center justify-center py-6 text-center space-y-3.5">
                          <div className="w-12 h-12 bg-[#4285f4]/10 rounded-full flex items-center justify-center text-[#4285f4] border border-[#4285f4]/20">
                            <CreditCard className="w-6 h-6" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-slate-900">Google Pay Preferred</p>
                            <p className="text-xs text-slate-500 max-w-xs leading-normal">
                              Authorize instantly using your default Google credentials.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Billing Same Checkbox */}
                      <label className="flex items-center gap-2.5 pt-2 select-none cursor-pointer text-xs font-semibold text-slate-600 max-w-fit">
                        <input 
                          type="checkbox" 
                          checked={billingSameAsShipping}
                          onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                          className="w-4 h-4 rounded text-slate-900 border-slate-300 focus:ring-slate-900 cursor-pointer"
                        />
                        <span>Billing address same as shipping</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* RIGHT BLOCK: Dynamic Order Summary card */}
                <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.015)] space-y-5">
                    <h3 className="text-base sm:text-lg font-bold text-slate-950 font-display tracking-tight border-b border-slate-100 pb-2">
                      Order Summary
                    </h3>

                    {/* Cart Items List */}
                    <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                      {cartItems.map((item) => (
                        <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} className="flex gap-3.5 items-center">
                          <div className="w-14 h-14 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center shrink-0">
                            <img 
                              src={item.product.image} 
                              alt={item.product.name} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">{item.product.name}</h4>
                            <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">
                              Color: {item.selectedColor || "Default"} / Size: {item.selectedSize || "One Size"}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[10px] sm:text-xs text-slate-500 font-medium">Qty:</span>
                              <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50/50 overflow-hidden h-6">
                                <button
                                  type="button"
                                  onClick={() => onUpdateQuantity(item.product.id, item.selectedColor, item.quantity - 1, item.selectedSize || undefined)}
                                  className="px-1.5 h-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center justify-center font-bold text-xs select-none"
                                >
                                  -
                                </button>
                                <input
                                  type="text"
                                  value={item.quantity}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (!isNaN(val)) {
                                      onUpdateQuantity(item.product.id, item.selectedColor, Math.max(0, val), item.selectedSize || undefined);
                                    }
                                  }}
                                  className="w-7 text-center text-xs font-bold text-slate-900 bg-transparent border-0 focus:ring-0 focus:outline-none p-0"
                                />
                                <button
                                  type="button"
                                  onClick={() => onUpdateQuantity(item.product.id, item.selectedColor, item.quantity + 1, item.selectedSize || undefined)}
                                  className="px-1.5 h-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center justify-center font-bold text-xs select-none"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                          <span className="font-bold text-slate-950 text-xs sm:text-sm whitespace-nowrap">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Promo Coupon Row */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value);
                            setCouponError("");
                          }}
                          placeholder="COUPON CODE"
                          className={`flex-1 px-4 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:bg-white transition-all uppercase font-semibold tracking-wider ${couponError ? "border-red-300" : "border-slate-200 focus:border-slate-350"}`}
                        />
                        <button 
                          type="button"
                          onClick={handleApplyCoupon}
                          className="px-5 py-2.5 bg-slate-950 text-white hover:bg-slate-900 font-bold text-xs rounded-xl uppercase tracking-wider transition-all shrink-0"
                        >
                          Apply
                        </button>
                      </div>
                      
                      {appliedCoupon && (
                        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100/60 px-3.5 py-1.5 rounded-xl text-xs text-emerald-800 font-bold">
                          <span className="flex items-center gap-1">
                            <Percent className="w-3.5 h-3.5 text-emerald-600" />
                            {appliedCoupon.code} applied
                          </span>
                          <button 
                            type="button"
                            onClick={handleRemoveCoupon}
                            className="text-emerald-700 hover:text-red-500 font-extrabold transition-colors pl-2"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                      {couponError && <p className="text-[10px] text-red-500 font-bold pl-1">{couponError}</p>}
                    </div>

                    {/* Loyalty Points Redeem Box */}
                    <div className="bg-[#f2f6ff] border border-[#d3ddf8] p-4.5 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs sm:text-sm">
                          <Coins className="w-4.5 h-4.5 text-[#305bd4] fill-[#cbd7fc]" />
                          <span>1,240 points available</span>
                        </div>
                        {/* Custom Switch */}
                        <button 
                          type="button"
                          onClick={() => setPointsActive(!pointsActive)}
                          className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${pointsActive ? "bg-[#305bd4]" : "bg-slate-300"}`}
                        >
                          <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${pointsActive ? "translate-x-4" : "translate-x-0"}`} />
                        </button>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-600 leading-normal">
                        Redeem 1,000 points to save $10.00
                      </p>
                      
                      {pointsActive && (
                        <div className="space-y-3.5 pt-1">
                          <input 
                            type="range"
                            min="0"
                            max="1200"
                            step="100"
                            value={pointsRedeemed}
                            onChange={(e) => setPointsRedeemed(Number(e.target.value))}
                            className="w-full h-1.5 bg-slate-200/80 rounded-lg appearance-none cursor-pointer accent-[#305bd4]"
                          />
                          <div className="flex justify-between items-center font-bold text-[10px] tracking-wider text-slate-700">
                            <span>REDEEMING {pointsRedeemed.toLocaleString()} PTS</span>
                            <span className="text-[#305bd4]">-${(pointsRedeemed / 100).toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Breakdown details */}
                    <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs sm:text-sm font-medium text-slate-600">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
                      </div>
                      {appliedCoupon && (
                        <div className="flex justify-between text-emerald-600 font-semibold">
                          <span>Coupon ({appliedCoupon.code})</span>
                          <span>-${couponDiscount.toFixed(2)}</span>
                        </div>
                      )}
                      {pointsActive && (
                        <div className="flex justify-between text-emerald-600 font-semibold">
                          <span>Points Applied</span>
                          <span>-${pointsDiscount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="font-bold text-slate-900">${shippingCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span className="font-bold text-slate-900">${tax.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-slate-950 font-display font-black text-lg sm:text-xl border-t border-slate-100 pt-4 mt-2">
                        <span>Total</span>
                        <span className="text-xl sm:text-2xl">${grandTotal.toFixed(2)}</span>
                      </div>

                      {/* Loyalty dynamic points tag */}
                      <div className="text-center text-[10px] font-bold text-[#2d58d3] bg-[#edf2ff] px-3.5 py-2.5 rounded-xl tracking-wider select-none font-sans uppercase mt-4">
                        YOU'LL EARN {Math.round(grandTotal)} POINTS ON THIS ORDER
                      </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button 
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="w-full bg-slate-950 hover:bg-slate-900 active:scale-[0.99] text-white font-bold py-4 rounded-2xl text-xs sm:text-sm transition-all shadow-[0_4px_20px_rgba(0,0,0,0.06)] uppercase tracking-wider flex items-center justify-center gap-2"
                      id="place-order-btn"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                          <span>Processing Securing...</span>
                        </>
                      ) : (
                        <span>PLACE ORDER</span>
                      )}
                    </button>

                    {/* Guarantee tags inside summary card */}
                    <div className="flex justify-center items-center gap-4 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none pt-1">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Secure SSL
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" /> 30-Day Guarantee
                      </span>
                    </div>

                  </div>
                </div>

              </div>
            ) : (
              /* SUCCESS SCREEN */
              <div className="text-center py-16 max-w-lg mx-auto flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.15 }}
                  className="p-4 bg-emerald-50 text-emerald-500 rounded-full mb-6 border border-emerald-100 shadow-sm"
                >
                  <CheckCircle2 className="w-14 h-14" />
                </motion.div>

                <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-950 tracking-tight mb-2">
                  Purchase Completed!
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-8">
                  Thank you for shopping at Luxe Market. Your premium order is being meticulously packaged and will be shipped with high-priority tracking shortly.
                </p>

                {/* Receipt Card */}
                <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-6 mb-8 text-left space-y-4 text-xs sm:text-sm text-slate-700 shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
                  <div className="flex justify-between items-center border-b border-slate-150 pb-3">
                    <span className="font-bold text-slate-950">Order Reference</span>
                    <span className="font-mono font-black text-slate-900" id="success-order-id">{orderReference}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-slate-500">Delivery Contact</span>
                    <span className="font-bold text-slate-900 text-right">
                      {activeAddress.name}
                      <br />
                      <span className="text-xs font-medium text-slate-500">{activeAddress.phone}</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Destination</span>
                    <span className="font-bold text-slate-900 text-right">
                      {activeAddress.address}, {activeAddress.city}, {activeAddress.state} {activeAddress.zip}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-3">
                    <span className="text-slate-500">Grand Total</span>
                    <span className="font-bold text-slate-950 text-base">${grandTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Loyalty Points Earned</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100" />
                      +{pointsAwarded} Points
                    </span>
                  </div>
                  <div className="flex items-center justify-center pt-3 border-t border-slate-100 text-[10px] sm:text-xs text-slate-400 italic font-medium gap-1 select-none">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Estimated Arrival: 3-5 Business Days (Tracked via EMS)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setStep(1); // reset step back for next checkouts
                  }}
                  className="w-full bg-slate-950 hover:bg-slate-900 text-white font-bold py-4 rounded-xl text-xs sm:text-sm transition-colors uppercase tracking-wider"
                  id="success-continue-btn"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>

          {/* PAGE FOOTER */}
          <div className="w-full bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-xs mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <span className="font-medium text-center sm:text-left select-none">
                © {new Date().getFullYear()} LUXE MARKET. Secure Checkout. All rights reserved.
              </span>
              <div className="flex gap-4 font-bold select-none text-slate-400 hover:text-slate-300 transition-colors">
                <span className="cursor-pointer hover:underline">Privacy Policy</span>
                <span className="cursor-pointer hover:underline">Terms of Service</span>
                <span className="cursor-pointer hover:underline">Help Center</span>
              </div>
            </div>
          </div>

          {/* FULL SCREEN LOADING TRANSITION OVERLAY */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center text-white"
                id="processing-overlay"
              >
                <div className="flex flex-col items-center gap-4 p-8 max-w-sm text-center">
                  <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-[#4e7eff] animate-spin" />
                  <p className="text-sm font-black uppercase tracking-widest text-slate-300">SECURE TRANSACTION</p>
                  <p className="text-xs text-slate-400 mt-2 font-medium min-h-[20px]">
                    {processingStatus}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
