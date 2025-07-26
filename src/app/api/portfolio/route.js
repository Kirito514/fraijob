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

    // Portfolio ma'lumotlarini olish
    const { data: portfolio, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Portfolio fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 });
    }

    return NextResponse.json(portfolio);
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

    // Portfolio ma'lumotlarini yangilash
    const { data, error } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        ...body,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Portfolio update error:', error);
      return NextResponse.json({ error: 'Failed to update portfolio' }, { status: 500 });
    }

    return NextResponse.json(data);
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

    // Portfolio ma'lumotlarini qisman yangilash
    const { data, error } = await supabase
      .from('users')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Portfolio patch error:', error);
      return NextResponse.json({ error: 'Failed to update portfolio' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Portfolio PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 