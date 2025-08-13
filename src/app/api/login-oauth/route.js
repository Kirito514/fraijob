import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { sendNewUserNotification } from "@/lib/telegram";

export async function POST(request) {
  return NextResponse.json({ 
    error: 'OAuth login vaqtincha o\'chirilgan' 
  }, { status: 403 });
}
