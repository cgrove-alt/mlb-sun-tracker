// Deliberately a SERVER component: this renders the largest chunk of the venue
// page (header, sections table, FAQ) and uses no state, effects or handlers.
// It was marked 'use client', which forced the whole subtree to hydrate on the
// client for nothing. The two genuinely interactive children
// (StadiumTitleBlock, InteractiveSeatingBowl) carry their own 'use client', so
// they still hydrate — only they do.
import React from 'react';
import { Stadium } from '../../../src/data/stadiums';
import type { StadiumSection } from '../../../src/data/stadiumSectionTypes';
import { StadiumAmenities } from '../../../src/data/stadiumAmenities';
import StadiumTitleBlock from '../../../src/components/StadiumTitleBlock';
import { StadiumTitleData } from '../../../src/components/StadiumTitleBlock';
import { ShadeAnswer } from '../../../src/components/ShadeAnswer';
import { ShadeConfidenceNotice } from '../../../src/components/ShadeConfidenceNotice';
import { InteractiveSeatingBowl } from '../../../src/components/InteractiveSeatingBowl';
import { shadeTierOf, type ShadeTier } from '../../../src/utils/sectionShadeTier';
import { buildSeasonalShadeCopy } from '../../../src/utils/seasonalShade';
import { getOrientationProvenance, getOrientationPrecision } from '../../../src/data/stadiumOrientationProvenance';
import { stadiumHistories } from '../../../src/data/stadiumDetails';
import { canPublishVenueSeatShade } from '../../../src/data/stadiumShadeConfidence';
import styles from './StadiumPageSSR.module.css';

interface StadiumPageSSRProps {
  stadium: Stadium;
  sections: StadiumSection[];
  amenities: StadiumAmenities | null;
  guide: any;
}

// Compass bearing of a side of the stadium from home plate, derived from the
// stadium's HP→CF orientation. Mirrors the convention in
// src/utils/sectionSunCalculations.ts.
function compassOf(orientation: number, side: 'firstBase' | 'thirdBase' | 'behindHome' | 'centerField'): number {
  const offset = side === 'firstBase' ? 90
               : side === 'thirdBase' ? -90
               : side === 'behindHome' ? 180
               : 0; // centerField
  return ((orientation + offset) % 360 + 360) % 360;
}

// A section located at compass `sectionCompass` is in its own shadow when
// the sun is "behind" the seats — i.e. on the same compass side as the
// section relative to the field center. Returns the name of the side most
// likely to be shaded for a given (orientation, approximate sun azimuth).
// The names read after a definite article ("the {name} falls into shade
// first"), which is how every caller renders them. "Behind home plate" and
// "Outfield (center field)" did not, and produced "the behind home plate falls
// into shade first" on every park whose home-plate side shades first.
function shadedSide(orientation: number, sunCompass: number): 'First base side' | 'Third base side' | 'Seating behind home plate' | 'Outfield seating beyond center field' {
  const sides = [
    { name: 'First base side' as const,        compass: compassOf(orientation, 'firstBase') },
    { name: 'Third base side' as const,        compass: compassOf(orientation, 'thirdBase') },
    { name: 'Seating behind home plate' as const, compass: compassOf(orientation, 'behindHome') },
    { name: 'Outfield seating beyond center field' as const, compass: compassOf(orientation, 'centerField') },
  ];
  let best = sides[0];
  let bestDiff = 360;
  for (const s of sides) {
    let d = Math.abs(sunCompass - s.compass);
    if (d > 180) d = 360 - d;
    if (d < bestDiff) { bestDiff = d; best = s; }
  }
  return best.name;
}

// Approximate sun azimuth in Northern-Hemisphere summer (June–August) at
// mid-latitudes (35–45°N), measured in compass degrees. Reasonable for
// the static SEO recommendations; the live shade widget on this page uses
// the exact SunCalc-based calculation.
const APPROX_SUN_AZIMUTH: Record<'morning' | 'midday' | 'afternoon' | 'evening', number> = {
  morning: 90,    // 9–10am: ~E
  midday: 180,    // 1pm: ~S
  afternoon: 240, // 4pm: ~WSW
  evening: 280,   // 7pm: ~W
};


// Three-tier structural shade model — now shared with the MLB shade diagram so
// the two can never disagree. See src/utils/sectionShadeTier.ts.

// Seating-level display order + labels for the mobile "All Sections" card view.
const LEVEL_ORDER: Array<StadiumSection['level']> = ['field', 'lower', 'club', 'upper', 'suite'];
const LEVEL_LABEL: Record<StadiumSection['level'], string> = {
  field: 'Field Level',
  lower: 'Lower Level',
  club: 'Club Level',
  upper: 'Upper Level',
  suite: 'Suites',
};

// Shared per-section display data so the desktop table and the mobile cards
// stay identical (single source of the tier → rating/coverage/notes mapping).
function sectionRowData(section: StadiumSection, domed = false, geometryValidated = false) {
  if (!domed && !geometryValidated) {
    return {
      shadeRating: 0,
      coverageLabel: 'Unverified',
      bestTime: '—',
      notes: 'Section identity is source-backed; row and overhang geometry has not passed independent observation validation.',
      stars: 'Not rated',
    };
  }
  const tier = domed ? 'covered' : shadeTierOf(section);
  const shadeRating = tier === 'covered' ? 5 : tier === 'partial' ? 3 : section.level === 'upper' ? 2 : 1;
  const coverageLabel = tier === 'covered' ? '✓ Covered' :
    tier === 'partial' ? `◐ ${section.coveredRows || 'back rows'}` : '— Exposed';
  const bestTime = tier === 'covered' ? 'All day' :
    tier === 'partial' ? 'Day games (back rows)' : 'Evening games';
  const notes = tier === 'covered' ? (domed ? 'Permanent roof blocks direct sun' : 'Field-validated covered seating') :
    tier === 'partial' ? 'Overhang shade in the back rows only; front rows exposed' :
    section.level === 'upper' ? 'Exposed — some relief from self-shading late in the game' :
    'Exposed — little to no shade';
  const stars = '★'.repeat(shadeRating) + '☆'.repeat(5 - shadeRating);
  return { shadeRating, coverageLabel, bestTime, notes, stars };
}

export default function StadiumPageSSR({ stadium, sections, amenities, guide }: StadiumPageSSRProps) {

  // A fixed-roof (domed) stadium shades every seat regardless of sun angle, so
  // shade is roof-dependent, not section- or orientation-dependent. Treat every
  // section as covered and suppress the sun-angle / orientation copy below.
  const isDome = stadium.roof === 'fixed';
  const seatShadePublished = canPublishVenueSeatShade(stadium);
  const tierOf = (s: StadiumSection): ShadeTier => (isDome ? 'covered' : shadeTierOf(s));
  // Lower-confidence disclaimer for parks whose orientation is only estimated
  // (±15–20°): the diagram still helps, but the sun/shade boundary is fuzzier.
  const orientPrec = getOrientationPrecision(stadium.id);
  const orientProv = getOrientationProvenance(stadium.id);
  const orientationNote = (orientProv?.confidence !== 'verified' || orientPrec > 12)
    ? `Heads up: ${stadium.name}'s orientation is approximate (±${orientPrec}°), so sections right at the sun/shade edge are less certain here.`
    : null;

  // Seasonal copy computed from THIS park's latitude, not a fixed table.
  // Every venue used to print the same sentence per month, which said nothing
  // about the park: April's sun peaks at 52° in Seattle and 74° in Miami, and a
  // 20 ft deck lip correspondingly shades ~15 ft of seating in one and ~6 ft in
  // the other. See src/utils/seasonalShade.ts.
  const months = buildSeasonalShadeCopy(
    stadium.latitude,
    stadium.longitude,
    stadium.name,
    [3, 4, 5, 6, 7, 8, 9],
  ).map(m => ({ num: m.month, name: m.name, pattern: m.note, peakAltitudeDeg: m.peakAltitudeDeg }));

  // Derive the per-time-bucket "what's the sun like" tagline from the
  // stadium's actual orientation so it matches the recommendations below.
  const litSideAt = (bucket: keyof typeof APPROX_SUN_AZIMUTH) => {
    // The "lit" side at sunset is the side opposite the shaded side.
    const sun = APPROX_SUN_AZIMUTH[bucket];
    // Section is LIT when sun is OPPOSITE side (sun shines toward seats);
    // i.e. when sun compass is ~180° away from section compass.
    return shadedSide(stadium.orientation, (sun + 180) % 360);
  };
  const gameTimes = [
    { id: 'day', label: '1:00 PM', recommendation: 'Maximum sun exposure - shade essential' },
    // Reads as "Afternoon sun on the third base side" / "…on the seating
    // behind home plate". The old form stripped a trailing " side" and then
    // re-appended one, which only worked for the two base-line labels and
    // rendered "on the behind home plate side" for the rest.
    { id: 'afternoon', label: '4:00 PM', recommendation: `Afternoon sun on the ${litSideAt('afternoon').toLowerCase()}` },
    { id: 'evening', label: '7:00 PM', recommendation: 'Sunset glare possible in outfield sections' },
  ];

  // Group sections by shade characteristics (3-tier model; a dome makes all covered)
  const coveredSections = sections.filter(s => tierOf(s) === 'covered');
  const partialSections = sections.filter(s => tierOf(s) === 'partial');
  const upperDeckSections = sections.filter(s => s.level === 'upper' && tierOf(s) === 'exposed');
  const clubSections = sections.filter(s => s.level === 'club');
  const fieldSections = sections.filter(s => s.level === 'field');

  // Best shaded sections overall — fully covered first, then partial (back-row)
  // coverage, then the highest, value-priced exposed upper deck.
  const bestShadedSections = [
    ...coveredSections.slice(0, 5),
    ...partialSections.slice(0, 3),
    ...upperDeckSections.filter(s => s.price === 'value').slice(0, 2),
  ];

  // Orientation-derived shaded side for a 1 PM day game, using the same compass
  // model as the rest of the page. For an east-facing park (e.g. Yankee Stadium,
  // orientation 55°) this correctly yields the FIRST base side — not the naive
  // `orientation < 180 ? 'third base' : 'first base'` guess it replaces.
  const dayGameShadeSide = shadedSide(stadium.orientation, APPROX_SUN_AZIMUTH.midday).toLowerCase();

  return (
    <div className={styles.stadiumSsrPage}>
      {/* Hero Section with Stadium Info */}
      <section className={styles.stadiumHero}>
        <div className={styles.container}>
          {(() => {
            const stadiumHistory = stadiumHistories[stadium.id];
            const titleData: StadiumTitleData = {
              purpose: 'shade-guide',
              stadium: {
                name: stadium.name,
                id: stadium.id
              },
              team: {
                name: stadium.team,
                league: 'MLB'
              },
              quickFacts: {
                location: {
                  city: stadium.city,
                  state: stadium.state
                },
                capacity: stadium.capacity,
                orientation: stadium.orientation,
                roofType: stadium.roof,
                yearBuilt: stadiumHistory?.opened
              }
            };
            return (
              <StadiumTitleBlock
                data={titleData}
                showBreadcrumb={true}
              />
            );
          })()}
        </div>
      </section>

      {/* Answer-first summary — directly answers "where are the shaded seats" */}
      <ShadeAnswer name={stadium.name} orientation={stadium.orientation} roof={stadium.roof} />
      <ShadeConfidenceNotice stadiumId={stadium.id} roof={stadium.roof} />

      {/* Best Shaded Sections */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2>{isDome ? `Direct Sun at ${stadium.name}` : `Seat-Level Shade at ${stadium.name}`}</h2>
          {isDome ? (
            <p>{stadium.name} has a permanent roof, so direct sunlight does not reach the seating bowl. We do not rank rows because detailed row geometry is not needed for that roof-level result.</p>
          ) : seatShadePublished ? (
            <>
              <p>These sections passed the measured-geometry publication gate:</p>
              <div className={styles.sectionsGrid}>
              {bestShadedSections.map((section, idx) => (
              <div key={section.id} className={styles.sectionCard}>
                <div className={styles.sectionRank}>#{idx + 1}</div>
                <h3>{section.name}</h3>
                <ul className={styles.sectionFeatures}>
                  <li>Level: {section.level}</li>
                  {tierOf(section) === 'covered' && <li className={styles.covered}>✓ Covered</li>}
                  {tierOf(section) === 'partial' && <li className={styles.covered}>◐ Covered {section.coveredRows || 'back rows only'}</li>}
                  {section.price && <li>Price: {section.price}</li>}
                  {section.rows && <li>Rows: {section.rows}</li>}
                </ul>
                {tierOf(section) === 'covered' && (
                  <p className={styles.sectionNote}>Field-validated covered seating</p>
                )}
                {tierOf(section) === 'partial' && (
                  <p className={styles.sectionNote}>Shade in the {section.coveredRows || 'back rows'} under the overhang; front rows exposed</p>
                )}
              </div>
              ))}
              </div>
            </>
          ) : (
            <div className={styles.sectionCard} role="status">
              <h3>Recommendations paused</h3>
              <p>We have the published section inventory and are locating remote metric sources for row depths, elevations, overhangs, and obstruction geometry. We will not rank sections or rows until reconstructed measurements pass independent shadow validation.</p>
            </div>
          )}
        </div>
      </section>

      {/* Seasonal Shade Patterns */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2>Seasonal Sun Position</h2>
          {isDome ? (
          <p>{stadium.name} has a fixed roof and is climate-controlled, so shade doesn&apos;t vary by month or game time — every seat is protected from sun and rain all season.</p>
          ) : (
          <>
          <p>The sun&apos;s path changes throughout the season. These astronomical values do not identify exact shaded rows:</p>

          <div className={styles.monthsGrid}>
            {months.map(month => (
              <div key={month.num} className={styles.monthCard}>
                <h3>{month.name}</h3>
                <p className={styles.monthPattern}>{month.pattern}</p>
                <div className={styles.monthRecommendations}>
                  <h4>Peak sun angle:</h4>
                  <ul>
                    <li>{Math.round(month.peakAltitudeDeg)}° above the horizon at midday</li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
          </>
          )}
        </div>
      </section>

      {/* Game Time Recommendations */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2>Sun Context by Game Time</h2>
          {isDome ? (
          <p>With a fixed roof, {stadium.name} shades every seat at any start time — 1 PM day games are as protected as 7 PM night games.</p>
          ) : (
          <>
          <p>These are broad solar-orientation notes, not section or row recommendations.</p>
          <div className={styles.timeGrid}>
            {gameTimes.map(time => (
              <div key={time.id} className={styles.timeCard}>
                <h3>{time.label} Games</h3>
                <p>{time.recommendation}</p>
                <div className={styles.timeSections}>
                  <h4>Orientation-only context:</h4>
                  {time.id === 'day' && (
                    <ul>
                      <li>{shadedSide(stadium.orientation, APPROX_SUN_AZIMUTH.midday)} is oriented to self-shade earlier in the model.</li>
                      <li>Exact section boundaries require measured geometry.</li>
                    </ul>
                  )}
                  {time.id === 'afternoon' && (
                    <ul>
                      <li>{shadedSide(stadium.orientation, APPROX_SUN_AZIMUTH.afternoon)} is oriented to self-shade earlier in the model.</li>
                      <li>Roof state can change the result at retractable-roof parks.</li>
                    </ul>
                  )}
                  {time.id === 'evening' && (
                    <ul>
                      <li>Low western sun can create glare before sunset.</li>
                      <li>No exact shade time is published without independent observation validation.</li>
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
          </>
          )}
        </div>
      </section>

      {/* Section Details Table */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2>{isDome ? 'Section Inventory and Roof Status' : 'Section Inventory and Measurement Status'}</h2>
          <p>{isDome
            ? 'The section names below are source-backed; the permanent-roof result applies throughout the seating bowl.'
            : 'Section names are source-backed. Shade ratings are withheld until metric geometry is remotely measured and independently validated.'}</p>

          {/* Desktop: full table (hidden < 768px) */}
          <div className={`${styles.sectionsTableWrapper} ${styles.desktopOnly}`}>
            <table className={styles.sectionsTable}>
              <thead>
                <tr>
                  <th>Section</th>
                  <th>Level</th>
                  <th>Coverage</th>
                  <th>Shade Rating</th>
                  <th>Best Time</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {sections.map(section => {
                  const { shadeRating, coverageLabel, bestTime, notes, stars } = sectionRowData(section, isDome, seatShadePublished);
                  return (
                    <tr key={section.id}>
                      <td>{section.name}</td>
                      <td>{section.level}</td>
                      <td>{coverageLabel}</td>
                      <td>
                        <span className={`${styles.rating} ${styles[`rating${shadeRating}`]}`}>{stars}</span>
                      </td>
                      <td>{bestTime}</td>
                      <td>{notes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile: collapsible cards grouped by seating level (shown < 768px).
              Uses native <details> so it works without JS and stays crawlable. */}
          <div className={styles.mobileOnly}>
            {LEVEL_ORDER.map(level => {
              const levelSections = sections.filter(s => s.level === level);
              if (!levelSections.length) return null;
              return (
                <details key={level} className={styles.levelGroup} open>
                  <summary className={styles.levelSummary}>
                    <span>{LEVEL_LABEL[level]}</span>
                    <span className={styles.levelCount}>{levelSections.length} sections</span>
                  </summary>
                  <ul className={styles.sectionCards}>
                    {levelSections.map(section => {
                      const { shadeRating, coverageLabel, bestTime, notes, stars } = sectionRowData(section, isDome, seatShadePublished);
                      return (
                        <li key={section.id} className={styles.sectionCard}>
                          <div className={styles.sectionCardHead}>
                            <span className={styles.sectionCardName}>{section.name}</span>
                            <span className={`${styles.rating} ${styles[`rating${shadeRating}`]}`}>{stars}</span>
                          </div>
                          <div className={styles.sectionCardMeta}>{coverageLabel} · {bestTime}</div>
                          <p className={styles.sectionCardNotes}>{notes}</p>
                        </li>
                      );
                    })}
                  </ul>
                </details>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sun Protection Tips */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2>Sun Protection Tips for {stadium.name}</h2>
          <div className={styles.tipsGrid}>
            <div className={styles.tipCard}>
              <h3>☀️ Peak Sun Hours</h3>
              <p>The sun is strongest between 11 AM and 4 PM. Day games at {stadium.name} will have maximum sun exposure during these hours.</p>
            </div>
            <div className={styles.tipCard}>
              <h3>🧴 Sunscreen Stations</h3>
              <p>
                {amenities?.amenities.filter(a => a.type === 'sunscreen_kiosk').length 
                  ? `Free sunscreen available at ${amenities.amenities.filter(a => a.type === 'sunscreen_kiosk').length} locations`
                  : 'Bring your own sunscreen - SPF 30+ recommended'}
              </p>
            </div>
            <div className={styles.tipCard}>
              <h3>🧢 Recommended Gear</h3>
              <ul>
                <li>Wide-brimmed hat or cap with neck protection</li>
                <li>Sunglasses with UV protection</li>
                <li>Light-colored, loose-fitting clothing</li>
                <li>Portable shade umbrella (check stadium policy)</li>
              </ul>
            </div>
            <div className={styles.tipCard}>
              <h3>💧 Stay Hydrated</h3>
              <p>Drink water regularly, especially during day games. {stadium.name} has water fountains on each level.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stadium Amenities */}
      {amenities && (
        <section className={styles.section}>
          <div className={styles.container}>
            <h2>Shade-Related Amenities</h2>
            <div className={styles.amenitiesGrid}>
              <div className={styles.amenityCategory}>
                <h3>Covered Concourse Areas</h3>
                <p>Concourse coverage and access can vary. Confirm current shelter and access information in the club&apos;s official venue guide.</p>
              </div>
              <div className={styles.amenityCategory}>
                <h3>Indoor Spaces</h3>
                <ul>
                  <li>Club lounges with AC (Club level ticket required)</li>
                  <li>Team stores and restaurants</li>
                  <li>First aid stations with cooling areas</li>
                </ul>
              </div>
              <div className={styles.amenityCategory}>
                <h3>Family Areas</h3>
                {amenities.amenities.filter(a => a.type === 'family_area').map(area => (
                  <div key={area.id}>
                    <p>{area.name} - Level {area.level}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2>Frequently Asked Questions</h2>
          
          <div className={styles.faqItem}>
            <h3>What are the best shaded seats at {stadium.name} for a 1 PM game?</h3>
            <p>{isDome
              ? `${stadium.name} has a fixed roof, so every seat is shaded for a 1 PM game — no section is exposed to direct sun regardless of where you sit.`
              : seatShadePublished
                ? `Measured geometry indicates the ${dayGameShadeSide} self-shades first for this solar position.`
                : `The orientation model suggests the ${dayGameShadeSide} may self-shade first, but we do not publish section or row recommendations without measured, independently validated geometry.`}</p>
          </div>

          <div className={styles.faqItem}>
            <h3>Which sections have covered seating?</h3>
            <p>
              {isDome
                ? `${stadium.name}'s permanent roof blocks direct sunlight throughout the seating bowl.`
                : seatShadePublished
                  ? 'The validated section measurements are listed in the table above.'
                  : 'The published seating map confirms section identities, but it does not provide the row-by-row overhang dimensions needed to verify a covered-row list. We therefore do not publish one.'}
            </p>
            {seatShadePublished && (coveredSections.length > 0 || partialSections.length > 0) && (
              <details>
                <summary>See the full covered-section list</summary>
                {coveredSections.length > 0 && (
                  <p><strong>Fully covered (all rows):</strong> {coveredSections.map(s => s.name).join(', ')}.</p>
                )}
                {partialSections.length > 0 && (
                  <p><strong>Back rows only (overhang/roof):</strong> {partialSections.map(s => s.name).join(', ')}.</p>
                )}
              </details>
            )}
          </div>
          
          <div className={styles.faqItem}>
            <h3>How early does shade reach the lower bowl?</h3>
            <p>We do not publish an inning or clock-time estimate for the lower bowl until the park&apos;s row and obstruction geometry has been measured and checked against independent shadow observations.</p>
          </div>
          
          <div className={styles.faqItem}>
            <h3>Are there shaded standing room areas?</h3>
            <p>Standing-room and concourse access can change by event and ticket type. Check the club&apos;s current venue guide; this model does not certify those spaces as shade shelters.</p>
          </div>
        </div>
      </section>

      {/* Interactive section-level shade guide — placed below the section tables
          (below the fold) so it is never the LCP element. MLB only. */}
      {seatShadePublished ? <InteractiveSeatingBowl
        sections={sections}
        orientation={stadium.orientation}
        latitude={stadium.latitude}
        longitude={stadium.longitude}
        timezone={stadium.timezone}
        roof={stadium.roof}
        name={stadium.name}
        orientationNote={orientationNote}
      /> : (
        <section className={styles.section} aria-labelledby="interactive-model-paused">
          <div className={styles.container}>
            <h2 id="interactive-model-paused">Interactive shade model paused</h2>
            <p>The colored section model is hidden because its precise boundaries would imply more measurement confidence than the current data supports.</p>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className={styles.stadiumCta}>
        <div className={styles.container}>
          <h2>Plan Your Visit to {stadium.name}</h2>
          <p>Browse the source-backed section inventory and solar-orientation context. Exact seat-level shade results will return only after measured geometry passes independent validation.</p>
          
          <div className={styles.ctaButtons}>
            <a href={`/?stadium=${stadium.id}`} className={`${styles.btn} ${styles.btnPrimary}`}>
              View Stadium Context
            </a>
            <a href="/stadiums" className={`${styles.btn} ${styles.btnSecondary}`}>
              View All Stadiums
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
