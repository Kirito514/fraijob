import './globals.css' // ← bu import har doim bo'lishi shart
import { initTelegramBot } from '@/lib/telegram'

// Telegram botni ishga tushirish
if (process.env.TELEGRAM_BOT_TOKEN) {
  initTelegramBot()
}

export const metadata = {
  title: 'FraiJob',
  description: 'Landing Page',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
