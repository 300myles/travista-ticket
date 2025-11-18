import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/user"
import { verifyAuth } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { fullName, profileImageUrl } = await request.json()

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { fullName, profileImageUrl },
      { new: true },
    )

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const userData = await User.findById(user._id).select("-passwordHash -verifyToken")

    return NextResponse.json({ user: userData })
  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json({ error: "Failed to get profile" }, { status: 500 })
  }
}
