import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { type NextRequest } from "next/server"
import { User } from "@/lib/models/user"
import { connectDB } from "@/lib/db"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function setAuthCookie(userId: string) {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30d" })
  const cookieStore = await cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
  })
  return token
}

export async function getAuthToken() {
  const cookieStore = await cookies()
  return cookieStore.get("auth-token")?.value
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
}

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return decoded.userId
  } catch {
    return null
  }
}

export async function verifyAuth(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return null
    }

    const userId = verifyToken(token)
    if (!userId) {
      return null
    }

    await connectDB()
    const user = await User.findById(userId)
    return user
  } catch (error) {
    console.error("Auth verification error:", error)
    return null
  }
}
