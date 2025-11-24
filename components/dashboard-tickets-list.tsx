"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface TicketType {
  id: string
  name: string
  price: number
  quantity: number
  sold: number
}

interface Ticket {
  _id: string
  name: string
  slug: string
  ticketTypes: TicketType[]
  totalSold: number
  totalRevenue: number
  eventDate: string
}

interface DashboardTicketsListProps {
  organizerId?: string
}

export default function DashboardTicketsList({ organizerId = "" }: DashboardTicketsListProps) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const url = organizerId ? `/api/tickets/list?organizerId=${organizerId}` : "/api/tickets/list"

        const res = await fetch(url)
        const data = await res.json()

        if (data.tickets) {
          setTickets(data.tickets)
        }
      } catch (error) {
        console.error("Error fetching tickets:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [organizerId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground mb-4">You haven't created any events yet</p>
        <Link href="/dashboard/create">
          <Button>Create Your First Event</Button>
        </Link>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {tickets.map((ticket) => (
        <Card key={ticket._id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            {/* Event Info */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">{ticket.name}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(ticket.eventDate).toLocaleDateString("en-NG", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Sold</p>
                <p className="text-xl font-bold text-foreground">{ticket.totalSold}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                <p className="text-lg font-bold text-foreground">₦{ticket.totalRevenue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Types</p>
                <p className="text-xl font-bold text-foreground">{ticket.ticketTypes.length}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Link href={`/dashboard/tickets/${ticket.slug}`} className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  View Details
                </Button>
              </Link>
              <Link href={`/tickets/${ticket.slug}`} target="_blank" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Public Link
                </Button>
              </Link>
            </div>
          </div>

          {/* Ticket Types Summary */}
          <div className="border-t border-border pt-4">
            <p className="text-sm font-semibold text-foreground mb-3">Ticket Types</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {ticket.ticketTypes.map((type) => (
                <div key={type.id} className="bg-muted p-3 rounded-lg">
                  <p className="text-sm font-medium text-foreground truncate">{type.name}</p>
                  <p className="text-xs text-muted-foreground mb-1">
                    {type.price === 0 ? "FREE" : `₦${type.price.toLocaleString()}`}
                  </p>
                  <p className="text-xs font-semibold text-foreground">
                    {type.sold}/{type.quantity} sold
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
