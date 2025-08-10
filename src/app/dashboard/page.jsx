"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import chatManager from "@/lib/socket";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Briefcase,
  MessagesSquare,
  Settings,
  LogOut,
  Bot,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  User,
  Plus,
  Edit,
  Trash2,
  Reply,
  Bell,
  Search,
  TrendingUp,
  Users,
  Eye,
  Award,
  X,
  Clock,
  GraduationCap,
  Menu,
  Home,
} from "lucide-react";
import Image from "next/image";

// Animation components
const FadeInUp = ({ children, delay = 0, duration = 0.5 }) => (
  <motion.div
    initial={{ y: 30, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration, delay, ease: "easeOut" }}>
    {children}
  </motion.div>
);

const ScaleIn = ({ children, delay = 0, duration = 0.5 }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration, delay, ease: "easeOut" }}>
    {children}
  </motion.div>
);

const LANGS = [
  { value: "en", label: "English" },
  { value: "uz", label: "O'zbekcha" },
];

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Portfolio", icon: FolderOpen },
  { label: "Jobs", icon: Briefcase },
  { label: "Freelance", icon: Users },
  { label: "Frai AI", icon: Bot },
  { label: "Test", icon: FileText },
  { label: "Chats", icon: MessagesSquare },
  { label: "Settings", icon: Settings },
  { label: "Admin Panel", icon: Users, adminOnly: true },
];

// Test Creation Form Component
const TestCreationForm = ({ onTestCreated, setNotifications }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    timeLimit: 30,
    questions: [
      {
        question: "",
        type: "multiple_choice",
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      },
    ],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: "",
          type: "multiple_choice",
          options: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
        },
      ],
    }));
  };

  const updateQuestion = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      ),
    }));
  };

  const updateOption = (questionIndex, optionIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q, qIndex) =>
        qIndex === questionIndex
          ? {
              ...q,
              options: q.options.map((opt, oIndex) =>
                oIndex === optionIndex ? { ...opt, [field]: value } : opt
              ),
            }
          : q
      ),
    }));
  };

  const removeQuestion = (index) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onTestCreated();
        // Add notification
        setNotifications((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "success",
            message: "Test created successfully!",
            time: "Just now",
          },
        ]);
      }
    } catch (error) {
      console.error("Error creating test:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Basic Info */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Test Title
          </label>
          <input
            type='text'
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            className='w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]'
            required
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Time Limit (minutes)
          </label>
          <input
            type='number'
            value={formData.timeLimit}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                timeLimit: parseInt(e.target.value),
              }))
            }
            className='w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]'
            min='1'
            required
          />
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          className='w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]'
          rows='3'
        />
      </div>

      {/* Questions */}
      <div>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold text-gray-800'>Questions</h3>
          <button
            type='button'
            onClick={addQuestion}
            className='bg-[#10B981] text-white px-4 py-2 rounded-lg hover:bg-[#0ea672] transition-colors'>
            Add Question
          </button>
        </div>

        <div className='space-y-6'>
          {formData.questions.map((question, qIndex) => (
            <div key={qIndex} className='border border-gray-200 rounded-xl p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h4 className='font-semibold text-gray-800'>
                  Question {qIndex + 1}
                </h4>
                {formData.questions.length > 1 && (
                  <button
                    type='button'
                    onClick={() => removeQuestion(qIndex)}
                    className='text-red-600 hover:text-red-700'>
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Question Text
                  </label>
                  <textarea
                    value={question.question}
                    onChange={(e) =>
                      updateQuestion(qIndex, "question", e.target.value)
                    }
                    className='w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]'
                    rows='2'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Options
                  </label>
                  <div className='space-y-3'>
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className='flex items-center gap-3'>
                        <input
                          type='radio'
                          name={`correct-${qIndex}`}
                          checked={option.isCorrect}
                          onChange={() => {
                            // Reset all options to false, then set current to true
                            question.options.forEach((_, index) => {
                              updateOption(qIndex, index, "isCorrect", false);
                            });
                            updateOption(qIndex, oIndex, "isCorrect", true);
                          }}
                          className='text-[#10B981] focus:ring-[#10B981]'
                        />
                        <input
                          type='text'
                          value={option.text}
                          onChange={(e) =>
                            updateOption(qIndex, oIndex, "text", e.target.value)
                          }
                          className='flex-1 border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]'
                          placeholder={`Option ${oIndex + 1}`}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='flex justify-end gap-4'>
        <button
          type='button'
          onClick={() => onTestCreated()}
          className='px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors'>
          Cancel
        </button>
        <button
          type='submit'
          disabled={isSubmitting}
          className='px-6 py-3 bg-gradient-to-r from-[#10B981] to-[#34D399] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50'>
          {isSubmitting ? "Creating..." : "Create Test"}
        </button>
      </div>
    </form>
  );
};

export default function DashboardPage() {
  // All useState hooks must be at the top
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    avatar_url: "",
    lang: "en",
    github: "",
    telegram: "",
    role: "user",
  });
  const [active, setActive] = useState("Dashboard");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [testMenu, setTestMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editMessageText, setEditMessageText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [deletingMessages, setDeletingMessages] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Portfolio state
  const [portfolio, setPortfolio] = useState(null);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState({});

  // Inline editing state
  const [editingField, setEditingField] = useState(null);
  const [tempData, setTempData] = useState({});

  // Image upload state
  const [uploadingImage, setUploadingImage] = useState(false);

  // Profile image state
  const [profileImage, setProfileImage] = useState(null);

  // Jobs va Tests state
  const [jobs, setJobs] = useState([]);
  const [tests, setTests] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingTests, setLoadingTests] = useState(false);
  const [availableTests, setAvailableTests] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);
  const [showApplications, setShowApplications] = useState(false);

  // Freelance state
  const [projects, setProjects] = useState([]);
  const [projectProposals, setProjectProposals] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [showProposals, setShowProposals] = useState(false);

  // Frai AI state
  const [aiMessage, setAiMessage] = useState("");
  const [aiMessages, setAiMessages] = useState([]);

  // Notifications state
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "success",
      message: "Profile updated successfully!",
      time: "2m ago",
    },
    {
      id: 2,
      type: "info",
      message: "New job opportunity: Frontend Developer at TechCorp",
      time: "1h ago",
    },
    {
      id: 3,
      type: "warning",
      message: "Test deadline approaching: React Advanced",
      time: "3h ago",
    },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Clean up old notifications (keep only last 10)
  useEffect(() => {
    if (notifications.length > 10) {
      setNotifications((prev) => prev.slice(-10));
    }
  }, [notifications]);

  // Click outside to close notifications
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showNotifications &&
        !event.target.closest(".notifications-dropdown")
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  // Foydalanuvchi va profilni JWT cookie orqali olish
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("/api/me");
      if (!res.ok) {
        window.location.href = "/login";
        return;
      }
      const { user } = await res.json();
      setUser(user);

      // Profil ma'lumotlarini to'g'ridan-to'g'ri user'dan olish
      setProfile({
        name: user.name || "",
        email: user.email,
        bio: user.bio || "",
        avatar_url: user.image || "",
        lang: user.lang || "en",
        github: user.github || "",
        telegram: user.telegram || "",
        role: user.role || "user",
      });
    };
    fetchProfile();
  }, []);

  // Profil inputlar
  const handleChange = (e) => {
    setProfile((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  // Profilni yangilash
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
          lang: profile.lang,
          github: profile.github,
          telegram: profile.telegram,
        }),
      });

      if (response.ok) {
        setSuccess("Profile updated!");
        // Add notification
        setNotifications((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "success",
            message: "Profile updated successfully!",
            time: "Just now",
          },
        ]);
      } else {
        setError("Error updating profile");
        // Add error notification
        setNotifications((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "warning",
            message: "Failed to update profile. Please try again.",
            time: "Just now",
          },
        ]);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Error updating profile");
    }

    setLoading(false);
  };

  // Logout
  const handleLogout = async () => {
    try {
      // API logout call
      await fetch("/api/logout", {
        method: "POST",
      });

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("profileImage");

      // Clear all localStorage items related to the app
      Object.keys(localStorage).forEach((key) => {
        if (
          key.startsWith("profile") ||
          key.startsWith("portfolio") ||
          key.startsWith("chat")
        ) {
          localStorage.removeItem(key);
        }
      });

      // Redirect to login
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect even if API call fails
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    // This is now handled by the chat-specific online users fetching
    // No need for separate online count fetching
  }, []);

  // Chat xabarlarini olish
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/chats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setChatMessages(data.messages || []);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Har 3 soniyada yangilash
    return () => clearInterval(interval);
  }, []);

  // Portfolio ma'lumotlarini olish
  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoadingPortfolio(true);
      try {
        const response = await fetch("/api/portfolio");
        if (response.ok) {
          const data = await response.json();
          setPortfolio(data);

          // Set profile image from portfolio data if exists
          if (data.profile_image) {
            setProfileImage(data.profile_image);
            localStorage.setItem("profileImage", data.profile_image);
          }
        }
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setLoadingPortfolio(false);
      }
    };

    if (active === "Portfolio") {
      fetchPortfolio();
    }
  }, [active]);

  // Jobs ma'lumotlarini olish
  useEffect(() => {
    const fetchJobs = async () => {
      setLoadingJobs(true);
      try {
        const response = await fetch("/api/jobs");
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoadingJobs(false);
      }
    };

    const fetchJobApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/job-applications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setJobApplications(data);
        }
      } catch (error) {
        console.error("Error fetching job applications:", error);
      }
    };

    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoadingProjects(false);
      }
    };

    const fetchProjectProposals = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/project-proposals", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setProjectProposals(data);
        }
      } catch (error) {
        console.error("Error fetching project proposals:", error);
      }
    };

    if (active === "Jobs") {
      fetchJobs();
      fetchJobApplications();
    }

    if (active === "Freelance") {
      fetchProjects();
      fetchProjectProposals();
    }
  }, [active]);

  // Tests ma'lumotlarini olish
  useEffect(() => {
    const fetchTests = async () => {
      setLoadingTests(true);
      try {
        const response = await fetch("/api/tests");
        if (response.ok) {
          const data = await response.json();
          setTests(data);
        }
      } catch (error) {
        console.error("Error fetching tests:", error);
      } finally {
        setLoadingTests(false);
      }
    };

    const fetchAvailableTests = async () => {
      try {
        const response = await fetch("/api/tests?type=available");
        if (response.ok) {
          const data = await response.json();
          setAvailableTests(data);
        }
      } catch (error) {
        console.error("Error fetching available tests:", error);
      }
    };

    if (active === "Test") {
      fetchTests();
      fetchAvailableTests();
    }
  }, [active]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
        setMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Portfolio yangilash
  const handlePortfolioUpdate = async (updatedData) => {
    try {
      const response = await fetch("/api/portfolio", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const updatedPortfolio = await response.json();
        setPortfolio(updatedPortfolio);
        setShowEditModal(false);
        setEditingPortfolio({});

        // Add notification
        setNotifications((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "success",
            message: "Portfolio updated successfully!",
            time: "Just now",
          },
        ]);
      }
    } catch (error) {
      console.error("Error updating portfolio:", error);
      // Add error notification
      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "warning",
          message: "Failed to update portfolio. Please try again.",
          time: "Just now",
        },
      ]);
    }
  };

  // Quick save for inline editing
  const handleQuickSave = async (field) => {
    try {
      const response = await fetch("/api/portfolio", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tempData),
      });

      if (response.ok) {
        const updatedPortfolio = await response.json();
        setPortfolio(updatedPortfolio);
        setEditingField(null);
        setTempData({});

        // Add notification
        setNotifications((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "success",
            message: "Updated successfully!",
            time: "Just now",
          },
        ]);
      }
    } catch (error) {
      console.error("Error updating:", error);
      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "warning",
          message: "Failed to update. Please try again.",
          time: "Just now",
        },
      ]);
    }
  };

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "warning",
          message: "File size must be less than 5MB",
          time: "Just now",
        },
      ]);
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "warning",
          message: "Please select an image file",
          time: "Just now",
        },
      ]);
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfileImage(data.imageUrl);

        // Save to localStorage for immediate persistence
        localStorage.setItem("profileImage", data.imageUrl);

        // Update portfolio with new image
        try {
          console.log("Updating portfolio with image:", data.imageUrl);

          const portfolioResponse = await fetch("/api/portfolio", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ profile_image: data.imageUrl }),
          });

          console.log("Portfolio response status:", portfolioResponse.status);

          if (portfolioResponse.ok) {
            const updatedPortfolio = await portfolioResponse.json();
            console.log("Updated portfolio:", updatedPortfolio);
            setPortfolio(updatedPortfolio);
          } else {
            const errorData = await portfolioResponse.text();
            console.error("Portfolio update failed:", errorData);
          }
        } catch (portfolioError) {
          console.error("Error updating portfolio:", portfolioError);
        }

        setNotifications((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "success",
            message: "Profile image updated successfully!",
            time: "Just now",
          },
        ]);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "warning",
          message: "Failed to upload image. Please try again.",
          time: "Just now",
        },
      ]);
    } finally {
      setUploadingImage(false);
    }
  };

  // Load profile image from localStorage on component mount
  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  // Chat connection and data fetching
  useEffect(() => {
    if (user && active === "Chats") {
      const token = localStorage.getItem("token");
      if (token) {
        // Connect to chat manager
        chatManager.connect(token);

        chatManager.onNewMessage((message) => {
          setChatMessages((prev) => [...prev, message]);
          // Scroll to bottom when new message arrives
          setTimeout(() => {
            scrollToBottom();
          }, 100);
        });
        chatManager.onMessageUpdated((updatedMessage) => {
          setChatMessages((prev) =>
            prev.map((msg) =>
              msg.id === updatedMessage.id ? updatedMessage : msg
            )
          );
        });
        chatManager.onMessageDeleted(({ messageId }) => {
          setChatMessages((prev) => prev.filter((msg) => msg.id !== messageId));
        });
        chatManager.onError((error) => {
          console.error("Chat error:", error);
        });

        // Fetch initial chat messages
        fetchChatMessages();

        // Scroll to bottom after initial load
        setTimeout(() => {
          scrollToBottom();
        }, 500);

        // Update user activity every 30 seconds
        const activityInterval = setInterval(() => {
          updateUserActivity();
        }, 30000);

        return () => {
          chatManager.disconnect();
          clearInterval(activityInterval);
        };
      }
    }
  }, [user, active]);

  // Auto scroll when messages change
  useEffect(() => {
    if (chatMessages.length > 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [chatMessages]);

  // Typing indicator
  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (isTyping) {
      chatManager.startTyping();
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        chatManager.stopTyping();
      }, 2000);
    } else {
      chatManager.stopTyping();
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isTyping]);

  // Xabar yuborish
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sendingMessage) return;

    setSendingMessage(true);
    try {
      const messageData = {
        message: newMessage.trim(),
        replyToId: replyingTo?.id || null,
      };

      // Send message with reply data
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        const newMsg = await response.json();
        setChatMessages((prev) => [...prev, newMsg]);
      }
      setNewMessage("");
      setReplyingTo(null); // Clear reply after sending
      setIsTyping(false);
      // Update user activity after sending message
      updateUserActivity();
      // Scroll to bottom after sending message
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleEditMessage = (messageId, currentText) => {
    setEditingMessage(messageId);
    setEditMessageText(currentText);
  };

  const handleSaveEdit = () => {
    if (!editMessageText.trim()) return;

    chatManager.editMessage(editingMessage, editMessageText.trim());
    setEditingMessage(null);
    setEditMessageText("");
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setEditMessageText("");
  };

  const handleReplyMessage = (message) => {
    setReplyingTo(message);
    // Focus on input
    const input = document.querySelector(
      'input[placeholder*="Type your message"]'
    );
    if (input) input.focus();
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  const handleDeleteMessage = (messageId) => {
    // Add to deleting set for animation
    setDeletingMessages((prev) => new Set([...prev, messageId]));

    // Delete after a short delay for animation
    setTimeout(() => {
      chatManager.deleteMessage(messageId);
      setDeletingMessages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }, 300);
  };

  // Fetch chat messages
  const fetchChatMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/chats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setChatMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  // Update user activity
  const updateUserActivity = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch("/api/users/online", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error updating user activity:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
    }
  };

  // Test state
  const [currentTest, setCurrentTest] = useState(null);
  const [testAnswers, setTestAnswers] = useState({});
  const [testTimer, setTestTimer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTestActive, setIsTestActive] = useState(false);

  // Test boshlash funksiyasi
  const startTest = (test) => {
    setCurrentTest(test);
    setTestAnswers({});
    setTimeRemaining(test.timeLimit * 60); // daqiqalarni soniyaga o'tkazish
    setIsTestActive(true);
    setActive("Test");
  };

  // Test timer
  useEffect(() => {
    let interval;
    if (isTestActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Vaqt tugadi, testni avtomatik yuborish
            submitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTestActive, timeRemaining]);

  // Test yuborish
  const submitTest = async () => {
    if (!currentTest) return;

    const answers = Object.entries(testAnswers).map(
      ([questionId, selectedOptionId]) => ({
        questionId,
        selectedOptionId,
      })
    );

    const timeSpent = currentTest.timeLimit * 60 - timeRemaining;

    try {
      const response = await fetch("/api/tests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testId: currentTest.id,
          answers,
          timeSpent: Math.floor(timeSpent / 60),
        }),
      });

      if (response.ok) {
        const result = await response.json();

        // Add notification
        setNotifications((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "success",
            message: `Test completed! Score: ${result.score}%`,
            time: "Just now",
          },
        ]);

        // Reset test state
        setCurrentTest(null);
        setTestAnswers({});
        setTimeRemaining(0);
        setIsTestActive(false);
        setActive("Test");

        // Refresh tests
        const testsResponse = await fetch("/api/tests");
        if (testsResponse.ok) {
          const testsData = await testsResponse.json();
          setTests(testsData);
        }
      }
    } catch (error) {
      console.error("Error submitting test:", error);
    }
  };

  // Test javobini saqlash
  const saveAnswer = (questionId, optionId) => {
    setTestAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  // Vaqtni formatlash
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!user)
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/50'>
        <div className='text-center'>
          <div className='animate-spin w-8 h-8 border-4 border-[#10B981] border-t-transparent rounded-full mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading dashboard...</p>
          <p className='text-sm text-gray-500 mt-2'>
            Please wait while we fetch your data
          </p>
        </div>
      </div>
    );

  const demoChats = [
    {
      id: 1,
      user: "Admin",
      last: "Welcome to FraiJob!",
      time: "2m ago",
      unread: 1,
    },
    {
      id: 2,
      user: "HR",
      last: "Interview scheduled.",
      time: "1h ago",
      unread: 0,
    },
  ];

  return (
    <div className='flex flex-col md:flex-row min-h-screen h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/50'>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`hidden md:flex transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"} flex-col justify-between ${sidebarOpen ? "p-4" : "p-2"} backdrop-blur-xl bg-white/80 border-r border-white/30 shadow-xl`}>
        <div>
          <div
            className={`flex items-center ${sidebarOpen ? "justify-between" : "justify-center"} mb-6`}>
            <div className='flex items-center justify-center'>
              <div
                className={`${sidebarOpen ? "w-10 h-10" : "w-8 h-8"} relative`}>
                <Image
                  src='/logo.svg'
                  alt='Logo'
                  fill
                  className='object-contain'
                />
              </div>
            </div>
          </div>

          <nav className='space-y-2'>
            {menuItems.map(({ label, icon: Icon, adminOnly }, index) => {
              // Admin panel faqat admin foydalanuvchilar uchun
              if (adminOnly && profile.role?.toLowerCase() !== "admin") {
                return null;
              }

              return (
                <motion.button
                  key={label}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    if (label === "Admin Panel") {
                      window.open("/admin/users", "_blank");
                    } else {
                      setActive(label);
                    }
                  }}
                  className={`flex items-center w-full ${sidebarOpen ? "px-3" : "px-2"} ${sidebarOpen ? "py-2" : "py-2"} rounded-lg text-sm font-medium transition-all duration-300 ${
                    active === label
                      ? "bg-gradient-to-r from-[#10B981] to-[#34D399] text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-[#10B981]"
                  } ${!sidebarOpen ? "justify-center" : ""}`}>
                  <Icon className='w-4 h-4 flex-shrink-0' />
                  {sidebarOpen && <span className='ml-2 text-sm'>{label}</span>}
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* User Profile */}
        <div className='space-y-2'>
          <div
            className={`flex items-center gap-2 ${sidebarOpen ? "p-3" : "p-2"} rounded-lg bg-gray-50 border border-gray-200`}>
            <div
              className={`${sidebarOpen ? "w-8 h-8" : "w-8 h-8"} rounded-full bg-gradient-to-r from-[#10B981] to-[#34D399] flex items-center justify-center text-white font-bold text-sm`}>
              {profile.name ? (
                <span>{profile.name[0].toUpperCase()}</span>
              ) : (
                <User size={16} />
              )}
            </div>
            {sidebarOpen && (
              <div className='flex-1 min-w-0'>
                <div className='font-medium text-gray-800 text-sm truncate'>
                  {profile.name || "User"}
                </div>
                <div className='text-gray-500 text-xs truncate'>
                  {profile.email}
                </div>
              </div>
            )}
          </div>

          {/* Logout Button - Separate */}
          <button
            onClick={handleLogout}
            className={`flex items-center w-full ${sidebarOpen ? "px-3 gap-2" : "px-2 justify-center"} py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200`}>
            <LogOut className='w-4 h-4 flex-shrink-0' />
            {sidebarOpen && <span className='text-sm'>Logout</span>}
          </button>
        </div>

        {/* Sidebar Toggle Button - always visible at the bottom */}
        {/* Remove the toggle button from inside <motion.aside> */}
      </motion.aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 z-50 md:hidden'
            onClick={() => setMobileMenuOpen(false)}>
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className='w-64 h-full bg-white/95 backdrop-blur-xl shadow-xl p-4'
              onClick={(e) => e.stopPropagation()}>
              {/* Mobile Menu Header */}
              <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center justify-center'>
                  <div className='w-8 h-8 relative'>
                    <Image
                      src='/logo.svg'
                      alt='Logo'
                      fill
                      className='object-contain'
                    />
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className='p-2 rounded-lg hover:bg-gray-100'>
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Menu Items */}
              <nav className='space-y-2 mb-8'>
                {menuItems.map(({ label, icon: Icon, adminOnly }) => {
                  if (adminOnly && profile.role?.toLowerCase() !== "admin") {
                    return null;
                  }

                  return (
                    <button
                      key={label}
                      onClick={() => {
                        if (label === "Admin Panel") {
                          window.open("/admin/users", "_blank");
                        } else {
                          setActive(label);
                          setMobileMenuOpen(false);
                        }
                      }}
                      className={`flex items-center w-full px-3 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                        active === label
                          ? "bg-gradient-to-r from-[#10B981] to-[#34D399] text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-100 hover:text-[#10B981]"
                      }`}>
                      <Icon className='w-5 h-5 flex-shrink-0' />
                      <span className='ml-3'>{label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Mobile User Profile */}
              <div className='space-y-3 border-t border-gray-200 pt-4'>
                <div className='flex items-center gap-3 p-3 rounded-lg bg-gray-50'>
                  <div className='w-10 h-10 rounded-full bg-gradient-to-r from-[#10B981] to-[#34D399] flex items-center justify-center text-white font-bold'>
                    {profile.name ? (
                      <span>{profile.name[0].toUpperCase()}</span>
                    ) : (
                      <User size={20} />
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='font-medium text-gray-800 text-sm truncate'>
                      {profile.name || "User"}
                    </div>
                    <div className='text-gray-500 text-xs truncate'>
                      {profile.email}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className='flex items-center w-full px-3 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200'>
                  <LogOut className='w-5 h-5 flex-shrink-0' />
                  <span className='ml-3'>Logout</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden pb-16 md:pb-0'>
        {/* Enhanced Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='bg-white/80 backdrop-blur-xl border-b border-white/30 p-4 md:p-6 shadow-sm'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              {/* Desktop Sidebar Toggle */}
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className='hidden md:block p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200'
                aria-label='Toggle sidebar'>
                {sidebarOpen ? (
                  <ChevronLeft size={20} />
                ) : (
                  <ChevronRight size={20} />
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className='md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200'
                aria-label='Toggle mobile menu'>
                <Menu size={20} />
              </button>

              <h1 className='text-xl md:text-2xl font-bold text-gray-800'>
                {active}
              </h1>
            </div>

            <div className='flex items-center gap-2 md:gap-4'>
              <div className='relative hidden sm:block'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                <input
                  type='text'
                  placeholder='Search...'
                  className='pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:bg-white transition-all duration-300 w-48 md:w-64'
                />
              </div>
              <div className='relative notifications-dropdown'>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className='p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 relative'>
                  <Bell size={20} />
                  {notifications.length > 0 && (
                    <span className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full'></span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className='absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50'>
                    <div className='p-4 border-b border-gray-100'>
                      <h3 className='font-semibold text-gray-800'>
                        Notifications
                      </h3>
                    </div>
                    <div className='max-h-64 overflow-y-auto'>
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className='p-4 border-b border-gray-100 hover:bg-gray-50'>
                          <div className='flex items-start gap-3'>
                            <div
                              className={`w-2 h-2 rounded-full mt-2 ${
                                notification.type === "success"
                                  ? "bg-green-500"
                                  : notification.type === "warning"
                                    ? "bg-yellow-500"
                                    : "bg-blue-500"
                              }`}></div>
                            <div className='flex-1'>
                              <p className='text-sm text-gray-800'>
                                {notification.message}
                              </p>
                              <p className='text-xs text-gray-500 mt-1'>
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className='p-4 border-t border-gray-100'>
                      <button className='text-sm text-[#10B981] hover:text-[#0ea672] font-medium'>
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content Area */}
        <div className='flex-1 overflow-auto p-4 md:p-6'>
          <AnimatePresence mode='wait'>
            {active === "Dashboard" && (
              <motion.div
                key='dashboard'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className='space-y-6'>
                {/* Welcome Message */}
                <FadeInUp delay={0.1}>
                  <div className='bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-2xl p-6 text-white shadow-lg'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h2 className='text-2xl font-bold mb-2'>
                          Welcome back, {profile.name || "User"}! 👋
                        </h2>
                        <p className='text-green-100'>
                          Ready to take your career to the next level?
                        </p>
                      </div>
                      <div className='text-right'>
                        <div className='text-3xl font-bold'>
                          {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                          })}
                        </div>
                        <div className='text-green-100'>
                          {new Date().toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeInUp>

                {/* Quick Actions Widget */}
                <FadeInUp delay={0.3}>
                  <div className='bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                      <span className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></span>
                      Quick Actions
                    </h3>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3'>
                      <button
                        onClick={() => setActive("Portfolio")}
                        className='p-3 md:p-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs md:text-sm font-medium hover:shadow-lg transition-all duration-300 flex flex-col items-center gap-1 md:gap-2'>
                        <FolderOpen className='w-4 h-4 md:w-5 md:h-5' />
                        <span className='text-xs md:text-sm'>
                          Update Portfolio
                        </span>
                      </button>
                      <button
                        onClick={() => setActive("Jobs")}
                        className='p-3 md:p-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white text-xs md:text-sm font-medium hover:shadow-lg transition-all duration-300 flex flex-col items-center gap-1 md:gap-2'>
                        <Briefcase className='w-4 h-4 md:w-5 md:h-5' />
                        <span className='text-xs md:text-sm'>Find Jobs</span>
                      </button>
                      <button
                        onClick={() => setActive("Freelance")}
                        className='p-3 md:p-4 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs md:text-sm font-medium hover:shadow-lg transition-all duration-300 flex flex-col items-center gap-1 md:gap-2'>
                        <Users className='w-4 h-4 md:w-5 md:h-5' />
                        <span className='text-xs md:text-sm'>
                          Browse Projects
                        </span>
                      </button>
                      <button
                        onClick={() => setActive("Test")}
                        className='p-3 md:p-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs md:text-sm font-medium hover:shadow-lg transition-all duration-300 flex flex-col items-center gap-1 md:gap-2'>
                        <FileText className='w-4 h-4 md:w-5 md:h-5' />
                        <span className='text-xs md:text-sm'>Take Test</span>
                      </button>
                    </div>
                  </div>
                </FadeInUp>

                {/* Progress Tracker */}
                <FadeInUp delay={0.4}>
                  <div className='bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                      <TrendingUp className='w-5 h-5 text-green-500' />
                      Your Progress
                    </h3>
                    <div className='space-y-4'>
                      {/* Profile Completion */}
                      <div>
                        <div className='flex justify-between items-center mb-2'>
                          <span className='text-sm font-medium text-gray-700'>
                            Profile Completion
                          </span>
                          <span className='text-sm text-gray-500'>85%</span>
                        </div>
                        <div className='w-full bg-gray-200 rounded-full h-2'>
                          <div
                            className='bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full'
                            style={{ width: "85%" }}></div>
                        </div>
                      </div>

                      {/* Skills Progress */}
                      <div>
                        <div className='flex justify-between items-center mb-2'>
                          <span className='text-sm font-medium text-gray-700'>
                            Skills Assessment
                          </span>
                          <span className='text-sm text-gray-500'>
                            3/5 completed
                          </span>
                        </div>
                        <div className='w-full bg-gray-200 rounded-full h-2'>
                          <div
                            className='bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full'
                            style={{ width: "60%" }}></div>
                        </div>
                      </div>

                      {/* Monthly Goal */}
                      <div>
                        <div className='flex justify-between items-center mb-2'>
                          <span className='text-sm font-medium text-gray-700'>
                            Monthly Goal (Job Applications)
                          </span>
                          <span className='text-sm text-gray-500'>2/10</span>
                        </div>
                        <div className='w-full bg-gray-200 rounded-full h-2'>
                          <div
                            className='bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full'
                            style={{ width: "20%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeInUp>

                {/* Recent Activity Feed */}
                <FadeInUp delay={0.5}>
                  <div className='bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                      <Clock className='w-5 h-5 text-blue-500' />
                      Recent Activity
                    </h3>
                    <div className='space-y-3'>
                      <div className='flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-200'>
                        <div className='w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center'>
                          <Briefcase size={16} className='text-green-600' />
                        </div>
                        <div className='flex-1'>
                          <div className='text-sm font-medium text-gray-800'>
                            Applied to Frontend Developer position
                          </div>
                          <div className='text-xs text-gray-500'>
                            2 hours ago at TechCorp
                          </div>
                        </div>
                      </div>

                      <div className='flex items-center gap-3 p-3 rounded-xl bg-purple-50 border border-purple-200'>
                        <div className='w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center'>
                          <Users size={16} className='text-purple-600' />
                        </div>
                        <div className='flex-1'>
                          <div className='text-sm font-medium text-gray-800'>
                            Submitted proposal for React Native App
                          </div>
                          <div className='text-xs text-gray-500'>
                            1 day ago • $2000-3500
                          </div>
                        </div>
                      </div>

                      <div className='flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200'>
                        <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                          <FileText size={16} className='text-blue-600' />
                        </div>
                        <div className='flex-1'>
                          <div className='text-sm font-medium text-gray-800'>
                            Completed JavaScript Assessment
                          </div>
                          <div className='text-xs text-gray-500'>
                            3 days ago • Score: 85%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeInUp>

                {/* Skill Recommendations */}
                <FadeInUp delay={0.6}>
                  <div className='bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                      <Bot className='w-5 h-5 text-indigo-500' />
                      Recommended for You
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200'>
                        <div className='flex items-center gap-3 mb-2'>
                          <div className='w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center'>
                            <TrendingUp size={16} className='text-indigo-600' />
                          </div>
                          <span className='font-medium text-gray-800'>
                            Learn React Native
                          </span>
                        </div>
                        <p className='text-sm text-gray-600 mb-3'>
                          Based on your JavaScript skills, React Native is
                          trending in your area
                        </p>
                        <button className='text-xs bg-indigo-500 text-white px-3 py-1 rounded-lg hover:bg-indigo-600 transition-colors'>
                          Start Learning
                        </button>
                      </div>

                      <div className='p-4 rounded-xl bg-gradient-to-r from-green-50 to-teal-50 border border-green-200'>
                        <div className='flex items-center gap-3 mb-2'>
                          <div className='w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center'>
                            <Award size={16} className='text-green-600' />
                          </div>
                          <span className='font-medium text-gray-800'>
                            UI/UX Design
                          </span>
                        </div>
                        <p className='text-sm text-gray-600 mb-3'>
                          High demand skill that complements your development
                          background
                        </p>
                        <button className='text-xs bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors'>
                          Explore
                        </button>
                      </div>
                    </div>
                  </div>
                </FadeInUp>
              </motion.div>
            )}

            {active === "Portfolio" && (
              <motion.div
                key='portfolio'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className='space-y-6 max-w-6xl mx-auto'>
                {loadingPortfolio ? (
                  <div className='flex items-center justify-center py-20'>
                    <div className='animate-spin w-8 h-8 border-4 border-[#10B981] border-t-transparent rounded-full'></div>
                  </div>
                ) : (
                  <>
                    {/* Header Section - New Layout */}
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                      {/* Profile Picture - Left Side (Larger) */}
                      <FadeInUp delay={0.1}>
                        <div className='group relative bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 rounded-2xl p-6 flex flex-col items-center justify-center shadow-lg h-full overflow-hidden border border-cyan-200/50'>
                          <div className='absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10'></div>

                          {/* Hover Edit Button */}
                          <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-20'>
                            <label className='w-8 h-8 bg-cyan-500/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-cyan-500/30 transition-all duration-200 border border-cyan-300/30 shadow-lg hover:scale-110 cursor-pointer'>
                              <input
                                type='file'
                                accept='image/*'
                                onChange={handleImageUpload}
                                className='hidden'
                              />
                              {uploadingImage ? (
                                <div className='w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                              ) : (
                                <svg
                                  className='w-3 h-3 text-cyan-700'
                                  fill='none'
                                  stroke='currentColor'
                                  viewBox='0 0 24 24'>
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z'
                                  />
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M15 13a3 3 0 11-6 0 3 3 0 016 0z'
                                  />
                                </svg>
                              )}
                            </label>
                          </div>

                          <div className='relative z-10 flex items-center justify-center h-full p-4'>
                            {profileImage || portfolio?.profile_image ? (
                              <div className='aspect-square w-full min-w-[150px] max-w-[400px] bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden border-4 border-cyan-200/50 shadow-2xl'>
                                <img
                                  src={profileImage || portfolio?.profile_image}
                                  alt='Profile'
                                  className='w-full h-full object-cover'
                                />
                              </div>
                            ) : (
                              <div className='aspect-square w-full min-w-[150px] max-w-[400px] bg-white/80 backdrop-blur-sm rounded-3xl flex items-center justify-center text-8xl font-bold text-cyan-700 border-4 border-cyan-200/50 shadow-2xl'>
                                {portfolio?.name
                                  ? portfolio.name[0].toUpperCase()
                                  : profile.name
                                    ? profile.name[0].toUpperCase()
                                    : "U"}
                              </div>
                            )}
                          </div>
                        </div>
                      </FadeInUp>

                      {/* Right Side - Name and Contact Stacked */}
                      <div className='lg:col-span-2 space-y-4'>
                        {/* Name and Title */}
                        <FadeInUp delay={0.2}>
                          <div className='group relative bg-gradient-to-br from-teal-50 via-emerald-50 to-green-100 rounded-2xl p-5 shadow-lg overflow-hidden border border-teal-200/50'>
                            <div className='absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8'></div>

                            {/* Hover Edit Button */}
                            <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-20'>
                              <button
                                onClick={() =>
                                  setEditingField(
                                    editingField === "name" ? null : "name"
                                  )
                                }
                                className='w-8 h-8 bg-teal-500/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-teal-500/30 transition-all duration-200 border border-teal-300/30 shadow-lg hover:scale-110'>
                                <Edit size={12} className='text-teal-700' />
                              </button>
                            </div>

                            <div className='relative z-10'>
                              <div className='space-y-3'>
                                {editingField === "name" ? (
                                  <div className='space-y-3'>
                                    <input
                                      type='text'
                                      value={
                                        tempData.name ||
                                        portfolio?.name ||
                                        profile.name ||
                                        ""
                                      }
                                      onChange={(e) =>
                                        setTempData({
                                          ...tempData,
                                          name: e.target.value,
                                        })
                                      }
                                      className='w-full text-2xl font-bold bg-white/80 text-teal-800 placeholder-teal-500 border border-teal-200/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300/50'
                                      placeholder='Your Name'
                                    />
                                    <input
                                      type='text'
                                      value={
                                        tempData.title || portfolio?.title || ""
                                      }
                                      onChange={(e) =>
                                        setTempData({
                                          ...tempData,
                                          title: e.target.value,
                                        })
                                      }
                                      className='w-full text-lg bg-white/80 text-teal-800 placeholder-teal-500 border border-teal-200/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300/50'
                                      placeholder='Your Title'
                                    />
                                    <textarea
                                      value={
                                        tempData.bio ||
                                        portfolio?.bio ||
                                        profile.bio ||
                                        ""
                                      }
                                      onChange={(e) =>
                                        setTempData({
                                          ...tempData,
                                          bio: e.target.value,
                                        })
                                      }
                                      className='w-full text-sm bg-white/80 text-teal-800 placeholder-teal-500 border border-teal-200/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300/50 resize-none'
                                      placeholder='Your Bio'
                                      rows={3}
                                    />
                                    <div className='flex gap-2'>
                                      <button
                                        onClick={() => handleQuickSave("name")}
                                        className='bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition-colors'>
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setEditingField(null)}
                                        className='bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors'>
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <h1 className='text-2xl font-bold text-teal-800'>
                                      {portfolio?.name ||
                                        profile.name ||
                                        "User Name"}
                                    </h1>
                                    <p className='text-lg text-teal-700 font-medium'>
                                      🚀{" "}
                                      {portfolio?.title ||
                                        "Full-Stack Developer"}
                                    </p>
                                    <p className='text-teal-600 text-sm leading-relaxed'>
                                      {portfolio?.bio ||
                                        profile.bio ||
                                        "Passionate about creating amazing digital experiences"}
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </FadeInUp>

                        {/* Contact Information */}
                        <FadeInUp delay={0.3}>
                          <div className='group relative bg-gradient-to-br from-orange-50 via-red-50 to-pink-100 rounded-2xl p-5 shadow-lg overflow-hidden border border-orange-200/50'>
                            <div className='absolute top-0 right-0 w-22 h-22 bg-white/10 rounded-full -translate-y-11 translate-x-11'></div>

                            {/* Hover Edit Button */}
                            <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-20'>
                              <button
                                onClick={() =>
                                  setEditingField(
                                    editingField === "contact"
                                      ? null
                                      : "contact"
                                  )
                                }
                                className='w-8 h-8 bg-orange-500/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-orange-500/30 transition-all duration-200 border border-orange-300/30 shadow-lg hover:scale-110'>
                                <Edit size={12} className='text-orange-700' />
                              </button>
                            </div>

                            <div className='relative z-10'>
                              <div className='flex items-center gap-3 mb-6'>
                                <div className='w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center border border-orange-300/30'>
                                  <svg
                                    className='w-5 h-5 text-orange-700'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'>
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                                    />
                                  </svg>
                                </div>
                                <h3 className='text-lg font-semibold text-orange-800'>
                                  Contact
                                </h3>
                              </div>
                              {editingField === "contact" ? (
                                <div className='space-y-3'>
                                  <input
                                    type='email'
                                    value={
                                      tempData.email ||
                                      portfolio?.email ||
                                      profile.email ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      setTempData({
                                        ...tempData,
                                        email: e.target.value,
                                      })
                                    }
                                    className='w-full bg-white/80 text-orange-800 placeholder-orange-500 border border-orange-200/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300/50'
                                    placeholder='Email Address'
                                  />
                                  <input
                                    type='tel'
                                    value={
                                      tempData.phone || portfolio?.phone || ""
                                    }
                                    onChange={(e) =>
                                      setTempData({
                                        ...tempData,
                                        phone: e.target.value,
                                      })
                                    }
                                    className='w-full bg-white/80 text-orange-800 placeholder-orange-500 border border-orange-200/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300/50'
                                    placeholder='Phone Number'
                                  />
                                  <div className='flex gap-2'>
                                    <button
                                      onClick={() => handleQuickSave("contact")}
                                      className='bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition-colors'>
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingField(null)}
                                      className='bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors'>
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className='space-y-3'>
                                  <div className='flex items-center gap-3 p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-orange-200/50 shadow-sm'>
                                    <div className='w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center border border-orange-300/30'>
                                      <svg
                                        className='w-4 h-4 text-orange-700'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'>
                                        <path
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                          strokeWidth={2}
                                          d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                                        />
                                      </svg>
                                    </div>
                                    <span className='text-sm text-orange-800 font-medium'>
                                      {portfolio?.email || profile.email}
                                    </span>
                                  </div>
                                  <div className='flex items-center gap-3 p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-orange-200/50 shadow-sm'>
                                    <div className='w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center border border-orange-300/30'>
                                      <svg
                                        className='w-4 h-4 text-orange-700'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'>
                                        <path
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                          strokeWidth={2}
                                          d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                                        />
                                      </svg>
                                    </div>
                                    <span className='text-sm text-orange-800 font-medium'>
                                      {" "}
                                      {portfolio?.phone || "+998 90 123 45 67"}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </FadeInUp>
                      </div>
                    </div>

                    {/* Education Section - Full Width */}
                    <FadeInUp delay={0.4}>
                      <div className='group relative bg-gradient-to-br from-indigo-50 via-purple-50 to-violet-100 rounded-2xl p-6 shadow-lg overflow-hidden border border-indigo-200/50'>
                        <div className='absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 -translate-x-12'></div>

                        {/* Hover Edit Button */}
                        <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-20'>
                          <button
                            onClick={() =>
                              setEditingField(
                                editingField === "education"
                                  ? null
                                  : "education"
                              )
                            }
                            className='w-8 h-8 bg-indigo-500/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-indigo-500/30 transition-all duration-200 border border-indigo-300/30 shadow-lg hover:scale-110'>
                            <Edit size={12} className='text-indigo-700' />
                          </button>
                        </div>

                        <div className='relative z-10'>
                          <div className='flex items-center gap-4 mb-6'>
                            <div className='w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-300/30'>
                              <svg
                                className='w-6 h-6 text-indigo-700'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'>
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M12 14l9-5-9-5-9 5 9 5z'
                                />
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z'
                                />
                              </svg>
                            </div>
                            <h2 className='text-2xl font-bold text-indigo-800'>
                              🎓 Education
                            </h2>
                          </div>
                          {editingField === "education" ? (
                            <div className='space-y-4'>
                              <div className='bg-white/90 backdrop-blur-sm border border-indigo-200/50 rounded-xl p-4 shadow-sm'>
                                <h3 className='font-bold text-sm mb-3 text-indigo-800'>
                                  Edit Education
                                </h3>
                                <div className='space-y-3'>
                                  <input
                                    type='text'
                                    value={
                                      tempData.degree ||
                                      portfolio?.degree ||
                                      "Bachelor in Computer Science"
                                    }
                                    onChange={(e) =>
                                      setTempData({
                                        ...tempData,
                                        degree: e.target.value,
                                      })
                                    }
                                    className='w-full text-sm bg-white/80 text-indigo-800 placeholder-indigo-500 border border-indigo-200/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300/50'
                                    placeholder='Degree/Course Name'
                                  />
                                  <input
                                    type='text'
                                    value={
                                      tempData.university ||
                                      portfolio?.university ||
                                      "Tashkent University"
                                    }
                                    onChange={(e) =>
                                      setTempData({
                                        ...tempData,
                                        university: e.target.value,
                                      })
                                    }
                                    className='w-full text-sm bg-white/80 text-indigo-800 placeholder-indigo-500 border border-indigo-200/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300/50'
                                    placeholder='University Name'
                                  />
                                  <input
                                    type='text'
                                    value={
                                      tempData.educationYears ||
                                      portfolio?.educationYears ||
                                      "2020-2024"
                                    }
                                    onChange={(e) =>
                                      setTempData({
                                        ...tempData,
                                        educationYears: e.target.value,
                                      })
                                    }
                                    className='w-full text-sm bg-white/80 text-indigo-800 placeholder-indigo-500 border border-indigo-200/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300/50'
                                    placeholder='Years (e.g., 2020-2024)'
                                  />
                                  <div className='flex gap-2'>
                                    <button
                                      onClick={() =>
                                        handleQuickSave("education")
                                      }
                                      className='bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition-colors'>
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingField(null)}
                                      className='bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors'>
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                              <div className='flex items-start gap-4 bg-white/80 backdrop-blur-sm border border-indigo-200/50 rounded-2xl p-5 shadow-sm'>
                                <div className='w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-indigo-300/30'>
                                  <svg
                                    className='w-6 h-6 text-indigo-700'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'>
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <h3 className='font-bold text-lg mb-2 text-indigo-800'>
                                    Bachelor in Computer Science
                                  </h3>
                                  <p className='text-indigo-700 font-medium mb-1'>
                                    🏫 Tashkent University
                                  </p>
                                  <p className='text-indigo-600 text-sm'>
                                    📅 2020-2024
                                  </p>
                                </div>
                              </div>
                              <div className='flex items-start gap-4 bg-white/80 backdrop-blur-sm border border-indigo-200/50 rounded-2xl p-5 shadow-sm'>
                                <div className='w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-indigo-300/30'>
                                  <svg
                                    className='w-6 h-6 text-indigo-700'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'>
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z'
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <h3 className='font-bold text-lg mb-2 text-indigo-800'>
                                    Web Development Bootcamp
                                  </h3>
                                  <p className='text-indigo-700 font-medium mb-1'>
                                    💻 Udemy & Coursera
                                  </p>
                                  <p className='text-indigo-600 text-sm'>
                                    📅 2023-2024
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </FadeInUp>

                    {/* Middle Section - 3 Columns */}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                      {/* Experience - Premium Blue */}
                      <FadeInUp delay={0.5}>
                        <div className='group relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 rounded-2xl p-5 shadow-lg overflow-hidden h-full border border-blue-200/50'>
                          {/* Background Pattern */}
                          <div className='absolute inset-0 bg-white/10 backdrop-blur-sm'></div>
                          <div className='absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full -translate-y-14 translate-x-14'></div>
                          <div className='absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10'></div>
                          {/* Hover Edit Button */}
                          <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-20'>
                            <button
                              onClick={() =>
                                setEditingField(
                                  editingField === "experience"
                                    ? null
                                    : "experience"
                                )
                              }
                              className='w-8 h-8 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-blue-500/30 transition-all duration-200 border border-blue-300/30 shadow-lg hover:scale-110'>
                              <Edit size={12} className='text-blue-700' />
                            </button>
                          </div>
                          {/* Content */}
                          <div className='relative z-10'>
                            <div className='flex items-center gap-3 mb-6'>
                              <div className='w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-blue-300/30'>
                                <Briefcase
                                  size={24}
                                  className='text-blue-700'
                                />
                              </div>
                              <h2 className='text-2xl font-bold text-blue-800'>
                                Experience
                              </h2>
                            </div>
                            {editingField === "experience" ? (
                              <div className='space-y-4'>
                                <div className='bg-white/90 backdrop-blur-sm border border-blue-200/50 rounded-xl p-4 shadow-sm'>
                                  <h3 className='font-bold text-sm mb-3 text-blue-800'>
                                    Edit Experience
                                  </h3>
                                  <div className='space-y-3'>
                                    <input
                                      type='text'
                                      value={
                                        tempData.jobTitle ||
                                        portfolio?.jobTitle ||
                                        "Frontend Developer"
                                      }
                                      onChange={(e) =>
                                        setTempData({
                                          ...tempData,
                                          jobTitle: e.target.value,
                                        })
                                      }
                                      className='w-full text-sm bg-white/80 text-blue-800 placeholder-blue-500 border border-blue-200/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300/50'
                                      placeholder='Job Title'
                                    />
                                    <input
                                      type='text'
                                      value={
                                        tempData.company ||
                                        portfolio?.company ||
                                        "TechSoft"
                                      }
                                      onChange={(e) =>
                                        setTempData({
                                          ...tempData,
                                          company: e.target.value,
                                        })
                                      }
                                      className='w-full text-sm bg-white/80 text-blue-800 placeholder-blue-500 border border-blue-200/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300/50'
                                      placeholder='Company Name'
                                    />
                                    <input
                                      type='text'
                                      value={
                                        tempData.workPeriod ||
                                        portfolio?.workPeriod ||
                                        "Aug 2023 - Present"
                                      }
                                      onChange={(e) =>
                                        setTempData({
                                          ...tempData,
                                          workPeriod: e.target.value,
                                        })
                                      }
                                      className='w-full text-sm bg-white/80 text-blue-800 placeholder-blue-500 border border-blue-200/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300/50'
                                      placeholder='Work Period'
                                    />
                                    <input
                                      type='text'
                                      value={
                                        tempData.workLocation ||
                                        portfolio?.workLocation ||
                                        "Tashkent, Uzbekistan"
                                      }
                                      onChange={(e) =>
                                        setTempData({
                                          ...tempData,
                                          workLocation: e.target.value,
                                        })
                                      }
                                      className='w-full text-sm bg-white/80 text-blue-800 placeholder-blue-500 border border-blue-200/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300/50'
                                      placeholder='Work Location'
                                    />
                                    <div className='flex gap-2'>
                                      <button
                                        onClick={() =>
                                          handleQuickSave("experience")
                                        }
                                        className='bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition-colors'>
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setEditingField(null)}
                                        className='bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors'>
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className='space-y-4'>
                                <div className='bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-xl p-4 hover:bg-blue-50 transition-all duration-300 shadow-sm'>
                                  <h3 className='font-bold text-lg mb-2 text-blue-800'>
                                    Frontend Developer
                                  </h3>
                                  <p className='text-blue-700 font-medium text-sm mb-1'>
                                    🏢 TechSoft • Aug 2023
                                  </p>
                                  <p className='text-blue-600 text-xs'>
                                    📍 Tashkent, Uzbekistan
                                  </p>
                                </div>
                                <div className='bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-xl p-4 hover:bg-blue-50 transition-all duration-300 shadow-sm'>
                                  <h3 className='font-bold text-lg mb-2 text-blue-800'>
                                    UI/UX Designer
                                  </h3>
                                  <p className='text-blue-700 font-medium text-sm mb-1'>
                                    🎨 Design Studio • Jan 2023
                                  </p>
                                  <p className='text-blue-600 text-xs'>
                                    🌐 Remote
                                  </p>
                                </div>
                                <div className='bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-xl p-4 hover:bg-blue-50 transition-all duration-300 shadow-sm'>
                                  <h3 className='font-bold text-lg mb-2 text-blue-800'>
                                    Freelance Developer
                                  </h3>
                                  <p className='text-blue-700 font-medium text-sm mb-1'>
                                    💼 Upwork • 2022-Present
                                  </p>
                                  <p className='text-blue-600 text-xs'>
                                    🌍 Global
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </FadeInUp>

                      {/* Skills - Green Gradient */}
                      <FadeInUp delay={0.6}>
                        <div className='group relative bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 rounded-2xl p-5 shadow-lg h-full overflow-hidden border border-emerald-200/50'>
                          <div className='absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12'></div>

                          {/* Hover Edit Button */}
                          <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-20'>
                            <button
                              onClick={() =>
                                setEditingField(
                                  editingField === "skills" ? null : "skills"
                                )
                              }
                              className='w-8 h-8 bg-emerald-500/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-emerald-500/30 transition-all duration-200 border border-emerald-300/30 shadow-lg hover:scale-110'>
                              <Edit size={12} className='text-emerald-700' />
                            </button>
                          </div>

                          <div className='relative z-10'>
                            <div className='flex items-center gap-3 mb-6'>
                              <div className='w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-300/30'>
                                <svg
                                  className='w-5 h-5 text-emerald-700'
                                  fill='none'
                                  stroke='currentColor'
                                  viewBox='0 0 24 24'>
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                                  />
                                </svg>
                              </div>
                              <h2 className='text-xl font-bold text-emerald-800'>
                                Skills
                              </h2>
                            </div>

                            {editingField === "skills" ? (
                              <div className='space-y-4'>
                                <div className='bg-white/90 backdrop-blur-sm border border-emerald-200/50 rounded-xl p-4 shadow-sm'>
                                  <h3 className='font-bold text-sm mb-3 text-emerald-800'>
                                    Edit Skills
                                  </h3>
                                  <div className='space-y-3'>
                                    <textarea
                                      value={
                                        tempData.skillsDescription ||
                                        portfolio?.skillsDescription ||
                                        "Frontend: React, Next.js, TypeScript, Tailwind CSS\nBackend: Node.js, Express.js, MongoDB\nTools: Git, Docker, Vercel"
                                      }
                                      onChange={(e) =>
                                        setTempData({
                                          ...tempData,
                                          skillsDescription: e.target.value,
                                        })
                                      }
                                      className='w-full text-sm bg-white/80 text-emerald-800 placeholder-emerald-500 border border-emerald-200/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300/50 resize-none'
                                      placeholder='Describe your skills (one per line)'
                                      rows={6}
                                    />
                                    <div className='flex gap-2'>
                                      <button
                                        onClick={() =>
                                          handleQuickSave("skills")
                                        }
                                        className='bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition-colors'>
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setEditingField(null)}
                                        className='bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors'>
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className='space-y-4'>
                                {/* Frontend Skills */}
                                <div className='bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/50 shadow-sm'>
                                  <h3 className='text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2'>
                                    <span className='w-2 h-2 bg-emerald-500 rounded-full'></span>
                                    Frontend Development
                                  </h3>
                                  <div className='grid grid-cols-2 gap-3'>
                                    <div className='flex items-center gap-3 p-2 bg-emerald-50 rounded-lg border border-emerald-100'>
                                      <div className='w-8 h-8 flex items-center justify-center'>
                                        <svg
                                          viewBox='0 0 24 24'
                                          className='w-6 h-6'
                                          fill='#61DAFB'>
                                          <circle cx='12' cy='12' r='2' />
                                          <path d='M12,1C18.5,1 24,6.5 24,12C24,17.5 18.5,23 12,23C5.5,23 0,17.5 0,12C0,6.5 5.5,1 12,1M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M7.5,18C8,17.5 8.5,17 9,16.5C10,15.5 11,14.5 12,13.5C13,14.5 14,15.5 15,16.5C15.5,17 16,17.5 16.5,18C14.5,19.5 10.5,19.5 7.5,18M16.5,6C16,6.5 15.5,7 15,7.5C14,8.5 13,9.5 12,10.5C11,9.5 10,8.5 9,7.5C8.5,7 8,6.5 7.5,6C10.5,4.5 14.5,4.5 16.5,6M6,7.5C6.5,8 7,8.5 7.5,9C8.5,10 9.5,11 10.5,12C9.5,13 8.5,14 7.5,15C7,15.5 6.5,16 6,16.5C4.5,14.5 4.5,10.5 6,7.5M18,16.5C17.5,16 17,15.5 16.5,15C15.5,14 14.5,13 13.5,12C14.5,11 15.5,10 16.5,9C17,8.5 17.5,8 18,7.5C19.5,10.5 19.5,14.5 18,16.5Z' />
                                        </svg>
                                      </div>
                                      <span className='text-sm font-medium text-emerald-800'>
                                        React
                                      </span>
                                    </div>
                                    <div className='flex items-center gap-3 p-2 bg-emerald-50 rounded-lg border border-emerald-100'>
                                      <div className='w-8 h-8 flex items-center justify-center'>
                                        <svg
                                          viewBox='0 0 24 24'
                                          className='w-6 h-6'
                                          fill='#000000'>
                                          <path d='M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747C19.146 4.318 16.956 1.669 13.94.394 13.114.134 12.208.026 11.572 0z' />
                                        </svg>
                                      </div>
                                      <span className='text-sm font-medium text-emerald-800'>
                                        Next.js
                                      </span>
                                    </div>
                                    <div className='flex items-center gap-3 p-2 bg-emerald-50 rounded-lg border border-emerald-100'>
                                      <div className='w-8 h-8 flex items-center justify-center'>
                                        <svg
                                          viewBox='0 0 24 24'
                                          className='w-6 h-6'
                                          fill='#06B6D4'>
                                          <path d='M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C7.666,17.818,9.027,19.2,12.001,19.2c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z' />
                                        </svg>
                                      </div>
                                      <span className='text-sm font-medium text-emerald-800'>
                                        Tailwind CSS
                                      </span>
                                    </div>
                                    <div className='flex items-center gap-3 p-2 bg-emerald-50 rounded-lg border border-emerald-100'>
                                      <div className='w-8 h-8 flex items-center justify-center'>
                                        <svg
                                          viewBox='0 0 24 24'
                                          className='w-6 h-6'
                                          fill='#3178C6'>
                                          <path d='M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z' />
                                        </svg>
                                      </div>
                                      <span className='text-sm font-medium text-emerald-800'>
                                        TypeScript
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Backend Skills */}
                                <div className='bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/50 shadow-sm'>
                                  <h3 className='text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2'>
                                    <span className='w-2 h-2 bg-emerald-500 rounded-full'></span>
                                    Backend Development
                                  </h3>
                                  <div className='flex flex-wrap gap-2'>
                                    <span className='px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200'>
                                      Node.js
                                    </span>
                                    <span className='px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200'>
                                      Express.js
                                    </span>
                                    <span className='px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200'>
                                      MongoDB
                                    </span>
                                    <span className='px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200'>
                                      REST API
                                    </span>
                                  </div>
                                </div>

                                {/* Tools & Technologies */}
                                <div className='bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/50 shadow-sm'>
                                  <h3 className='text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2'>
                                    <span className='w-2 h-2 bg-emerald-500 rounded-full'></span>
                                    Tools & Technologies
                                  </h3>
                                  <div className='flex flex-wrap gap-2'>
                                    <span className='px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200'>
                                      Git & GitHub
                                    </span>
                                    <span className='px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200'>
                                      Docker
                                    </span>
                                    <span className='px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200'>
                                      Vercel
                                    </span>
                                    <span className='px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200'>
                                      PWA
                                    </span>
                                    <span className='px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200'>
                                      JavaScript
                                    </span>
                                    <span className='px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200'>
                                      HTML5/CSS3
                                    </span>
                                  </div>
                                </div>

                                <div className='mt-4 text-center'>
                                  <p className='text-xs text-emerald-600 font-medium'>
                                    🚀 Constantly learning and improving skills
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </FadeInUp>

                      {/* Expertise - Red Gradient */}
                      <FadeInUp delay={0.7}>
                        <div className='group relative bg-gradient-to-br from-red-50 via-pink-50 to-rose-100 rounded-2xl p-5 shadow-lg h-full overflow-hidden border border-red-200/50'>
                          <div className='absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 -translate-x-10'></div>

                          {/* Hover Edit Button */}
                          <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-20'>
                            <button
                              onClick={() => {
                                setEditingField("expertise");
                                setShowEditModal(true);
                                setEditingPortfolio({
                                  field: "expertise",
                                  title: "Edit Expertise",
                                  data: portfolio?.expertise || {},
                                });
                              }}
                              className='w-8 h-8 bg-red-500/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-500/30 transition-all duration-200 border border-red-300/30 shadow-lg hover:scale-110'>
                              <Edit size={12} className='text-red-700' />
                            </button>
                          </div>

                          <div className='relative z-10'>
                            <div className='flex items-center gap-3 mb-6'>
                              <div className='w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-300/30'>
                                <svg
                                  className='w-5 h-5 text-red-700'
                                  fill='none'
                                  stroke='currentColor'
                                  viewBox='0 0 24 24'>
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                                  />
                                </svg>
                              </div>
                              <h2 className='text-xl font-bold text-red-800'>
                                Expertise
                              </h2>
                            </div>
                            <div className='space-y-4'>
                              <div>
                                <div className='flex justify-between mb-2'>
                                  <span className='text-sm font-medium text-red-800'>
                                    Frontend Development
                                  </span>
                                  <span className='text-sm font-bold text-red-800'>
                                    90%
                                  </span>
                                </div>
                                <div className='w-full bg-red-200/50 rounded-full h-2'>
                                  <div
                                    className='bg-red-500 h-2 rounded-full transition-all duration-1000'
                                    style={{ width: "90%" }}></div>
                                </div>
                              </div>
                              <div>
                                <div className='flex justify-between mb-2'>
                                  <span className='text-sm font-medium text-red-800'>
                                    Backend Development
                                  </span>
                                  <span className='text-sm font-bold text-red-800'>
                                    85%
                                  </span>
                                </div>
                                <div className='w-full bg-red-200/50 rounded-full h-2'>
                                  <div
                                    className='bg-red-500 h-2 rounded-full transition-all duration-1000'
                                    style={{ width: "85%" }}></div>
                                </div>
                              </div>
                              <div>
                                <div className='flex justify-between mb-2'>
                                  <span className='text-sm font-medium text-red-800'>
                                    UI/UX Design
                                  </span>
                                  <span className='text-sm font-bold text-red-800'>
                                    80%
                                  </span>
                                </div>
                                <div className='w-full bg-red-200/50 rounded-full h-2'>
                                  <div
                                    className='bg-red-500 h-2 rounded-full transition-all duration-1000'
                                    style={{ width: "80%" }}></div>
                                </div>
                              </div>
                              <div>
                                <div className='flex justify-between mb-2'>
                                  <span className='text-sm font-medium text-red-800'>
                                    Mobile Development
                                  </span>
                                  <span className='text-sm font-bold text-red-800'>
                                    75%
                                  </span>
                                </div>
                                <div className='w-full bg-red-200/50 rounded-full h-2'>
                                  <div
                                    className='bg-red-500 h-2 rounded-full transition-all duration-1000'
                                    style={{ width: "75%" }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </FadeInUp>
                    </div>

                    {/* Bottom Section - 3 Columns */}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                      {/* References - Purple Gradient */}
                      <FadeInUp delay={1.1}>
                        <div className='group relative bg-gradient-to-br from-purple-100 via-purple-200 to-indigo-200 rounded-2xl p-5 shadow-lg h-full overflow-hidden border border-purple-200/50'>
                          <div className='absolute top-0 left-0 w-18 h-18 bg-white/10 rounded-full -translate-y-9 -translate-x-9'></div>

                          {/* Hover Edit Button */}
                          <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-20'>
                            <button
                              onClick={() => {
                                setEditingField("references");
                                setShowEditModal(true);
                                setEditingPortfolio({
                                  field: "references",
                                  title: "Edit References",
                                  data: portfolio?.references || {},
                                });
                              }}
                              className='w-8 h-8 bg-purple-500/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-purple-500/30 transition-all duration-200 border border-purple-300/30 shadow-lg hover:scale-110'>
                              <Edit size={12} className='text-purple-700' />
                            </button>
                          </div>

                          <div className='relative z-10'>
                            <div className='flex items-center gap-3 mb-6'>
                              <div className='w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-300/30'>
                                <svg
                                  className='w-5 h-5 text-purple-700'
                                  fill='none'
                                  stroke='currentColor'
                                  viewBox='0 0 24 24'>
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                                  />
                                </svg>
                              </div>
                              <h2 className='text-xl font-bold text-purple-800'>
                                References
                              </h2>
                            </div>
                            <div className='space-y-3'>
                              <div className='bg-white/80 backdrop-blur-sm border border-purple-200/50 rounded-xl p-4 shadow-sm'>
                                <h3 className='font-bold text-base mb-2 text-purple-800'>
                                  John Smith
                                </h3>
                                <p className='text-sm text-purple-700 font-medium mb-1'>
                                  Senior Developer at TechSoft
                                </p>
                                <p className='text-xs text-purple-600 mb-1'>
                                  📞 +998 90 123 45 67
                                </p>
                                <p className='text-xs text-purple-600'>
                                  ✉️ john@techsoft.com
                                </p>
                              </div>
                              <div className='bg-white/80 backdrop-blur-sm border border-purple-200/50 rounded-xl p-4 shadow-sm'>
                                <h3 className='font-bold text-base mb-2 text-purple-800'>
                                  Sarah Johnson
                                </h3>
                                <p className='text-sm text-purple-700 font-medium mb-1'>
                                  UI/UX Lead at Design Studio
                                </p>
                                <p className='text-xs text-purple-600 mb-1'>
                                  📞 +998 90 987 65 43
                                </p>
                                <p className='text-xs text-purple-600'>
                                  ✉️ sarah@designstudio.com
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </FadeInUp>

                      {/* Skills & Achievements - Green Gradient */}
                      <FadeInUp delay={1.2}>
                        <div className='group relative bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 rounded-2xl p-5 shadow-lg h-full overflow-hidden border border-emerald-200/50'>
                          <div className='absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full translate-y-[-10px] translate-x-[10px]'></div>

                          {/* Hover Edit Button */}
                          <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-20'>
                            <button
                              onClick={() => {
                                setEditingField("achievements");
                                setShowEditModal(true);
                                setEditingPortfolio({
                                  field: "achievements",
                                  title: "Edit Skills & Achievements",
                                  data: portfolio?.achievements || {},
                                });
                              }}
                              className='w-8 h-8 bg-emerald-500/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-emerald-500/30 transition-all duration-200 border border-emerald-300/30 shadow-lg hover:scale-110'>
                              <Edit size={12} className='text-emerald-700' />
                            </button>
                          </div>

                          <div className='relative z-10'>
                            <div className='flex items-center gap-3 mb-6'>
                              <div className='w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-300/30'>
                                <svg
                                  className='w-5 h-5 text-emerald-700'
                                  fill='none'
                                  stroke='currentColor'
                                  viewBox='0 0 24 24'>
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                                  />
                                </svg>
                              </div>
                              <h2 className='text-xl font-bold text-emerald-800'>
                                Skills & Achievements
                              </h2>
                            </div>

                            <div className='space-y-4'>
                              {/* Top Skills */}
                              <div className='bg-white/80 backdrop-blur-sm border border-emerald-200/50 rounded-xl p-4 shadow-sm'>
                                <h3 className='font-bold text-sm mb-3 text-emerald-800'>
                                  🚀 Top Skills
                                </h3>
                                <div className='flex flex-wrap gap-2'>
                                  <span className='px-2 py-1 bg-emerald-100 rounded-lg text-xs font-medium text-emerald-700 border border-emerald-200'>
                                    React.js
                                  </span>
                                  <span className='px-2 py-1 bg-emerald-100 rounded-lg text-xs font-medium text-emerald-700 border border-emerald-200'>
                                    Node.js
                                  </span>
                                  <span className='px-2 py-1 bg-emerald-100 rounded-lg text-xs font-medium text-emerald-700 border border-emerald-200'>
                                    Python
                                  </span>
                                  <span className='px-2 py-1 bg-emerald-100 rounded-lg text-xs font-medium text-emerald-700 border border-emerald-200'>
                                    MongoDB
                                  </span>
                                </div>
                              </div>

                              {/* Achievements */}
                              <div className='bg-white/80 backdrop-blur-sm border border-emerald-200/50 rounded-xl p-4 shadow-sm'>
                                <h3 className='font-bold text-sm mb-3 text-emerald-800'>
                                  🏆 Recent Achievements
                                </h3>
                                <div className='space-y-2'>
                                  <div className='flex items-center gap-2'>
                                    <div className='w-2 h-2 bg-emerald-500 rounded-full'></div>
                                    <span className='text-xs text-emerald-700'>
                                      Completed 25+ Projects
                                    </span>
                                  </div>
                                  <div className='flex items-center gap-2'>
                                    <div className='w-2 h-2 bg-emerald-500 rounded-full'></div>
                                    <span className='text-xs text-emerald-700'>
                                      5-Star Rating Average
                                    </span>
                                  </div>
                                  <div className='flex items-center gap-2'>
                                    <div className='w-2 h-2 bg-emerald-500 rounded-full'></div>
                                    <span className='text-xs text-emerald-700'>
                                      Top 10% Developer
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Experience Level */}
                              <div className='bg-white/80 backdrop-blur-sm border border-emerald-200/50 rounded-xl p-3 text-center shadow-sm'>
                                <div className='text-lg font-bold text-emerald-800 mb-1'>
                                  3+ Years
                                </div>
                                <div className='text-xs text-emerald-600'>
                                  Professional Experience
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </FadeInUp>

                      {/* Portfolio Stats - Blue Gradient */}
                      <FadeInUp delay={1.3}>
                        <div className='group relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 rounded-2xl p-5 shadow-lg overflow-hidden h-full border border-blue-200/50'>
                          {/* Background Pattern */}
                          <div className='absolute inset-0 bg-white/10 backdrop-blur-sm'></div>
                          <div className='absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16'></div>
                          <div className='absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12'></div>

                          {/* Hover Edit Button */}
                          <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-20'>
                            <button
                              onClick={() => {
                                setEditingField("stats");
                                setShowEditModal(true);
                                setEditingPortfolio({
                                  field: "stats",
                                  title: "Edit Portfolio Stats",
                                  data: portfolio?.stats || {},
                                });
                              }}
                              className='w-8 h-8 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-blue-500/30 transition-all duration-200 border border-blue-300/30 shadow-lg hover:scale-110'>
                              <Edit size={12} className='text-blue-700' />
                            </button>
                          </div>

                          {/* Content */}
                          <div className='relative z-10'>
                            <div className='flex items-center gap-3 mb-6'>
                              <div className='w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-blue-300/30'>
                                <TrendingUp
                                  size={24}
                                  className='text-blue-700'
                                />
                              </div>
                              <h2 className='text-2xl font-bold text-blue-800'>
                                Portfolio Stats
                              </h2>
                            </div>

                            <div className='space-y-6'>
                              {/* Main Stat */}
                              <div className='text-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 shadow-sm'>
                                <div className='text-5xl font-black text-blue-800 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
                                  15K+
                                </div>
                                <div className='text-xl font-bold text-blue-700 mb-2'>
                                  Profile Views
                                </div>
                                <div className='text-sm text-blue-600 font-medium'>
                                  🚀 Featured Projects
                                </div>
                              </div>

                              {/* Secondary Stats */}
                              <div className='grid grid-cols-2 gap-4'>
                                <div className='text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200/50 shadow-sm'>
                                  <div className='text-2xl font-bold text-blue-800 mb-1'>
                                    98%
                                  </div>
                                  <div className='text-xs text-blue-600'>
                                    Success Rate
                                  </div>
                                </div>
                                <div className='text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200/50 shadow-sm'>
                                  <div className='text-2xl font-bold text-blue-800 mb-1'>
                                    24/7
                                  </div>
                                  <div className='text-xs text-blue-600'>
                                    Available
                                  </div>
                                </div>
                              </div>

                              {/* Website Link */}
                              <div className='flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-xl p-3 hover:bg-blue-50 transition-all duration-300 shadow-sm'>
                                <svg
                                  className='w-5 h-5 text-emerald-600'
                                  fill='currentColor'
                                  viewBox='0 0 24 24'>
                                  <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
                                </svg>
                                <span className='text-sm font-semibold text-blue-700'>
                                  www.fraijob.com/profile
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </FadeInUp>
                    </div>
                  </>
                )}

                {/* Universal Edit Modal */}
                {showEditModal && (
                  <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
                    <div className='bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl'>
                      <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-lg font-bold text-gray-800'>
                          {editingPortfolio.title}
                        </h3>
                        <button
                          onClick={() => {
                            setShowEditModal(false);
                            setEditingField(null);
                            setEditingPortfolio({});
                          }}
                          className='w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors'>
                          <svg
                            className='w-4 h-4 text-gray-600'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'>
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M6 18L18 6M6 6l12 12'
                            />
                          </svg>
                        </button>
                      </div>

                      <div className='space-y-4'>
                        {editingPortfolio.field === "expertise" && (
                          <div className='space-y-3'>
                            <label className='block text-sm font-medium text-gray-700'>
                              Frontend Development (%)
                            </label>
                            <input
                              type='number'
                              min='0'
                              max='100'
                              value={tempData.frontendSkill || 90}
                              onChange={(e) =>
                                setTempData({
                                  ...tempData,
                                  frontendSkill: e.target.value,
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                            <label className='block text-sm font-medium text-gray-700'>
                              Backend Development (%)
                            </label>
                            <input
                              type='number'
                              min='0'
                              max='100'
                              value={tempData.backendSkill || 85}
                              onChange={(e) =>
                                setTempData({
                                  ...tempData,
                                  backendSkill: e.target.value,
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                            <label className='block text-sm font-medium text-gray-700'>
                              UI/UX Design (%)
                            </label>
                            <input
                              type='number'
                              min='0'
                              max='100'
                              value={tempData.designSkill || 80}
                              onChange={(e) =>
                                setTempData({
                                  ...tempData,
                                  designSkill: e.target.value,
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                            <label className='block text-sm font-medium text-gray-700'>
                              Mobile Development (%)
                            </label>
                            <input
                              type='number'
                              min='0'
                              max='100'
                              value={tempData.mobileSkill || 75}
                              onChange={(e) =>
                                setTempData({
                                  ...tempData,
                                  mobileSkill: e.target.value,
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                          </div>
                        )}

                        {editingPortfolio.field === "references" && (
                          <div className='space-y-3'>
                            <label className='block text-sm font-medium text-gray-700'>
                              Reference Name
                            </label>
                            <input
                              type='text'
                              value={tempData.referenceName || "John Smith"}
                              onChange={(e) =>
                                setTempData({
                                  ...tempData,
                                  referenceName: e.target.value,
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                              placeholder='Reference Name'
                            />
                            <label className='block text-sm font-medium text-gray-700'>
                              Position
                            </label>
                            <input
                              type='text'
                              value={
                                tempData.referencePosition || "Senior Developer"
                              }
                              onChange={(e) =>
                                setTempData({
                                  ...tempData,
                                  referencePosition: e.target.value,
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                              placeholder='Position'
                            />
                            <label className='block text-sm font-medium text-gray-700'>
                              Company
                            </label>
                            <input
                              type='text'
                              value={tempData.referenceCompany || "TechCorp"}
                              onChange={(e) =>
                                setTempData({
                                  ...tempData,
                                  referenceCompany: e.target.value,
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                              placeholder='Company'
                            />
                            <label className='block text-sm font-medium text-gray-700'>
                              Contact
                            </label>
                            <input
                              type='text'
                              value={
                                tempData.referenceContact || "john@techcorp.com"
                              }
                              onChange={(e) =>
                                setTempData({
                                  ...tempData,
                                  referenceContact: e.target.value,
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                              placeholder='Email or Phone'
                            />
                          </div>
                        )}

                        {editingPortfolio.field === "achievements" && (
                          <div className='space-y-3'>
                            <label className='block text-sm font-medium text-gray-700'>
                              Achievement Title
                            </label>
                            <input
                              type='text'
                              value={
                                tempData.achievementTitle ||
                                "Best Developer Award"
                              }
                              onChange={(e) =>
                                setTempData({
                                  ...tempData,
                                  achievementTitle: e.target.value,
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                              placeholder='Achievement Title'
                            />
                            <label className='block text-sm font-medium text-gray-700'>
                              Description
                            </label>
                            <textarea
                              value={
                                tempData.achievementDescription ||
                                "Recognized for outstanding performance in web development"
                              }
                              onChange={(e) =>
                                setTempData({
                                  ...tempData,
                                  achievementDescription: e.target.value,
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                              placeholder='Achievement Description'
                              rows={3}
                            />
                            <label className='block text-sm font-medium text-gray-700'>
                              Year
                            </label>
                            <input
                              type='text'
                              value={tempData.achievementYear || "2024"}
                              onChange={(e) =>
                                setTempData({
                                  ...tempData,
                                  achievementYear: e.target.value,
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                              placeholder='Year'
                            />
                          </div>
                        )}

                        {editingPortfolio.field === "stats" && (
                          <div className='space-y-3'>
                            <label className='block text-sm font-medium text-gray-700'>
                              Projects Completed
                            </label>
                            <input
                              type='number'
                              value={tempData.projectsCompleted || 25}
                              onChange={(e) =>
                                setTempData({
                                  ...tempData,
                                  projectsCompleted: e.target.value,
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                            <label className='block text-sm font-medium text-gray-700'>
                              Happy Clients
                            </label>
                            <input
                              type='number'
                              value={tempData.happyClients || 15}
                              onChange={(e) =>
                                setTempData({
                                  ...tempData,
                                  happyClients: e.target.value,
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                            <label className='block text-sm font-medium text-gray-700'>
                              Years Experience
                            </label>
                            <input
                              type='number'
                              value={tempData.yearsExperience || 3}
                              onChange={(e) =>
                                setTempData({
                                  ...tempData,
                                  yearsExperience: e.target.value,
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                            <label className='block text-sm font-medium text-gray-700'>
                              Awards Won
                            </label>
                            <input
                              type='number'
                              value={tempData.awardsWon || 5}
                              onChange={(e) =>
                                setTempData({
                                  ...tempData,
                                  awardsWon: e.target.value,
                                })
                              }
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                          </div>
                        )}
                      </div>

                      <div className='flex gap-3 mt-6'>
                        <button
                          onClick={() => {
                            handleQuickSave(editingPortfolio.field);
                            setShowEditModal(false);
                          }}
                          className='flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium'>
                          Save Changes
                        </button>
                        <button
                          onClick={() => {
                            setShowEditModal(false);
                            setEditingField(null);
                            setEditingPortfolio({});
                            setTempData({});
                          }}
                          className='flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium'>
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {active === "Jobs" && (
              <motion.div
                key='jobs'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className='space-y-6'>
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                  <h2 className='text-xl md:text-2xl font-bold text-gray-800'>
                    Available Jobs
                  </h2>
                  <div className='flex gap-2 md:gap-3'>
                    <button
                      onClick={() => setShowApplications(!showApplications)}
                      className='bg-blue-500 text-white px-3 md:px-4 py-2 rounded-xl font-medium hover:bg-blue-600 transition-all duration-300 flex items-center gap-1 md:gap-2 text-sm md:text-base'>
                      <Briefcase className='w-4 h-4 md:w-4 md:h-4' />
                      <span className='hidden sm:inline'>
                        {showApplications ? "View Jobs" : "My Applications"}
                      </span>
                      <span className='sm:hidden'>
                        {showApplications ? "Jobs" : "Apps"}
                      </span>
                    </button>
                  </div>
                </div>

                {showApplications ? (
                  // Job Applications View
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                      My Job Applications ({jobApplications.length})
                    </h3>
                    {jobApplications.length === 0 ? (
                      <div className='text-center py-12'>
                        <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                          <Briefcase className='w-8 h-8 text-white' />
                        </div>
                        <p className='text-gray-500 text-lg font-medium'>
                          No job applications yet
                        </p>
                        <p className='text-gray-400 text-sm'>
                          Apply for jobs to see your applications here
                        </p>
                      </div>
                    ) : (
                      <div className='space-y-4'>
                        {jobApplications.map((application, index) => (
                          <FadeInUp key={application.id} delay={index * 0.1}>
                            <div className='bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300'>
                              <div className='flex items-center justify-between'>
                                <div className='flex-1'>
                                  <h3 className='text-lg font-semibold text-gray-800'>
                                    {application.job.title}
                                  </h3>
                                  <p className='text-gray-600'>
                                    {application.job.company}
                                  </p>
                                  <div className='flex items-center gap-4 mt-2'>
                                    <p className='text-sm text-gray-500'>
                                      {application.job.salary}
                                    </p>
                                    <p className='text-sm text-gray-500'>
                                      {application.job.location}
                                    </p>
                                    <p className='text-sm text-gray-500'>
                                      {application.job.type}
                                    </p>
                                  </div>
                                  <p className='text-xs text-gray-400 mt-2'>
                                    Applied:{" "}
                                    {new Date(
                                      application.appliedAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className='flex items-center gap-3'>
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      application.status === "Applied"
                                        ? "bg-blue-100 text-blue-700"
                                        : application.status === "Interview"
                                          ? "bg-green-100 text-green-700"
                                          : application.status === "Rejected"
                                            ? "bg-red-100 text-red-700"
                                            : application.status === "Accepted"
                                              ? "bg-green-100 text-green-700"
                                              : "bg-gray-100 text-gray-700"
                                    }`}>
                                    {application.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </FadeInUp>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Available Jobs View
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                      Available Jobs ({jobs.length})
                    </h3>
                    {loadingJobs ? (
                      <div className='flex items-center justify-center py-20'>
                        <div className='animate-spin w-8 h-8 border-4 border-[#10B981] border-t-transparent rounded-full'></div>
                      </div>
                    ) : jobs.length === 0 ? (
                      <div className='text-center py-12'>
                        <div className='w-16 h-16 bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-full flex items-center justify-center mx-auto mb-4'>
                          <Briefcase className='w-8 h-8 text-white' />
                        </div>
                        <p className='text-gray-500 text-lg font-medium'>
                          No jobs available
                        </p>
                        <p className='text-gray-400 text-sm'>
                          Check back later for new opportunities
                        </p>
                      </div>
                    ) : (
                      <div className='space-y-4'>
                        {jobs.map((job, index) => (
                          <FadeInUp key={job.id} delay={index * 0.1}>
                            <div className='bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300'>
                              <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                                <div className='flex-1'>
                                  <h3 className='text-base md:text-lg font-semibold text-gray-800'>
                                    {job.title}
                                  </h3>
                                  <p className='text-sm md:text-base text-gray-600'>
                                    {job.company}
                                  </p>
                                  <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2'>
                                    <p className='text-xs md:text-sm text-gray-500'>
                                      {job.salary}
                                    </p>
                                    <p className='text-xs md:text-sm text-gray-500'>
                                      {job.location}
                                    </p>
                                    <p className='text-xs md:text-sm text-gray-500'>
                                      {job.type}
                                    </p>
                                  </div>
                                  {job.description && (
                                    <p className='text-xs md:text-sm text-gray-600 mt-2'>
                                      {job.description}
                                    </p>
                                  )}
                                </div>
                                <div className='flex items-center gap-2 md:gap-3 mt-4 md:mt-0'>
                                  <button
                                    onClick={async () => {
                                      try {
                                        const token =
                                          localStorage.getItem("token");
                                        const response = await fetch(
                                          "/api/jobs",
                                          {
                                            method: "POST",
                                            headers: {
                                              "Content-Type":
                                                "application/json",
                                              Authorization: `Bearer ${token}`,
                                            },
                                            body: JSON.stringify({
                                              jobId: job.id,
                                              coverLetter:
                                                "I'm interested in this position and would love to discuss how I can contribute to your team.",
                                            }),
                                          }
                                        );

                                        if (response.ok) {
                                          const result = await response.json();
                                          // Add notification
                                          setNotifications((prev) => [
                                            ...prev,
                                            {
                                              id: Date.now(),
                                              type: "success",
                                              message:
                                                "Job application submitted successfully!",
                                              time: "Just now",
                                            },
                                          ]);
                                          // Refresh job applications
                                          const applicationsResponse =
                                            await fetch(
                                              "/api/job-applications",
                                              {
                                                headers: {
                                                  Authorization: `Bearer ${token}`,
                                                },
                                              }
                                            );
                                          if (applicationsResponse.ok) {
                                            const applicationsData =
                                              await applicationsResponse.json();
                                            setJobApplications(
                                              applicationsData
                                            );
                                          }
                                        } else {
                                          const error = await response.json();
                                          setNotifications((prev) => [
                                            ...prev,
                                            {
                                              id: Date.now(),
                                              type: "error",
                                              message:
                                                error.error ||
                                                "Failed to apply for job",
                                              time: "Just now",
                                            },
                                          ]);
                                        }
                                      } catch (error) {
                                        console.error(
                                          "Error applying for job:",
                                          error
                                        );
                                        setNotifications((prev) => [
                                          ...prev,
                                          {
                                            id: Date.now(),
                                            type: "error",
                                            message: "Failed to apply for job",
                                            time: "Just now",
                                          },
                                        ]);
                                      }
                                    }}
                                    className='bg-gradient-to-r from-[#10B981] to-[#34D399] text-white px-3 md:px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row items-center gap-1 md:gap-2 text-xs md:text-sm'>
                                    <Briefcase className='w-4 h-4 md:w-4 md:h-4' />
                                    <span>Apply</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </FadeInUp>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {active === "Freelance" && (
              <motion.div
                key='freelance'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className='space-y-6'>
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                  <h2 className='text-xl md:text-2xl font-bold text-gray-800'>
                    Freelance Projects
                  </h2>
                  <div className='flex gap-2 md:gap-3'>
                    <button
                      onClick={() => setShowProposals(!showProposals)}
                      className='bg-purple-500 text-white px-3 md:px-4 py-2 rounded-xl font-medium hover:bg-purple-600 transition-all duration-300 flex items-center gap-1 md:gap-2 text-sm md:text-base'>
                      <Users className='w-4 h-4 md:w-4 md:h-4' />
                      <span className='hidden sm:inline'>
                        {showProposals ? "View Projects" : "My Proposals"}
                      </span>
                      <span className='sm:hidden'>
                        {showProposals ? "Projects" : "Proposals"}
                      </span>
                    </button>
                  </div>
                </div>

                {showProposals ? (
                  // Project Proposals View
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                      My Project Proposals ({projectProposals.length})
                    </h3>
                    {projectProposals.length === 0 ? (
                      <div className='text-center py-12'>
                        <div className='w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                          <Users className='w-8 h-8 text-white' />
                        </div>
                        <p className='text-gray-500 text-lg font-medium'>
                          No proposals submitted yet
                        </p>
                        <p className='text-gray-400 text-sm'>
                          Submit proposals to projects to see them here
                        </p>
                      </div>
                    ) : (
                      <div className='space-y-4'>
                        {projectProposals.map((proposal, index) => (
                          <FadeInUp key={proposal.id} delay={index * 0.1}>
                            <div className='bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300'>
                              <div className='flex items-center justify-between'>
                                <div className='flex-1'>
                                  <h3 className='text-lg font-semibold text-gray-800'>
                                    {proposal.project.title}
                                  </h3>
                                  <p className='text-gray-600'>
                                    Client:{" "}
                                    {proposal.project.client.name ||
                                      proposal.project.client.email}
                                  </p>
                                  <div className='flex items-center gap-4 mt-2'>
                                    <p className='text-sm text-gray-500'>
                                      My Bid: {proposal.proposedBudget}
                                    </p>
                                    <p className='text-sm text-gray-500'>
                                      Delivery: {proposal.deliveryTime}
                                    </p>
                                    <p className='text-sm text-gray-500'>
                                      Category: {proposal.project.category}
                                    </p>
                                  </div>
                                  <p className='text-xs text-gray-400 mt-2'>
                                    Submitted:{" "}
                                    {new Date(
                                      proposal.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className='flex items-center gap-3'>
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      proposal.status === "pending"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : proposal.status === "accepted"
                                          ? "bg-green-100 text-green-700"
                                          : proposal.status === "rejected"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-gray-100 text-gray-700"
                                    }`}>
                                    {proposal.status.charAt(0).toUpperCase() +
                                      proposal.status.slice(1)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </FadeInUp>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Available Projects View
                  <div className='space-y-4'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                      Available Projects ({projects.length})
                    </h3>
                    {loadingProjects ? (
                      <div className='flex items-center justify-center py-20'>
                        <div className='animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full'></div>
                      </div>
                    ) : projects.length === 0 ? (
                      <div className='text-center py-12'>
                        <div className='w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                          <Users className='w-8 h-8 text-white' />
                        </div>
                        <p className='text-gray-500 text-lg font-medium'>
                          No projects available
                        </p>
                        <p className='text-gray-400 text-sm'>
                          Check back later for new projects
                        </p>
                      </div>
                    ) : (
                      <div className='space-y-4'>
                        {projects.map((project, index) => (
                          <FadeInUp key={project.id} delay={index * 0.1}>
                            <div className='bg-white/80 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300'>
                              <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                                <div className='flex-1'>
                                  <h3 className='text-base md:text-lg font-semibold text-gray-800'>
                                    {project.title}
                                  </h3>
                                  <p className='text-sm md:text-base text-gray-600'>
                                    Client:{" "}
                                    {project.client.name ||
                                      project.client.email}
                                  </p>
                                  <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2'>
                                    <p className='text-xs md:text-sm text-gray-500'>
                                      Budget: {project.budget}
                                    </p>
                                    <p className='text-xs md:text-sm text-gray-500'>
                                      Category: {project.category}
                                    </p>
                                    <p className='text-xs md:text-sm text-gray-500'>
                                      Duration: {project.duration}
                                    </p>
                                  </div>
                                  <p className='text-xs md:text-sm text-gray-600 mt-2 line-clamp-2'>
                                    {project.description}
                                  </p>
                                  {project.skills &&
                                    project.skills.length > 0 && (
                                      <div className='flex flex-wrap gap-2 mt-3'>
                                        {project.skills
                                          .slice(0, 4)
                                          .map((skill, skillIndex) => (
                                            <span
                                              key={skillIndex}
                                              className='px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-lg'>
                                              {skill}
                                            </span>
                                          ))}
                                        {project.skills.length > 4 && (
                                          <span className='px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg'>
                                            +{project.skills.length - 4} more
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  <p className='text-xs text-gray-400 mt-2'>
                                    Posted:{" "}
                                    {new Date(
                                      project.createdAt
                                    ).toLocaleDateString()}{" "}
                                    •{project._count?.proposals || 0} proposals
                                  </p>
                                </div>
                                <div className='flex items-center gap-2 md:gap-3 mt-4 md:mt-0'>
                                  <button
                                    onClick={async () => {
                                      // Simple proposal submission for demo
                                      const coverLetter = prompt(
                                        "Enter your cover letter:"
                                      );
                                      const proposedBudget = prompt(
                                        "Enter your proposed budget:"
                                      );
                                      const deliveryTime = prompt(
                                        "Enter delivery time (e.g., '1 week'):"
                                      );

                                      if (
                                        coverLetter &&
                                        proposedBudget &&
                                        deliveryTime
                                      ) {
                                        try {
                                          const token =
                                            localStorage.getItem("token");
                                          const response = await fetch(
                                            "/api/project-proposals",
                                            {
                                              method: "POST",
                                              headers: {
                                                "Content-Type":
                                                  "application/json",
                                                Authorization: `Bearer ${token}`,
                                              },
                                              body: JSON.stringify({
                                                projectId: project.id,
                                                coverLetter,
                                                proposedBudget,
                                                deliveryTime,
                                              }),
                                            }
                                          );

                                          if (response.ok) {
                                            setNotifications((prev) => [
                                              ...prev,
                                              {
                                                id: Date.now(),
                                                type: "success",
                                                message:
                                                  "Proposal submitted successfully!",
                                                time: "Just now",
                                              },
                                            ]);
                                            // Refresh proposals
                                            const proposalsResponse =
                                              await fetch(
                                                "/api/project-proposals",
                                                {
                                                  headers: {
                                                    Authorization: `Bearer ${token}`,
                                                  },
                                                }
                                              );
                                            if (proposalsResponse.ok) {
                                              const proposalsData =
                                                await proposalsResponse.json();
                                              setProjectProposals(
                                                proposalsData
                                              );
                                            }
                                          } else {
                                            const error = await response.json();
                                            setNotifications((prev) => [
                                              ...prev,
                                              {
                                                id: Date.now(),
                                                type: "error",
                                                message:
                                                  error.error ||
                                                  "Failed to submit proposal",
                                                time: "Just now",
                                              },
                                            ]);
                                          }
                                        } catch (error) {
                                          console.error(
                                            "Error submitting proposal:",
                                            error
                                          );
                                          setNotifications((prev) => [
                                            ...prev,
                                            {
                                              id: Date.now(),
                                              type: "error",
                                              message:
                                                "Failed to submit proposal",
                                              time: "Just now",
                                            },
                                          ]);
                                        }
                                      }
                                    }}
                                    className='bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 md:px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row items-center gap-1 md:gap-2 text-xs md:text-sm'>
                                    <Users className='w-4 h-4 md:w-4 md:h-4' />
                                    <span>Submit Proposal</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </FadeInUp>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {active === "Test" && !isTestActive && (
              <motion.div
                key='test'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className='space-y-6'>
                {/* Header */}
                <div className='flex items-center justify-between'>
                  <div>
                    <h2 className='text-2xl font-bold text-gray-800 mb-2'>
                      Test Center
                    </h2>
                    <p className='text-gray-600'>
                      Take tests to improve your skills and showcase your
                      knowledge
                    </p>
                  </div>
                  <div className='flex items-center gap-4'>
                    <span className='text-sm text-gray-500'>
                      Role: {profile.role}
                    </span>
                  </div>
                </div>

                {/* Available Tests */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {loadingTests ? (
                    <div className='col-span-full flex items-center justify-center py-20'>
                      <div className='animate-spin w-8 h-8 border-4 border-[#10B981] border-t-transparent rounded-full'></div>
                    </div>
                  ) : availableTests.length > 0 ? (
                    availableTests.map((test, index) => (
                      <FadeInUp key={test.id} delay={index * 0.1}>
                        <div className='bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300'>
                          <div className='flex items-start justify-between mb-4'>
                            <div className='flex-1'>
                              <h3 className='text-lg font-bold text-gray-800 mb-2'>
                                {test.title}
                              </h3>
                              <p className='text-gray-600 text-sm mb-3'>
                                {test.description}
                              </p>
                              <div className='flex items-center gap-4 text-sm text-gray-500'>
                                <span className='flex items-center gap-1'>
                                  <Clock size={14} />
                                  {test.timeLimit} min
                                </span>
                                <span className='flex items-center gap-1'>
                                  <FileText size={14} />
                                  {test.questions?.length || 0} questions
                                </span>
                              </div>
                            </div>
                            <div className='w-12 h-12 bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-xl flex items-center justify-center'>
                              <FileText size={20} className='text-white' />
                            </div>
                          </div>
                          <button
                            onClick={() => startTest(test)}
                            className='w-full bg-gradient-to-r from-[#10B981] to-[#34D399] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300'>
                            Start Test
                          </button>
                        </div>
                      </FadeInUp>
                    ))
                  ) : (
                    <div className='col-span-full text-center py-20'>
                      <div className='w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <FileText size={24} className='text-gray-500' />
                      </div>
                      <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                        No Tests Available
                      </h3>
                      <p className='text-gray-600'>
                        Check back later for new tests or contact an admin to
                        create tests.
                      </p>
                    </div>
                  )}
                </div>

                {/* Completed Tests */}
                {tests.length > 0 && (
                  <div className='bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg'>
                    <h3 className='text-lg font-bold text-gray-800 mb-4'>
                      Completed Tests
                    </h3>
                    <div className='space-y-4'>
                      {tests.map((test, index) => (
                        <FadeInUp key={test.id} delay={index * 0.1}>
                          <div className='flex items-center justify-between p-4 bg-gray-50/50 rounded-xl'>
                            <div className='flex items-center gap-4'>
                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                  test.score >= 80
                                    ? "bg-green-100 text-green-600"
                                    : test.score >= 60
                                      ? "bg-yellow-100 text-yellow-600"
                                      : "bg-red-100 text-red-600"
                                }`}>
                                <Award size={20} />
                              </div>
                              <div>
                                <h4 className='font-semibold text-gray-800'>
                                  {test.title}
                                </h4>
                                <p className='text-sm text-gray-500'>
                                  Completed{" "}
                                  {new Date(
                                    test.completedAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className='text-right'>
                              <div className='text-2xl font-bold text-gray-800'>
                                {test.score}%
                              </div>
                              <div className='text-sm text-gray-500'>
                                {test.timeSpent} min
                              </div>
                            </div>
                          </div>
                        </FadeInUp>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Create Test (Admin Only) */}
            {active === "Create Test" && profile.role === "admin" && (
              <motion.div
                key='create-test'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className='space-y-6'>
                <div className='bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg'>
                  <h2 className='text-2xl font-bold text-gray-800 mb-6'>
                    Create New Test
                  </h2>
                  <TestCreationForm
                    onTestCreated={() => setActive("Test")}
                    setNotifications={setNotifications}
                  />
                </div>
              </motion.div>
            )}

            {/* Active Test View */}
            {active === "Test" && isTestActive && currentTest && (
              <motion.div
                key='active-test'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className='space-y-6'>
                {/* Test Header */}
                <div className='bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg'>
                  <div className='flex items-center justify-between mb-4'>
                    <div>
                      <h2 className='text-2xl font-bold text-gray-800'>
                        {currentTest.title}
                      </h2>
                      <p className='text-gray-600'>{currentTest.description}</p>
                    </div>
                    <div className='text-right'>
                      <div className='text-3xl font-bold text-red-600'>
                        {formatTime(timeRemaining)}
                      </div>
                      <div className='text-sm text-gray-500'>
                        Time Remaining
                      </div>
                    </div>
                  </div>
                  <div className='w-full bg-gray-200 rounded-full h-2'>
                    <div
                      className='bg-red-500 h-2 rounded-full transition-all duration-1000'
                      style={{
                        width: `${((currentTest.timeLimit * 60 - timeRemaining) / (currentTest.timeLimit * 60)) * 100}%`,
                      }}></div>
                  </div>
                </div>

                {/* Test Questions */}
                <div className='space-y-6'>
                  {currentTest.questions?.map((question, qIndex) => (
                    <FadeInUp key={question.id} delay={qIndex * 0.1}>
                      <div className='bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                          Question {qIndex + 1}: {question.question}
                        </h3>
                        <div className='space-y-3'>
                          {question.options?.map((option, oIndex) => (
                            <label
                              key={option.id}
                              className='flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-all duration-200'>
                              <input
                                type='radio'
                                name={`question-${question.id}`}
                                value={option.id}
                                checked={testAnswers[question.id] === option.id}
                                onChange={() =>
                                  saveAnswer(question.id, option.id)
                                }
                                className='text-[#10B981] focus:ring-[#10B981]'
                              />
                              <span className='text-gray-800'>
                                {option.text}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </FadeInUp>
                  ))}
                </div>

                {/* Test Actions */}
                <div className='flex justify-between items-center'>
                  <button
                    onClick={() => {
                      setIsTestActive(false);
                      setCurrentTest(null);
                      setTestAnswers({});
                      setTimeRemaining(0);
                    }}
                    className='px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors'>
                    Cancel Test
                  </button>
                  <button
                    onClick={submitTest}
                    className='px-6 py-3 bg-gradient-to-r from-[#10B981] to-[#34D399] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300'>
                    Submit Test
                  </button>
                </div>
              </motion.div>
            )}

            {active === "Frai AI" && (
              <motion.div
                key='frai-ai'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className='space-y-6 max-w-4xl mx-auto'>
                {/* Header */}
                <div className='text-center mb-8'>
                  <div className='w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <Bot className='w-10 h-10 text-white' />
                  </div>
                  <h2 className='text-3xl font-bold text-gray-800 mb-2'>
                    Frai AI Assistant
                  </h2>
                  <p className='text-gray-600'>
                    Your intelligent coding companion powered by AI
                  </p>
                </div>

                {/* Chat Interface */}
                <div className='bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg overflow-hidden'>
                  {/* Messages Area */}
                  <div className='h-96 p-6 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white/50'>
                    {aiMessages.length === 0 ? (
                      <div className='flex flex-col items-center justify-center h-full text-center'>
                        <div className='w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4'>
                          <Bot className='w-8 h-8 text-blue-600' />
                        </div>
                        <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                          Welcome to Frai AI!
                        </h3>
                        <p className='text-gray-600 mb-4 max-w-md'>
                          I'm your AI assistant ready to help with coding
                          questions, project ideas, and technical guidance.
                        </p>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg'>
                          <div className='p-3 bg-white rounded-lg border border-gray-200 text-sm'>
                            <div className='font-medium text-gray-800 mb-1'>
                              💡 Ask me about:
                            </div>
                            <div className='text-gray-600'>
                              Code reviews, debugging, best practices
                            </div>
                          </div>
                          <div className='p-3 bg-white rounded-lg border border-gray-200 text-sm'>
                            <div className='font-medium text-gray-800 mb-1'>
                              🚀 Get help with:
                            </div>
                            <div className='text-gray-600'>
                              Project planning, architecture, tools
                            </div>
                          </div>
                          <div className='p-3 bg-white rounded-lg border border-gray-200 text-sm'>
                            <div className='font-medium text-gray-800 mb-1'>
                              📚 Learn about:
                            </div>
                            <div className='text-gray-600'>
                              New technologies, frameworks, APIs
                            </div>
                          </div>
                          <div className='p-3 bg-white rounded-lg border border-gray-200 text-sm'>
                            <div className='font-medium text-gray-800 mb-1'>
                              ⚡ Quick tasks:
                            </div>
                            <div className='text-gray-600'>
                              Code generation, optimization tips
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className='space-y-4'>
                        {aiMessages.map((message, index) => (
                          <div
                            key={index}
                            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                                message.sender === "user"
                                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                                  : "bg-white border border-gray-200 text-gray-800"
                              }`}>
                              {message.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Input Area */}
                  <div className='p-4 bg-white border-t border-gray-200'>
                    <div className='flex items-center gap-3'>
                      <div className='flex-1 relative'>
                        <input
                          type='text'
                          value={aiMessage}
                          onChange={(e) => setAiMessage(e.target.value)}
                          placeholder='Ask Frai AI anything about coding...'
                          className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300'
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              // Coming soon functionality
                              if (aiMessage.trim()) {
                                setAiMessages((prev) => [
                                  ...prev,
                                  { sender: "user", text: aiMessage },
                                ]);
                                setAiMessage("");
                                // Simulate AI response
                                setTimeout(() => {
                                  setAiMessages((prev) => [
                                    ...prev,
                                    {
                                      sender: "ai",
                                      text: "🚧 Coming Soon! Frai AI is currently under development. Stay tuned for amazing AI-powered coding assistance!",
                                    },
                                  ]);
                                }, 1000);
                              }
                            }
                          }}
                        />
                      </div>
                      <button
                        onClick={() => {
                          // Coming soon functionality
                          if (aiMessage.trim()) {
                            setAiMessages((prev) => [
                              ...prev,
                              { sender: "user", text: aiMessage },
                            ]);
                            setAiMessage("");
                            // Simulate AI response
                            setTimeout(() => {
                              setAiMessages((prev) => [
                                ...prev,
                                {
                                  sender: "ai",
                                  text: "🚧 Coming Soon! Frai AI is currently under development. Stay tuned for amazing AI-powered coding assistance!",
                                },
                              ]);
                            }, 1000);
                          }
                        }}
                        className='px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2'>
                        <Bot size={16} />
                        Send
                      </button>
                    </div>

                    {/* Coming Soon Badge */}
                    <div className='mt-3 text-center'>
                      <span className='inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full'>
                        <span className='w-2 h-2 bg-yellow-500 rounded-full animate-pulse'></span>
                        Coming Soon - AI Features Under Development
                      </span>
                    </div>
                  </div>
                </div>

                {/* Feature Preview Cards */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-8'>
                  <div className='bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-white/30 shadow-lg'>
                    <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4'>
                      <Bot className='w-6 h-6 text-blue-600' />
                    </div>
                    <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                      Code Assistant
                    </h3>
                    <p className='text-gray-600 text-sm'>
                      Get intelligent code suggestions, debugging help, and
                      optimization tips.
                    </p>
                  </div>

                  <div className='bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-white/30 shadow-lg'>
                    <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4'>
                      <FileText className='w-6 h-6 text-purple-600' />
                    </div>
                    <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                      Project Planning
                    </h3>
                    <p className='text-gray-600 text-sm'>
                      AI-powered project structure recommendations and
                      architecture guidance.
                    </p>
                  </div>

                  <div className='bg-white/80 backdrop-blur-xl rounded-xl p-6 border border-white/30 shadow-lg'>
                    <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4'>
                      <Users className='w-6 h-6 text-green-600' />
                    </div>
                    <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                      Learning Path
                    </h3>
                    <p className='text-gray-600 text-sm'>
                      Personalized learning recommendations based on your skills
                      and goals.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {active === "Chats" && (
              <motion.div
                key='chats'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className='h-full flex flex-col md:flex-row gap-4 md:gap-6'>
                {/* Left Sidebar - Community Groups (Hidden on Mobile) */}
                <div className='hidden md:flex w-64 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg flex-col h-full'>
                  <div className='p-6 border-b border-gray-200'>
                    <div className='mb-4'>
                      <h2 className='text-xl font-bold text-gray-800'>
                        Community
                      </h2>
                    </div>
                    <p className='text-sm text-gray-600'>
                      Join groups to connect with other professionals
                    </p>
                  </div>

                  {/* Groups List */}
                  <div className='flex-1 overflow-y-auto p-6'>
                    <div className='space-y-3'>
                      {[
                        {
                          name: "General",
                          members: 342,
                          active: true,
                          avatar: "G",
                        },
                      ].map((group, index) => (
                        <motion.div
                          key={group.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className='flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 border border-gray-100'>
                          <div className='w-12 h-12 bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-full flex items-center justify-center text-white font-semibold text-sm'>
                            {group.avatar}
                          </div>
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-center justify-between'>
                              <h4 className='font-medium text-gray-800 text-sm truncate'>
                                {group.name}
                              </h4>
                              {group.active && (
                                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                              )}
                            </div>
                            <p className='text-xs text-gray-500'>
                              {group.members} members
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main Chat Area - Full width on mobile */}
                <div className='flex-1 flex gap-4'>
                  {/* Chat Container */}
                  <div className='w-full bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg flex flex-col'>
                    {/* Chat Header - Simplified on mobile */}
                    <div className='flex items-center justify-between p-4 md:p-6 border-b border-gray-200'>
                      <div className='flex items-center gap-2 md:gap-3'>
                        <div className='w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-full flex items-center justify-center text-white font-semibold text-sm md:text-base'>
                          G
                        </div>
                        <div>
                          <h3 className='font-semibold text-gray-800 text-sm md:text-base'>
                            General
                          </h3>
                          <p className='text-xs md:text-sm text-gray-500 hidden md:block'>
                            General chat for all users
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center gap-1 md:gap-2'>
                        <button className='p-1.5 md:p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200'>
                          <Settings className='w-4 h-4 md:w-5 md:h-5 text-gray-600' />
                        </button>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className='flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4'>
                      {chatMessages.length === 0 ? (
                        <div className='text-center py-12'>
                          <div className='w-16 h-16 bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-full flex items-center justify-center mx-auto mb-4'>
                            <MessagesSquare className='w-8 h-8 text-white' />
                          </div>
                          <p className='text-gray-500 text-lg font-medium'>
                            Welcome to General!
                          </p>
                          <p className='text-gray-400 text-sm'>
                            Start chatting with the community
                          </p>
                        </div>
                      ) : (
                        chatMessages.map((msg, index) => (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                              opacity: deletingMessages.has(msg.id) ? 0 : 1,
                              y: deletingMessages.has(msg.id) ? -20 : 0,
                              scale: deletingMessages.has(msg.id) ? 0.95 : 1,
                            }}
                            transition={{
                              delay: deletingMessages.has(msg.id)
                                ? 0
                                : index * 0.05,
                              duration: deletingMessages.has(msg.id)
                                ? 0.2
                                : 0.3,
                            }}
                            className={`flex ${msg.userId === user?.id ? "justify-end" : "justify-start"}`}>
                            <div className='flex items-start gap-3 max-w-[70%] group'>
                              {msg.userId !== user?.id && (
                                <div className='relative flex-shrink-0'>
                                  <div className='w-8 h-8 bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-full flex items-center justify-center text-white font-semibold text-xs'>
                                    {msg.user?.name?.[0]?.toUpperCase() ||
                                      msg.userName?.[0]?.toUpperCase() ||
                                      "U"}
                                  </div>
                                </div>
                              )}
                              <div className='flex-1 relative'>
                                <div className='flex items-center gap-2 mb-1'>
                                  {msg.userId !== user?.id && (
                                    <span className='font-medium text-gray-800 text-sm'>
                                      {msg.user?.name || msg.userName}
                                    </span>
                                  )}
                                  <span className='text-xs text-gray-500'>
                                    {new Date(msg.createdAt).toLocaleTimeString(
                                      [],
                                      { hour: "2-digit", minute: "2-digit" }
                                    )}
                                  </span>
                                  {msg.updatedAt &&
                                    msg.updatedAt !== msg.createdAt && (
                                      <span className='text-xs text-gray-400'>
                                        (edited)
                                      </span>
                                    )}
                                </div>

                                {editingMessage === msg.id ? (
                                  <div className='bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg p-4 space-y-3'>
                                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                                      <Edit className='w-4 h-4' />
                                      <span>Editing message</span>
                                    </div>
                                    <textarea
                                      value={editMessageText}
                                      onChange={(e) =>
                                        setEditMessageText(e.target.value)
                                      }
                                      className='w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] resize-none min-h-[80px] bg-white'
                                      onKeyPress={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                          e.preventDefault();
                                          handleSaveEdit();
                                        }
                                      }}
                                      placeholder='Type your message...'
                                      autoFocus
                                    />
                                    <div className='flex items-center justify-between'>
                                      <div className='text-xs text-gray-500'>
                                        Press Enter to save, Shift+Enter for new
                                        line
                                      </div>
                                      <div className='flex items-center gap-2'>
                                        <button
                                          onClick={handleCancelEdit}
                                          className='px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg text-sm font-medium transition-all duration-200'>
                                          Cancel
                                        </button>
                                        <button
                                          onClick={handleSaveEdit}
                                          disabled={!editMessageText.trim()}
                                          className='px-4 py-2 bg-gradient-to-r from-[#10B981] to-[#34D399] text-white rounded-lg text-sm font-medium hover:from-[#059669] hover:to-[#10B981] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm'>
                                          Save Changes
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    className={`px-4 py-3 text-sm break-words whitespace-pre-line border shadow-sm rounded-2xl relative group/message hover:shadow-md transition-all duration-200 ${
                                      msg.userId === user?.id
                                        ? "bg-gradient-to-r from-[#10B981] to-[#34D399] text-white border-[#10B981]"
                                        : "bg-white text-gray-900 border-gray-200"
                                    }`}>
                                    {/* Reply indicator */}
                                    {msg.replyTo && (
                                      <div
                                        className={`mb-2 p-2 rounded-lg border-l-4 ${
                                          msg.userId === user?.id
                                            ? "bg-white/20 border-white/50"
                                            : "bg-gray-50 border-gray-300"
                                        }`}>
                                        <div className='flex items-center gap-2 mb-1'>
                                          <Reply
                                            className={`w-3 h-3 ${
                                              msg.userId === user?.id
                                                ? "text-white/70"
                                                : "text-gray-500"
                                            }`}
                                          />
                                          <span
                                            className={`text-xs font-medium ${
                                              msg.userId === user?.id
                                                ? "text-white/70"
                                                : "text-gray-500"
                                            }`}>
                                            Replying to{" "}
                                            {msg.replyTo.user?.name ||
                                              "Unknown"}
                                          </span>
                                        </div>
                                        <p
                                          className={`text-xs truncate ${
                                            msg.userId === user?.id
                                              ? "text-white/60"
                                              : "text-gray-400"
                                          }`}>
                                          {msg.replyTo.message}
                                        </p>
                                      </div>
                                    )}

                                    {msg.message}

                                    {/* Message actions */}
                                    {editingMessage !== msg.id && (
                                      <div className='absolute -top-2 -right-2 opacity-0 group-hover/message:opacity-100 transition-all duration-300 transform scale-90 group-hover/message:scale-100'>
                                        <div className='flex items-center gap-0.5 bg-white rounded-full shadow-lg border border-gray-200 p-1'>
                                          {/* Reply button for all messages */}
                                          <button
                                            onClick={() =>
                                              handleReplyMessage(msg)
                                            }
                                            className='p-2 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 text-gray-600'
                                            title='Reply to message'>
                                            <Reply className='w-3.5 h-3.5' />
                                          </button>

                                          {/* Edit and Delete only for own messages */}
                                          {msg.userId === user?.id && (
                                            <>
                                              <div className='w-px h-4 bg-gray-200'></div>
                                              <button
                                                onClick={() =>
                                                  handleEditMessage(
                                                    msg.id,
                                                    msg.message
                                                  )
                                                }
                                                disabled={
                                                  deletingMessages.has(
                                                    msg.id
                                                  ) || editingMessage !== null
                                                }
                                                className={`p-2 rounded-full transition-all duration-200 ${
                                                  deletingMessages.has(
                                                    msg.id
                                                  ) || editingMessage !== null
                                                    ? "text-gray-400 cursor-not-allowed"
                                                    : "hover:bg-blue-50 hover:text-blue-600 text-gray-600"
                                                }`}
                                                title={
                                                  deletingMessages.has(msg.id)
                                                    ? "Cannot edit while deleting"
                                                    : editingMessage !== null
                                                      ? "Finish editing current message first"
                                                      : "Edit message"
                                                }>
                                                <Edit className='w-3.5 h-3.5' />
                                              </button>
                                              <div className='w-px h-4 bg-gray-200'></div>
                                              <button
                                                onClick={() =>
                                                  handleDeleteMessage(msg.id)
                                                }
                                                disabled={
                                                  deletingMessages.has(
                                                    msg.id
                                                  ) || editingMessage !== null
                                                }
                                                className={`p-2 rounded-full transition-all duration-200 ${
                                                  deletingMessages.has(msg.id)
                                                    ? "bg-red-100 text-red-500 cursor-not-allowed"
                                                    : editingMessage !== null
                                                      ? "text-gray-400 cursor-not-allowed"
                                                      : "hover:bg-red-50 hover:text-red-600 text-gray-600"
                                                }`}
                                                title={
                                                  deletingMessages.has(msg.id)
                                                    ? "Deleting..."
                                                    : editingMessage !== null
                                                      ? "Finish editing current message first"
                                                      : "Delete message"
                                                }>
                                                {deletingMessages.has(
                                                  msg.id
                                                ) ? (
                                                  <div className='w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin'></div>
                                                ) : (
                                                  <Trash2 className='w-3.5 h-3.5' />
                                                )}
                                              </button>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}

                      {/* Typing indicator */}
                      {typingUsers.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className='flex justify-start'>
                          <div className='flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl'>
                            <div className='flex space-x-1'>
                              <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
                              <div
                                className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                                style={{ animationDelay: "0.1s" }}></div>
                              <div
                                className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                                style={{ animationDelay: "0.2s" }}></div>
                            </div>
                            <span className='text-xs text-gray-500'>
                              {typingUsers.map((u) => u.userName).join(", ")}{" "}
                              typing...
                            </span>
                          </div>
                        </motion.div>
                      )}

                      {/* Scroll anchor */}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className='border-t border-gray-200'>
                      {/* Reply Preview */}
                      {replyingTo && (
                        <div className='px-3 md:px-6 pt-3 md:pt-4 pb-2'>
                          <div className='bg-gray-50 rounded-lg p-2 md:p-3 border-l-4 border-[#10B981]'>
                            <div className='flex items-center justify-between mb-1 md:mb-2'>
                              <div className='flex items-center gap-1 md:gap-2'>
                                <Reply className='w-3 h-3 md:w-4 md:h-4 text-[#10B981]' />
                                <span className='text-xs md:text-sm font-medium text-gray-700'>
                                  Replying to{" "}
                                  {replyingTo.user?.name || replyingTo.userName}
                                </span>
                              </div>
                              <button
                                onClick={handleCancelReply}
                                className='text-gray-400 hover:text-gray-600 transition-colors'>
                                <Trash2 className='w-3 h-3 md:w-4 md:h-4' />
                              </button>
                            </div>
                            <p className='text-xs md:text-sm text-gray-600 truncate'>
                              {replyingTo.message}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className='p-3 md:p-6'>
                        <form
                          onSubmit={handleSendMessage}
                          className='flex items-center gap-2 md:gap-3'>
                          <div className='flex-1 relative'>
                            <input
                              type='text'
                              value={newMessage}
                              onChange={handleInputChange}
                              placeholder={
                                replyingTo
                                  ? `Reply to ${replyingTo.user?.name || replyingTo.userName}...`
                                  : "Type a message..."
                              }
                              className='w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all duration-300'
                              disabled={sendingMessage}
                            />
                          </div>
                          <button
                            type='submit'
                            disabled={!newMessage.trim() || sendingMessage}
                            className='p-2 md:p-3 bg-gradient-to-r from-[#10B981] to-[#34D399] text-white rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50'>
                            <svg
                              className='w-4 h-4 md:w-5 md:h-5'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'>
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M12 19l9 2-9-18-9 2 9-2zm0 0v-8'
                              />
                            </svg>
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>

                  {/* Right Sidebar - Group Info (Hidden on Mobile) */}
                  <div className='hidden lg:flex w-[420px] bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg flex-col h-full'>
                    <div className='p-6 border-b border-gray-200'>
                      <h3 className='text-lg font-bold text-gray-800 mb-4'>
                        Group Information
                      </h3>
                    </div>

                    {/* Group Info */}
                    <div className='flex-1 p-6'>
                      <div className='space-y-6'>
                        {/* General */}
                        <div>
                          <h4 className='font-semibold text-gray-800 mb-3'>
                            General
                          </h4>
                          <div className='bg-gray-50 rounded-xl p-4'>
                            <p className='text-sm text-gray-600 leading-relaxed'>
                              Welcome to our community! This is a space for all
                              professionals to connect, share knowledge, and
                              collaborate on projects. Feel free to introduce
                              yourself and start meaningful conversations.
                            </p>
                          </div>
                        </div>

                        {/* Bio */}
                        <div>
                          <h4 className='font-semibold text-gray-800 mb-3'>
                            About This Group
                          </h4>
                          <div className='bg-gray-50 rounded-xl p-4'>
                            <div className='space-y-3'>
                              <div className='flex items-center gap-2'>
                                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                                <span className='text-sm text-gray-600'>
                                  342 members
                                </span>
                              </div>
                              <div className='flex items-center gap-2'>
                                <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                                <span className='text-sm text-gray-600'>
                                  Professional networking
                                </span>
                              </div>
                              <div className='flex items-center gap-2'>
                                <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
                                <span className='text-sm text-gray-600'>
                                  Knowledge sharing
                                </span>
                              </div>
                              <div className='flex items-center gap-2'>
                                <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                                <span className='text-sm text-gray-600'>
                                  Project collaboration
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {active === "Settings" && (
              <motion.div
                key='settings'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className='space-y-6'>
                <h2 className='text-2xl font-bold text-gray-800'>
                  Profile Settings
                </h2>

                <FadeInUp>
                  <div className='bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg'>
                    <form onSubmit={handleProfileSave} className='space-y-6'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Full Name
                          </label>
                          <input
                            type='text'
                            name='name'
                            value={profile.name}
                            onChange={handleChange}
                            className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all duration-300'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Email
                          </label>
                          <input
                            type='email'
                            value={profile.email}
                            disabled
                            className='w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500'
                          />
                        </div>
                      </div>

                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Bio
                        </label>
                        <textarea
                          name='bio'
                          value={profile.bio}
                          onChange={handleChange}
                          rows={4}
                          className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all duration-300'
                        />
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            GitHub
                          </label>
                          <input
                            type='url'
                            name='github'
                            value={profile.github}
                            onChange={handleChange}
                            className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all duration-300'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Telegram
                          </label>
                          <input
                            type='text'
                            name='telegram'
                            value={profile.telegram}
                            onChange={handleChange}
                            className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all duration-300'
                          />
                        </div>
                      </div>

                      <div className='flex items-center justify-between'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Language
                          </label>
                          <select
                            name='lang'
                            value={profile.lang}
                            onChange={handleChange}
                            className='px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all duration-300'>
                            {LANGS.map((lang) => (
                              <option key={lang.value} value={lang.value}>
                                {lang.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          type='submit'
                          disabled={loading}
                          className='bg-gradient-to-r from-[#10B981] to-[#34D399] text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50'>
                          {loading ? "Saving..." : "Save Changes"}
                        </button>
                      </div>

                      {success && (
                        <div className='p-4 bg-green-100 text-green-700 rounded-xl'>
                          {success}
                        </div>
                      )}
                      {error && (
                        <div className='p-4 bg-red-100 text-red-700 rounded-xl'>
                          {error}
                        </div>
                      )}
                    </form>
                  </div>
                </FadeInUp>
              </motion.div>
            )}

            {/* Take Test */}
            {active === "Take Test" && currentTest && (
              <motion.div
                key='take-test'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className='space-y-6'>
                {/* Test Header */}
                <div className='bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg'>
                  <div className='flex items-center justify-between mb-4'>
                    <div>
                      <h2 className='text-2xl font-bold text-gray-800'>
                        {currentTest.title}
                      </h2>
                      <p className='text-gray-600'>{currentTest.description}</p>
                    </div>
                    <div className='text-right'>
                      <div
                        className={`text-2xl font-bold ${
                          timeRemaining < 300 ? "text-red-600" : "text-gray-800"
                        }`}>
                        {formatTime(timeRemaining)}
                      </div>
                      <div className='text-sm text-gray-500'>
                        Time Remaining
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='text-sm text-gray-600'>
                      {Object.keys(testAnswers).length} of{" "}
                      {currentTest.questions?.length || 0} questions answered
                    </div>
                    <button
                      onClick={submitTest}
                      className='bg-gradient-to-r from-[#10B981] to-[#34D399] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300'>
                      Submit Test
                    </button>
                  </div>
                </div>

                {/* Questions */}
                <div className='space-y-6'>
                  {currentTest.questions?.map((question, index) => (
                    <FadeInUp key={question.id} delay={index * 0.1}>
                      <div className='bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg'>
                        <div className='mb-6'>
                          <div className='flex items-center gap-3 mb-4'>
                            <div className='w-8 h-8 bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-full flex items-center justify-center text-white font-bold text-sm'>
                              {index + 1}
                            </div>
                            <h3 className='text-lg font-semibold text-gray-800'>
                              Question {index + 1}
                            </h3>
                          </div>
                          <p className='text-gray-700 text-lg'>
                            {question.question}
                          </p>
                        </div>

                        <div className='space-y-3'>
                          {question.options?.map((option, optionIndex) => (
                            <label
                              key={option.id}
                              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                testAnswers[question.id] === option.id
                                  ? "border-[#10B981] bg-green-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}>
                              <input
                                type='radio'
                                name={`question-${question.id}`}
                                value={option.id}
                                checked={testAnswers[question.id] === option.id}
                                onChange={() =>
                                  saveAnswer(question.id, option.id)
                                }
                                className='text-[#10B981] focus:ring-[#10B981]'
                              />
                              <span className='flex-1 text-gray-700'>
                                {option.text}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </FadeInUp>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className='fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 p-2 md:hidden z-40'>
        <div className='flex items-center justify-around'>
          {menuItems.slice(0, 5).map(({ label, icon: Icon, adminOnly }) => {
            if (adminOnly && profile.role?.toLowerCase() !== "admin") {
              return null;
            }

            return (
              <button
                key={label}
                onClick={() => {
                  if (label === "Admin Panel") {
                    window.open("/admin/users", "_blank");
                  } else {
                    setActive(label);
                  }
                }}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300 ${
                  active === label
                    ? "text-[#10B981]"
                    : "text-gray-600 hover:text-[#10B981]"
                }`}>
                <Icon className='w-5 h-5' />
                <span className='text-xs font-medium'>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
