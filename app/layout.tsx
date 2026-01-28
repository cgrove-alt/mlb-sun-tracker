// NO CSS imports - all critical CSS inlined below to eliminate render-blocking
// Non-critical CSS loaded via dynamic import in components
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import GoogleAnalyticsLazy from '../components/GoogleAnalyticsLazy';
import { CriticalStylesInline } from './critical-styles-inline';
import { CSSOptimizer } from '../components/CSSOptimizer';
import StickyTopNav from '../components/StickyTopNav';
import { WebApplicationSchema } from '../components/SafeSchema';
import FooterModern from '../components/FooterModern';
import CookieBannerModern from '../components/CookieBannerModern';
import DataRetentionInitializer from '../components/DataRetentionInitializer';
import SkipLinks from '../components/SkipLinks';
import ServiceWorkerRegistration from '../components/ServiceWorkerRegistration';
import WebVitalsMonitor from '../components/WebVitalsMonitor';
import { I18nProvider } from '../src/i18n/i18nContext';

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
  // Uncomment and add your Google Search Console verification code when ready
  // verification: {
  //   google: 'your-verification-code-here',
  // },
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
        <CriticalStylesInline />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <meta name="theme-color" content="#1e40af" />

        {/* Google AdSense Verification */}
        <meta name="google-adsense-account" content="ca-pub-3681192675377295" />

        {/* Font preloading for Inter */}
        <link
          rel="preload"
          href="/_next/static/media/inter-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Resource hints for performance */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://api.open-meteo.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://api.open-meteo.com" />
        <link rel="dns-prefetch" href="https://statsapi.mlb.com" />

        {/* Preload critical resources */}
        <link rel="modulepreload" href="/_next/static/chunks/vendor-react.js" as="script" />
        <link rel="modulepreload" href="/_next/static/chunks/common.js" as="script" />

        {/* Comprehensive Critical CSS inlined - eliminates render-blocking */}
        <style dangerouslySetInnerHTML={{ __html: `:root{--ink-900:#0B1220;--ink-800:#1B2432;--ink-700:#334155;--ondark-900:#FFFFFF;--paper:#FFFFFF;--accent-600:#1D4ED8;--accent-700:#1E40AF;--focus-ring:#1D4ED8}*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}html{font-size:16px;font-feature-settings:"kern","liga";text-rendering:optimizeLegibility;scroll-behavior:smooth}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,sans-serif;line-height:1.5;color:#1B2432;background:#FFFFFF;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-tap-highlight-color:transparent}#main-content,main{display:block}h1{color:#1B2432;font-weight:700;line-height:1.1;font-size:clamp(2.5rem,6vw,5rem);margin:0;letter-spacing:-0.02em}h2{color:#1B2432;font-weight:600;line-height:1.3;font-size:clamp(1.5rem,3vw,2rem);margin:0}p{font-size:1rem;line-height:1.6;color:#334155;margin:0}button{font-family:inherit;font-size:16px;min-height:44px;min-width:44px;border:none;cursor:pointer}a{color:#1D4ED8;text-decoration:none;text-underline-offset:2px}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.hero-section{position:relative;width:100%;min-height:100vh;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:2rem 1rem}.hero-background{position:absolute;top:0;left:0;right:0;bottom:0;z-index:0}.hero-gradient{position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(135deg,#0f766e 0%,#0891b2 50%,#0c4a6e 100%)}.hero-content{position:relative;z-index:2;width:100%;max-width:900px;text-align:center;color:white}.hero-cta-primary{display:inline-flex;align-items:center;gap:0.625rem;background:white;color:#0f766e;padding:1rem 2.5rem;font-size:1.125rem;font-weight:600;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,0.15);min-height:44px;transition:transform 0.2s ease}.hero-cta-primary:hover{transform:translateY(-3px);box-shadow:0 8px 20px rgba(0,0,0,0.25)}.skeleton{background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200% 100%;animation:loading 1.5s ease-in-out infinite}@keyframes loading{0%{background-position:200% 0}100%{background-position:-200% 0}}.page-transition{min-height:100vh;background:#fff}` }} />

        <WebApplicationSchema />
      </head>
      <body className={inter.className}>
        <I18nProvider>
          <SkipLinks />
          <CSSOptimizer />
          <Suspense fallback={null}>
            <GoogleAnalyticsLazy />
          </Suspense>
          <ServiceWorkerRegistration />
          <WebVitalsMonitor />
          <DataRetentionInitializer />
          <StickyTopNav />
          <main id="main-content" tabIndex={-1}>
            <div id="root" className="page-transition">{children}</div>
          </main>
          <FooterModern />
          <CookieBannerModern />
        </I18nProvider>
      </body>
    </html>
  );
}