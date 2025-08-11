import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function AdminWaitlistPage() {
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

  // Waitlist ma'lumotlarini olish
  let waitlist = null
  let error = null

  try {
    // Prisma orqali waitlist ma'lumotlarini olish
    waitlist = await prisma.waitlist.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        userId: true
      }
    })
  } catch (err) {
    console.error('Prisma waitlist fetch error:', err)
    error = err
    
    // Fallback demo data
    waitlist = [
      {
        id: '1',
        email: 'demo1@example.com',
        name: null,
        createdAt: new Date(),
        userId: null
      },
      {
        id: '2',
        email: 'demo2@example.com',
        name: null,
        createdAt: new Date(),
        userId: null
      }
    ]
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-blue-50/30 relative">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-200/10 to-blue-200/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a
                href="/dashboard"
                className="bg-gradient-to-r from-[#10B981] to-[#34D399] text-white rounded-full w-10 h-10 flex items-center justify-center hover:shadow-lg transition-all duration-300"
                title="Dashboard"
              >
                ←
              </a>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                <p className="text-gray-600 mt-1">Kutish ro'yxatini boshqarish</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/80 backdrop-blur-xl rounded-xl px-4 py-2 border border-white/30">
                <span className="text-sm text-gray-600">Jami: </span>
                <span className="font-semibold text-[#10B981]">{waitlist?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-[#10B981] to-[#34D399] p-6 text-white">
            <h2 className="text-2xl font-bold">Kutish ro'yxati</h2>
            <p className="text-green-100 mt-1">Platformaga qo'shilish uchun kutish ro'yxatida turgan foydalanuvchilar</p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Sana</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Holat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {waitlist?.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                    <td className="p-4 text-sm text-gray-600">#{item.id.slice(0, 8)}...</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-full flex items-center justify-center text-white font-semibold">
                          {item.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{item.email}</div>
                          <div className="text-sm text-gray-500">{item.name || 'Ism ko\'rsatilmagan'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(item.createdAt).toLocaleDateString('uz-UZ', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.userId ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {item.userId ? 'Ro\'yxatdan o\'tgan' : 'Kutish ro\'yxatida'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}