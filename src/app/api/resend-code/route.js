import { PrismaClient } from '@prisma/client'
import { sendEmailWithCode } from '@/lib/email'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email majburiy' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Avvalgi kodlarni o‘chirish
    await prisma.emailVerificationCode.deleteMany({ where: { email } })

    // Yangi 6 xonali kod generatsiyasi
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // DB ga yozish
    await prisma.emailVerificationCode.create({
      data: { email, code },
    })

    // Yuborish
    const { error } = await sendEmailWithCode(email, code)

    if (error) {
      return new Response(JSON.stringify({ error: 'Kod yuborilmadi' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ message: 'Kod yuborildi' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('❌ Resend code xatosi:', err)
    return new Response(JSON.stringify({ error: 'Server xatosi' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
