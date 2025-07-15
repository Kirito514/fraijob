'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DashboardClient({ user }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    await fetch('/api/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <main className="min-h-screen bg-[#F3F7FA] flex flex-col items-center justify-start p-6">
      {/* Beta banner */}
      <div className="w-full max-w-4xl bg-yellow-100 text-yellow-800 text-sm text-center px-4 py-2 rounded mb-6 border border-yellow-300 shadow">
        🚧 FraiJob sayti hozirda test rejimida ishlamoqda. Dizayn va imkoniyatlar takomillashtirilmoqda.
      </div>

      {/* User card */}
      <div className="bg-white shadow-md p-8 rounded-xl max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#17424D]">Xush kelibsiz 👋</h1>
        <p className="text-gray-600 text-sm">Email: <span className="font-medium">{user?.email}</span></p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition w-full sm:w-auto"
          >
            {loading ? 'Chiqilmoqda...' : 'Chiqish'}
          </button>

          <a
            href="/profile"
            className="text-sm text-[#17424D] underline hover:text-[#12363F] transition"
          >
            Profilingizni ko‘rish
          </a>
        </div>
      </div>
    </main>
  )
}
