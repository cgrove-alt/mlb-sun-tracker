import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ALL_UNIFIED_VENUES, getUnifiedVenueById } from '../../../src/data/unifiedVenues';
import { getVenueSections } from '../../../src/data/venueSections';
import { generateBaseballSections } from '../../../src/utils/generateBaseballSections';
import UnifiedVenueGuide from '../../../src/components/UnifiedVenueGuide';

interface VenuePageProps {
  params: Promise<{
    venueId: string;
  }>;
}

export async function generateStaticParams() {
  return ALL_UNIFIED_VENUES.map((venue) => ({
    venueId: venue.id,
  }));
}

export async function generateMetadata({ params }: VenuePageProps): Promise<Metadata> {
  const { venueId } = await params;
  const venue = getUnifiedVenueById(venueId);
  
  if (!venue) {
    return {
      title: 'Venue Not Found | The Shadium',
    };
  }

  // SEO-optimized title targeting "shaded seats at [venue]"
  const title = `Shaded Seats at ${venue.name} - ${venue.team} | The Shadium`;
  const description = `Find the best shaded seats at ${venue.name}. Complete guide to avoiding sun exposure during ${venue.team} games. Real-time shade calculations for every section, best seats for day games, covered seating areas, and sun protection tips.`;

  return {
    title,
    description,
    keywords: [
      `shaded seats at ${venue.name}`,
      `${venue.name} shaded seats`,
      `${venue.name} shade guide`,
      `best shaded seats ${venue.name}`,
      `${venue.name} sun exposure`,
      `where to sit in shade at ${venue.name}`,
      `${venue.team} ${venue.venueType} stadium shade`,
      `${venue.name} covered seats`,
      `${venue.name} ${venue.venueType} game seats`,
      `avoid sun at ${venue.name}`,
      `${venue.city} ${venue.venueType} shade`,
      `${venue.league} stadium shade map`
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
          alt: `${venue.name} Shade Guide`,
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
      'venue:league': venue.league,
      'venue:sport': venue.venueType,
      'venue:city': venue.city,
      'venue:state': venue.state,
    },
    // Structured data for venue
    verification: {
      other: {
        'structured-data': JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: `Shaded Seats at ${venue.name} - Complete Guide`,
          description: `Find the best shaded seats at ${venue.name}. Real-time shade calculations for ${venue.team} games.`,
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
            '@type': venue.venueType === 'baseball' ? 'StadiumOrArena' : 'SportsComplex',
            name: venue.name,
            address: {
              '@type': 'PostalAddress',
              addressLocality: venue.city
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
  
  if (!venue) {
    notFound();
  }

  // Get sections based on venue type
  let sections = [];
  if (venue.league === 'MiLB') {
    // Generate sections for MiLB stadiums
    sections = generateBaseballSections(venue);
  } else {
    // Use pre-defined sections for other venues
    sections = getVenueSections(venueId);
  }

  return (
    <UnifiedVenueGuide 
      venue={venue} 
      sections={sections}
    />
  );
}