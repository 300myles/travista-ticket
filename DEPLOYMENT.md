# Deployment Guide for Travista

## Overview

This guide covers deploying Travista to Vercel with full production setup including Squad payment webhooks, email sending, and QR validation.

## Prerequisites

- GitHub account with your Travista repository
- Vercel account (free tier available)
- Production Squad API keys
- Production email/SMTP credentials
- MongoDB Atlas account (or your production MongoDB)

## Step 1: Prepare Your Code

### 1.1 Ensure All Files Are Committed

\`\`\`bash
git status
git add .
git commit -m "Prepare for production deployment"
git push origin main
\`\`\`

### 1.2 Verify `.env.local` Is Not Committed

\`\`\`bash
# Check if .env.local is in .gitignore
cat .gitignore | grep env

# Should see: .env.local
\`\`\`

## Step 2: Deploy to Vercel

### 2.1 Connect Your Repository

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Click "Import"

### 2.2 Set Environment Variables

In Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add all production variables:

\`\`\`
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/travista?retryWrites=true&w=majority
JWT_SECRET = [generate new strong secret]
SMTP_HOST = [your SMTP host]
SMTP_PORT = 587
SMTP_SECURE = false
SMTP_USER = [your email]
SMTP_PASS = [your email password]
FROM_EMAIL = noreply@yourdomain.com
SQUAD_PUBLIC_KEY = pk_live_xxxxx
SQUAD_SECRET_KEY = sk_live_xxxxx
NEXT_PUBLIC_BASE_URL = https://yourdomain.vercel.app
WHATSAPP_API_TOKEN = [optional]
\`\`\`

### 2.3 Deploy

1. Click **Deploy**
2. Wait for deployment to complete
3. Copy your deployment URL (e.g., `https://travista.vercel.app`)

## Step 3: Configure Squad Webhooks

### 3.1 Update Webhook URL

1. Log in to Squad dashboard
2. Go to **Settings** → **Webhooks**
3. Update webhook URL to:
   \`\`\`
   https://yourdomain.vercel.app/api/webhook/payment
   \`\`\`
4. Subscribe to: `charge.completed` event
5. Save

### 3.2 Test Webhook

1. Make a test payment in your app
2. Check Squad logs for webhook delivery
3. Verify ticket is marked as paid

## Step 4: Update DNS (If Using Custom Domain)

### 4.1 Add Custom Domain

1. In Vercel project → **Settings** → **Domains**
2. Enter your custom domain
3. Vercel will show DNS records to add
4. Add records to your domain provider

### 4.2 Update Environment Variables

After domain is verified:

\`\`\`
NEXT_PUBLIC_BASE_URL = https://yourdomain.com
\`\`\`

Update Squad webhook URL to use custom domain:
\`\`\`
https://yourdomain.com/api/webhook/payment
\`\`\`

## Step 5: Test Production Setup

### 5.1 Test Authentication

\`\`\`bash
# Access your production URL
https://yourdomain.com

# Sign up with test email
# Verify email received and working
\`\`\`

### 5.2 Test Ticket Creation

1. Log in to dashboard
2. Create a test ticket with Squad test card details

### 5.3 Test Purchase Flow

1. Visit public ticket page
2. Fill in test details
3. Use Squad test card: 4242 4242 4242 4242
4. Verify payment succeeds
5. Check email for ticket

### 5.4 Test QR Validation

1. Go to `/validate` page
2. Scan the QR code from email
3. Verify ticket details display
4. Mark as used
5. Verify status updates

## Step 6: Monitoring & Maintenance

### 6.1 Set Up Email Alerts

In Vercel project → **Settings** → **Notifications**:
- Enable deployment notifications
- Enable error notifications

### 6.2 Monitor Squad Transactions

1. Squad Dashboard → **Transactions**
2. Set up webhook delivery monitoring
3. Monitor for failed payments

### 6.3 Monitor Email Delivery

- Check SMTP provider for bounce rate
- Monitor email open rates
- Set up email alerts for failures

### 6.4 Database Backups

For MongoDB Atlas:
- Go to **Backups** → **Configure Backup**
- Enable daily automated backups
- Test restore procedures

## Troubleshooting Deployment Issues

### Issue: "Environment variables not found"

**Solution**: 
- Verify all variables are set in Vercel dashboard
- Redeploy after adding variables
- Check function logs: Vercel dashboard → **Functions**

### Issue: Webhook not triggering

**Solution**:
- Verify Squad webhook URL is correct
- Check Squad logs for delivery status
- Ensure `SQUAD_SECRET_KEY` matches Squad account
- Test with Squad test transaction

### Issue: Emails not sending

**Solution**:
- Verify SMTP credentials in Vercel environment
- Check email provider isn't blocking SMTP
- Look at function logs for SMTP errors
- Try with different email provider (Mailgun, SendGrid)

### Issue: MongoDB connection timeout

**Solution**:
- Check MongoDB Atlas network access whitelist
- Add Vercel IP ranges to whitelist: https://vercel.com/docs/concepts/projects/environment-variables/system-environment-variables
- Or allow all IPs (0.0.0.0/0) in development
- Verify `MONGODB_URI` is correct

### Issue: "Invalid signature" on webhook

**Solution**:
- Verify `SQUAD_SECRET_KEY` in Vercel matches Squad account
- Test webhook with raw Squad payload
- Check webhook signature calculation in `lib/squad.ts`

## Performance Optimization

### 1. Enable Caching

In Vercel project → **Settings** → **Build & Development Settings**:
- Enable "Optimize package imports"
- Enable "Optimize images"

### 2. Monitor Function Performance

- Vercel dashboard → **Analytics**
- Check function execution time
- Optimize slow endpoints

### 3. Database Optimization

In MongoDB Atlas:
- Create indexes on frequently queried fields
- Monitor query performance
- Archive old purchase records

## Security Checklist

- [ ] All secrets properly set in Vercel (not in code)
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Squad webhook signature verification enabled
- [ ] Rate limiting configured on payment endpoints
- [ ] Database backups configured
- [ ] SMTP credentials rotated regularly
- [ ] JWT_SECRET is strong random string
- [ ] Production Squad keys used (not sandbox)
- [ ] Monitoring and alerts configured
- [ ] Error reporting set up (Sentry/similar optional)

## Scaling Considerations

As your platform grows:

1. **Database**: 
   - Monitor connection pool
   - Consider MongoDB Atlas M10+ cluster
   - Implement caching (Redis)

2. **API Rate Limiting**:
   - Implement rate limiting on sensitive endpoints
   - Use Upstash for distributed rate limiting

3. **Email Delivery**:
   - Consider SendGrid or Mailgun for higher volume
   - Implement email queue system

4. **CDN**:
   - Vercel automatically uses Vercel Edge Network
   - Configure image optimization

## Rollback Procedure

If deployment causes issues:

1. Go to Vercel dashboard → **Deployments**
2. Find previous stable deployment
3. Click **...** → **Promote to Production**
4. Verify issues are resolved

## Getting Help

- **Vercel Docs**: https://vercel.com/docs
- **Squad Docs**: https://squad.frontendpie.com/docs
- **MongoDB Docs**: https://docs.mongodb.com/manual/
- **Next.js Docs**: https://nextjs.org/docs

---

Congratulations! Your Travista platform is now live in production! 🎉
