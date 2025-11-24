import { getAuthToken, verifyToken } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { Ticket } from "@/lib/models/ticket"
import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthToken()
        const userId = token ? verifyToken(token) : null
    
        if (!userId) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
    await connectDB()
    const formData = await request.formData()

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const eventDate = formData.get("eventDate") as string
    const flyerUrl = formData.get("flyerUrl") as string
    const ticketTypesJson = formData.get("ticketTypes") as string

    if (!name || !eventDate || !flyerUrl || !ticketTypesJson) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const ticketTypes = JSON.parse(ticketTypesJson)
    const slug = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now()

    const ticket = await Ticket.create({
      name,
      description,
      eventDate: new Date(eventDate),
      flyerUrl,
      organizerId: userId,
      slug,
      ticketTypes: ticketTypes.map((type: any) => ({
        id: uuidv4(),
        ...type,
      })),
    })

    return NextResponse.json({
      success: true,
      ticket: ticket.toObject(),
    })
  } catch (error) {
    console.error("Create ticket error:", error)
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
  }
}
