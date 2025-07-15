import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request) {
  console.log('✅ STEP 1: POST function chaqirildi')

  try {
    const body = await request.json()
    const { name, email, password } = body

    console.log('✅ STEP 2: Maʼlumotlar o‘qildi', { name, email, password })

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    console.log('✅ STEP 3: Email mavjudmi:', !!existingUser)

    if (existingUser) {
      return new Response(JSON.stringify({ error: 'Email mavjud' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    console.log('✅ STEP 4: Parol hash qilindi')

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    console.log('✅ STEP 5: Bazaga yozildi:', user)

    return new Response(JSON.stringify({ message: 'Foydalanuvchi yaratildi' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (err) {
    console.error('❌ CATCH ERROR:', err.message)
    console.error(err)
    return new Response(JSON.stringify({ error: 'Server xatosi' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
