import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function GET(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = getUserFromToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get real statistics from database
    const [totalUsers, totalJobs, totalTests, userTestResults, userMessages] =
      await Promise.all([
        prisma.user.count(),
        prisma.job.count(),
        prisma.test.count(),
        prisma.testResult.findMany({
          where: { userId: decoded.id },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
        prisma.chatMessage.count({
          where: { userId: decoded.id },
        }),
      ]);

    // Calculate user's average test score
    const averageScore =
      userTestResults.length > 0
        ? Math.round(
            userTestResults.reduce((acc, test) => acc + test.score, 0) /
              userTestResults.length
          )
        : 0;

    // Calculate profile views (mock for now, can be implemented later)
    const profileViews = Math.floor(Math.random() * 1000) + 500;

    const stats = {
      profileViews,
      applications: totalJobs, // For now, use total jobs as applications
      testScore: averageScore,
      connections: Math.floor(Math.random() * 200) + 100, // Mock connections
      totalUsers,
      totalJobs,
      totalTests,
      userMessages,
      recentTests: userTestResults.slice(0, 5),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
