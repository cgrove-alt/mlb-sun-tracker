import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How to Avoid Sun at Baseball Games | Sun Protection Guide',
  description: 'Essential tips for avoiding sun exposure at baseball stadiums. Learn how to stay cool, find shade, and protect yourself during MLB games.',
  keywords: ['avoid sun baseball', 'sun protection stadium', 'baseball game shade tips', 'stay cool baseball game', 'MLB sun exposure'],
  openGraph: {
    title: 'How to Avoid Sun at Baseball Games',
    description: 'Complete guide to sun protection and finding shade at MLB stadiums',
    type: 'article',
  },
};

export default function AvoidSunBaseballGamesPage() {
  return (
    <main className="guide-page">
      <div className="guide-container">
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span> › </span>
          <Link href="/guide">Guides</Link>
          <span> › </span>
          <span>Avoid Sun at Baseball Games</span>
        </nav>

        <article>
          <h1>How to Avoid Sun at Baseball Games</h1>
          
          <p className="lead">
            Spending 3-4 hours in direct sunlight at a baseball game can lead to sunburn, dehydration, 
            and heat exhaustion. Here's your complete guide to staying safe and comfortable.
          </p>

          <section>
            <h2>The Sun Exposure Challenge</h2>
            <p>
              Baseball games are uniquely challenging for sun protection:
            </p>
            <ul>
              <li>Games last 3-4 hours on average</li>
              <li>Most stadiums have limited covered seating</li>
              <li>Peak UV hours (10 AM - 4 PM) overlap with day games</li>
              <li>Concrete and metal surfaces reflect UV rays</li>
              <li>Limited mobility once seated</li>
            </ul>
          </section>

          <section>
            <h2>Pre-Game Planning</h2>
            
            <h3>1. Choose Your Game Time Wisely</h3>
            <ul>
              <li><strong>Evening games (7 PM):</strong> Minimal sun exposure</li>
              <li><strong>Late afternoon (4 PM):</strong> Sun sets during game</li>
              <li><strong>Day games (1 PM):</strong> Maximum exposure - plan carefully</li>
            </ul>

            <h3>2. Select Shaded Seats</h3>
            <p>Use The Shadium to find sections with shade coverage for your specific game time.</p>
            <ul>
              <li>Upper deck sections with overhead coverage</li>
              <li>Club level seats (usually covered)</li>
              <li>Sections behind home plate under upper deck</li>
              <li>Third base side for afternoon shade</li>
            </ul>

            <h3>3. Check the Weather</h3>
            <ul>
              <li>Cloud cover can provide natural shade</li>
              <li>High temperatures increase sun impact</li>
              <li>UV index above 3 requires protection</li>
            </ul>
          </section>

          <section>
            <h2>Essential Sun Protection Gear</h2>
            
            <h3>Must-Have Items</h3>
            <ul>
              <li><strong>Sunscreen:</strong> SPF 30+ broad spectrum, reapply every 2 hours</li>
              <li><strong>Hat:</strong> Wide-brimmed or baseball cap with neck protection</li>
              <li><strong>Sunglasses:</strong> UV-blocking lenses</li>
              <li><strong>Light clothing:</strong> Long sleeves in breathable fabric</li>
              <li><strong>Water:</strong> Stay hydrated (check stadium policies on bottles)</li>
            </ul>

            <h3>Advanced Protection</h3>
            <ul>
              <li><strong>Cooling towel:</strong> Helps regulate body temperature</li>
              <li><strong>Portable fan:</strong> Battery-operated for personal cooling</li>
              <li><strong>Sun umbrella:</strong> If allowed by stadium</li>
              <li><strong>Zinc oxide:</strong> For nose and ears</li>
            </ul>
          </section>

          <section>
            <h2>Stadium Strategies</h2>
            
            <h3>Finding Shade at Any Stadium</h3>
            <ol>
              <li><strong>Arrive early:</strong> Scout shaded standing areas</li>
              <li><strong>Concourse breaks:</strong> Take shade breaks between innings</li>
              <li><strong>Covered concessions:</strong> Eat in shaded areas</li>
              <li><strong>Suite level access:</strong> Often has indoor viewing areas</li>
            </ol>

            <h3>Seat Selection Tips</h3>
            <ul>
              <li>Aisle seats allow easier movement to shade</li>
              <li>Higher rows get shade from upper deck first</li>
              <li>Avoid outfield bleachers (usually no coverage)</li>
              <li>Consider dugout boxes for periodic shade</li>
            </ul>
          </section>

          <section>
            <h2>During the Game</h2>
            
            <h3>Sun Safety Timeline</h3>
            <ul>
              <li><strong>Pre-game:</strong> Apply sunscreen 30 minutes before</li>
              <li><strong>Every 2 innings:</strong> Reapply sunscreen</li>
              <li><strong>3rd inning:</strong> Hydration check</li>
              <li><strong>5th inning:</strong> Consider a shade break</li>
              <li><strong>7th inning:</strong> Final sunscreen application</li>
            </ul>

            <h3>Warning Signs</h3>
            <p>Move to shade immediately if experiencing:</p>
            <ul>
              <li>Dizziness or lightheadedness</li>
              <li>Excessive sweating or stopped sweating</li>
              <li>Nausea</li>
              <li>Rapid heartbeat</li>
              <li>Skin feeling hot and dry</li>
            </ul>
          </section>

          <section>
            <h2>Family Considerations</h2>
            
            <h3>Children</h3>
            <ul>
              <li>Need shade more than adults</li>
              <li>Reapply sunscreen more frequently</li>
              <li>Bring spray bottles for cooling</li>
              <li>Consider shorter games or leaving early</li>
            </ul>

            <h3>Elderly Fans</h3>
            <ul>
              <li>Higher risk of heat-related illness</li>
              <li>Prioritize covered seating</li>
              <li>Plan regular shade breaks</li>
              <li>Ensure adequate hydration</li>
            </ul>
          </section>

          <section className="tips-section">
            <h2>Pro Tips from Season Ticket Holders</h2>
            <ul>
              <li>"Freeze water bottles the night before - they'll melt throughout the game"</li>
              <li>"Bring a white towel to drape over your legs"</li>
              <li>"Stadium apps often show less crowded shaded concourses"</li>
              <li>"Some stadiums sell shade passes for standing areas"</li>
              <li>"Check if your team offers shaded group seating areas"</li>
            </ul>
          </section>

          <div className="cta-section">
            <h2>Plan Your Shaded Experience</h2>
            <p>
              Don't let sun exposure ruin your baseball experience. Use The Shadium to find the perfect 
              shaded seats for any MLB game.
            </p>
            <Link href="/" className="cta-button primary">
              Find Shaded Seats Now →
            </Link>
          </div>

          <section>
            <h2>Related Guides</h2>
            <ul>
              <li><Link href="/guide/best-shaded-seats-mlb">Best Shaded Seats at Every Stadium</Link></li>
              <li><Link href="/guide/how-to-find-shaded-seats">How to Find Shaded Seats</Link></li>
              <li><Link href="/guide">View All Guides</Link></li>
            </ul>
          </section>
        </article>
      </div>
    </main>
  );
}