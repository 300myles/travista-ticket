import { connectDB } from "@/lib/db"
import { Purchase } from "@/lib/models/purchase";
import { Ticket } from "@/lib/models/ticket"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(_request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await connectDB()
    const {slug} = await params;
    const ticket = await Ticket.findOne({ slug });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    const purchases = await Purchase.find({
      ticketId: ticket._id,
      paymentStatus: "completed",
    }).sort({ createdAt: -1 });

    // Convert to plain object BEFORE adding fields
    const ticketObj = ticket.toObject();
    ticketObj.purchases = purchases;

    return NextResponse.json({ ticket: ticketObj })
  } catch (error) {
    console.error("Get ticket error:", error)
    return NextResponse.json({ error: "Failed to get ticket" }, { status: 500 })
  }
}
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB()
    const ticket = await Ticket.findOneAndDelete({ slug: params.slug })

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete ticket error:", error)
    return NextResponse.json({ error: "Failed to delete ticket" }, { status: 500 })
  }
}