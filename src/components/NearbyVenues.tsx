import { NearbyVenue } from '../utils/getNearbyVenues';

interface NearbyVenuesProps {
  venues: NearbyVenue[];
}

const leagueBadgeColors: Record<string, { bg: string; color: string }> = {
  MLB: { bg: '#1e40af', color: '#fff' },
  NFL: { bg: '#013369', color: '#fff' },
  MiLB: { bg: '#5b21b6', color: '#fff' },
  'World Cup 2026': { bg: '#7c3aed', color: '#fff' },
};

export default function NearbyVenues({ venues }: NearbyVenuesProps) {
  if (venues.length === 0) return null;

  return (
    <section aria-label="Nearby Stadiums" style={{ padding: '1.5rem 0' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>
        Nearby Stadiums
      </h2>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {venues.map((v) => {
          const badge = leagueBadgeColors[v.league] || { bg: '#64748b', color: '#fff' };
          return (
            <li key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{
                display: 'inline-block',
                fontSize: '0.625rem',
                fontWeight: 700,
                padding: '0.125rem 0.375rem',
                borderRadius: '4px',
                backgroundColor: badge.bg,
                color: badge.color,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                minWidth: '2.5rem',
                textAlign: 'center',
              }}>
                {v.league}
              </span>
              <a
                href={`/venue/${v.id}`}
                style={{ color: '#1d4ed8', fontWeight: 500, textDecoration: 'none' }}
              >
                {v.name}
              </a>
              <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                {v.distanceMiles.toFixed(0)} mi
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
