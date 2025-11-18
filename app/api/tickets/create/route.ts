import { getAuthToken, verifyToken } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { Ticket } from "@/lib/models/ticket"
import { generateSlug } from "@/lib/utils"
import { type NextRequest, NextResponse } from "next/server"

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
    const price = Number.parseFloat(formData.get("price") as string)
    const eventDate = new Date(formData.get("eventDate") as string)
    const flyerUrl = formData.get("flyerUrl") as string

    if (!name || !description || !price || !eventDate || !flyerUrl) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const slug = generateSlug(name)
    const ticket = await Ticket.create({
      organizerId: userId,
      name,
      description,
      price,
      eventDate,
      slug,
      flyerUrl,
    })

    return NextResponse.json({ success: true, ticket })
  } catch (error) {
    console.error("Create ticket error:", error)
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
  }
}
