import { NextResponse } from 'next/server'

export async function POST(request) {
  return NextResponse.json({ 
    error: 'Google OAuth vaqtincha o\'chirilgan' 
  }, { status: 403 })
} 