import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ALL_WORLD_CUP_VENUES, getWorldCupVenueById } from '../../../../src/data/worldcup2026/venues';
import { VenuePageClient } from './VenuePageClient';

interface VenuePageProps {
  params: Promise<{
    venueId: string;
  }>;
}

export async function generateStaticParams() {
  return ALL_WORLD_CUP_VENUES.map((venue) => ({
    venueId: venue.id,
  }));
}

export async function generateMetadata({ params }: VenuePageProps): Promise<Metadata> {
  const { venueId } = await params;
  const venue = getWorldCupVenueById(venueId);

  if (!venue) {
    return {
      title: 'Venue Not Found | The Shadium',
    };
  }

  const title = `${venue.commonName} - FIFA World Cup 2026 Shaded Seats | The Shadium`;
  const description = `Find the best shaded seats at ${venue.commonName} for FIFA World Cup 2026 in ${venue.city}, ${venue.country}. Complete shade analysis for all ${venue.hostMatches} World Cup matches. Row-level sun calculations, match schedule, and seat recommendations.`;

  return {
    title,
    description,
    keywords: [
      `${venue.commonName} World Cup 2026`,
      `shaded seats at ${venue.commonName}`,
      `${venue.commonName} shade guide`,
      `${venue.city} World Cup venue`,
      `FIFA World Cup 2026 ${venue.country}`,
      `${venue.fifaName}`,
      `best seats ${venue.commonName} World Cup`,
      `avoid sun at ${venue.commonName}`,
      `${venue.commonName} soccer shade`,
      `${venue.city} stadium shade finder`
    ],
    alternates: {
      canonical: `https://theshadium.com/worldcup2026/venues/${venueId}`,
    },
    openGraph: {
      title,
      description,
      url: `https://theshadium.com/worldcup2026/venues/${venueId}`,
      type: 'article',
      images: [
        {
          url: 'https://theshadium.com/logo512.png',
          width: 512,
          height: 512,
          alt: `${venue.commonName} World Cup 2026 Shade Guide`,
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
      'venue:country': venue.country,
      'venue:city': venue.city,
      'venue:capacity': venue.soccerCapacity.toString(),
      'venue:matches': venue.hostMatches.toString(),
    },
    // Schema.org structured data
    verification: {
      other: {
        'structured-data': JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: `${venue.commonName} - FIFA World Cup 2026 Shade Guide`,
          description,
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
          datePublished: '2025-01-01',
          dateModified: new Date().toISOString(),
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://theshadium.com/worldcup2026/venues/${venueId}`
          },
          about: {
            '@type': 'StadiumOrArena',
            name: venue.commonName,
            address: {
              '@type': 'PostalAddress',
              addressLocality: venue.city,
              addressCountry: venue.country
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: venue.latitude,
              longitude: venue.longitude
            }
          },
          event: {
            '@type': 'SportsEvent',
            name: 'FIFA World Cup 2026',
            startDate: '2026-06-11',
            endDate: '2026-07-19',
            location: {
              '@type': 'StadiumOrArena',
              name: venue.commonName
            }
          }
        })
      }
    }
  };
}

export default async function WorldCupVenuePage({ params }: VenuePageProps) {
  const { venueId } = await params;
  const venue = getWorldCupVenueById(venueId);

  if (!venue) {
    notFound();
  }

  return <VenuePageClient venue={venue} />;
}
