import { X, User, Shield, Sparkles, Box, CheckCircle, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile } from "../types";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSignOut: () => void;
}

export default function ProfileDrawer({ isOpen, onClose, userProfile, onSignOut }: ProfileDrawerProps) {
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
            id="profile-backdrop"
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col justify-between"
            id="profile-drawer-container"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <User className="w-5 h-5 text-slate-800" />
                <h2 className="font-display font-bold text-lg text-slate-900">Your Membership</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-black rounded-full transition-colors"
                aria-label="Close"
                id="close-profile-drawer-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Core Data Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Profile Card Summary */}
              <div className="flex items-center gap-4 p-4 bg-slate-900 text-white rounded-2xl relative overflow-hidden shadow-md">
                <div className="absolute right-0 bottom-0 translate-y-1/4 translate-x-1/4 opacity-10">
                  <User className="w-48 h-48" />
                </div>
                
                {/* Avatar */}
                <div className="w-14 h-14 bg-amber-400 rounded-full flex items-center justify-center font-display font-bold text-xl text-slate-900 border-2 border-white/20 uppercase">
                  {userProfile.name.slice(0, 2)}
                </div>

                <div>
                  <h3 className="font-display font-bold text-base tracking-wide" id="profile-user-name">
                    {userProfile.name}
                  </h3>
                  <p className="text-xs text-slate-300" id="profile-user-email">
                    {userProfile.email}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full uppercase tracking-wider w-fit">
                    <Shield className="w-3 h-3 fill-current" />
                    <span>{userProfile.tier} Member</span>
                  </div>
                </div>
              </div>

              {/* Points Box */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-emerald-800 font-semibold uppercase tracking-wider mb-0.5 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    Loyalty Points
                  </div>
                  <div className="text-2xl font-bold text-emerald-950" id="profile-user-points">
                    {userProfile.points} <span className="text-xs font-normal text-emerald-700">Pts Available</span>
                  </div>
                </div>
                <div className="text-right text-[10px] text-emerald-700 font-medium max-w-[150px]">
                  Redeemable at checkout. Earn points on every purchase!
                </div>
              </div>

              {/* Order History */}
              <div className="space-y-3">
                <h4 className="font-display font-semibold text-sm text-slate-900 flex items-center gap-1.5 border-b border-gray-100 pb-2">
                  <Box className="w-4.5 h-4.5 text-slate-500" />
                  <span>Order History</span>
                </h4>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {userProfile.orderHistory.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 italic text-xs">
                      No orders placed yet.
                    </div>
                  ) : (
                    userProfile.orderHistory.map((order) => (
                      <div
                        key={order.id}
                        className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-2 text-xs text-slate-700"
                        id={`order-history-item-${order.id}`}
                      >
                        <div className="flex justify-between items-center font-mono">
                          <span className="font-semibold text-slate-900 truncate pr-2">{order.id}</span>
                          <span className="text-gray-400">{order.date}</span>
                        </div>
                        
                        {/* Ordered products thumbnails */}
                        <div className="flex gap-2.5 items-center overflow-x-auto py-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-gray-100 shrink-0">
                              <img src={item.image} alt={item.productName} className="w-6 h-6 object-cover rounded" />
                              <span className="text-[10px] font-semibold text-slate-900">x{item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-2.5 border-t border-gray-200/50 text-[10px]">
                          <span className="font-semibold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">
                            <CheckCircle className="w-3 h-3" />
                            {order.status}
                          </span>
                          <span className="font-bold text-slate-900 font-sans text-xs">Total: ${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Action and Disclaimer */}
            <div className="border-t border-gray-100 bg-gray-50/50">
              <div className="p-4 border-b border-gray-100 flex justify-center">
                <button
                  onClick={() => {
                    onSignOut();
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-700 hover:text-rose-800 font-semibold text-xs rounded-xl transition-all active:scale-[0.98]"
                  id="profile-signout-btn"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out Account</span>
                </button>
              </div>
              <div className="p-4 text-center text-xs text-gray-400">
                Gold tier members enjoy free Priority shipping and 20% point bonus multipliers.
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
