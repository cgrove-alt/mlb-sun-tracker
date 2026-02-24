# The Shadium - Find Shaded Seats at Every Stadium

## 🌞 The Most Accurate Stadium Shade Finder

Live at [theshadium.com](https://theshadium.com)

**Version 0.2.0** - World Cup 2026 Ready

The Shadium is the most comprehensive web application for finding shaded seating at sports stadiums. We provide row-level sun calculations for MLB, MiLB, NFL, and World Cup 2026 venues. Built with Next.js and deployed on Vercel.

## 🚀 Features

### Core Features
- **Row-Level Sun Analysis**: Precise shade calculations for every row in every section
- **3D Shade Calculator**: Advanced WebGL-powered visualizations with IndexedDB caching
- **Interactive Stadium Diagrams**: Click sections on SVG stadium maps to view shade data
- **Section Comparison**: Compare 2-4 sections side-by-side with winner badges
- **Filter Presets**: One-click filters (Maximum Shade, Budget Friendly, Close & Shaded, Accessible)
- **Inning-by-Inning Timeline**: See shade changes throughout the game

### World Cup 2026 Features
- **104 Complete Matches**: Full schedule with live countdown timers
- **16 Venue Pages**: Detailed venue information with climate guidance
- **Venue Comparison Tool**: Compare up to 4 venues with distance calculations
- **Country-Specific Features**: USA, Mexico, and Canada climate warnings
- **Smart Shade Finder Links**: Pre-filled venue/date/time from match cards
- **Multi-Timezone Support**: 7 timezones with DST handling

### Data Quality & Transparency
- **Data Freshness Tracking**: See when stadium data was last updated
- **Report Inaccuracy Feature**: User feedback system with Airtable integration
- **Analytics Dashboard**: Admin portal for monitoring data quality (/admin/data-quality)

### Mobile & Accessibility
- **Mobile-First Design**: Virtual scrolling, swipe gestures, ≥44px touch targets
- **WCAG 2.1 AA Compliant**: Full keyboard navigation and screen reader support
- **PWA Support**: Install as an app with offline capabilities
- **Pull-to-Refresh**: Native mobile refresh gestures

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.7 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.4.17 + CSS Modules
- **3D Graphics**: Three.js 0.178.0 with WebGL
- **Deployment**: Vercel with automatic CI/CD
- **Analytics**: Google Analytics 4 + Web Vitals monitoring
- **Testing**: Jest 30.1.3 + Playwright 1.55.0
- **Caching**: IndexedDB for 3D calculations
- **Icons**: Lucide React 0.563.0

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## 🧪 Testing

```bash
# Unit tests with coverage
npm run test:unit

# Watch mode for development
npm run test:watch

# All unit tests
npm test

# E2E tests
npm run test:e2e

# Accessibility tests
npm run test:a11y:local

# Visual regression tests
npm run test:visual:local

# All local tests (a11y + visual)
npm run test:local

# Playwright UI mode
npm run test:ui

# Debug mode
npm run test:debug
```

### Test Coverage
- **Total Tests:** 1,287 automated tests
- **Pass Rate:** 95% (1,218 passing)
- **Data Integrity:** 476 tests (100% pass)
- **API Routes:** 47 tests (100% pass)
- **Utilities:** 695 tests (100% pass)

## 🚢 Deployment

The application is deployed on Vercel with automatic deployments from the main branch.

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel
```

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for detailed deployment instructions.

## 📊 Stadium Coverage

### MLB (100%)
- **30/30 stadiums** with row-level data
- **27/30 stadiums** with 3D shade calculator
- **1,950 sections** validated
- **282 obstructions** documented

### MiLB (25%)
- **30/120 stadiums** with enhanced data
- Top venues by attendance
- Row-level data for Tier 1 stadiums

### World Cup 2026 (100%)
- **16/16 venues** (USA, Mexico, Canada)
- **104/104 matches** with countdown timers
- Full timezone support (7 zones)

## 📄 Documentation

- [Changelog](CHANGELOG.md) - Version history and release notes
- [Vercel Deployment Guide](VERCEL_DEPLOYMENT.md) - Production deployment instructions
- [SEO Optimization Guide](SEO_GUIDE.md) - SEO best practices
- [Security Checklist](SECURITY_CHECKLIST.md) - Security guidelines

### Data & Validation
- [Data Validation Script](scripts/validate-stadium-data.ts)
- [Data Freshness Check](scripts/check-data-freshness.ts)
- [Sitemap Generator](scripts/generate-sitemap.js)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software. All rights reserved.

## ⚡ Performance

- **Homepage Bundle:** 105 KB Brotli (65% below 300 KB target)
- **3D Calculations:** 22ms average (99% better than target)
- **Stadium Diagram:** <100ms rendering (5x better than target)
- **Lighthouse Score:** 62/100 (+32% improvement)
- **Core Web Vitals:**
  - LCP: 5.8s (26% improvement)
  - FCP: 1.7s (37% improvement)
  - CLS: 0 (perfect)
  - Speed Index: 2.1s (68% improvement)

## 🔧 Commands

```bash
# Development
npm run dev                    # Start development server
npm run build                  # Build for production
npm start                      # Start production server

# Code Quality
npm run lint                   # Run ESLint
npm run type-check             # TypeScript compilation check

# Data Validation
npm run validate-stadium-data  # Validate all stadium data
npm run check-data-freshness   # Check data update timestamps

# Sitemap
npm run generate-sitemap       # Generate sitemap.xml

# Compression
npm run postbuild              # Compress build assets (runs after build)
```

## 🙏 Acknowledgments

- Sun position calculations powered by SunCalc
- 3D visualizations with Three.js
- Stadium data compiled from official sources and research
- World Cup 2026 data from FIFA official sources
- Built with Claude Code

---

*Deployed with Vercel* • *Live at [theshadium.com](https://theshadium.com)* • *Version 0.2.0*