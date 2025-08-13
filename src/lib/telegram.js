import TelegramBot from 'node-telegram-bot-api';
import { PrismaClient } from '@prisma/client';

// Telegram Bot konfiguratsiyasi
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

let bot = null;
const prisma = new PrismaClient();

// Bot'ni ishga tushirish
export function initTelegramBot() {
  if (!TELEGRAM_BOT_TOKEN) {
    console.warn('⚠️ TELEGRAM_BOT_TOKEN topilmadi. Telegram xabarlari yuborilmaydi.');
    return null;
  }

  if (!bot) {
    bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
    console.log('✅ Telegram Bot ishga tushirildi');
    
    // Bot komandalarini sozlash
    setupBotCommands();
    
    // Bot komandalarini Telegram API ga ro'yxatdan o'tkazish
    bot.setMyCommands([
      { command: '/start', description: 'Botni ishga tushirish' },
      { command: '/stats', description: 'Platforma statistikasini ko\'rish' },
      { command: '/waitlist', description: 'Kutish ro\'yxatini ko\'rish' },
      { command: '/help', description: 'Yordam olish' }
    ]).then(() => {
      console.log('✅ Bot komandalar menyusi sozlandi');
    }).catch(err => {
      console.error('❌ Bot komandalar menyusini sozlashda xatolik:', err);
    });
  }
  
  return bot;
}

// Bot komandalarini sozlash
function setupBotCommands() {
  if (!bot) return;
  
  // Start komandasi uchun handler
  bot.onText(/\/start/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      const username = msg.from.first_name;
      
      const welcomeMessage = `
👋 Salom, ${username}!

<b>FraiJob Telegram Bot</b>ga xush kelibsiz.

Quyidagi komandalardan foydalanishingiz mumkin:
/stats - Platforma statistikasini ko'rish
/waitlist - Kutish ro'yxatini ko'rish
/help - Yordam olish
      `.trim();
      
      await bot.sendMessage(chatId, welcomeMessage, {
        parse_mode: 'HTML'
      });
      
    } catch (error) {
      console.error('❌ Xush kelibsiz xabarini yuborishda xatolik:', error);
    }
  });
  
  // Statistika tugmasi uchun handler
  bot.onText(/\/stats/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      
      // Statistikani olish
      const totalUsers = await prisma.user.count();
      const waitlistUsers = await prisma.waitlist.count();
      
      const statsMessage = `
📊 <b>Platforma Statistikasi</b>

👥 <b>Ro'yxatdan o'tgan foydalanuvchilar:</b> ${totalUsers}
🔄 <b>Kutish ro'yxatidagi foydalanuvchilar:</b> ${waitlistUsers}

📅 <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}
      `.trim();
      
      await bot.sendMessage(chatId, statsMessage, {
        parse_mode: 'HTML'
      });
      
    } catch (error) {
      console.error('❌ Statistika yuborishda xatolik:', error);
    }
  });
  
  // Yordam komandasi uchun handler
  bot.onText(/\/help/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      
      const helpMessage = `
🤖 <b>FraiJob Bot Yordami</b>

Quyidagi komandalardan foydalanishingiz mumkin:

/start - Botni ishga tushirish
/stats - Platforma statistikasini ko'rish
/waitlist - Kutish ro'yxatini ko'rish
/help - Ushbu yordam xabarini ko'rish

Bot orqali platformadagi yangi foydalanuvchilar haqida xabarlar olasiz va statistikani ko'rishingiz mumkin.
      `.trim();
      
      await bot.sendMessage(chatId, helpMessage, {
        parse_mode: 'HTML'
      });
      
    } catch (error) {
      console.error('❌ Yordam xabarini yuborishda xatolik:', error);
    }
  });
  
  // Waitlist ro'yxatini ko'rish uchun handler
  bot.onText(/\/waitlist/, async (msg) => {
    try {
      const chatId = msg.chat.id;
      
      // Waitlist ma'lumotlarini olish
      const waitlistUsers = await prisma.waitlist.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20 // Eng so'nggi 20 ta foydalanuvchi
      });
      
      if (waitlistUsers.length === 0) {
        await bot.sendMessage(chatId, '📝 <b>Kutish ro\'yxatida hech kim yo\'q</b>', {
          parse_mode: 'HTML'
        });
        return;
      }
      
      // Ro'yxat xabarini tayyorlash
      let waitlistMessage = `📋 <b>Kutish ro'yxati</b> (so'nggi ${waitlistUsers.length} ta)\n\n`;
      
      waitlistUsers.forEach((user, index) => {
        const date = new Date(user.createdAt);
        const formattedDate = date.toLocaleString('uz-UZ', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        waitlistMessage += `${index + 1}. ${user.email} - ${formattedDate}\n`;
      });
      
      await bot.sendMessage(chatId, waitlistMessage, {
        parse_mode: 'HTML'
      });
      
    } catch (error) {
      console.error('❌ Waitlist ro\'yxatini yuborishda xatolik:', error);
      await bot.sendMessage(msg.chat.id, '❌ <b>Xatolik yuz berdi</b>\n\nKutish ro\'yxatini olishda muammo yuzaga keldi.', {
        parse_mode: 'HTML'
      });
    }
  });
}

// Yangi foydalanuvchi haqida xabar yuborish
export async function sendNewUserNotification(userData) {
  try {
    const telegramBot = initTelegramBot();
    
    if (!telegramBot || !TELEGRAM_CHAT_ID) {
      console.warn('⚠️ Telegram bot yoki chat ID sozlanmagan');
      return false;
    }

    // Xabar formatini yaratish
    const message = formatNewUserMessage(userData);
    
    // Xabarni yuborish
    await telegramBot.sendMessage(TELEGRAM_CHAT_ID, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true
    });
    
    console.log('✅ Telegram xabari yuborildi:', userData.email);
    return true;
    
  } catch (error) {
    console.error('❌ Telegram xabar yuborishda xatolik:', error);
    return false;
  }
}

// Xabar formatini yaratish
function formatNewUserMessage(userData) {
  const { name, email, createdAt } = userData;
  
  // Vaqtni formatlash
  const date = new Date(createdAt);
  const formattedDate = date.toLocaleString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
🎉 <b>Yangi foydalanuvchi ro'yxatdan o'tdi!</b>

👤 <b>Ism:</b> ${name || 'Kiritilmagan'}
📧 <b>Email:</b> ${email}
📅 <b>Sana:</b> ${formattedDate}

🔗 <b>Platform:</b> FraiJob
  `.trim();
}

// Waitlist ro'yxatiga qo'shilgan foydalanuvchi haqida xabar yuborish
export async function sendWaitlistNotification(userData) {
  try {
    const telegramBot = initTelegramBot();
    
    if (!telegramBot || !TELEGRAM_CHAT_ID) {
      console.warn('⚠️ Telegram bot yoki chat ID sozlanmagan');
      return false;
    }

    // Xabar formatini yaratish
    const message = formatWaitlistMessage(userData);
    
    // Xabarni yuborish
    await telegramBot.sendMessage(TELEGRAM_CHAT_ID, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true
    });
    
    console.log('✅ Waitlist xabari yuborildi:', userData.email);
    return true;
    
  } catch (error) {
    console.error('❌ Waitlist xabar yuborishda xatolik:', error);
    return false;
  }
}

// Waitlist xabar formatini yaratish
function formatWaitlistMessage(userData) {
  const { email, createdAt } = userData;
  const name = userData.name || null;
  
  // Vaqtni formatlash
  const date = new Date(createdAt);
  const formattedDate = date.toLocaleString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
🎯 <b>Yangi foydalanuvchi kutish ro'yxatiga qo'shildi!</b>

${name ? `👤 <b>Ism:</b> ${name}\n` : ''}📧 <b>Email:</b> ${email}
📅 <b>Sana:</b> ${formattedDate}

🔗 <b>Platform:</b> FraiJob
  `.trim();
}

// Test xabari yuborish
export async function sendTestMessage() {
  try {
    const telegramBot = initTelegramBot();
    
    if (!telegramBot || !TELEGRAM_CHAT_ID) {
      throw new Error('Telegram bot yoki chat ID sozlanmagan');
    }

    const testMessage = `
🤖 <b>Test xabari</b>

✅ Telegram bot muvaffaqiyatli ishlayapti!
📅 Vaqt: ${new Date().toLocaleString('uz-UZ')}
    `.trim();
    
    await telegramBot.sendMessage(TELEGRAM_CHAT_ID, testMessage, {
      parse_mode: 'HTML'
    });
    
    console.log('✅ Test xabari yuborildi');
    return true;
    
  } catch (error) {
    console.error('❌ Test xabar yuborishda xatolik:', error);
    throw error;
  }
}

// Chat ID olish uchun yordamchi funksiya
export async function getChatId() {
  try {
    const telegramBot = initTelegramBot();
    
    if (!telegramBot) {
      throw new Error('Telegram bot sozlanmagan');
    }

    // Bot haqida ma'lumot olish
    const botInfo = await telegramBot.getMe();
    console.log('Bot ma\'lumotlari:', botInfo);
    
    // Oxirgi xabarlarni olish (chat ID topish uchun)
    const updates = await telegramBot.getUpdates();
    
    if (updates.length > 0) {
      const lastUpdate = updates[updates.length - 1];
      const chatId = lastUpdate.message?.chat?.id;
      
      if (chatId) {
        console.log('Chat ID topildi:', chatId);
        return chatId;
      }
    }
    
    throw new Error('Chat ID topilmadi. Botga biror xabar yuboring va qayta urinib ko\'ring.');
    
  } catch (error) {
    console.error('❌ Chat ID olishda xatolik:', error);
    throw error;
  }
}

// Xabar yuborish uchun umumiy funksiya
export async function sendMessage(message) {
  try {
    const telegramBot = initTelegramBot();
    
    if (!telegramBot || !TELEGRAM_CHAT_ID) {
      throw new Error('Telegram bot yoki chat ID sozlanmagan');
    }

    await telegramBot.sendMessage(TELEGRAM_CHAT_ID, message, {
      parse_mode: 'Markdown'
    });
    
    console.log('✅ Xabar yuborildi');
    return true;
    
  } catch (error) {
    console.error('❌ Xabar yuborishda xatolik:', error);
    throw error;
  }
}
