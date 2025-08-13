import { NextResponse } from 'next/server';
import { sendTestMessage, getChatId } from '@/lib/telegram';

export async function GET() {
  try {
    await sendTestMessage();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test xabari muvaffaqiyatli yuborildi!' 
    });
    
  } catch (error) {
    console.error('❌ Test xabar yuborishda xatolik:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, message } = body;
    
    if (action === 'getChatId') {
      const chatId = await getChatId();
      
      return NextResponse.json({ 
        success: true, 
        chatId: chatId,
        message: 'Chat ID muvaffaqiyatli olindi!' 
      });
    }
    
    // Send feedback message
    if (message) {
      const { sendMessage } = await import('@/lib/telegram');
      await sendMessage(message);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Feedback muvaffaqiyatli yuborildi!' 
      });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Xabar matni kerak' 
    }, { status: 400 });
    
  } catch (error) {
    console.error('❌ Feedback yuborishda xatolik:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
