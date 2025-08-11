'use client';

import { useState } from 'react';

export default function TelegramAdminPage() {
  const [testResult, setTestResult] = useState(null);
  const [chatIdResult, setChatIdResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTestMessage = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      const response = await fetch('/api/telegram/test');
      const data = await response.json();
      
      setTestResult(data);
    } catch (error) {
      setTestResult({
        success: false,
        error: 'Network xatosi: ' + error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetChatId = async () => {
    setLoading(true);
    setChatIdResult(null);
    
    try {
      const response = await fetch('/api/telegram/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'getChatId' })
      });
      
      const data = await response.json();
      setChatIdResult(data);
    } catch (error) {
      setChatIdResult({
        success: false,
        error: 'Network xatosi: ' + error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            🤖 Telegram Bot Sozlamalari
          </h1>

          {/* Sozlash ko'rsatmalari */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              📋 Sozlash ko'rsatmalari:
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Telegram'da <strong>@BotFather</strong> botini toping</li>
              <li><code>/newbot</code> buyrug'ini yuboring</li>
              <li>Bot uchun nom va username bering</li>
              <li>Olingan <strong>Bot Token</strong>ni <code>.env.local</code> fayliga qo'shing:</li>
              <li className="ml-4">
                <code className="bg-gray-100 px-2 py-1 rounded">
                  TELEGRAM_BOT_TOKEN=your_bot_token_here
                </code>
              </li>
              <li>Botga biror xabar yuboring (masalan: <code>/start</code>)</li>
              <li>Pastdagi "Chat ID olish" tugmasini bosing</li>
              <li>Olingan Chat ID ni <code>.env.local</code> fayliga qo'shing:</li>
              <li className="ml-4">
                <code className="bg-gray-100 px-2 py-1 rounded">
                  TELEGRAM_CHAT_ID=your_chat_id_here
                </code>
              </li>
              <li>Serverni qayta ishga tushiring</li>
              <li>"Test xabari yuborish" tugmasini bosib tekshiring</li>
            </ol>
          </div>

          {/* Test tugmalari */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={handleTestMessage}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? '⏳ Yuborilmoqda...' : '📤 Test xabari yuborish'}
            </button>

            <button
              onClick={handleGetChatId}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? '⏳ Olinmoqda...' : '🆔 Chat ID olish'}
            </button>
          </div>

          {/* Test natijasi */}
          {testResult && (
            <div className={`border rounded-lg p-4 mb-4 ${
              testResult.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <h3 className="font-semibold mb-2">
                {testResult.success ? '✅ Test muvaffaqiyatli' : '❌ Test xatosi'}
              </h3>
              <p className={testResult.success ? 'text-green-700' : 'text-red-700'}>
                {testResult.message || testResult.error}
              </p>
            </div>
          )}

          {/* Chat ID natijasi */}
          {chatIdResult && (
            <div className={`border rounded-lg p-4 mb-4 ${
              chatIdResult.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <h3 className="font-semibold mb-2">
                {chatIdResult.success ? '✅ Chat ID olindi' : '❌ Chat ID xatosi'}
              </h3>
              {chatIdResult.success ? (
                <div>
                  <p className="text-green-700 mb-2">{chatIdResult.message}</p>
                  <div className="bg-gray-100 p-3 rounded border">
                    <strong>Chat ID:</strong> 
                    <code className="ml-2 bg-white px-2 py-1 rounded border">
                      {chatIdResult.chatId}
                    </code>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Bu Chat ID ni .env.local fayliga TELEGRAM_CHAT_ID sifatida qo'shing
                  </p>
                </div>
              ) : (
                <p className="text-red-700">{chatIdResult.error}</p>
              )}
            </div>
          )}

          {/* Environment variables holati */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              🔧 Environment Variables holati:
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <span className="w-4 h-4 mr-2">
                  {process.env.TELEGRAM_BOT_TOKEN ? '✅' : '❌'}
                </span>
                <span>TELEGRAM_BOT_TOKEN</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 mr-2">
                  {process.env.TELEGRAM_CHAT_ID ? '✅' : '❌'}
                </span>
                <span>TELEGRAM_CHAT_ID</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
