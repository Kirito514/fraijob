import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = getUserFromToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Admin huquqini tekshirish
    if (decoded.role?.toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Admin huquqi yo\'q' }, { status: 403 });
    }

    // Statistika ma'lumotlarini olish
    const [totalUsers, waitlistUsers] = await Promise.all([
      prisma.user.count(),
      prisma.waitlist.count()
    ]);

    return NextResponse.json({
      totalUsers,
      waitlistUsers
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Statistika ma\'lumotlarini olishda xatolik' },
      { status: 500 }
    );
  }
}