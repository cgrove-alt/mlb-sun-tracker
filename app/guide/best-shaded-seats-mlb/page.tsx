import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Best Shaded Seats at Every MLB Stadium | The Shadium',
  description: 'Comprehensive guide to the best seats in the shade at all 30 MLB stadiums. Find cool, comfortable seating with shade coverage at every ballpark.',
  keywords: ['best shaded seats MLB', 'shade seating guide', 'MLB stadium shade map', 'coolest seats baseball', 'shaded sections every stadium'],
  openGraph: {
    title: 'Best Shaded Seats at Every MLB Stadium',
    description: 'Find the best seats in the shade at all 30 MLB ballparks',
    type: 'article',
  },
};

const stadiumShadeData = [
  {
    name: "Yankee Stadium",
    team: "New York Yankees",
    bestSections: ["214-220", "314-320", "420B-427"],
    tips: "Upper deck sections along third base line offer best shade for day games"
  },
  {
    name: "Fenway Park",
    team: "Boston Red Sox",
    bestSections: ["Pavilion Box 1-6", "Grandstand 1-15", "Upper Bleacher 35-40"],
    tips: "Green Monster seats can be very hot; prefer Grandstand sections under cover"
  },
  {
    name: "Dodger Stadium",
    team: "Los Angeles Dodgers",
    bestSections: ["Top Deck 1-13", "Reserve 1-15", "Loge 137-167"],
    tips: "Third base side gets afternoon shade; Top Deck has overhead coverage"
  },
  {
    name: "Oracle Park",
    team: "San Francisco Giants",
    bestSections: ["Club Level 201-234", "View Box VB301-VB334", "Upper Box 301-336"],
    tips: "Bay breeze keeps temperatures cool; Club Level has overhead protection"
  },
  {
    name: "Petco Park",
    team: "San Diego Padres",
    bestSections: ["Upper 300-327", "Toyota Terrace Level", "Field Box 101-115"],
    tips: "Western Metal Supply building provides shade for nearby sections"
  },
];

export default function BestShadedSeatsMLBPage() {
  return (
    <main className="guide-page">
      <div className="guide-container">
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span> › </span>
          <Link href="/guide">Guides</Link>
          <span> › </span>
          <span>Best Shaded Seats MLB</span>
        </nav>

        <article>
          <h1>Best Shaded Seats at Every MLB Stadium</h1>
          
          <p className="lead">
            Finding seats in the shade can make or break your baseball experience, especially during hot summer day games. 
            This comprehensive guide covers the best shaded seating options at all 30 MLB stadiums.
          </p>

          <section>
            <h2>Quick Shade Rules for Any Stadium</h2>
            <ul>
              <li><strong>Upper Deck Advantage:</strong> Higher sections often have overhead coverage</li>
              <li><strong>Third Base Line:</strong> Gets shade first during afternoon games</li>
              <li><strong>Club Level:</strong> Premium sections usually feature covered seating</li>
              <li><strong>Behind Home Plate:</strong> Often shaded by upper deck overhang</li>
            </ul>
          </section>

          <section>
            <h2>Stadium-by-Stadium Shade Guide</h2>
            {stadiumShadeData.map((stadium, index) => (
              <div key={index} className="stadium-shade-card">
                <div className="stadium-shade-header">
                  <h3>{stadium.name}</h3>
                  <p className="team-name">{stadium.team}</p>
                </div>
                <div className="stadium-shade-content">
                  <div className="shade-info">
                    <h4>Best Shaded Sections</h4>
                    <div className="sections-wrapper">
                      {stadium.bestSections.map((section, i) => (
                        <span key={i} className="section-tag">{section}</span>
                      ))}
                    </div>
                  </div>
                  <div className="shade-tip">
                    <h4>Pro Tips</h4>
                    <p>{stadium.tips}</p>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section>
            <h2>Regional Considerations</h2>
            
            <h3>Hot Climate Stadiums (Priority for Shade)</h3>
            <ul>
              <li><strong>Arizona (Chase Field):</strong> Retractable roof provides full shade when closed</li>
              <li><strong>Texas (Globe Life Field):</strong> Climate-controlled with retractable roof</li>
              <li><strong>Florida (Marlins Park):</strong> Retractable roof for rain and sun protection</li>
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
            <h2>Time-Based Shade Strategy</h2>
            
            <h3>1:00 PM Games</h3>
            <p>Maximum sun exposure. Prioritize:</p>
            <ul>
              <li>Upper deck sections with roof coverage</li>
              <li>Sections 1-15 (typically third base side)</li>
              <li>Club level with overhead protection</li>
            </ul>

            <h3>4:00 PM Games</h3>
            <p>Transitional lighting. Consider:</p>
            <ul>
              <li>Third base side for earlier shade</li>
              <li>Upper deck for consistent coverage</li>
              <li>Behind home plate sections</li>
            </ul>

            <h3>7:00 PM Games</h3>
            <p>Less shade needed, but first innings can be sunny:</p>
            <ul>
              <li>Outfield sections to avoid setting sun</li>
              <li>First base side after 2nd inning</li>
            </ul>
          </section>

          <section>
            <h2>Budget-Friendly Shade Options</h2>
            <p>
              You don't need expensive seats to stay cool. Many affordable sections offer excellent shade:
            </p>
            <ul>
              <li><strong>Upper deck outfield:</strong> Often cheapest seats with overhead coverage</li>
              <li><strong>Bleacher sections under overhangs:</strong> Great value with shade</li>
              <li><strong>Standing room areas:</strong> Find shaded spots along concourses</li>
            </ul>
          </section>

          <section className="cta-section">
            <h2>Get Real-Time Shade Information</h2>
            <p>
              Stadium layouts and sun angles change throughout the season. Use The Shadium to see 
              exactly which seats will be shaded for your specific game.
            </p>
            <Link href="/" className="cta-button primary">
              Check Shade for Your Game →
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
    </main>
  );
}