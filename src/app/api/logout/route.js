// src/app/api/logout/route.js
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set("token", "", {
    httpOnly: true,
    secure: true,
    path: "/",
    expires: new Date(0), // cookie ni o‘chirish
  });

  return response;
}
