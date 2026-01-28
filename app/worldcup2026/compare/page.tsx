import { Metadata } from 'next';
import { ComparePageClient } from './ComparePageClient';

export const metadata: Metadata = {
  title: 'Compare World Cup 2026 Venues - Stadium Comparison Tool | The Shadium',
  description: 'Compare up to 4 FIFA World Cup 2026 venues side-by-side. Analyze capacity, shade conditions, climate zones, travel distances, and packing tips. Plan your perfect multi-match World Cup experience across USA, Mexico, and Canada.',
  keywords: [
    'world cup 2026 venue comparison',
    'compare World Cup stadiums',
    'FIFA World Cup venues',
    'stadium comparison tool',
    'World Cup travel planning',
    'multi-match World Cup',
    'best World Cup venues',
    'World Cup stadium guide',
    'shaded seats comparison',
    'World Cup climate guide'
  ],
  alternates: {
    canonical: 'https://theshadium.com/worldcup2026/compare',
  },
  openGraph: {
    title: 'Compare World Cup 2026 Venues - Stadium Comparison Tool',
    description: 'Compare FIFA World Cup 2026 stadiums side-by-side with capacity, shade scores, climate zones, and travel distances. Perfect for planning multi-match trips.',
    type: 'website',
    url: 'https://theshadium.com/worldcup2026/compare',
    siteName: 'TheShadium',
    images: [
      {
        url: 'https://theshadium.com/worldcup-2026-compare-og.jpg',
        width: 1200,
        height: 630,
        alt: 'World Cup 2026 Venue Comparison Tool'
      }
    ],
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compare World Cup 2026 Venues',
    description: 'Side-by-side stadium comparison with shade analysis, travel distances, and climate tips for all 16 World Cup venues.',
    images: ['https://theshadium.com/worldcup-2026-compare-twitter.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

export default function ComparePage() {
  return <ComparePageClient />;
}
