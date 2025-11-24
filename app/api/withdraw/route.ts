import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/user"
import { verifyAuth } from "@/lib/auth"
import { initializeSquadPayout } from "@/lib/squad"
import crypto from "crypto"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { amount, bankCode } = await request.json()

    const userData = await User.findById(user._id)
    if (!userData?.bankAccount?.verified) {
      return NextResponse.json(
        { error: "No verified bank account. Please add an account first." },
        { status: 400 },
      )
    }

    if (userData.walletBalance < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    const reference = `WD-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`

    const payoutResponse = await initializeSquadPayout(
      amount * 100,
      userData.bankAccount.accountNumber,
      bankCode,
      `Travista Withdrawal - ${userData.fullName}`,
      reference,
    )

    if (payoutResponse.status === true) {
      const transaction = {
        type: "withdrawal" as const,
        amount,
        status: "pending" as const,
        reference,
        date: new Date(),
      }

      userData.transactions.push(transaction)
      userData.walletBalance -= amount;
      await userData.save()

      return NextResponse.json({
        success: true,
        message: "Withdrawal initiated",
        reference,
        transaction,
      })
    }

    return NextResponse.json({ error: "Failed to initialize withdrawal" }, { status: 500 })
  } catch (error) {
    console.error("Withdrawal error:", error)
    return NextResponse.json({ error: "Failed to process withdrawal" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const userData = await User.findById(user._id)

    const withdrawals = userData?.transactions.filter((t: { type: string }) => t.type === "withdrawal") || []

    return NextResponse.json({ withdrawals })
  } catch (error) {
    console.error("Get withdrawals error:", error)
    return NextResponse.json({ error: "Failed to get withdrawals" }, { status: 500 })
  }
}
