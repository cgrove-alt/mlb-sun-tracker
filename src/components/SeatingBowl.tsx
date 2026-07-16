import React from 'react';
import type { StadiumSection } from '../data/stadiumSectionTypes';

// At-a-glance seating-bowl diagram (audit Phase 8). Server-rendered SVG that
// colours each section by its shade status for a representative 1 PM day game,
// so a reader can see where the shade is without reading the full table.
//
// Coordinate model (matches sectionSunCalculations / the section data):
//   section baseAngle is STADIUM-LOCAL — 0 = first base, 90 = center field,
//   180 = third base, 270 = behind home plate. We draw local angle L at SVG
//   direction θ = −L (so CF is at the top, home plate at the bottom).

type Shade = 'covered' | 'partial' | 'geo-shade' | 'sun';

const COLORS: Record<Shade, string> = {
  covered: '#1e3a5f', // fully covered — shaded all game
  partial: '#60a5fa', // back rows covered
  'geo-shade': '#bfdbfe', // exposed but self-shaded side at 1 PM
  sun: '#f6c453', // exposed, sunlit side at 1 PM
};

const norm = (deg: number) => ((deg % 360) + 360) % 360;
const angDist = (a: number, b: number) => {
  const d = Math.abs(norm(a) - norm(b)) % 360;
  return d > 180 ? 360 - d : d;
};

// Section center as a real compass bearing, from the stadium's HP→CF orientation.
function sectionCompass(orientation: number, baseAngle: number, angleSpan: number): number {
  return norm(orientation + 90 - (baseAngle + angleSpan / 2));
}

const MIDDAY_SUN_AZIMUTH = 180; // ~S at 1 PM

function shadeOf(s: StadiumSection, orientation: number, domed: boolean): Shade {
  if (domed || s.covered) return 'covered';
  if (s.partialCoverage) return 'partial';
  // Exposed: shaded when the section faces away from the midday sun (the sun is
  // "behind" the seats), i.e. its compass is near the sun azimuth.
  const shaded = angDist(sectionCompass(orientation, s.baseAngle, s.angleSpan), MIDDAY_SUN_AZIMUTH) < 90;
  return shaded ? 'geo-shade' : 'sun';
}

// SVG point for stadium-local angle L (degrees), y-up-then-flipped for canvas.
function pt(cx: number, cy: number, r: number, localDeg: number): [number, number] {
  const a = (localDeg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy - r * Math.sin(a)];
}

function wedgePath(cx: number, cy: number, rIn: number, rOut: number, a0: number, a1: number): string {
  const [x0o, y0o] = pt(cx, cy, rOut, a0);
  const [x1o, y1o] = pt(cx, cy, rOut, a1);
  const [x1i, y1i] = pt(cx, cy, rIn, a1);
  const [x0i, y0i] = pt(cx, cy, rIn, a0);
  const large = a1 - a0 > 180 ? 1 : 0;
  // Local angle increases counter-clockwise in canvas coords (y flipped), so the
  // outer arc a0→a1 uses sweep 0 and the inner arc a1→a0 uses sweep 1.
  return `M ${x0o} ${y0o} A ${rOut} ${rOut} 0 ${large} 0 ${x1o} ${y1o} L ${x1i} ${y1i} A ${rIn} ${rIn} 0 ${large} 1 ${x0i} ${y0i} Z`;
}

export function SeatingBowl({
  sections,
  orientation,
  roof,
  name,
  sport = 'baseball',
}: {
  sections: StadiumSection[];
  orientation: number;
  roof?: string;
  name: string;
  sport?: 'baseball' | 'football';
}) {
  const drawable = sections.filter(
    (s) => typeof s.baseAngle === 'number' && typeof s.angleSpan === 'number' && s.angleSpan > 0,
  );
  if (drawable.length < 6) return null; // not enough geometry to be useful

  const domed = roof === 'fixed';
  const cx = 170;
  const cy = 170;
  const rIn = 80;
  const rOut = 150;

  const counts = { covered: 0, partial: 0, 'geo-shade': 0, sun: 0 } as Record<Shade, number>;
  const wedges = drawable.map((s, i) => {
    const shade = shadeOf(s, orientation, domed);
    counts[shade]++;
    return (
      <path
        key={s.id ?? i}
        d={wedgePath(cx, cy, rIn, rOut, s.baseAngle, s.baseAngle + s.angleSpan)}
        fill={COLORS[shade]}
        stroke="#ffffff"
        strokeWidth={0.75}
      />
    );
  });

  const label = (localDeg: number, text: string) => {
    const [x, y] = pt(cx, cy, rOut + 16, localDeg);
    return (
      <text x={x} y={y} fontSize={12} fill="#475569" textAnchor="middle" dominantBaseline="middle">
        {text}
      </text>
    );
  };

  const legend: Array<[Shade, string]> = [
    ['covered', 'Covered (shaded all game)'],
    ['partial', 'Back rows covered'],
    ['geo-shade', 'Shaded side at 1 PM'],
    ['sun', 'Sunny side at 1 PM'],
  ];

  return (
    <section
      aria-label={`Seating-bowl shade diagram for ${name}`}
      style={{ margin: '1.5rem auto', maxWidth: 1200, padding: '1rem 1.25rem' }}
    >
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>
        At a glance: shade for a 1 PM game
      </h2>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.75rem' }}>
        {domed
          ? `${name} has a fixed roof, so the whole bowl is shaded.`
          : 'Each wedge is a seating section, shaded by its likely sun exposure at first pitch.'}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
        <svg
          width={340}
          height={340}
          viewBox="0 0 340 340"
          role="img"
          aria-label={`${name} seating bowl colored by shade`}
        >
          {/* field */}
          <circle cx={cx} cy={cy} r={rIn - 6} fill="#eaf4e6" stroke="#cbd5e1" strokeWidth={1} />
          <text x={cx} y={cy} fontSize={12} fill="#94a3b8" textAnchor="middle" dominantBaseline="middle">
            Field
          </text>
          {wedges}
          {/* orientation labels (baseball diamond only) */}
          {sport === 'baseball' && label(0, '1B')}
          {sport === 'baseball' && label(90, 'CF')}
          {sport === 'baseball' && label(180, '3B')}
          {sport === 'baseball' && label(270, 'Home')}
        </svg>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem' }}>
          {legend.map(([k, text]) => (
            <li key={k} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-block',
                  width: 16,
                  height: 16,
                  borderRadius: 3,
                  background: COLORS[k],
                  border: '1px solid #cbd5e1',
                  marginRight: 8,
                }}
              />
              {text} <span style={{ color: '#9ca3af', marginLeft: 6 }}>({counts[k]})</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
