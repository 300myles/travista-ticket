"use client"

import type React from "react"

import { useState } from "react"

interface CreateTicketModalProps {
  onClose?: () => void
  onSuccess?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CreateTicketModal({ 
  onClose, 
  onSuccess, 
  open = true,
  onOpenChange 
}: CreateTicketModalProps) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [flyerUrl, setFlyerUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleClose = () => {
    if (onOpenChange) onOpenChange(false)
    if (onClose) onClose()
  }

  const handleSuccess = () => {
    if (onSuccess) onSuccess()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price", price)
      formData.append("eventDate", eventDate)
      formData.append("flyerUrl", flyerUrl)

      const res = await fetch("/api/tickets/create", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to create ticket")
        return
      }

      handleSuccess()
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background border border-border rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">Create New Ticket</h2>

        {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Ticket Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., VIP Pass"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Ticket Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Special Access"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Price (NGN)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="5000"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Event Date & Time</label>
            <input
              type="datetime-local"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Flyer Image URL</label>
            <input
              type="url"
              value={flyerUrl}
              onChange={(e) => setFlyerUrl(e.target.value)}
              placeholder="https://example.com/flyer.jpg"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-smooth"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-smooth disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTicketModal
