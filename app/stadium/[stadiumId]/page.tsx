import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import { MLB_STADIUMS } from '../../../src/data/stadiums';
import { getStadiumSections } from '../../../src/data/stadiumSections';
import { getStadiumAmenities } from '../../../src/data/stadiumAmenities';
import { getStadiumGuide } from '../../../src/data/guides';
import { getCanonicalStadiumId, needsRedirect } from '../../../src/utils/stadiumSlugMapping';
import StadiumPageClient from './StadiumPageClient';
import StadiumPageSSR from './StadiumPageSSR';
import StickyShadeBar from '../../../components/StickyShadeBar';
import killOverhang from './KillOverhang.module.css';

interface StadiumPageProps {
  params: Promise<{
    stadiumId: string;
  }>;
}

export async function generateStaticParams() {
  return MLB_STADIUMS.map((stadium) => ({
    stadiumId: stadium.id,
  }));
}

export async function generateMetadata({ params }: StadiumPageProps): Promise<Metadata> {
  const { stadiumId } = await params;
  const stadium = MLB_STADIUMS.find(s => s.id === stadiumId);
  
  if (!stadium) {
    return {
      title: 'Stadium Not Found | The Shadium',
    };
  }

  // SEO-optimized title targeting "shaded seats at [stadium]"
  const title = `Shaded Seats at ${stadium.name} - ${stadium.team} | The Shadium`;
  const description = `Find the best shaded seats at ${stadium.name}. Complete guide to avoiding sun exposure during ${stadium.team} games. Real-time shade calculations for every section, best seats for day games, covered seating areas, and sun protection tips.`;

  return {
    title,
    description,
    keywords: [
      `shaded seats at ${stadium.name}`,
      `${stadium.name} shaded seats`,
      `${stadium.name} shade guide`,
      `best shaded seats ${stadium.name}`,
      `${stadium.name} sun exposure`,
      `where to sit in shade at ${stadium.name}`,
      `${stadium.team} stadium shade`,
      `${stadium.name} covered seats`,
      `${stadium.name} day game seats`,
      `avoid sun at ${stadium.name}`,
      `${stadium.city} baseball shade`,
      'MLB stadium shade map'
    ],
    alternates: {
      canonical: `https://theshadium.com/stadium/${stadiumId}`,
    },
    openGraph: {
      title: `Shaded Seats at ${stadium.name} | The Shadium`,
      description: `Find the best shaded seats at ${stadium.name}. Complete shade guide for ${stadium.team} games with real-time sun tracking.`,
      type: 'article',
      url: `https://theshadium.com/stadium/${stadiumId}`,
      images: [
        {
          url: 'https://theshadium.com/logo512.png',
          width: 512,
          height: 512,
          alt: `Shaded Seats at ${stadium.name}`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Shaded Seats at ${stadium.name}`,
      description: `Find the best shaded seats at ${stadium.name} for ${stadium.team} games. Real-time shade tracking.`,
      images: ['https://theshadium.com/logo512.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function StadiumPage({ params }: StadiumPageProps) {
  const { stadiumId } = await params;
  
  // Check if this slug needs redirect to canonical ID
  if (needsRedirect(stadiumId)) {
    const canonicalId = getCanonicalStadiumId(stadiumId);
    if (canonicalId) {
      redirect(`/stadium/${canonicalId}`);
    }
  }
  
  // Try to find stadium by ID or by using slug mapping
  let stadium = MLB_STADIUMS.find(s => s.id === stadiumId);
  
  // If not found directly, try using the slug mapping
  if (!stadium) {
    const canonicalId = getCanonicalStadiumId(stadiumId);
    if (canonicalId) {
      stadium = MLB_STADIUMS.find(s => s.id === canonicalId);
    }
  }
  
  if (!stadium) {
    notFound();
  }

  const sections = getStadiumSections(stadium.id);
  const amenities = getStadiumAmenities(stadium.id);
  // Use the stadium's canonical ID for guide lookup
  const guide = getStadiumGuide(stadium.id) || getStadiumGuide(stadiumId);

  // Structured data for better SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Shaded Seats at ${stadium.name} - Complete Guide`,
    description: `Find the best shaded seats at ${stadium.name}. Real-time shade calculations for ${stadium.team} games.`,
    author: {
      '@type': 'Organization',
      name: 'The Shadium',
    },
    publisher: {
      '@type': 'Organization',
      name: 'The Shadium',
      logo: {
        '@type': 'ImageObject',
        url: 'https://theshadium.com/logo512.png',
      },
    },
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://theshadium.com/stadium/${stadiumId}`,
    },
    about: {
      '@type': 'StadiumOrArena',
      name: stadium.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: stadium.city,
      },
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What are the best shaded seats at ${stadium.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The best shaded seats at ${stadium.name} vary by game time. For day games, sections on the third base side and upper deck typically offer more shade. Use The Shadium to check real-time shade for your specific game.`,
        },
      },
      {
        '@type': 'Question',
        name: `Which sections at ${stadium.name} have covered seating?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${stadium.name} has covered seating in select premium areas and upper deck sections. Check The Shadium for detailed coverage information for each section.`,
        },
      },
      {
        '@type': 'Question',
        name: `How can I avoid sun at ${stadium.name} during day games?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `To avoid sun at ${stadium.name}, choose seats on the third base side, in the upper deck, or in club level sections. The Shadium provides real-time calculations showing exactly which seats will be shaded during your game.`,
        },
      },
    ],
  };

  // Check if we should render SSR version (for bots and no-JS users)
  const isBot = false; // In production, detect bots via user-agent
  const preferSSR = process.env.NODE_ENV === 'production';

  return (
    <div className={`grid grid-cols-1 auto-rows-auto gap-8 w-full max-w-[1280px] px-4 mx-auto relative isolate [&>*]:!m-0 [&>*]:!static [&>*]:!transform-none [&>*]:!z-auto sm:gap-6 sm:px-4 md:gap-8 md:px-5 lg:gap-8 lg:px-6 [&_*]:!transform-none [&_*:hover]:!transform-none [&_section]:!mt-0 [&_section]:!mb-0 [&_section]:!relative [&_section]:!z-[1] [&_article]:!mt-0 [&_article]:!mb-0 [&_article]:!relative [&_article]:!z-[1] [&_div[class*='section']]:!mt-0 [&_div[class*='section']]:!mb-0 [&_div[class*='section']]:!relative [&_div[class*='section']]:!z-[1] [&_div[class*='guide']]:!mt-0 [&_div[class*='guide']]:!mb-0 [&_div[class*='guide']]:!relative [&_div[class*='guide']]:!z-[1] ${killOverhang.killOverhang}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        suppressHydrationWarning
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        suppressHydrationWarning
      />

      {/* Sticky shade calculator bar in grid */}
      <div className="sticky top-0 z-[100] grid-col-1 m-0">
        <Suspense fallback={null}>
          <StickyShadeBar
            stadiumName={stadium.name}
            stadiumId={stadium.id}
          />
        </Suspense>
      </div>

      {/* Server-side rendered content for SEO and no-JS users */}
      <noscript>
        <div className="grid-col-1 m-0 p-0 relative z-[1]">
          <StadiumPageSSR
            stadium={stadium}
            sections={sections}
            amenities={amenities}
            guide={guide}
          />
        </div>
      </noscript>

      {/* Main content in grid */}
      <div className="grid-col-1 grid grid-cols-1 gap-6 m-0 p-0 lg:gap-8" suppressHydrationWarning>
        <StadiumPageClient
          stadium={stadium}
          sections={sections}
          amenities={amenities}
          guide={guide}
          useComprehensive={!!guide}
        />
      </div>
    </div>
  );
}