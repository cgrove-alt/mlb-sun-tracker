import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions | The Shadium',
  description: 'Find answers to common questions about finding seats in the shade at MLB stadiums, using The Shadium, and understanding sun exposure at baseball games.',
  keywords: ['MLB shade FAQ', 'baseball sun questions', 'stadium shade help', 'shadium FAQ'],
};

const faqs = [
  {
    category: "Finding Shaded Seats",
    questions: [
      {
        q: "How do I find seats in the shade at MLB stadiums?",
        a: "Use The Shadium's real-time sun tracker. Select your stadium and game time, and we'll show you which sections will be shaded. Generally, upper deck sections with overhead coverage and third base side seats offer more shade for day games."
      },
      {
        q: "Which MLB stadiums have the most shaded seats?",
        a: "Stadiums with retractable or fixed roofs like Chase Field (Arizona), Globe Life Field (Texas), and Marlins Park (Miami) offer the most shade. For open-air stadiums, look for sections under upper deck overhangs."
      },
      {
        q: "Do shaded seats cost more?",
        a: "Not necessarily. Shade depends on time of day and stadium orientation, not ticket pricing. Some affordable upper deck seats offer excellent shade coverage, while expensive field-level seats might be in direct sun."
      },
      {
        q: "What's the best time to avoid sun at baseball games?",
        a: "Evening games starting at 7 PM or later have minimal sun exposure. For day games, the sun is typically less intense after 4 PM. Early afternoon games (1 PM) have the most sun exposure."
      },
      {
        q: "How do I know which side of the stadium gets shade first?",
        a: "Generally, the third base side gets shade first during afternoon games as the sun moves from east to west. However, this varies by stadium orientation, which is why The Shadium calculates shade for each specific stadium."
      }
    ]
  },
  {
    category: "Using The Shadium",
    questions: [
      {
        q: "How accurate are The Shadium's shade predictions?",
        a: "The Shadium uses precise solar calculations based on stadium coordinates, date, and time. Our predictions are highly accurate for clear days. Cloud cover can provide additional shade beyond our predictions."
      },
      {
        q: "Does The Shadium work for all MLB stadiums?",
        a: "Yes! The Shadium covers all 30 MLB stadiums with detailed section-by-section shade analysis for any game date and time."
      },
      {
        q: "Can I save my favorite shaded sections?",
        a: "Yes, you can mark sections as favorites for quick access. Your preferences are saved locally on your device."
      },
      {
        q: "Does The Shadium show real-time weather?",
        a: "Yes, we integrate real-time weather data to show cloud cover, temperature, and precipitation chances that might affect sun exposure."
      },
      {
        q: "Is The Shadium free to use?",
        a: "Yes, The Shadium is completely free. We're passionate about helping baseball fans stay comfortable at games."
      }
    ]
  },
  {
    category: "Stadium-Specific Information",
    questions: [
      {
        q: "What about stadiums with retractable roofs?",
        a: "For stadiums with retractable roofs (like T-Mobile Park in Seattle), we indicate when the roof might be closed. Check the stadium's policy, as roofs are often closed for extreme heat or rain."
      },
      {
        q: "Do covered stadiums still have sun issues?",
        a: "Even stadiums with roofs can have sun glare through windows or open sides. Stadiums like Minute Maid Park have large windows that can create bright spots."
      },
      {
        q: "Which sections typically have overhead coverage?",
        a: "Upper deck sections (usually 300-400 level) often have overhead coverage from the deck above. Club level seats also frequently have roof coverage."
      },
      {
        q: "How does stadium orientation affect shade?",
        a: "Stadium orientation significantly impacts shade patterns. Most stadiums are oriented with home plate facing north-northeast to minimize sun in batters' eyes, affecting how shade moves across sections."
      }
    ]
  },
  {
    category: "Planning Your Visit",
    questions: [
      {
        q: "How far in advance can I check shade patterns?",
        a: "You can check shade patterns for any future date. Sun positions are predictable, so planning months ahead is perfectly accurate."
      },
      {
        q: "Should I still bring sun protection to shaded seats?",
        a: "Yes! Shade can shift during long games, and reflected UV rays can still cause sunburn. Always bring sunscreen, a hat, and sunglasses."
      },
      {
        q: "What if I can't get shaded seats?",
        a: "If shaded seats aren't available: bring sun protection, wear light-colored clothing, stay hydrated, take shade breaks in concourses, and consider leaving early if the heat becomes uncomfortable."
      },
      {
        q: "Do night games ever have sun issues?",
        a: "Games starting at 7 PM rarely have sun issues, but 6 PM starts in summer might have sun in the first inning. West-facing stadiums can have setting sun glare."
      }
    ]
  },
  {
    category: "Technical Questions",
    questions: [
      {
        q: "How does The Shadium calculate shade?",
        a: "We use astronomical algorithms to calculate the sun's exact position based on stadium GPS coordinates, date, and time. We then model how stadium structures cast shadows on each section."
      },
      {
        q: "Why do shade patterns change throughout the season?",
        a: "The sun's path changes with seasons. Summer games have a higher sun angle (more overhead sun), while spring/fall games have a lower sun angle (longer shadows)."
      },
      {
        q: "Does The Shadium account for daylight saving time?",
        a: "Yes, all times are automatically adjusted for daylight saving time based on the stadium's location."
      },
      {
        q: "Can I use The Shadium offline?",
        a: "The Shadium works offline once loaded. You can view previously selected stadiums and calculations without an internet connection."
      }
    ]
  }
];

export default function FAQPage() {
  return (
    <main className="guide-page">
      <div className="guide-container">
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span> › </span>
          <span>FAQ</span>
        </nav>

        <article>
          <h1>Frequently Asked Questions</h1>
          
          <p className="lead">
            Everything you need to know about finding seats in the shade at MLB stadiums 
            and using The Shadium to enhance your baseball experience.
          </p>

          <div className="faq-toc">
            <h2>Quick Navigation</h2>
            <ul>
              {faqs.map((category, index) => (
                <li key={index}>
                  <a href={`#${category.category.toLowerCase().replace(/\s+/g, '-')}`}>
                    {category.category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {faqs.map((category, categoryIndex) => (
            <section key={categoryIndex} id={category.category.toLowerCase().replace(/\s+/g, '-')}>
              <h2>{category.category}</h2>
              <div className="faq-list">
                {category.questions.map((item, questionIndex) => (
                  <div key={questionIndex} className="faq-item">
                    <h3>{item.q}</h3>
                    <p>{item.a}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section className="faq-contact">
            <h2>Still Have Questions?</h2>
            <p>
              Can't find what you're looking for? Check out our comprehensive guides or 
              use The Shadium to explore shade options for your specific game.
            </p>
            <div className="cta-buttons">
              <Link href="/guide" className="cta-button">
                Read Our Guides
              </Link>
              <Link href="/" className="cta-button primary">
                Find Shaded Seats
              </Link>
            </div>
          </section>

          <section className="related-resources">
            <h2>Related Resources</h2>
            <ul>
              <li>
                <Link href="/guide/how-to-find-shaded-seats">
                  Complete Guide to Finding Shaded Seats
                </Link>
              </li>
              <li>
                <Link href="/guide/best-shaded-seats-mlb">
                  Best Shaded Seats at Every MLB Stadium
                </Link>
              </li>
              <li>
                <Link href="/guide/avoid-sun-baseball-games">
                  How to Avoid Sun at Baseball Games
                </Link>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </main>
  );
}