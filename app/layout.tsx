import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import GoogleAnalytics from './GoogleAnalytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://theshadium.com/'),
  title: 'The Shadium - Find the Perfect Shaded Seats at MLB Stadiums',
  description: 'Find the best shaded seats at MLB stadiums. The Shadium analyzes sun exposure, weather conditions, and seating sections to help you avoid the heat and enjoy the game in comfort.',
  keywords: ['MLB', 'baseball', 'stadium', 'sun', 'shade', 'seats', 'weather', 'tickets', 'The Shadium'],
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
    title: 'The Shadium - Find the Perfect Shaded Seats at MLB Stadiums',
    description: 'Find the best shaded seats at MLB stadiums. The Shadium analyzes sun exposure, weather conditions, and seating sections to help you avoid the heat and enjoy the game in comfort.',
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
    title: 'The Shadium - Find the Perfect Shaded Seats at MLB Stadiums',
    description: 'Find the best shaded seats at MLB stadiums. The Shadium analyzes sun exposure, weather conditions, and seating sections to help you avoid the heat and enjoy the game in comfort.',
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