# Vercel Deployment Guide for The Shadium

## 🚀 Overview

The Shadium (MLB Sun Tracker) is deployed on Vercel with automatic deployments, custom domain, and optimized performance settings.

**Production URL**: [https://theshadium.com](https://theshadium.com)

## ⚙️ Configuration

### vercel.json

The project includes a `vercel.json` configuration file with:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "env": {
    "NODE_ENV": "production",
    "NEXT_PUBLIC_GA_ID": "G-JXGEKF957C",
    "NEXT_PUBLIC_SITE_URL": "https://theshadium.com"
  },
  "headers": [
    // Security headers and caching rules
  ],
  "rewrites": [
    {
      "source": "/sitemap.xml",
      "destination": "/api/sitemap"
    }
  ],
  "github": {
    "enabled": true,
    "autoAlias": true
  }
}
```

## 📝 Environment Variables

### Production Environment

Set in `vercel.json`:
- `NODE_ENV`: "production"
- `NEXT_PUBLIC_GA_ID`: "G-JXGEKF957C" (Google Analytics)
- `NEXT_PUBLIC_SITE_URL`: "https://theshadium.com"

### Additional Variables (Optional)

You can add these through Vercel Dashboard:
- `DATABASE_URL`: For future database integration
- `API_KEY`: For external API authentication
- `SENTRY_DSN`: For error tracking

## 🔄 Deployment Process

### Automatic Deployments

1. **Production**: Push to `main` branch
2. **Preview**: Create pull request
3. **Rollback**: Use Vercel dashboard

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Deploy with specific settings
vercel --build-env NODE_ENV=production --prod
```

## 🌐 Custom Domain Setup

### Current Configuration

- **Primary Domain**: theshadium.com
- **SSL Certificate**: Automatic (Let's Encrypt)
- **DNS Provider**: Managed through domain registrar

### Adding/Changing Domains

1. Go to Vercel Dashboard → Settings → Domains
2. Add your domain (e.g., `www.theshadium.com`)
3. Update DNS records:
   - **A Record**: 76.76.21.21
   - **CNAME**: cname.vercel-dns.com
4. SSL certificate auto-provisions

## 🚦 Build & Optimization

### Build Settings

```bash
# Build command (in vercel.json)
npm run build

# This runs:
1. Generate sitemap: node scripts/generate-sitemap.js
2. Next.js build: next build
3. Compress assets: node scripts/compress-build.js
```

### Performance Features

- **Edge Network**: Global CDN distribution
- **Image Optimization**: Automatic Next.js image optimization
- **Code Splitting**: Automatic route-based splitting
- **Caching Headers**: Configured for static assets
- **Compression**: Brotli compression enabled

## 📊 Monitoring & Analytics

### Vercel Analytics

- Real-time performance metrics
- Web Vitals tracking
- Error monitoring

### Google Analytics

Configured with ID: `G-JXGEKF957C`
- Page views
- User interactions
- Custom events

## 🛡️ Security Headers

Configured in `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-DNS-Prefetch-Control",
          "value": "on"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=(self)"
        }
      ]
    }
  ]
}
```

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check build logs
   vercel logs
   
   # Clear cache and rebuild
   vercel --force
   ```

2. **Environment Variables Not Working**
   - Ensure prefixed with `NEXT_PUBLIC_` for client-side
   - Rebuild after changing variables
   - Check Vercel dashboard for correct values

3. **Domain Not Resolving**
   - Verify DNS propagation (24-48 hours)
   - Check DNSSEC settings
   - Ensure no conflicting records

4. **Performance Issues**
   - Check Vercel Analytics
   - Review bundle size
   - Optimize images and code splitting

### Debug Commands

```bash
# View deployment logs
vercel logs [deployment-url]

# Check project settings
vercel inspect

# List deployments
vercel ls

# Remove deployment
vercel rm [deployment-url]
```

## 🔄 CI/CD Integration

### GitHub Integration

Enabled in `vercel.json`:
```json
{
  "github": {
    "enabled": true,
    "autoAlias": true
  }
}
```

Features:
- Automatic preview deployments for PRs
- Deployment status checks
- Branch protection rules
- Comment notifications

### Deployment Workflow

1. Create feature branch
2. Push changes
3. Open pull request → Preview deployment
4. Merge to main → Production deployment
5. Automatic rollback on failures

## 📈 Scaling & Performance

### Current Setup

- **Region**: Auto (Global Edge Network)
- **Functions**: Node.js 20.x
- **Memory**: 1024 MB
- **Timeout**: 10 seconds

### Optimization Tips

1. **Enable ISR (Incremental Static Regeneration)**
   ```javascript
   export const revalidate = 3600; // Revalidate every hour
   ```

2. **Use Edge Functions**
   ```javascript
   export const runtime = 'edge';
   ```

3. **Optimize Images**
   - Use Next.js Image component
   - Serve WebP format
   - Implement lazy loading

## 🆘 Support & Resources

### Vercel Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)

### Project-Specific
- Repository: [GitHub Repository](https://github.com/your-username/mlb-sun-tracker)
- Issues: Report bugs in GitHub Issues
- Support: Contact through Vercel Dashboard

## 🔄 Migration from Render

If you're migrating from Render, here's what changed:

### Removed
- `render.yaml` configuration file
- Render-specific environment variables
- Render build hooks

### Added
- `vercel.json` configuration
- Vercel GitHub integration
- Automatic preview deployments
- Edge network distribution

### Updated
- Environment variables now in `vercel.json`
- Domain configuration through Vercel
- Deployment commands use Vercel CLI
- Analytics integrated with Vercel

## 📋 Deployment Checklist

Before deploying:
- [ ] Update version in `package.json`
- [ ] Run tests locally: `npm test`
- [ ] Check accessibility: `npm run test:a11y:local`
- [ ] Verify build: `npm run build`
- [ ] Review environment variables
- [ ] Test on preview deployment
- [ ] Update documentation if needed
- [ ] Run data validation: `npm run validate-stadium-data`
- [ ] Check data freshness: `npm run check-data-freshness`

## 🚀 Quick Deploy

```bash
# One-command deployment to production
npm run build && vercel --prod
```

## 📖 Complete Deployment Guide

For comprehensive deployment instructions, troubleshooting, and post-deployment verification, see:

**[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**

This guide includes:
- Pre-deployment checklist with all quality checks
- Detailed smoke tests for critical user flows
- Performance verification procedures
- Rollback procedures
- Monitoring setup
- Security checklist
- Post-launch tasks and success metrics

---

*Last Updated: January 2026*
*Version: 0.2.0*
*Deployed at [theshadium.com](https://theshadium.com)*