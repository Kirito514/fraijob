import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { redirect } from 'next/navigation'
import DeleteUserButton from '../../../components/DeleteUserButton'
import RoleSelect from '../../../components/RoleSelect'

const prisma = new PrismaClient()

export default async function AdminUsersPage() {
  const token = cookies().get('token')?.value
  let user = null

  try {
    user = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    redirect('/login')
  }

  if (user?.role !== 'admin') {
    redirect('/dashboard')
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="min-h-screen bg-[#F3F7FA] p-6 relative">
      {/* ← Dashboardga qaytish tugmasi */}
      <a
        href="/dashboard"
        className="absolute top-6 left-6 bg-[#17424D] text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#12363F] transition shadow-md"
        title="Dashboard"
      >
        ←
      </a>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-[#17424D] text-center">
          Foydalanuvchilar ro‘yxati
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-[#F3F7FA] text-[#17424D] text-sm">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Ism</th>
                <th className="p-3">Email</th>
                <th className="p-3">Rol</th>
                <th className="p-3">Amal</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="p-3">{u.id}</td>
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <RoleSelect userId={u.id} currentRole={u.role} />
                  </td>
                  <td className="p-3">
                    <DeleteUserButton userId={u.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
