import mongoose, { Schema, type Document } from "mongoose"

export interface ITicket extends Document {
  organizerId: mongoose.Types.ObjectId
  name: string
  description?: string
  price: number
  flyerUrl: string
  eventDate: Date
  eventLocation?: string
  slug: string
  totalSold: number
  totalRevenue: number
  quantity?: number
  status: "active" | "sold_out" | "cancelled"
  createdAt: Date
}

const ticketSchema = new Schema<ITicket>(
  {
    organizerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    flyerUrl: { type: String, required: true },
    eventDate: { type: Date, required: true },
    eventLocation: { type: String },
    slug: { type: String, required: true, unique: true },
    totalSold: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    quantity: { type: Number },
    status: { type: String, enum: ["active", "sold_out", "cancelled"], default: "active" },
  },
  { timestamps: true },
)

export const Ticket = mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", ticketSchema)
