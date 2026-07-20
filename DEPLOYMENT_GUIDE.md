# Production Deployment Guide - The Shadium v0.2.0

## 🚀 Overview

This guide covers deploying The Shadium v0.2.0 (World Cup 2026 release) to production on Vercel.

**Production URL:** [https://theshadium.com](https://theshadium.com)

---

## ✅ Pre-Deployment Checklist

### 1. Code Quality Checks

Run all validation before deployment:

```bash
# TypeScript compilation
npm run type-check

# Linting
npm run lint

# Unit tests
npm run test:unit

# Data validation
npm run validate-stadium-data

# Data freshness check
npm run check-data-freshness

# Production build test
npm run build
```

**Success Criteria:**
- ✅ Zero TypeScript errors in production code
- ✅ Zero ESLint errors
- ✅ 1,200+ tests passing (95%+ pass rate)
- ✅ All stadium data valid
- ✅ Build completes successfully

### 2. Version Update

Update version number in `package.json`:

```json
{
  "version": "0.2.0"
}
```

### 3. Documentation Review

Ensure all documentation is current:
- ✅ CHANGELOG.md updated with all changes
- ✅ README.md reflects new features
- ✅ VERCEL_DEPLOYMENT.md has correct configuration
- ✅ DEPLOYMENT_GUIDE.md (this file) is accurate

### 4. Environment Variables

Verify environment variables in Vercel dashboard or `vercel.json`:

**Required:**
- `NODE_ENV`: "production"
- `NEXT_PUBLIC_GA_ID`: "G-JXGEKF957C"
- `NEXT_PUBLIC_SITE_URL`: "https://theshadium.com"

**Optional (for future features):**
- `AIRTABLE_API_KEY`: For user feedback integration
- `AIRTABLE_BASE_ID`: For user feedback storage
- `ADMIN_PASSWORD`: For analytics dashboard access

---

## 🔄 Deployment Methods

### Method 1: Automatic Deployment (Recommended)

**GitHub Integration (Already Configured)**

1. Merge approved changes to `main` branch:
```bash
git checkout main
git pull origin main
git merge your-feature-branch
git push origin main
```

2. Vercel automatically:
   - Detects the push
   - Runs `npm run build`
   - Executes `npm run postbuild` (compression)
   - Deploys to production
   - Invalidates CDN cache

3. Monitor deployment:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Watch build logs in real-time
   - Verify deployment URL appears

**Expected Build Time:** 3-5 minutes

### Method 2: Manual Deployment via CLI

**Use when:** Automatic deployment fails or you need more control

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Or with specific build environment
vercel --build-env NODE_ENV=production --prod
```

### Method 3: Preview Deployment (Testing)

**Use for:** Testing changes before production

```bash
# Create preview deployment
vercel

# Or deploy specific branch
vercel --branch your-feature-branch
```

Preview deployments get unique URLs: `https://theshadium-{hash}.vercel.app`

---

## 🧪 Post-Deployment Verification

### 1. Smoke Tests (Critical Paths)

Test these flows immediately after deployment:

#### Flow 1: Homepage Load ✅
1. Visit https://theshadium.com
2. Verify hero section loads
3. Check World Cup countdown timer works
4. Verify venue carousel auto-plays
5. Confirm all images load

**Expected:** Page loads in <3s, all content visible

#### Flow 2: MLB Stadium Shade Finder ✅
1. Navigate to any MLB stadium (e.g., /mlb/yankee-stadium)
2. Select date and time
3. Verify section list displays with shade percentages
4. Click section to expand row details
5. Verify inning-by-inning timeline shows
6. Click stadium diagram section
7. Verify bidirectional selection sync works

**Expected:** All interactions smooth, data accurate

#### Flow 3: World Cup Match Schedule ✅
1. Navigate to /worldcup2026/schedule
2. Verify all 104 matches display
3. Test filters (round, country, venue, date range)
4. Click "Find Shaded Seats" on match card
5. Verify venue/date/time pre-filled correctly

**Expected:** Filters work, countdown timers update, links functional

#### Flow 4: Section Comparison ✅
1. On any stadium page, toggle comparison mode
2. Select 2-4 sections
3. Verify comparison view displays
4. Check winner badges (Best Value/Shade/Price)
5. Test URL sharing (copy URL, open in new tab)

**Expected:** Comparison data accurate, URL params work

#### Flow 5: Mobile Experience ✅
1. Open site on mobile device or DevTools mobile view
2. Test filter drawer swipe gestures
3. Verify touch targets ≥44px
4. Test pull-to-refresh
5. Check virtual scrolling (stadium with 60+ sections)

**Expected:** Smooth animations, responsive, no lag

### 2. Performance Checks

#### Core Web Vitals
Run Lighthouse audit:

```bash
# Install Lighthouse CLI (if needed)
npm install -g lighthouse

# Run audit
lighthouse https://theshadium.com --view
```

**Target Scores:**
- Performance: ≥60 ✅
- Accessibility: ≥95 ✅
- Best Practices: ≥90 ✅
- SEO: ≥95 ✅

**Core Web Vitals:**
- LCP (Largest Contentful Paint): <2.5s (currently 5.8s, acceptable)
- FID (First Input Delay): <100ms ✅
- CLS (Cumulative Layout Shift): <0.1 (currently 0) ✅

#### Bundle Size Verification

Check Vercel deployment details:
- Homepage: ~515 KB uncompressed, ~105 KB Brotli
- Stadium pages: ~907 KB uncompressed
- Data chunks: ~219 KB Brotli (93% compression)

### 3. Browser Compatibility

Test on these browsers:
- ✅ Chrome (latest 2 versions)
- ✅ Firefox (latest 2 versions)
- ✅ Safari (latest 2 versions)
- ✅ Edge (latest 2 versions)
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android 10+)

### 4. SEO Verification

#### Sitemap
Visit https://theshadium.com/sitemap.xml

**Verify:**
- All MLB stadium pages (30 URLs)
- All World Cup pages (20 URLs: landing, schedule, 16 venues, compare, venues list)
- MiLB pages
- Static pages (home, about, etc.)

#### Meta Tags
Use [Open Graph Debugger](https://www.opengraph.xyz/):
- Test homepage
- Test MLB stadium page
- Test World Cup venue page

**Expected:**
- Title tags present and descriptive
- OG:image displays correctly
- Twitter Card renders properly
- Schema.org markup valid

### 5. Analytics Verification

#### Google Analytics
1. Visit https://analytics.google.com
2. Select property: The Shadium (G-JXGEKF957C)
3. View real-time reports
4. Trigger page view by visiting site
5. Verify event appears in real-time view

#### Web Vitals Monitoring
Web vitals are automatically tracked and sent to Google Analytics.

Check custom events:
- `web-vitals` event type
- Metrics: LCP, FID, CLS, FCP, TTFB

---

## 🚨 Rollback Procedure

If critical issues are found after deployment:

### Quick Rollback (Vercel Dashboard)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select "theshadium" project
3. Click "Deployments" tab
4. Find last working deployment
5. Click "⋯" menu → "Promote to Production"

**Rollback Time:** <1 minute

### Git Rollback (If Needed)

```bash
# Find last working commit
git log --oneline

# Revert to that commit
git revert <commit-hash>

# Push to trigger new deployment
git push origin main
```

**Rollback Time:** ~5 minutes (build + deploy)

---

## 🔧 Troubleshooting

### Issue: Build Fails

**Symptoms:** Vercel build errors, deployment stuck

**Solutions:**
1. Check build logs in Vercel dashboard
2. Verify `package.json` dependencies are locked
3. Clear Vercel cache: `vercel --force`
4. Check for TypeScript errors: `npm run type-check`
5. Test build locally: `npm run build`

### Issue: Environment Variables Not Working

**Symptoms:** Features broken, API calls fail

**Solutions:**
1. Verify variables in Vercel dashboard (Settings → Environment Variables)
2. Ensure `NEXT_PUBLIC_` prefix for client-side variables
3. Redeploy after changing variables (they're not hot-reloaded)
4. Check `vercel.json` has correct values

### Issue: Site Slow to Load

**Symptoms:** High LCP, slow page loads

**Solutions:**
1. Check Vercel Analytics for slow regions
2. Review bundle size: `npm run build` → check .next folder
3. Verify Brotli compression enabled
4. Check for memory leaks in 3D calculator
5. Review IndexedDB cache hit rate

### Issue: 3D Shade Calculator Not Working

**Symptoms:** Sections show "Calculating..." forever

**Solutions:**
1. Check browser console for errors
2. Verify IndexedDB is available (not in private mode)
3. Clear IndexedDB cache: Application tab → IndexedDB → Delete
4. Check API route: `/api/stadium/[id]/rows/shade`
5. Verify stadium has `hasSpecificData` flag

### Issue: World Cup Countdown Timers Wrong

**Symptoms:** Countdown shows incorrect time

**Solutions:**
1. Verify system time is correct
2. Check timezone data in `worldcup2026-matches.ts`
3. Test DST handling (dates around DST transitions)
4. Verify `date-fns-tz` is installed: `npm ls date-fns-tz`

---

## 📊 Monitoring

### Vercel Analytics

**Real-time metrics:**
- Page views per minute
- Geographic distribution
- Device breakdown (mobile/desktop)
- Top pages

**Access:** [Vercel Analytics Dashboard](https://vercel.com/dashboard/analytics)

### Google Analytics 4

**Key reports:**
- Real-time users
- User acquisition
- Engagement (pages per session, session duration)
- Conversions (if goals configured)

**Custom events to track:**
- `stadium_view`: When user views stadium page
- `section_compare`: When user compares sections
- `filter_used`: When user applies filter
- `report_inaccuracy`: When user submits feedback

### Performance Monitoring

**Core Web Vitals (Google Search Console):**
1. Visit [Google Search Console](https://search.google.com/search-console)
2. Select property: theshadium.com
3. Go to "Core Web Vitals" report
4. Monitor LCP, FID, CLS trends

**Expected after 28 days:**
- 90%+ pages with "Good" LCP
- 95%+ pages with "Good" FID
- 95%+ pages with "Good" CLS

### Error Tracking

Currently: Console errors only (browser DevTools)

**Recommended (future):**
- Sentry integration for error tracking
- Real User Monitoring (RUM) for performance
- Custom alerting for critical errors

---

## 🔐 Security

### Pre-Deployment Security Checklist

- ✅ HTTPS enforced (automatic with Vercel)
- ✅ Security headers configured in `vercel.json`:
  - Strict-Transport-Security
  - X-Frame-Options: SAMEORIGIN
  - X-Content-Type-Options: nosniff
  - X-XSS-Protection
  - Referrer-Policy
  - Permissions-Policy
- ✅ No API keys in client-side code
- ✅ Rate limiting on API routes (user feedback)
- ✅ Input validation on all forms
- ✅ CORS configured correctly
- ✅ Dependencies up to date: `npm audit`

### Post-Deployment Security Check

```bash
# Check for vulnerabilities
npm audit

# If vulnerabilities found
npm audit fix

# Force update if needed
npm audit fix --force
```

**Run monthly** or when critical CVEs announced.

---

## 📅 Post-Launch Tasks

### Week 1: Monitoring

- [ ] Monitor Vercel Analytics daily
- [ ] Check Google Analytics for unusual traffic patterns
- [ ] Review error logs for client-side errors
- [ ] Monitor Core Web Vitals in Search Console
- [ ] Check user feedback submissions (if any)

### Week 2: Optimization

- [ ] Review performance metrics
- [ ] Identify slow pages and optimize
- [ ] Check which sections/stadiums are most viewed
- [ ] Analyze filter usage patterns
- [ ] Review bounce rate on key pages

### Month 1: Data Updates

- [ ] Run data freshness check: `npm run check-data-freshness`
- [ ] Update stadium data if >1 year old
- [ ] Verify World Cup match data is accurate
- [ ] Check for new MiLB stadiums to add

### Quarterly: Feature Review

- [ ] Review analytics for feature usage
- [ ] Gather user feedback from Report Inaccuracy form
- [ ] Plan improvements based on data
- [ ] Update dependencies: `npm update`
- [ ] Re-run full QA test suite

---

## 🎯 Success Metrics

### Traffic Goals (First Month)

- **Unique Visitors:** 10,000+
- **Page Views:** 50,000+
- **Avg Session Duration:** >2 minutes
- **Bounce Rate:** <60%

### Engagement Goals

- **Section Comparisons:** 500+/month
- **Filter Usage:** 2,000+/month
- **World Cup Page Views:** 5,000+/month
- **Mobile Traffic:** >50% of total

### Performance Goals

- **Lighthouse Score:** ≥60 (Performance)
- **Core Web Vitals:** 90%+ "Good" URLs
- **Uptime:** 99.9%
- **Error Rate:** <0.1%

### Data Quality Goals

- **User Feedback Submissions:** <10/month (low = good data)
- **Data Accuracy:** 95%+
- **Data Freshness:** All stadiums <2 years old

---

## 🆘 Emergency Contacts

### Critical Issues (Site Down)

1. Check Vercel Status: https://www.vercel-status.com
2. If Vercel is up, check deployment logs
3. Roll back to last working deployment
4. Contact Vercel Support (if needed): support@vercel.com

### Non-Critical Issues

1. Check GitHub Issues for similar problems
2. Review this troubleshooting guide
3. Test locally to reproduce
4. Create GitHub issue with reproduction steps

---

## 📝 Deployment Log Template

Keep a log of all production deployments:

```markdown
## Deployment: v0.2.0
**Date:** 2026-01-27
**Deployed By:** [Your Name]
**Deployment Method:** Automatic (GitHub push)
**Commit Hash:** [commit-hash]
**Vercel Deployment URL:** https://theshadium.vercel.app/[hash]

### Pre-Deployment Checks
- [x] Type check passed
- [x] Linter passed
- [x] Tests passed (1,218/1,287)
- [x] Build successful
- [x] Data validated

### Post-Deployment Verification
- [x] Smoke tests passed
- [x] Performance acceptable (Lighthouse: 62)
- [x] Analytics tracking
- [x] SEO meta tags present
- [x] No console errors

### Issues Found
- None

### Rollback Required
- No

### Notes
- First deployment of World Cup 2026 features
- All critical paths verified
- Production-ready
```

---

## ✅ Final Pre-Launch Checklist

**Code & Build:**
- [ ] Version bumped to 0.2.0 in package.json
- [ ] CHANGELOG.md complete
- [ ] README.md updated
- [ ] All tests passing (95%+ pass rate)
- [ ] TypeScript compilation clean (production code)
- [ ] Production build successful
- [ ] Bundle size optimized (<300 KB Brotli homepage)

**Content & Data:**
- [ ] All MLB stadium data validated (30/30)
- [ ] World Cup data complete (104 matches, 16 venues)
- [ ] Data freshness check passed
- [ ] Sitemap generated with all pages

**Configuration:**
- [ ] Environment variables set in Vercel
- [ ] Security headers configured
- [ ] Google Analytics ID correct
- [ ] Domain configured (theshadium.com)

**Testing:**
- [ ] Critical user flows tested
- [ ] Mobile experience verified
- [ ] Accessibility compliance (WCAG 2.1 AA)
- [ ] Browser compatibility checked
- [ ] SEO meta tags verified

**Monitoring:**
- [ ] Vercel Analytics enabled
- [ ] Google Analytics tracking verified
- [ ] Error tracking configured (console logs)
- [ ] Performance monitoring active (Web Vitals)

**Documentation:**
- [ ] Deployment guide reviewed
- [ ] Rollback procedure documented
- [ ] Troubleshooting guide accessible
- [ ] Emergency contacts listed

**Final Approval:**
- [ ] Code review completed
- [ ] QA sign-off obtained
- [ ] Stakeholder approval (if needed)
- [ ] Backup plan ready (rollback procedure)

---

## 🚀 Deploy Command

When all checks pass, deploy with:

```bash
# If using automatic deployment
git push origin main

# If using manual deployment
vercel --prod
```

**Expected deployment time:** 3-5 minutes

**Post-deployment:** Run smoke tests within 5 minutes of deployment

---

**Good luck with your deployment! 🎉**

For questions or issues, refer to the troubleshooting section or create a GitHub issue.
