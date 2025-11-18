# Travista - Event Ticketing Platform

A full-stack Next.js application for selling and managing event tickets with QR code validation, email/WhatsApp notifications, and Squad payment integration.

## Features

- **User Authentication**: Email verification, JWT-based sessions with HTTP-only cookies
- **Ticket Management**: Create, edit, and delete event tickets
- **Public Ticket Sales**: No login required for ticket purchases
- **Payment Processing**: Squad payment gateway integration (Nigeria)
- **QR Code Generation & Scanning**: Validate tickets with QR code scanning
- **Email Notifications**: Automated ticket delivery via email with QR code
- **WhatsApp Integration**: Send tickets and updates via WhatsApp
- **Dashboard Analytics**: View ticket sales, revenue, and performance metrics
- **Minimal Design**: Glassmorphism UI with black/white theme inspired by Vercel and SpaceX

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with HTTP-only cookies
- **Email**: Nodemailer
- **Payment**: Squad Payment Gateway (Nigeria)
- **QR Code**: qrcode library
- **QR Scanning**: html5-qrcode

## Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB instance (local or cloud)
- SMTP credentials (Gmail, Mailgun, etc.)
- Squad account for payment processing
- (Optional) WhatsApp Business Account for WhatsApp API

## Installation

### 1. Clone the repository

\`\`\`bash
git clone <repository-url>
cd travista
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Set up environment variables

Create a `.env.local` file in the root directory and add all required variables (see [Environment Variables](#environment-variables) section).

### 4. Set up MongoDB

Ensure your MongoDB instance is running and update `MONGODB_URI` in `.env.local`.

### 5. Run the development server

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the app.

## Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`env
# Database
MONGODB_URI=mongodb://localhost:27017/travista

# JWT & Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@travista.com

# Payment (Squad)
SQUAD_PUBLIC_KEY=your_squad_public_key
SQUAD_SECRET_KEY=your_squad_secret_key

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# WhatsApp (Optional)
WHATSAPP_API_TOKEN=your_whatsapp_api_token
\`\`\`

### Detailed Setup Instructions

#### MongoDB Setup

**Local Development:**
\`\`\`bash
# Install MongoDB Community Edition
# macOS with Homebrew:
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB:
brew services start mongodb-community

# Connection string:
MONGODB_URI=mongodb://localhost:27017/travista
\`\`\`

**Cloud (MongoDB Atlas):**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/travista?retryWrites=true&w=majority`

#### SMTP Setup (Gmail Example)

1. Go to https://myaccount.google.com/apppasswords
2. Select Mail and Windows Device
3. Copy the generated 16-character password
4. Add to `.env.local`:
\`\`\`env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
\`\`\`

#### Squad Payment Setup

1. Create account at https://squademerchant.com
2. Verify your business account
3. Go to Settings → API Keys
4. Copy Public and Secret keys
5. Add to `.env.local`:
\`\`\`env
SQUAD_PUBLIC_KEY=pk_live_xxxxx
SQUAD_SECRET_KEY=sk_live_xxxxx
\`\`\`

**Setting up Webhook:**
- In Squad dashboard: Settings → Webhooks
- Webhook URL: `https://your-domain.com/api/webhook/payment`
- Subscribe to: `charge.completed`

For local testing with ngrok:
\`\`\`bash
# Install ngrok: https://ngrok.com/download
ngrok http 3000

# Use the generated URL in Squad webhook settings:
# https://xxxxx.ngrok.io/api/webhook/payment
\`\`\`

#### WhatsApp Setup (Optional)

1. Get Business Account at https://www.whatsapp.com/business
2. Create app at https://developers.facebook.com
3. Get Phone Number ID and access token
4. In `lib/whatsapp.ts`, update the phone number ID
5. Add to `.env.local`:
\`\`\`env
WHATSAPP_API_TOKEN=your_whatsapp_access_token
\`\`\`

If not configured, the app will fall back to `wa.me` share links.

## Project Structure

\`\`\`
travista/
├── app/
│   ├── api/
│   │   ├── auth/              # Authentication endpoints
│   │   ├── tickets/           # Ticket management
│   │   ├── purchase/          # Purchase endpoints
│   │   └── webhook/           # Payment webhooks
│   ├── auth/                  # Auth pages (login, signup, verify)
│   ├── dashboard/             # User dashboard
│   ├── tickets/               # Public ticket page
│   ├── validate/              # QR validation page
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── dashboard-nav.tsx
│   ├── create-ticket-modal.tsx
│   ├── tickets-list.tsx
│   ├── purchase-form.tsx
│   ├── ticket-display.tsx
│   ├── qr-scanner.tsx
│   └── validator-nav.tsx
├── lib/
│   ├── db.ts                  # MongoDB connection
│   ├── auth.ts                # JWT & cookie management
│   ├── mailer.ts              # Email service
│   ├── whatsapp.ts            # WhatsApp service
│   ├── squad.ts               # Squad payment integration
│   ├── utils.ts               # Utility functions
│   └── models/
│       ├── user.ts
│       ├── ticket.ts
│       └── purchase.ts
├── .env.local                 # Environment variables
└── package.json
\`\`\`

## Database Schemas

### User Schema
\`\`\`typescript
{
  email: string (unique, lowercase)
  passwordHash: string
  fullName: string
  isVerified: boolean
  verifyToken: string (temporary)
  createdAt: Date
  updatedAt: Date
}
\`\`\`

### Ticket Schema
\`\`\`typescript
{
  organizerId: ObjectId (references User)
  name: string
  price: number
  flyerUrl: string
  eventDate: Date
  slug: string (unique)
  totalSold: number
  totalRevenue: number
  createdAt: Date
  updatedAt: Date
}
\`\`\`

### Purchase Schema
\`\`\`typescript
{
  ticketId: ObjectId (references Ticket)
  buyerName: string
  buyerEmail: string
  buyerPhone: string
  buyerWhatsapp: string
  buyerImageUrl: string (optional)
  ticketUID: string (unique, e.g., TRV-20251113-ABC12)
  qrPayload: string (JSON stringified)
  amount: number
  paymentStatus: 'pending' | 'completed' | 'failed'
  paymentReference: string
  used: boolean
  usedAt: Date (optional)
  createdAt: Date
  updatedAt: Date
}
\`\`\`

## API Endpoints

### Authentication

\`\`\`
POST /api/auth/signup
- Body: { email: string }
- Response: { success: true, userId: string }

POST /api/auth/verify
- Body: { token: string, password: string, fullName: string }
- Response: { success: true, userId: string }

POST /api/auth/login
- Body: { email: string, password: string }
- Response: { success: true, userId: string, fullName: string }

POST /api/auth/logout
- Response: { success: true }

GET /api/me
- Response: { user: { id, email, fullName, isVerified } | null }
\`\`\`

### Tickets

\`\`\`
POST /api/tickets/create (Protected)
- Body: FormData { name, price, eventDate, flyerUrl }
- Response: { success: true, ticket: Ticket }

GET /api/tickets/list (Protected)
- Response: { tickets: Ticket[] }

GET /api/tickets/[slug]
- Response: { ticket: Ticket }
\`\`\`

### Purchase & Payment

\`\`\`
POST /api/purchase
- Body: FormData { ticketId, buyerName, buyerEmail, buyerPhone, buyerWhatsapp }
- Response: { success: true, paymentUrl: string, purchaseId: string }

GET /api/purchase/[ticketUID]
- Response: { purchase: Purchase }

PATCH /api/purchase/[ticketUID]
- Body: { used: boolean }
- Response: { success: true, purchase: Purchase }

POST /api/webhook/payment
- Webhook from Squad on payment completion
- Response: { success: true }
\`\`\`

## Usage Workflow

### For Event Organizers

1. **Sign Up**: Go to `/auth/signup` → Enter email → Verify via email link
2. **Complete Profile**: Set password and full name on verification page
3. **Create Tickets**: Dashboard → Create Ticket → Fill details and flyer image
4. **Share**: Copy public ticket URL and share with attendees
5. **Validate**: Go to `/validate` to scan QR codes at the event

### For Ticket Buyers

1. **Visit Ticket Page**: Open public ticket link (e.g., `/tickets/my-event-slug`)
2. **Fill Details**: Enter name, email, phone, WhatsApp number
3. **Pay**: Click "Buy Ticket" → Complete Squad payment
4. **Receive**: Ticket with QR code sent via email and WhatsApp
5. **Download**: Download ticket as image from email

## Testing

### Test Workflow

1. **Local Development**:
   \`\`\`bash
   npm run dev
   # Visit http://localhost:3000
   \`\`\`

2. **Create Organizer Account**:
   - Go to `/auth/signup`
   - Verify via email (check console in dev mode)
   - Create your profile
   - Create a test ticket

3. **Purchase Ticket** (Public):
   - Copy public ticket URL from dashboard
   - In incognito window, visit the ticket page
   - Fill purchaser details
   - Use Squad test cards (available in Squad docs)

4. **Simulate Payment Webhook**:
   \`\`\`bash
   curl -X POST http://localhost:3000/api/webhook/payment \
     -H "Content-Type: application/json" \
     -H "x-squad-signature: <test-signature>" \
     -d '{"Event": "charge.completed", "Data": {"transaction_ref": "TRV-xxx"}}'
   \`\`\`

5. **Validate Ticket**:
   - Go to `/validate`
   - Open developer tools → Elements
   - Find the generated QR code image
   - Scan with phone camera or QR scanner app
   - Mark as used

### Test Credentials

**Test Card (Squad)**:
- Card Number: 4242 4242 4242 4242
- Expiry: Any future date
- CVV: Any 3 digits

## Deployment

### Deploy to Vercel

1. **Push to GitHub**:
   \`\`\`bash
   git remote add origin <your-github-repo>
   git push -u origin main
   \`\`\`

2. **Connect to Vercel**:
   - Go to https://vercel.com
   - Import project from GitHub
   - Configure environment variables

3. **Set Environment Variables in Vercel**:
   - Project Settings → Environment Variables
   - Add all `.env.local` variables

4. **Deploy**:
   \`\`\`bash
   git push
   # Automatic deployment triggered
   \`\`\`

5. **Update Squad Webhook**:
   - Squad Dashboard → Webhooks
   - Change webhook URL to: `https://your-vercel-domain.vercel.app/api/webhook/payment`

### Production Checklist

- [ ] Change `JWT_SECRET` to a strong random key
- [ ] Update `NEXT_PUBLIC_BASE_URL` to production domain
- [ ] Configure production email (not Gmail app password)
- [ ] Use Squad live keys (not sandbox)
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set up database backups
- [ ] Monitor payment webhooks
- [ ] Configure email rate limiting

## Security Considerations

1. **HTTP-Only Cookies**: Auth tokens stored securely, not accessible via JavaScript
2. **JWT Verification**: All protected endpoints verify JWT before processing
3. **Webhook Signature**: Squad webhooks verified with HMAC-SHA256
4. **Rate Limiting**: Implement rate limiting on payment endpoints (recommended)
5. **HTTPS Only**: Use HTTPS in production
6. **Environment Variables**: Never commit `.env.local`
7. **CORS**: Configure CORS for webhook endpoints if needed

## Troubleshooting

### "Invalid signature" on webhook
- Ensure `SQUAD_SECRET_KEY` is correct
- Test signature verification with Squad test payload
- Check webhook logs in Squad dashboard

### Email not sending
- Verify SMTP credentials
- Check Gmail: enable "Less secure app access" or use App Password
- Verify `FROM_EMAIL` is correct format
- Check spam folder

### QR scanner not working on mobile
- Ensure site is HTTPS (required for camera access)
- Grant camera permissions when prompted
- Use modern browser (Chrome, Firefox, Safari)
- Try zooming in on QR code

### MongoDB connection timeout
- Verify `MONGODB_URI` is correct
- Check MongoDB service is running (local)
- For MongoDB Atlas, add IP to whitelist: Settings → Network Access

### Payment not processing
- Verify Squad keys are correct
- Check test vs live mode
- Ensure webhook URL is correct
- Monitor Squad dashboard for errors

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or feature requests:
- Check existing GitHub issues
- Create a new issue with detailed description
- Contact: support@travista.com

## Changelog

### v1.0.0 (Initial Release)
- Complete ticketing platform
- Auth system with email verification
- Ticket creation and management
- Squad payment integration
- QR code generation and validation
- Email and WhatsApp notifications
- Dashboard analytics
- Production-ready deployment

---

Built with ❤️ by the Travista team
