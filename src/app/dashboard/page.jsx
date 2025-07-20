'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged, updateProfile, signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import {
  Home,
  FileText,
  Briefcase,
  LineChart,
  LogOut,
  Layers3,
  Pencil,
} from 'lucide-react'

// Modal for editing profile
function EditProfileModal({ onClose, user, onUpdate }) {
  const [name, setName] = useState(user?.displayName || '')
  const [photo, setPhoto] = useState(user?.photoURL || '')
  const [profession, setProfession] = useState(user?.customData?.profession || '')
  const [file, setFile] = useState(null)

  const handleUpdate = async () => {
    const photoURL = file ? URL.createObjectURL(file) : photo
    await updateProfile(auth.currentUser, {
      displayName: name,
      photoURL,
    })

    onUpdate({ profession })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Profilni o‘zgartirish</h2>
        <div className="space-y-2">
          <label className="text-sm text-gray-600 block">Ism</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border px-3 py-2 rounded-md" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-600 block">Kasbingiz</label>
          <input type="text" value={profession} onChange={e => setProfession(e.target.value)} className="w-full border px-3 py-2 rounded-md" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-600 block">Profil rasmi (URL)</label>
          <input type="text" value={photo} onChange={e => setPhoto(e.target.value)} className="w-full border px-3 py-2 rounded-md" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-600 block">Yoki rasm yuklang</label>
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} className="w-full border px-3 py-2 rounded-md" />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Bekor qilish</Button>
          <Button className="bg-[#10B981] text-white hover:bg-[#0e9e6e]" onClick={handleUpdate}>Saqlash</Button>
        </div>
      </div>
    </div>
  )
}

// Main dashboard component
export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [profession, setProfession] = useState('')
  const [level, setLevel] = useState(1)
  const [xp, setXp] = useState(420)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      if (!currentUser) {
        router.push('/login')
      } else {
        setUser(currentUser)
      }
    })

    return () => unsubscribe()
  }, [router])

  if (!user) return <div className="min-h-screen flex items-center justify-center">⏳ Yuklanmoqda...</div>

  const handleLogout = async () => {
    await signOut(auth)
    document.cookie = 'token=; Max-Age=0; path=/;' // 🍪 JWT cookie bo‘lsa, o‘chiradi
    router.push('/login')
  }

  const userInitials = user.displayName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'JD'

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-[#10B981] flex items-center gap-2">
          <Layers3 className="w-6 h-6" /> FraiJob
        </div>
        <nav className="flex gap-6 text-sm font-medium items-center text-gray-600">
          <a href="#" className="flex items-center gap-1 hover:text-[#10B981] text-[#10B981]"><Home className="w-4 h-4" /> Dashboard</a>
          <a href="#"><FileText className="w-4 h-4" /> Skill Test</a>
          <a href="#"><Briefcase className="w-4 h-4" /> Resume</a>
          <a href="#"><Layers3 className="w-4 h-4" /> Portfolio</a>
          <a href="#"><LineChart className="w-4 h-4" /> Progress</a>
          <button onClick={handleLogout} className="flex items-center gap-1 text-red-600 border px-3 py-1 rounded-md border-red-300 hover:bg-red-100 ml-4">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </nav>
      </header>

      <main className="px-4 sm:px-8 py-10">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center gap-6">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <div className="w-20 h-20 bg-[#D1FAE5] rounded-full flex items-center justify-center text-3xl font-bold text-[#047857]">
                {userInitials}
              </div>
            )}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{user.displayName || 'Ismingiz kiritilmagan'}</h3>
                  <p className="text-sm text-gray-500 mb-2">{profession || 'Kasbingiz kiritilmagan'}</p>
                </div>
                <Button variant="ghost" onClick={() => setShowModal(true)} className="flex gap-1 text-sm items-center hover:bg-gray-100">
                  <Pencil className="w-4 h-4" /> Tahrirlash
                </Button>
              </div>
              <p className="text-sm font-medium text-gray-700">Level {level} - {xp} XP</p>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-2 mb-2">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: `${Math.min((xp % 1000) / 10, 100)}%` }} />
              </div>
              <p className="text-xs text-gray-500 mb-3">Next level in {1000 - (xp % 1000)} XP</p>
              <Button variant="outline" className="text-[#10B981] border-[#10B981] hover:bg-[#10B981]/10 text-sm px-5 py-2 rounded-xl">
                View Full Progress
              </Button>
            </div>
          </div>
        </section>

        {/* Progress sections */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <ProgressCard title="Completed Skill Tests" value="3" desc="Python, Web Dev, SQL" />
          <ProgressCard title="Portfolio Projects" value="2" desc="E-commerce, Blog" />
          <ProgressCard title="Resumes Generated" value="1" desc="Software Developer" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickAction title="Take a Skill Test" desc="Assess your knowledge" />
            <QuickAction title="Build Your Resume" desc="Create a professional CV" />
            <QuickAction title="Upload Portfolio" desc="Show your best work" />
          </div>
        </section>

        {showModal && <EditProfileModal user={user} onClose={() => setShowModal(false)} onUpdate={(data) => setProfession(data.profession)} />}
      </main>
    </div>
  )
}

// Subcomponents
function ProgressCard({ title, value, desc }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h3 className="font-semibold text-[#10B981] text-lg mb-2">{title}</h3>
      <p className="text-4xl font-bold mb-1">{value}</p>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  )
}

function QuickAction({ title, desc }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h3 className="font-semibold text-[#10B981] text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{desc}</p>
      <Button className="bg-[#10B981] text-white hover:bg-[#0e9e6e] w-full">Start</Button>
    </div>
  )
}
