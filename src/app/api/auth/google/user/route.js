import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { access_token } = await request.json()
    
    if (!access_token) {
      return NextResponse.json({ error: 'Access token required' }, { status: 400 })
    }

    // Google foydalanuvchi ma'lumotlarini olish
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    })

    if (!userResponse.ok) {
      const errorData = await userResponse.text()
      console.error('Google user info error:', errorData)
      return NextResponse.json({ error: 'Foydalanuvchi ma\'lumotlarini olishda xatolik' }, { status: 400 })
    }

    const userData = await userResponse.json()
    
    return NextResponse.json({
      id: userData.id,
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
      verified_email: userData.verified_email,
    })
    
  } catch (error) {
    console.error('Google user API error:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
} 