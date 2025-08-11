import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    
    // Admin sahifalariga faqat admin rolida bo'lgan foydalanuvchilar kirishi mumkin
    if (isAdminRoute) {
      const userRole = payload.role?.toLowerCase();
      if (userRole !== 'admin') {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
    
    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/profile/:path*', 
    '/admin/:path*',
    '/api/portfolio/:path*',
    '/api/jobs/:path*',
    '/api/tests/:path*',
    '/api/chats/:path*'
  ],
}

