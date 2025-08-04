'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'

function GoogleAuthCallbackContent() {
  const router = useRouter()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // URL'dan code parametrini olamiz
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        
        if (!code) {
          setError('Authorization code topilmadi')
          setLoading(false)
          return
        }

        // Google OAuth token olish
        const tokenResponse = await fetch('/api/auth/google/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        })

        if (!tokenResponse.ok) {
          throw new Error('Token olishda xatolik')
        }

        const tokenData = await tokenResponse.json()
        
        // Foydalanuvchi ma'lumotlarini olish
        const userResponse = await fetch('/api/auth/google/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ access_token: tokenData.access_token }),
        })

        if (!userResponse.ok) {
          throw new Error('Foydalanuvchi ma\'lumotlarini olishda xatolik')
        }

        const userData = await userResponse.json()
        
        // Backend'ga yuborish va JWT cookie o'rnatish
        const loginResponse = await fetch('/api/login-oauth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userData.email,
            name: userData.name,
            image: userData.picture,
            uid: userData.id,
          }),
        })

        if (!loginResponse.ok) {
          throw new Error('Login qilishda xatolik')
        }

        // Dashboard'ga yo'naltirish
        router.push('/dashboard')
        
      } catch (err) {
        console.error('Google OAuth callback error:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    handleGoogleCallback()
  }, [router])

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">Xatolik: {error}</p>
          <button 
            onClick={() => router.push('/login')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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