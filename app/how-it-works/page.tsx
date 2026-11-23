import { Metadata } from 'next';
import Link from 'next/link';
import { SHADE_DATA_VERIFIED_LABEL } from '../../src/data/shadeDataVerified';

export const metadata: Metadata = {
  title: 'How The Shadium Calculates Shade | Methodology',
  description:
    'How The Shadium works out sun and shade for every MLB section: the sun\'s position, the stands measured from lidar, the real game schedule, and the limits.',
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
        For any MLB game, The Shadium works out which sections are in the sun or the shade as
        the game goes on. It needs four things: where the sun is, the shape of the stands, the
        real start time and, in the full finder, the weather.
      </p>

      <h2>1. Sun position — NREL&apos;s Solar Position Algorithm</h2>
      <p>
        For any date, time, and place we compute the sun&apos;s <strong>azimuth</strong>{' '}
        (compass direction) and <strong>elevation</strong> (height above the horizon) with the{' '}
        <a href="https://www.nrel.gov/docs/fy08osti/34302.pdf" target="_blank" rel="noopener noreferrer">
          Solar Position Algorithm
        </a>{' '}
        of the U.S. National Renewable Energy Laboratory, including atmospheric refraction. We
        check it against the worked example in NREL&apos;s paper and against NOAA&apos;s solar
        calculator at every park.
      </p>

      <h2>2. The stands, decks and roofs</h2>
      <p>
        Each section&apos;s place in the park comes from the club&apos;s seating chart. At 24
        parks, the height and steepness of the stands, and the decks and roofs over them, are
        measured from USGS lidar scans: laser measurements of the ground and buildings, flown
        from aircraft. A few decks the scans can&apos;t see are estimated. At Chase Field,
        American Family Field and loanDepot park no scan shows the roof open, so their stands
        are estimated, with the layout and roof edges taken from aerial photos. Globe Life Field
        and Rogers Centre use a generic stand shape. Tropicana Field has a fixed roof, so every
        seat is shaded.
      </p>
      <p>
        From these we trace the shadows the stands, the deck above and the roof throw over each
        section&apos;s rows, every half hour of the game. Each section&apos;s answer is labelled
        High, Medium or Low confidence. It&apos;s High when the answer at every half hour stays
        the same if the park&apos;s direction is off by its measured error, or the stands are
        10% taller or shorter (50% where they&apos;re estimated). It&apos;s Medium when one or
        two half hours change, and Low when more do. At 27 parks we check the map against
        published reports of where the shade fell at real games.
      </p>

      <h2>3. Game schedule — MLB StatsAPI</h2>
      <p>
        Shade depends entirely on the real first-pitch time, so we use official MLB schedule data
        (MLB Advanced Media) to tie every calculation to the actual game you pick, in the
        stadium&apos;s local time zone.
      </p>

      <h2>4. Weather — Open-Meteo</h2>
      <p>
        The MLB shade map shows a clear day: clouds aren&apos;t counted. The full stadium finder,
        used for MiLB and NFL venues, shows the forecast cloud cover and conditions from{' '}
        <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">
          Open-Meteo
        </a>
        .
      </p>

      <h2>Accuracy &amp; limitations (the honest part)</h2>
      <ul>
        <li>
          At retractable-roof parks the map shows the roof <strong>open</strong>. With it closed,
          every seat is shaded, and whether it&apos;s open is up to the team on the day.
        </li>
        <li>
          Where the stands are estimated, more sections are labelled Medium or Low confidence.
        </li>
        <li>
          The map gives one answer for each row of a section. Where a roof&apos;s edge crosses a
          section at an angle, one end of a row can shade a little before the other.
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
        Ready to pick your seats? <Link href="/stadiums">Browse all stadium sun guides →</Link>
      </p>
    </div>
  );
}
