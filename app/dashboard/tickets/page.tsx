"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import DashboardTicketsList from "@/components/dashboard-tickets-list"
import { CreateTicketModal } from "@/components/create-ticket-modal"

export default function TicketsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleCreateSuccess = () => {
    setShowCreateModal(false)
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-foreground">My Events</h1>
            <Button onClick={() => setShowCreateModal(true)}>+ Create Event</Button>
          </div>
          <p className="text-muted-foreground">Manage all your events and view ticket sales analytics</p>
        </div>

        <DashboardTicketsList />

        <CreateTicketModal open={showCreateModal} onOpenChange={setShowCreateModal} onSuccess={handleCreateSuccess} />
      </div>
    </div>
  )
}
