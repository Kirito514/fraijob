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

// Demo testlarni yaratish
async function createDemoTests() {
  const demoTests = [
    {
      title: "JavaScript Basics",
      description: "Test your JavaScript fundamentals",
      timeLimit: 15,
      questions: [
        {
          question: "What is the correct way to declare a variable in JavaScript?",
          options: [
            { text: "var x = 5;", isCorrect: true },
            { text: "variable x = 5;", isCorrect: false },
            { text: "v x = 5;", isCorrect: false },
            { text: "let x = 5;", isCorrect: false }
          ]
        },
        {
          question: "Which method is used to add an element to the end of an array?",
          options: [
            { text: "push()", isCorrect: true },
            { text: "pop()", isCorrect: false },
            { text: "shift()", isCorrect: false },
            { text: "unshift()", isCorrect: false }
          ]
        },
        {
          question: "What does 'typeof' operator return?",
          options: [
            { text: "A string", isCorrect: true },
            { text: "A number", isCorrect: false },
            { text: "A boolean", isCorrect: false },
            { text: "An object", isCorrect: false }
          ]
        }
      ]
    },
    {
      title: "React Fundamentals",
      description: "Test your React knowledge",
      timeLimit: 20,
      questions: [
        {
          question: "What is a React component?",
          options: [
            { text: "A function that returns JSX", isCorrect: true },
            { text: "A CSS class", isCorrect: false },
            { text: "A database table", isCorrect: false },
            { text: "A server endpoint", isCorrect: false }
          ]
        },
        {
          question: "What hook is used for side effects in React?",
          options: [
            { text: "useEffect", isCorrect: true },
            { text: "useState", isCorrect: false },
            { text: "useContext", isCorrect: false },
            { text: "useReducer", isCorrect: false }
          ]
        },
        {
          question: "What is JSX?",
          options: [
            { text: "JavaScript XML", isCorrect: true },
            { text: "Java Script Extension", isCorrect: false },
            { text: "JavaScript XHTML", isCorrect: false },
            { text: "JavaScript XMLHttpRequest", isCorrect: false }
          ]
        }
      ]
    },
    {
      title: "HTML & CSS Basics",
      description: "Test your HTML and CSS knowledge",
      timeLimit: 15,
      questions: [
        {
          question: "What does HTML stand for?",
          options: [
            { text: "HyperText Markup Language", isCorrect: true },
            { text: "High Tech Modern Language", isCorrect: false },
            { text: "Home Tool Markup Language", isCorrect: false },
            { text: "Hyperlink and Text Markup Language", isCorrect: false }
          ]
        },
        {
          question: "Which CSS property controls the text size?",
          options: [
            { text: "font-size", isCorrect: true },
            { text: "text-size", isCorrect: false },
            { text: "size", isCorrect: false },
            { text: "font-style", isCorrect: false }
          ]
        },
        {
          question: "What is the correct HTML for creating a hyperlink?",
          options: [
            { text: "<a href='url'>link</a>", isCorrect: true },
            { text: "<link>url</link>", isCorrect: false },
            { text: "<url>link</url>", isCorrect: false },
            { text: "<a>url</a>", isCorrect: false }
          ]
        }
      ]
    }
  ];

  for (const demoTest of demoTests) {
    // Test mavjudligini tekshirish
    const existingTest = await prisma.test.findFirst({
      where: { title: demoTest.title }
    });

    if (!existingTest) {
      await prisma.test.create({
        data: {
          title: demoTest.title,
          description: demoTest.description,
          timeLimit: demoTest.timeLimit,
          isActive: true,
          createdBy: "demo", // Demo testlar uchun
          questions: {
            create: demoTest.questions.map((question, index) => ({
              question: question.question,
              type: "multiple_choice",
              order: index + 1,
              options: {
                create: question.options.map((option, optionIndex) => ({
                  text: option.text,
                  isCorrect: option.isCorrect,
                  order: optionIndex + 1
                }))
              }
            }))
          }
        }
      });
    }
  }
}

// GET - Testlarni olish
export async function GET(request) {
  try {
    const user = await verifyToken();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Demo testlarni yaratish (faqat bir marta)
    await createDemoTests();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const userId = user.id;

    if (type === "available") {
      // Foydalanuvchi uchun mavjud testlarni olish
      const availableTests = await prisma.test.findMany({
        where: {
          isActive: true,
          userResults: {
            none: {
              userId: userId
            }
          }
        },
        include: {
          questions: {
            include: {
              options: true
            }
          }
        }
      });
      
      return NextResponse.json(availableTests);
    } else {
      // Admin uchun barcha testlarni olish
      if (user.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      
      const allTests = await prisma.test.findMany({
        include: {
          questions: {
            include: {
              options: true
            }
          },
          userResults: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      });
      
      return NextResponse.json(allTests);
    }
  } catch (error) {
    console.error("Error fetching tests:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Yangi test yaratish (faqat admin)
export async function POST(request) {
  try {
    const user = await verifyToken();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, timeLimit, questions } = body;

    // Test yaratish
    const test = await prisma.test.create({
      data: {
        title,
        description,
        timeLimit: timeLimit || 30, // default 30 daqiqa
        isActive: true,
        createdBy: user.id,
        questions: {
          create: questions.map((question, index) => ({
            question: question.question,
            type: question.type || "multiple_choice",
            order: index + 1,
            options: {
              create: question.options.map((option, optionIndex) => ({
                text: option.text,
                isCorrect: option.isCorrect || false,
                order: optionIndex + 1
              }))
            }
          }))
        }
      },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    });

    return NextResponse.json(test, { status: 201 });
  } catch (error) {
    console.error("Error creating test:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH - Test natijalarini saqlash
export async function PATCH(request) {
  try {
    const user = await verifyToken();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { testId, answers, timeSpent } = body;

    // Testni olish
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    });

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    // Natijalarni hisoblash
    let correctAnswers = 0;
    let totalQuestions = test.questions.length;

    for (const answer of answers) {
      const question = test.questions.find(q => q.id === answer.questionId);
      if (question) {
        const correctOption = question.options.find(opt => opt.isCorrect);
        if (correctOption && correctOption.id === answer.selectedOptionId) {
          correctAnswers++;
        }
      }
    }

    const score = Math.round((correctAnswers / totalQuestions) * 100);

    // Natijani saqlash
    const result = await prisma.testResult.create({
      data: {
        userId: user.id,
        testId: testId,
        score: score,
        timeSpent: timeSpent,
        answers: answers,
        completedAt: new Date()
      }
    });

    return NextResponse.json({
      result,
      score,
      correctAnswers,
      totalQuestions
    });
  } catch (error) {
    console.error("Error saving test result:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 