'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'

function GoogleAuthCallbackContent() {
  const router = useRouter()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Google OAuth temporarily disabled
    setError('Google orqali kirish vaqtincha o\'chirilgan')
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">⚠️ {error}</p>
          <p className="text-gray-600 text-sm mb-6">Iltimos, oddiy email va parol orqali kirish qiling</p>
          <button 
            onClick={() => router.push('/login')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Login sahifasiga qaytish
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-500 text-lg">Google orqali kirish amalga oshirilmoqda...</p>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-500 text-lg">Yuklanmoqda...</p>
      </div>
    </div>
  )
}

export default function GoogleAuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GoogleAuthCallbackContent />
    </Suspense>
  )
} 