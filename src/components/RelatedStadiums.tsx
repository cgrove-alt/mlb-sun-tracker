import Link from 'next/link';
import { ALL_UNIFIED_VENUES, getUnifiedVenueById, UnifiedVenue } from '../data/unifiedVenues';
import { getDivisionMates } from '../data/mlbDivisions';

// Great-circle distance in miles.
function haversineMiles(a: UnifiedVenue, b: UnifiedVenue): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// "Nearby / same-division stadiums" internal-linking block (audit Phase 6).
// MLB venues show their division-mates; other venues show the nearest venues in
// the same league.
export function RelatedStadiums({ venueId }: { venueId: string }) {
  const venue = getUnifiedVenueById(venueId);
  if (!venue) return null;

  let heading = 'Nearby stadiums';
  let related: Array<{ id: string; name: string; sub: string }> = [];

  const mates = getDivisionMates(venueId);
  if (mates.length) {
    heading = 'Same-division stadiums';
    related = mates
      .map((id) => getUnifiedVenueById(id))
      .filter((v): v is UnifiedVenue => v != null)
      .map((v) => ({ id: v.id, name: v.name, sub: v.team }));
  } else {
    related = ALL_UNIFIED_VENUES
      .filter((v) => v.id !== venueId && v.league === venue.league)
      .map((v) => ({ v, d: haversineMiles(venue, v) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 4)
      .map(({ v, d }) => ({ id: v.id, name: v.name, sub: `${v.city}, ${v.state} · ${Math.round(d)} mi` }));
  }

  if (!related.length) return null;

  return (
    <section
      className="related-stadiums"
      aria-label={heading}
      style={{
        margin: '2rem auto 0',
        maxWidth: '1200px',
        padding: '1.25rem 1.5rem',
        borderRadius: '0.75rem',
        border: '1px solid #e5e7eb',
        background: '#f9fafb',
      }}
    >
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>{heading}</h2>
      <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.5rem', listStyle: 'none', padding: 0, margin: 0 }}>
        {related.map((r) => (
          <li key={r.id}>
            <Link href={`/stadium/${r.id}`} style={{ fontWeight: 600, textDecoration: 'underline' }}>
              {r.name}
            </Link>{' '}
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>— {r.sub}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
