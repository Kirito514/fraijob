"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, X } from "lucide-react";
import Link from "next/link";
import {
  Users,
  MessageCircle,
  Search,
  Filter,
  Plus,
  Heart,
  Share2,
  Bookmark,
  Eye,
  Clock,
  UserCircle,
  TrendingUp,
  Star,
  Award,
  Calendar,
  MapPin,
  Globe,
  Code,
  Briefcase,
  GraduationCap,
  Workflow,
  UserCheck,
  Mail,
  Github,
  Twitter,
  Linkedin,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Target,
  Zap,
  BrainCircuit,
  Smartphone,
} from "lucide-react";

const COMMUNITY_DATA = {
  stats: {
    members: "10,247",
    discussions: "5,892",
    projects: "2,341",
    mentors: "523"
  },
  categories: [
    { name: "Frontend", count: 1240, color: "bg-blue-100 text-blue-700", icon: Code },
    { name: "Backend", count: 892, color: "bg-emerald-100 text-emerald-700", icon: Workflow },
    { name: "AI/ML", count: 567, color: "bg-purple-100 text-purple-700", icon: BrainCircuit },
    { name: "Mobile", count: 445, color: "bg-pink-100 text-pink-700", icon: Smartphone },
    { name: "DevOps", count: 334, color: "bg-teal-100 text-teal-700", icon: Zap },
    { name: "Career", count: 678, color: "bg-emerald-100 text-emerald-700", icon: Target }
  ],
  recentDiscussions: [
    {
      id: 1,
      title: "React 18 New Features and Optimization",
      author: {
        name: "Aziz Karimov",
        avatar: "/api/placeholder/40/40",
        role: "Senior Frontend Developer"
      },
      category: "Frontend",
      replies: 23,
      views: 156,
      likes: 45,
      time: "2 hours ago",
      tags: ["React", "Performance", "Hooks"]
    },
    {
      id: 2,
      title: "AI and Programming Future: How to Prepare?",
      author: {
        name: "Malika Yusupova",
        avatar: "/api/placeholder/40/40",
        role: "AI Engineer"
      },
      category: "AI/ML",
      replies: 45,
      views: 289,
      likes: 67,
      time: "5 hours ago",
      tags: ["AI", "Future", "Career"]
    },
    {
      id: 3,
      title: "Freelance Project Tips and Experiences",
      author: {
        name: "Jasur Toshmatov",
        avatar: "/api/placeholder/40/40",
        role: "Full-Stack Developer"
      },
      category: "Career",
      replies: 12,
      views: 89,
      likes: 23,
      time: "1 day ago",
      tags: ["Freelance", "Tips", "Experience"]
    }
  ],
  topMembers: [
    {
      id: 1,
      name: "Aziz Karimov",
      avatar: "/api/placeholder/60/60",
      role: "Senior Frontend Developer",
      company: "TechCorp",
      location: "Tashkent, Uzbekistan",
      skills: ["React", "TypeScript", "Node.js"],
      reputation: 1250,
      projects: 15,
      joined: "2022"
    },
    {
      id: 2,
      name: "Malika Yusupova",
      avatar: "/api/placeholder/60/60",
      role: "AI Engineer",
      company: "AI Solutions",
      location: "Samarkand, Uzbekistan",
      skills: ["Python", "TensorFlow", "ML"],
      reputation: 980,
      projects: 12,
      joined: "2023"
    },
    {
      id: 3,
      name: "Jasur Toshmatov",
      avatar: "/api/placeholder/60/60",
      role: "Full-Stack Developer",
      company: "Freelance",
      location: "Bukhara, Uzbekistan",
      skills: ["React", "Node.js", "MongoDB"],
      reputation: 756,
      projects: 8,
      joined: "2023"
    }
  ],
  upcomingEvents: [
    {
      id: 1,
      title: "React Meetup Tashkent",
      date: "2024-02-15",
      time: "18:00",
      location: "Tashkent Tech Hub",
      attendees: 45,
      type: "Meetup"
    },
    {
      id: 2,
      title: "AI and Machine Learning Workshop",
      date: "2024-02-20",
      time: "14:00",
      location: "Online",
      attendees: 120,
      type: "Workshop"
    },
    {
      id: 3,
      title: "Freelance Developer Networking",
      date: "2024-02-25",
      time: "19:00",
      location: "Samarkand Innovation Center",
      attendees: 28,
      type: "Networking"
    }
  ]
};

// English texts
const TEXTS = {
  title: "Community",
  subtitle: "Connect with developers and share knowledge",
  newTopic: "New Topic",
  members: "Members",
  discussions: "Discussions", 
  projects: "Projects",
  mentors: "Mentors",
  searchPlaceholder: "Search discussions...",
  allCategories: "All Categories",
  filters: "Filters",
  discussionsTab: "Discussions",
  projectsTab: "Projects",
  eventsTab: "Events",
  categories: "Categories",
  topMembers: "Top Members",
  quickActions: "Quick Actions",
  createNewTopic: "Create New Topic",
  findMentor: "Find Mentor",
  findPartner: "Find Partner",
  loading: "Loading...",
  notifications: {
    newTopic: "New topic creation feature will be available soon!",
    viewTopic: "topic viewing feature will be available soon!",
    viewCategory: "category viewing feature will be available soon!",
    viewProfile: "profile viewing feature will be available soon!",
    findMentor: "Mentor finding feature will be available soon!",
    findPartner: "Partner finding feature will be available soon!"
  }
};

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("discussions");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isMounted, setIsMounted] = useState(false);
  const [notification, setNotification] = useState(null);

  // Fix hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle notification timeout
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Show notification function
  const showNotification = (message, type = "info") => {
    setNotification({
      type,
      message
    });
  };

  // Prevent rendering until mounted
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{TEXTS.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-blue-50/30">
      {/* Notification System */}
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
                  : notification.type === "error"
                  ? "bg-red-100 text-red-600"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle size={20} />
              ) : notification.type === "error" ? (
                <AlertCircle size={20} />
              ) : (
                <MessageCircle size={20} />
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

      {/* Simplified background decorations for better performance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-200/10 to-blue-200/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center justify-between sm:justify-start">
              <div className="flex items-center gap-4">
                {/* Logo */}
                <Link href="/">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-[#10B981] to-[#34D399] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <span className="text-white font-bold text-lg">F</span>
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-emerald-600 group-hover:to-emerald-500 transition-all duration-300">
                      FraiJob
                    </h1>
                  </motion.div>
                </Link>
                
                <div>
                  <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                  >
                    {TEXTS.title}
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-600 mt-1 text-sm sm:text-base"
                  >
                    {TEXTS.subtitle}
                  </motion.p>
                </div>
              </div>
            </div>
            
            <motion.button 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                showNotification(TEXTS.notifications.newTopic, "info");
              }}
              className="group relative bg-gradient-to-r from-[#10B981] to-[#34D399] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold overflow-hidden transition-all duration-300 flex items-center gap-2 hover:shadow-[0_8px_20px_rgba(16,185,129,0.2)] text-sm sm:text-base"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#34D399] to-[#10B981] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Plus size={18} className="relative z-10" />
              <span className="relative z-10">{TEXTS.newTopic}</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          {[
            { label: TEXTS.members, value: COMMUNITY_DATA.stats.members, color: "emerald" },
            { label: TEXTS.discussions, value: COMMUNITY_DATA.stats.discussions, color: "blue" },
            { label: TEXTS.projects, value: COMMUNITY_DATA.stats.projects, color: "purple" },
            { label: TEXTS.mentors, value: COMMUNITY_DATA.stats.mentors, color: "pink" }
          ].map((stat, index) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="group bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 text-center border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-500/5 to-${stat.color === 'emerald' ? 'blue' : stat.color === 'blue' ? 'purple' : stat.color === 'purple' ? 'pink' : 'emerald'}-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              <div className="relative z-10">
                <div className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r from-${stat.color}-600 to-${stat.color}-500 bg-clip-text text-transparent mb-2`}>{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg mb-6 sm:mb-8 relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500" size={18} />
                <input
                  type="text"
                  placeholder={TEXTS.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-sm sm:text-base"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-sm sm:text-base"
              >
                <option value="all">{TEXTS.allCategories}</option>
                {COMMUNITY_DATA.categories.map((category) => (
                  <option key={category.name} value={category.name}>{category.name}</option>
                ))}
              </select>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 rounded-xl hover:from-emerald-200 hover:to-blue-200 transition-all duration-300 flex items-center gap-2 font-medium text-sm sm:text-base"
              >
                <Filter size={18} />
                <span className="hidden sm:inline">{TEXTS.filters}</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg mb-6 relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex border-b border-gray-200">
                  {[
                    { id: "discussions", label: TEXTS.discussionsTab, icon: MessageCircle },
                    { id: "projects", label: TEXTS.projectsTab, icon: Briefcase },
                    { id: "events", label: TEXTS.eventsTab, icon: Calendar }
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 px-3 sm:px-6 py-3 sm:py-4 text-center font-medium transition-all duration-300 text-sm sm:text-base ${
                        activeTab === tab.id
                          ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50"
                          : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/30"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <tab.icon size={14} className="sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                        <span className="sm:hidden">{tab.label.charAt(0)}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Content based on active tab */}
            <AnimatePresence mode="wait">
              {activeTab === "discussions" && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {COMMUNITY_DATA.recentDiscussions.map((discussion, index) => (
                    <motion.div 
                      key={discussion.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01, y: -1 }}
                      onClick={() => {
                        showNotification(`"${discussion.title}" ${TEXTS.notifications.viewTopic}`, "info");
                      }}
                      className="group bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <UserCircle size={20} className="text-emerald-600 sm:w-6 sm:h-6" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2 gap-2">
                              <h3 className="font-semibold text-gray-900 text-base sm:text-lg hover:text-emerald-600 cursor-pointer transition-colors line-clamp-2">
                                {discussion.title}
                              </h3>
                              <span className={`text-xs px-2 sm:px-3 py-1 rounded-full flex-shrink-0 ${
                                discussion.category === "Frontend" ? "bg-blue-100 text-blue-700" : 
                                discussion.category === "AI/ML" ? "bg-purple-100 text-purple-700" : 
                                "bg-emerald-100 text-emerald-700"
                              }`}>
                                {discussion.category}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3">
                              <span className="font-medium text-gray-700">{discussion.author.name}</span>
                              <span className="hidden sm:inline">•</span>
                              <span className="hidden sm:inline">{discussion.author.role}</span>
                              <span className="hidden sm:inline">•</span>
                              <span className="flex items-center gap-1">
                                <Clock size={12} className="sm:w-3.5 sm:h-3.5" />
                                {discussion.time}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <MessageCircle size={12} className="sm:w-3.5 sm:h-3.5" />
                                {discussion.replies} replies
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye size={12} className="sm:w-3.5 sm:h-3.5" />
                                {discussion.views} views
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart size={12} className="sm:w-3.5 sm:h-3.5" />
                                {discussion.likes} likes
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-3 flex-wrap">
                              {discussion.tags.map((tag) => (
                                <span key={tag} className="text-xs bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 px-2 py-1 rounded-full border border-emerald-200/50">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col gap-1 sm:gap-2">
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1.5 sm:p-2 text-gray-400 hover:text-emerald-600 transition-colors"
                            >
                              <Heart size={14} className="sm:w-4 sm:h-4" />
                            </motion.button>
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1.5 sm:p-2 text-gray-400 hover:text-emerald-600 transition-colors"
                            >
                              <Bookmark size={14} className="sm:w-4 sm:h-4" />
                            </motion.button>
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1.5 sm:p-2 text-gray-400 hover:text-emerald-600 transition-colors"
                            >
                              <Share2 size={14} className="sm:w-4 sm:h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Projects */}
            <AnimatePresence mode="wait">
              {activeTab === "projects" && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Workflow size={32} className="text-emerald-600 sm:w-10 sm:h-10" />
                    </div>
                  </motion.div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Projects Coming Soon</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Collaborate on projects with community members</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Events */}
            <AnimatePresence mode="wait">
              {activeTab === "events" && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {COMMUNITY_DATA.upcomingEvents.map((event, index) => (
                    <motion.div 
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01, y: -1 }}
                      className="group bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2 group-hover:text-emerald-600 transition-colors">{event.title}</h3>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar size={12} className="sm:w-3.5 sm:h-3.5" />
                                {event.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={12} className="sm:w-3.5 sm:h-3.5" />
                                {event.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin size={12} className="sm:w-3.5 sm:h-3.5" />
                                {event.location}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs px-2 sm:px-3 py-1 rounded-full ${
                              event.type === "Meetup" ? "bg-blue-100 text-blue-700" :
                              event.type === "Workshop" ? "bg-purple-100 text-purple-700" :
                              "bg-emerald-100 text-emerald-700"
                            }`}>
                              {event.type}
                            </span>
                            <div className="text-xs sm:text-sm text-gray-500 mt-1">{event.attendees} attendees</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Categories */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg relative overflow-hidden"
            >
              <div className="relative z-10">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm sm:text-base">
                  <Sparkles size={14} className="text-emerald-600 sm:w-4 sm:h-4" />
                  {TEXTS.categories}
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {COMMUNITY_DATA.categories.map((category, index) => (
                    <motion.div 
                      key={category.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 2 }}
                      onClick={() => {
                        setSelectedCategory(category.name);
                        showNotification(`${category.name} ${TEXTS.notifications.viewCategory}`, "info");
                      }}
                      className="group flex items-center justify-between p-2 sm:p-3 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 cursor-pointer transition-all duration-300 border border-transparent hover:border-emerald-200/50"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <category.icon size={12} className="text-current sm:w-4 sm:h-4" />
                        </div>
                        <span className="font-medium text-gray-700 group-hover:text-emerald-600 transition-colors text-sm">{category.name}</span>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">{category.count}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Top Members */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg relative overflow-hidden"
            >
              <div className="relative z-10">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm sm:text-base">
                  <Award size={14} className="text-emerald-600 sm:w-4 sm:h-4" />
                  {TEXTS.topMembers}
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {COMMUNITY_DATA.topMembers.map((member, index) => (
                    <motion.div 
                      key={member.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 2 }}
                      onClick={() => {
                        showNotification(`${member.name} ${TEXTS.notifications.viewProfile}`, "info");
                      }}
                      className="group flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 cursor-pointer transition-all duration-300 border border-transparent hover:border-emerald-200/50"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <UserCircle size={20} className="text-emerald-600 sm:w-6 sm:h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-xs sm:text-sm group-hover:text-emerald-600 transition-colors truncate">{member.name}</h4>
                        <p className="text-xs text-gray-500 truncate">{member.role}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star size={10} className="text-yellow-500 sm:w-3 sm:h-3" />
                          <span className="text-xs text-gray-500">{member.reputation} points</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg relative overflow-hidden"
            >
              <div className="relative z-10">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm sm:text-base">
                  <Zap size={14} className="text-emerald-600 sm:w-4 sm:h-4" />
                  {TEXTS.quickActions}
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      showNotification(TEXTS.notifications.newTopic, "info");
                    }}
                    className="group w-full bg-gradient-to-r from-[#10B981] to-[#34D399] text-white py-2 sm:py-3 rounded-xl font-medium overflow-hidden transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_8px_20px_rgba(16,185,129,0.2)] text-sm"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#34D399] to-[#10B981] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Plus size={14} className="relative z-10 sm:w-4 sm:h-4" />
                    <span className="relative z-10">{TEXTS.createNewTopic}</span>
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      showNotification(TEXTS.notifications.findMentor, "info");
                    }}
                    className="w-full bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 py-2 sm:py-3 rounded-xl font-medium hover:from-emerald-200 hover:to-blue-200 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                  >
                    <Users size={14} className="sm:w-4 sm:h-4" />
                    {TEXTS.findMentor}
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      showNotification(TEXTS.notifications.findPartner, "info");
                    }}
                    className="w-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 py-2 sm:py-3 rounded-xl font-medium hover:from-purple-200 hover:to-pink-200 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                  >
                    <Workflow size={14} className="sm:w-4 sm:h-4" />
                    {TEXTS.findPartner}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 