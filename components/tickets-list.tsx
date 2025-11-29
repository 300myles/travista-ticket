"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"

interface Ticket {
  _id: string
  slug: string
  name: string
  price: number
  eventDate: string
  totalSold: number
  totalRevenue: number
  flyerUrl: string
}

export function TicketsList() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("/api/tickets/list")
        const data = await res.json()
        setTickets(data.tickets || [])
      } catch (error) {
        console.error("Failed to fetch tickets:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Loading tickets...</div>
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No tickets created yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <div key={ticket._id} className="border border-border rounded-lg p-6 hover:bg-muted transition-smooth">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">{ticket?.name}</h3>
              <p className="text-sm text-muted-foreground">₦{ticket?.price?.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">{ticket?.totalSold}</div>
              <p className="text-xs text-muted-foreground">Sold</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4">Event: {new Date(ticket?.eventDate).toLocaleDateString()}</p>

          <div className="flex gap-2">
            <Link
              href={`/tickets/${ticket?.slug}`}
              className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-smooth"
            >
              View Public Page
            </Link>
            <Link
              href={`/dashboard/events/${ticket?.slug}`}  className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-smooth">
              View Sales
            </Link>
            <button onClick={() => {
              toast.info("Edit ticket feature coming soon!")
            }} className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-smooth">
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TicketsList
