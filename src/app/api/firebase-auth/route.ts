import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, image, uid } = body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        image,
        firebaseUid: uid,
      },
    });

    return new Response(JSON.stringify({ message: "User created", newUser }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("🔥 Firebase auth error:", error);
    return new Response(JSON.stringify({ error: "Firebase auth error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
