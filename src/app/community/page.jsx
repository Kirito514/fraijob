"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
      title: "React 18 yangi xususiyatlari va optimizatsiya",
      author: {
        name: "Aziz Karimov",
        avatar: "/api/placeholder/40/40",
        role: "Senior Frontend Developer"
      },
      category: "Frontend",
      replies: 23,
      views: 156,
      likes: 45,
      time: "2 soat oldin",
      tags: ["React", "Performance", "Hooks"]
    },
    {
      id: 2,
      title: "AI va dasturlash kelajagi: Qanday tayyorgarlik qilish kerak?",
      author: {
        name: "Malika Yusupova",
        avatar: "/api/placeholder/40/40",
        role: "AI Engineer"
      },
      category: "AI/ML",
      replies: 45,
      views: 289,
      likes: 67,
      time: "5 soat oldin",
      tags: ["AI", "Future", "Career"]
    },
    {
      id: 3,
      title: "Freelance loyihalar uchun maslahat va tajribalar",
      author: {
        name: "Jasur Toshmatov",
        avatar: "/api/placeholder/40/40",
        role: "Full-Stack Developer"
      },
      category: "Career",
      replies: 12,
      views: 89,
      likes: 23,
      time: "1 kun oldin",
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
      title: "AI va Machine Learning Workshop",
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

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("discussions");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-blue-50/30">
      {/* Enhanced background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-200/10 to-blue-200/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-200/5 to-emerald-200/5 rounded-full blur-2xl animate-float-slow" />
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
              >
                Jamiyat
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 mt-1"
              >
                Dasturchilar bilan bog'laning va bilim almashing
              </motion.p>
            </div>
            <motion.button 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                // Yangi mavzu yaratish modalini ochish yoki formaga yo'naltirish
                alert("Yangi mavzu yaratish funksiyasi tez orada qo'shiladi!");
              }}
              className="group relative bg-gradient-to-r from-[#10B981] to-[#34D399] text-white px-6 py-3 rounded-xl font-semibold overflow-hidden transition-all duration-300 flex items-center gap-2 hover:shadow-[0_8px_20px_rgba(16,185,129,0.2)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#34D399] to-[#10B981] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Plus size={20} className="relative z-10" />
              <span className="relative z-10">Yangi mavzu</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
        >
          <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent mb-2">{COMMUNITY_DATA.stats.members}</div>
              <div className="text-sm text-gray-600">A'zolar</div>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-2">{COMMUNITY_DATA.stats.discussions}</div>
              <div className="text-sm text-gray-600">Munozaralar</div>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent mb-2">{COMMUNITY_DATA.stats.projects}</div>
              <div className="text-sm text-gray-600">Loyihalar</div>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent mb-2">{COMMUNITY_DATA.stats.mentors}</div>
              <div className="text-sm text-gray-600">Mentorlar</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-100/50 to-blue-100/50 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100/50 to-pink-100/50 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500" size={20} />
                <input
                  type="text"
                  placeholder="Munozaralarni qidirish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              >
                <option value="all">Barcha kategoriyalar</option>
                {COMMUNITY_DATA.categories.map((category) => (
                  <option key={category.name} value={category.name}>{category.name}</option>
                ))}
              </select>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 rounded-xl hover:from-emerald-200 hover:to-blue-200 transition-all duration-300 flex items-center gap-2 font-medium"
              >
                <Filter size={20} />
                Filtrlar
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg mb-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-100/30 to-blue-100/30 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="flex border-b border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab("discussions")}
                    className={`flex-1 px-6 py-4 text-center font-medium transition-all duration-300 ${
                      activeTab === "discussions"
                        ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50"
                        : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/30"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <MessageCircle size={16} />
                      Munozaralar
                    </div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab("projects")}
                    className={`flex-1 px-6 py-4 text-center font-medium transition-all duration-300 ${
                      activeTab === "projects"
                        ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50"
                        : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/30"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Briefcase size={16} />
                      Loyihalar
                    </div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab("events")}
                    className={`flex-1 px-6 py-4 text-center font-medium transition-all duration-300 ${
                      activeTab === "events"
                        ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50"
                        : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/30"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Calendar size={16} />
                      Tadbirlar
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Discussions */}
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
                      whileHover={{ scale: 1.02, y: -2 }}
                      onClick={() => {
                        alert(`"${discussion.title}" mavzusini ko'rish funksiyasi tez orada qo'shiladi!`);
                      }}
                      className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <UserCircle size={24} className="text-emerald-600" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-gray-900 text-lg hover:text-emerald-600 cursor-pointer transition-colors">
                                {discussion.title}
                              </h3>
                              <span className={`text-xs px-3 py-1 rounded-full ${
                                discussion.category === "Frontend" ? "bg-blue-100 text-blue-700" : 
                                discussion.category === "AI/ML" ? "bg-purple-100 text-purple-700" : 
                                "bg-emerald-100 text-emerald-700"
                              }`}>
                                {discussion.category}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                              <span className="font-medium text-gray-700">{discussion.author.name}</span>
                              <span>•</span>
                              <span>{discussion.author.role}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {discussion.time}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <MessageCircle size={14} />
                                {discussion.replies} javob
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye size={14} />
                                {discussion.views} ko'rish
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart size={14} />
                                {discussion.likes} yoqdi
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                              {discussion.tags.map((tag) => (
                                <span key={tag} className="text-xs bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 px-2 py-1 rounded-full border border-emerald-200/50">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-gray-400 hover:text-emerald-600 transition-colors"
                            >
                              <Heart size={16} />
                            </motion.button>
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-gray-400 hover:text-emerald-600 transition-colors"
                            >
                              <Bookmark size={16} />
                            </motion.button>
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-gray-400 hover:text-emerald-600 transition-colors"
                            >
                              <Share2 size={16} />
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
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Workflow size={40} className="text-emerald-600" />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Loyihalar tez orada</h3>
                  <p className="text-gray-600">Jamiyat a'zolari bilan loyihalarda hamkorlik qilish imkoniyati</p>
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
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-emerald-600 transition-colors">{event.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {event.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {event.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin size={14} />
                                {event.location}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs px-3 py-1 rounded-full ${
                              event.type === "Meetup" ? "bg-blue-100 text-blue-700" :
                              event.type === "Workshop" ? "bg-purple-100 text-purple-700" :
                              "bg-emerald-100 text-emerald-700"
                            }`}>
                              {event.type}
                            </span>
                            <div className="text-sm text-gray-500 mt-1">{event.attendees} ishtirokchi</div>
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
          <div className="space-y-6">
            {/* Categories */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-100/30 to-blue-100/30 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles size={16} className="text-emerald-600" />
                  Kategoriyalar
                </h3>
                <div className="space-y-3">
                  {COMMUNITY_DATA.categories.map((category, index) => (
                    <motion.div 
                      key={category.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      onClick={() => {
                        setSelectedCategory(category.name);
                        alert(`${category.name} kategoriyasini ko'rish funksiyasi tez orada qo'shiladi!`);
                      }}
                      className="group flex items-center justify-between p-3 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 cursor-pointer transition-all duration-300 border border-transparent hover:border-emerald-200/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <category.icon size={16} className="text-current" />
                        </div>
                        <span className="font-medium text-gray-700 group-hover:text-emerald-600 transition-colors">{category.name}</span>
                      </div>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">{category.count}</span>
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
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award size={16} className="text-emerald-600" />
                  Eng faol a'zolar
                </h3>
                <div className="space-y-4">
                  {COMMUNITY_DATA.topMembers.map((member, index) => (
                    <motion.div 
                      key={member.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      onClick={() => {
                        alert(`${member.name} profilini ko'rish funksiyasi tez orada qo'shiladi!`);
                      }}
                      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 cursor-pointer transition-all duration-300 border border-transparent hover:border-emerald-200/50"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <UserCircle size={24} className="text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm group-hover:text-emerald-600 transition-colors">{member.name}</h4>
                        <p className="text-xs text-gray-500">{member.role}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Star size={12} className="text-yellow-500" />
                          <span className="text-xs text-gray-500">{member.reputation} ball</span>
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
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg relative overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-100/30 to-blue-100/30 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap size={16} className="text-emerald-600" />
                  Tezkor harakatlar
                </h3>
                <div className="space-y-3">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      alert("Yangi mavzu yaratish funksiyasi tez orada qo'shiladi!");
                    }}
                    className="group w-full bg-gradient-to-r from-[#10B981] to-[#34D399] text-white py-3 rounded-xl font-medium overflow-hidden transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_8px_20px_rgba(16,185,129,0.2)]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#34D399] to-[#10B981] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Plus size={16} className="relative z-10" />
                    <span className="relative z-10">Yangi mavzu yaratish</span>
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      alert("Mentor topish funksiyasi tez orada qo'shiladi!");
                    }}
                    className="w-full bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 py-3 rounded-xl font-medium hover:from-emerald-200 hover:to-blue-200 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Users size={16} />
                    Mentor topish
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      alert("Loyiha hamkori topish funksiyasi tez orada qo'shiladi!");
                    }}
                    className="w-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 py-3 rounded-xl font-medium hover:from-purple-200 hover:to-pink-200 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Workflow size={16} />
                    Loyiha hamkori
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