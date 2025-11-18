import mongoose, { Schema, type Document } from "mongoose"

export interface IPurchase extends Document {
  ticketId: mongoose.Types.ObjectId
  buyerName: string
  buyerEmail: string
  buyerPhone: string
  buyerWhatsapp: string
  buyerImageUrl?: string
  ticketUID: string
  qrPayload: string
  amount: number
  paymentStatus: "pending" | "completed" | "failed"
  paymentReference: string
  used: boolean
  usedAt?: Date
  createdAt: Date
}

const purchaseSchema = new Schema<IPurchase>(
  {
    ticketId: { type: Schema.Types.ObjectId, ref: "Ticket", required: true },
    buyerName: { type: String, required: true },
    buyerEmail: { type: String, required: true },
    buyerPhone: { type: String, required: true },
    buyerWhatsapp: { type: String, required: true },
    buyerImageUrl: { type: String },
    ticketUID: { type: String, unique: true, sparse: true },
    qrPayload: { type: String },
    amount: { type: Number, required: true },
    paymentStatus: { type: String, default: "pending" },
    paymentReference: { type: String },
    used: { type: Boolean, default: false },
    usedAt: { type: Date },
  },
  { timestamps: true },
)

export const Purchase = mongoose.models.Purchase || mongoose.model<IPurchase>("Purchase", purchaseSchema)
