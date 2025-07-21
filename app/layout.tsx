import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import GoogleAnalytics from './GoogleAnalytics';

const inter = Inter({ subsets: ['latin'] });

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
        url: '/logo512.png',
        width: 512,
        height: 512,
        alt: 'The Shadium Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Shadium - Find Seats in the Shade at MLB Stadiums',
    description: 'Find seats in the shade at any MLB stadium. Real-time sun tracking helps you avoid sun exposure and stay cool during baseball games.',
    images: ['/logo512.png'],
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
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <meta name="theme-color" content="#2196f3" />
      </head>
      <body className={inter.className}>
        <GoogleAnalytics />
        <div id="root">{children}</div>
      </body>
    </html>
  );
}