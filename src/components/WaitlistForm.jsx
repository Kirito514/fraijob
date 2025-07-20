"use client";

import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setNotification({
        type: "error",
        message:
          "Email manzilida '@' belgisi bo'lishi va to‘liq formatda bo‘lishi kerak, masalan: yourname@example.com",
      });
      return;
    }

    const response = await fetch("/api/addEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      setNotification({
        type: "success",
        message: "Email muvaffaqiyatli yuborildi!",
      });
    } else {
      setNotification({
        type: "error",
        message: data.error || "Xatolik yuz berdi, qayta urinib ko'ring!",
      });
    }

    setEmail("");
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <>
      <AnimatePresence>
        {notification && (
          <motion.div
            key={notification.type + notification.message}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 max-w-md w-full
              ${notification.type === "success" ? "bg-green-500/70" : "bg-red-500/70"}
              backdrop-blur-md text-white border border-white/20`}
          >
            {notification.type === "success" ? (
              <CheckCircle size={20} className="text-white" />
            ) : (
              <AlertCircle size={20} className="text-white" />
            )}
            <p className="text-sm font-semibold flex-1">{notification.message}</p>
            <button
              onClick={() => setNotification(null)}
              className="hover:text-white/80 transition"
            >
              <X size={18} className="text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <input
          type="text" // << changed from "email" to "text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full sm:w-80 px-4 py-3 rounded-full border border-gray-300 text-sm outline-none text-gray-800 bg-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#10B981] transition duration-200"
        />
        <button
          type="submit"
          className="bg-[#10B981] text-white px-6 py-3 rounded-full font-semibold text-sm shadow hover:bg-[#0ea672] active:bg-[#0c8f60] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#10B981] transition duration-200"
        >
          🚀 Join Waitlist
        </button>
      </form>
    </>
  );
}
