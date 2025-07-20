import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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

    await prisma.waitlist.create({
      data: { email },
    });

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
