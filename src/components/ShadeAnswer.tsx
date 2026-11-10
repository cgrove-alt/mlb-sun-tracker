import Link from 'next/link';
import { bestShadedSideForDayGame } from '../utils/shadeSide';
import type { FieldSunSide, KickoffSunSides } from '../utils/nflSunSide';
import type { UnifiedVenue } from '../data/unifiedVenues';

const boxStyle = {
  margin: '1rem auto 1.5rem',
  maxWidth: '1200px',
  padding: '1rem 1.25rem',
  borderRadius: '0.75rem',
  borderLeft: '4px solid #2563eb',
  background: '#eff6ff',
  color: '#1e3a5f',
  lineHeight: 1.6,
} as const;

function earlyKickoff(name: string, side: FieldSunSide) {
  return side.clear ? (
    <>
      For a 1:00 PM kickoff at <strong>{name}</strong>, the sun is on the {side.shadedSideline} side
      of the field, so seats on the <strong>{side.shadedSideline} sideline</strong> have it at their
      backs and get shade first, starting with the upper rows and seats under an overhang. The{' '}
      {side.sunnySideline} sideline and the {side.sunFacingEndZone} end zone face the sun.
    </>
  ) : (
    <>
      For a 1:00 PM kickoff at <strong>{name}</strong>, the sun moves along the length of the field,
      so neither sideline has a clear edge. The {side.sunFacingEndZone} end zone faces the sun; seats
      under an overhang are the surest shade.
    </>
  );
}

function laterKickoffs(early: FieldSunSide, late: FieldSunSide, nightAfterSunset: boolean) {
  const lateText = !late.clear
    ? 'For a 4:25 PM kickoff the sun runs along the field.'
    : late.shadedSideline === early.shadedSideline && early.clear
      ? `For a 4:25 PM kickoff it's the same ${late.shadedSideline} sideline, with more of it in shade as the sun drops.`
      : `For a 4:25 PM kickoff the ${late.shadedSideline} sideline shades first.`;
  return `${lateText}${nightAfterSunset ? ' Night games kick off after sunset.' : ''}`;
}

/**
 * Answer-first shade summary at the top of NFL and MiLB venue pages. NFL
 * advice comes from the sun's path over the field (`nflSunSide.ts`), worked
 * out on the server so the sun-position code stays out of the page's
 * JavaScript. MLB pages use the shade finder instead.
 */
export function ShadeAnswer({ venue, nflSunSides }: { venue: UnifiedVenue; nflSunSides?: KickoffSunSides }) {
  const { name, roof } = venue;

  if (roof === 'fixed') {
    return (
      <section className="shade-answer" aria-label={`Where are the shaded seats at ${name}?`} style={boxStyle}>
        <p style={{ margin: 0 }}>
          <strong>{name}</strong> has a fixed roof, so every seat is out of the sun for the whole
          game, whatever the start time.
        </p>
      </section>
    );
  }

  if (venue.league === 'NFL' && nflSunSides) {
    const { early, late, nightAfterSunset } = nflSunSides;
    return (
      <section className="shade-answer" aria-label={`Where are the shaded seats at ${name}?`} style={boxStyle}>
        <p style={{ margin: 0 }}>
          {roof === 'retractable' && <>With the roof closed, every seat is shaded. With it open: </>}
          {earlyKickoff(name, early)} {laterKickoffs(early, late, nightAfterSunset)}
        </p>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem' }}>
          Based on the sun&apos;s path on Sunday, September 14, 2025. Later in the season the sun is
          lower, so the shade reaches further toward the field.{' '}
          <Link href="/how-it-works" style={{ fontWeight: 600, textDecoration: 'underline' }}>
            How we work this out
          </Link>
        </p>
      </section>
    );
  }

  const side = bestShadedSideForDayGame(venue.orientation);
  return (
    <section className="shade-answer" aria-label={`Where are the shaded seats at ${name}?`} style={boxStyle}>
      <p style={{ margin: 0 }}>
        For a day game at <strong>{name}</strong>, the orientation model indicates the{' '}
        <strong>{side}</strong> is more likely to self-shade first. Exact sections,
        rows, and transition times are not published until metric geometry has
        been measured and independently validated.{' '}
        <Link href="/how-it-works" style={{ fontWeight: 600, textDecoration: 'underline' }}>
          See how we calculate this
        </Link>
        .
      </p>
    </section>
  );
}
