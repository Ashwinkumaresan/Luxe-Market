import { X, User, Shield, Sparkles, LogOut, Truck, History, Ticket, MapPin, Settings, ChevronRight, ShoppingBag } from "lucide-react";
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
            <div className="flex-1 overflow-y-auto scrollbar-none p-6 space-y-6">
              {/* Profile Card Summary */}
              <div className="flex items-center gap-4 p-4 bg-slate-900 text-white rounded-2xl relative overflow-hidden shadow-md">
                <div className="absolute right-0 bottom-0 translate-y-1/4 translate-x-1/4 opacity-10">
                  <User className="w-48 h-48" />
                </div>
                
                {/* Avatar */}
                <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center font-display font-bold text-lg text-slate-900 border-2 border-white/20 uppercase">
                  {userProfile.name.slice(0, 2)}
                </div>

                <div>
                  <h3 className="font-display font-bold text-sm tracking-wide" id="profile-user-name">
                    {userProfile.name}
                  </h3>
                  <p className="text-xs text-slate-300 font-sans" id="profile-user-email">
                    {userProfile.email}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-[9px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full uppercase tracking-wider w-fit">
                    <Shield className="w-2.5 h-2.5 fill-current" />
                    <span>{userProfile.tier} Member</span>
                  </div>
                </div>
              </div>

              {/* Orders Section */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2 px-1">
                  <ShoppingBag className="w-4 h-4 text-slate-400" />
                  Orders
                </h3>
                <div className="space-y-1">
                  <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all text-left group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-50 rounded-lg text-amber-600 group-hover:bg-amber-100 transition-colors">
                        <Truck className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">Track Orders</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-slate-900 transition-transform group-hover:translate-x-0.5" />
                  </button>

                  <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all text-left group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg text-slate-600 group-hover:bg-slate-100 transition-colors">
                        <History className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">Order History</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-slate-900 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>

              {/* Account Settings Section */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2 px-1">
                  <Settings className="w-4 h-4 text-slate-400" />
                  Account Settings
                </h3>
                <div className="space-y-1">
                  <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all text-left group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg text-slate-600 group-hover:bg-slate-100 transition-colors">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">Edit Profile</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-slate-900 transition-transform group-hover:translate-x-0.5" />
                  </button>

                  <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all text-left group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                        <Ticket className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">Coupons & Points</span>
                        <span className="text-[10px] text-emerald-600 font-medium">{userProfile.points} points active</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-slate-900 transition-transform group-hover:translate-x-0.5" />
                  </button>

                  <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all text-left group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg text-slate-600 group-hover:bg-slate-100 transition-colors">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">Saved Address</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-slate-900 transition-transform group-hover:translate-x-0.5" />
                  </button>

                  <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all text-left group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg text-slate-600 group-hover:bg-slate-100 transition-colors">
                        <Settings className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">Settings</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-slate-900 transition-transform group-hover:translate-x-0.5" />
                  </button>

                  <button 
                    onClick={() => {
                      onSignOut();
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-rose-50/50 border border-transparent hover:border-rose-100/50 transition-all text-left group"
                    id="profile-signout-btn"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-rose-50 rounded-lg text-rose-600 group-hover:bg-rose-100 transition-colors">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-rose-600 group-hover:text-rose-700">Logout</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-rose-600 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <div className="border-t border-gray-100 bg-gray-50/50 p-4 text-center text-xs text-gray-400">
              Gold tier members enjoy free Priority shipping and 20% point bonus multipliers.
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
