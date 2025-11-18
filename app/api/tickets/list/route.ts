import { getAuthToken, verifyToken } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { Ticket } from "@/lib/models/ticket"
import { Purchase } from "@/lib/models/purchase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthToken()
    const userId = token ? verifyToken(token) : null

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const tickets = await Ticket.find({ organizerId: userId }).sort({ createdAt: -1 })

    const ticketsWithStats = await Promise.all(
      tickets.map(async (ticket: { _id: any; toObject: () => any }) => {
        const purchases = await Purchase.find({
          ticketId: ticket._id,
          paymentStatus: "completed",
        })
        return {
          ...ticket.toObject(),
          totalSold: purchases.length,
          totalRevenue: purchases.reduce((sum: any, p: { amount: any }) => sum + p.amount, 0),
        }
      }),
    )

    return NextResponse.json({ tickets: ticketsWithStats })
  } catch (error) {
    console.error("List tickets error:", error)
    return NextResponse.json({ error: "Failed to list tickets" }, { status: 500 })
  }
}
