import { connectDB } from "@/lib/db"
import { Purchase } from "@/lib/models/purchase"
import { Ticket } from "@/lib/models/ticket"
import { verifySquadWebhook, verifySquadPayment } from "@/lib/squad"
import { generateUniqueTicketUID } from "@/lib/utils"
import { sendTicketEmail } from "@/lib/mailer"
import { sendTicketWhatsApp } from "@/lib/whatsapp"
import { type NextRequest, NextResponse } from "next/server"
import { User } from "@/lib/models/user"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-squad-signature") || ""

    const isValid = verifySquadWebhook(signature, body)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const data = JSON.parse(body)
    await connectDB()

    if (data.Event === "charge.completed") {
      const paymentRef = data.Data.transaction_ref
      const purchase = await Purchase.findOne({ paymentReference: paymentRef })

      if (purchase) {
        purchase.paymentStatus = "completed"
        purchase.ticketUID = generateUniqueTicketUID()

        const qrPayload = {
          ticketUID: purchase.ticketUID,
          paymentReference: paymentRef,
          timestamp: new Date().toISOString(),
        }

        purchase.qrPayload = JSON.stringify(qrPayload)
        await purchase.save()

        const ticket = await Ticket.findById(purchase.ticketId)
        if (ticket) {
          const ticketType = ticket.ticketTypes.find((t: any) => t.id === purchase.ticketTypeId)
          if (ticketType) {
            ticketType.sold += 1
          }

          ticket.totalSold += 1
          ticket.totalRevenue += purchase.amount
          await ticket.save()

          const user = await User.findById(ticket.organizerId)
          if (user) {
            user.walletBalance += Number.parseInt(purchase.amount) * 0.9 // 10% platform fee
            await user.save()
          }
        }

        try {
          await sendTicketEmail(
            purchase.buyerEmail,
            purchase.buyerName,
            purchase.ticketName,
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/qrcode?uid=${purchase.ticketUID}`,
            `${process.env.NEXT_PUBLIC_BASE_URL}/ticket/success/${purchase.ticketUID}`,
          )

          await sendTicketWhatsApp(purchase.buyerWhatsapp, purchase.buyerName, purchase.ticketName, purchase.ticketUID)
        } catch (error) {
          console.error("Error sending notifications:", error)
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const transactionRef = request.nextUrl.searchParams.get("reference")
    if (!transactionRef) {
      return NextResponse.json({ error: "Transaction reference required" }, { status: 400 })
    }

    await connectDB()

    const paymentData = await verifySquadPayment(transactionRef)

    if (paymentData.success === true && paymentData.data.transaction_status === "success") {
      const purchase = await Purchase.findOne({ paymentReference: transactionRef })

      if (purchase && purchase.paymentStatus !== "completed") {
        purchase.paymentStatus = "completed"
        purchase.ticketUID = generateUniqueTicketUID()

        const qrPayload = {
          ticketUID: purchase.ticketUID,
          paymentReference: transactionRef,
          timestamp: new Date().toISOString(),
        }

        purchase.qrPayload = JSON.stringify(qrPayload)
        await purchase.save()

        const ticket = await Ticket.findById(purchase.ticketId)
        if (ticket) {
          const ticketType = ticket.ticketTypes.find((t: any) => t.id === purchase.ticketTypeId)
          if (ticketType) {
            ticketType.sold += 1
          }

          ticket.totalSold += 1
          ticket.totalRevenue += purchase.amount
          await ticket.save()

          const user = await User.findById(ticket.organizerId)
          if (user) {
            user.walletBalance += Number.parseInt(purchase.amount) * 0.9
            await user.save()
          }
        }

        try {
          await sendTicketEmail(
            purchase.buyerEmail,
            purchase.buyerName,
            purchase.ticketName,
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/qrcode?uid=${purchase.ticketUID}`,
            `${process.env.NEXT_PUBLIC_BASE_URL}/ticket/success/${purchase.ticketUID}`,
          )

          await sendTicketWhatsApp(purchase.buyerWhatsapp, purchase.buyerName, purchase.ticketName, purchase.ticketUID)
        } catch (error) {
          console.error("Error sending notifications:", error)
        }

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/ticket/success/${purchase.ticketUID}`)
      }
    }

    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
  } catch (error) {
    console.error("Webhook GET error:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}
