import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ALL_UNIFIED_VENUES, getUnifiedVenueById } from '../../../src/data/unifiedVenues';
import { getVenueSections } from '../../../src/data/venueSections';
import { generateBaseballSections } from '../../../src/utils/generateBaseballSections';
import ComprehensiveStadiumGuide from '../../../src/components/ComprehensiveStadiumGuide';
import { ALL_WORLD_CUP_VENUES, getWorldCupVenueById } from '../../../src/data/worldcup2026/venues';
import { MLB_STADIUMS } from '../../../src/data/stadiums';
import { getStadiumSectionsAsync } from '../../../src/data/getStadiumSections';
import { getStadiumAmenities } from '../../../src/data/stadiumAmenities';
import { getStadiumGuide } from '../../../src/data/guides';
import { ErrorBoundary } from '../../../src/components/ErrorBoundary';
import StadiumPageClient from '../../stadium/[stadiumId]/StadiumPageClient';
import { SafeSchema } from '../../../components/SafeSchema';
import {
  generateArticleSchema,
  generateStadiumOrArenaSchema,
  generateVenueFAQSchema,
  generateBreadcrumbSchema,
} from '../../../src/utils/seoSchema';
import VenueQuickFacts from '../../../src/components/VenueQuickFacts';
import NearbyVenues from '../../../src/components/NearbyVenues';
import { getNearbyVenues } from '../../../src/utils/getNearbyVenues';

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
        images: [
          {
            url: 'https://theshadium.com/logo512.png',
            width: 512,
            height: 512,
            alt: `${worldCupVenue.commonName} World Cup 2026 Shade Guide`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ['https://theshadium.com/logo512.png'],
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

  // Check if this is an MLB stadium — if so, render StadiumPageClient with sun calculations
  const mlbStadium = MLB_STADIUMS.find(s => s.id === stadiumIdToUse);

  // Build schema data for the current venue
  const schemaVenueName = venue ? venue.name : worldCupVenue!.commonName;
  const schemaVenueData = venue
    ? {
        name: venue.name,
        id: venue.id,
        city: venue.city,
        state: venue.state,
        latitude: venue.latitude,
        longitude: venue.longitude,
        capacity: venue.capacity,
      }
    : {
        name: worldCupVenue!.commonName,
        id: worldCupVenue!.id,
        city: worldCupVenue!.city,
        country: worldCupVenue!.country,
        latitude: worldCupVenue!.latitude,
        longitude: worldCupVenue!.longitude,
        capacity: worldCupVenue!.soccerCapacity,
      };

  const leagueLabel = venue ? venue.league : 'World Cup 2026';
  const leagueUrl = venue
    ? `https://theshadium.com/league/${venue.league.toLowerCase()}`
    : 'https://theshadium.com/worldcup2026';

  const breadcrumbItems = [
    { name: 'Home', url: 'https://theshadium.com/' },
    { name: leagueLabel, url: leagueUrl },
    { name: schemaVenueName, url: `https://theshadium.com/venue/${venueId}` },
  ];

  const articleSchema = generateArticleSchema({
    name: schemaVenueName,
    id: venueId,
    team: venue?.team,
  });
  const stadiumSchema = generateStadiumOrArenaSchema(schemaVenueData);
  const faqSchema = generateVenueFAQSchema(schemaVenueName);
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  // Quick Facts data
  const quickFactsProps = venue
    ? {
        name: venue.name,
        capacity: venue.capacity,
        roof: venue.roof || 'open',
        orientation: venue.orientation,
        city: venue.city,
        state: venue.state,
        league: venue.league,
        team: venue.team,
        timezone: venue.timezone,
        venueType: venue.venueType,
      }
    : {
        name: worldCupVenue!.commonName,
        capacity: worldCupVenue!.soccerCapacity,
        roof: worldCupVenue!.roof,
        orientation: worldCupVenue!.fieldOrientation,
        city: worldCupVenue!.city,
        country: worldCupVenue!.country,
        league: 'World Cup 2026',
        team: worldCupVenue!.fifaName,
        timezone: worldCupVenue!.timezone,
        venueType: 'soccer',
      };

  const nearbyVenues = getNearbyVenues(venueId, 5);

  if (mlbStadium) {
    const sections = await getStadiumSectionsAsync(mlbStadium.id);
    const amenities = getStadiumAmenities(mlbStadium.id);
    const guide = getStadiumGuide(mlbStadium.id) || getStadiumGuide(venueId);

    return (
      <div>
        <SafeSchema schema={articleSchema} />
        <SafeSchema schema={stadiumSchema} />
        <SafeSchema schema={faqSchema} />
        <SafeSchema schema={breadcrumbSchema} />
        <VenueQuickFacts {...quickFactsProps} />
        <ErrorBoundary level="section" resetKeys={[venueId]}>
          <StadiumPageClient
            stadium={mlbStadium}
            sections={sections}
            amenities={amenities}
            guide={guide}
            useComprehensive={!!guide}
          />
        </ErrorBoundary>
        <NearbyVenues venues={nearbyVenues} />
      </div>
    );
  }

  return (
    <div>
      <SafeSchema schema={articleSchema} />
      <SafeSchema schema={stadiumSchema} />
      <SafeSchema schema={faqSchema} />
      <SafeSchema schema={breadcrumbSchema} />
      <VenueQuickFacts {...quickFactsProps} />
      <ComprehensiveStadiumGuide
        stadiumId={stadiumIdToUse}
      />
      <NearbyVenues venues={nearbyVenues} />
    </div>
  );
}