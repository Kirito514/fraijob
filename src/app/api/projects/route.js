import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET - Barcha projectlarni olish
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

    // Ma'lumotlar bazasidan projectlarni olish
    let projects = await prisma.project.findMany({
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        proposals: {
          include: {
            freelancer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            proposals: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // Agar projectlar yo'q bo'lsa, demo projectlar yaratamiz
    if (projects.length === 0) {
      // Avval demo clientlar yaratamiz
      const demoClients = [
        {
          name: "TechCorp Solutions",
          email: "client@techcorp.com",
          password: "demo123",
          role: "USER",
          verified: true,
        },
        {
          name: "StartupHub Inc",
          email: "contact@startuphub.com",
          password: "demo123",
          role: "USER",
          verified: true,
        },
        {
          name: "DesignStudio Pro",
          email: "hello@designstudio.com",
          password: "demo123",
          role: "USER",
          verified: true,
        },
        {
          name: "AppFactory Ltd",
          email: "info@appfactory.com",
          password: "demo123",
          role: "USER",
          verified: true,
        },
        {
          name: "WebMasters Agency",
          email: "team@webmasters.com",
          password: "demo123",
          role: "USER",
          verified: true,
        },
      ];

      const createdClients = [];
      for (const clientData of demoClients) {
        // Avval client mavjudligini tekshiramiz
        let existingClient = await prisma.user.findUnique({
          where: { email: clientData.email },
        });

        if (!existingClient) {
          // Password'ni hash qilamiz
          const hashedPassword = await bcrypt.hash(clientData.password, 10);
          existingClient = await prisma.user.create({
            data: {
              ...clientData,
              password: hashedPassword,
            },
          });
        }
        createdClients.push(existingClient);
      }

      const demoProjects = [
        {
          title: "E-commerce Website Development",
          description:
            "Need a modern e-commerce website with React and Node.js. Should include payment integration, user authentication, and admin panel. Looking for experienced developers who can deliver high-quality code.",
          category: "Web Development",
          budget: "$1500-2500",
          budgetType: "fixed",
          skills: [
            "React",
            "Node.js",
            "MongoDB",
            "Payment Integration",
            "Stripe",
            "JWT",
          ],
          duration: "4-6 weeks",
          clientId: createdClients[0].id,
          status: "open",
        },
        {
          title: "Mobile App UI/UX Design",
          description:
            "Looking for a talented designer to create modern and user-friendly mobile app design. Need wireframes, mockups, and prototypes. The app is for food delivery service.",
          category: "Design",
          budget: "$800-1200",
          budgetType: "fixed",
          skills: [
            "Figma",
            "Adobe XD",
            "UI/UX Design",
            "Mobile Design",
            "Prototyping",
          ],
          duration: "2-3 weeks",
          clientId: createdClients[1].id,
          status: "open",
        },
        {
          title: "React Native Mobile App",
          description:
            "Develop a cross-platform mobile app using React Native. App should work on both iOS and Android with real-time features. Need push notifications and offline support.",
          category: "Mobile Development",
          budget: "$2000-3500",
          budgetType: "fixed",
          skills: [
            "React Native",
            "JavaScript",
            "Firebase",
            "API Integration",
            "Push Notifications",
          ],
          duration: "6-8 weeks",
          clientId: createdClients[2].id,
          status: "open",
        },
        {
          title: "Logo and Brand Identity Design",
          description:
            "Create a professional logo and complete brand identity package for a tech startup. Need modern and minimalist design with color palette and typography guidelines.",
          category: "Graphic Design",
          budget: "$300-600",
          budgetType: "fixed",
          skills: [
            "Logo Design",
            "Brand Identity",
            "Adobe Illustrator",
            "Photoshop",
            "Typography",
          ],
          duration: "1-2 weeks",
          clientId: createdClients[3].id,
          status: "open",
        },
        {
          title: "WordPress Website Customization",
          description:
            "Customize existing WordPress theme to match our brand. Need responsive design and performance optimization. Also need SEO optimization and security improvements.",
          category: "Web Development",
          budget: "$25-40/hour",
          budgetType: "hourly",
          skills: [
            "WordPress",
            "PHP",
            "CSS",
            "JavaScript",
            "SEO",
            "Performance",
          ],
          duration: "2-3 weeks",
          clientId: createdClients[4].id,
          status: "open",
        },
        {
          title: "Python Data Analysis Script",
          description:
            "Need a Python script to analyze sales data and generate reports. Should include data visualization with charts and graphs. Experience with pandas and matplotlib required.",
          category: "Data Science",
          budget: "$500-800",
          budgetType: "fixed",
          skills: ["Python", "Pandas", "Matplotlib", "Data Analysis", "Excel"],
          duration: "1-2 weeks",
          clientId: createdClients[0].id,
          status: "open",
        },
        {
          title: "Social Media Content Creation",
          description:
            "Create engaging social media content for Instagram and Facebook. Need 20 posts with graphics and captions. Experience with social media marketing required.",
          category: "Marketing",
          budget: "$200-400",
          budgetType: "fixed",
          skills: [
            "Social Media",
            "Graphic Design",
            "Content Writing",
            "Instagram",
            "Facebook",
          ],
          duration: "1 week",
          clientId: createdClients[1].id,
          status: "open",
        },
        {
          title: "Vue.js Frontend Development",
          description:
            "Build a responsive frontend for our web application using Vue.js. Need to integrate with existing REST API. Modern design and smooth animations required.",
          category: "Web Development",
          budget: "$1000-1800",
          budgetType: "fixed",
          skills: [
            "Vue.js",
            "JavaScript",
            "CSS3",
            "REST API",
            "Responsive Design",
          ],
          duration: "3-4 weeks",
          clientId: createdClients[2].id,
          status: "open",
        },
        {
          title: "Video Editing for YouTube",
          description:
            "Edit promotional videos for YouTube channel. Need professional editing with transitions, effects, and background music. Experience with Adobe Premiere Pro required.",
          category: "Video Editing",
          budget: "$15-25/hour",
          budgetType: "hourly",
          skills: [
            "Video Editing",
            "Adobe Premiere Pro",
            "After Effects",
            "YouTube",
          ],
          duration: "Ongoing",
          clientId: createdClients[3].id,
          status: "open",
        },
        {
          title: "Flutter Mobile App Development",
          description:
            "Develop a cross-platform mobile app using Flutter. App is for fitness tracking with workout plans and progress monitoring. Need clean UI and smooth performance.",
          category: "Mobile Development",
          budget: "$1800-2800",
          budgetType: "fixed",
          skills: [
            "Flutter",
            "Dart",
            "Firebase",
            "Mobile UI",
            "API Integration",
          ],
          duration: "5-7 weeks",
          clientId: createdClients[4].id,
          status: "open",
        },
      ];

      // Demo projectlarni ma'lumotlar bazasiga qo'shamiz
      for (const projectData of demoProjects) {
        await prisma.project.create({
          data: projectData,
        });
      }

      // Yangi yaratilgan projectlarni qaytaramiz
      projects = await prisma.project.findMany({
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          proposals: {
            include: {
              freelancer: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          _count: {
            select: {
              proposals: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      });
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Projects GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Yangi project yaratish
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
    const {
      title,
      description,
      category,
      budget,
      budgetType,
      skills,
      duration,
    } = body;

    if (!title || !description || !category || !budget) {
      return NextResponse.json(
        { error: "Title, description, category, and budget are required" },
        { status: 400 }
      );
    }

    // Yangi project yaratish
    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        category,
        budget,
        budgetType: budgetType || "fixed",
        skills: skills || [],
        duration,
        clientId: user.id,
        status: "open",
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            proposals: true,
          },
        },
      },
    });

    return NextResponse.json(newProject);
  } catch (error) {
    console.error("Projects POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
