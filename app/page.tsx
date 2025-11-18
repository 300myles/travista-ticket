"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/me")
        const data = await res.json()

        if (data.user) {
          router.push("/dashboard")
        } else {
          router.push("/auth/login")
        }
      } catch (error) {
        router.push("/auth/login")
      }
    }

    checkAuth()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="inline-block w-12 h-12 border-4 border-foreground border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-foreground">Loading...</p>
      </div>
    </div>
  )
}
