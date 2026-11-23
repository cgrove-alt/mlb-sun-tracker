import Link from 'next/link';
import type { FieldSunSide, KickoffSunSides } from '../utils/nflSunSide';
import type { GameShade } from '../utils/shadeSide';
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
 * Answer-first shade summary at the top of NFL and MiLB venue pages. The
 * advice comes from the sun's path over the field (`nflSunSide.ts`,
 * `shadeSide.ts`), worked out on the server so the sun-position code stays out
 * of the page's JavaScript. MLB pages use the shade finder instead.
 *
 * The finder passes `milbGame`: the answer for the MiLB game the fan picked.
 */
export function ShadeAnswer({ venue, nflSunSides, milbShadeSides = [], milbGame }: {
  venue: UnifiedVenue;
  nflSunSides?: KickoffSunSides;
  milbShadeSides?: string[];
  milbGame?: GameShade;
}) {
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

  if (venue.league === 'NFL' && !nflSunSides) {
    // Only reached for a field whose direction we could not measure (a
    // retractable roof that was closed in every aerial photo).
    return (
      <section className="shade-answer" aria-label={`Where are the shaded seats at ${name}?`} style={boxStyle}>
        <p style={{ margin: 0 }}>
          With the roof closed, every seat at <strong>{name}</strong> is shaded. We haven&apos;t been
          able to measure which way the field runs (the roof is closed in every aerial photo), so we
          can&apos;t yet say which sideline shades first when it&apos;s open.
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

  const game = milbGame ? `the ${milbGame.time} game on ${milbGame.date}` : 'a 1:05 PM game';
  if (milbGame && !milbGame.sides) {
    return (
      <section className="shade-answer" aria-label={`Where are the shaded seats at ${name}?`} style={boxStyle}>
        <p style={{ margin: 0 }}>
          For {game} at <strong>{name}</strong>, the sun is down for the whole game, so every seat is
          out of the sun.
        </p>
      </section>
    );
  }

  const [side, secondSide] = milbGame?.sides ?? milbShadeSides;
  return (
    <section className="shade-answer" aria-label={`Where are the shaded seats at ${name}?`} style={boxStyle}>
      <p style={{ margin: 0 }}>
        For {game} at <strong>{name}</strong>,{' '}
        {side ? (
          <>
            the <strong>{side}</strong>
            {secondSide && <> and the <strong>{secondSide}</strong></>}{' '}
            {secondSide ? 'tend' : 'tends'} to shade first, going by the way the park faces and the
            sun&apos;s path.
          </>
        ) : (
          <>
            the sun is behind the outfield for most of the game, so no side of the infield seating
            has a clear edge. Seats under a roof or overhang are the surest shade.
          </>
        )}{' '}
        {milbGame?.sunset && <>The sun sets at {milbGame.sunset}. </>}
        We don&apos;t have a seating map for this park, so we can&apos;t say which sections or rows.{' '}
        <Link href="/how-it-works" style={{ fontWeight: 600, textDecoration: 'underline' }}>
          How we work this out
        </Link>
        .
      </p>
    </section>
  );
}
