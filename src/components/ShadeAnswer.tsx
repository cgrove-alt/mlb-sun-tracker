import Link from 'next/link';
import { bestShadedSideForDayGame } from '../utils/shadeSide';

// "Answer-first" summary at the top of every venue page (audit Phase 7):
// Answer-first summary that states the strongest conclusion the available data
// supports. Orientation is useful context, but it cannot identify exact rows
// without measured metric geometry.
export function ShadeAnswer({
  name,
  orientation,
  roof,
}: {
  name: string;
  orientation: number;
  roof?: string;
}) {
  const side = bestShadedSideForDayGame(orientation);
  const domed = roof === 'fixed';

  return (
    <section
      className="shade-answer"
      aria-label={`Where are the shaded seats at ${name}?`}
      style={{
        margin: '1rem auto 1.5rem',
        maxWidth: '1200px',
        padding: '1rem 1.25rem',
        borderRadius: '0.75rem',
        borderLeft: '4px solid #2563eb',
        background: '#eff6ff',
        color: '#1e3a5f',
        lineHeight: 1.6,
      }}
    >
      <p style={{ margin: 0 }}>
        {domed ? (
          <>
            <strong>{name}</strong> has a fixed roof, so every seat is shaded from direct
            sun for the entire game, regardless of start time.
          </>
        ) : (
          <>
            For a day game at <strong>{name}</strong>, the orientation model indicates the{' '}
            <strong>{side}</strong> is more likely to self-shade first. Exact sections,
            rows, and transition times are not published until metric geometry has
            been measured and independently validated.
          </>
        )}{' '}
        <Link href="/how-it-works" style={{ fontWeight: 600, textDecoration: 'underline' }}>
          See how we calculate this
        </Link>
        .
      </p>
    </section>
  );
}
