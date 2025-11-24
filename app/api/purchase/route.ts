import { connectDB } from "@/lib/db"
import { Purchase } from "@/lib/models/purchase"
import { Ticket } from "@/lib/models/ticket"
import { createSquadPaymentLink } from "@/lib/squad"
import { generateUniqueTicketUID } from "@/lib/utils"
import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const formData = await request.formData()

    const ticketId = formData.get("ticketId") as string
    const ticketTypeId = formData.get("ticketTypeId") as string // added ticket type
    const buyerName = formData.get("buyerName") as string
    const buyerEmail = formData.get("buyerEmail") as string
    const buyerPhone = formData.get("buyerPhone") as string
    const buyerWhatsapp = formData.get("buyerWhatsapp") as string

    const ticket = await Ticket.findById(ticketId)
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    const ticketType = ticket.ticketTypes.find((t: any) => t.id === ticketTypeId)
    if (!ticketType) {
      return NextResponse.json({ error: "Ticket type not found" }, { status: 404 })
    }

    if (ticketType.sold >= ticketType.quantity) {
      return NextResponse.json({ error: "Ticket type sold out" }, { status: 400 })
    }

    const paymentRef = `TRV-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`

    const purchase = await Purchase.create({
      ticketId,
      ticketTypeId, // store ticket type reference
      buyerName,
      buyerEmail,
      buyerPhone,
      buyerWhatsapp,
      amount: ticketType.price,
      paymentReference: paymentRef,
      paymentStatus: "pending",
      ticketName: ticketType.name,
      eventName: ticket.name,
    })

    if (ticketType.price === 0) {
      purchase.paymentStatus = "completed"
      purchase.ticketUID = generateUniqueTicketUID()
      const qrPayload = {
        ticketUID: purchase.ticketUID,
        paymentReference: paymentRef,
        timestamp: new Date().toISOString(),
      }
      purchase.qrPayload = JSON.stringify(qrPayload)
      await purchase.save()

      ticketType.sold += 1
      ticket.totalSold += 1
      await ticket.save()

      return NextResponse.json({
        success: true,
        isFreeTicket: true,
        purchaseId: purchase._id,
        ticketUID: purchase.ticketUID,
      })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const callbackUrl = `${baseUrl}/api/webhook/payment`

    const squadResponse = await createSquadPaymentLink(ticketType.price, buyerEmail, paymentRef, callbackUrl)

    if (squadResponse?.success === true) {
      return NextResponse.json({
        success: true,
        paymentUrl: squadResponse?.data?.checkout_url,
        purchaseId: purchase._id,
      })
    }

    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 })
  } catch (error) {
    console.error("Purchase error:", error)
    return NextResponse.json({ error: "Failed to create purchase" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const ticketUID = request.nextUrl.searchParams.get("ticketUID")

    if (!ticketUID) {
      return NextResponse.json({ error: "Ticket UID required" }, { status: 400 })
    }

    await connectDB()
    const purchase = await Purchase.findOne({ ticketUID })

    if (!purchase) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 })
    }

    return NextResponse.json({ purchase: purchase.toObject() })
  } catch (error) {
    console.error("Get purchase error:", error)
    return NextResponse.json({ error: "Failed to get purchase" }, { status: 500 })
  }
}
