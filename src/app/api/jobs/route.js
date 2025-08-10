import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Job applications olish
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Ma'lumotlar bazasidan job'larni olish
    let jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      take: 20, // Oxirgi 20 ta job
    });

    // Agar job'lar yo'q bo'lsa, demo job'lar yaratamiz
    if (jobs.length === 0) {
      const demoJobs = [
        {
          title: "Frontend Developer",
          company: "TechCorp",
          description: "React va Next.js bilan ishlash",
          location: "Toshkent",
          salary: "$1000-1500",
          type: "Full-time",
        },
        {
          title: "Backend Developer",
          company: "StartupHub",
          description: "Node.js va Express.js bilan API yaratish",
          location: "Samarqand",
          salary: "$800-1200",
          type: "Remote",
        },
        {
          title: "Full Stack Developer",
          company: "DevStudio",
          description: "MERN stack bilan web ilovalar yaratish",
          location: "Buxoro",
          salary: "$1200-1800",
          type: "Part-time",
        },
        {
          title: "UI/UX Designer",
          company: "DesignLab",
          description: "Figma va Adobe XD bilan dizayn yaratish",
          location: "Andijon",
          salary: "$600-1000",
          type: "Contract",
        },
        {
          title: "Mobile Developer",
          company: "AppFactory",
          description: "React Native bilan mobil ilovalar",
          location: "Namangan",
          salary: "$900-1400",
          type: "Full-time",
        },
      ];

      // Demo job'larni ma'lumotlar bazasiga qo'shamiz
      for (const jobData of demoJobs) {
        await prisma.job.create({
          data: jobData,
        });
      }

      // Yangi yaratilgan job'larni qaytaramiz
      jobs = await prisma.job.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
      });
    }

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Jobs GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Yangi job application
export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const { jobId, coverLetter } = body;

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    // Job mavjudligini tekshirish
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Oldin apply qilganligini tekshirish
    const existingApplication = await prisma.jobApplication.findUnique({
      where: {
        userId_jobId: {
          userId: user.id,
          jobId: jobId,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied for this job" },
        { status: 400 }
      );
    }

    // Yangi job application yaratish
    const newApplication = await prisma.jobApplication.create({
      data: {
        userId: user.id,
        jobId: jobId,
        coverLetter: coverLetter || "I'm interested in this position.",
        status: "Applied",
      },
      include: {
        job: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(newApplication);
  } catch (error) {
    console.error("Jobs POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
