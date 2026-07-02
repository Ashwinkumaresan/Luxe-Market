import React, { useState } from "react";
import { User, Lock, ArrowRight, Sparkles, AlertCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { UserProfile } from "../types";

interface SignInPageProps {
  onBackToCatalog: () => void;
  onAuthSuccess: (profile: UserProfile) => void;
  onNavigateToSignUp: () => void;
}

interface RegisteredUser {
  username: string;
  email: string;
  passwordHash: string;
  points: number;
}

export default function SignInPage({
  onBackToCatalog,
  onAuthSuccess,
  onNavigateToSignUp
}: SignInPageProps) {
  const [identifier, setIdentifier] = useState(""); // email or username
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Helper: Retrieve registered users
  const getRegisteredUsers = (): RegisteredUser[] => {
    const saved = localStorage.getItem("luxe_registered_users");
    let usersList: RegisteredUser[] = [];
    if (!saved) {
      usersList = [
        {
          username: "Achusuchu",
          email: "achusuchu123@gmail.com",
          passwordHash: "pass",
          points: 1250
        }
      ];
      localStorage.setItem("luxe_registered_users", JSON.stringify(usersList));
    } else {
      try {
        usersList = JSON.parse(saved);
        const achu = usersList.find(u => u.email.toLowerCase() === "achusuchu123@gmail.com");
        if (achu && achu.passwordHash !== "pass") {
          achu.passwordHash = "pass";
          localStorage.setItem("luxe_registered_users", JSON.stringify(usersList));
        } else if (!achu) {
          usersList.push({
            username: "Achusuchu",
            email: "achusuchu123@gmail.com",
            passwordHash: "pass",
            points: 1250
          });
          localStorage.setItem("luxe_registered_users", JSON.stringify(usersList));
        }
      } catch (e) {
        usersList = [
          {
            username: "Achusuchu",
            email: "achusuchu123@gmail.com",
            passwordHash: "pass",
            points: 1250
          }
        ];
        localStorage.setItem("luxe_registered_users", JSON.stringify(usersList));
      }
    }
    return usersList;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanIdentifier = identifier.trim().toLowerCase();
    const cleanPassword = password;

    if (!cleanIdentifier || !cleanPassword) {
      setError("Please enter your email/username and password.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const users = getRegisteredUsers();
      const matchedUser = users.find(
        u => u.email.toLowerCase() === cleanIdentifier || u.username.toLowerCase() === cleanIdentifier
      );

      if (!matchedUser || matchedUser.passwordHash !== cleanPassword) {
        setIsLoading(false);
        setError("Invalid email/username or password. Please try again.");
        return;
      }

      // Create profile object
      const profile: UserProfile = {
        name: matchedUser.username,
        email: matchedUser.email,
        tier: matchedUser.points >= 2000 ? "Platinum" : matchedUser.points >= 1200 ? "Gold" : matchedUser.points >= 500 ? "Silver" : "Bronze",
        points: matchedUser.points,
        orderHistory: []
      };

      // Retrieve previous order history if stored
      const savedOrders = localStorage.getItem(`orders_${matchedUser.username}`);
      if (savedOrders) {
        profile.orderHistory = JSON.parse(savedOrders);
      }

      // Handle session persistence preference
      if (keepLoggedIn) {
        localStorage.setItem("luxe_keep_logged_in", "true");
        localStorage.setItem("luxe_profile", JSON.stringify(profile));
      } else {
        localStorage.setItem("luxe_keep_logged_in", "false");
        // We will store it for active session, but not auto-load it on fresh reload if they opted out
        localStorage.setItem("luxe_profile", JSON.stringify(profile));
      }

      setIsLoading(false);
      onAuthSuccess(profile);
    }, 1200);
  };

  return (
    <div className="min-h-screen h-screen w-full flex flex-col items-center justify-center bg-[#fafafa] p-4 md:p-6 overflow-y-auto" id="signin-page-view">
      <div className="max-w-md w-full">
        {/* Back to Catalog Button */}
        <button
          onClick={onBackToCatalog}
          className="group flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-black mb-6 transition-colors"
          id="signin-back-to-catalog"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Catalog</span>
        </button>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border-t-2 border-t-slate-900">
          <div className="text-center mb-6">
            <span className="font-display font-black text-xl tracking-widest text-slate-900 block">
              LUXE <span className="font-light text-gray-400">MARKET</span>
            </span>
            <h2 className="font-display font-bold text-2xl text-slate-950 mt-4">
              Sign In Account
            </h2>
            <p className="text-xs text-gray-400 mt-1.5 max-w-[280px] mx-auto leading-relaxed">
              Welcome back to the members showcase. Access your personalized benefits and rewards.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 text-rose-800 rounded-xl text-xs border border-rose-100 font-medium mb-5 animate-shake" id="signin-error-block">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email or Username input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Email or Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Enter email or username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-50/50 border border-gray-200/80 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all duration-200"
                id="signin-identifier"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert("Simulated: Please register a new account if you forgot your credentials.")}
                className="text-[10px] font-semibold text-slate-400 hover:text-black transition-colors"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-slate-50/50 border border-gray-200/80 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all duration-200"
                id="signin-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-black"
                id="signin-password-toggle"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Keep me logged in checkbox */}
          <div className="flex items-center gap-2.5 py-1">
            <input
              type="checkbox"
              id="keep-logged-in-checkbox"
              checked={keepLoggedIn}
              onChange={(e) => setKeepLoggedIn(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-slate-900 focus:ring-slate-950 accent-slate-950 cursor-pointer"
            />
            <label htmlFor="keep-logged-in-checkbox" className="text-xs font-semibold text-slate-600 select-none cursor-pointer">
              Keep me logged in
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md disabled:bg-slate-300 disabled:pointer-events-none"
            id="signin-submit-btn"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In Securely</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="border-t border-gray-100 mt-8 pt-6 text-center text-xs text-gray-500">
          <span>New to Luxe Market? </span>
          <button
            onClick={onNavigateToSignUp}
            className="font-bold text-slate-950 hover:underline inline-flex items-center gap-0.5"
            id="signin-go-to-signup"
          >
            Create an Account
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  </div>
);
}
