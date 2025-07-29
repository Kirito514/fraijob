import jwt from "jsonwebtoken";
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

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

    // Portfolio ma'lumotlarini olish - demo data bilan
    const demoPortfolio = {
      id: user.id,
      name: user.name || 'Foydalanuvchi',
      email: user.email || '',
      bio: 'Dasturchi va texnologiya entuziasti',
      avatar_url: '',
      lang: 'en',
      github: 'https://github.com/username',
      telegram: '@username',
      title: 'Full-Stack Developer',
      phone: '+998 90 123 45 67',
      website: 'https://portfolio.com',
      location: 'Tashkent, Uzbekistan',
      github_url: 'https://github.com/username',
      linkedin_url: 'https://linkedin.com/in/username',
      twitter_url: 'https://twitter.com/username',
      technical_skills: 'React, Node.js, TypeScript, MongoDB, AWS',
      soft_skills: 'Leadership, Communication, Problem Solving',
      experience_company: 'TechSoft',
      experience_position: 'Frontend Developer',
      experience_duration: '2022 - Present',
      experience_location: 'Tashkent, Uzbekistan',
      experience_description: 'Web ilovalarini ishlab chiqish va optimizatsiya qilish',
      education_institution: 'Tashkent University',
      education_degree: 'Bachelor in Computer Science',
      education_duration: '2020-2024',
      education_gpa: '3.8/4.0',
      project_name: 'E-commerce Platform',
      project_technologies: 'React, Node.js, MongoDB',
      project_url: 'https://project-demo.com',
      project_description: 'To\'liq funksional e-commerce platformasi',
      language_1: 'English',
      language_2: 'Uzbek',
      language_3: 'Russian'
    };

    return NextResponse.json(demoPortfolio);
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

    // Portfolio ma'lumotlarini yangilash - demo data bilan
    const updatedPortfolio = {
      id: user.id,
      ...body,
      updated_at: new Date().toISOString()
    };

    return NextResponse.json(updatedPortfolio);
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

    // Portfolio ma'lumotlarini qisman yangilash - demo data bilan
    const updatedPortfolio = {
      id: user.id,
      ...body,
      updated_at: new Date().toISOString()
    };

    return NextResponse.json(updatedPortfolio);
  } catch (error) {
    console.error('Portfolio PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 