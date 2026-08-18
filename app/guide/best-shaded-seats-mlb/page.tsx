import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'MLB Shade Data Trust Guide | The Shadium',
  description: 'What is source-backed, what remains modeled, and why exact MLB section and row rankings are paused.',
  keywords: ['best shaded seats MLB', 'shade seating guide', 'MLB stadium shade map', 'coolest seats baseball', 'shaded sections every stadium'],
  alternates: {
    canonical: 'https://theshadium.com/guide/best-shaded-seats-mlb',
  },
  openGraph: {
    title: 'MLB Shade Data Trust Guide',
    description: 'Understand the evidence and measurement boundary behind MLB shade information.',
    type: 'article',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://theshadium.com/' },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://theshadium.com/guide' },
    { '@type': 'ListItem', position: 3, name: 'MLB Shade Data Trust Guide', item: 'https://theshadium.com/guide/best-shaded-seats-mlb' },
  ],
};

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Evaluate MLB Shade Information',
  description: 'A practical guide to separating source-backed inventory and solar context from unvalidated physical shade geometry.',
  totalTime: 'PT8M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Reject Universal Section Rules',
      text: 'A level or base-side label does not prove shade. Each park requires measured metric geometry.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Check Section Provenance',
      text: 'Confirm that section identity comes from a published venue map, while keeping that fact separate from row and obstruction measurements.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Account for Climate and Roof Type',
      text: 'A permanent roof blocks direct sun. At retractable-roof parks, use only a confirmed event roof state.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Calculate Solar Context',
      text: 'Date, time, and coordinates determine astronomical sun position. They do not determine the row-level shadow boundary by themselves.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Confirm Physical Coverage',
      text: 'Ask the venue to confirm roof, overhang, and covered-seat details before purchasing tickets based on a shade claim.',
    },
    {
      '@type': 'HowToStep',
      position: 6,
      name: 'Respect the Publication Gate',
      text: 'Exact section and row results stay withheld until measured geometry passes independent shadow validation.',
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
          <span className="truncate">MLB Shade Data Trust Guide</span>
        </nav>

        <div className="flex min-w-0 items-center justify-between py-4 mb-6">
          <div className="min-w-0">
            <h1 className="text-balance font-semibold text-ink-800 text-[clamp(1.75rem,2vw+1rem,2.5rem)] truncate md:whitespace-normal">
              MLB Shade Data Trust Guide
            </h1>
            <p className="text-base text-ink-700 mt-2 max-w-prose">
              Shade information affects real ticket decisions and health planning. This guide explains what
              the site can support today and what it refuses to publish without better evidence.
            </p>
          </div>
        </div>

        <article className="prose prose-slate max-w-prose stack">
          <section>
            <h2>Rules for Trustworthy Shade Information</h2>
            <ul>
              <li><strong>Identity is not geometry:</strong> A published section map does not measure rows or overhangs.</li>
              <li><strong>Solar position is not a shadow boundary:</strong> Structures must be measured separately.</li>
              <li><strong>Roof state matters:</strong> Retractable-roof results are event-dependent.</li>
              <li><strong>Precise outputs need validation:</strong> Independent shadow observations are required.</li>
            </ul>
          </section>

          <section>
            <h2>Current MLB Publication Status</h2>
            <div className="stadium-shade-card">
              <h3>Exact section and row rankings are paused</h3>
              <p>All 30 parks have source-backed section inventories. None currently has complete remotely measured row,
              overhang, and obstruction geometry plus the independent shadow-observation holdout required by
              the seat-level publication gate.</p>
            </div>
          </section>

          <section>
            <h2>Regional Considerations</h2>
            
            <h3>Hot Climate Stadiums (Priority for Shade)</h3>
            <ul>
              <li><strong>Arizona (Chase Field):</strong> Retractable roof provides full shade when closed</li>
              <li><strong>Texas (Globe Life Field):</strong> Climate-controlled with retractable roof</li>
              <li><strong>Florida (loanDepot park):</strong> Retractable roof for rain and sun protection</li>
              <li><strong>Houston (Minute Maid Park):</strong> Retractable roof keeps fans comfortable</li>
            </ul>

            <h3>Moderate Climate Stadiums</h3>
            <ul>
              <li><strong>California stadiums:</strong> Coastal breeze helps, but shade still important</li>
              <li><strong>Midwest stadiums:</strong> Variable weather; shade crucial for summer games</li>
              <li><strong>Northeast stadiums:</strong> Hot summers make shade valuable</li>
            </ul>
          </section>

          <section>
            <h2>Time-Based Solar Context</h2>
            
            <h3>1:00 PM Games</h3>
            <p>The sun is generally high. Plan conservatively:</p>
            <ul>
              <li>Confirm covered seating with the venue</li>
              <li>Bring sun protection when coverage is uncertain</li>
            </ul>

            <h3>4:00 PM Games</h3>
            <p>Transitional lighting. Consider:</p>
            <ul>
              <li>Use the calculated sun bearing as orientation context only</li>
              <li>Do not infer row coverage from a section name</li>
            </ul>

            <h3>7:00 PM Games</h3>
            <p>Less shade needed, but first innings can be sunny:</p>
            <ul>
              <li>Check the actual sunset time</li>
              <li>Expect possible low western glare before sunset</li>
            </ul>
          </section>

          <section>
            <h2>Buying Tickets Conservatively</h2>
            <p>
              Ticket price and level do not prove shade. Before purchasing:
            </p>
            <ul>
              <li>Ask the venue which exact rows are physically covered</li>
              <li>Confirm retractable-roof plans close to game time</li>
              <li>Choose a ticket with a flexible exchange policy when heat risk is high</li>
            </ul>
          </section>

          <section className="cta-section">
            <h2>Review the Available Evidence</h2>
            <p>
              Review source-backed inventory, astronomical sun context, roof status, and measurement limits.
            </p>
            <Link href="/" className="cta-btn">
              View Stadium Context →
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
