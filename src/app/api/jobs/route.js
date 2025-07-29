import jwt from "jsonwebtoken";
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// GET - Job applications olish
export async function GET() {
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

    // Job applications olish (demo data for now)
    const demoJobs = [
      { 
        id: 1, 
        title: "Frontend Developer", 
        company: "TechSoft", 
        status: "Applied", 
        salary: "$80k-120k",
        location: "Tashkent, Uzbekistan",
        type: "Full-time",
        applied_date: "2024-01-15",
        description: "We are looking for a skilled Frontend Developer..."
      },
      { 
        id: 2, 
        title: "AI Engineer", 
        company: "AI Hub", 
        status: "Interview", 
        salary: "$100k-150k",
        location: "Remote",
        type: "Full-time",
        applied_date: "2024-01-10",
        description: "Join our AI team to build next-generation solutions..."
      },
      { 
        id: 3, 
        title: "Full-Stack Developer", 
        company: "StartupX", 
        status: "Rejected", 
        salary: "$70k-100k",
        location: "Tashkent, Uzbekistan",
        type: "Contract",
        applied_date: "2024-01-05",
        description: "Build scalable web applications..."
      }
    ];

    return NextResponse.json(demoJobs);
  } catch (error) {
    console.error('Jobs GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Yangi job application
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
    const { job_id, cover_letter } = body;

    if (!job_id) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    // Job application yaratish (demo)
    const newApplication = {
      id: Date.now(),
      user_id: user.id,
      job_id,
      cover_letter,
      status: "Applied",
      applied_date: new Date().toISOString()
    };

    return NextResponse.json(newApplication);
  } catch (error) {
    console.error('Jobs POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 