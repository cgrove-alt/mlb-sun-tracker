import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import GoogleAnalytics from './GoogleAnalytics';
import { CriticalStyles } from './critical-styles';
import { CSSOptimizer } from '../components/CSSOptimizer';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Improve font loading
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://theshadium.com/'),
  title: 'The Shadium - Find Seats in the Shade at MLB Stadiums | Avoid Sun Exposure',
  description: 'Find seats in the shade at any MLB stadium. The Shadium helps you locate shaded seating sections, avoid sun exposure, and stay cool during baseball games. Real-time sun tracking for all 30 MLB ballparks.',
  keywords: ['seats in the shade', 'shaded seats', 'MLB stadium shade', 'baseball shade seating', 'avoid sun at stadium', 'shadium', 'shady seats', 'stadium sun exposure', 'cool seats baseball', 'shade finder', 'MLB sun tracker', 'baseball game shade', 'stadium shade map', 'where to sit in shade', 'best shaded seats'],
  authors: [{ name: 'The Shadium Team' }],
  creator: 'The Shadium',
  publisher: 'The Shadium',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'The Shadium',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://theshadium.com/',
    title: 'The Shadium - Find Seats in the Shade at MLB Stadiums',
    description: 'Find seats in the shade at any MLB stadium. Real-time sun tracking helps you avoid sun exposure and stay cool. Shade maps for all 30 MLB ballparks.',
    siteName: 'The Shadium',
    images: [
      {
        url: 'https://theshadium.com/logo512.png',
        width: 512,
        height: 512,
        alt: 'The Shadium Logo',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Shadium - Find Seats in the Shade at MLB Stadiums',
    description: 'Find seats in the shade at any MLB stadium. Real-time sun tracking helps you avoid sun exposure and stay cool during baseball games.',
    images: ['https://theshadium.com/logo512.png'],
    creator: '@theshadium',
    site: '@theshadium',
  },
  alternates: {
    canonical: 'https://theshadium.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-actual-google-verification-code', // Replace with your actual code
  },
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: '#2196f3',
    viewportFit: 'cover',
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <CriticalStyles />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <meta name="theme-color" content="#2196f3" />
        
        {/* Critical CSS will be preloaded dynamically by CSSOptimizer */}
        
        {/* Resource hints for performance */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://api.open-meteo.com" />
        <link rel="dns-prefetch" href="https://statsapi.mlb.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "The Shadium",
              "alternateName": "Shadium MLB Shade Finder",
              "description": "Find seats in the shade at any MLB stadium. Real-time sun tracking and shade calculations for all 30 MLB ballparks.",
              "url": "https://theshadium.com",
              "applicationCategory": "SportsApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "The Shadium",
                "url": "https://theshadium.com"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "256"
              },
              "featureList": [
                "Real-time sun tracking",
                "Shade calculations for all MLB stadiums",
                "Section-by-section shade analysis",
                "Weather integration",
                "Mobile-friendly interface",
                "30 MLB stadium coverage"
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How does The Shadium calculate shade in stadiums?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The Shadium uses real-time sun position calculations based on stadium location, date, and time to determine which sections will be in shade during the game."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is The Shadium free to use?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, The Shadium is completely free to use for finding shaded seats at MLB stadiums."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Which MLB stadiums are covered?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The Shadium covers all 30 MLB stadiums with detailed shade analysis for every section."
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <GoogleAnalytics />
        <CSSOptimizer />
        <div id="root">{children}</div>
      </body>
    </html>
  );
}