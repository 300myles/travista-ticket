import mongoose, { Schema, type Document } from "mongoose"

export interface ITicketType {
  _id?: mongoose.Types.ObjectId
  id: string // UUID
  name: string
  description?: string
  price: number
  quantity: number
  sold: number
}

export interface ITicket extends Document {
  organizerId: mongoose.Types.ObjectId
  name: string
  description?: string
  flyerUrl: string
  eventDate: Date
  eventLocation?: string
  slug: string
  ticketTypes: ITicketType[] // added support for multiple ticket types
  totalSold: number
  totalRevenue: number
  status: "active" | "sold_out" | "cancelled"
  createdAt: Date
}

const ticketTypeSchema = new Schema<ITicketType>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true, default: 0 },
    quantity: { type: Number, required: true },
    sold: { type: Number, default: 0 },
  },
  { _id: true },
)

const ticketSchema = new Schema<ITicket>(
  {
    organizerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String },
    flyerUrl: { type: String, required: true },
    eventDate: { type: Date, required: true },
    eventLocation: { type: String },
    slug: { type: String, required: true, unique: true },
    ticketTypes: [ticketTypeSchema], // replaced single price/quantity with ticketTypes array
    totalSold: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "sold_out", "cancelled"], default: "active" },
  },
  { timestamps: true },
)

export const Ticket = mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", ticketSchema)
