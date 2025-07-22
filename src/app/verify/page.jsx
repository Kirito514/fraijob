'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, X, Loader2 } from 'lucide-react'

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const router = useRouter()

  const [codeArray, setCodeArray] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [resendTimer, setResendTimer] = useState(60)
  const [resending, setResending] = useState(false)

  // ⏱ Timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [resendTimer])

  const handleChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newArray = [...codeArray]
      newArray[index] = value
      setCodeArray(newArray)

      if (value && index < 5) {
        inputRefs.current[index + 1].focus()
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !codeArray[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newCode = paste.split('')
    const updatedArray = [...codeArray]

    for (let i = 0; i < 6; i++) {
      updatedArray[i] = newCode[i] || ''
    }

    setCodeArray(updatedArray)
    const nextIndex = paste.length < 6 ? paste.length : 5
    inputRefs.current[nextIndex]?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const code = codeArray.join('')
    if (code.length !== 6) return

    setLoading(true)
    setError('')
    setSuccess(false)

    const res = await fetch('/api/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Xatolik yuz berdi')
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    }

    setLoading(false)
  }

  const handleResend = async () => {
    setResending(true)
    setError('')
    try {
      const res = await fetch('/api/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Qayta yuborishda xatolik')
      } else {
        setResendTimer(60) // reset timer
      }
    } catch (err) {
      setError('Tarmoq xatosi')
    } finally {
      setResending(false)
    }
  }

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('')
        setSuccess(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#ECFDF5] px-4">
      <AnimatePresence>
        {(error || success) && (
          <motion.div
            key={error ? 'error' : 'success'}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-fit max-w-sm px-6 py-4 flex items-start gap-4 rounded-2xl shadow-xl border border-white/20 backdrop-blur-md bg-white/70"
          >
            <div
              className={`p-2 rounded-full ${
                error ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
              }`}
            >
              {error ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
            </div>
            <p className="text-sm text-gray-800 font-medium leading-snug max-w-xs">
              {error || '✅ Tasdiqlandi! Tez orada yo‘naltirilasiz...'}
            </p>
            <button
              onClick={() => {
                setError('')
                setSuccess(false)
              }}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 space-y-6 backdrop-blur-md bg-white/70"
      >
        <h2 className="text-3xl font-bold text-center text-[#17424D]">
          Tasdiqlash kodi
        </h2>

        <p className="text-center text-sm text-gray-600">
          Kod quyidagi emailga yuborildi: <br />
          <strong className="text-[#10B981]">{email}</strong>
        </p>

        <div className="flex justify-center items-center gap-2 mt-4">
          {codeArray.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-14 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981] bg-white"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#10B981] text-white py-3 rounded-lg font-semibold hover:bg-[#0ea672] transition"
        >
          {loading ? 'Tekshirilmoqda...' : '✅ Tasdiqlash'}
        </button>

        {/* Qayta yuborish */}
        <p className="text-center text-sm text-gray-600">
          Kod kelmadimi?{' '}
          {resendTimer > 0 ? (
            <span className="text-gray-400">({resendTimer}s)</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-[#10B981] font-medium hover:underline flex items-center gap-1"
            >
              {resending && <Loader2 size={14} className="animate-spin" />}
              Qayta yuborish
            </button>
          )}
        </p>
      </form>
    </main>
  )
}
