import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ALL_UNIFIED_VENUES, getUnifiedVenueById } from '../../../../src/data/unifiedVenues';
import { ALL_WORLD_CUP_VENUES, getWorldCupVenueById } from '../../../../src/data/worldcup2026/venues';
import { getWeatherForVenue } from '../../../../src/data/worldcup2026/weatherAverages';
import { getClimateZone } from '../../../../src/utils/venueDistance';
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

  const title = `Weather & Sun Exposure at ${name} | The Shadium`;
  const description = `Weather averages, sun exposure data, and game day comfort guide for ${name}. Plan your visit with climate and UV information.`;

  return {
    title,
    description,
    alternates: { canonical: `https://theshadium.com/venue/${venueId}/weather` },
    openGraph: {
      title,
      description,
      url: `https://theshadium.com/venue/${venueId}/weather`,
      type: 'article',
      images: [{ url: 'https://theshadium.com/logo512.png', width: 512, height: 512, alt: `${name} Weather` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['https://theshadium.com/logo512.png'] },
  };
}

function getSeasonalTips(latitude: number, roofType: string): string[] {
  const tips: string[] = [];

  if (roofType === 'fixed') {
    tips.push('The roof fully protects against sun and weather at all times.');
    tips.push('Indoor climate control keeps temperatures comfortable year-round.');
    return tips;
  }

  if (latitude > 40) {
    tips.push('Summer days are long with sunset after 8 PM — afternoon games can still have significant sun.');
    tips.push('Spring and fall games may be cool; bring layers for evening starts.');
  } else if (latitude > 30) {
    tips.push('Hot summers with high UV. Sunscreen and hydration are essential for day games.');
    tips.push('Even 4 PM games can feel very warm in June-August.');
  } else {
    tips.push('Tropical/subtropical climate — expect heat and humidity throughout the season.');
    tips.push('Afternoon rain showers are common; brief but intense.');
  }

  if (roofType === 'retractable') {
    tips.push('Retractable roof may be closed on rainy or excessively hot days.');
  }

  tips.push('Always check the forecast before your game and bring sun protection for day games.');
  return tips;
}

function getEstimatedWeather(latitude: number): { summer: { highF: number; highC: number; uvIndex: number }; spring: { highF: number; highC: number; uvIndex: number } } {
  // Rough estimates based on latitude for US venues
  if (latitude > 45) {
    return {
      summer: { highF: 78, highC: 26, uvIndex: 7 },
      spring: { highF: 60, highC: 16, uvIndex: 5 },
    };
  } else if (latitude > 40) {
    return {
      summer: { highF: 84, highC: 29, uvIndex: 8 },
      spring: { highF: 65, highC: 18, uvIndex: 6 },
    };
  } else if (latitude > 35) {
    return {
      summer: { highF: 90, highC: 32, uvIndex: 9 },
      spring: { highF: 72, highC: 22, uvIndex: 7 },
    };
  } else if (latitude > 30) {
    return {
      summer: { highF: 95, highC: 35, uvIndex: 10 },
      spring: { highF: 78, highC: 26, uvIndex: 8 },
    };
  }
  return {
    summer: { highF: 92, highC: 33, uvIndex: 10 },
    spring: { highF: 82, highC: 28, uvIndex: 9 },
  };
}

export default async function WeatherPage({ params }: PageProps) {
  const { venueId } = await params;
  const venue = getUnifiedVenueById(venueId);
  const wcVenue = getWorldCupVenueById(venueId);

  if (!venue && !wcVenue) notFound();

  const name = venue?.name ?? wcVenue!.commonName;
  const lat = venue?.latitude ?? wcVenue!.latitude;
  const city = venue?.city ?? wcVenue!.city;
  const state = venue?.state ?? undefined;
  const country = wcVenue?.country ?? 'US';
  const roofType = venue?.roof ?? wcVenue!.roof;
  const league = venue?.league ?? 'World Cup 2026';
  const leagueUrl = venue ? `https://theshadium.com/league/${venue.league.toLowerCase()}` : 'https://theshadium.com/worldcup2026';

  const location = state ? `${city}, ${state}` : `${city}, ${country}`;
  const climateZone = getClimateZone(lat);
  const wcWeather = getWeatherForVenue(venueId);
  const estimatedWeather = !wcWeather ? getEstimatedWeather(lat) : null;
  const tips = getSeasonalTips(lat, roofType ?? 'open');

  const breadcrumb = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://theshadium.com/' },
    { name: league, url: leagueUrl },
    { name: name, url: `https://theshadium.com/venue/${venueId}` },
    { name: 'Weather', url: `https://theshadium.com/venue/${venueId}/weather` },
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
        <span>Weather</span>
      </nav>

      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>
        Weather &amp; Sun Exposure at {name}
      </h1>
      <p style={{ color: '#475569', marginBottom: '2rem', lineHeight: 1.6 }}>
        Game day weather guide for {name} in {location}. Plan what to wear and whether you&apos;ll need sun protection.
      </p>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>Climate Overview</h2>
        <dl style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1.5rem', margin: 0 }}>
          <div>
            <dt style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Location</dt>
            <dd style={{ margin: 0, fontWeight: 500 }}>{location}</dd>
          </div>
          <div>
            <dt style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Climate Zone</dt>
            <dd style={{ margin: 0, fontWeight: 500 }}>{climateZone}</dd>
          </div>
          <div>
            <dt style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Roof Type</dt>
            <dd style={{ margin: 0, fontWeight: 500, textTransform: 'capitalize' }}>{roofType || 'Open Air'}</dd>
          </div>
          <div>
            <dt style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Latitude</dt>
            <dd style={{ margin: 0, fontWeight: 500 }}>{lat.toFixed(2)}&deg;N</dd>
          </div>
        </dl>
      </section>

      {wcWeather ? (
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>Monthly Weather Averages</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { label: 'June', data: wcWeather.june },
              { label: 'July', data: wcWeather.july },
            ].map(({ label, data }) => (
              <div key={label} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{label}</h3>
                <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <dt style={{ color: '#64748b', fontSize: '0.875rem' }}>High Temp</dt>
                    <dd style={{ margin: 0, fontWeight: 500 }}>{data.highTempF}&deg;F / {data.highTempC}&deg;C</dd>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <dt style={{ color: '#64748b', fontSize: '0.875rem' }}>Humidity</dt>
                    <dd style={{ margin: 0, fontWeight: 500 }}>{data.humidity}%</dd>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <dt style={{ color: '#64748b', fontSize: '0.875rem' }}>UV Index</dt>
                    <dd style={{ margin: 0, fontWeight: 500 }}>{data.uvIndex}{data.uvIndex >= 8 ? ' (Very High)' : data.uvIndex >= 6 ? ' (High)' : ' (Moderate)'}</dd>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <dt style={{ color: '#64748b', fontSize: '0.875rem' }}>Rainy Days</dt>
                    <dd style={{ margin: 0, fontWeight: 500 }}>{data.rainyDays}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </section>
      ) : estimatedWeather ? (
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>Seasonal Weather Estimates</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { label: 'Summer (Jun-Aug)', data: estimatedWeather.summer },
              { label: 'Spring/Fall (Apr-May, Sep-Oct)', data: estimatedWeather.spring },
            ].map(({ label, data }) => (
              <div key={label} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{label}</h3>
                <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <dt style={{ color: '#64748b', fontSize: '0.875rem' }}>Avg High</dt>
                    <dd style={{ margin: 0, fontWeight: 500 }}>{data.highF}&deg;F / {data.highC}&deg;C</dd>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <dt style={{ color: '#64748b', fontSize: '0.875rem' }}>UV Index</dt>
                    <dd style={{ margin: 0, fontWeight: 500 }}>{data.uvIndex}{data.uvIndex >= 8 ? ' (Very High)' : data.uvIndex >= 6 ? ' (High)' : ' (Moderate)'}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#94a3b8', marginTop: '0.5rem' }}>
            * Estimates based on historical climate data for this latitude. Check local forecasts for your game day.
          </p>
        </section>
      ) : null}

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>Game Day Tips</h2>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {tips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </section>

      <section style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>Plan Your Visit</h2>
        <p style={{ color: '#475569', margin: 0, lineHeight: 1.6 }}>
          Use the <a href={`/venue/${venueId}/shade-guide`} style={{ color: '#1d4ed8' }}>shade guide</a> to see
          which sections are shaded at your game time, or check the{' '}
          <a href={`/venue/${venueId}/best-seats`} style={{ color: '#1d4ed8' }}>best seats ranking</a> for
          shade-optimized seating. For exact shade predictions on your game day, use{' '}
          <a href={`/venue/${venueId}`} style={{ color: '#1d4ed8' }}>the real-time calculator</a>.
        </p>
      </section>

      <NearbyVenues venues={nearbyVenues} />
    </div>
  );
}
