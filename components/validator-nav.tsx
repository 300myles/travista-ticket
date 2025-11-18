"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ValidatorNav({ user }: { user: any }) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/auth/login")
  }

  return (
    <nav className="glass sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-2xl font-bold text-foreground">
          Travista
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
            Dashboard
          </Link>
          <span className="text-sm text-muted-foreground">|</span>
          <span className="text-sm text-muted-foreground">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-smooth"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
