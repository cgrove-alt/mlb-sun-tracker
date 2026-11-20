import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Best Shaded Seats at MLB Ballparks | The Shadium',
  description: 'Where the shade is at MLB ballparks: covered rows, the stands with the sun behind them, and how to find the shadiest sections for your game.',
  keywords: ['best shaded seats MLB', 'shade seating guide', 'MLB stadium shade map', 'coolest seats baseball', 'shaded sections every stadium'],
  alternates: {
    canonical: 'https://theshadium.com/guide/best-shaded-seats-mlb',
  },
  openGraph: {
    title: 'Best Shaded Seats at MLB Ballparks',
    description: 'How to find the shaded seats at any MLB ballpark, for your game.',
    type: 'article',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://theshadium.com/' },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://theshadium.com/guide' },
    { '@type': 'ListItem', position: 3, name: 'Best Shaded Seats at MLB Ballparks', item: 'https://theshadium.com/guide/best-shaded-seats-mlb' },
  ],
};

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Find the Best Shaded Seats at an MLB Ballpark',
  description: 'Find the seats that stay in the shade for your game at any MLB ballpark.',
  totalTime: 'PT5M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Pick Your Park and Game',
      text: 'Open your ballpark\'s page on The Shadium and pick your game. The map shows every section in sun or shade, every half hour, labelled by inning.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Look for Covered Rows',
      text: 'Rows under a deck or roof stay shaded all game. They show as shaded on the map even when the sun is high.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Pick the Side With the Sun Behind It',
      text: 'In the afternoon the sun moves to the west, so the stands with the sun behind them shade first, from the back rows forward.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Check the Most-Shade List',
      text: 'The map lists the sections with the most shade over your game, one from each seating area, leaving out Low-confidence answers.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Read the Confidence Label',
      text: 'Each section\'s answer is labelled High, Medium or Low confidence. If shade matters, prefer a section labelled High.',
    },
    {
      '@type': 'HowToStep',
      position: 6,
      name: 'Plan for the Roof',
      text: 'At retractable-roof parks the map shows the roof open. With it closed, every seat is shaded; teams decide on the day.',
    },
  ],
};

export default function BestShadedSeatsMLBPage() {
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
          <span className="truncate">Best Shaded Seats at MLB Ballparks</span>
        </nav>

        <div className="flex min-w-0 items-center justify-between py-4 mb-6">
          <div className="min-w-0">
            <h1 className="text-balance font-semibold text-ink-800 text-[clamp(1.75rem,2vw+1rem,2.5rem)] truncate md:whitespace-normal">
              Best Shaded Seats at MLB Ballparks
            </h1>
            <p className="text-base text-ink-700 mt-2 max-w-prose">
              Where the shade falls depends on the park and the start time. Every MLB ballpark&apos;s
              page has a map that shows each section in sun or shade through your game.
            </p>
          </div>
        </div>

        <article className="prose prose-slate max-w-prose stack">
          <section>
            <h2>Where the Shade Is</h2>
            <ul>
              <li><strong>Under a deck or roof:</strong> the surest shade, all game.</li>
              <li><strong>The stands with the sun behind them:</strong> in the afternoon the sun moves to the west, so these shade first, from the back rows forward.</li>
              <li><strong>Not by price or level:</strong> an expensive field-level seat can be in the sun all game while a cheaper one under a deck is shaded.</li>
              <li><strong>Retractable roofs:</strong> closed, every seat is shaded. The map shows the roof open.</li>
            </ul>
          </section>

          <section>
            <h2>Using a Park&apos;s Shade Map</h2>
            <div className="stadium-shade-card">
              <h3>Every section, every game</h3>
              <p>Pick your game and move the slider: it steps through the game every half hour, labelled by
              inning. Tap a section to see how its shade changes, or choose from the sections with the most
              shade. Each answer is labelled High, Medium or Low confidence; at most parks the stands are
              measured from lidar scans, and where they&apos;re estimated more sections are Medium or Low.</p>
            </div>
          </section>

          <section>
            <h2>Regional Considerations</h2>
            
            <h3>Hot Climate Stadiums (Priority for Shade)</h3>
            <ul>
              <li><strong>Arizona (Chase Field):</strong> Retractable roof provides full shade when closed</li>
              <li><strong>Texas (Globe Life Field):</strong> Climate-controlled with retractable roof</li>
              <li><strong>Florida (loanDepot park):</strong> Retractable roof for rain and sun protection</li>
              <li><strong>Houston (Daikin Park):</strong> Retractable roof keeps fans comfortable</li>
            </ul>

            <h3>Moderate Climate Stadiums</h3>
            <ul>
              <li><strong>California stadiums:</strong> Coastal breeze helps, but shade still important</li>
              <li><strong>Midwest stadiums:</strong> Variable weather; shade crucial for summer games</li>
              <li><strong>Northeast stadiums:</strong> Hot summers make shade valuable</li>
            </ul>
          </section>

          <section>
            <h2>By Start Time</h2>
            
            <h3>1:00 PM Games</h3>
            <p>The sun is high, so the shade is mostly under decks and roofs at first:</p>
            <ul>
              <li>Pick a covered row if you want shade from the first pitch</li>
              <li>Bring sun protection for open seats</li>
            </ul>

            <h3>4:00 PM Games</h3>
            <p>The sun is lower in the west, and shade spreads across the stands with the sun behind them:</p>
            <ul>
              <li>Check your section on the map: shade can arrive inning by inning</li>
              <li>Front rows near the field are the last to shade</li>
            </ul>

            <h3>7:00 PM Games</h3>
            <p>Less shade needed, but first innings can be sunny:</p>
            <ul>
              <li>Check the actual sunset time</li>
              <li>Expect possible low western glare before sunset</li>
            </ul>
          </section>

          <section>
            <h2>Buying Tickets</h2>
            <p>
              Ticket price and level don&apos;t decide shade. Before you buy:
            </p>
            <ul>
              <li>Check your section on the map for your game, and its confidence label</li>
              <li>Confirm retractable-roof plans close to game time</li>
              <li>Choose a ticket with a flexible exchange policy when heat risk is high</li>
            </ul>
          </section>

          <section className="cta-section">
            <h2>Find the Shade for Your Game</h2>
            <p>
              Pick your park and game to see every section in sun or shade.
            </p>
            <Link href="/" className="cta-btn">
              Find Shaded Seats →
            </Link>
          </section>

          <section>
            <h2>Additional Resources</h2>
            <ul>
              <li><Link href="/guide/how-to-find-shaded-seats">How to Find Shaded Seats Guide</Link></li>
              <li><Link href="/guide/avoid-sun-baseball-games">How to Avoid Sun at Baseball Games</Link></li>
              <li><Link href="/guide">View All Stadium Guides</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </div>
  );
}
