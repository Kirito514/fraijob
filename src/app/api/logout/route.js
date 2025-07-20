// src/app/api/logout/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();
  cookieStore.delete('token');
  return NextResponse.json({ success: true });
}
