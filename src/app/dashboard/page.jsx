"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Briefcase,
  MessagesSquare,
  Settings,
  LogOut,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  User,
  Plus,
  Edit,
  Trash2,
  Bell,
  Search,
  TrendingUp,
  Users,
  Calendar,
  Target,
  Award,
  Zap,
  Star,
  ArrowUpRight,
  Eye,
  Download,
  Share2,
  X,
} from "lucide-react";


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

const LANGS = [
  { value: "en", label: "English" },
  { value: "uz", label: "O'zbekcha" },
];

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Portfolio", icon: FolderOpen },
  { label: "Jobs", icon: Briefcase },
  { label: "Test", icon: FileText },
  { label: "Chats", icon: MessagesSquare },
  { label: "Settings", icon: Settings },
];

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    avatar_url: "",
    lang: "en",
    github: "",
    telegram: "",
  });
  const [active, setActive] = useState("Dashboard");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [testMenu, setTestMenu] = useState(false);
  const [onlineCount, setOnlineCount] = useState(1);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  
  // Portfolio state
  const [portfolio, setPortfolio] = useState(null);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState({});

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
      // Profil ma'lumotlari (users jadvali)
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
      if (data) {
        setProfile({
          name: data.name || "",
          email: user.email,
          bio: data.bio || "",
          avatar_url: data.avatar_url || "",
          lang: data.lang || "en",
          github: data.github || "",
          telegram: data.telegram || "",
        });
      } else {
        setProfile((p) => ({ ...p, email: user.email }));
      }
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
    const { error } = await supabase
      .from("users")
      .upsert({
        id: user.id,
        name: profile.name,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        lang: profile.lang,
        github: profile.github,
        telegram: profile.telegram,
      });
    if (!error) setSuccess("Profile updated!");
    else setError("Error updating profile");
    setLoading(false);
  };

  // Logout
  const handleLogout = async () => {
    await fetch("/api/logout");
    window.location.href = "/login";
  };

  useEffect(() => {
    const fetchOnline = async () => {
      try {
        const res = await fetch("/api/users");
        if (res.ok) {
          const data = await res.json();
          setOnlineCount(data.online);
        }
      } catch {}
    };
    fetchOnline();
    const interval = setInterval(fetchOnline, 20000);
    return () => clearInterval(interval);
  }, []);

  // Chat xabarlarini olish
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/chats");
        if (res.ok) {
          const messages = await res.json();
          setChatMessages(messages);
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
        const response = await fetch('/api/portfolio');
        if (response.ok) {
          const data = await response.json();
          setPortfolio(data);
        }
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoadingPortfolio(false);
      }
    };

    if (active === "Portfolio") {
      fetchPortfolio();
    }
  }, [active]);

  // Portfolio yangilash
  const handlePortfolioUpdate = async (updatedData) => {
    try {
      const response = await fetch('/api/portfolio', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const updatedPortfolio = await response.json();
        setPortfolio(updatedPortfolio);
        setShowEditModal(false);
        setEditingPortfolio({});
      }
    } catch (error) {
      console.error('Error updating portfolio:', error);
    }
  };

  // Xabar yuborish
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sendingMessage) return;

    setSendingMessage(true);
    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage.trim() }),
      });

      if (res.ok) {
        setNewMessage("");
        // Xabarlarni qayta yuklash
        const messagesRes = await fetch("/api/chats");
        if (messagesRes.ok) {
          const messages = await messagesRes.json();
          setChatMessages(messages);
        }
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/50">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#10B981] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );

  // Demo kontentlar
  const demoJobs = [
    { id: 1, title: "Frontend Developer", company: "TechSoft", status: "Applied", salary: "$80k-120k" },
    { id: 2, title: "AI Engineer", company: "AI Hub", status: "Interview", salary: "$100k-150k" },
  ];
  const demoTests = [
    { id: 1, title: "React Basics", score: 85, total: 100 },
    { id: 2, title: "AI Fundamentals", score: 92, total: 100 },
  ];
  const demoChats = [
    { id: 1, user: "Admin", last: "Welcome to FraiJob!", time: "2m ago", unread: 1 },
    { id: 2, user: "HR", last: "Interview scheduled.", time: "1h ago", unread: 0 },
  ];

  const stats = [
    { label: "Profile Views", value: "1,234", icon: Eye, change: "+12%", color: "blue" },
    { label: "Applications", value: "23", icon: Briefcase, change: "+8%", color: "green" },
    { label: "Test Score", value: "87%", icon: Award, change: "+5%", color: "purple" },
    { label: "Connections", value: "156", icon: Users, change: "+15%", color: "orange" },
  ];

  return (
    <div className="flex min-h-screen h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/50">
      {/* Enhanced Sidebar */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`transition-all duration-300 ${sidebarOpen ? "w-72" : "w-16"} flex flex-col justify-between ${sidebarOpen ? "p-6" : "p-2"} backdrop-blur-xl bg-white/80 border-r border-white/30 shadow-xl`}
      >
        <div>
          <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'} mb-8`}>
            <div className="flex items-center gap-3">
              <div className={`${sidebarOpen ? 'w-10 h-10' : 'w-8 h-8'} bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-xl flex items-center justify-center`}>
                <span className={`text-white font-bold ${sidebarOpen ? 'text-lg' : 'text-sm'}`}>F</span>
          </div>
              {sidebarOpen && <div className="text-xl font-bold text-gray-800">FraiJob</div>}
            </div>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map(({ label, icon: Icon }, index) => (
              <motion.button
                key={label}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActive(label)}
                className={`flex items-center w-full ${sidebarOpen ? 'px-4' : 'px-2'} ${sidebarOpen ? 'py-3' : 'py-2'} rounded-xl text-sm font-medium transition-all duration-300 ${
                  active === label
                    ? "bg-gradient-to-r from-[#10B981] to-[#34D399] text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100 hover:text-[#10B981]"
                } ${!sidebarOpen ? 'justify-center' : ''}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="ml-3">{label}</span>}
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Enhanced User Menu */}
        <div className="mt-8">
          <div className={`flex flex-col items-center gap-3 ${sidebarOpen ? 'p-4' : 'p-2'} rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200`}>
            <div className={`${sidebarOpen ? 'w-12 h-12' : 'w-10 h-10'} rounded-full bg-gradient-to-r from-[#10B981] to-[#34D399] flex items-center justify-center text-white font-bold shadow-lg`}>
              {profile.name ? (
                <span className={sidebarOpen ? 'text-lg' : 'text-sm'}>{profile.name[0].toUpperCase()}</span>
              ) : (
                <User size={sidebarOpen ? 20 : 16} />
              )}
          </div>
          {sidebarOpen && (
              <div className="text-center">
                <div className="font-semibold text-gray-800 text-sm">{profile.name}</div>
                <div className="text-gray-500 text-xs">{profile.email}</div>
            </div>
          )}
            <button
            onClick={handleLogout}
              className={`flex items-center ${sidebarOpen ? 'gap-2' : 'justify-center'} text-xs text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors duration-200`}
          >
              <LogOut className={sidebarOpen ? "w-4 h-4" : "w-5 h-5"} /> 
              {sidebarOpen && "Logout"}
          </button>
        </div>
        </div>

        {/* Sidebar Toggle Button - always visible at the bottom */}
        {/* Remove the toggle button from inside <motion.aside> */}
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Header */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl border-b border-white/30 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </button>
              <h1 className="text-2xl font-bold text-gray-800">{active}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users size={16} />
                <span>{onlineCount} online</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:bg-white transition-all duration-300"
                />
              </div>
              <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </motion.header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
        {active === "Dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <FadeInUp key={stat.label} delay={index * 0.1}>
                      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 bg-gradient-to-r from-${stat.color}-100 to-${stat.color}-200 rounded-xl flex items-center justify-center`}>
                            <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                            <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
              </div>
                        <div className="flex items-center gap-1 text-green-600 text-sm">
                          <TrendingUp size={16} />
                          <span>{stat.change}</span>
              </div>
            </div>
                    </FadeInUp>
                  ))}
          </div>

                {/* Recent Activity & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FadeInUp delay={0.4}>
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Briefcase size={16} className="text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-800">Applied to Frontend Developer</div>
                            <div className="text-xs text-gray-500">2 hours ago</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Award size={16} className="text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-800">Completed React Test</div>
                            <div className="text-xs text-gray-500">1 day ago</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </FadeInUp>

                  <FadeInUp delay={0.5}>
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <button className="p-4 rounded-xl bg-gradient-to-r from-[#10B981] to-[#34D399] text-white text-sm font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                          <Plus size={16} />
                          Add Project
                        </button>
                        <button className="p-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                          <Briefcase size={16} />
                          Find Jobs
                        </button>
                        <button className="p-4 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                          <FileText size={16} />
                          Take Test
                        </button>
                        <button className="p-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                          <Share2 size={16} />
                          Share Profile
                        </button>
                      </div>
                    </div>
                  </FadeInUp>
                </div>
              </motion.div>
            )}

            {active === "Portfolio" && (
              <motion.div
                key="portfolio"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 max-w-6xl mx-auto"
              >
                {loadingPortfolio ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="animate-spin w-8 h-8 border-4 border-[#10B981] border-t-transparent rounded-full"></div>
                  </div>
                                ) : (
                  <>
                    {/* Header Section - 2 Columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Profile Picture - Green Block */}
                  <FadeInUp delay={0.1}>
                    <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-2xl p-8 flex items-center justify-center shadow-lg">
                      <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold text-white border-2 border-white/30">
                        {portfolio?.name ? portfolio.name[0].toUpperCase() : (profile.name ? profile.name[0].toUpperCase() : "U")}
                      </div>
                    </div>
                  </FadeInUp>

                  {/* Name and Title - Purple Block */}
                  <FadeInUp delay={0.2}>
                    <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
                      <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <h1 className="text-3xl font-bold mb-2">{portfolio?.name || profile.name || "User Name"}</h1>
                      <p className="text-lg text-purple-100 mb-2">{portfolio?.title || "Full-Stack Developer & UI/UX Designer"}</p>
                      <p className="text-purple-200 mb-4">{portfolio?.bio || profile.bio || "Passionate about creating amazing digital experiences"}</p>
                      <button
                        onClick={() => {
                          setEditingPortfolio(portfolio || {});
                          setShowEditModal(true);
                        }}
                        className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-300 text-sm font-medium"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </FadeInUp>
                </div>

                {/* Contact Information - Black Block */}
                <FadeInUp delay={0.3}>
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="text-sm">{portfolio?.email || profile.email}</span>
                        </div>
                                            <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <span className="text-sm">{portfolio?.phone || profile.telegram ? `@${profile.telegram}` : "+998 90 123 45 67"}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm text-green-400">Available</span>
                      </div>
                    </div>
                  </div>
                </FadeInUp>

                {/* Education - Orange Block */}
                <FadeInUp delay={0.4}>
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
                    <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-6">Education</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-start gap-3 bg-white/10 rounded-xl p-4">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-1">Bachelor in Computer Science</h3>
                          <p className="text-orange-100 mb-1">Tashkent University</p>
                          <p className="text-orange-200 text-sm">2020-2024</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-white/10 rounded-xl p-4">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-1">Web Development Bootcamp</h3>
                          <p className="text-orange-100 mb-1">Udemy & Coursera</p>
                          <p className="text-orange-200 text-sm">2023-2024</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeInUp>

                {/* Mid Section - 3 Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Experience - Dark Blue Block */}
                  <FadeInUp delay={0.5}>
                    <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg h-full">
                      <div className="absolute top-3 right-3 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                        <Briefcase size={18} />
                      </div>
                      <h2 className="text-xl font-bold mb-4">Experience</h2>
                      <div className="space-y-4">
                        <div className="bg-white/10 rounded-lg p-3">
                          <h3 className="font-bold text-base mb-1">Frontend Developer</h3>
                          <p className="text-blue-200 text-sm mb-1">TechSoft • Aug 2023</p>
                          <p className="text-blue-300 text-xs">Tashkent, Uzbekistan</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3">
                          <h3 className="font-bold text-base mb-1">UI/UX Designer</h3>
                          <p className="text-blue-200 text-sm mb-1">Design Studio • Jan 2023</p>
                          <p className="text-blue-300 text-xs">Remote</p>
                        </div>
                        <div className="bg-white/10 rounded-lg p-3">
                          <h3 className="font-bold text-base mb-1">Freelance Developer</h3>
                          <p className="text-blue-200 text-sm mb-1">Upwork • 2022-Present</p>
                          <p className="text-blue-300 text-xs">Global</p>
                        </div>
                      </div>
                    </div>
                  </FadeInUp>

                  {/* Skills - Light Grey Block */}
                  <FadeInUp delay={0.6}>
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 text-gray-800 shadow-lg h-full">
                      <h2 className="text-xl font-bold mb-4">Skills</h2>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                          <div className="text-xl font-bold text-blue-600 mb-1">React</div>
                          <div className="text-xs text-gray-500">Frontend</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                          <div className="text-xl font-bold text-green-600 mb-1">Node.js</div>
                          <div className="text-xs text-gray-500">Backend</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                          <div className="text-xl font-bold text-purple-600 mb-1">Next.js</div>
                          <div className="text-xs text-gray-500">Full-Stack</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                          <div className="text-xl font-bold text-orange-600 mb-1">TypeScript</div>
                          <div className="text-xs text-gray-500">Language</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                          <div className="text-xl font-bold text-red-600 mb-1">MongoDB</div>
                          <div className="text-xs text-gray-500">Database</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                          <div className="text-xl font-bold text-indigo-600 mb-1">Tailwind</div>
                          <div className="text-xs text-gray-500">CSS Framework</div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-3 text-center">There are more to add in future</p>
                    </div>
                  </FadeInUp>

                  {/* Expertise - Light Purple Block */}
                  <FadeInUp delay={0.7}>
                    <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl p-6 text-white shadow-lg h-full">
                      <h2 className="text-xl font-bold mb-4">Expertise</h2>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Frontend Development</span>
                            <span className="text-sm font-bold">90%</span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2">
                            <div className="bg-white h-2 rounded-full transition-all duration-1000" style={{ width: '90%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Backend Development</span>
                            <span className="text-sm font-bold">85%</span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2">
                            <div className="bg-white h-2 rounded-full transition-all duration-1000" style={{ width: '85%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">UI/UX Design</span>
                            <span className="text-sm font-bold">80%</span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2">
                            <div className="bg-white h-2 rounded-full transition-all duration-1000" style={{ width: '80%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Mobile Development</span>
                            <span className="text-sm font-bold">75%</span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2">
                            <div className="bg-white h-2 rounded-full transition-all duration-1000" style={{ width: '75%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </FadeInUp>
                </div>

                {/* Bottom Section - 2 Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* References - Light Green Block */}
                  <FadeInUp delay={0.8}>
                    <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-6 text-gray-800 relative overflow-hidden shadow-lg">
                      <div className="absolute top-3 right-3 w-10 h-10 bg-green-300 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold mb-4">References</h2>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <h3 className="font-bold text-base mb-1">John Smith</h3>
                          <p className="text-sm text-gray-600 mb-1">Senior Developer at TechSoft</p>
                          <p className="text-xs text-gray-500 mb-1">+998 90 123 45 67</p>
                          <p className="text-xs text-gray-500">john@techsoft.com</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <h3 className="font-bold text-base mb-1">Sarah Johnson</h3>
                          <p className="text-sm text-gray-600 mb-1">UI/UX Lead at Design Studio</p>
                          <p className="text-xs text-gray-500 mb-1">+998 90 987 65 43</p>
                          <p className="text-xs text-gray-500">sarah@designstudio.com</p>
                        </div>
                      </div>
                    </div>
                  </FadeInUp>

                  {/* Stats - Light Blue Block */}
                  <FadeInUp delay={0.9}>
                    <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
                      <div className="absolute top-3 right-3 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                        <TrendingUp size={20} />
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-2">15K+</div>
                        <div className="text-lg mb-1">Profile Views</div>
                        <div className="text-sm text-blue-100 mb-4">Featured Projects</div>
                        <div className="flex items-center justify-center gap-2 bg-white/10 rounded-lg p-3">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                          <span className="text-sm">www.fraijob.com/profile</span>
                        </div>
                      </div>
                    </div>
                  </FadeInUp>
                </div>
                </>
                )}
              </motion.div>
            )}

        {active === "Jobs" && (
              <motion.div
                key="jobs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Job Applications</h2>
                  <button className="bg-gradient-to-r from-[#10B981] to-[#34D399] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                    <Plus size={20} />
                    Apply for Job
                  </button>
                  </div>

                <div className="space-y-4">
                  {demoJobs.map((job, index) => (
                    <FadeInUp key={job.id} delay={index * 0.1}>
                      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                            <p className="text-gray-600">{job.company}</p>
                            <p className="text-sm text-gray-500">{job.salary}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              job.status === "Applied" 
                                ? "bg-blue-100 text-blue-700" 
                                : "bg-green-100 text-green-700"
                            }`}>
                              {job.status}
                            </span>
                            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                              <Eye size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </FadeInUp>
                  ))}
          </div>
              </motion.div>
        )}

        {active === "Test" && (
              <motion.div
                key="test"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Skill Tests</h2>
                  <button className="bg-gradient-to-r from-[#10B981] to-[#34D399] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2">
                    <Zap size={20} />
                    Take New Test
                  </button>
                  </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {demoTests.map((test, index) => (
                    <FadeInUp key={test.id} delay={index * 0.1}>
                      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">{test.title}</h3>
                          <div className="text-2xl font-bold text-[#10B981]">{test.score}%</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                          <div 
                            className="bg-gradient-to-r from-[#10B981] to-[#34D399] h-2 rounded-full transition-all duration-500"
                            style={{ width: `${test.score}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Score: {test.score}/{test.total}</span>
                          <button className="text-[#10B981] hover:text-[#0ea672] transition-colors duration-200">
                            <Download size={16} />
                          </button>
                        </div>
                      </div>
                    </FadeInUp>
                  ))}
          </div>
              </motion.div>
        )}

        {active === "Chats" && (
              <motion.div
                key="chats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full flex gap-6"
              >
                {/* Left Sidebar - Chat List */}
                <div className="w-80 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                    <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-300">
                      Create New Group
                    </button>
                  </div>

                  {/* Search */}
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:bg-white transition-all duration-300"
                    />
                  </div>

                  {/* Messages List */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-600 mb-3">Messages</h3>
                    {[
                      { name: "Jerome Bell", message: "Hello, how are you!", time: "Just Now", unread: 2, avatar: "J" },
                      { name: "Guy Hawkins", message: "Thanks! Looks great!", time: "1 min ago", unread: 0, avatar: "G" },
                      { name: "Marvin McKinney", message: "Can you find a house for...", time: "1 min ago", unread: 3, avatar: "M" },
                      { name: "Darlene Robertson", message: "Sent me over the latest....", time: "3 mins ago", unread: 0, avatar: "D" },
                      { name: "Darrell Steward", message: "I will give you a nice com...", time: "15 mins ago", unread: 0, avatar: "D" },
                      { name: "Arlene McCoy", message: "Such an affordable house", time: "20 mins ago", unread: 0, avatar: "A" },
                      { name: "Kristin Watson", message: "I get my commission!", time: "1 day ago", unread: 0, avatar: "K" },
                    ].map((chat, index) => (
                      <motion.div
                        key={chat.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200"
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {chat.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-800 text-sm truncate">{chat.name}</h4>
                            <span className="text-xs text-gray-500">{chat.time}</span>
                          </div>
                          <p className="text-xs text-gray-600 truncate">{chat.message}</p>
                        </div>
                        {chat.unread > 0 && (
                          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {chat.unread}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Groups */}
                  <div className="mt-6 space-y-2">
                    <h3 className="text-sm font-semibold text-gray-600 mb-3">Groups</h3>
                    {[
                      { name: "Design Team", message: "I will have a look today.", time: "1 min ago", unread: 0, avatar: "D" },
                      { name: "Human Resource Department", message: "I've just published the....", time: "2 mins ago", unread: 0, avatar: "H" },
                      { name: "Campaigns", message: "", time: "10 mins ago", unread: 0, avatar: "C" },
                    ].map((group, index) => (
                      <motion.div
                        key={group.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index + 7) * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200"
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {group.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-800 text-sm truncate">{group.name}</h4>
                            <span className="text-xs text-gray-500">{group.time}</span>
                          </div>
                          {group.message && <p className="text-xs text-gray-600 truncate">{group.message}</p>}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Middle - Chat Area */}
                <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg flex flex-col">
                  {/* Chat Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        M
                  </div>
                  <div>
                        <h3 className="font-semibold text-gray-800">Marketing Team</h3>
                        <p className="text-sm text-gray-500">24 members</p>
                    </div>
                  </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </button>
                      <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                </div>
                </div>

                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {chatMessages.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-full flex items-center justify-center mx-auto mb-4">
                          <MessagesSquare className="w-8 h-8 text-white" />
            </div>
                        <p className="text-gray-500 text-lg font-medium">No messages yet</p>
                        <p className="text-gray-400 text-sm">Start the conversation!</p>
                      </div>
                    ) : (
                      chatMessages.map((msg, index) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex ${msg.user_id === user?.id ? "justify-end" : "justify-start"}`}
                        >
                          <div className="flex items-start gap-3 max-w-[70%]">
                            {msg.user_id !== user?.id && (
                              <div className="w-8 h-8 bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                                {msg.user_name?.[0]?.toUpperCase() || "U"}
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {msg.user_id !== user?.id && (
                                  <span className="font-medium text-gray-800 text-sm">{msg.user_name}</span>
                                )}
                                <span className="text-xs text-gray-500">
                                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <div className={`px-4 py-3 text-sm break-words whitespace-pre-line border shadow-sm rounded-2xl ${
                                msg.user_id === user?.id
                                  ? "bg-gradient-to-r from-[#10B981] to-[#34D399] text-white border-[#10B981]"
                                  : "bg-white text-gray-900 border-gray-200"
                              }`}>
                                {msg.message}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                                            ))
                    )}
                  </div>

                  {/* Chat Input */}
                  <div className="p-6 border-t border-gray-200">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                      <button type="button" className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      </button>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all duration-300"
                          disabled={sendingMessage}
                        />
                      </div>
                      <button 
                        type="submit"
                        disabled={!newMessage.trim() || sendingMessage}
                        className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
                      >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right Sidebar - Group Information */}
                <div className="w-80 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-6">Group Information</h3>
                  
                  {/* Group Profile */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      M
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Marketing Team</h4>
                      <p className="text-sm text-gray-500">24 members</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between mb-6">
                    <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                      <Bell className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                      <Users className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                      <Settings className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Members */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">Members</h4>
                      <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: 8 }, (_, i) => (
                        <div key={i} className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {String.fromCharCode(65 + i)}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Images */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">Images</h4>
                      <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {Array.from({ length: 6 }, (_, i) => (
                        <div key={i} className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg"></div>
                      ))}
                    </div>
                  </div>

                  {/* Files */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">Files</h4>
                      <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
                    </div>
                    <div className="space-y-2">
                      {[
                        { name: "642 TB-DSHN_0001.pdf", size: "3.58MB", date: "12 Nov, 2023" },
                        { name: "Report_week42.mp4", size: "66.75MB", date: "12 Nov, 2023" },
                        { name: "Marketing Campaign Brief.word", size: "2.21MB", date: "12 Nov, 2023" },
                      ].map((file, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{file.size} • {file.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">Links</h4>
                      <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
                    </div>
                    <div className="space-y-2">
                      {[
                        { title: "Neuro Marketing: How brands are...", platform: "Youtube", date: "12 Nov, 2023" },
                        { title: "Accomplish More Together", platform: "Confluence", date: "12 Nov, 2023" },
                        { title: "How Apple and Nike have branded....", platform: "Youtube", date: "12 Nov, 2023" },
                      ].map((link, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{link.title}</p>
                            <p className="text-xs text-gray-500">{link.platform} • {link.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

        {active === "Settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>

                <FadeInUp>
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg">
            <form onSubmit={handleProfileSave} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                            type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all duration-300"
                />
              </div>
              <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
                />
              </div>
                      </div>
                      
              <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all duration-300"
                />
              </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                <input
                            type="url"
                  name="github"
                  value={profile.github}
                  onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all duration-300"
                />
              </div>
              <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Telegram</label>
                <input
                            type="text"
                  name="telegram"
                  value={profile.telegram}
                  onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all duration-300"
                />
              </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                          <select
                            name="lang"
                            value={profile.lang}
                            onChange={handleChange}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all duration-300"
                          >
                            {LANGS.map((lang) => (
                              <option key={lang.value} value={lang.value}>
                                {lang.label}
                              </option>
                            ))}
                          </select>
              </div>
                  <button
                type="submit"
                disabled={loading}
                          className="bg-gradient-to-r from-[#10B981] to-[#34D399] text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                  >
                          {loading ? "Saving..." : "Save Changes"}
                  </button>
                      </div>

                      {success && (
                        <div className="p-4 bg-green-100 text-green-700 rounded-xl">
                          {success}
                        </div>
                      )}
                      {error && (
                        <div className="p-4 bg-red-100 text-red-700 rounded-xl">
                          {error}
                        </div>
                      )}
            </form>
          </div>
                </FadeInUp>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Portfolio Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Edit Portfolio</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              handlePortfolioUpdate(editingPortfolio);
            }}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={editingPortfolio.name || portfolio?.name || ''}
                      onChange={(e) => setEditingPortfolio({...editingPortfolio, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={editingPortfolio.title || portfolio?.title || ''}
                      onChange={(e) => setEditingPortfolio({...editingPortfolio, title: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={editingPortfolio.bio || portfolio?.bio || ''}
                    onChange={(e) => setEditingPortfolio({...editingPortfolio, bio: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={editingPortfolio.phone || portfolio?.phone || ''}
                      onChange={(e) => setEditingPortfolio({...editingPortfolio, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      value={editingPortfolio.website || portfolio?.website || ''}
                      onChange={(e) => setEditingPortfolio({...editingPortfolio, website: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                    <input
                      type="url"
                      value={editingPortfolio.github_url || portfolio?.github_url || ''}
                      onChange={(e) => setEditingPortfolio({...editingPortfolio, github_url: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                    <input
                      type="url"
                      value={editingPortfolio.linkedin_url || portfolio?.linkedin_url || ''}
                      onChange={(e) => setEditingPortfolio({...editingPortfolio, linkedin_url: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#10B981] to-[#34D399] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
