import { Metadata } from 'next';
import { ComparePageClient } from './ComparePageClient';

export const metadata: Metadata = {
  title: 'Compare World Cup 2026 Venues | Stadium Comparison Tool',
  description: 'Compare up to 4 FIFA World Cup 2026 venues side-by-side. Analyze capacity, shade conditions, travel distances, and more to plan your perfect World Cup experience.',
  keywords: [
    'world cup 2026',
    'stadium comparison',
    'venue comparison',
    'world cup venues',
    'fifa world cup',
    'stadium finder',
    'travel planning',
    'world cup travel',
  ],
  openGraph: {
    title: 'Compare World Cup 2026 Venues',
    description: 'Compare FIFA World Cup 2026 stadiums side-by-side with detailed metrics and travel information.',
    type: 'website',
  },
};

export default function ComparePage() {
  return <ComparePageClient />;
}
