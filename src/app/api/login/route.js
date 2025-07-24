import { prisma } from '@/lib/prisma';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "Email topilmadi" }, { status: 401 });
    }

    // ✅ Email tasdiqlanganmi?
    if (!user.verified) {
      return NextResponse.json(
        { error: "Email hali tasdiqlanmagan. Kodni tasdiqlang." },
        { status: 403 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Parol noto‘g‘ri" }, { status: 401 });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({ message: "Login ok" });

    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
      // secure: process.env.NODE_ENV === "production"
    });

    return response;
  } catch (err) {
    console.error("Login xatolik:", err);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
