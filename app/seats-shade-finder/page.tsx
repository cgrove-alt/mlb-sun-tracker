import { Metadata } from 'next';
import { VENUE_COUNT } from '../../src/data/venueCount';
import Link from 'next/link';
import { MLB_STADIUMS } from '../../src/data/stadiums';
import FullFinder from './FullFinder';

export const metadata: Metadata = {
  title: 'Are My Seats in the Shade? MLB, MiLB & NFL Stadium Shade Finder | The Shadium',
  description: `Check sun and shade by game time at ${VENUE_COUNT} MLB, minor league and NFL stadiums.`,
  keywords: [
    'are my seats in the shade',
    'are my seats shaded',
    'check if seats are shaded',
    'stadium shade finder',
    'shaded seats checker',
    'MLB seat shade lookup',
    'NFL stadium shade',
    'MiLB shaded seats',
    'find shaded seats',
    'shade seat finder'
  ],
  alternates: {
    canonical: 'https://theshadium.com/seats-shade-finder',
  },
};

export default function SeatsShadeFinderPage() {
  return (
    <div className="min-h-screen bg-paper-soft">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <nav className="flex flex-wrap items-center gap-3 text-sm text-ink-700 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:underline">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Shade Finder</span>
        </nav>
        
        <div className="flex min-w-0 items-center justify-between py-4 mb-6">
          <div className="min-w-0">
            <h1 className="text-balance font-semibold text-ink-800 text-[clamp(1.75rem,2vw+1rem,2.5rem)] truncate md:whitespace-normal">
              Are My Seats in the Shade?
            </h1>
          </div>
        </div>
        
        <div className="rounded-xl border bg-white p-4 md:p-5 shadow-sm mb-8 overflow-hidden stack">
          <p className="text-lg text-ink-700 max-w-prose">
            For MLB games, pick your ballpark below to see every section in sun or shade, inning by
            inning. For NFL and minor league games, use the finder with your game&apos;s date and time.
            We don&apos;t have seating maps for minor league parks, so there it says which side shades
            first.
          </p>
        </div>

        <section className="mb-12" aria-labelledby="full-finder-title">
          <h2 id="full-finder-title" className="h2 text-gray-900 mb-4 break-words md:break-normal">
            NFL and Minor League Stadiums
          </h2>
          <FullFinder />
        </section>

        <section className="mb-12">
          <h2 className="h2 text-gray-900 mb-6 break-words md:break-normal">
            MLB Ballparks: Shade by Game
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {MLB_STADIUMS.map((stadium) => (
              <Link
                key={stadium.id}
                href={`/stadium/${stadium.id}`}
                className="block rounded-xl border bg-white p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-blue-600 mb-1">
                  {stadium.name}
                </h3>
                <p className="text-sm text-ink-700">
                  {stadium.team} • {stadium.city}
                </p>
                <span className="inline-block text-sm font-semibold text-white bg-orange-700 hover:bg-orange-800 px-3 py-1 rounded mt-2 transition-colors">
                  See shade by game →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-xl border bg-white p-4 md:p-5 shadow-sm mb-8 overflow-hidden prose prose-slate max-w-prose">
          <h2 className="h2 text-gray-900 mb-4 break-words md:break-normal">
            How to Find Out If Your Seats Are Shaded
          </h2>
          
          <ol className="space-y-4 text-ink-700">
            <li className="flex">
              <span className="font-bold text-blue-600 mr-3">1.</span>
              <div>
                <strong>Pick your stadium:</strong> any of {VENUE_COUNT} MLB, minor league and NFL venues.
              </div>
            </li>
            <li className="flex">
              <span className="font-bold text-blue-600 mr-3">2.</span>
              <div>
                <strong>Pick your game:</strong> for MLB parks, choose from the real schedule; otherwise enter the date and start time.
              </div>
            </li>
            <li className="flex">
              <span className="font-bold text-blue-600 mr-3">3.</span>
              <div>
                <strong>Find your section:</strong> tap it on the map or search for it. For minor
                league games, the finder names a side of the park instead.
              </div>
            </li>
            <li className="flex">
              <span className="font-bold text-blue-600 mr-3">4.</span>
              <div>
                <strong>Check how sure we are:</strong> each MLB answer is labelled High, Medium or Low confidence.
              </div>
            </li>
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Common "Are My Seats Shaded?" Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">
                "Are field level seats ever shaded?"
              </h3>
              <p className="text-ink-700">
                Yes, later in the day: as the sun drops, the stands behind the field level throw shade forward.
                The map shows when it reaches each section for your game.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">
                "Which side of the stadium has more shade?"
              </h3>
              <p className="text-ink-700">
                The side whose stands have the afternoon sun behind them. Every ballpark faces a different way,
                so that can be first base, third base or behind home plate; the map shows it for your game.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">
                "Are upper deck seats always shaded?"
              </h3>
              <p className="text-ink-700">
                Only the rows under a roof or canopy. The front rows of most upper decks are in the sun on
                summer afternoons.
              </p>
            </div>
          </div>
        </section>

        <div className="bg-blue-100 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-blue-900 mb-3">
            Ready to Check If Your Seats Are Shaded?
          </h2>
          <p className="text-blue-800 mb-4">
            Pick your ballpark and game on the homepage to see every section&apos;s shade.
          </p>
          <Link 
            href="/" 
            className="cta-btn"
          >
            Find my seats
          </Link>
        </div>
      </div>
    </div>
  );
}
