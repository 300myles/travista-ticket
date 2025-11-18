import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function generateUniqueTicketUID() {
  const date = new Date()
  const dateStr = date.toISOString().split("T")[0].replace(/-/g, "")
  const random = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `TRV-${dateStr}-${random}`
}

export function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount)
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
