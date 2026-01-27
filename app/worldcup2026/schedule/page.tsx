import React from 'react';
import { Metadata } from 'next';
import { WorldCupScheduleClient } from './WorldCupScheduleClient';

export const metadata: Metadata = {
  title: 'FIFA World Cup 2026 Match Schedule - All 104 Games | Find Shaded Seats',
  description: 'Complete schedule of all 104 FIFA World Cup 2026 matches across 16 venues in USA, Mexico, and Canada. Filter by round, country, venue, and date. Find the best shaded seats for every match from group stage to the final.',
  keywords: [
    'World Cup 2026 schedule',
    'FIFA World Cup matches',
    'World Cup 2026 fixtures',
    'World Cup match times',
    'World Cup group stage',
    'World Cup knockout rounds',
    'World Cup final 2026',
    'shaded seats World Cup',
    'World Cup USA matches',
    'World Cup Mexico matches',
    'World Cup Canada matches'
  ],
  alternates: {
    canonical: 'https://theshadium.com/worldcup2026/schedule',
  },
  openGraph: {
    title: 'FIFA World Cup 2026 Match Schedule - All 104 Games',
    description: 'View complete match schedule with dates, times, venues, and countdown timers. Find shaded seats for every World Cup 2026 match.',
    type: 'website',
    url: 'https://theshadium.com/worldcup2026/schedule',
    siteName: 'TheShadium',
    images: [
      {
        url: 'https://theshadium.com/worldcup-2026-schedule-og.jpg',
        width: 1200,
        height: 630,
        alt: 'FIFA World Cup 2026 Match Schedule with Shaded Seats Finder'
      }
    ],
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FIFA World Cup 2026 Match Schedule - All 104 Games',
    description: 'Complete schedule with countdown timers and shade finder for every match. Filter by round, venue, or country.',
    images: ['https://theshadium.com/worldcup-2026-schedule-twitter.jpg']
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

export default function WorldCupSchedulePage() {
  return <WorldCupScheduleClient />;
}
