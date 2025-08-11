import { prisma } from '@/lib/prisma';
import { sendWaitlistNotification } from '@/lib/telegram';

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return new Response(JSON.stringify({ error: "Yaroqsiz email" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const existing = await prisma.waitlist.findUnique({ where: { email } });

    if (existing) {
      return new Response(JSON.stringify({ error: "Email allaqachon mavjud" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    const newWaitlistUser = await prisma.waitlist.create({
      data: { email },
    });
    
    // Telegram botga xabar yuborish
    try {
      await sendWaitlistNotification({
        email: email,
        createdAt: newWaitlistUser.createdAt
      });
    } catch (telegramError) {
      console.error("❌ Telegram xabar yuborishda xatolik:", telegramError);
      // Telegram xatosi waitlist jarayonini to'xtatmasin
    }

    return new Response(JSON.stringify({ message: "Email qo‘shildi" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Waitlist error:", err);
    return new Response(JSON.stringify({ error: "Server xatosi" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
