import { ImageResponse } from 'next/og';
import { MLB_STADIUMS } from '../../../src/data/stadiums';
import { ALL_UNIFIED_VENUES, getUnifiedVenueById } from '../../../src/data/unifiedVenues';
import { kickoffSunSides } from '../../../src/utils/nflSunSide';

// Per-venue Open Graph image (audit Phase 8): a branded 1200x630 card with the
// venue name, team, and a one-line shade takeaway — replaces the
// generic logo512.png og:image on every venue page.
export const alt = 'The Shadium — venue shade guide';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Generate one image per venue (mirrors the page's params).
export function generateStaticParams() {
  const ids = new Set<string>([
    ...MLB_STADIUMS.map((s) => s.id),
    ...ALL_UNIFIED_VENUES.map((v) => v.id),
  ]);
  return Array.from(ids).map((stadiumId) => ({ stadiumId }));
}

/** Same sun-path answer as the NFL page's ShadeAnswer. */
function nflTakeaway(venue: NonNullable<ReturnType<typeof getUnifiedVenueById>>): string {
  const { early } = kickoffSunSides(venue);
  const answer = early.clear
    ? `1 PM kickoffs: the ${early.shadedSideline} sideline shades first`
    : '1 PM kickoffs: the sun runs along the field';
  return venue.roof === 'retractable' ? `Roof open, ${answer.charAt(0).toLowerCase()}${answer.slice(1)}` : answer;
}

export default async function Image({ params }: { params: Promise<{ stadiumId: string }> }) {
  const { stadiumId } = await params;
  const stadium = MLB_STADIUMS.find((s) => s.id === stadiumId);
  const venue = getUnifiedVenueById(stadiumId);

  const name = stadium?.name ?? venue?.name ?? 'Stadium';
  const team = stadium?.team ?? venue?.team ?? '';
  const league = venue?.league ?? 'MLB';
  const roof = stadium?.roof ?? venue?.roof;
  const takeaway = roof === 'fixed'
    ? 'Fixed roof: every seat is shaded'
    : stadium
      ? 'Shade for every section, every game'
      : venue?.league === 'NFL'
        ? nflTakeaway(venue)
        : 'Sun and shade guide';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0b2545 0%, #13315c 60%, #1b4a7a 100%)',
          color: '#ffffff',
          padding: '64px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 30, letterSpacing: 2, color: '#bcd4f0', fontWeight: 700 }}>
          <span style={{ fontSize: 40, marginRight: 14 }}>☀️</span>
          THE SHADIUM
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>{name}</div>
          {team ? <div style={{ fontSize: 38, color: '#9fc0e8', marginTop: 12 }}>{`${team} · ${league}`}</div> : null}
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* two-tone shade/sun bar */}
          <div style={{ display: 'flex', width: 220, height: 26, borderRadius: 13, overflow: 'hidden', marginRight: 24 }}>
            <div style={{ display: 'flex', width: 110, height: 26, background: '#1e3a5f' }} />
            <div style={{ display: 'flex', width: 110, height: 26, background: '#f6c453' }} />
          </div>
          <div style={{ fontSize: 34, fontWeight: 600 }}>{takeaway}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
