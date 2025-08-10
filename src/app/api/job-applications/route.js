import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Foydalanuvchining job applications larini olish
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

    // Foydalanuvchining barcha job applications larini olish
    const applications = await prisma.jobApplication.findMany({
      where: {
        userId: user.id
      },
      include: {
        job: true
      },
      orderBy: {
        appliedAt: "desc"
      }
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Job Applications GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
