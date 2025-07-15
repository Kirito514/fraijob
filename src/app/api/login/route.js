import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password } = body

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return new Response(JSON.stringify({ error: 'Email topilmadi' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return new Response(JSON.stringify({ error: 'Parol noto‘g‘ri' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // 🔑 JWT token ichiga name ham qo‘shamiz
    const token = jwt.sign(
      {
        id: user.id,   
        email: user.email,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    const cookieStore = cookies()
    cookieStore.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return new Response(JSON.stringify({ message: 'Login ok' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server xatosi' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
