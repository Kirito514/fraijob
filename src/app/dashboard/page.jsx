import jwt from 'jsonwebtoken'
import DashboardClient from './DashboardClient'
import { cookies } from 'next/headers'

export default async function DashboardPage() {
  const token = cookies().get('token')?.value
  let user = null

  try {
    user = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    // Xatolik bo‘lsa, foydalanuvchi ko‘rsatilmaydi, lekin redirect qilmaymiz
  }

  return <DashboardClient user={user} />
}
