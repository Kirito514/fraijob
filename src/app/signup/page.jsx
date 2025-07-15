'use client'

import { useState } from 'react'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.status === 201) {
        setMessage('Foydalanuvchi yaratildi')
        setFormData({ name: '', email: '', password: '' })
      } else {
        setMessage(data.error || 'Xatolik yuz berdi')
      }
    } catch {
      setMessage('Tizim xatosi')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F3F7FA] p-6 relative">
      {/* ← Bosh sahifa tugmasi */}
      <a
        href="/"
        className="absolute top-6 left-6 bg-[#17424D] text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#12363F] transition shadow-md"
        title="Bosh sahifa"
      >
        ←
      </a>

      {/* Signup form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 space-y-5"
      >
        <h2 className="text-3xl font-bold text-center text-[#17424D]">
          Ro‘yxatdan o‘tish
        </h2>

        {message && (
          <div className="text-center text-sm text-red-600 bg-red-100 p-2 rounded">
            {message}
          </div>
        )}

        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ismingiz"
          required
          className="w-full border border-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#17424D]"
        />

        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email manzilingiz"
          required
          className="w-full border border-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#17424D]"
        />

        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Parol"
          required
          className="w-full border border-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#17424D]"
        />

        <button
          type="submit"
          className="w-full bg-[#17424D] text-white py-3 rounded-lg font-semibold hover:bg-[#12363F] transition"
        >
          Ro‘yxatdan o‘tish
        </button>

        <p className="text-center text-sm text-gray-600">
          Hisobingiz bormi?{' '}
          <a href="/login" className="text-[#17424D] font-medium hover:underline">
            Kirish
          </a>
        </p>
      </form>
    </main>
  )
}
  