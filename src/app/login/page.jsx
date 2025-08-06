"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertCircle, X, Loader2, ArrowLeft, User, Mail, Lock, Eye, EyeOff, Sparkles, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "@/utils/supabase/client";
import Image from "next/image";

// Animation components
const FadeInUp = ({ children, delay = 0, duration = 0.5 }) => (
  <motion.div
    initial={{ y: 30, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const ScaleIn = ({ children, delay = 0, duration = 0.5 }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setNotification({
          type: "success",
          message: "✅ Kirish muvaffaqiyatli!",
        });
        setFormData({ email: "", password: "" });
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setNotification({
          type: "error",
          message: data.error || "❌ Login xatoligi",
        });
      }
    } catch {
      setNotification({
        type: "error",
        message: "⚠️ Tizim xatosi",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    
    // Google OAuth URL yaratish
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.append('client_id', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
    googleAuthUrl.searchParams.append('redirect_uri', `${window.location.origin}/auth/google/callback`);
    googleAuthUrl.searchParams.append('response_type', 'code');
    googleAuthUrl.searchParams.append('scope', 'email profile');
    googleAuthUrl.searchParams.append('access_type', 'offline');
    googleAuthUrl.searchParams.append('prompt', 'consent');
    
    // Google OAuth sahifasiga yo'naltirish
    window.location.href = googleAuthUrl.toString();
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  /* ----------------------- Step animation ------------------------ */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className='min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden px-4'>
      {/* Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            key={notification.type + notification.message}
            initial={{ y: -50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -50, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className='fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-fit max-w-md px-6 py-4 flex items-center gap-4 rounded-2xl shadow-2xl border border-white/30 backdrop-blur-xl bg-white/90'>
            <div
              className={`p-2.5 rounded-xl ${
                notification.type === "success"
                  ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-600"
                  : "bg-gradient-to-r from-red-100 to-pink-100 text-red-600"
              }`}>
              {notification.type === "success" ? (
                <CheckCircle size={22} />
              ) : (
                <AlertCircle size={22} />
              )}
            </div>
            <div className="flex-1">
              <p className='text-sm text-gray-800 font-semibold'>
                {notification.type === "success" ? "Success!" : "Error!"}
              </p>
              <p className='text-sm text-gray-600 mt-0.5'>
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className='text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100'>
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <ScaleIn delay={0.2}>
                  <div className='relative z-10 bg-white w-full lg:min-w-[1000px] max-w-[1600px] rounded-3xl shadow-2xl overflow-hidden'>
                      <div className="flex flex-col lg:flex-row min-h-[700px]">
            {/* Left Panel - Gradient Background with Onboarding */}
            <div className="hidden lg:flex w-3/5 bg-gradient-to-b from-[#10B981] to-[#34D399] p-12 flex-col justify-between relative overflow-hidden">
              {/* Background decorations */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-2xl"></div>
                <div className="absolute bottom-10 left-10 w-24 h-24 bg-white rounded-full blur-xl"></div>
              </div>

              {/* Branding */}
              <div className="relative z-10">
                <a href="/" className="flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity duration-300">
                  <div className="w-18 h-10 relative">
                    <Image
                      src="/logo-fraijob.svg"
                      alt="FraiJob logo"
                      fill
                      className="object-contain brightness-0 invert"
                    />
                  </div>
                </a>

                {/* Call to Action */}
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/30">
                    <Shield size={16} className="text-yellow-300" />
                    <span>Welcome Back</span>
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-4">
                    Sign in to your account
                  </h1>
                  <p className="text-white/90 text-lg">
                    Access your dashboard and continue your journey.
                  </p>
                </div>
              </div>

              {/* Onboarding Steps */}
              <div className="relative z-10 space-y-3">
                <motion.div
                  className={`backdrop-blur-sm rounded-2xl p-4 border transition-all duration-500 ${
                    currentStep === 0 
                      ? 'bg-white/20 border-white/30' 
                      : 'bg-white/10 border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all duration-500 ${
                        currentStep === 0 ? 'bg-[#10B981]' : 'bg-white/30'
                      }`}
                    >
                      1
                    </motion.div>
                    <div>
                      <motion.h3 
                        className={`font-semibold mb-1 transition-all duration-500 ${
                          currentStep === 0 ? 'text-white' : 'text-white/90'
                        }`}
                      >
                        Secure login
                      </motion.h3>
                      <motion.p 
                        className={`text-sm transition-all duration-500 ${
                          currentStep === 0 ? 'text-white/80' : 'text-white/70'
                        }`}
                      >
                        Enter your credentials to access your account
                      </motion.p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className={`backdrop-blur-sm rounded-2xl p-4 border transition-all duration-500 ${
                    currentStep === 1 
                      ? 'bg-white/20 border-white/30' 
                      : 'bg-white/10 border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all duration-500 ${
                        currentStep === 1 ? 'bg-[#10B981]' : 'bg-white/30'
                      }`}
                    >
                      2
                    </motion.div>
                    <div>
                      <motion.h3 
                        className={`font-semibold mb-1 transition-all duration-500 ${
                          currentStep === 1 ? 'text-white' : 'text-white/90'
                        }`}
                      >
                        Access dashboard
                      </motion.h3>
                      <motion.p 
                        className={`text-sm transition-all duration-500 ${
                          currentStep === 1 ? 'text-white/80' : 'text-white/70'
                        }`}
                      >
                        View your profile and manage your settings
                      </motion.p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className={`backdrop-blur-sm rounded-2xl p-4 border transition-all duration-500 ${
                    currentStep === 2 
                      ? 'bg-white/20 border-white/30' 
                      : 'bg-white/10 border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all duration-500 ${
                        currentStep === 2 ? 'bg-[#10B981]' : 'bg-white/30'
                      }`}
                    >
                      3
                    </motion.div>
                    <div>
                      <motion.h3 
                        className={`font-semibold mb-1 transition-all duration-500 ${
                          currentStep === 2 ? 'text-white' : 'text-white/90'
                        }`}
                      >
                        Start working
                      </motion.h3>
                      <motion.p 
                        className={`text-sm transition-all duration-500 ${
                          currentStep === 2 ? 'text-white/80' : 'text-white/70'
                        }`}
                      >
                        Find jobs and connect with opportunities
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-3/5 bg-white p-12 flex flex-col justify-center">
              <div className="w-full">
                <FadeInUp delay={0.3}>
                  <h2 className="text-4xl font-bold text-gray-900 mb-8">
                    Welcome Back
                  </h2>
                </FadeInUp>

                <form onSubmit={handleSubmit} className='space-y-6'>
                  <FadeInUp delay={0.4}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <Mail size={18} />
                        </div>
                        <input
                          name='email'
                          type='email'
                          value={formData.email}
                          onChange={handleChange}
                          placeholder='Enter your email address'
                          required
                          className='w-full border border-gray-300 px-12 py-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all duration-300'
                        />
                      </div>
                    </div>
                  </FadeInUp>

                  <FadeInUp delay={0.5}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <Lock size={18} />
                        </div>
                        <input
                          name='password'
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={handleChange}
                          placeholder='Enter your password'
                          required
                          className='w-full border border-gray-300 px-12 py-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all duration-300'
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </FadeInUp>

                  <FadeInUp delay={0.6}>
                    <button
                      type='submit'
                      disabled={isLoading}
                      className='w-full bg-[#10B981] text-white py-4 rounded-xl font-semibold hover:bg-[#0ea672] transition-all duration-300 flex items-center justify-center gap-3'>
                      {isLoading ? (
                        <>
                          <Loader2 className='animate-spin w-5 h-5' />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <span>Sign In</span>
                      )}
                    </button>
                  </FadeInUp>

                  <FadeInUp delay={0.7}>
                    <p className='text-center text-sm text-gray-600'>
                      Don't have an account?{" "}
                      <a
                        href='/signup'
                        className='text-[#10B981] font-medium hover:underline transition-colors duration-300'>
                        Sign up
                      </a>
                    </p>
                  </FadeInUp>

                  <FadeInUp delay={0.8}>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or</span>
                      </div>
                    </div>
                  </FadeInUp>

                  <FadeInUp delay={0.9}>
                    <button
                      type='button'
                      onClick={handleGoogleLogin}
                      disabled={isGoogleLoading}
                      className='w-full border border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-3'>
                      {isGoogleLoading ? (
                        <>
                          <Loader2 className='animate-spin w-5 h-5' />
                          <span>Signing in with Google...</span>
                        </>
                      ) : (
                        <>
                          <FcGoogle className='w-5 h-5' />
                          <span>Sign in with Google</span>
                        </>
                      )}
                    </button>
                  </FadeInUp>
                </form>
              </div>
            </div>
          </div>
        </div>
      </ScaleIn>
    </main>
  );
}
