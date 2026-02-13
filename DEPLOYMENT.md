# 🚀 Deployment Guide - Margins Pro

## ✅ Pre-Deployment Checklist

- [x] All tests passing (11/11 system tests ✅)
- [x] Build successful
- [x] Runtime optimized (Bun/Deno)
- [x] Security hardened (Midtrans signature, Zod validation)
- [x] Performance monitoring (Web Vitals)
- [x] Documentation complete

## 🎯 Deployment Options

### Option 1: Vercel (Recommended) ⭐

**Why Vercel?**
- Edge runtime (Deno) = 0ms cold start
- Automatic HTTPS
- Global CDN
- Zero config deployment
- Free tier available

**Steps:**

```bash
# 1. Install Vercel CLI
bun add -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# 4. Set environment variables in Vercel dashboard
```

**Required Environment Variables:**
```
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token
JWT_SECRET=your-secret-key-min-32-chars
GEMINI_API_KEY=your-gemini-key
MIDTRANS_SERVER_KEY=your-midtrans-server-key
MIDTRANS_CLIENT_KEY=your-midtrans-client-key
```

### Option 2: Railway

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Initialize
railway init

# 4. Deploy
railway up
```

### Option 3: Fly.io

```bash
# 1. Install flyctl
curl -L https://fly.io/install.sh | sh

# 2. Login
fly auth login

# 3. Launch
fly launch

# 4. Deploy
fly deploy
```

## 🔧 Post-Deployment

### 1. Verify Deployment

```bash
# Test health endpoint
curl https://your-domain.vercel.app/api/health

# Test demo login
curl -X POST https://your-domain.vercel.app/api/auth/demo
```

### 2. Setup Monitoring

**Vercel Analytics:**
- Enable in Vercel dashboard
- Automatic Web Vitals tracking

**Error Tracking (Optional):**
```bash
# Add Sentry
bun add @sentry/react @sentry/node
```

### 3. Configure Meta Pixel

Update `index.html`:
```html
<!-- Replace YOUR_PIXEL_ID with actual ID -->
<script>
  fbq('init', 'YOUR_ACTUAL_PIXEL_ID');
</script>
```

### 4. Setup Custom Domain (Optional)

In Vercel dashboard:
1. Go to Settings → Domains
2. Add your domain
3. Configure DNS records

## 📊 Performance Targets

Monitor these metrics post-launch:

| Metric | Target | Tool |
|--------|--------|------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Time to Interactive | < 3s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Web Vitals |
| Cumulative Layout Shift | < 0.1 | Web Vitals |
| First Input Delay | < 100ms | Web Vitals |

## 🐛 Troubleshooting

### Build fails on Vercel

```bash
# Check build logs
vercel logs

# Common fix: Clear cache
vercel --force
```

### Database connection fails

```bash
# Verify Turso credentials
turso db show your-db-name

# Test connection locally
bun run preview
```

### Environment variables not working

```bash
# List all env vars
vercel env ls

# Pull env vars locally
vercel env pull
```

## 🔄 Rollback Plan

If deployment fails:

```bash
# Rollback to previous deployment
vercel rollback

# Or redeploy specific commit
vercel --prod --force
```

## 📈 Launch Checklist

**Day 1:**
- [ ] Deploy to production
- [ ] Verify all features work
- [ ] Test payment flow (sandbox)
- [ ] Monitor error logs
- [ ] Check performance metrics

**Week 1:**
- [ ] Monitor user behavior
- [ ] Collect feedback
- [ ] Fix critical bugs
- [ ] Optimize slow queries

**Month 1:**
- [ ] Analyze conversion rates
- [ ] A/B test features
- [ ] Scale infrastructure if needed
- [ ] Plan feature roadmap

---

## 🎉 Ready to Deploy?

**Current Status:** ✅ **PRODUCTION READY**

Run this command to deploy:

```bash
vercel --prod
```

Good luck! 🚀
