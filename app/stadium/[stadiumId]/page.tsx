import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { MLB_STADIUMS } from '../../../src/data/stadiums';
import { getStadiumSectionsAsync } from '../../../src/data/getStadiumSections';
import { getStadiumAmenities } from '../../../src/data/stadiumAmenities';
import { getStadiumGuide } from '../../../src/data/guides';
// R1: computed server-side so the venue page ships only the current venue's
// guide/section/fidelity data — these full datasets never reach the client.
import { getStadiumDataFidelity, fidelityNote } from '../../../src/data/stadiumDataFidelity';
import { getCanonicalStadiumId, needsRedirect } from '../../../src/utils/stadiumSlugMapping';
import { ALL_UNIFIED_VENUES, getUnifiedVenueById } from '../../../src/data/unifiedVenues';
import { bestShadedSideForDayGame } from '../../../src/utils/shadeSide';
import { STADIUM_WIKIPEDIA } from '../../../src/data/stadiumWikipedia';
import { ErrorBoundary } from '../../../src/components/ErrorBoundary';
import ComprehensiveStadiumGuide from '../../../src/components/ComprehensiveStadiumGuide';
import { ShadeDataVerified } from '../../../src/components/ShadeDataVerified';
import { RelatedStadiums } from '../../../src/components/RelatedStadiums';
import StadiumPageClient from './StadiumPageClient';
import StadiumPageSSR from './StadiumPageSSR';
import styles from './StadiumPage.module.css';
import killOverhang from './KillOverhang.module.css';

interface StadiumPageProps {
  params: Promise<{
    stadiumId: string;
  }>;
}

// /stadium/[stadiumId] is the single canonical URL for every venue.
// MLB parks (30) render the rich SSR + client experience; all other
// venues (MiLB + NFL) render the comprehensive guide. The former /venue/
// route now 301-redirects here (see next.config.js).
export async function generateStaticParams() {
  const ids = new Set<string>([
    ...MLB_STADIUMS.map((stadium) => stadium.id),
    ...ALL_UNIFIED_VENUES.map((venue) => venue.id),
  ]);
  return Array.from(ids).map((stadiumId) => ({ stadiumId }));
}

export async function generateMetadata({ params }: StadiumPageProps): Promise<Metadata> {
  const { stadiumId } = await params;
  const stadium = MLB_STADIUMS.find(s => s.id === stadiumId);

  if (stadium) {
    // SEO-optimized title targeting "shaded seats at [stadium]"
    const title = `Shaded Seats at ${stadium.name} - ${stadium.team} | The Shadium`;
    const description = `Find the best shaded seats at ${stadium.name}. Complete guide to avoiding sun exposure during ${stadium.team} games. Real-time shade calculations for every section, best seats for day games, covered seating areas, and sun protection tips.`;

    return {
      title,
      description,
      alternates: {
        canonical: `https://theshadium.com/stadium/${stadiumId}`,
      },
      // openGraph/twitter images come from the per-venue opengraph-image.tsx in
      // this route segment (audit Phase 8) — do not hardcode logo512 here.
      openGraph: {
        title: `Shaded Seats at ${stadium.name} | The Shadium`,
        description: `Find the best shaded seats at ${stadium.name}. Complete shade guide for ${stadium.team} games with real-time sun tracking.`,
        type: 'article',
        url: `https://theshadium.com/stadium/${stadiumId}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: `Shaded Seats at ${stadium.name}`,
        description: `Find the best shaded seats at ${stadium.name} for ${stadium.team} games. Real-time shade tracking.`,
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

  // Non-MLB venues (MiLB / NFL) now live under /stadium/ as well.
  const venue = getUnifiedVenueById(stadiumId);

  if (!venue) {
    return {
      title: 'Stadium Not Found | The Shadium',
    };
  }

  const title = `Shaded Seats at ${venue.name} - ${venue.team} | The Shadium`;
  const description = `Find the best shaded seats at ${venue.name}. Complete guide to avoiding sun exposure during ${venue.team} games. Real-time shade calculations for every section, best seats for day games, covered seating areas, and sun protection tips.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://theshadium.com/stadium/${venue.id}`,
    },
    // openGraph/twitter images come from opengraph-image.tsx (audit Phase 8).
    openGraph: {
      title,
      description,
      url: `https://theshadium.com/stadium/${venue.id}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    other: {
      'venue:league': venue.league,
      'venue:sport': venue.venueType,
      'venue:city': venue.city,
      'venue:state': venue.state,
    },
  };
}

// Real publish date for the stadium-guide content (replaces the old hardcoded
// "2024-01-01"). dateModified is stamped at build time.
const CONTENT_PUBLISHED = '2025-04-01';

interface VenueSchemaInput {
  id: string;
  name: string;
  team: string;
  league: string;
  sport: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
  capacity?: number;
  orientation: number;
}

// Single source of the JSON-LD for a venue page — used by both the MLB and the
// MiLB/NFL branches so every venue page emits Article + StadiumOrArena +
// FAQPage + BreadcrumbList as proper <script type="application/ld+json">.
function buildVenueSchemas(v: VenueSchemaInput): Record<string, unknown>[] {
  const url = `https://theshadium.com/stadium/${v.id}`;
  const stadiumNodeId = `${url}#stadium`;
  const shadeSide = bestShadedSideForDayGame(v.orientation);
  const wikipedia = STADIUM_WIKIPEDIA[v.id];

  const article: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Shaded Seats at ${v.name} - Complete Guide`,
    description: `Find the best shaded seats at ${v.name}. Real-time shade calculations for ${v.team} games.`,
    author: { '@type': 'Organization', name: 'The Shadium', url: 'https://theshadium.com' },
    publisher: {
      '@type': 'Organization',
      name: 'The Shadium',
      logo: { '@type': 'ImageObject', url: 'https://theshadium.com/logo512.png' },
    },
    datePublished: CONTENT_PUBLISHED,
    dateModified: new Date().toISOString(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    about: {
      '@type': 'StadiumOrArena',
      '@id': stadiumNodeId,
      name: v.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: v.city,
        addressRegion: v.state,
        addressCountry: 'US',
      },
    },
  };

  const stadium: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'StadiumOrArena',
    '@id': stadiumNodeId,
    name: v.name,
    alternateName: `${v.team} Stadium`,
    description: `${v.name} is the home venue of the ${v.team}, located in ${v.city}, ${v.state}.`,
    sport: v.sport,
    url,
    address: {
      '@type': 'PostalAddress',
      addressLocality: v.city,
      addressRegion: v.state,
      addressCountry: 'US',
    },
    ...(v.latitude != null && v.longitude != null
      ? { geo: { '@type': 'GeoCoordinates', latitude: v.latitude, longitude: v.longitude } }
      : {}),
    ...(v.capacity ? { maximumAttendeeCapacity: v.capacity } : {}),
    ...(wikipedia ? { sameAs: [wikipedia] } : {}),
  };

  const faq: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What are the best shaded seats at ${v.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `For a 1 PM game at ${v.name}, the ${shadeSide} falls into shade first, so seats there and in the back rows of the upper deck stay coolest. Use The Shadium to check real-time shade for your specific game time.`,
        },
      },
      {
        '@type': 'Question',
        name: `Which sections at ${v.name} have covered seating?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${v.name} has fully covered seating in its indoor and premium areas, plus back-row (overhang) shade in parts of the main and upper levels. Check The Shadium for section-by-section coverage.`,
        },
      },
      {
        '@type': 'Question',
        name: `How can I avoid sun at ${v.name} during day games?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `To avoid sun at ${v.name}, choose seats on the ${shadeSide}, the back rows under the upper-deck overhang, or any fully covered section. The Shadium shows exactly which seats will be shaded for your game.`,
        },
      },
    ],
  };

  const breadcrumb: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://theshadium.com/' },
      {
        '@type': 'ListItem',
        position: 2,
        name: `${v.league} Stadiums`,
        item: `https://theshadium.com/league/${v.league.toLowerCase()}`,
      },
      { '@type': 'ListItem', position: 3, name: v.name, item: url },
    ],
  };

  return [article, stadium, faq, breadcrumb];
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

  // Try to find MLB stadium by ID or by using slug mapping
  let stadium = MLB_STADIUMS.find(s => s.id === stadiumId);

  // If not found directly, try using the slug mapping
  if (!stadium) {
    const canonicalId = getCanonicalStadiumId(stadiumId);
    if (canonicalId) {
      stadium = MLB_STADIUMS.find(s => s.id === canonicalId);
    }
  }

  // Non-MLB venues (MiLB / NFL) render the comprehensive guide.
  if (!stadium) {
    const venue = getUnifiedVenueById(stadiumId);
    if (!venue) {
      notFound();
    }

    const venueSchemas = buildVenueSchemas({
      id: venue.id,
      name: venue.name,
      team: venue.team,
      league: venue.league,
      sport: venue.venueType === 'football' ? 'American Football' : 'Baseball',
      city: venue.city,
      state: venue.state,
      latitude: venue.latitude,
      longitude: venue.longitude,
      capacity: venue.capacity,
      orientation: venue.orientation,
    });

    return (
      <div className={styles.pageContainer}>
        {venueSchemas.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            suppressHydrationWarning
          />
        ))}
        <ComprehensiveStadiumGuide
          stadiumId={venue.id}
          guide={getStadiumGuide(venue.id)}
          fidelityNote={fidelityNote(getStadiumDataFidelity(venue.id))}
        />
        <RelatedStadiums venueId={venue.id} />
        <ShadeDataVerified />
      </div>
    );
  }

  // Load sections asynchronously to avoid bundling all section data
  const sections = await getStadiumSectionsAsync(stadium.id);
  const amenities = getStadiumAmenities(stadium.id);
  // Use the stadium's canonical ID for guide lookup
  const guide = getStadiumGuide(stadium.id) || getStadiumGuide(stadiumId);
  // Fidelity note computed on the server (was computed inside FidelityNotice,
  // which pulled the full stadium-data-aggregator into the client first-load).
  const fidelityNoteText = fidelityNote(getStadiumDataFidelity(stadium.id));

  // Structured data (Article + StadiumOrArena + FAQPage + BreadcrumbList),
  // built from the same helper the MiLB/NFL branch uses.
  const venueSchemas = buildVenueSchemas({
    id: stadiumId,
    name: stadium.name,
    team: stadium.team,
    league: 'MLB',
    sport: 'Baseball',
    city: stadium.city,
    state: stadium.state,
    latitude: stadium.latitude,
    longitude: stadium.longitude,
    capacity: stadium.capacity,
    orientation: stadium.orientation,
  });

  return (
    <div className={`${styles.pageContainer} ${killOverhang.killOverhang}`}>
      {venueSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          suppressHydrationWarning
        />
      ))}

      {/* SEO content — always rendered so Googlebot indexes it */}
      <div className={styles.contentSection}>
        <StadiumPageSSR
          stadium={stadium}
          sections={sections}
          amenities={amenities}
          guide={guide}
        />
      </div>

      {/* Main content in grid */}
      <div className={styles.contentWrapper} suppressHydrationWarning>
        <ErrorBoundary level="section" resetKeys={[stadiumId]}>
          <StadiumPageClient
            stadium={stadium}
            sections={sections}
            amenities={amenities}
            guide={guide}
            fidelityNote={fidelityNoteText}
            useComprehensive={!!guide}
          />
        </ErrorBoundary>
      </div>

      <RelatedStadiums venueId={stadium.id} />
      <ShadeDataVerified />
    </div>
  );
}
