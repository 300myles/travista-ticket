"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TicketTypeStats {
  id: string
  name: string
  price: number
  description?: string
  quantity: number
  sold: number
  available: number
  revenue: number
  conversionRate: string
}

interface EventStats {
  totalRevenue: number
  totalSold: number
  totalQuantity: number
  averagePrice: string
  overallConversion: string
}

interface AnalyticsData {
  event: {
    name: string
    slug: string
    eventDate: string
    flyerUrl: string
  }
  stats: EventStats
  ticketTypes: TicketTypeStats[]
}

interface DashboardTicketAnalyticsProps {
  slug: string
}

export default function DashboardTicketAnalytics({ slug }: DashboardTicketAnalyticsProps) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`/api/tickets/${slug}/analytics`)
        const analyticsData = await res.json()

        if (!res.ok) {
          setError(analyticsData.error || "Failed to fetch analytics")
          return
        }

        setData(analyticsData)
      } catch (err) {
        setError("Failed to load analytics")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [slug])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <Card className="p-6 text-center">
        <p className="text-red-600">{error || "Analytics not available"}</p>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Event Header */}
      <div className="flex items-start gap-6">
        <img
          src={data.event.flyerUrl || "/placeholder.svg"}
          alt={data.event.name}
          className="w-24 h-24 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-foreground mb-2">{data.event.name}</h2>
          <p className="text-muted-foreground">
            {new Date(data.event.eventDate).toLocaleDateString("en-NG", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Revenue</p>
          <p className="text-2xl font-bold text-foreground">₦{data.stats.totalRevenue.toLocaleString()}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Tickets Sold</p>
          <p className="text-2xl font-bold text-foreground">{data.stats.totalSold}</p>
          <p className="text-xs text-muted-foreground mt-1">of {data.stats.totalQuantity} available</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Average Price</p>
          <p className="text-2xl font-bold text-foreground">₦{data.stats.averagePrice}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Conversion Rate</p>
          <p className="text-2xl font-bold text-foreground">{data.stats.overallConversion}%</p>
        </Card>
      </div>

      {/* Ticket Types Breakdown */}
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-4">Ticket Types</h3>
        <div className="grid grid-cols-1 gap-4">
          {data.ticketTypes.map((type) => (
            <Card key={type.id} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
                {/* Ticket Info */}
                <div className="md:col-span-2">
                  <div className="flex items-start gap-3 mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-foreground">{type.name}</h4>
                      {type.description && <p className="text-sm text-muted-foreground">{type.description}</p>}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{type.price === 0 ? "FREE" : `₦${type.price.toLocaleString()}`}</Badge>
                    <Badge variant={type.available > 0 ? "default" : "secondary"}>
                      {type.available > 0 ? `${type.available} left` : "Sold Out"}
                    </Badge>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="md:col-span-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {/* Sold Count */}
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Sold</p>
                      <p className="text-xl font-bold text-foreground">
                        {type.sold}/{type.quantity}
                      </p>
                    </div>

                    {/* Revenue */}
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                      <p className="text-lg font-bold text-foreground">₦{type.revenue.toLocaleString()}</p>
                    </div>

                    {/* Conversion Rate */}
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Conversion</p>
                      <p className="text-xl font-bold text-foreground">{type.conversionRate}%</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="md:col-span-4">
                      <p className="text-xs text-muted-foreground mb-2">Availability</p>
                      <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent transition-all"
                          style={{
                            width: `${(type.sold / type.quantity) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}