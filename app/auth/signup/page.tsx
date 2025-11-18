"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Signup failed")
        return
      }

      setSubmitted(true)
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Check your email</h2>
          <p className="text-muted-foreground mt-2">
            We've sent a verification link to <strong>{email}</strong>
          </p>
        </div>

        <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
          Click the link in the email to verify your account and set up your password.
        </div>

        <button
          onClick={() => setSubmitted(false)}
          className="w-full py-3 border border-border text-foreground font-medium rounded-lg hover:bg-muted transition-smooth"
        >
          Back to signup
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">Travista</h1>
        <p className="text-muted-foreground mt-2">Create Your Account</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-smooth"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-foreground text-background font-medium rounded-lg hover:opacity-90 transition-smooth disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Continue with Email"}
        </button>
      </form>

      <p className="text-center text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-foreground font-medium hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}
