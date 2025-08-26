import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How to Find Shaded Seats at Baseball Games | The Shadium Guide',
  description: 'Complete guide to finding seats in the shade at MLB stadiums. Learn how to avoid sun exposure, pick the best shaded sections, and stay cool during baseball games.',
  keywords: ['seats in the shade', 'shaded seats baseball', 'how to find shade at stadium', 'MLB shade guide', 'avoid sun at baseball game'],
  openGraph: {
    title: 'How to Find Shaded Seats at Baseball Games',
    description: 'Your complete guide to finding cool, shaded seats at any MLB stadium',
    type: 'article',
  },
};

export default function HowToFindShadedSeatsPage() {
  return (
    <main className="guide-page">
      <div className="guide-container">
        <nav className="flex flex-wrap items-center gap-3 text-sm text-ink-700 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:underline">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/guide" className="hover:underline">Guides</Link>
          <span aria-hidden="true">/</span>
          <span className="truncate block max-w-[50vw]">How to Find Shaded Seats</span>
        </nav>

        <article>
          <h1 className="break-words md:break-normal">How to Find Shaded Seats at Baseball Games</h1>
          
          <p className="lead">
            Sitting in direct sunlight during a baseball game can turn an enjoyable experience into an uncomfortable one. 
            Here's your comprehensive guide to finding seats in the shade at MLB stadiums.
          </p>

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
                <strong>Upper Deck Advantage:</strong> Upper deck seats often have overhead coverage
              </li>
              <li>
                <strong>Third Base Side:</strong> Generally gets shade earlier in day games
              </li>
            </ol>
          </section>

          <section>
            <h2>Best Shaded Sections by Time</h2>
            <h3>Day Games (1:00 PM starts)</h3>
            <ul>
              <li>Look for sections behind home plate under the upper deck</li>
              <li>Third base side typically gets shade by the 3rd inning</li>
              <li>Club level seats often have overhead protection</li>
            </ul>

            <h3>Evening Games (7:00 PM starts)</h3>
            <ul>
              <li>First base side may have lingering sun in early innings</li>
              <li>Outfield sections face less direct sun</li>
              <li>Most seats are shaded by the 3rd inning</li>
            </ul>
          </section>

          <section>
            <h2>Stadium-Specific Shade Patterns</h2>
            <p>
              Every MLB stadium is oriented differently, affecting shade patterns. Use The Shadium's 
              real-time sun tracker to see exactly which sections will be shaded during your game.
            </p>
            
            <div className="cta-box">
              <h3>Find Your Perfect Shaded Seat</h3>
              <p>Use our interactive tool to check shade coverage for any MLB game</p>
              <Link href="/" className="cta-button">
                Check Shade Now →
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
              Some affordable upper deck seats offer excellent shade coverage.
            </p>

            <h3>How accurate are shade predictions?</h3>
            <p>
              The Shadium uses precise sun calculations based on stadium coordinates, date, and time. 
              Weather conditions like clouds can provide additional shade beyond our predictions.
            </p>

            <h3>What if my section gets partial shade?</h3>
            <p>
              Partial shade means some rows will be shaded while others won't. Generally, higher row 
              numbers in a section get shade first as the sun moves across the sky.
            </p>
          </section>

          <div className="guide-footer">
            <h2>Ready to Find Your Shaded Seats?</h2>
            <p>Don't let the sun ruin your baseball experience. Use The Shadium to find the perfect seats in the shade.</p>
            <Link href="/" className="cta-button primary">
              Start Finding Shade
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}