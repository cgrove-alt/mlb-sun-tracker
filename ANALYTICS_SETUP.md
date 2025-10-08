# Analytics Setup Guide

This document explains how to set up production analytics for The Shadium.

## Overview

The site supports multiple analytics backends:
- **Google Analytics 4** (GA4) - For web vitals and user tracking
- **Vercel KV** - For storing metrics (optional)
- **Console** - Development logging

## Setup Options

### Option 1: Google Analytics 4 (Recommended)

1. **Create GA4 Property**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create a new GA4 property
   - Get your Measurement ID (format: `G-XXXXXXXXXX`)

2. **Enable Measurement Protocol**
   - Go to Admin → Data Streams → Your Web Stream
   - Click "Measurement Protocol API secrets"
   - Create a new API secret
   - Copy the secret value

3. **Add Environment Variables**
   ```bash
   # In Vercel dashboard or .env.local
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   GA_API_SECRET=your-api-secret-here
   ```

4. **Deploy**
   - The analytics system will automatically use GA4 in production
   - Web Vitals (LCP, FID, CLS, FCP, TTFB) will be tracked
   - Geographic data (country, city) is included automatically

### Option 2: Vercel KV Storage (Optional)

If you want to store metrics in Vercel's key-value database:

1. **Install Vercel KV**
   ```bash
   npm install @vercel/kv
   ```

2. **Create KV Database**
   - Go to Vercel Dashboard → Storage → Create Database
   - Select "KV" (Key-Value store)
   - Copy the environment variables

3. **Add to .env**
   ```bash
   KV_REST_API_URL=your-kv-url
   KV_REST_API_TOKEN=your-kv-token
   ```

4. **Uncomment KV code**
   - Edit `lib/analytics.ts`
   - Uncomment the Vercel KV implementation in `VercelKVBackend.send()`

### Option 3: Google Search Console

1. **Verify site ownership**
   - Go to [Google Search Console](https://search.google.com/search-console)
   - Add property: `https://theshadium.com`
   - Get verification code

2. **Add verification to site**
   - Edit `app/layout.tsx`
   - Uncomment the verification section (lines 128-131)
   - Replace placeholder with your actual code:
   ```typescript
   verification: {
     google: 'your-actual-verification-code-here',
   },
   ```

3. **Submit sitemaps**
   - In Search Console, go to Sitemaps
   - Submit these URLs:
     - `https://theshadium.com/sitemap-index.xml`
     - `https://theshadium.com/sitemap.xml`
     - `https://theshadium.com/sitemap-stadiums.xml`
     - `https://theshadium.com/sitemap-guides.xml`

## Web Vitals Thresholds

The system automatically flags poor performance:

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP    | ≤ 2.5s | 2.5s - 4.0s | > 4.0s |
| FID    | ≤ 100ms | 100ms - 300ms | > 300ms |
| CLS    | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |
| TTFB   | ≤ 800ms | 800ms - 1800ms | > 1800ms |

## Viewing Metrics

### In Development
- Metrics are logged to console with color coding:
  - 🟢 Good
  - 🟡 Needs Improvement
  - 🔴 Poor

- Access debug endpoint:
  ```
  GET http://localhost:3000/api/metrics
  ```

### In Production

**Google Analytics:**
- Go to GA4 → Reports → Events
- Look for `web_vitals` events
- Create custom reports for Web Vitals

**Custom Dashboard:**
- Could build using Next.js admin panel
- Query metrics from KV or GA4
- Display real-time performance

## Monitoring Alerts

Consider setting up alerts for:
- LCP > 2500ms for more than 25% of users
- CLS > 0.1 for more than 10% of users
- High error rates
- Geographic performance issues

Tools for alerting:
- Google Analytics 4 Custom Alerts
- Vercel Analytics (paid)
- Datadog/New Relic (enterprise)

## Cost Considerations

- **Google Analytics 4**: Free (up to 10M events/month)
- **Vercel KV**: $0.25/100K reads (has free tier)
- **Console logging**: Free (development only)

## Next Steps

1. ✅ Set up Google Search Console verification
2. ✅ Configure GA4 with Measurement Protocol
3. ✅ Monitor metrics for first week
4. ✅ Set up alerts for poor performance
5. ✅ Create performance dashboard (optional)

## Troubleshooting

**Metrics not appearing in GA4:**
- Check `NEXT_PUBLIC_GA_MEASUREMENT_ID` is correct
- Verify `GA_API_SECRET` is set
- Check Network tab for failed requests
- Ensure Measurement Protocol API is enabled

**High memory usage:**
- Development console backend logs everything
- In production, only stores in GA4/KV
- No in-memory storage in production

**Geo data missing:**
- Vercel headers only available in production
- Will show "unknown" in local development
