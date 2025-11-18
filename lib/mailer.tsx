import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendVerificationEmail(email: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const verifyUrl = `${baseUrl}/auth/verify?token=${token}`

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || "noreply@travista.com",
    to: email,
    subject: "Verify your Travista account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Travista</h2>
        <p>Click the link below to verify your email address:</p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: white; text-decoration: none; border-radius: 6px;">
          Verify Email
        </a>
        <p style="color: #666; margin-top: 20px; font-size: 12px;">
          Or copy this link: ${verifyUrl}
        </p>
      </div>
    `,
  })
}

export async function sendTicketEmail(
  email: string,
  buyerName: string,
  ticketName: string,
  qrCodeDataUrl: string,
  downloadUrl: string,
) {
  await transporter.sendMail({
    from: process.env.FROM_EMAIL || "noreply@travista.com",
    to: email,
    subject: `Your ticket for ${ticketName} - ${buyerName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Your Ticket is Ready</h2>
        <p>Hi ${buyerName},</p>
        <p>Thank you for your purchase. Your ticket for <strong>${ticketName}</strong> is ready.</p>
        <div style="text-align: center; margin: 30px 0;">
          <img src="${qrCodeDataUrl}" alt="QR Code" style="width: 200px; height: 200px; border: 2px solid #000;">
        </div>
        <p style="text-align: center; margin-bottom: 20px;">
          <a href="${downloadUrl}" style="display: inline-block; padding: 12px 24px; background-color: #000; color: white; text-decoration: none; border-radius: 6px;">
            View Ticket
          </a>
        </p>
        <p style="color: #666; margin-top: 20px; font-size: 12px;">
          Keep this email safe as it contains your ticket information.
        </p>
      </div>
    `,
  })
}

export async function sendWithdrawalInitiatedEmail(
  email: string,
  amount: number,
  reference: string,
  accountNumber: string,
) {
  await transporter.sendMail({
    from: process.env.FROM_EMAIL || "noreply@travista.com",
    to: email,
    subject: "Withdrawal Request Initiated",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Withdrawal Request Initiated</h2>
        <p>Your withdrawal request has been submitted successfully.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <p><strong>Amount:</strong> ₦${amount.toLocaleString()}</p>
          <p><strong>Reference:</strong> ${reference}</p>
          <p><strong>Account:</strong> ****${accountNumber.slice(-4)}</p>
        </div>
        
        <p>Your funds will be transferred within 24-48 hours. You will receive a confirmation email once the transfer is complete.</p>
        
        <p style="color: #666; margin-top: 20px; font-size: 12px;">
          If you did not request this withdrawal, please contact support immediately.
        </p>
      </div>
    `,
  })
}

export async function sendWithdrawalCompletedEmail(email: string, amount: number, reference: string) {
  await transporter.sendMail({
    from: process.env.FROM_EMAIL || "noreply@travista.com",
    to: email,
    subject: "Withdrawal Completed",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #00aa00;">Withdrawal Completed</h2>
        <p>Your withdrawal has been successfully processed.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <p><strong>Amount:</strong> ₦${amount.toLocaleString()}</p>
          <p><strong>Reference:</strong> ${reference}</p>
          <p><strong>Status:</strong> Completed</p>
        </div>
        
        <p>Check your bank account for the transfer.</p>
      </div>
    `,
  })
}
