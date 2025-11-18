import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/user"
import { setAuthCookie } from "@/lib/auth"
import bcrypt from "bcryptjs"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { token, password, fullName } = await request.json()

    if (!token || !password || !fullName) {
      return NextResponse.json({ error: "Token, password, and full name are required" }, { status: 400 })
    }

    const user = await User.findOne({ verifyToken: token })
    if (!user) {
      return NextResponse.json({ error: "Invalid verification token" }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    user.isVerified = true
    user.verifyToken = undefined
    user.passwordHash = passwordHash
    user.fullName = fullName
    await user.save()

    await setAuthCookie(user._id.toString())

    return NextResponse.json({ success: true, userId: user._id })
  } catch (error) {
    console.error("Verify error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
