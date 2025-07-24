import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return new Response(JSON.stringify({ error: 'Email allaqachon mavjud' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        verified: true, // ✅ Verification talab qilinmagani uchun true
      },
    })

    return new Response(JSON.stringify({ message: 'Foydalanuvchi yaratildi', email }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (err) {
    console.error('❌ Serverda xatolik:', err)
    return new Response(JSON.stringify({ error: 'Server xatosi' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
