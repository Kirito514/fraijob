import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { code } = await request.json()
    
    if (!code) {
      return NextResponse.json({ error: 'Authorization code required' }, { status: 400 })
    }

    // Google OAuth token exchange
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Google token error:', errorData)
      return NextResponse.json({ error: 'Token olishda xatolik' }, { status: 400 })
    }

    const tokenData = await tokenResponse.json()
    
    return NextResponse.json({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
    })
    
  } catch (error) {
    console.error('Google token API error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
} 