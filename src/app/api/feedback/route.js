import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { rating, type, message, timestamp } = body;

    // Validation
    if (!rating || !type || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Save feedback to database
    const feedback = await prisma.feedback.create({
      data: {
        rating: parseInt(rating),
        type,
        message,
        timestamp: new Date(timestamp),
        userAgent: request.headers.get("user-agent") || "",
        ipAddress: request.headers.get("x-forwarded-for") || 
                   request.headers.get("x-real-ip") || 
                   "unknown",
      },
    });

    // Log feedback for monitoring
    console.log("New feedback received:", {
      id: feedback.id,
      rating,
      type,
      message: message.substring(0, 100) + "...",
      timestamp,
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Feedback submitted successfully",
        feedbackId: feedback.id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error saving feedback:", error);
    return NextResponse.json(
      { error: "Failed to save feedback" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Get feedback statistics (for admin panel)
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin");

    if (isAdmin === "true") {
      const feedbacks = await prisma.feedback.findMany({
        orderBy: { timestamp: "desc" },
        take: 50, // Limit to last 50 feedbacks
      });

      const stats = await prisma.feedback.groupBy({
        by: ["type", "rating"],
        _count: true,
      });

      return NextResponse.json({
        feedbacks,
        stats,
        total: await prisma.feedback.count(),
      });
    }

    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );

  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}


