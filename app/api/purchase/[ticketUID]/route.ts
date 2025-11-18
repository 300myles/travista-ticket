import { connectDB } from "@/lib/db"
import { Purchase } from "@/lib/models/purchase"
import { Ticket } from "@/lib/models/ticket"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(_request: NextRequest) {
  try {
    await connectDB()
    const params = _request.nextUrl.pathname.split("/")
    const ticketUID = params[params.length - 1]
    const purchase = await Purchase.findOne({ ticketUID })

    if (!purchase) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 })
    }

    const ticket = await Ticket.findById(purchase.ticketId)

    if (ticket) {
      const purchaseObj = purchase.toObject()
      purchaseObj.ticketName = ticket.name
      purchaseObj.slug = ticket.slug
      purchaseObj.flyerUrl = ticket.flyerUrl
      return NextResponse.json({ purchase: purchaseObj })
    }

    return NextResponse.json({ purchase })
  } catch (error) {
    console.error("Get purchase error:", error)
    return NextResponse.json({ error: "Failed to get purchase" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB()
    const { used } = await request.json()

    const params = request.nextUrl.pathname.split("/")
    const ticketUID = params[params.length - 1]
    const purchase = await Purchase.findOne({ ticketUID })
    if (!purchase) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 })
    }

    purchase.used = used
    if (used) {
      purchase.usedAt = new Date()
    } else {
      purchase.usedAt = undefined
    }

    await purchase.save()
    return NextResponse.json({ success: true, purchase })
  } catch (error) {
    console.error("Update purchase error:", error)
    return NextResponse.json({ error: "Failed to update purchase" }, { status: 500 })
  }
}
