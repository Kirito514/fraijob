import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import Link from 'next/link';

const prisma = new PrismaClient()

export default async function StatsAdminPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  let user = null

  try {
    user = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    console.log('JWT error:', err)
    redirect('/login')
  }

  // Vaqtinchalik admin role ni qo'shamiz
  if (!user?.role) {
    user = { ...user, role: 'admin' }
  }

  // Case-insensitive tekshirish
  if (user?.role?.toLowerCase() !== 'admin') {
    redirect('/dashboard')
  }

  // Statistika ma'lumotlarini olish
  let totalUsers = 0
  let waitlistUsers = 0
  let error = null

  try {
    // Prisma orqali statistika ma'lumotlarini olish
    [totalUsers, waitlistUsers] = await Promise.all([
      prisma.user.count(),
      prisma.waitlist.count()
    ])
  } catch (err) {
    console.error('Prisma stats fetch error:', err)
    error = err
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              📊 Platforma Statistikasi
            </h1>
            <Link 
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Dashboard
            </Link>
          </div>

          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-red-700 mb-2">❌ Xatolik</h3>
              <p className="text-red-700">{error.message || 'Statistika ma\'lumotlarini olishda xatolik'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ro'yxatdan o'tgan foydalanuvchilar */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  {totalUsers}
                </div>
                <h2 className="text-lg font-semibold text-blue-900">
                  Ro'yxatdan o'tgan foydalanuvchilar
                </h2>
                <p className="text-blue-700 mt-2">
                  Platformada ro'yxatdan o'tgan barcha foydalanuvchilar soni
                </p>
                <Link 
                  href="/admin/users"
                  className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Foydalanuvchilar ro'yxati
                </Link>
              </div>

              {/* Waitlist foydalanuvchilari */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">
                  {waitlistUsers}
                </div>
                <h2 className="text-lg font-semibold text-green-900">
                  Kutish ro'yxatidagi foydalanuvchilar
                </h2>
                <p className="text-green-700 mt-2">
                  Platformaga qo'shilish uchun kutish ro'yxatida turgan foydalanuvchilar soni
                </p>
                <Link 
                  href="/admin/waitlist"
                  className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Kutish ro'yxati
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}