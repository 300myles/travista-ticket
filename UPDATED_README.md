# Travista - Event Ticketing Platform

Travista is a full-stack event ticketing platform with wallet management, withdrawal system, and comprehensive ticket validation. Built with Next.js, MongoDB, and Squad payment gateway.

## Features

### Core Ticketing
- Create and manage event tickets
- QR code generation and validation
- Ticket purchase with Squad payment integration
- Email and WhatsApp ticket delivery
- Ticket success page with download options

### Wallet & Withdrawals
- User wallet system
- Squad Payout API integration for withdrawals
- Bank account management and verification
- Withdrawal history and status tracking
- Transaction logging and analytics

### Dashboard
- Responsive sidebar navigation
- Real-time analytics (revenue, tickets sold, wallet balance)
- Ticket management interface
- Withdrawal management
- Settings and profile management

### Security
- JWT authentication with HTTP-only cookies
- Password hashing with bcrypt
- Email verification on signup
- Bank account verification
- Row-level security for sensitive operations

### Notifications
- Email verification emails
- Ticket delivery emails with QR codes
- WhatsApp ticket notifications
- Withdrawal confirmation emails

---

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account or local MongoDB
- Squad merchant account (test mode available)
- Email service (Gmail, SendGrid, or Mailgun)

### Installation

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd travista
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Create `.env.local` with required variables:
\`\`\`bash
cp .env.local.example .env.local
# Edit .env.local with your credentials
\`\`\`

See `ENV_SETUP_GUIDE.md` for detailed setup instructions.

4. Run development server
\`\`\`bash
npm run dev
\`\`\`

5. Open http://localhost:3000

---

## Environment Variables

### Required
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` - Email configuration
- `SQUAD_API_KEY`, `SQUAD_SECRET_KEY` - Squad payment API keys
- `NEXT_PUBLIC_BASE_URL` - Application base URL

### Optional
- `WHATSAPP_API_KEY` - WhatsApp Business API key
- `FROM_EMAIL` - Sender email address

---

## Project Structure

\`\`\`
app/
├── api/
│   ├── auth/              # Authentication endpoints
│   ├── user/              # User profile and settings
│   ├── account/           # Bank account management
│   ├── withdraw/          # Withdrawal endpoints
│   ├── tickets/           # Ticket management
│   ├── purchase/          # Purchase and checkout
│   ├── webhook/           # Squad payment webhook
│   └── qrcode/            # QR code generation
├── auth/                  # Authentication pages
├── dashboard/             # Dashboard and app pages
├── tickets/               # Public ticket pages
└── page.tsx               # Home/landing page

components/
├── dashboard-sidebar.tsx  # Sidebar navigation
├── dashboard-nav.tsx      # Top navigation
├── create-ticket-modal.tsx # Ticket creation
├── qr-scanner.tsx         # QR code scanner
└── ui/                    # Shadcn UI components

lib/
├── db.ts                  # Database connection
├── auth.ts                # JWT authentication
├── models/                # Database schemas
├── squad.ts               # Squad payment API
├── mailer.tsx             # Email service
└── whatsapp.ts            # WhatsApp notifications
\`\`\`

---

## Key Flows

### 1. Ticket Creation
1. Organizer logs in to dashboard
2. Creates new ticket with details
3. Ticket published with public slug
4. Analytics updated in real-time

### 2. Ticket Purchase
1. Buyer visits public ticket page
2. Enters details and proceeds to checkout
3. Squad payment gateway integration
4. Upon payment confirmation:
   - Ticket UID generated
   - Ticket marked as paid
   - Email sent with QR code
   - WhatsApp notification sent
5. Redirect to success page

### 3. Ticket Validation
1. Validator opens validation page
2. Scans QR code or enters ticket ID manually
3. Ticket verified as valid/used/invalid
4. Option to mark as used
5. Validation logged

### 4. Withdrawal Process
1. Organizer adds verified bank account
2. Enters withdrawal amount (validates balance)
3. Squad Payout API processes transfer
4. Transaction logged with status
5. Email confirmation sent
6. Status updated via webhook

---

## API Documentation

### Authentication
\`\`\`
POST   /api/auth/signup      # User registration
POST   /api/auth/login       # User login
POST   /api/auth/verify      # Email verification
POST   /api/auth/logout      # User logout
GET    /api/me               # Get current user
\`\`\`

### User Profile
\`\`\`
GET    /api/user/profile     # Get profile
PUT    /api/user/profile     # Update profile
PUT    /api/user/password    # Change password
\`\`\`

### Bank Account
\`\`\`
GET    /api/account          # Get saved account
POST   /api/account          # Add/update account
\`\`\`

### Withdrawals
\`\`\`
POST   /api/withdraw         # Initiate withdrawal
GET    /api/withdraw         # Get withdrawal history
\`\`\`

### Tickets
\`\`\`
POST   /api/tickets/create   # Create new ticket
GET    /api/tickets/list     # Get user's tickets
GET    /api/tickets/[slug]   # Get ticket details
PUT    /api/tickets/[id]     # Update ticket
\`\`\`

### Purchases
\`\`\`
POST   /api/purchase         # Create purchase
GET    /api/purchase/[uid]   # Get purchase details
PUT    /api/purchase/[uid]   # Update purchase (mark used)
\`\`\`

---

## Payment Integration (Squad)

### Test Card
- Number: 4123 4512 3456 7890
- Expiry: Any future date
- CVV: Any 3 digits

### Webhook Events
- `charge.completed` - Payment successful
- `payout.success` - Withdrawal completed
- `payout.failed` - Withdrawal failed

### Webhook Verification
All webhook payloads include `x-squad-signature` header. Signature verified using HMAC-SHA256 with secret key.

---

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect Vercel to GitHub repository
3. Add environment variables in Vercel dashboard
4. Deploy

See `DEPLOYMENT.md` for detailed instructions.

---

## Security Notes

- All sensitive data stored server-side
- JWT tokens in HTTP-only cookies
- Passwords hashed with bcrypt (10 rounds)
- Webhook signatures verified
- Bank account numbers encrypted before storage
- Row-level security on transactions

---

## Error Handling

The application implements comprehensive error handling:
- Input validation on all forms
- Graceful fallbacks for failed requests
- User-friendly error messages
- Server-side error logging
- Toast notifications for user feedback

---

## Performance Optimizations

- Image optimization with Next.js Image component
- Code splitting and lazy loading
- MongoDB index optimization
- Caching strategies for static content
- Minification and bundling

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Support

For issues and support:
- GitHub Issues: [Report a bug](https://github.com/yourusername/travista/issues)
- Email: support@travista.com
- Documentation: Check existing docs before asking

---

## Roadmap

- [ ] Admin analytics dashboard
- [ ] Bulk ticket generation
- [ ] Refund system
- [ ] Multiple payment methods
- [ ] Social media integration
- [ ] Mobile app
- [ ] Advanced reporting

---

## Credits

Built with:
- Next.js 16
- MongoDB & Mongoose
- Squad Payment Gateway
- Nodemailer
- Tailwind CSS
- Shadcn UI
