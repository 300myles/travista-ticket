"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface Ticket {
  _id: string
  name: string
  slug: string
  price: number
  totalSold: number
  totalRevenue: number
  eventDate: string
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch("/api/tickets/list")
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
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block w-8 h-8 border-4 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Tickets</h1>
          <p className="text-muted-foreground">Manage all your events and tickets</p>
        </div>

        {tickets.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">You haven't created any tickets yet</p>
            <Link href="/dashboard">
              <Button>Create Your First Ticket</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <Card key={ticket._id} className="p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-bold text-foreground mb-2">{ticket.name}</h3>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-semibold text-foreground">₦{ticket.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sold:</span>
                    <span className="font-semibold text-foreground">{ticket.totalSold}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Revenue:</span>
                    <span className="font-semibold text-foreground">
                      ₦{ticket.totalRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/dashboard/tickets/${ticket.slug}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      Details
                    </Button>
                  </Link>
                  <Link href={`/tickets/${ticket.slug}`} target="_blank" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Public Link
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
