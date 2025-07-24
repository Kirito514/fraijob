"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
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
} from "lucide-react";

const LANGS = [
  { value: "en", label: "English" },
  { value: "uz", label: "O‘zbekcha" },
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

  // Foydalanuvchi va profilni Supabase'dan olish
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!user || userError) {
        window.location.href = "/login";
        return;
      }
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
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (!user) return <div className="p-8">Loading...</div>;

  // Demo kontentlar
  const demoPortfolio = [
    { id: 1, title: "AI Resume Builder", desc: "React, Node.js, OpenAI" },
    { id: 2, title: "Job Tracker", desc: "Next.js, Supabase, Tailwind" },
  ];
  const demoJobs = [
    { id: 1, title: "Frontend Developer", company: "TechSoft", status: "Applied" },
    { id: 2, title: "AI Engineer", company: "AI Hub", status: "Interview" },
  ];
  const demoTests = [
    { id: 1, title: "React Basics", score: 85 },
    { id: 2, title: "AI Fundamentals", score: 92 },
  ];
  const demoChats = [
    { id: 1, user: "Admin", last: "Welcome to FraiJob!" },
    { id: 2, user: "HR", last: "Interview scheduled." },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Sidebar */}
      <aside className={`transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"} flex flex-col justify-between p-4 backdrop-blur-lg bg-white/60 border-r border-white/30 shadow-sm`}>
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="text-xl font-bold text-green-600">FraiJob</div>
            <button onClick={() => setSidebarOpen((v) => !v)} className="md:hidden p-1 rounded hover:bg-white/40">
              {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
            </button>
          </div>
          <nav className="space-y-2">
            {menuItems.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setActive(label)}
                className={`flex items-center w-full px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  active === label
                    ? "bg-green-200/60 text-green-800"
                    : "text-gray-700 hover:bg-white/40"
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {sidebarOpen && label}
              </button>
            ))}
          </nav>
        </div>
        {/* Foydalanuvchi menyusi */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-green-700">
            {profile.name ? profile.name[0] : <User />}
          </div>
          {sidebarOpen && (
            <div className="text-xs text-gray-700 text-center">
              <div className="font-semibold">{profile.name}</div>
              <div className="text-gray-500">{profile.email}</div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="mt-2 flex items-center gap-2 text-xs text-red-600 hover:bg-white/40 px-3 py-1 rounded-md"
          >
            <LogOut className="w-4 h-4" /> {sidebarOpen && "Logout"}
          </button>
        </div>
      </aside>
      {/* Asosiy kontent */}
      <main className="flex-1 p-8">
        {active === "Dashboard" && (
          <div className="bg-white/80 rounded-xl shadow-lg p-8 border border-white/30">
            <h1 className="text-2xl font-semibold text-green-800 mb-2">Welcome, {profile.name || profile.email}!</h1>
            <p className="text-gray-700 mb-4">Quick stats and shortcuts:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow p-4 text-center">
                <div className="text-2xl font-bold text-green-700">{demoPortfolio.length}</div>
                <div className="text-xs text-gray-500">Portfolio</div>
              </div>
              <div className="bg-white rounded-xl shadow p-4 text-center">
                <div className="text-2xl font-bold text-green-700">{demoJobs.length}</div>
                <div className="text-xs text-gray-500">Jobs</div>
              </div>
              <div className="bg-white rounded-xl shadow p-4 text-center">
                <div className="text-2xl font-bold text-green-700">{demoTests.length}</div>
                <div className="text-xs text-gray-500">Tests</div>
              </div>
              <div className="bg-white rounded-xl shadow p-4 text-center">
                <div className="text-2xl font-bold text-green-700">{demoChats.length}</div>
                <div className="text-xs text-gray-500">Chats</div>
              </div>
            </div>
          </div>
        )}
        {active === "Portfolio" && (
          <div className="bg-white/80 rounded-xl shadow-lg p-8 border border-white/30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Portfolio</h2>
              <button className="flex items-center gap-1 text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200"><Plus className="w-4 h-4" />Add</button>
            </div>
            <ul className="divide-y divide-gray-200">
              {demoPortfolio.map((item) => (
                <li key={item.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.desc}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1 rounded hover:bg-gray-100"><Edit className="w-4 h-4" /></button>
                    <button className="p-1 rounded hover:bg-red-100"><Trash2 className="w-4 h-4 text-red-600" /></button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {active === "Jobs" && (
          <div className="bg-white/80 rounded-xl shadow-lg p-8 border border-white/30">
            <h2 className="text-xl font-bold mb-4">Jobs</h2>
            <ul className="divide-y divide-gray-200">
              {demoJobs.map((job) => (
                <li key={job.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{job.title}</div>
                    <div className="text-xs text-gray-500">{job.company}</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">{job.status}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {active === "Test" && (
          <div className="bg-white/80 rounded-xl shadow-lg p-8 border border-white/30">
            <h2 className="text-xl font-bold mb-4">Tests</h2>
            <ul className="divide-y divide-gray-200">
              {demoTests.map((test) => (
                <li key={test.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{test.title}</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">{test.score} %</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {active === "Chats" && (
          <div className="bg-white/80 rounded-xl shadow-lg p-8 border border-white/30">
            <h2 className="text-xl font-bold mb-4">Chats</h2>
            <ul className="divide-y divide-gray-200">
              {demoChats.map((chat) => (
                <li key={chat.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{chat.user}</div>
                  </div>
                  <span className="text-xs text-gray-500">{chat.last}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {active === "Settings" && (
          <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-[#17424D]">Profile Settings</h2>
            <form onSubmit={handleProfileSave} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg text-sm bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Avatar URL</label>
                <input
                  name="avatar_url"
                  value={profile.avatar_url}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Language</label>
                <select
                  name="lang"
                  value={profile.lang}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                >
                  {LANGS.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">GitHub</label>
                <input
                  name="github"
                  value={profile.github}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telegram</label>
                <input
                  name="telegram"
                  value={profile.telegram}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#10B981] text-white py-3 rounded-lg font-semibold hover:bg-[#0ea672] transition flex items-center justify-center gap-2"
              >
                {loading ? "Saving..." : "Save changes"}
              </button>
              {success && <div className="text-green-600 text-sm">{success}</div>}
              {error && <div className="text-red-600 text-sm">{error}</div>}
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
