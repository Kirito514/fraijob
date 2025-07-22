import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { email, code } = await request.json()

    const record = await prisma.emailVerificationCode.findFirst({
      where: { email, code },
    })

    if (!record) {
      return new Response(JSON.stringify({ error: 'Kod noto‘g‘ri yoki muddati tugagan' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Foydalanuvchini tasdiqlash
    await prisma.user.update({
      where: { email },
      data: { verified: true },
    })

    // Kodni o‘chirib tashlash (xavfsizlik uchun)
    await prisma.emailVerificationCode.deleteMany({
      where: { email },
    })

    return new Response(JSON.stringify({ message: 'Email tasdiqlandi' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('❌ Tasdiqlash xatosi:', err)
    return new Response(JSON.stringify({ error: 'Server xatosi' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
