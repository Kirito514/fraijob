import jwt from "jsonwebtoken";
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);



// POST - Yangi test boshlash
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
    const { test_id, answers } = body;

    if (!test_id) {
      return NextResponse.json({ error: 'Test ID is required' }, { status: 400 });
    }

    // Test natijasini hisoblash (demo)
    const score = Math.floor(Math.random() * 30) + 70; // 70-100 oralig'ida
    const total = 100;

    const testResult = {
      id: Date.now(),
      user_id: user.id,
      test_id,
      score,
      total,
      completed_date: new Date().toISOString(),
      answers: answers || []
    };

    return NextResponse.json(testResult);
  } catch (error) {
    console.error('Tests POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET - Test natijalari va mavjud testlar olish
export async function GET(request) {
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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'available') {
      // Mavjud testlar ro'yxati
      const availableTests = [
        { 
          id: 1, 
          title: "React Advanced", 
          category: "Frontend",
          duration: "60 min",
          questions: 40,
          difficulty: "Intermediate",
          description: "Test your React knowledge with advanced concepts"
        },
        { 
          id: 2, 
          title: "Python for Data Science", 
          category: "Data Science",
          duration: "90 min",
          questions: 50,
          difficulty: "Advanced",
          description: "Comprehensive Python and data science assessment"
        },
        { 
          id: 3, 
          title: "System Design", 
          category: "Architecture",
          duration: "120 min",
          questions: 25,
          difficulty: "Expert",
          description: "Design scalable system architectures"
        }
      ];

      return NextResponse.json(availableTests);
    }

    // Test natijalari olish (demo data for now)
    const demoTests = [
      { 
        id: 1, 
        title: "React Basics", 
        score: 85, 
        total: 100,
        category: "Frontend",
        completed_date: "2024-01-15",
        duration: "45 min",
        questions: 30
      },
      { 
        id: 2, 
        title: "AI Fundamentals", 
        score: 92, 
        total: 100,
        category: "AI/ML",
        completed_date: "2024-01-10",
        duration: "60 min",
        questions: 40
      },
      { 
        id: 3, 
        title: "JavaScript Advanced", 
        score: 78, 
        total: 100,
        category: "Programming",
        completed_date: "2024-01-05",
        duration: "90 min",
        questions: 50
      },
      { 
        id: 4, 
        title: "Node.js Backend", 
        score: 88, 
        total: 100,
        category: "Backend",
        completed_date: "2024-01-01",
        duration: "75 min",
        questions: 35
      }
    ];

    return NextResponse.json(demoTests);
  } catch (error) {
    console.error('Tests GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 