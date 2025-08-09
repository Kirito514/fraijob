import { prisma } from '@/lib/prisma';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { validateEmail, sanitizeInput } from '@/lib/validation';

export async function POST(request) {
  try {
    const body = await request.json();
    let { email, password } = body;

    // Input validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email va parol kiritilishi shart" }, { status: 400 });
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Email formati noto'g'ri" }, { status: 400 });
    }

    // Input sanitization
    email = sanitizeInput(email.toLowerCase());

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "Email topilmadi" }, { status: 401 });
    }

    // ✅ Email tasdiqlanganmi?
    if (!user.verified) {
      return NextResponse.json(
        { error: "Email hali tasdiqlanmagan. Kodni tasdiqlang." },
        { status: 403 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Parol noto‘g‘ri" }, { status: 401 });
    }

    // JWT token yaratish
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        role: user.role 
      }, 
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Cookie'ga token saqlash
    const response = NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: token // Frontend uchun token qaytarish
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 kun
    });

    return response;
  } catch (err) {
    console.error("Login xatolik:", err);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
