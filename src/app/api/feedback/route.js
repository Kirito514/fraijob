import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { category, text, userId, userName, userEmail, timestamp } = body;

    // Validate required fields
    if (!category || !text || !userId) {
      return NextResponse.json(
        { error: "Barcha maydonlar to'ldirilishi shart" },
        { status: 400 }
      );
    }

    // Save feedback to database
    const feedback = await prisma.feedback.create({
      data: {
        category,
        text,
        userId,
        userName,
        userEmail,
        timestamp: new Date(timestamp),
        status: 'pending' // pending, reviewed, implemented
      },
    });

    // Send to Telegram bot
    try {
      const telegramMessage = `
🚀 **Yangi Feedback!**

👤 **Foydalanuvchi**: ${userName}
📧 **Email**: ${userEmail}
🏷️ **Kategoriya**: ${getCategoryName(category)}
📝 **Matn**: ${text}
⏰ **Vaqt**: ${new Date(timestamp).toLocaleString('uz-UZ')}

#feedback #fraijob #platforma
      `;

      await sendToTelegramBot(telegramMessage);
    } catch (telegramError) {
      console.error("Telegram error:", telegramError);
      // Don't fail the request if Telegram fails
    }

    return NextResponse.json({
      success: true,
      message: "Feedback muvaffaqiyatli saqlandi",
      feedback
    });

  } catch (error) {
    console.error("Feedback API error:", error);
    return NextResponse.json(
      { error: "Server xatosi" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    let where = {};
    
    if (userId) where.userId = userId;
    if (category) where.category = category;
    if (status) where.status = status;

    const feedbacks = await prisma.feedback.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 50
    });

    return NextResponse.json({ feedbacks });

  } catch (error) {
    console.error("Get feedback error:", error);
    return NextResponse.json(
      { error: "Server xatosi" },
      { status: 500 }
    );
  }
}

// Helper function to get category name in Uzbek
function getCategoryName(category) {
  const categories = {
    'ui_ux': 'UI/UX Dizayn',
    'functionality': 'Funksionallik',
    'performance': 'Tezlik va ishlash',
    'mobile': 'Mobil versiya',
    'features': 'Yangi xususiyatlar',
    'other': 'Boshqa'
  };
  return categories[category] || category;
}

// Send message to Telegram bot
async function sendToTelegramBot(message) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error("Telegram bot token yoki chat ID topilmadi");
    return;
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown'
    }),
  });

  if (!response.ok) {
    throw new Error(`Telegram API error: ${response.status}`);
  }

  return response.json();
}


