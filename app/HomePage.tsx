// Server Component - Statically generated at build time
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import HomepageSchema from './HomepageSchema';
import Link from 'next/link';
import { HeroSection } from '../src/components/HeroSection/HeroSection';
import { HowItWorks } from '../src/components/HowItWorks/HowItWorks';
import { WorldCupShowcase } from '../src/components/WorldCupShowcase/WorldCupShowcase';
import { ShadeFinder } from '../src/components/ShadeFinder/ShadeFinder';
import { TodaysGames } from '../src/components/TodaysGames/TodaysGames';

const POPULAR_STADIUMS = [
  { id: 'yankees', name: 'Yankee Stadium', team: 'NY Yankees' },
  { id: 'dodgers', name: 'Dodger Stadium', team: 'LA Dodgers' },
  { id: 'cubs', name: 'Wrigley Field', team: 'Chicago Cubs' },
  { id: 'redsox', name: 'Fenway Park', team: 'Boston Red Sox' },
  { id: 'giants', name: 'Oracle Park', team: 'SF Giants' },
  { id: 'braves', name: 'Truist Park', team: 'Atlanta Braves' },
];

export default function HomePage() {
  return (
    <>
      <HomepageSchema />
      <main>
        {/* Hero Section — CTA scrolls to #shade-finder */}
        <HeroSection />

        {/* Guided Shade Finder — league → stadium → go */}
        <ShadeFinder />

        {/* Today's Games */}
        <ErrorBoundary level="section">
          <TodaysGames />
        </ErrorBoundary>

        {/* How It Works — educational, below interactive content */}
        <HowItWorks />

        {/* Popular Stadiums */}
        <section style={{ padding: '2rem 1rem', background: '#f8fafc' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1f2937', marginBottom: '1.5rem', textAlign: 'center' }}>
              Popular Stadiums
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
            }}>
              {POPULAR_STADIUMS.map(s => (
                <Link key={s.id} href={`/stadium/${s.id}`} style={{
                  display: 'block', background: 'white', border: '1px solid #e2e8f0',
                  borderRadius: '0.75rem', padding: '1.25rem', textDecoration: 'none',
                  color: 'inherit', transition: 'box-shadow 0.2s',
                }}>
                  <div style={{ fontWeight: 600, fontSize: '1.0625rem', color: '#1f2937' }}>{s.name}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '0.25rem' }}>{s.team}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* World Cup Showcase */}
        <WorldCupShowcase openingMatchDate={new Date('2026-06-11T12:00:00-07:00')} />

        {/* SEO Content — Server rendered */}
        <div className="sr-only">
          <h2>Find Shaded Seats at MLB, MiLB & NFL Stadiums - Are My Seats in the Shade?</h2>
          <p>
            Wondering "are my seats in the shade?" or "are my seats shaded?" at your favorite sports venue?
            The Shadium helps you find the best shaded seats at over 250 stadiums including all 30 MLB ballparks,
            120 MiLB stadiums, and 32 NFL venues. Our real-time sun tracking technology shows you exactly which
            sections will be in the shade during any game time.
          </p>

          <h3>Check If Your Seats Are Shaded at These Popular Venues</h3>
          <ul>
            <li><Link href="/stadium/yankees">Are my seats shaded at Yankee Stadium? (MLB)</Link></li>
            <li><Link href="/stadium/dodgers">Find shaded seats at Dodger Stadium (MLB)</Link></li>
            <li><Link href="/venue/metlife-stadium">Shaded sections at MetLife Stadium (NFL)</Link></li>
            <li><Link href="/venue/las-vegas-ballpark">Las Vegas Ballpark shade finder (MiLB)</Link></li>
            <li><Link href="/venue/sofi-stadium">SoFi Stadium sun exposure guide (NFL)</Link></li>
          </ul>

          <h3>How to Know If Your Seats Are in the Shade</h3>
          <p>
            Simply select your stadium from our database of 250+ MLB, MiLB, and NFL venues and choose your
            game time to see which sections are shaded. Our advanced calculations consider sun angle, stadium
            orientation, roof coverage, and time of day to show you exactly where the shade will be during your game.
          </p>
        </div>

        <PWAInstallPrompt />
      </main>
    </>
  );
}
