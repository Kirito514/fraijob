"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Send, X } from "lucide-react";

const FeedbackForm = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const feedbackTypes = [
    { id: "bug", label: "Xatolik", icon: "🐛", color: "red" },
    { id: "feature", label: "Yangi xususiyat", icon: "💡", color: "blue" },
    { id: "improvement", label: "Yaxshilash", icon: "⚡", color: "green" },
    { id: "general", label: "Umumiy", icon: "💬", color: "purple" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !feedbackType || !message.trim()) return;

    setIsSubmitting(true);
    try {
      const feedbackData = {
        rating,
        type: feedbackType,
        message: message.trim(),
        timestamp: new Date().toISOString(),
      };

      // Send to Telegram bot
      const telegramResponse = await fetch("/api/telegram/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `🚀 **Yangi Feedback!**
          
⭐ **Reyting**: ${rating}/5
📝 **Turi**: ${feedbackType}
💬 **Xabar**: ${message.trim()}
⏰ **Vaqt**: ${new Date().toLocaleString('uz-UZ')}

#feedback #fraijob`
        }),
      });

      if (telegramResponse.ok) {
        onSubmit?.("success", "Feedback muvaffaqiyatli yuborildi! Rahmat!");
        // Reset form
        setRating(0);
        setFeedbackType("");
        setMessage("");
        onClose();
      } else {
        onSubmit?.("error", "Feedback yuborishda xatolik. Iltimos qaytadan urinib ko'ring.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      onSubmit?.("error", "Feedback yuborishda xatolik. Iltimos qaytadan urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRating(0);
      setFeedbackType("");
      setMessage("");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Feedback Qoldiring</h2>
                    <p className="text-sm text-gray-600">FraiJob-ni yaxshilashga yordam bering</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tajribangizni qanday baholaysiz?
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="p-1 transition-colors"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoveredStar || rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {rating === 1 && "Juda yomon"}
                  {rating === 2 && "Yomon"}
                  {rating === 3 && "O'rtacha"}
                  {rating === 4 && "Yaxshi"}
                  {rating === 5 && "Ajoyib"}
                </div>
              </div>

              {/* Feedback Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Bu qanday turdagi feedback?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {feedbackTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFeedbackType(type.id)}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                        feedbackType === type.id
                          ? `border-${type.color}-500 bg-${type.color}-50`
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <div className="text-xs font-medium text-gray-700">
                        {type.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tajribangiz haqida batafsil gapirib bering
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Fikrlaringiz, takliflar yoki muammolarni yozing..."
                  className="w-full h-32 p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!rating || !feedbackType || !message.trim() || isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Yuborilmoqda...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Feedback Yuborish
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackForm;
