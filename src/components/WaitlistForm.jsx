'use client'

import { useState } from 'react'

export default function WaitlistForm() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return alert('Iltimos, email kiriting.')
    alert(`Yuborildi: ${email}`)
    setEmail('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-center justify-center gap-4"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="w-full sm:w-80 px-4 py-3 rounded-full border border-gray-300 text-sm outline-none"
      />
      <button
        type="submit"
        className="bg-[#17424D] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-[#12363F] transition"
      >
        Join Waitlist
      </button>
    </form>
  )
}
