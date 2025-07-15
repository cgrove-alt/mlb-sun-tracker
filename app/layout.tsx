import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://cgrove-alt.github.io/mlb-sun-tracker/'),
  title: 'MLB Stadium Sun Tracker',
  description: 'Find out which seats will be in the sun during baseball games',
  keywords: ['MLB', 'baseball', 'stadium', 'sun', 'seats', 'weather', 'tickets'],
  authors: [{ name: 'MLB Sun Tracker Team' }],
  creator: 'MLB Sun Tracker',
  publisher: 'MLB Sun Tracker',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/mlb-sun-tracker/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MLB Sun Tracker',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cgrove-alt.github.io/mlb-sun-tracker/',
    title: 'MLB Stadium Sun Tracker',
    description: 'Find out which seats will be in the sun during baseball games',
    siteName: 'MLB Stadium Sun Tracker',
    images: [
      {
        url: '/mlb-sun-tracker/logo512.png',
        width: 512,
        height: 512,
        alt: 'MLB Stadium Sun Tracker Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MLB Stadium Sun Tracker',
    description: 'Find out which seats will be in the sun during baseball games',
    images: ['/mlb-sun-tracker/logo512.png'],
  },
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    themeColor: '#1a237e',
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
        <link rel="icon" href="/mlb-sun-tracker/favicon.ico" />
        <link rel="apple-touch-icon" href="/mlb-sun-tracker/logo192.png" />
        <meta name="theme-color" content="#1a237e" />
      </head>
      <body className={inter.className}>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}