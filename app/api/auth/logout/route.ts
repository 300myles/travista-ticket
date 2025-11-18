import { clearAuthCookie } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  await clearAuthCookie()
  return NextResponse.json({ success: true })
}
