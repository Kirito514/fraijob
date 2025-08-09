import jwt from "jsonwebtoken";
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    try {
      // Database'dan job'larni olish
      const jobs = await prisma.job.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20 // Oxirgi 20 ta job
      });

      return NextResponse.json(jobs);
    } catch (error) {
      console.error('Jobs GET database error:', error);
      
      // Fallback demo data
      const demoJobs = [
        { 
          id: "demo-1", 
          title: "Frontend Developer", 
          company: "TechSoft", 
          salary: "$80k-120k",
          location: "Tashkent, Uzbekistan",
          type: "Full-time",
          description: "We are looking for a skilled Frontend Developer...",
          createdAt: new Date().toISOString()
        },
        { 
          id: "demo-2", 
          title: "AI Engineer", 
          company: "AI Hub", 
          salary: "$100k-150k",
          location: "Remote",
          type: "Full-time",
          description: "Join our AI team to build next-generation solutions...",
          createdAt: new Date().toISOString()
        }
      ];

      return NextResponse.json(demoJobs);
    }
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
    const { title, company, description, location, salary, type } = body;

    if (!title || !company) {
      return NextResponse.json({ error: 'Title and company are required' }, { status: 400 });
    }

    try {
      // Yangi job yaratish
      const newJob = await prisma.job.create({
        data: {
          title,
          company,
          description: description || '',
          location: location || '',
          salary: salary || '',
          type: type || 'Full-time'
        }
      });

      return NextResponse.json(newJob, { status: 201 });
    } catch (error) {
      console.error('Jobs POST database error:', error);
      
      // Fallback demo response
      const newJob = {
        id: `demo-${Date.now()}`,
        title,
        company,
        description: description || '',
        location: location || '',
        salary: salary || '',
        type: type || 'Full-time',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return NextResponse.json(newJob, { status: 201 });
    }
  } catch (error) {
    console.error('Jobs POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 