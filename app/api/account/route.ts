import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/user"
import { verifyAuth } from "@/lib/auth"
import { verifySquadAccountNumber } from "@/lib/squad"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const userData = await User.findById(user._id)

    return NextResponse.json({ account: userData?.bankAccount || null })
  } catch (error) {
    console.error("Get account error:", error)
    return NextResponse.json({ error: "Failed to get account" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { accountName, accountNumber, bankName, bankCode } = await request.json()

    const verification = await verifySquadAccountNumber(accountNumber, bankCode)
    console.log("Account verification result:", verification)
    if (!verification.success) {
      return NextResponse.json({ error: "Invalid account number or bank code" }, { status: 400 })
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        bankAccount: {
          accountName,
          accountNumber,
          bankName,
          verified: true,
        },
      },
      { new: true },
    )

    return NextResponse.json({ account: updatedUser?.bankAccount })
  } catch (error) {
    console.error("Add account error:", error)
    return NextResponse.json({ error: "Failed to add account" }, { status: 500 })
  }
}
