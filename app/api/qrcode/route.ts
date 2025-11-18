import QRCode from "qrcode"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const uid = request.nextUrl.searchParams.get("uid")

    if (!uid) {
      return NextResponse.json({ error: "UID required" }, { status: 400 })
    }

    const qrCodeDataUrl = await QRCode.toDataURL(uid)

    return new NextResponse(Buffer.from(qrCodeDataUrl.split(",")[1], "base64"), {
      headers: {
        "Content-Type": "image/png",
      },
    })
  } catch (error) {
    console.error("QR code generation error:", error)
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 })
  }
}
