import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ALL_UNIFIED_VENUES, getUnifiedVenueById } from '../../../../src/data/unifiedVenues';
import { ALL_WORLD_CUP_VENUES, getWorldCupVenueById } from '../../../../src/data/worldcup2026/venues';
import { getSunPosition } from '../../../../src/utils/sunCalculations';
import { SafeSchema } from '../../../../components/SafeSchema';
import { generateBreadcrumbSchema } from '../../../../src/utils/seoSchema';
import NearbyVenues from '../../../../src/components/NearbyVenues';
import { getNearbyVenues } from '../../../../src/utils/getNearbyVenues';

interface PageProps {
  params: Promise<{ venueId: string }>;
}

export async function generateStaticParams() {
  const unified = ALL_UNIFIED_VENUES.map((v) => ({ venueId: v.id }));
  const wc = ALL_WORLD_CUP_VENUES.map((v) => ({ venueId: v.id }));
  return [...unified, ...wc];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { venueId } = await params;
  const venue = getUnifiedVenueById(venueId);
  const wcVenue = getWorldCupVenueById(venueId);
  const name = venue?.name ?? wcVenue?.commonName;

  if (!name) return { title: 'Not Found' };

  const title = `Best Seats for Shade at ${name} | The Shadium`;
  const description = `Ranked list of the best seats to avoid sun at ${name}. Find shaded sections for day games, evening games, and more.`;

  return {
    title,
    description,
    alternates: { canonical: `https://theshadium.com/venue/${venueId}/best-seats` },
    openGraph: {
      title,
      description,
      url: `https://theshadium.com/venue/${venueId}/best-seats`,
      type: 'article',
      images: [{ url: 'https://theshadium.com/logo512.png', width: 512, height: 512, alt: `Best Seats at ${name}` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['https://theshadium.com/logo512.png'] },
  };
}

interface SeatArea {
  area: string;
  shadeRating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  reason: string;
}

function rankSeatAreas(sunAzimuth: number, sunAltitude: number, orientation: number, venueType: string, roofType: string): SeatArea[] {
  if (roofType === 'fixed') {
    return [
      { area: 'All Sections', shadeRating: 'Excellent', reason: 'Fixed roof provides full shade coverage at all times.' },
    ];
  }

  const relativeSun = ((sunAzimuth - orientation) + 360) % 360;
  const areas: SeatArea[] = [];

  if (venueType === 'baseball') {
    // Upper deck behind home plate — almost always shaded
    areas.push({
      area: 'Upper Deck (Behind Home Plate)',
      shadeRating: 'Excellent',
      reason: 'Overhang from the highest seating level blocks direct sunlight for most game times.',
    });

    // Determine which side is shaded
    if (relativeSun >= 0 && relativeSun < 180) {
      areas.push(
        { area: 'Third Base Side (Lower & Upper)', shadeRating: 'Good', reason: 'Opposite the sun — receives shade earlier in the afternoon.' },
        { area: 'Left Field Sections', shadeRating: 'Good', reason: 'Adjacent to the shaded third base side.' },
        { area: 'Club Level (Any Side)', shadeRating: 'Fair', reason: 'Partial overhang protection, but varies by section.' },
        { area: 'First Base Side', shadeRating: 'Poor', reason: 'Faces the afternoon sun — most exposed during day games.' },
        { area: 'Right Field Sections', shadeRating: 'Poor', reason: 'Direct sun exposure for most of a day game.' },
      );
    } else {
      areas.push(
        { area: 'First Base Side (Lower & Upper)', shadeRating: 'Good', reason: 'Opposite the sun — receives shade earlier.' },
        { area: 'Right Field Sections', shadeRating: 'Good', reason: 'Adjacent to the shaded first base side.' },
        { area: 'Club Level (Any Side)', shadeRating: 'Fair', reason: 'Partial overhang protection, but varies by section.' },
        { area: 'Third Base Side', shadeRating: 'Poor', reason: 'Faces the sun — most exposed.' },
        { area: 'Left Field Sections', shadeRating: 'Poor', reason: 'Direct sun exposure for most of the game.' },
      );
    }
  } else {
    // Football / Soccer
    areas.push({
      area: 'Upper Deck (Any Sideline)',
      shadeRating: 'Excellent',
      reason: 'Upper levels benefit from roof overhang and are first to enter shade.',
    });

    if (relativeSun >= 0 && relativeSun < 180) {
      areas.push(
        { area: 'West Sideline (Lower Level)', shadeRating: 'Good', reason: 'Opposite the sun for afternoon games.' },
        { area: 'North End Zone', shadeRating: 'Fair', reason: 'Partial shade depending on sun angle.' },
        { area: 'South End Zone', shadeRating: 'Fair', reason: 'Partial shade depending on sun angle.' },
        { area: 'East Sideline (Lower Level)', shadeRating: 'Poor', reason: 'Directly facing the afternoon sun.' },
      );
    } else {
      areas.push(
        { area: 'East Sideline (Lower Level)', shadeRating: 'Good', reason: 'Opposite the sun.' },
        { area: 'North End Zone', shadeRating: 'Fair', reason: 'Partial shade depending on sun angle.' },
        { area: 'South End Zone', shadeRating: 'Fair', reason: 'Partial shade depending on sun angle.' },
        { area: 'West Sideline (Lower Level)', shadeRating: 'Poor', reason: 'Directly facing the sun.' },
      );
    }
  }

  if (roofType === 'retractable') {
    areas.unshift({
      area: 'Any Section (Roof Closed)',
      shadeRating: 'Excellent',
      reason: 'When the retractable roof is closed, all seats have full shade. Check if roof will be open for your game.',
    });
  }

  return areas;
}

const ratingColors: Record<string, string> = {
  Excellent: '#16a34a',
  Good: '#2563eb',
  Fair: '#d97706',
  Poor: '#dc2626',
};

export default async function BestSeatsPage({ params }: PageProps) {
  const { venueId } = await params;
  const venue = getUnifiedVenueById(venueId);
  const wcVenue = getWorldCupVenueById(venueId);

  if (!venue && !wcVenue) notFound();

  const name = venue?.name ?? wcVenue!.commonName;
  const lat = venue?.latitude ?? wcVenue!.latitude;
  const lon = venue?.longitude ?? wcVenue!.longitude;
  const tz = venue?.timezone ?? wcVenue!.timezone;
  const orientation = venue?.orientation ?? wcVenue!.fieldOrientation;
  const roofType = venue?.roof ?? wcVenue!.roof;
  const vType = venue?.venueType ?? 'soccer';
  const league = venue?.league ?? 'World Cup 2026';
  const leagueUrl = venue ? `https://theshadium.com/league/${venue.league.toLowerCase()}` : 'https://theshadium.com/worldcup2026';

  // Reference: 1 PM on July 15 (peak day game conditions)
  const refDate = new Date(2025, 6, 15, 13, 0, 0);
  const sun = getSunPosition(refDate, lat, lon, tz);
  const seatAreas = rankSeatAreas(sun.azimuthDegrees, sun.altitudeDegrees, orientation, vType, roofType ?? 'open');

  const breadcrumb = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://theshadium.com/' },
    { name: league, url: leagueUrl },
    { name: name, url: `https://theshadium.com/venue/${venueId}` },
    { name: 'Best Seats', url: `https://theshadium.com/venue/${venueId}/best-seats` },
  ]);

  const nearbyVenues = getNearbyVenues(venueId, 5);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <SafeSchema schema={breadcrumb} />

      <nav aria-label="Breadcrumb" style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
        <a href="/" style={{ color: '#1d4ed8' }}>Home</a>
        {' / '}
        <a href={`/venue/${venueId}`} style={{ color: '#1d4ed8' }}>{name}</a>
        {' / '}
        <span>Best Seats</span>
      </nav>

      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>
        Best Seats for Shade at {name}
      </h1>
      <p style={{ color: '#475569', marginBottom: '2rem', lineHeight: 1.6 }}>
        Ranked seating areas at {name} by shade coverage for a typical 1 PM day game.
        Rankings are based on sun position calculations for mid-summer conditions.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {seatAreas.map((area, i) => (
          <div
            key={area.area}
            style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start',
              padding: '1rem',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
            }}
          >
            <span style={{
              fontWeight: 700,
              fontSize: '1.25rem',
              color: '#94a3b8',
              minWidth: '1.5rem',
              textAlign: 'right',
            }}>
              {i + 1}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <strong>{area.area}</strong>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.125rem 0.5rem',
                  borderRadius: '9999px',
                  color: ratingColors[area.shadeRating],
                  border: `1px solid ${ratingColors[area.shadeRating]}`,
                }}>
                  {area.shadeRating}
                </span>
              </div>
              <p style={{ margin: 0, color: '#475569', fontSize: '0.9375rem' }}>{area.reason}</p>
            </div>
          </div>
        ))}
      </div>

      <section style={{ marginTop: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>About This Ranking</h2>
        <p style={{ color: '#475569', margin: 0, lineHeight: 1.6 }}>
          Rankings are calculated using the sun&apos;s position at 1:00 PM local time on July 15 — a typical peak-sun
          day game scenario. Actual shade will vary by date and game time. Use{' '}
          <a href={`/venue/${venueId}`} style={{ color: '#1d4ed8' }}>the real-time shade calculator</a>{' '}
          for precise results on your game day.
        </p>
      </section>

      <NearbyVenues venues={nearbyVenues} />
    </div>
  );
}
