import React from 'react';
import { Metadata } from 'next';
import { WorldCupLandingClient } from './WorldCupLandingClient';

export const metadata: Metadata = {
  title: 'FIFA World Cup 2026 | Find the Best Shaded Seats',
  description: 'Find the best shaded seats at all 16 FIFA World Cup 2026 venues across USA, Mexico, and Canada. Row-level shade analysis for every stadium.',
  keywords: 'World Cup 2026, FIFA, shaded seats, USA, Mexico, Canada, stadium seating, sun exposure',
  openGraph: {
    title: 'FIFA World Cup 2026 - Find Shaded Seats',
    description: 'Discover the best shaded seats at all 16 World Cup venues with our row-level shade analysis',
    type: 'website',
  }
};

export default function WorldCupLandingPage() {
  return <WorldCupLandingClient />;
}
