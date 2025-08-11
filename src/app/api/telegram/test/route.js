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
    const { action } = body;
    
    if (action === 'getChatId') {
      const chatId = await getChatId();
      
      return NextResponse.json({ 
        success: true, 
        chatId: chatId,
        message: 'Chat ID muvaffaqiyatli olindi!' 
      });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Noto\'g\'ri action' 
    }, { status: 400 });
    
  } catch (error) {
    console.error('❌ Chat ID olishda xatolik:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
