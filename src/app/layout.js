import './globals.css' // ← bu import har doim bo'lishi shart

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
