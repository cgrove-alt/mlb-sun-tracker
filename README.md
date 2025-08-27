# MLB Stadium Sun Tracker - The Shadium

## 🌞 Find the Best Shaded Seats at Every Stadium

Live at [theshadium.com](https://theshadium.com)

A comprehensive web application for finding shaded seating at MLB, NFL, and MiLB stadiums. Built with Next.js and deployed on Vercel.

## 🚀 Features

- **Stadium Sun Analysis**: Real-time sun position calculations for all major stadiums
- **Shaded Seating Recommendations**: Find the best shaded seats based on game time and date
- **Multi-League Support**: Coverage for MLB, NFL, and MiLB venues
- **Interactive 3D Visualizations**: WebGL-powered stadium views
- **Mobile-First Design**: Fully responsive with touch-optimized interfaces
- **PWA Support**: Install as an app with offline capabilities

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.0 with App Router
- **Language**: TypeScript
- **Styling**: CSS Modules
- **3D Graphics**: Three.js with WebGL
- **Deployment**: Vercel
- **Analytics**: Google Analytics 4

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
# Run accessibility tests locally
npm run test:a11y:local

# Run visual regression tests locally
npm run test:visual:local

# Run all tests
npm test
```

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

## 📄 Documentation

- [Vercel Deployment Guide](VERCEL_DEPLOYMENT.md)
- [SEO Optimization Guide](SEO_GUIDE.md)
- [Venue System Documentation](VENUE_SYSTEM.md)
- [Security Checklist](SECURITY_CHECKLIST.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software. All rights reserved.

## 🙏 Acknowledgments

- Sun position calculations powered by SunCalc
- Weather data from Open-Meteo API
- Stadium data compiled from official sources

---

*Deployed with Vercel* • *Live at [theshadium.com](https://theshadium.com)*