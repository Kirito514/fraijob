import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, image, uid } = body;
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || email.split('@')[0],
          image: image || null,
          firebaseUid: uid || null,
          verified: true,
        },
      });
    } else if (!user.firebaseUid && uid) {
      // Agar user bor, lekin firebaseUid yo‘q bo‘lsa, yangilaymiz
      user = await prisma.user.update({
        where: { email },
        data: { firebaseUid: uid },
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({ message: 'OAuth login ok' });
    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });
    return response;
  } catch (err) {
    console.error('OAuth login error:', err);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
} 