"use client";

import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    try {
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
    } catch (error) {
      setNotification({
        type: "error",
        message: "Server bilan aloqa qilishda xatolik yuz berdi.",
      });
    } finally {
      setLoading(false);
    }
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
            transition={{ duration: 0.3 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-fit px-6 py-4 flex items-start gap-4 rounded-2xl shadow-xl border border-white/20 backdrop-blur-md bg-white/70"
          >
            <div
              className={`p-2 rounded-full ${
                notification.type === "success"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
            </div>
            <p className="text-sm text-gray-800 font-medium leading-snug max-w-xs">
              {notification.message}
            </p>
            <button
              onClick={() => setNotification(null)}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full sm:w-80 px-4 py-3 rounded-full border border-gray-300 text-sm outline-none text-gray-800 bg-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-[#10B981] transition duration-200"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className={`flex items-center justify-center gap-2 bg-[#10B981] text-white px-6 py-3 rounded-full font-semibold text-sm shadow hover:bg-[#0ea672] active:bg-[#0c8f60] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#10B981] transition duration-200 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Submitting...
            </>
          ) : (
            "🚀 Join Waitlist"
          )}
        </button>
      </form>
    </>
  );
}
