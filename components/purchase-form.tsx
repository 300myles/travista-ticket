"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Ticket {
  _id: string
  name: string
  price: number
}

interface PurchaseFormProps {
  ticket: Ticket
}

export default function PurchaseForm({ ticket }: PurchaseFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
    buyerWhatsapp: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const form = new FormData()
      form.append("ticketId", ticket._id)
      form.append("buyerName", formData.buyerName)
      form.append("buyerEmail", formData.buyerEmail)
      form.append("buyerPhone", formData.buyerPhone)
      form.append("buyerWhatsapp", formData.buyerWhatsapp)

      const res = await fetch("/api/purchase", {
        method: "POST",
        body: form,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to create purchase")
        return
      }

      // Redirect to payment or success page
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl
      } else {
        router.push(`/success?purchaseId=${data.purchaseId}`)
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Get Your Ticket</h2>

      <form onSubmit={handlePurchase} className="space-y-4">
        {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
          <input
            type="text"
            name="buyerName"
            value={formData.buyerName}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
          <input
            type="email"
            name="buyerEmail"
            value={formData.buyerEmail}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
          <input
            type="tel"
            name="buyerPhone"
            value={formData.buyerPhone}
            onChange={handleChange}
            placeholder="+234..."
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">WhatsApp Number</label>
          <input
            type="tel"
            name="buyerWhatsapp"
            value={formData.buyerWhatsapp}
            onChange={handleChange}
            placeholder="+234..."
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-foreground text-background font-medium rounded-lg hover:opacity-90 transition-smooth disabled:opacity-50"
        >
          {loading ? "Processing..." : `Buy Ticket - ₦${ticket.price.toLocaleString()}`}
        </button>
      </form>

      <p className="text-xs text-muted-foreground text-center">
        Your ticket will be sent to your email and WhatsApp after payment confirmation.
      </p>
    </div>
  )
}
