# Travista - Complete Environment Setup Guide

This guide provides detailed instructions for setting up all required services and environment variables for the Travista ticketing platform.

## Quick Reference

All environment variables needed:

- **Database**: MONGODB_URI
- **Auth**: JWT_SECRET
- **Email**: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL
- **WhatsApp**: WHATSAPP_API_KEY (optional)
- **Squad Payment**: SQUAD_API_KEY, SQUAD_SECRET_KEY, NEXT_PUBLIC_BASE_URL
- **URLs**: NEXT_PUBLIC_BASE_URL, NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL

---

## 1. Database Setup (MongoDB)

### Option A: MongoDB Atlas (Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account or sign in
3. Create a new project
4. Create a cluster (choose M0 Free tier)
5. Add your IP address to the network access whitelist
6. Create a database user with username and password
7. Click "Connect" and copy the connection string

**Connection String Format:**
\`\`\`
mongodb+srv://username:password@cluster.mongodb.net/travista?retryWrites=true&w=majority
\`\`\`

8. Add to `.env.local`:
\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travista?retryWrites=true&w=majority
\`\`\`

### Option B: Local MongoDB

\`\`\`bash
# Install MongoDB Community Edition
# https://docs.mongodb.com/manual/installation/

# Start MongoDB service
mongod

# Add to .env.local
MONGODB_URI=mongodb://localhost:27017/travista
\`\`\`

---

## 2. JWT Authentication Setup

Generate a secure random string for JWT_SECRET:

\`\`\`bash
# macOS/Linux
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String([System.Security.Cryptography.RNGCryptoServiceProvider]::new().GetBytes(32))
\`\`\`

Add to `.env.local`:
\`\`\`env
JWT_SECRET=your_generated_secret_here
\`\`\`

---

## 3. Email Configuration (SMTP)

### Using Gmail

1. Enable 2FA on your Google Account
2. Generate an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy the generated 16-character password

3. Add to `.env.local`:
\`\`\`env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
FROM_EMAIL=your_email@gmail.com
\`\`\`

### Using SendGrid

1. Create account at https://sendgrid.com
2. Get your API key from Settings > API Keys
3. Create a sender identity

4. Add to `.env.local`:
\`\`\`env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=SG.your_sendgrid_api_key
FROM_EMAIL=your_verified_sender@example.com
\`\`\`

### Using Mailgun

1. Create account at https://www.mailgun.com
2. Get SMTP credentials from Sending > Domain Settings

3. Add to `.env.local`:
\`\`\`env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your_mailgun_smtp_password
FROM_EMAIL=travista@your-domain.mailgun.org
\`\`\`

---

## 4. Squad Payment Gateway Setup

### Create Squad Account

1. Go to https://www.squadco.com
2. Sign up as a merchant
3. Complete KYC verification
4. Go to Dashboard > Settings > API Keys

### Get Your Keys

- **SQUAD_API_KEY**: Your public API key
- **SQUAD_SECRET_KEY**: Your secret key (keep private!)

### Test Mode

By default, Squad provides test credentials. Use these for testing:
- Test card: 4123 4512 3456 7890
- Any future expiry date
- Any 3-digit CVV

### Production Mode

After testing, replace keys with live production keys from Squad dashboard.

### Add to `.env.local`:

\`\`\`env
SQUAD_API_KEY=sk_live_xxxxxxxxxxxx
SQUAD_SECRET_KEY=secret_xxxxxxxxxxxx
\`\`\`

### Configure Webhook

1. In Squad Dashboard, go to Settings > Webhooks
2. Add webhook URL: `https://yourapp.com/api/webhook/payment`
3. Subscribe to "charge.completed" event
4. Copy the webhook secret and save it

---

## 5. WhatsApp Integration (Optional)

### Option A: WhatsApp Business API

1. Apply at https://business.facebook.com
2. Get approved for WhatsApp Business API
3. Create a business app and connect WhatsApp
4. Get your API key

\`\`\`env
WHATSAPP_API_KEY=your_whatsapp_api_key
\`\`\`

### Option B: wa.me Links (Default - No Setup Required)

By default, the app uses wa.me links which don't require any API key. Users can open WhatsApp directly without additional configuration.

---

## 6. Application URLs

### Development

\`\`\`env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/verify
\`\`\`

### Production (Vercel)

\`\`\`env
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://your-app.vercel.app/auth/verify
\`\`\`

---

## Complete .env.local Example

\`\`\`env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travista?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_generated_secret_here

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
FROM_EMAIL=your_email@gmail.com

# Payment Gateway (Squad)
SQUAD_API_KEY=sk_live_xxxxxxxxxxxx
SQUAD_SECRET_KEY=secret_xxxxxxxxxxxx

# WhatsApp (Optional)
WHATSAPP_API_KEY=your_optional_api_key

# URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/verify
\`\`\`

---

## Verification Checklist

- [ ] MongoDB connection tested
- [ ] JWT secret generated and added
- [ ] SMTP credentials tested (send test email)
- [ ] Squad API keys configured
- [ ] Squad webhook URL added to dashboard
- [ ] WhatsApp API configured (if using API)
- [ ] All URLs set correctly

---

## Troubleshooting

### MongoDB Connection Failed
- Check your IP address is whitelisted in MongoDB Atlas
- Verify username and password are correct
- Check network connectivity

### Emails Not Sending
- Verify SMTP credentials are correct
- Check Gmail App Passwords (if using Gmail)
- Ensure less secure apps are enabled for some email providers

### Squad Payments Not Working
- Verify API keys are from the correct environment (test vs production)
- Check webhook URL is accessible
- Ensure webhook secret matches in Squad dashboard

### WhatsApp Not Sending
- If using wa.me links, no setup required (links will open WhatsApp)
- If using API, verify API key is correct
- Check phone numbers include country code (e.g., +234)
