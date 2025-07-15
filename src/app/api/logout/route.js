import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = cookies()
  cookieStore.delete('token')

  return new Response(JSON.stringify({ message: 'Logout ok' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
