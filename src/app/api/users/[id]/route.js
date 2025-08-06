import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// JWT token'ni tekshirish
async function verifyToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  
  if (!token) {
    return null;
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

// PATCH - Foydalanuvchi role'ini yangilash
export async function PATCH(request, { params }) {
  try {
    const user = await verifyToken();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Faqat admin yoki o'zini yangilay oladi
    if (user.role !== "admin" && user.id !== params.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { role, name, bio, avatar_url, lang, github, telegram } = body;

    // Foydalanuvchi ma'lumotlarini yangilash
    const updateData = {};
    if (role) updateData.role = role;
    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (avatar_url) updateData.image = avatar_url;
    if (lang) updateData.lang = lang;
    if (github) updateData.github = github;
    if (telegram) updateData.telegram = telegram;

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        image: true,
        lang: true,
        github: true,
        telegram: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Foydalanuvchini o'chirish
export async function DELETE(request, { params }) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = jwt.verify(token, process.env.JWT_SECRET)
    
    if (!user || user.role?.toLowerCase() !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { id } = await params

    // O'zini o'chirishga ruxsat bermaslik
    if (id === user.id) {
      return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 })
    }

    // Foydalanuvchini o'chirish
    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('User delete error:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
