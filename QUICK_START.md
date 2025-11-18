# Quick Start Guide - Travista

Get started with Travista in 5 minutes!

## 1. Clone & Install

\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd travista

# Install dependencies
npm install
\`\`\`

## 2. Set Up Environment

Create `.env.local`:

\`\`\`env
# Required for local development
MONGODB_URI=mongodb://localhost:27017/travista
JWT_SECRET=dev-secret-change-in-production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@travista.com
SQUAD_PUBLIC_KEY=pk_test_xxxxx
SQUAD_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_BASE_URL=http://localhost:3000
\`\`\`

## 3. Start MongoDB (Local)

\`\`\`bash
# macOS
brew services start mongodb-community

# Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Windows: MongoDB starts automatically if installed
\`\`\`

## 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:3000

## 5. Test Workflow

### Create Account
- Sign up at http://localhost:3000/auth/signup
- Check console for verification email (or actual email if configured)
- Verify and set password
- Create dashboard

### Create Ticket
- Go to Dashboard → "Create Ticket"
- Fill in ticket details
- Use any image URL for flyer
- Click "Create"

### Test Purchase
- Copy public ticket URL
- Open in incognito window
- Fill purchase details
- Use Squad test card: `4242 4242 4242 4242`
- Complete payment

### Validate Ticket
- Go to http://localhost:3000/validate
- Check browser console for QR code in payment response
- Scan or use test QR
- Mark as used

## Useful Resources

- **Full README**: See [README.md](./README.md)
- **Setup Guides**: See [SETUP_GUIDES.md](./SETUP_GUIDES.md)
- **Deployment**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

## Common Issues

**MongoDB not connecting?**
- Ensure MongoDB is running: `brew services start mongodb-community`
- Check MONGODB_URI in `.env.local`

**Emails not sending?**
- Gmail: Use app password, not account password
- Enable 2FA on Gmail account
- Check SMTP_USER and SMTP_PASS

**Squad payment not working?**
- Ensure SQUAD_SECRET_KEY and SQUAD_PUBLIC_KEY are set
- Use sandbox keys for testing (pk_test_, sk_test_)
- Check webhook logs

Need help? Check troubleshooting section in [README.md](./README.md)
