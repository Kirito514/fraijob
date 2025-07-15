import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export default async function ProfilePage() {
  const token = cookies().get('token')?.value
  let user = null

  try {
    user = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    user = null
  }

  return (
    <main className="min-h-screen bg-[#F3F7FA] flex items-center justify-center p-6 relative">
      {/* ← Dashboardga qaytish tugmasi */}
      <a
        href="/dashboard"
        className="absolute top-6 left-6 bg-[#17424D] text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#12363F] transition shadow-md"
        title="Dashboard"
      >
        ←
      </a>

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center space-y-5">
        <h2 className="text-3xl font-bold text-[#17424D]">Profil ma’lumotlari</h2>

        {user ? (
          <ul className="space-y-3 text-gray-700 text-left">
            <li>
              <span className="font-medium">Ism:</span>{' '}
              {user.name || 'Nomaʼlum'}
            </li>
            <li>
              <span className="font-medium">Email:</span> {user.email}
            </li>
            <li>
              <span className="font-medium">Rol:</span>{' '}
              {user.role || 'user'}
            </li>
          </ul>
        ) : (
          <p className="text-red-600 text-sm">
            Token yaroqsiz yoki foydalanuvchi aniqlanmadi.
          </p>
        )}
      </div>
    </main>
  )
}
