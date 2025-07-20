"use client";

import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebase"; // bu yo‘l firebase.js joylashgan joyga mos bo‘lishi kerak

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 201) {
        setNotification({
          type: "success",
          message: "✅ Foydalanuvchi yaratildi!",
        });
        setFormData({ name: "", email: "", password: "" });
      } else {
        setNotification({
          type: "error",
          message: data.error || "❌ Xatolik yuz berdi",
        });
      }
    } catch {
      setNotification({ type: "error", message: "⚠️ Tizim xatosi" });
    }
  };
  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Google foydalanuvchi:", user);

      // Agar foydalanuvchini backendga yubormoqchi bo‘lsangiz:
      const res = await fetch("/api/firebase-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          image: user.photoURL,
          uid: user.uid,
        }),
      });

      if (res.ok) {
        setNotification({
          type: "success",
          message: "✅ Google orqali ro‘yxatdan o‘tildi!",
        });
      } else {
        setNotification({
          type: "error",
          message: "❌ Ro‘yxatdan o‘tishda xatolik",
        });
      }
    } catch (error) {
      console.error(error);
      setNotification({
        type: "error",
        message: "⚠️ Google bilan kirishda xatolik",
      });
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
      {/* 🔔 Toast Notifier */}
      <AnimatePresence>
        {notification && (
          <motion.div
            key={notification.type + notification.message}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-fit max-w-sm md:max-w-md lg:max-w-lg px-6 py-4 flex items-start gap-4 rounded-2xl shadow-xl border border-white/20 backdrop-blur-md bg-white/70'>
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
            <p className='text-sm text-gray-800 font-medium leading-snug max-w-xs'>
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

      {/* 🏠 Bosh sahifa tugmasi */}
      <a
        href='/'
        className='absolute top-6 left-6 flex items-center gap-2 bg-white/70 text-[#10B981] border border-[#10B981] px-4 py-2 rounded-full font-medium text-sm shadow-md backdrop-blur-md hover:bg-[#e6f9f3] transition z-20'
        title='Bosh sahifa'>
        <span className='text-xl'>🏠</span> <span>Bosh sahifaga qaytish</span>
      </a>

      {/* Animatsion background */}
      <div className='absolute inset-0 z-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-[-150px] left-[10%] w-[400px] h-[400px] bg-[#10B981] rounded-full opacity-20 blur-3xl animate-pulse-slow' />
        <div className='absolute bottom-[-100px] right-[10%] w-[500px] h-[500px] bg-[#34D399] rounded-full opacity-30 blur-2xl animate-float-slow' />
        <div className='absolute top-[30%] left-[5%] text-[#6EE7B7] text-5xl animate-float-slow'>
          💼
        </div>
        <div className='absolute top-[55%] right-[5%] text-[#A7F3D0] text-4xl animate-pulse-slow'>
          🚰️
        </div>
        <div className='absolute top-[20%] right-[15%] text-[#bbf7d0] text-5xl animate-float-slow'>
          💡
        </div>
        <div className='absolute bottom-[15%] left-[10%] text-[#99f6e4] text-6xl animate-pulse-slow'>
          🔐
        </div>
        <div className='absolute bottom-[25%] right-[20%] text-[#6ee7b7] text-5xl animate-float-slow'>
          🌟
        </div>
        <div className='absolute bottom-[40%] left-[20%] text-[#34D399] text-4xl animate-float-slow'>
          🎯
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className='relative z-10 bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 space-y-5 backdrop-blur-md bg-white/70'>
        <h2 className='text-3xl font-bold text-center text-[#17424D]'>
          Ro‘yxatdan o‘tish
        </h2>

        <input
          name='name'
          value={formData.name}
          onChange={handleChange}
          placeholder='Ismingiz'
          required
          className='w-full border border-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]'
        />

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
          className='w-full bg-[#10B981] text-white py-3 rounded-lg font-semibold hover:bg-[#0ea672] transition'>
          🚀 Ro‘yxatdan o‘tish
        </button>

        {/* Google orqali ro'yxatdan o'tish */}
        <button
          type='button'
          onClick={handleGoogleSignup}
          className='w-full border border-[#10B981] text-[#10B981] py-3 rounded-lg font-semibold hover:bg-[#e6f9f3] transition flex items-center justify-center gap-2'>
          <FcGoogle className='w-5 h-5' />
          Google orqali davom etish
        </button>

        <p className='text-center text-sm text-gray-600'>
          Hisobingiz bormi?{" "}
          <a
            href='/login'
            className='text-[#10B981] font-medium hover:underline'>
            Kirish
          </a>
        </p>
      </form>
    </main>
  );
}
