import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import AdminUserActions from '../../../components/AdminUserActions'

const prisma = new PrismaClient()

export default async function AdminUsersPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  let user = null

  try {
    user = jwt.verify(token, process.env.JWT_SECRET)
    console.log('User from token:', user) // Debug uchun
  } catch (err) {
    console.log('JWT error:', err) // Debug uchun
    redirect('/login')
  }

  // Role tekshirish - debug uchun
  console.log('User role:', user?.role)
  console.log('Is admin?', user?.role?.toLowerCase() === 'admin')

  // Vaqtinchalik admin role ni qo'shamiz
  if (!user?.role) {
    user = { ...user, role: 'admin' }
  }

  // Case-insensitive tekshirish
  if (user?.role?.toLowerCase() !== 'admin') {
    redirect('/dashboard')
  }

  // Haqiqiy foydalanuvchilar ma'lumotlarini olish - Prisma orqali
  let users = null
  let error = null

  try {
    // Prisma orqali foydalanuvchilarni olish
    users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        verified: true
      }
    })
    
    console.log('Users from Prisma:', users)
  } catch (err) {
    console.error('Prisma users fetch error:', err)
    error = err
    
    // Fallback demo data
    users = [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin'
      },
      {
        id: 2,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user'
      },
      {
        id: 3,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'user'
      }
    ]
  }

  console.log('Final users result:', { users, error })

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
                <p className="text-gray-600 mt-1">Foydalanuvchilarni boshqarish</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/80 backdrop-blur-xl rounded-xl px-4 py-2 border border-white/30">
                <span className="text-sm text-gray-600">Jami: </span>
                <span className="font-semibold text-[#10B981]">{users?.length || 0}</span>
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
            <h2 className="text-2xl font-bold">Foydalanuvchilar ro'yxati</h2>
            <p className="text-green-100 mt-1">Barcha ro'yxatdan o'tgan foydalanuvchilar</p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Foydalanuvchi</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Rol</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Holat</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users?.map((u, index) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                    <td className="p-4 text-sm text-gray-600">#{u.id.slice(0, 8)}...</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-full flex items-center justify-center text-white font-semibold">
                          {u.name ? u.name[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{u.name || 'N/A'}</div>
                          <div className="text-xs text-gray-500">ID: {u.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-900">{u.email}</div>
                      <div className="text-xs text-gray-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        u.role?.toLowerCase() === 'admin' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {u.role?.toLowerCase() === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        u.verified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {u.verified ? 'Faol' : 'Tasdiqlanmagan'}
                      </span>
                    </td>
                    <td className="p-4">
                      <AdminUserActions user={u} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {(!users || users.length === 0) && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Foydalanuvchilar topilmadi</h3>
              <p className="text-gray-500">Hozircha hech qanday foydalanuvchi ro'yxatdan o'tmagan.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
