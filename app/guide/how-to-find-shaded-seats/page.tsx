import { Metadata } from 'next';
import Link from 'next/link';

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Find Shaded Seats at Baseball Games',
  description: 'A step-by-step guide to finding seats in the shade at MLB stadiums so you can avoid sun exposure and stay comfortable during baseball games.',
  totalTime: 'PT5M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Check Your Game Time',
      text: 'Day games (1–4 PM starts) have the most direct sun exposure. Evening games (6–7 PM starts) are easier to shade-plan because the sun is lower. Knowing your start time is the first input for finding shaded seats.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Know Your Stadium\'s Orientation',
      text: 'Every MLB ballpark is built at a different compass angle. The orientation determines which side of the stadium gets afternoon shade. Use The Shadium to look up your stadium\'s orientation automatically.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Consider the Season',
      text: 'The sun\'s arc changes throughout the year. Date-specific solar position is reliable context, but it does not identify exact shaded rows without measured stadium geometry.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Confirm Physical Coverage',
      text: 'Do not infer coverage from a level name. Confirm roof and overhang coverage with the venue unless measured row geometry is available.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Treat Orientation as Context',
      text: 'Orientation indicates broad solar direction, but structures determine the actual shadow boundary. Do not treat a base side as a universal shade rule.',
    },
    {
      '@type': 'HowToStep',
      position: 6,
      name: 'Check the Publication Status',
      text: 'Enter your stadium, date, and game time at theshadium.com, then read the measurement notice. Exact section and row results are withheld until remotely reconstructed metric geometry passes independent validation.',
    },
  ],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://theshadium.com/' },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://theshadium.com/guide' },
    { '@type': 'ListItem', position: 3, name: 'How to Find Shaded Seats', item: 'https://theshadium.com/guide/how-to-find-shaded-seats' },
  ],
};

export const metadata: Metadata = {
  title: 'How to Find Shaded Seats at Baseball Games | The Shadium Guide',
  description: 'Complete guide to finding seats in the shade at MLB stadiums. Learn how to avoid sun exposure, pick the best shaded sections, and stay cool during baseball games.',
  keywords: ['seats in the shade', 'shaded seats baseball', 'how to find shade at stadium', 'MLB shade guide', 'avoid sun at baseball game'],
  alternates: {
    canonical: 'https://theshadium.com/guide/how-to-find-shaded-seats',
  },
  openGraph: {
    title: 'How to Find Shaded Seats at Baseball Games',
    description: 'Your complete guide to finding cool, shaded seats at any MLB stadium',
    type: 'article',
  },
};

export default function HowToFindShadedSeatsPage() {
  return (
    <div className="guide-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="guide-container">
        <nav className="flex flex-wrap items-center gap-3 text-sm text-ink-700 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:underline">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/guide" className="hover:underline">Guides</Link>
          <span aria-hidden="true">/</span>
          <span className="truncate">How to Find Shaded Seats</span>
        </nav>

        <div className="flex min-w-0 items-center justify-between py-4 mb-6">
          <div className="min-w-0">
            <h1 className="text-balance font-semibold text-ink-800 text-[clamp(1.75rem,2vw+1rem,2.5rem)] truncate md:whitespace-normal">
              How to Find Shaded Seats at Baseball Games
            </h1>
            <p className="text-base text-ink-700 mt-2 max-w-prose">
              Sitting in direct sunlight during a baseball game can turn an enjoyable experience into an uncomfortable one. 
              Here's your comprehensive guide to finding seats in the shade at MLB stadiums.
            </p>
          </div>
        </div>

        <article className="prose prose-slate max-w-prose stack">

          <section>
            <h2>Why Finding Shaded Seats Matters</h2>
            <ul>
              <li><strong>Health Protection:</strong> Avoid harmful UV exposure during 3-4 hour games</li>
              <li><strong>Comfort:</strong> Stay cool and enjoy the game without overheating</li>
              <li><strong>Better Views:</strong> No sun glare affecting your view of the action</li>
              <li><strong>Family-Friendly:</strong> Essential for bringing children or elderly fans</li>
            </ul>
          </section>

          <section>
            <h2>Quick Tips for Finding Shade</h2>
            <ol>
              <li>
                <strong>Check Game Time:</strong> Day games have more sun exposure than evening games
              </li>
              <li>
                <strong>Know Your Stadium:</strong> Each ballpark has unique shade patterns based on orientation
              </li>
              <li>
                <strong>Consider the Season:</strong> Sun angle changes throughout the baseball season
              </li>
              <li>
                <strong>Confirm Coverage:</strong> A level label alone does not prove that a row sits under an overhang
              </li>
              <li>
                <strong>Use Orientation Carefully:</strong> It is broad context, not a universal section rule
              </li>
            </ol>
          </section>

          <section>
            <h2>What Game Time Can and Cannot Tell You</h2>
            <h3>Day Games (1:00 PM starts)</h3>
            <ul>
              <li>The sun is usually high, so unverified coverage should be treated conservatively</li>
              <li>Confirm any roof or overhang claim with the venue</li>
              <li>Do not rely on a section-level result without measured geometry</li>
            </ul>

            <h3>Evening Games (7:00 PM starts)</h3>
            <ul>
              <li>Low western sun may still create glare before sunset</li>
              <li>Check the actual sunset time for the game date</li>
              <li>Nighttime can be verified once the sun is below the horizon</li>
            </ul>
          </section>

          <section>
            <h2>Stadium-Specific Shade Patterns</h2>
            <p>
              Every MLB stadium is oriented differently, but orientation is only one input. The Shadium
              shows solar context and withholds exact sections until metric geometry is remotely reconstructed and validated.
            </p>
            
            <div className="cta-box">
              <h3>Review Your Stadium&apos;s Evidence</h3>
              <p>Check section provenance, solar context, roof status, and the measurement boundary.</p>
              <Link href="/" className="cta-button">
                Review Stadium Data →
              </Link>
            </div>
          </section>

          <section>
            <h2>Additional Sun Protection Tips</h2>
            <ul>
              <li>Bring sunscreen even if you expect shade</li>
              <li>Wear a hat and sunglasses</li>
              <li>Stay hydrated throughout the game</li>
              <li>Consider bringing a small umbrella (check stadium policies)</li>
              <li>Arrive early to claim shaded spots in general admission areas</li>
            </ul>
          </section>

          <section>
            <h2>Frequently Asked Questions</h2>
            
            <h3>Do shaded seats cost more?</h3>
            <p>
              Not necessarily. Shade depends on time of day and stadium orientation, not ticket pricing. 
              Ticket price does not verify shade; confirm covered-seat information with the venue.
            </p>

            <h3>How accurate are shade predictions?</h3>
            <p>
              Astronomical sun position is calculated from coordinates, date, and time. Exact seat-level
              shade is withheld until row, overhang, and obstruction geometry passes independent validation.
            </p>

            <h3>What if my section gets partial shade?</h3>
            <p>
              A partial-shade label is not published for MLB sections without measured row and overhang
              geometry. Confirm coverage with the venue instead of assuming higher rows are shaded.
            </p>
          </section>

          <div className="guide-footer">
            <h2>Ready to Review Your Stadium?</h2>
            <p>Use the available evidence conservatively and bring sun protection whenever seat coverage is uncertain.</p>
            <Link href="/" className="cta-button primary">
              Review Stadium Data
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
