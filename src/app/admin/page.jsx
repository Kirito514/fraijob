import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminPage() {
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

  const adminMenuItems = [
    {
      title: 'Foydalanuvchilar',
      description: 'Barcha foydalanuvchilarni boshqarish',
      icon: '👥',
      href: '/admin/users',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Statistika',
      description: 'Platforma statistikasini ko\'rish',
      icon: '📊',
      href: '/admin/stats',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Kutish ro\'yxati',
      description: 'Kutish ro\'yxatidagi foydalanuvchilar',
      icon: '📝',
      href: '/admin/waitlist',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Telegram Bot',
      description: 'Telegram bot sozlamalari',
      icon: '🤖',
      href: '/admin/telegram',
      color: 'from-cyan-500 to-cyan-600'
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/10 to-purple-200/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-green-200/10 to-blue-200/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a
                href="/dashboard"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center hover:shadow-lg transition-all duration-300"
                title="Dashboard"
              >
                ←
              </a>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                <p className="text-gray-600 mt-1">Platformani boshqarish</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminMenuItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.href}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`bg-gradient-to-r ${item.color} p-6 text-white group-hover:scale-105 transition-transform duration-300`}>
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{item.icon}</div>
                  <div>
                    <h2 className="text-2xl font-bold">{item.title}</h2>
                    <p className="text-white/80 mt-1">{item.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}