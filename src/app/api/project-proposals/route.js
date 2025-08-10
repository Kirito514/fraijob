import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Foydalanuvchining project proposals larini olish
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

    // Foydalanuvchining barcha project proposals larini olish
    const proposals = await prisma.projectProposal.findMany({
      where: {
        freelancerId: user.id
      },
      include: {
        project: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(proposals);
  } catch (error) {
    console.error("Project Proposals GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Yangi project proposal yaratish
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
    const { projectId, coverLetter, proposedBudget, deliveryTime } = body;

    if (!projectId || !coverLetter || !proposedBudget || !deliveryTime) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Project mavjudligini tekshirish
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // O'z projectiga proposal bermaslik
    if (project.clientId === user.id) {
      return NextResponse.json(
        { error: "You cannot submit a proposal to your own project" },
        { status: 400 }
      );
    }

    // Oldin proposal berganligini tekshirish
    const existingProposal = await prisma.projectProposal.findUnique({
      where: {
        projectId_freelancerId: {
          projectId: projectId,
          freelancerId: user.id
        }
      }
    });

    if (existingProposal) {
      return NextResponse.json(
        { error: "You have already submitted a proposal for this project" },
        { status: 400 }
      );
    }

    // Yangi proposal yaratish
    const newProposal = await prisma.projectProposal.create({
      data: {
        projectId: projectId,
        freelancerId: user.id,
        coverLetter,
        proposedBudget,
        deliveryTime,
        status: "pending"
      },
      include: {
        project: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        freelancer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(newProposal);
  } catch (error) {
    console.error("Project Proposals POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
