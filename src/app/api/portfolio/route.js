import jwt from "jsonwebtoken";
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Portfolio model uchun Prisma schema yangilanishi kerak
// Hozircha User modeliga portfolio fieldlarini qo'shamiz

// GET - Portfolio ma'lumotlarini olish
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // JWT token orqali foydalanuvchini aniqlash
    const user = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    try {
      // Database'dan portfolio ma'lumotlarini olish
      const userProfile = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!userProfile) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Portfolio ma'lumotlarini qaytarish (hozircha User modelidan)
      const portfolio = {
        id: userProfile.id,
        name: userProfile.name || 'Foydalanuvchi',
        email: userProfile.email || '',
        bio: 'Dasturchi va texnologiya entuziasti',
        avatar_url: userProfile.image || '',
        lang: 'en',
        github: '',
        telegram: '',
        title: '',
        phone: '',
        website: '',
        location: '',
        github_url: '',
        linkedin_url: '',
        twitter_url: '',
        technical_skills: '',
        soft_skills: '',
        experience_company: '',
        experience_position: '',
        experience_duration: '',
        experience_location: '',
        experience_description: '',
        education_institution: '',
        education_degree: '',
        education_duration: '',
        education_gpa: '',
        project_name: '',
        project_technologies: '',
        project_url: '',
        project_description: '',
        language_1: '',
        language_2: '',
        language_3: '',
        created_at: userProfile.createdAt,
        updated_at: userProfile.updatedAt
      };

      return NextResponse.json(portfolio);
    } catch (error) {
      console.error('Portfolio GET error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
  } catch (error) {
    console.error('Portfolio GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Yangi portfolio yaratish
export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();

    try {
      // Foydalanuvchi mavjudligini tekshirish
      const existingUser = await prisma.user.findUnique({
        where: { id: user.id }
      });

      if (!existingUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Portfolio ma'lumotlarini yangilash
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: body.name || existingUser.name,
          // Boshqa fieldlar uchun User modelini kengaytirish kerak
          updatedAt: new Date()
        }
      });

      const updatedPortfolio = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        ...body,
        updated_at: updatedUser.updatedAt
      };

      return NextResponse.json(updatedPortfolio);
    } catch (error) {
      console.error('Portfolio POST error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
  } catch (error) {
    console.error('Portfolio POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Portfolio ma'lumotlarini qisman yangilash
export async function PATCH(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();

    try {
      // Foydalanuvchi mavjudligini tekshirish
      const existingUser = await prisma.user.findUnique({
        where: { id: user.id }
      });

      if (!existingUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Faqat kelgan fieldlarni yangilash
      const updateData = {};
      if (body.name) updateData.name = body.name;
      if (body.image) updateData.image = body.image;
      
      updateData.updatedAt = new Date();

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: updateData
      });

      const updatedPortfolio = {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        ...body,
        updated_at: updatedUser.updatedAt
      };

      return NextResponse.json(updatedPortfolio);
    } catch (error) {
      console.error('Portfolio PATCH error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
  } catch (error) {
    console.error('Portfolio PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 