"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRef } from "react"
import * as htmlToImage from "html-to-image"
import jsPDF from "jspdf"
import QRCode from "qrcode"

interface TicketData {
  _id: string
  ticketUID: string
  ticketName: string
  eventName: string
  buyerName: string
  buyerEmail: string
  slug: string
  amount: number
  flyerUrl: string
}

export default function TicketSuccessPage() {
  const params = useParams()
  const router = useRouter()
  const [ticket, setTicket] = useState<TicketData | null>(null)
  const [qrCode, setQrCode] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const ticketRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(`/api/purchase/${params.uid}`)
        const data = await res.json()

        if (data.purchase) {
          setTicket({
            _id: data?.purchase._id,
            ticketUID: data?.purchase.ticketUID,
            ticketName: data?.purchase.ticketName || "Your Ticket",
            eventName: data?.purchase.eventName || "Event",
            buyerName: data?.purchase.buyerName,
            buyerEmail: data?.purchase.buyerEmail,
            amount: data?.purchase.amount,
            slug: data?.purchase.slug,
            flyerUrl: data?.purchase.flyerUrl
          })

          // Generate QR code
          const qrDataUrl = await QRCode.toDataURL(data.purchase.ticketUID)
          setQrCode(qrDataUrl)
        }
      } catch (error) {
        console.error("Error fetching ticket:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTicket()
  }, [params.uid])

  const downloadTicket = async () => {
    if (!ticketRef.current) return
  
    try {
      // Convert component to PNG
      const dataUrl = await htmlToImage.toPng(ticketRef.current, { quality: 1 })
  
      // Download PNG
      const link = document.createElement("a")
      link.download = `${ticket?.slug + "-" + ticket?.buyerEmail}.png`
      link.href = dataUrl
      link.click()
  
      // OPTIONAL: Create PDF version too
      const pdf = new jsPDF("p", "mm", "a4")
      const imgProps = pdf.getImageProperties(dataUrl)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
  
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight)
      pdf.save(`${ticket?.slug + "-" + ticket?.buyerEmail}.pdf`)
    } catch (error) {
      console.error("Failed to generate ticket:", error)
    }
  }
  

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-foreground border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-foreground">Loading your ticket...</p>
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="p-6 text-center">
          <p className="text-foreground mb-4">Ticket not found</p>
          <Button onClick={() => router.push("/")} variant="default">
            Back to Home
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8" ref={ticketRef}>
          <div className="text-center">
            <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-lg mb-4">
              Payment Successful
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Ticket is Ready</h1>
            <p className="text-muted-foreground">Thank you for your purchase</p>
          </div>

          <div className="space-y-6 ">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground ">{ticket.ticketName}</h2>
            </div>
          </div>

          <div className="space-y-6">
            
            {qrCode && (
              <div className="flex justify-center">
                <img src={qrCode || "/placeholder.svg"} alt="Ticket QR Code" className="w-48 h-48 border-2 border-border rounded-lg" />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 bg-card p-4 rounded-lg">
              <div>
                <p className="text-muted-foreground text-sm">Ticket ID</p>
                <p className="text-foreground font-semibold">{ticket.ticketUID}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Amount</p>
                <p className="text-foreground font-semibold">₦{ticket.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Name</p>
                <p className="text-foreground font-semibold">{ticket.buyerName}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Email</p>
                <p className="text-foreground font-semibold text-sm">{ticket.buyerEmail}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={downloadTicket} className="flex-1" variant="default">
                Download Ticket
              </Button>
              <Button onClick={() => router.push(`/tickets/${ticket?.slug}`)} className="flex-1" variant="outline">
                View Event Page
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              A copy of your ticket has been sent to {ticket.buyerEmail}
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
