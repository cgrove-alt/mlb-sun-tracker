import React from 'react';
import { Metadata } from 'next';
import { VenuesPageClient } from './VenuesPageClient';

export const metadata: Metadata = {
  title: 'FIFA World Cup 2026 Venues - All 16 Stadiums | The Shadium',
  description: 'Complete guide to all 16 FIFA World Cup 2026 venues across USA, Mexico, and Canada. Find shaded seats, match schedules, and stadium details for every World Cup venue.',
  keywords: [
    'World Cup 2026 venues',
    'FIFA World Cup stadiums',
    'World Cup USA venues',
    'World Cup Mexico venues',
    'World Cup Canada venues',
    'World Cup 2026 stadiums',
    'shaded seats World Cup',
    'World Cup venue guide'
  ],
  openGraph: {
    title: 'FIFA World Cup 2026 Venues - All 16 Stadiums',
    description: 'Explore all 16 World Cup 2026 venues with complete shade analysis and match schedules',
    type: 'website',
  }
};

export default function WorldCupVenuesPage() {
  return <VenuesPageClient />;
}
