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

const keyMatchSchemas = [
  {
    '@type': 'SportsEvent',
    name: 'FIFA World Cup 2026 Opening Match',
    startDate: '2026-06-11T17:00:00-05:00',
    location: { '@type': 'StadiumOrArena', name: 'Estadio Azteca', address: { '@type': 'PostalAddress', addressLocality: 'Mexico City', addressCountry: 'MX' } },
    sport: 'Soccer',
    eventStatus: 'https://schema.org/EventScheduled'
  },
  {
    '@type': 'SportsEvent',
    name: 'FIFA World Cup 2026 Semifinal 1',
    startDate: '2026-07-14T20:00:00-05:00',
    location: { '@type': 'StadiumOrArena', name: 'AT&T Stadium', address: { '@type': 'PostalAddress', addressLocality: 'Arlington', addressCountry: 'US' } },
    sport: 'Soccer',
    eventStatus: 'https://schema.org/EventScheduled'
  },
  {
    '@type': 'SportsEvent',
    name: 'FIFA World Cup 2026 Semifinal 2',
    startDate: '2026-07-15T20:00:00-04:00',
    location: { '@type': 'StadiumOrArena', name: 'Mercedes-Benz Stadium', address: { '@type': 'PostalAddress', addressLocality: 'Atlanta', addressCountry: 'US' } },
    sport: 'Soccer',
    eventStatus: 'https://schema.org/EventScheduled'
  },
  {
    '@type': 'SportsEvent',
    name: 'FIFA World Cup 2026 Third Place Match',
    startDate: '2026-07-18T17:00:00-04:00',
    location: { '@type': 'StadiumOrArena', name: 'Hard Rock Stadium', address: { '@type': 'PostalAddress', addressLocality: 'Miami Gardens', addressCountry: 'US' } },
    sport: 'Soccer',
    eventStatus: 'https://schema.org/EventScheduled'
  },
  {
    '@type': 'SportsEvent',
    name: 'FIFA World Cup 2026 Final',
    startDate: '2026-07-19T15:00:00-04:00',
    location: { '@type': 'StadiumOrArena', name: 'MetLife Stadium', address: { '@type': 'PostalAddress', addressLocality: 'East Rutherford', addressCountry: 'US' } },
    sport: 'Soccer',
    eventStatus: 'https://schema.org/EventScheduled'
  }
];

export default function WorldCupSchedulePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': keyMatchSchemas
          })
        }}
      />
      <WorldCupScheduleClient />
    </>
  );
}
