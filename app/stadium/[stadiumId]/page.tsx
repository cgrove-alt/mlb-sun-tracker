import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import { MLB_STADIUMS } from '../../../src/data/stadiums';
import { getStadiumSectionsAsync } from '../../../src/data/getStadiumSections';
import { getStadiumAmenities } from '../../../src/data/stadiumAmenities';
import { getStadiumGuide } from '../../../src/data/guides';
import { getCanonicalStadiumId, needsRedirect } from '../../../src/utils/stadiumSlugMapping';
import { ErrorBoundary } from '../../../src/components/ErrorBoundary';
import StadiumPageClient from './StadiumPageClient';
import StadiumPageSSR from './StadiumPageSSR';
import styles from './StadiumPage.module.css';
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

  // Load sections asynchronously to avoid bundling all section data
  const sections = await getStadiumSectionsAsync(stadium.id);
  const amenities = getStadiumAmenities(stadium.id);
  // Use the stadium's canonical ID for guide lookup
  const guide = getStadiumGuide(stadium.id) || getStadiumGuide(stadiumId);

  // Count covered sections for dynamic FAQ answers
  const coveredSections = sections.filter((s: any) => s.covered);
  const coveredCount = coveredSections.length;
  const roofDesc = stadium.roof === 'fixed' ? 'a fixed roof (fully covered)' :
    stadium.roof === 'retractable' ? 'a retractable roof' : 'an open-air design';

  // Structured data for better SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Shaded Seats at ${stadium.name} - Shade Guide`,
    description: `Find the best shaded seats at ${stadium.name}. Real-time shade calculations for ${stadium.team} games.`,
    url: `https://theshadium.com/stadium/${stadiumId}`,
    about: {
      '@type': 'StadiumOrArena',
      name: stadium.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: stadium.city,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: stadium.latitude,
        longitude: stadium.longitude,
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
          text: `${stadium.name} has ${coveredCount} covered sections. For day games, the upper deck and club level sections typically offer the most shade. Use The Shadium's real-time calculator to check shade for your specific game time.`,
        },
      },
      {
        '@type': 'Question',
        name: `Does ${stadium.name} have a roof?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${stadium.name} has ${roofDesc}. ${stadium.roof === 'fixed' ? 'All seats are shaded regardless of weather or time.' : 'Shade coverage varies by section, time of day, and season.'}`,
        },
      },
      {
        '@type': 'Question',
        name: `How can I avoid sun at ${stadium.name} during day games?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `For day games at ${stadium.name}, choose upper deck or club level sections for the most shade. The stadium orientation is ${stadium.orientation}°, so the third base side generally gets afternoon shade first. Use The Shadium for real-time shade predictions.`,
        },
      },
    ],
  };

  // Check if we should render SSR version (for bots and no-JS users)
  const isBot = false; // In production, detect bots via user-agent
  const preferSSR = process.env.NODE_ENV === 'production';

  return (
    <div className={`${styles.pageContainer} ${killOverhang.killOverhang}`}>
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

      {/* Server-side rendered content for SEO and no-JS users */}
      <noscript>
        <div className={styles.contentSection}>
          <StadiumPageSSR
            stadium={stadium}
            sections={sections}
            amenities={amenities}
            guide={guide}
          />
        </div>
      </noscript>
      
      {/* Main content in grid */}
      <div className={styles.contentWrapper} suppressHydrationWarning>
        <ErrorBoundary level="section" resetKeys={[stadiumId]}>
          <StadiumPageClient
            stadium={stadium}
            sections={sections}
            amenities={amenities}
            guide={guide}
            useComprehensive={!!guide}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
}