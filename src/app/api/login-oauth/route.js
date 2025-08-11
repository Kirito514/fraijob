import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { sendNewUserNotification } from "@/lib/telegram";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name, image, uid } = body;
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    let user = await prisma.user.findUnique({ where: { email } });
    let isNewUser = false;

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || email.split("@")[0],
          image: image || null,
          firebaseUid: uid || null,
          verified: true,
        },
      });
      isNewUser = true;
    } else if (!user.firebaseUid && uid) {
      // Agar user bor, lekin firebaseUid yo‘q bo‘lsa, yangilaymiz
      user = await prisma.user.update({
        where: { email },
        data: { firebaseUid: uid },
      });
    }

    // Yangi foydalanuvchi uchun Telegram xabari yuborish
    if (isNewUser) {
      try {
        await sendNewUserNotification({
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        });
      } catch (telegramError) {
        console.error("❌ Telegram xabar yuborishda xatolik:", telegramError);
        // Telegram xatosi login jarayonini to'xtatmasin
      }
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

    const response = NextResponse.json({ message: "OAuth login ok" });
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });
    return response;
  } catch (err) {
    console.error("OAuth login error:", err);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}
