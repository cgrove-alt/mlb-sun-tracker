import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ALL_UNIFIED_VENUES, getUnifiedVenueById } from '../../../src/data/unifiedVenues';
import { getVenueSections } from '../../../src/data/venueSections';
import { generateBaseballSections } from '../../../src/utils/generateBaseballSections';
import ComprehensiveStadiumGuide from '../../../src/components/ComprehensiveStadiumGuide';
import { ALL_WORLD_CUP_VENUES, getWorldCupVenueById } from '../../../src/data/worldcup2026/venues';

interface VenuePageProps {
  params: Promise<{
    venueId: string;
  }>;
}

export async function generateStaticParams() {
  const unifiedVenueParams = ALL_UNIFIED_VENUES.map((venue) => ({
    venueId: venue.id,
  }));

  const worldCupVenueParams = ALL_WORLD_CUP_VENUES.map((venue) => ({
    venueId: venue.id,
  }));

  return [...unifiedVenueParams, ...worldCupVenueParams];
}

export async function generateMetadata({ params }: VenuePageProps): Promise<Metadata> {
  const { venueId } = await params;
  const venue = getUnifiedVenueById(venueId);
  const worldCupVenue = getWorldCupVenueById(venueId);

  if (!venue && !worldCupVenue) {
    return {
      title: 'Venue Not Found | The Shadium',
    };
  }

  // Handle World Cup venues
  if (worldCupVenue) {
    const title = `Shaded Seats at ${worldCupVenue.commonName} - FIFA World Cup 2026 | The Shadium`;
    const description = `Find the best shaded seats at ${worldCupVenue.commonName} for FIFA World Cup 2026. Complete guide to avoiding sun exposure during matches in ${worldCupVenue.city}, ${worldCupVenue.country}. Real-time shade calculations for every section, best seats for soccer matches, and sun protection tips.`;

    return {
      title,
      description,
      keywords: [
        `shaded seats at ${worldCupVenue.commonName}`,
        `${worldCupVenue.commonName} World Cup 2026`,
        `${worldCupVenue.commonName} shade guide`,
        `best shaded seats ${worldCupVenue.commonName}`,
        `${worldCupVenue.city} World Cup stadium`,
        `FIFA World Cup 2026 ${worldCupVenue.country}`,
        `avoid sun at ${worldCupVenue.commonName}`
      ],
      alternates: {
        canonical: `https://theshadium.com/venue/${venueId}`,
      },
      openGraph: {
        title,
        description,
        url: `https://theshadium.com/venue/${venueId}`,
        type: 'article',
      },
    };
  }

  // SEO-optimized title targeting "shaded seats at [venue]"
  const title = `Shaded Seats at ${venue!.name} - ${venue!.team} | The Shadium`;
  const description = `Find the best shaded seats at ${venue!.name}. Complete guide to avoiding sun exposure during ${venue!.team} games. Real-time shade calculations for every section, best seats for day games, covered seating areas, and sun protection tips.`;

  return {
    title,
    description,
    keywords: [
      `shaded seats at ${venue!.name}`,
      `${venue!.name} shaded seats`,
      `${venue!.name} shade guide`,
      `best shaded seats ${venue!.name}`,
      `${venue!.name} sun exposure`,
      `where to sit in shade at ${venue!.name}`,
      `${venue!.team} ${venue!.venueType} stadium shade`,
      `${venue!.name} covered seats`,
      `${venue!.name} ${venue!.venueType} game seats`,
      `avoid sun at ${venue!.name}`,
      `${venue!.city} ${venue!.venueType} shade`,
      `${venue!.league} stadium shade map`
    ],
    alternates: {
      canonical: `https://theshadium.com/venue/${venueId}`,
    },
    openGraph: {
      title,
      description,
      url: `https://theshadium.com/venue/${venueId}`,
      type: 'article',
      images: [
        {
          url: 'https://theshadium.com/logo512.png',
          width: 512,
          height: 512,
          alt: `${venue!.name} Shade Guide`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://theshadium.com/logo512.png'],
    },
    other: {
      'venue:league': venue!.league,
      'venue:sport': venue!.venueType,
      'venue:city': venue!.city,
      'venue:state': venue!.state,
    },
    // Structured data for venue
    verification: {
      other: {
        'structured-data': JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: `Shaded Seats at ${venue!.name} - Complete Guide`,
          description: `Find the best shaded seats at ${venue!.name}. Real-time shade calculations for ${venue!.team} games.`,
          author: {
            '@type': 'Organization',
            name: 'The Shadium'
          },
          publisher: {
            '@type': 'Organization',
            name: 'The Shadium',
            logo: {
              '@type': 'ImageObject',
              url: 'https://theshadium.com/logo512.png'
            }
          },
          datePublished: '2024-01-01',
          dateModified: new Date().toISOString(),
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://theshadium.com/venue/${venueId}`
          },
          about: {
            '@type': venue!.venueType === 'baseball' ? 'StadiumOrArena' : 'SportsComplex',
            name: venue!.name,
            address: {
              '@type': 'PostalAddress',
              addressLocality: venue!.city
            }
          }
        })
      }
    }
  };
}

export default async function VenuePage({ params }: VenuePageProps) {
  const { venueId } = await params;
  const venue = getUnifiedVenueById(venueId);
  const worldCupVenue = getWorldCupVenueById(venueId);

  if (!venue && !worldCupVenue) {
    notFound();
  }

  // Determine the stadium ID to use
  // For World Cup venues based on NFL stadiums, use the NFL stadium ID
  // Otherwise use the venue ID as-is
  let stadiumIdToUse = venueId;
  if (worldCupVenue && worldCupVenue.nflStadiumId) {
    stadiumIdToUse = worldCupVenue.nflStadiumId;
  } else if (venue) {
    stadiumIdToUse = venue.id;
  }

  return (
    <div>
      <ComprehensiveStadiumGuide
        stadiumId={stadiumIdToUse}
      />
    </div>
  );
}