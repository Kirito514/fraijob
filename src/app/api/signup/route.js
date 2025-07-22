import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { sendEmailWithCode } from '@/lib/email'

const prisma = new PrismaClient()

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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
        verified: false, // ❗️ Aytmasangiz ham bo'ladi, default: false
      },
    })

    console.log('✅ STEP 5: Foydalanuvchi yaratildi:', user)

    // 🔐 STEP 6: Email verification code
    const code = generateCode()
    await prisma.emailVerificationCode.create({
      data: {
        email,
        code,
      },
    })

    console.log('✅ STEP 6: Verification code yaratildi:', code)

    // 📧 STEP 7: Email yuborish
    await sendEmailWithCode(email, code)
    console.log('✅ STEP 7: Email yuborildi')

    return new Response(JSON.stringify({ message: 'Kod emailga yuborildi', email }), {
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
