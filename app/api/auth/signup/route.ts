import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/user"
import { sendVerificationEmail } from "@/lib/mailer"
import crypto from "crypto"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const verifyToken = crypto.randomBytes(32).toString("hex")
    const user = await User.create({
      email: email.toLowerCase(),
      verifyToken,
      isVerified: false,
    })

    await sendVerificationEmail(email, verifyToken)

    return NextResponse.json({ success: true, userId: user._id })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Signup failed" }, { status: 500 })
  }
}
