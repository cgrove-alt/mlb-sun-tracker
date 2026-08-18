import { Metadata } from 'next';
import { VENUE_COUNT } from '../../src/data/venueCount';
import Link from 'next/link';
import { MLB_STADIUMS } from '../../src/data/stadiums';

export const metadata: Metadata = {
  title: 'Are My Seats in the Shade? MLB, MiLB & NFL Stadium Shade Finder | The Shadium',
  description: `Review stadium section inventories, astronomical sun-position context, and measurement status across ${VENUE_COUNT} venues.`,
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
              Are My Seats in the Shade? Check the Evidence First
            </h1>
          </div>
        </div>
        
        <div className="rounded-xl border bg-white p-4 md:p-5 shadow-sm mb-8 overflow-hidden stack">
          <p className="text-lg text-ink-700 mb-4 max-w-prose">
            Wondering "are my seats shaded?" The Shadium separates what is known from what is modeled.
            Select a venue to review its section inventory, astronomical sun position, roof context, and
            measurement status before relying on any seat-level conclusion.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-blue-800">
              <strong>MLB trust status:</strong> Exact row and section shade results are paused until physical
              metric row, overhang, and obstruction geometry passes independent observation validation.
            </p>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="h2 text-gray-900 mb-6 break-words md:break-normal">
            Check If Your Seats Are Shaded by Stadium
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
                  View data status →
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
                <strong>Select Your Stadium:</strong> Choose from our database of {VENUE_COUNT} MLB, MiLB, and NFL venues.
              </div>
            </li>
            <li className="flex">
              <span className="font-bold text-blue-600 mr-3">2.</span>
              <div>
                <strong>Pick Your Game Time:</strong> Enter the date and start time to calculate the astronomical sun position.
              </div>
            </li>
            <li className="flex">
              <span className="font-bold text-blue-600 mr-3">3.</span>
              <div>
                <strong>Find Your Section:</strong> Confirm that your section appears in the source-backed inventory.
              </div>
            </li>
            <li className="flex">
              <span className="font-bold text-blue-600 mr-3">4.</span>
              <div>
                <strong>Read the Confidence Notice:</strong> Do not treat orientation context as an exact row guarantee.
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
                They can be, but a seating chart does not contain the physical measurements needed to say
                which rows. Confirm covered seating with the venue until measured geometry is available.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">
                "Which side of the stadium has more shade?"
              </h3>
              <p className="text-ink-700">
                It varies with stadium orientation, sun position, and physical structures. The site provides
                orientation context but withholds exact section claims without validated geometry.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">
                "Are upper deck seats always shaded?"
              </h3>
              <p className="text-ink-700">
                No. Coverage depends on the roof and overhang dimensions, which must be measured rather than
                inferred from a generic level label.
              </p>
            </div>
          </div>
        </section>

        <div className="bg-blue-100 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-blue-900 mb-3">
            Ready to Check If Your Seats Are Shaded?
          </h2>
          <p className="text-blue-800 mb-4">
            Select a stadium above to review the available evidence and its limitations.
          </p>
          <Link 
            href="/" 
            className="cta-btn"
          >
            Review Stadium Data
          </Link>
        </div>
      </div>
    </div>
  );
}
