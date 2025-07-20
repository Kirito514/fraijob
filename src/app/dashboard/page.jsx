'use client';

import { useState } from 'react';

export default function DashboardPage({ user }) {
  // user: { name, email, photo, profession, level, xp }
  const [activeTab, setActiveTab] = useState('overview');

  // Namuna uchun dummy statlar
  const stats = {
    tests: 5,
    projects: 3,
    resumes: 2,
    xp: user?.xp || 1260,
    level: user?.level || 3,
    profession: user?.profession || "Kasb kiritilmagan",
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-[#10B981]">FraiJob Dashboard</div>
        <div className="flex items-center gap-4">
          <span className="font-medium">{user?.name || user?.email || "Foydalanuvchi"}</span>
          {user?.photo && (
            <img src={user.photo} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-10 px-2 flex flex-col md:flex-row gap-8">
        {/* Profilni ko‘rish */}
        <aside className="md:w-1/3 w-full mb-8 md:mb-0">
          <div className="bg-white rounded-2xl shadow-xl p-7 flex flex-col items-center">
            {user?.photo ? (
              <img src={user.photo} alt="Profil rasmi" className="w-24 h-24 rounded-full mb-3 object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-[#D1FAE5] flex items-center justify-center text-3xl font-bold text-[#047857] mb-3">
                {user?.name
                  ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase()
                  : (user?.email || "F")}
              </div>
            )}
            <div className="text-xl font-bold">{user?.name || "Ism kiritilmagan"}</div>
            <div className="text-gray-500">{user?.email}</div>
            <div className="text-sm text-gray-600 mt-1">{stats.profession}</div>
            <div className="mt-4 w-full">
              <div className="flex justify-between text-sm">
                <span>Level {stats.level}</span>
                <span>{stats.xp} XP</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{ width: `${Math.min((stats.xp % 1000) / 10, 100)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1 text-right">
                Next level: {1000 - (stats.xp % 1000)} XP
              </div>
            </div>
          </div>
        </aside>

        {/* Dashboard Contents */}
        <section className="flex-1">
          {/* Tabs */}
          <nav className="flex gap-3 mb-8 border-b">
            <button 
              className={`py-2 px-4 ${activeTab === 'overview' ? 'border-b-2 border-[#10B981] text-[#10B981] font-bold' : 'text-gray-700'}`}
              onClick={() => setActiveTab('overview')}>
              Umumiy
            </button>
            <button 
              className={`py-2 px-4 ${activeTab === 'progress' ? 'border-b-2 border-[#10B981] text-[#10B981] font-bold' : 'text-gray-700'}`}
              onClick={() => setActiveTab('progress')}>
              O‘sish
            </button>
            <button 
              className={`py-2 px-4 ${activeTab === 'projects' ? 'border-b-2 border-[#10B981] text-[#10B981] font-bold' : 'text-gray-700'}`}
              onClick={() => setActiveTab('projects')}>
              Loyihalar
            </button>
          </nav>

          {/* Tab contents */}
          {activeTab === 'overview' && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Salom, {user?.name || user?.email || "foydalanuvchi"}!</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Skill Testlar" value={stats.tests} desc="Yakunlangan testlar" />
                <StatCard title="Portfolio loyihalar" value={stats.projects} desc="Portfolio loyihalar soni" />
                <StatCard title="Rezume" value={stats.resumes} desc="Yaratilgan rezumelar" />
              </div>
            </section>
          )}

          {activeTab === 'progress' && (
            <section>
              <h2 className="text-2xl font-bold mb-4">O‘sish</h2>
              <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center">
                <p className="text-xl font-semibold mb-2">Level: {stats.level}</p>
                <p>XP: {stats.xp}</p>
                <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                  <div
                    className="bg-green-500 h-4 rounded-full"
                    style={{ width: `${(stats.xp % 1000) / 10}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Keyingi bosqich uchun {1000 - (stats.xp % 1000)} XP kerak
                </p>
              </div>
            </section>
          )}

          {activeTab === 'projects' && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Portfolio Loyihalar</h2>
              <ul className="space-y-4">
                <li className="bg-white p-4 rounded shadow">E-commerce platformasi</li>
                <li className="bg-white p-4 rounded shadow">Blog sayt</li>
                <li className="bg-white p-4 rounded shadow">Yangi loyiha (namuna)</li>
              </ul>
            </section>
          )}
        </section>
      </main>
    </div>
  );
}

function StatCard({ title, value, desc }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center">
      <div className="text-3xl font-bold text-[#10B981] mb-2">{value}</div>
      <div className="font-semibold mb-1">{title}</div>
      <div className="text-gray-500 text-sm">{desc}</div>
    </div>
  );
}