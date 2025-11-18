# Detailed Setup Guides

## Table of Contents
1. [MongoDB Setup](#mongodb-setup)
2. [SMTP Email Setup](#smtp-email-setup)
3. [Squad Payment Setup](#squad-payment-setup)
4. [WhatsApp Integration Setup](#whatsapp-integration-setup)
5. [Troubleshooting](#troubleshooting)

---

## MongoDB Setup

### Local Development

#### macOS (Homebrew)

\`\`\`bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify it's running
brew services list

# Connect to MongoDB
mongosh

# Exit MongoDB shell
exit
\`\`\`

**Environment Variable:**
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/travista
\`\`\`

#### Windows

1. Download MongoDB installer: https://www.mongodb.com/try/download/community
2. Run installer and follow wizard
3. Choose "Install MongoDB as a Service"
4. MongoDB starts automatically

**Environment Variable:**
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/travista
\`\`\`

#### Docker

\`\`\`bash
docker run -d -p 27017:27017 --name travista-mongo mongo:latest

# View logs
docker logs travista-mongo

# Stop container
docker stop travista-mongo
\`\`\`

**Environment Variable:**
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/travista
\`\`\`

### Cloud Setup (MongoDB Atlas)

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Create account and sign in
4. Click "Create a Deployment"
5. Choose "M0 Free" tier
6. Click "Create Deployment"
7. Create database user:
   - Username: `travista_user`
   - Password: Generate strong password
   - Click "Create User"
8. Add your IP to whitelist:
   - Click "Add My Current IP Address"
   - Or add 0.0.0.0/0 for development
9. Click "Connect"
10. Choose "Connect your application"
11. Copy connection string

**Environment Variable:**
\`\`\`env
MONGODB_URI=mongodb+srv://travista_user:YOUR_PASSWORD@cluster.mongodb.net/travista?retryWrites=true&w=majority
\`\`\`

Replace:
- `travista_user` with your username
- `YOUR_PASSWORD` with your password
- `cluster` with your cluster name

### Testing MongoDB Connection

\`\`\`bash
# From your project directory
npm run dev

# Visit http://localhost:3000
# Try to sign up - if it works, MongoDB is connected
\`\`\`

---

## SMTP Email Setup

### Gmail Setup

1. Go to https://myaccount.google.com
2. Click "Security" in left sidebar
3. Enable "2-Step Verification" (if not already enabled)
4. Go back to Security section
5. Click "App Passwords" (appears after 2FA is enabled)
6. Select "Mail" and "Windows Computer"
7. Click "Generate"
8. Copy the 16-character password

**Environment Variables:**
\`\`\`env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
FROM_EMAIL=your-email@gmail.com
\`\`\`

### Mailgun Setup

1. Go to https://www.mailgun.com
2. Sign up for free tier
3. Verify your domain or use sandbox domain
4. Go to "Domain Settings"
5. Copy SMTP credentials:

**Environment Variables:**
\`\`\`env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@YOUR_DOMAIN
SMTP_PASS=YOUR_API_KEY
FROM_EMAIL=no-reply@YOUR_DOMAIN
\`\`\`

### SendGrid Setup

1. Go to https://sendgrid.com
2. Sign up for free tier
3. Go to "Email API" → "Integration Guide"
4. Choose SMTP
5. Generate API key
6. Copy credentials:

**Environment Variables:**
\`\`\`env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=SG.YOUR_API_KEY
FROM_EMAIL=noreply@yourdomain.com
\`\`\`

### Testing Email

\`\`\`bash
# After setting environment variables, run:
npm run dev

# Try signing up at http://localhost:3000/auth/signup
# Check your inbox for verification email
\`\`\`

---

## Squad Payment Setup

### Creating Squad Account

1. Go to https://squademerchant.com
2. Click "Get Started"
3. Fill in your business details:
   - Business name
   - Email
   - Phone number
4. Create account
5. Verify your email

### Getting API Keys

1. Log in to Squad dashboard
2. Click your profile → "Settings"
3. Click "API Keys"
4. You'll see:
   - Sandbox (Testing) keys
   - Live keys (Production)

**For Development (Use Sandbox Keys):**
\`\`\`env
SQUAD_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
SQUAD_SECRET_KEY=sk_test_xxxxxxxxxxxxx
\`\`\`

**For Production (Use Live Keys):**
\`\`\`env
SQUAD_PUBLIC_KEY=pk_live_xxxxxxxxxxxxx
SQUAD_SECRET_KEY=sk_live_xxxxxxxxxxxxx
\`\`\`

### Setting Up Webhooks

1. In Squad dashboard, go to "Settings"
2. Click "Webhooks"
3. Click "Add Webhook"
4. Enter webhook URL:
   - **Development**: `http://localhost:3000/api/webhook/payment` (won't work, use ngrok below)
   - **Production**: `https://your-domain.com/api/webhook/payment`

5. Select events to subscribe to:
   - Check: `charge.completed`
   - Check: `charge.failed` (optional)

6. Click "Create"
7. You'll see a webhook secret (displayed once)

### Testing Webhooks Locally (ngrok)

1. Install ngrok: https://ngrok.com/download
2. Extract and run:
   \`\`\`bash
   ./ngrok http 3000
   \`\`\`
3. Copy the HTTPS URL (e.g., `https://xxxxx.ngrok.io`)
4. In Squad webhooks, add:
   \`\`\`
   https://xxxxx.ngrok.io/api/webhook/payment
   \`\`\`
5. Click "Test Event" to verify

### Test Cards

**Successful Payment:**
- Card: 4242 4242 4242 4242
- Expiry: Any future date (e.g., 12/25)
- CVV: Any 3 digits (e.g., 123)

**Failed Payment:**
- Card: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3 digits

### Testing Payment Flow

1. Run your app: `npm run dev`
2. Visit http://localhost:3000
3. Create an account and ticket
4. Visit public ticket page
5. Fill in purchase details
6. Click "Pay with Squad"
7. Enter test card details
8. Click "Pay"
9. Check email for ticket

---

## WhatsApp Integration Setup

### Option 1: WhatsApp Cloud API (Recommended)

1. Go to https://www.whatsapp.com/business/
2. Create Business Account
3. Go to https://developers.facebook.com
4. Create app:
   - App name: "Travista"
   - App purpose: "Business"
5. Add WhatsApp product:
   - Click "Add Product"
   - Search "WhatsApp"
   - Click "Set Up"
6. Add your phone number:
   - Go to "WhatsApp" → "Getting Started"
   - Click "Add phone number"
   - Verify your phone via SMS
7. Get credentials:
   - Go to "WhatsApp" → "API Setup"
   - Copy: Phone Number ID, Business Account ID
   - Click "Generate Token" to get access token
8. Add to environment:

\`\`\`env
WHATSAPP_API_TOKEN=your_access_token
\`\`\`

9. In `lib/whatsapp.ts`, update this line:
\`\`\`typescript
const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || "YOUR_PHONE_NUMBER_ID"
\`\`\`

### Option 2: wa.me Fallback (No Setup Required)

If you don't set `WHATSAPP_API_TOKEN`, the app automatically uses wa.me links:
- Users click a link
- WhatsApp opens with pre-filled message
- They send manually

This requires no setup and works without credentials.

### Testing WhatsApp

\`\`\`bash
# Start app
npm run dev

# Purchase a ticket
# Check phone for WhatsApp message with ticket
\`\`\`

---

## Troubleshooting

### MongoDB Issues

**"ECONNREFUSED" error**
\`\`\`
Solution:
1. Make sure MongoDB is running
2. Check connection string in .env.local
3. For local: Start with `brew services start mongodb-community`
4. For Atlas: Verify IP in whitelist
\`\`\`

**"MongooseError: Cannot connect"**
\`\`\`
Solution:
1. Verify MONGODB_URI format
2. Check username and password are correct
3. For Atlas, ensure cluster is running (not paused)
4. Test connection with mongosh CLI
\`\`\`

### Email Issues

**"No response from SMTP server"**
\`\`\`
Solution:
1. Verify SMTP_HOST and SMTP_PORT are correct
2. Disable firewall temporarily (or add exception)
3. Try different email provider
4. Check if SMTP_PASS is correct
\`\`\`

**"Authentication failed"**
\`\`\`
Solution:
1. For Gmail: Use app password, not account password
2. Enable 2FA on Gmail account
3. Check SMTP_USER matches your email
4. Verify SMTP_PASS is copied correctly
\`\`\`

**Emails going to spam**
\`\`\`
Solution:
1. Use FROM_EMAIL that matches SMTP_USER for Gmail
2. Add SPF record to your domain (if using custom domain)
3. Verify "DKIM" and "DMARC" setup
4. Consider using dedicated email service (SendGrid, Mailgun)
\`\`\`

### Squad Payment Issues

**"Invalid API key"**
\`\`\`
Solution:
1. Verify you copied full key correctly
2. Check you're using same mode (sandbox or live) everywhere
3. Regenerate API keys in Squad dashboard
4. Ensure keys are in .env.local (not hardcoded)
\`\`\`

**"Webhook signature invalid"**
\`\`\`
Solution:
1. Verify SQUAD_SECRET_KEY matches your account
2. Test webhook with Squad "Send Test Event"
3. Check webhook URL is correct
4. Monitor webhook logs in Squad dashboard
\`\`\`

**Payment timeout**
\`\`\`
Solution:
1. Check Squad service status
2. Verify internet connection
3. Check that payment_timeout in Squad settings is sufficient
4. Contact Squad support if issue persists
\`\`\`

### WhatsApp Issues

**Messages not being sent**
\`\`\`
Solution:
1. If using API: Verify token is valid
2. Check phone format includes country code (+234 for Nigeria)
3. Ensure WhatsApp account is verified
4. Check if using wa.me fallback instead
\`\`\`

**"Webhook not delivering"**
\`\`\`
Solution:
1. Verify webhook URL is accessible
2. Check if running locally (use ngrok)
3. Verify webhook event subscriptions
4. Check webhook logs in your provider dashboard
\`\`\`

---

For more help, check:
- MongoDB docs: https://docs.mongodb.com
- Squad docs: https://squad.frontendpie.com/docs
- WhatsApp docs: https://developers.facebook.com/docs/whatsapp
- Gmail SMTP: https://support.google.com/mail/answer/7126229
