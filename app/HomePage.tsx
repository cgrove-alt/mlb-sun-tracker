'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import LoadingSpinner from '../components/LoadingSpinner';
import HomepageSchema from './HomepageSchema';
import Link from 'next/link';

// Use the full App component
const App = dynamic(() => import('../src/App'), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

export default function HomePage() {
  return (
    <>
      <HomepageSchema />
      <main>
        {/* SEO-optimized content section */}
        <div className="sr-only">
          <h1>Find Shaded Seats at MLB Stadiums - Are My Seats in the Shade?</h1>
          <p>
            Wondering "are my seats in the shade?" or "are my seats shaded?" at your favorite MLB stadium? 
            The Shadium helps you find the best shaded seats at all 30 MLB ballparks. Our real-time sun 
            tracking technology shows you exactly which sections will be in the shade during any game time.
          </p>
          
          <h2>Check If Your Seats Are Shaded at These MLB Stadiums</h2>
          <ul>
            <li><Link href="/stadium/yankees">Are my seats shaded at Yankee Stadium?</Link></li>
            <li><Link href="/stadium/dodgers">Find shaded seats at Dodger Stadium</Link></li>
            <li><Link href="/stadium/redsox">Shaded sections at Fenway Park</Link></li>
            <li><Link href="/stadium/cubs">Are my Wrigley Field seats in the shade?</Link></li>
            <li><Link href="/stadium/giants">Shaded seats at Oracle Park San Francisco</Link></li>
          </ul>
          
          <h2>How to Know If Your Seats Are in the Shade</h2>
          <p>
            Simply select your stadium and game time to see which sections are shaded. Our advanced 
            calculations consider sun angle, stadium orientation, roof coverage, and time of day to 
            show you exactly where the shade will be during your game.
          </p>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <App />
        </Suspense>
        <PWAInstallPrompt />
      </main>
    </>
  );
}