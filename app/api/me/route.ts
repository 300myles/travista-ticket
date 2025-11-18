import { getAuthToken, verifyToken } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/user"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthToken()
    if (!token) {
      return NextResponse.json({ user: null })
    }

    const userId = verifyToken(token)
    if (!userId) {
      return NextResponse.json({ user: null })
    }

    await connectDB()
    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ user: null })
  }
}
