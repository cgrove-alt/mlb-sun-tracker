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
      text: 'Every MLB ballpark is built at a different compass angle. The orientation determines which side of the stadium gets afternoon shade. The Shadium works this out for every section of every MLB park.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Consider the Season',
      text: 'The sun\'s arc changes through the season: it is highest in June, so the shade is shortest then and reaches further in April and September.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Look for Covered Rows',
      text: 'Rows under a deck or roof stay shaded all game. A level\'s name doesn\'t tell you which rows are covered; the map does.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Don\'t Rely on a Base-Side Rule',
      text: 'Which side shades first depends on the park and the start time. In the afternoon the stands with the sun behind them shade first, and the decks and roofs decide how far the shade reaches.',
    },
    {
      '@type': 'HowToStep',
      position: 6,
      name: 'Check Your Section on the Map',
      text: 'Pick your stadium and game at theshadium.com. The map shows every section in sun or shade through the game, inning by inning, with a High, Medium or Low confidence label.',
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
                <strong>Look for Covered Rows:</strong> A level&apos;s name doesn&apos;t tell you which rows sit under a deck; the map does
              </li>
              <li>
                <strong>Skip the Rules of Thumb:</strong> &quot;Sit on the first-base side&quot; is right at some parks and wrong at others
              </li>
            </ol>
          </section>

          <section>
            <h2>What Game Time Tells You</h2>
            <h3>Day Games (1:00 PM starts)</h3>
            <ul>
              <li>The sun is high, so the shade at first pitch is mostly under decks and roofs</li>
              <li>As the afternoon goes on, shade spreads across the stands with the sun behind them</li>
              <li>Check your section on the map to see when the shade reaches it</li>
            </ul>

            <h3>Evening Games (7:00 PM starts)</h3>
            <ul>
              <li>Low western sun may still create glare before sunset</li>
              <li>Check the actual sunset time for the game date</li>
              <li>Once the sun sets, every seat is out of it</li>
            </ul>
          </section>

          <section>
            <h2>Stadium-Specific Shade Patterns</h2>
            <p>
              Every MLB stadium faces a different way, and its decks and roofs decide how far the shade
              reaches. The Shadium&apos;s map for each park shows every section in sun or shade for your game.
            </p>
            
            <div className="cta-box">
              <h3>Find Your Stadium&apos;s Shade</h3>
              <p>Pick your park and game to see which sections are in the shade, inning by inning.</p>
              <Link href="/" className="cta-button">
                Find Shaded Seats →
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
              An expensive field-level seat can be in the sun all game while a cheaper one under a deck is shaded.
            </p>

            <h3>How accurate are shade predictions?</h3>
            <p>
              The sun&apos;s position is calculated precisely. At most MLB parks the stands, decks and roofs are measured
              from lidar scans, and each section&apos;s answer carries a High, Medium or Low confidence label.
              See <Link href="/how-it-works">how it works</Link>.
            </p>

            <h3>What if my section gets partial shade?</h3>
            <p>
              The map marks a section Partial shade when only some of its rows are shaded at that point in the
              game. Tap the section to see how its shade changes through the game.
            </p>
          </section>

          <div className="guide-footer">
            <h2>Ready to Find Your Seats?</h2>
            <p>Pick your game to see the shade, and bring sun protection for the innings before it arrives.</p>
            <Link href="/" className="cta-button primary">
              Find Shaded Seats
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
