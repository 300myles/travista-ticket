"use client"

import { useParams } from "next/navigation"
import DashboardTicketAnalytics from "@/components/dashboard-ticket-analytics"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function EventDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/dashboard/events">
            <Button variant="outline">← Back to Events</Button>
          </Link>
          <Link href={`/tickets/${slug}`} target="_blank">
            <Button variant="outline">View Public Link</Button>
          </Link>
        </div>

        <DashboardTicketAnalytics slug={slug} />
      </div>
    </div>
  )
}
