import { Metadata } from 'next';
import Link from 'next/link';
import { MLB_STADIUMS } from '../../src/data/stadiums';

export const metadata: Metadata = {
  title: 'Are My Seats in the Shade? MLB, MiLB & NFL Stadium Shade Finder | The Shadium',
  description: 'Find out if your seats are shaded at any MLB, MiLB, or NFL stadium. Check shade coverage for specific sections at 250+ venues, find the best shaded seats, and avoid sun exposure during games.',
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
              Are My Seats in the Shade? Find Out Instantly
            </h1>
          </div>
        </div>
        
        <div className="rounded-xl border bg-white p-4 md:p-5 shadow-sm mb-8 overflow-hidden stack">
          <p className="text-lg text-ink-700 mb-4 max-w-prose">
            Wondering "are my seats shaded?" We've got you covered! The Shadium provides real-time shade 
            information for every section at over 250 sports venues including all 30 MLB stadiums, 120 MiLB 
            ballparks, and 32 NFL venues. Simply select your stadium below to check if your seats will be 
            in the shade during your game.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-blue-800">
              <strong>Quick Tip:</strong> Shade coverage changes throughout the game. Our tool shows you 
              exactly when your section will be shaded based on the specific game time and date.
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
                <p className="text-sm text-ink-700 mt-2">
                  Check shaded seats →
                </p>
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
                <strong>Select Your Stadium:</strong> Choose from our database of 250+ MLB, MiLB, and NFL venues.
              </div>
            </li>
            <li className="flex">
              <span className="font-bold text-blue-600 mr-3">2.</span>
              <div>
                <strong>Pick Your Game Time:</strong> Enter the date and start time of your game for accurate shade predictions.
              </div>
            </li>
            <li className="flex">
              <span className="font-bold text-blue-600 mr-3">3.</span>
              <div>
                <strong>Find Your Section:</strong> Look up your specific section number to see shade coverage throughout the game.
              </div>
            </li>
            <li className="flex">
              <span className="font-bold text-blue-600 mr-3">4.</span>
              <div>
                <strong>View Shade Timeline:</strong> See exactly when your seats will be in shade during the game.
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
                Yes! Field level seats can be shaded depending on the stadium design, game time, and season. 
                Seats behind home plate often get shade from the upper deck overhang, while seats down the 
                baselines may get shade later in the game.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">
                "Which side of the stadium has more shade?"
              </h3>
              <p className="text-ink-700">
                Generally, the third base side gets shade first during day games as the sun moves from east 
                to west. However, this varies by stadium orientation. Use our tool to check your specific stadium.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">
                "Are upper deck seats always shaded?"
              </h3>
              <p className="text-ink-700">
                Upper deck seats often have shade from the stadium overhang, but not always. Outfield upper 
                deck sections may still get sun exposure. Check your specific section for accurate information.
              </p>
            </div>
          </div>
        </section>

        <div className="bg-blue-100 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-blue-900 mb-3">
            Ready to Check If Your Seats Are Shaded?
          </h2>
          <p className="text-blue-800 mb-4">
            Select your stadium above to get started with our free shade finder tool.
          </p>
          <Link 
            href="/" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Find Shaded Seats Now
          </Link>
        </div>
      </div>
    </div>
  );
}