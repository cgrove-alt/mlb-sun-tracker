import '../src/styles/base.css'; // Import tokens and base styles first
import './globals.css';
import '../src/styles/typography.css';
import '../src/styles/heading-safety.css';
import '../src/styles/vertical-rhythm.css';
import '../src/styles/mobile-optimizations.css';
import '../src/styles/accessibility-fixes.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
// import GoogleAnalytics from './GoogleAnalytics';
// import GoogleAnalyticsClient from './GoogleAnalyticsClient';
// import GoogleAnalyticsOptimized from './GoogleAnalyticsOptimized';
import GoogleAnalyticsLazy from '../components/GoogleAnalyticsLazy';
import { CriticalStyles } from './critical-styles';
import { CriticalStylesInline } from './critical-styles-inline';
import { CSSOptimizer } from '../components/CSSOptimizer';
import StickyTopNav from '../components/StickyTopNav';
import { WebApplicationSchema } from '../components/SafeSchema';
import FooterModern from '../components/FooterModern';
import CookieBannerModern from '../components/CookieBannerModern';
import DataRetentionInitializer from '../components/DataRetentionInitializer';
import SkipLinks from '../components/SkipLinks';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Improve font loading - prevents invisible text during font load
  preload: true,
  adjustFontFallback: true, // Reduces layout shift
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://theshadium.com/'),
  title: 'The Shadium - Find Seats in the Shade at MLB, MiLB & NFL Stadiums | Avoid Sun Exposure',
  description: 'Find seats in the shade at any MLB, MiLB, or NFL stadium. The Shadium helps you locate shaded seating sections, avoid sun exposure, and stay cool during games. Real-time sun tracking for 250+ sports venues including all 30 MLB ballparks, 120 MiLB stadiums, and 32 NFL venues.',
  keywords: [
    // Primary queries
    'are my seats in the shade',
    'are my seats shaded',
    'shaded seats at',
    'seats in the shade',
    'shaded seats',
    'MLB stadium shade',
    'MiLB stadium shade',
    'NFL stadium shade',
    'baseball shade seating',
    'football stadium sun',
    
    // Question-based queries
    'will my seats be in the sun',
    'which seats are shaded',
    'where are shaded seats',
    'how to find shaded seats',
    'best seats to avoid sun',
    
    // Stadium-specific
    'yankee stadium shaded seats',
    'dodger stadium shade',
    'fenway park shaded sections',
    'wrigley field sun exposure',
    
    // General terms
    'avoid sun at stadium',
    'shadium',
    'shady seats',
    'stadium sun exposure',
    'cool seats baseball',
    'shade finder',
    'MLB sun tracker',
    'baseball game shade',
    'stadium shade map',
    'where to sit in shade',
    'best shaded seats',
    'covered seats MLB',
    'stadium sun map',
    'day game shade'
  ],
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
    canonical: 'https://theshadium.com/',
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
        <CriticalStylesInline />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <meta name="theme-color" content="#1e40af" />
        
        {/* Google AdSense Verification */}
        <meta name="google-adsense-account" content="ca-pub-3681192675377295" />
        
        {/* Resource hints for performance */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://api.open-meteo.com" />
        <link rel="dns-prefetch" href="https://statsapi.mlb.com" />
        <WebApplicationSchema />
      </head>
      <body className={inter.className}>
        <SkipLinks />
        <CSSOptimizer />
        <Suspense fallback={null}>
          <GoogleAnalyticsLazy />
        </Suspense>
        <DataRetentionInitializer />
        <StickyTopNav />
        <main id="main-content" tabIndex={-1}>
          <div id="root">{children}</div>
        </main>
        <FooterModern />
        <CookieBannerModern />
      </body>
    </html>
  );
}