import type React from "react"
import { getAuthToken, verifyToken } from "@/lib/auth"
import { redirect } from 'next/navigation'
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = await getAuthToken()
  const userId = token ? verifyToken(token) : null

  if (!userId) {
    redirect("/auth/login")
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto h-dvh">{children}</main>
    </div>
  )
}
