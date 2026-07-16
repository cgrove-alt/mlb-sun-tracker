import { Metadata } from 'next';
import Link from 'next/link';
import { SHADE_DATA_VERIFIED_LABEL } from '../../src/data/shadeDataVerified';

export const metadata: Metadata = {
  title: 'How The Shadium Calculates Shade | Methodology',
  description:
    'How The Shadium calculates shaded seats: the NREL Solar Position Algorithm for sun position, per-venue orientation and geometry, Open-Meteo weather, and MLB schedule data — plus an honest look at accuracy and limitations.',
  alternates: { canonical: 'https://theshadium.com/how-it-works' },
};

export default function HowItWorksPage() {
  return (
    <main style={{ maxWidth: 820, margin: '0 auto', padding: '2rem 1.25rem', lineHeight: 1.65 }}>
      <nav aria-label="Breadcrumb" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
        <Link href="/">Home</Link> / <span>How It Works</span>
      </nav>

      <h1>How The Shadium calculates shade</h1>
      <p>
        The Shadium predicts which seats will be in the sun or shade for a specific game by
        combining four inputs: where the sun is in the sky, how each venue is built and
        oriented, the weather, and the real game schedule. Here is exactly how each piece works.
      </p>

      <h2>1. Sun position — NREL Solar Position Algorithm</h2>
      <p>
        For any date, time, and location we compute the sun&apos;s <strong>azimuth</strong>
        (compass direction) and <strong>elevation</strong> (height above the horizon) using a
        solar position algorithm based on the{' '}
        <a href="https://midcdmc.nrel.gov/spa/" target="_blank" rel="noopener noreferrer">
          NREL Solar Position Algorithm
        </a>
        . This tells us the precise direction sunlight is coming from at first pitch and
        throughout the game.
      </p>

      <h2>2. Stadium orientation &amp; geometry</h2>
      <p>
        Each venue has a verified <strong>orientation</strong> — the compass bearing from home
        plate to center field — plus per-section geometry (which way a section faces, its
        distance from the field, and the height of the deck or roof above it). Combining the
        sun&apos;s direction with a section&apos;s orientation tells us whether that section is
        facing into the sun or shaded by the structure around it. Sections under an overhang or
        roof are modeled as covered in their back rows.
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
          Our section-level model is an <strong>approximation</strong>. It captures which side of
          the park shades first and which levels have overhead cover, but real bowls curve and
          individual rows vary — treat results as a strong guide, not a guarantee.
        </li>
        <li>
          Overhang and roof coverage is <strong>modeled by row</strong>: we mark the back rows of
          covered levels as shaded and the front rows as exposed. The exact cutoff row differs by
          venue and isn&apos;t individually surveyed for every section.
        </li>
        <li>
          Weather changes fast. A forecast is not a measurement, and passing clouds or an
          open/closed retractable roof can change conditions at game time.
        </li>
        <li>
          Venue data was last verified on <strong>{SHADE_DATA_VERIFIED_LABEL}</strong>. Teams
          rename parks, tarp sections, and occasionally change home venues — we update as we learn
          of changes.
        </li>
        <li>
          The Shadium is an independent tool and is <strong>not affiliated with</strong> MLB, MiLB,
          the NFL, or any team.
        </li>
      </ul>

      <p>
        Ready to check your seats? <Link href="/stadiums">Browse all stadium shade guides →</Link>
      </p>
    </main>
  );
}
