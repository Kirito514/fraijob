import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Portfolio ma'lumotlarini olish
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // JWT token orqali foydalanuvchini aniqlash
    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Portfolio ma'lumotlarini ma'lumotlar bazasidan olish
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: user.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!portfolio) {
      // Agar portfolio mavjud bo'lmasa, default ma'lumotlar bilan yaratish
      const newPortfolio = await prisma.portfolio.create({
        data: {
          userId: user.id,
          title: "Full-Stack Developer",
          bio: "Dasturchi va texnologiya entuziasti",
          technical_skills: "React, Node.js, TypeScript",
          soft_skills: "Leadership, Communication, Problem Solving",
          language_1: "English",
          language_2: "Uzbek",
          language_3: "Russian",
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      return NextResponse.json({
        ...newPortfolio,
        name: newPortfolio.user.name,
        email: newPortfolio.user.email,
        avatar_url: newPortfolio.user.image,
      });
    }

    return NextResponse.json({
      ...portfolio,
      name: portfolio.user.name,
      email: portfolio.user.email,
      avatar_url: portfolio.user.image,
    });
  } catch (error) {
    console.error("Portfolio GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Yangi portfolio yaratish
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

    // Portfolio ma'lumotlarini yangilash - demo data bilan
    const updatedPortfolio = {
      id: user.id,
      ...body,
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json(updatedPortfolio);
  } catch (error) {
    console.error("Portfolio POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Portfolio ma'lumotlarini qisman yangilash
export async function PATCH(request) {
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
    console.log("Portfolio PATCH request body:", body);
    console.log("User ID:", user.id);

    // Portfolio ma'lumotlarini yangilash yoki yaratish
    const updatedPortfolio = await prisma.portfolio.upsert({
      where: { userId: user.id },
      update: {
        ...body,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        ...body,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    console.log("Updated portfolio result:", updatedPortfolio);

    return NextResponse.json({
      ...updatedPortfolio,
      name: updatedPortfolio.user.name,
      email: updatedPortfolio.user.email,
      avatar_url: updatedPortfolio.user.image,
    });
  } catch (error) {
    console.error("Portfolio PATCH error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
