import { getAuthToken, verifyToken } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { Ticket } from "@/lib/models/ticket"
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

    const allTickets = await Ticket.find({ organizerId: user._id });

    if (allTickets) {
      const totalRevenue = allTickets.reduce((sum: any, t: { totalRevenue: any }) => sum + (t.totalRevenue || 0), 0);
      const userObect = user.toObject();
      userObect.walletBalance = totalRevenue;
      userObect.availableBalance = (parseInt(totalRevenue) * 0.9); // Assuming 10% platform fee
      Object.assign(user, userObect);
    }

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        isVerified: user.isVerified,
        walletBalance: user.walletBalance,
        availableBalance: user.availableBalance,
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ user: null })
  }
}
