import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Baseball Shade Guides | The Shadium',
  description: 'Complete guides for finding seats in the shade at MLB stadiums. Learn how to avoid sun exposure and stay comfortable at baseball games.',
  keywords: ['baseball shade guide', 'MLB shade tips', 'stadium sun protection', 'shaded seats guide'],
};

const guides = [
  {
    title: "How to Find Shaded Seats at Baseball Games",
    description: "Complete guide to finding seats in the shade at MLB stadiums. Learn strategies for any ballpark.",
    href: "/guide/how-to-find-shaded-seats",
    featured: true,
  },
  {
    title: "Best Shaded Seats at Every MLB Stadium",
    description: "Stadium-by-stadium breakdown of the best sections for shade coverage at all 30 MLB ballparks.",
    href: "/guide/best-shaded-seats-mlb",
    featured: true,
  },
  {
    title: "How to Avoid Sun at Baseball Games",
    description: "Essential sun protection tips and strategies for staying cool during hot baseball games.",
    href: "/guide/avoid-sun-baseball-games",
    featured: true,
  },
];

export default function GuidesPage() {
  return (
    <main className="guide-page">
      <div className="guide-container">
        <nav className="flex flex-wrap items-center gap-3 text-sm text-ink-700 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:underline">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Guides</span>
        </nav>

        <div className="flex min-w-0 items-center justify-between py-4 mb-6">
          <div className="min-w-0">
            <h1 className="text-balance font-semibold text-ink-800 text-[clamp(1.75rem,2vw+1rem,2.5rem)] truncate md:whitespace-normal">
              Baseball Shade Guides
            </h1>
            <p className="text-base text-ink-700 mt-2 max-w-prose">
              Everything you need to know about finding seats in the shade and staying comfortable at MLB stadiums.
            </p>
          </div>
        </div>

        <section className="guides-grid">
          {guides.map((guide, index) => (
            <article key={index} className={`guide-card ${guide.featured ? 'featured' : ''}`}>
              <h2>
                <Link href={guide.href}>{guide.title}</Link>
              </h2>
              <p>{guide.description}</p>
              <Link href={guide.href} className="read-more">
                Read Guide →
              </Link>
            </article>
          ))}
        </section>

        <section className="guide-cta">
          <h2 className="h2 break-words md:break-normal">Ready to Find Your Perfect Shaded Seat?</h2>
          <p className="max-w-prose">Use The Shadium's real-time sun tracker to see exactly which seats will be shaded during your game.</p>
          <Link href="/" className="cta-button primary">
            Check Shade Coverage →
          </Link>
        </section>
      </div>
    </main>
  );
}