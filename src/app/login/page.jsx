'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.status === 200) {
        setFormData({ email: '', password: '' })
        setMessage('Kirish muvaffaqiyatli')
        router.push('/dashboard')
      } else {
        setMessage(data.error || 'Login xatoligi')
      }
    } catch {
      setMessage('Server bilan bog‘lanib bo‘lmadi')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#ECFDF5] relative overflow-hidden px-4">
      {/* Bosh sahifa tugmasi */}
      <a
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 bg-[#10B981] text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-[#0ea672] transition shadow-md z-20"
        title="Bosh sahifaga qaytish"
      >
        🏠 Bosh sahifaga qaytish
      </a>

      {/* Animatsion background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-150px] left-[10%] w-[400px] h-[400px] bg-[#10B981] rounded-full opacity-20 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-[-100px] right-[10%] w-[500px] h-[500px] bg-[#34D399] rounded-full opacity-30 blur-2xl animate-float-slow" />
        <div className="absolute top-[40%] left-[5%] text-[#6EE7B7] text-6xl animate-float-slow">🔐</div>
        <div className="absolute bottom-[20%] right-[5%] text-[#A7F3D0] text-5xl animate-pulse-slow">💼</div>
      </div>

      {/* Login form */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 space-y-5 backdrop-blur-md bg-white/70"
      >
        <h2 className="text-3xl font-bold text-center text-[#17424D]">
          Tizimga kirish
        </h2>

        {message && (
          <div className="text-center text-sm text-red-600 bg-red-100 p-2 rounded">
            {message}
          </div>
        )}

        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email manzilingiz"
          required
          className="w-full border border-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
        />

        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Parolingiz"
          required
          className="w-full border border-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
        />

        <button
          type="submit"
          className="w-full bg-[#10B981] text-white py-3 rounded-lg font-semibold hover:bg-[#0ea672] transition"
        >
          🚀 Kirish
        </button>

        <p className="text-center text-sm text-gray-600">
          Hisobingiz yo‘qmi?{' '}
          <a href="/signup" className="text-[#10B981] font-medium hover:underline">
            Ro‘yxatdan o‘tish
          </a>
        </p>
      </form>
    </main>
  )
}
