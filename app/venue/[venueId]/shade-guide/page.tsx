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

  const title = `Shade Guide for ${name} - Section-by-Section Analysis | The Shadium`;
  const description = `Complete shade guide for ${name}. See which sections are shaded at 1 PM, 4 PM, and 7 PM game times. Find the best seats to avoid sun exposure.`;

  return {
    title,
    description,
    alternates: { canonical: `https://theshadium.com/venue/${venueId}/shade-guide` },
    openGraph: {
      title,
      description,
      url: `https://theshadium.com/venue/${venueId}/shade-guide`,
      type: 'article',
      images: [{ url: 'https://theshadium.com/logo512.png', width: 512, height: 512, alt: `${name} Shade Guide` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['https://theshadium.com/logo512.png'] },
  };
}

interface TimeAnalysis {
  label: string;
  sunAltitude: number;
  sunAzimuth: number;
  shadedSide: string;
  sunnySide: string;
  recommendation: string;
}

function getShadeSide(sunAzimuth: number, orientation: number, venueType: string): { shadedSide: string; sunnySide: string } {
  // Sun azimuth is compass degrees (0=N, 90=E, 180=S, 270=W)
  // For baseball: orientation is the direction home plate faces
  // For football/soccer: orientation is endzone direction
  const relativeSunAngle = ((sunAzimuth - orientation) + 360) % 360;

  if (venueType === 'baseball') {
    if (relativeSunAngle >= 0 && relativeSunAngle < 180) {
      return { shadedSide: 'Third base / left field side', sunnySide: 'First base / right field side' };
    }
    return { shadedSide: 'First base / right field side', sunnySide: 'Third base / left field side' };
  }

  // Football/soccer
  if (relativeSunAngle >= 0 && relativeSunAngle < 180) {
    return { shadedSide: 'West sideline / far side', sunnySide: 'East sideline / near side' };
  }
  return { shadedSide: 'East sideline / near side', sunnySide: 'West sideline / far side' };
}

function getRecommendation(altitude: number, roofType: string): string {
  if (roofType === 'fixed') return 'This venue has a fixed roof/dome — all seats are fully shaded regardless of game time.';
  if (roofType === 'retractable') return 'This venue has a retractable roof. When closed, all seats are shaded. When open, shade varies by section and time.';
  if (altitude <= 0) return 'The sun is below the horizon at this time. No sun exposure concerns — enjoy the game!';
  if (altitude < 15) return 'Low sun angle means long shadows. Most upper deck and covered seats will be in shade.';
  if (altitude < 35) return 'Moderate sun angle. Upper deck and overhang-protected seats offer good shade coverage.';
  if (altitude < 55) return 'High sun angle. Shade is limited to areas directly under overhangs and upper deck coverage.';
  return 'Very high sun. Minimal shade except under fixed structures. Consider sun protection.';
}

export default async function ShadeGuidePage({ params }: PageProps) {
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

  // Reference date: July 15 2025 (mid-summer for US venues)
  const gameTimes = [
    { label: '1:00 PM', hour: 13 },
    { label: '4:00 PM', hour: 16 },
    { label: '7:00 PM', hour: 19 },
  ];

  const analyses: TimeAnalysis[] = gameTimes.map(({ label, hour }) => {
    const date = new Date(2025, 6, 15, hour, 0, 0);
    const sun = getSunPosition(date, lat, lon, tz);
    const { shadedSide, sunnySide } = getShadeSide(sun.azimuthDegrees, orientation, vType);
    return {
      label,
      sunAltitude: Math.round(sun.altitudeDegrees * 10) / 10,
      sunAzimuth: Math.round(sun.azimuthDegrees * 10) / 10,
      shadedSide,
      sunnySide,
      recommendation: getRecommendation(sun.altitudeDegrees, roofType ?? 'open'),
    };
  });

  const breadcrumb = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://theshadium.com/' },
    { name: league, url: leagueUrl },
    { name: name, url: `https://theshadium.com/venue/${venueId}` },
    { name: 'Shade Guide', url: `https://theshadium.com/venue/${venueId}/shade-guide` },
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
        <span>Shade Guide</span>
      </nav>

      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>
        Shade Guide for {name}
      </h1>
      <p style={{ color: '#475569', marginBottom: '2rem', lineHeight: 1.6 }}>
        Find the best shaded seats at {name} for any game time. This guide shows sun position and shade patterns
        for typical {vType} game times based on mid-summer conditions.
      </p>

      {roofType === 'fixed' ? (
        <section style={{ padding: '1.5rem', background: '#f0fdf4', borderRadius: '8px', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Fully Covered Venue</h2>
          <p style={{ color: '#475569' }}>
            {name} has a fixed roof or dome. All seats are fully shaded regardless of game time or weather.
            Sun exposure is not a concern at this venue.
          </p>
        </section>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {analyses.map((a) => (
            <section
              key={a.label}
              style={{ padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}
            >
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                {a.label} Game Time
              </h2>
              <dl style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1rem', marginBottom: '0.75rem' }}>
                <div>
                  <dt style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Sun Altitude</dt>
                  <dd style={{ margin: 0, fontWeight: 500 }}>{a.sunAltitude > 0 ? `${a.sunAltitude}\u00B0` : 'Below horizon'}</dd>
                </div>
                <div>
                  <dt style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Sun Azimuth</dt>
                  <dd style={{ margin: 0, fontWeight: 500 }}>{a.sunAzimuth}\u00B0</dd>
                </div>
                <div>
                  <dt style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Best for Shade</dt>
                  <dd style={{ margin: 0, fontWeight: 500, color: '#16a34a' }}>{a.shadedSide}</dd>
                </div>
                <div>
                  <dt style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Most Sun Exposure</dt>
                  <dd style={{ margin: 0, fontWeight: 500, color: '#dc2626' }}>{a.sunnySide}</dd>
                </div>
              </dl>
              <p style={{ color: '#475569', fontSize: '0.9375rem', margin: 0 }}>{a.recommendation}</p>
            </section>
          ))}
        </div>
      )}

      <section style={{ marginTop: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>General Tips</h2>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <li>Upper deck seats generally get shade earlier due to the overhang above.</li>
          <li>Seats behind home plate often have the most overhead coverage.</li>
          <li>Evening games (7 PM+) typically have minimal sun concerns.</li>
          <li>Check <a href={`/venue/${venueId}`} style={{ color: '#1d4ed8' }}>the real-time calculator</a> for your exact game date and time.</li>
        </ul>
      </section>

      <NearbyVenues venues={nearbyVenues} />
    </div>
  );
}
