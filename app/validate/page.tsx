"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import QRScanner from "@/components/qr-scanner"
import ValidatorNav from "@/components/validator-nav"

interface Purchase {
  _id: string
  ticketUID: string
  buyerName: string
  buyerEmail: string
  buyerPhone: string
  used: boolean
  usedAt?: string
  createdAt: string
}

export default function ValidatePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [scanResult, setScanResult] = useState<Purchase | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/me")
        const data = await res.json()

        if (!data.user) {
          router.push("/auth/login")
          return
        }

        setUser(data.user)
      } catch (err) {
        router.push("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleScan = async (ticketUID: string) => {
    setError("")
    setScanResult(null)

    try {
      const res = await fetch(`/api/purchase/${ticketUID}`)
      const data = await res.json()

      if (!res.ok) {
        setError("Invalid ticket. Ticket not found.")
        return
      }

      setScanResult(data.purchase)
    } catch (err) {
      setError("Failed to scan ticket. Please try again.")
    }
  }

  const handleMarkUsed = async () => {
    if (!scanResult) return

    try {
      const res = await fetch(`/api/purchase/${scanResult.ticketUID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ used: true }),
      })

      const data = await res.json()

      if (res.ok) {
        setScanResult(data.purchase)
      } else {
        setError("Failed to mark ticket as used")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block w-8 h-8 border-4 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <ValidatorNav user={user} />

      <main className="max-w-2xl mx-auto px-4 py-12 md:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Validate Tickets</h1>
        <p className="text-muted-foreground mb-8">Scan QR codes to validate tickets at your event</p>

        <div className="border border-border rounded-lg p-8 bg-muted mb-8">
          <QRScanner onScan={handleScan} />
        </div>

        {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 mb-8">{error}</div>}

        {scanResult && (
          <div className="border border-border rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="text-lg font-bold text-foreground">{scanResult.buyerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-sm text-foreground">{scanResult.buyerEmail}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="text-sm text-foreground">{scanResult.buyerPhone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className={`text-sm font-bold ${scanResult.used ? "text-red-600" : "text-green-600"}`}>
                  {scanResult.used ? "Used" : "Valid"}
                </p>
              </div>
            </div>

            {scanResult.used && scanResult.usedAt && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">Used on: {new Date(scanResult.usedAt).toLocaleString()}</p>
              </div>
            )}

            {!scanResult.used && (
              <button
                onClick={handleMarkUsed}
                className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-smooth"
              >
                Mark as Used
              </button>
            )}

            <button
              onClick={() => setScanResult(null)}
              className="w-full py-3 border border-border text-foreground font-medium rounded-lg hover:bg-muted transition-smooth"
            >
              Scan Another Ticket
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
