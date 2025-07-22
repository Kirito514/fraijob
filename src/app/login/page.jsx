"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertCircle, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { auth, provider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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

      if (res.status === 200) {
        setNotification({
          type: "success",
          message: "✅ Kirish muvaffaqiyatli!",
        });
        setFormData({ email: "", password: "" });

        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      } else {
        setNotification({
          type: "error",
          message: data.error || "❌ Login xatoligi",
        });
      }
    } catch {
      setNotification({ type: "error", message: "⚠️ Server xatosi" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      setNotification({
        type: "success",
        message: `✅ Xush kelibsiz, ${user.displayName}!`,
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (error) {
      console.error("Google login error:", error);
      setNotification({
        type: "error",
        message: "❌ Google orqali kirishda xatolik yuz berdi",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <main className='min-h-screen flex items-center justify-center bg-[#ECFDF5] relative overflow-hidden px-4'>
      {/* 🔔 Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            key={notification.type + notification.message}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-fit max-w-sm px-6 py-4 flex items-start gap-4 rounded-2xl shadow-xl border border-white/20 backdrop-blur-md bg-white/70'>
            <div
              className={`p-2 rounded-full ${
                notification.type === "success"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}>
              {notification.type === "success" ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
            </div>
            <p className='text-sm text-gray-800 font-medium max-w-xs'>
              {notification.message}
            </p>
            <button
              onClick={() => setNotification(null)}
              className='text-gray-400 hover:text-gray-600 transition'>
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bosh sahifaga qaytish */}
      <a
        href='/'
        className='absolute top-6 left-6 flex items-center gap-2 bg-white/70 text-[#10B981] border border-[#10B981] px-4 py-2 rounded-full font-medium text-sm shadow-md backdrop-blur-md hover:bg-[#e6f9f3] transition z-20'>
        <span className='text-xl'>🏠</span> <span>Bosh sahifaga qaytish</span>
      </a>

      {/* Background animations */}
      <div className='absolute inset-0 z-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-[-150px] left-[10%] w-[400px] h-[400px] bg-[#10B981] rounded-full opacity-20 blur-3xl animate-pulse-slow' />
        <div className='absolute bottom-[-100px] right-[10%] w-[500px] h-[500px] bg-[#34D399] rounded-full opacity-30 blur-2xl animate-float-slow' />
        <div className='absolute top-[40%] left-[5%] text-[#6EE7B7] text-6xl animate-float-slow'>
          🔐
        </div>
        <div className='absolute bottom-[20%] right-[5%] text-[#A7F3D0] text-5xl animate-pulse-slow'>
          💼
        </div>
      </div>

      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        className='relative z-10 bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 space-y-5 backdrop-blur-md bg-white/70'>
        <h2 className='text-3xl font-bold text-center text-[#17424D]'>
          Tizimga kirish
        </h2>

        <input
          name='email'
          type='email'
          value={formData.email}
          onChange={handleChange}
          placeholder='Email manzilingiz'
          required
          className='w-full border border-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]'
        />

        <input
          name='password'
          type='password'
          value={formData.password}
          onChange={handleChange}
          placeholder='Parolingiz'
          required
          className='w-full border border-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]'
        />

        <button
          type='submit'
          disabled={isLoading}
          className='w-full bg-[#10B981] text-white py-3 rounded-lg font-semibold hover:bg-[#0ea672] transition flex items-center justify-center gap-2'>
          {isLoading ? (
            <>
              <Loader2 className='animate-spin w-5 h-5' />
              Yuklanyapti...
            </>
          ) : (
            <>🚀 Kirish</>
          )}
        </button>

        {/* Google login */}
        <button
          type='button'
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className='w-full border border-[#10B981] text-[#10B981] py-3 rounded-lg font-semibold hover:bg-[#e6f9f3] transition flex items-center justify-center gap-2'>
          {isGoogleLoading ? (
            <>
              <Loader2 className='animate-spin w-5 h-5' />
              Google orqali...
            </>
          ) : (
            <>
              <FcGoogle className='w-5 h-5' />
              Google bilan kirish
            </>
          )}
        </button>

        <p className='text-center text-sm text-gray-600'>
          Hisobingiz yo‘qmi?{" "}
          <a
            href='/signup'
            className='text-[#10B981] font-medium hover:underline'>
            Ro‘yxatdan o‘tish
          </a>
        </p>
      </form>
    </main>
  );
}
