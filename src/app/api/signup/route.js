import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs'
import { validateEmail, validatePassword, sanitizeInput } from '@/lib/validation';

export async function POST(request) {
  try {
    const body = await request.json()
    let { name, email, password } = body

    // Input validation
    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: 'Barcha maydonlar to\'ldirilishi shart' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Email validation
    if (!validateEmail(email)) {
      return new Response(JSON.stringify({ error: 'Email formati noto\'g\'ri' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Password validation
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      const errorMessages = Object.values(passwordValidation.errors).filter(Boolean);
      return new Response(JSON.stringify({ error: errorMessages.join(', ') }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Input sanitization
    name = sanitizeInput(name);
    email = sanitizeInput(email.toLowerCase());

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
