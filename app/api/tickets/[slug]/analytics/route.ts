import { connectDB } from "@/lib/db"
import { Ticket } from "@/lib/models/ticket"
import { Purchase } from "@/lib/models/purchase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await connectDB()
    const {slug} = await params;
    const ticket = await Ticket.findOne({ slug })

    if (!ticket) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    const ticketTypeAnalytics = await Promise.all(
      ticket.ticketTypes.map(async (type: any) => {
        const purchases = await Purchase.find({
          ticketId: ticket._id,
          paymentStatus: "completed",
          ticketTypeId: type.id,
        })

        const revenue = purchases.reduce((sum: number, p: any) => sum + p.amount, 0)

        return {
          id: type.id,
          name: type.name,
          price: type.price,
          description: type.description,
          quantity: type.quantity,
          sold: type.sold,
          available: type.quantity - type.sold,
          revenue,
          conversionRate: type.quantity > 0 ? ((type.sold / type.quantity) * 100).toFixed(1) : "0",
        }
      }),
    )

    const totalRevenue = ticketTypeAnalytics.reduce((sum: number, t: any) => sum + t.revenue, 0)
    const totalSold = ticketTypeAnalytics.reduce((sum: number, t: any) => sum + t.sold, 0)
    const totalQuantity = ticketTypeAnalytics.reduce((sum: number, t: any) => sum + t.quantity, 0)

    return NextResponse.json({
      event: {
        name: ticket.name,
        slug: ticket.slug,
        eventDate: ticket.eventDate,
        flyerUrl: ticket.flyerUrl,
      },
      stats: {
        totalRevenue,
        totalSold,
        totalQuantity,
        averagePrice:
          ticketTypeAnalytics.length > 0
            ? (
                ticketTypeAnalytics.reduce((sum: number, t: any) => sum + t.price, 0) / ticketTypeAnalytics.length
              ).toFixed(0)
            : 0,
        overallConversion: totalQuantity > 0 ? ((totalSold / totalQuantity) * 100).toFixed(1) : "0",
      },
      ticketTypes: ticketTypeAnalytics,
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
