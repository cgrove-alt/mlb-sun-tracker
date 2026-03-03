interface VenueQuickFactsProps {
  name: string;
  capacity: number;
  roof: string;
  orientation: number;
  city: string;
  state?: string;
  country?: string;
  league: string;
  team: string;
  timezone: string;
  venueType: string;
}

function getOrientationLabel(degrees: number): string {
  const directions = [
    'North', 'North-Northeast', 'Northeast', 'East-Northeast',
    'East', 'East-Southeast', 'Southeast', 'South-Southeast',
    'South', 'South-Southwest', 'Southwest', 'West-Southwest',
    'West', 'West-Northwest', 'Northwest', 'North-Northwest',
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return `${directions[index]} (${degrees}\u00B0)`;
}

function getRoofLabel(roof: string): string {
  switch (roof) {
    case 'retractable': return 'Retractable';
    case 'fixed': return 'Fixed / Domed';
    case 'open': return 'Open Air';
    default: return 'Open Air';
  }
}

export default function VenueQuickFacts({
  name,
  capacity,
  roof,
  orientation,
  city,
  state,
  country,
  league,
  team,
  timezone,
  venueType,
}: VenueQuickFactsProps) {
  const location = state ? `${city}, ${state}` : `${city}, ${country || 'US'}`;

  return (
    <section aria-label="Quick Facts" style={{ padding: '1rem 0' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>
        {name} Quick Facts
      </h2>
      <dl style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '0.5rem 1.5rem',
        margin: 0,
      }}>
        <div>
          <dt style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Capacity</dt>
          <dd style={{ margin: 0, fontWeight: 500 }}>{capacity.toLocaleString()}</dd>
        </div>
        <div>
          <dt style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Roof Type</dt>
          <dd style={{ margin: 0, fontWeight: 500 }}>{getRoofLabel(roof)}</dd>
        </div>
        <div>
          <dt style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Field Orientation</dt>
          <dd style={{ margin: 0, fontWeight: 500 }}>{getOrientationLabel(orientation)}</dd>
        </div>
        <div>
          <dt style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</dt>
          <dd style={{ margin: 0, fontWeight: 500 }}>{location}</dd>
        </div>
        <div>
          <dt style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>League</dt>
          <dd style={{ margin: 0, fontWeight: 500 }}>{league}</dd>
        </div>
        <div>
          <dt style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Home Team</dt>
          <dd style={{ margin: 0, fontWeight: 500 }}>{team}</dd>
        </div>
        <div>
          <dt style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sport</dt>
          <dd style={{ margin: 0, fontWeight: 500, textTransform: 'capitalize' }}>{venueType}</dd>
        </div>
        <div>
          <dt style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Timezone</dt>
          <dd style={{ margin: 0, fontWeight: 500 }}>{timezone.replace(/_/g, ' ')}</dd>
        </div>
      </dl>
    </section>
  );
}
