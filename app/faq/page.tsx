import { Metadata } from 'next';
import Link from 'next/link';
import { SafeSchema } from '../../components/SafeSchema';
import { VENUE_COUNT, MLB_COUNT, MILB_COUNT, NFL_COUNT } from '../../src/data/venueCount';

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions | The Shadium',
  description: 'Answers to common questions about finding shaded seats at MLB, MiLB, and NFL venues, using The Shadium, and understanding sun exposure at games.',
  alternates: {
    canonical: 'https://theshadium.com/faq',
  },
};

const faqs = [
  {
    category: "Finding Shaded Seats",
    questions: [
      {
        q: "How do I find seats in the shade at a stadium?",
        a: "Select your venue and game time to review astronomical sun position, source-backed section inventory, roof context, and measurement status. Exact sections and rows are withheld until remotely reconstructed metric geometry is independently validated."
      },
      {
        q: "Which stadiums have the most shaded seats?",
        a: "A permanent fixed roof blocks direct sun. Retractable-roof exposure depends on the confirmed event roof state; open-air row coverage requires measured overhang and obstruction geometry."
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
        a: "There is no universal base-side rule. Orientation provides broad solar context, while the actual boundary depends on measured roofs, overhangs, decks, and other obstructions."
      }
    ]
  },
  {
    category: "Using The Shadium",
    questions: [
      {
        q: "How accurate are The Shadium's shade predictions?",
        a: "Astronomical sun position is calculated separately from stadium structures. Exact MLB seat-level predictions are currently withheld because metric row, overhang, and obstruction geometry has not passed independent observation validation."
      },
      {
        q: "Which venues does The Shadium cover?",
        a: `The Shadium covers ${VENUE_COUNT} venues across three leagues — all ${MLB_COUNT} MLB ballparks, ${MILB_COUNT} Minor League Baseball parks, and ${NFL_COUNT} NFL stadiums — and discloses the measurement status before publishing seat-level conclusions.`
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
        a: "Astronomical sun positions can be calculated for future dates. Future seat-level shade still depends on validated stadium geometry and, at retractable-roof parks, the event's actual roof state."
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
        a: "We calculate astronomical sun position from stadium coordinates, date, and time. Stadium structures are a separate geometry problem; exact seat-level outputs remain withheld until measured geometry passes independent validation."
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

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.flatMap((category) =>
    category.questions.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    }))
  ),
};

export default function FAQPage() {
  return (
    <div className="guide-page">
      <SafeSchema schema={faqSchema} />
      <div className="guide-container">
        <nav className="flex flex-wrap items-center gap-3 text-sm text-ink-700 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:underline">Home</Link>
          <span aria-hidden="true">/</span>
          <span>FAQ</span>
        </nav>

        <div className="flex min-w-0 items-center justify-between py-4 mb-6">
          <div className="min-w-0">
            <h1 className="text-balance font-semibold text-ink-800 text-[clamp(1.75rem,2vw+1rem,2.5rem)] truncate md:whitespace-normal">
              Frequently Asked Questions
            </h1>
            <p className="text-base text-ink-700 mt-2 max-w-prose">
              Everything you need to know about finding seats in the shade across
              MLB, MiLB, and NFL venues and using The Shadium to plan a cooler visit.
            </p>
          </div>
        </div>

        <article className="prose prose-slate max-w-prose stack">

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
                  MLB Shade Data Trust Guide
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
    </div>
  );
}
