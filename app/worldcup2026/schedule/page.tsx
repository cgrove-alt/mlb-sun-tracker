import React from 'react';
import { Metadata } from 'next';
import { WorldCupScheduleClient } from './WorldCupScheduleClient';

export const metadata: Metadata = {
  title: 'FIFA World Cup 2026 Schedule | Find Shaded Seats',
  description: 'Complete schedule of all 104 FIFA World Cup 2026 matches across USA, Mexico, and Canada. Find the best shaded seats for every match.',
  keywords: 'World Cup 2026, FIFA, schedule, matches, USA, Mexico, Canada, shaded seats',
  openGraph: {
    title: 'FIFA World Cup 2026 Schedule',
    description: 'View all 104 World Cup matches and find shaded seats at every venue',
    type: 'website',
  }
};

export default function WorldCupSchedulePage() {
  return <WorldCupScheduleClient />;
}
