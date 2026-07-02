import React, { useState, useRef, useEffect } from "react";
import { Mail, ShieldCheck, User, Lock, ArrowRight, ArrowLeft, Check, Sparkles, AlertCircle, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile } from "../types";

interface SignUpPageProps {
  onBackToCatalog: () => void;
  onAuthSuccess: (profile: UserProfile) => void;
  onNavigateToSignIn: () => void;
}

interface RegisteredUser {
  username: string;
  email: string;
  passwordHash: string;
  points: number;
}

export default function SignUpPage({
  onBackToCatalog,
  onAuthSuccess,
  onNavigateToSignIn
}: SignUpPageProps) {
  // Sign Up Phases:
  // 1: Enter email
  // 2: Verify OTP
  // 3: Username, Password & Confirm Password
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  
  // Phase 3 States
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  // States
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  // Helper: Save a new registered user
  const registerNewUser = (user: RegisteredUser) => {
    const current = getRegisteredUsers();
    current.push(user);
    localStorage.setItem("luxe_registered_users", JSON.stringify(current));
  };

  // Phase 1 Action: Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    const users = getRegisteredUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      setError("This email is already registered. Please sign in instead.");
      return;
    }

    setIsSendingOtp(true);

    setTimeout(() => {
      // Generate unique 6 digit OTP
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setIsSendingOtp(false);
      setPhase(2);
      setOtpDigits(Array(6).fill(""));
    }, 1100);
  };

  // OTP inputs autofocus logic
  const handleOtpChange = (index: number, val: string) => {
    const cleanVal = val.replace(/[^0-9]/g, "").slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);
    setError("");

    if (cleanVal && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Phase 2 Action: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const enteredCode = otpDigits.join("");
    if (enteredCode.length < 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    if (enteredCode !== generatedOtp) {
      setError("Incorrect verification code. Please check and enter the code shown in the simulation box.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setPhase(3);
    }, 800);
  };

  // Phase 3 Action: Finish Signup
  const handleCompleteSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanUsername = username.trim();
    if (cleanUsername.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    const users = getRegisteredUsers();
    if (users.some(u => u.username.toLowerCase() === cleanUsername.toLowerCase())) {
      setError("This username is already taken. Please choose another one.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const newUser: RegisteredUser = {
        username: cleanUsername,
        email: email,
        passwordHash: password,
        points: 500 // Bonus points on registration
      };

      registerNewUser(newUser);

      const profile: UserProfile = {
        name: cleanUsername,
        email: email,
        tier: "Bronze",
        points: 500,
        orderHistory: []
      };

      // Set keep logged in as true by default on registration
      localStorage.setItem("luxe_keep_logged_in", "true");
      localStorage.setItem("luxe_profile", JSON.stringify(profile));

      setIsLoading(false);
      setShowCelebration(true);

      setTimeout(() => {
        onAuthSuccess(profile);
      }, 1600);
    }, 1200);
  };

  return (
    <div className="min-h-screen h-screen w-full flex flex-col items-center justify-center bg-[#fafafa] p-4 md:p-6 overflow-y-auto" id="signup-page-view">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={onBackToCatalog}
          className="group flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-black mb-6 transition-colors"
          id="signup-back-to-catalog"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Catalog</span>
        </button>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border-t-2 border-t-slate-900">
        <AnimatePresence mode="wait">
          {showCelebration ? (
            <motion.div
              key="celebration"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-4"
              id="signup-celebration"
            >
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-display font-bold text-xl text-slate-900 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
                  Welcome to LUXE!
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Your email has been verified. We have credited <strong>500 Welcome Points</strong> to your account! Loading your dashboard...
                </p>
              </div>
              <div className="text-xs font-mono text-slate-400 animate-pulse pt-2">
                Connecting session...
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <span className="font-display font-black text-xl tracking-widest text-slate-900 block">
                  LUXE <span className="font-light text-gray-400">MARKET</span>
                </span>
                <h2 className="font-display font-bold text-2xl text-slate-950 mt-4">
                  Create Member Account
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Enjoy custom rewards, VIP tiers, and instant points
                </p>
              </div>

              {/* Stepper Progress Bar */}
              <div className="flex items-center justify-center gap-2 py-1">
                <div className={`h-1.5 rounded-full transition-all duration-300 ${phase === 1 ? "w-8 bg-slate-900" : "w-1.5 bg-slate-200"}`} />
                <div className={`h-1.5 rounded-full transition-all duration-300 ${phase === 2 ? "w-8 bg-slate-900" : "w-1.5 bg-slate-200"}`} />
                <div className={`h-1.5 rounded-full transition-all duration-300 ${phase === 3 ? "w-8 bg-slate-900" : "w-1.5 bg-slate-200"}`} />
              </div>

              {error && (
                <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 text-rose-800 rounded-xl text-xs border border-rose-100 font-medium" id="signup-error-block">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* PHASE 1: EMAIL REQUEST */}
              {phase === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-4" id="phase-1-form">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-50/50 border border-gray-200/80 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all duration-200"
                        id="signup-email-field"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md disabled:bg-slate-300 disabled:pointer-events-none"
                    id="signup-send-otp"
                  >
                    {isSendingOtp ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Get Verification OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* PHASE 2: VERIFY OTP */}
              {phase === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-5" id="phase-2-form">
                  {/* Simulated mailbox notification */}
                  <div className="p-3.5 bg-amber-50/70 border border-amber-100 rounded-2xl text-xs space-y-1 shadow-[0_2px_8px_rgba(245,158,11,0.04)]">
                    <div className="font-bold flex items-center gap-1.5 text-amber-800">
                      <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Security Mail Simulator</span>
                    </div>
                    <p className="text-amber-700 font-medium">
                      An OTP has been dispatched to <span className="font-mono">{email}</span>.
                    </p>
                    <p className="text-[11px] text-amber-600 mt-1">
                      OTP Code: <strong className="text-xs font-mono tracking-widest bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200" id="otp-code-indicator">{generatedOtp}</strong>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block text-center">
                      Enter Verification Code
                    </label>
                    <div className="flex justify-center gap-2">
                      {otpDigits.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (otpRefs.current[index] = el)}
                          type="text"
                          pattern="[0-9]*"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-10 h-11 text-center text-lg font-bold font-mono bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all shadow-sm"
                          id={`otp-digit-${index}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPhase(1)}
                      className="flex-1 py-2.5 px-3 border border-gray-200 text-slate-700 hover:bg-gray-50 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Change Email</span>
                    </button>
                    
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-[2] bg-slate-900 text-white py-2.5 rounded-xl font-bold text-xs hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-md disabled:bg-slate-300"
                    >
                      {isLoading ? (
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Verify & Proceed</span>
                          <Check className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* PHASE 3: CHOOSE USERNAME & PASSWORD */}
              {phase === 3 && (
                <form onSubmit={handleCompleteSignUp} className="space-y-4" id="phase-3-form">
                  {/* Username */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Choose Username
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        placeholder="e.g. Achusuchu"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-50/50 border border-gray-200/80 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all duration-200"
                        id="signup-username-field"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Choose Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type={showPass ? "text" : "password"}
                        placeholder="Minimum 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-slate-50/50 border border-gray-200/80 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all duration-200"
                        id="signup-password-field"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-black"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type={showPass ? "text" : "password"}
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-50/50 border border-gray-200/80 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all duration-200"
                        id="signup-confirm-field"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md disabled:bg-slate-300"
                    id="signup-submit-complete"
                  >
                    {isLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Finish & Claim 500 Pts</span>
                        <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="border-t border-gray-100 mt-6 pt-6 text-center text-xs text-gray-500">
                <span>Already have an account? </span>
                <button
                  onClick={onNavigateToSignIn}
                  className="font-bold text-slate-950 hover:underline inline-flex items-center gap-0.5"
                  id="signup-go-to-signin"
                >
                  Sign In
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </div>
);
}
