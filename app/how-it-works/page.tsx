import { Metadata } from 'next';
import Link from 'next/link';
import { SHADE_DATA_VERIFIED_LABEL } from '../../src/data/shadeDataVerified';

export const metadata: Metadata = {
  title: 'How The Shadium Calculates Shade | Methodology',
  description:
    'How The Shadium separates astronomical sun position, source-backed seating inventory, modeled stadium geometry, weather, and MLB schedule data — including the publication boundary.',
  alternates: { canonical: 'https://theshadium.com/how-it-works' },
};

export default function HowItWorksPage() {
  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '2rem 1.25rem', lineHeight: 1.65 }}>
      <nav aria-label="Breadcrumb" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
        <Link href="/">Home</Link> / <span>How It Works</span>
      </nav>

      <h1>How The Shadium calculates shade</h1>
      <p>
        The Shadium separates four inputs: where the sun is in the sky, what is known about
        the venue, the weather, and the real game schedule. A reliable sun position does not
        make unmeasured stadium geometry reliable, so each field has its own confidence status.
      </p>

      <h2>1. Sun position — NOAA Solar Calculator</h2>
      <p>
        For any date, time, and location we compute the sun&apos;s <strong>azimuth</strong>
        (compass direction) and <strong>elevation</strong> (height above the horizon) using the{' '}
        <a href="https://gml.noaa.gov/grad/solcalc/" target="_blank" rel="noopener noreferrer">
          NOAA Global Monitoring Laboratory Solar Calculator
        </a>
        , based on Jean Meeus&apos;s <em>Astronomical Algorithms</em>, including atmospheric
        refraction. This tells us the apparent direction sunlight is coming from at first pitch
        and throughout the game. Typical agreement with NREL SPA is within 0.01°.
      </p>

      <h2>2. Stadium orientation &amp; geometry</h2>
      <p>
        MLB section identities come from published club charts or club-linked maps. Orientation
        has a recorded precision range. Horizontal placement, row elevations and depths,
        overhang dimensions, and obstruction meshes are separate fields; the current MLB row
        and obstruction geometry is modeled rather than surveyed.
      </p>

      <h2>3. Weather — Open-Meteo</h2>
      <p>
        Clear-sky geometry is only half the story. We pull cloud-cover and conditions from{' '}
        <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">
          Open-Meteo
        </a>{' '}
        so a heavily overcast forecast is reflected in what you should actually expect at the game.
      </p>

      <h2>4. Game schedule — MLB StatsAPI</h2>
      <p>
        Shade depends entirely on the real first-pitch time, so we use official MLB schedule data
        (MLB Advanced Media) to tie every calculation to the actual game you pick, in the
        stadium&apos;s local time zone.
      </p>

      <h2>Accuracy &amp; limitations (the honest part)</h2>
      <ul>
        <li>
          Exact MLB section and row results are <strong>not currently published</strong>. The
          internal geometry model is useful for engineering, but it has not passed the measured-
          geometry and independent shadow-observation release gate.
        </li>
        <li>
          A published seating map proves section identity and order; it does not prove row depth,
          rake, elevation, overhang depth, roof height, or the shadow boundary.
        </li>
        <li>
          Weather changes fast. A forecast is not a measurement, and passing clouds or an
          open/closed retractable roof can change conditions at game time.
        </li>
        <li>
          The general venue dataset was last reviewed on <strong>{SHADE_DATA_VERIFIED_LABEL}</strong>. Teams
          rename parks, tarp sections, and occasionally change home venues — we update as we learn
          of changes.
        </li>
        <li>
          The Shadium is an independent tool and is <strong>not affiliated with</strong> MLB, MiLB,
          the NFL, or any team.
        </li>
      </ul>

      <p>
        Ready to review the evidence? <Link href="/stadiums">Browse all stadium sun guides →</Link>
      </p>
    </div>
  );
}
