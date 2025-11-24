import mongoose, { Schema, type Document } from "mongoose"

export interface IUser extends Document {
  email: string
  passwordHash: string
  fullName: string
  isVerified: boolean
  verifyToken?: string
  walletBalance: number
  availableBalance: number
  bankAccount?: {
    accountName: string
    accountNumber: string
    bankName: string
    bankCode: string
    verified: boolean
  }
  transactions: Array<{
    type: "funding" | "withdrawal" | "ticketPurchase"
    amount: number
    status: "pending" | "successful" | "failed"
    reference: string
    date: Date
  }>
  profileImageUrl?: string
  createdAt: Date
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String },
    fullName: { type: String },
    isVerified: { type: Boolean, default: false },
    verifyToken: { type: String },
    walletBalance: { type: Number, default: 0 },
    availableBalance: { type: Number, default: 0 },
    bankAccount: {
      accountName: { type: String },
      accountNumber: { type: String },
      bankName: { type: String },
      bankCode: { type: String },
      verified: { type: Boolean, default: false },
    },
    transactions: [
      {
        type: { type: String, enum: ["funding", "withdrawal", "ticketPurchase"] },
        amount: { type: Number },
        status: { type: String, enum: ["pending", "successful", "failed"], default: "pending" },
        reference: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],
    profileImageUrl: { type: String },
  },
  { timestamps: true },
)

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema)
