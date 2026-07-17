'use client';

import React from 'react';
import Link from 'next/link';
import { Stadium } from '../../../src/data/stadiums';
import type { StadiumSection } from '../../../src/data/stadiumSectionTypes';
import { StadiumAmenities } from '../../../src/data/stadiumAmenities';
import StadiumTitleBlock from '../../../src/components/StadiumTitleBlock';
import { StadiumTitleData } from '../../../src/components/StadiumTitleBlock';
import { ShadeAnswer } from '../../../src/components/ShadeAnswer';
import { InteractiveSeatingBowl } from '../../../src/components/InteractiveSeatingBowl';
import { stadiumHistories } from '../../../src/data/stadiumDetails';
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
function shadedSide(orientation: number, sunCompass: number): 'First base side' | 'Third base side' | 'Behind home plate' | 'Outfield (center field)' {
  const sides = [
    { name: 'First base side' as const,        compass: compassOf(orientation, 'firstBase') },
    { name: 'Third base side' as const,        compass: compassOf(orientation, 'thirdBase') },
    { name: 'Behind home plate' as const,      compass: compassOf(orientation, 'behindHome') },
    { name: 'Outfield (center field)' as const, compass: compassOf(orientation, 'centerField') },
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

// Get seasonal shade pattern
function getSeasonalPattern(month: number) {
  if (month === 3) return 'April: Sun sits lower on the horizon — most stadiums see more natural shade, especially during afternoon games';
  if (month === 4) return 'May: Sun angle climbs rapidly, shrinking shade coverage; evening games retain more shade than day games';
  if (month === 5) return 'June: Highest sun angle of the season near the summer solstice — minimal shade during day games, covered seats strongly recommended';
  if (month === 6) return 'July: Peak sun — day games see the least shade of the year; covered or back-row seats essential';
  if (month === 7) return 'August: Still-intense afternoon sun; upper-deck back rows and covered sections stay coolest';
  if (month === 8) return 'September: Sun angle dropping — natural shade returns, especially for late-afternoon starts';
  if (month >= 9 && month <= 10) return 'Fall: Lower sun angle provides more natural shade across the bowl';
  return 'Check specific game time for shade availability';
}

// Three-tier shade model (audit Phase 3): a section is fully Covered
// (indoor/roofed), Partial (only its back rows sit under an overhang / roof),
// or Exposed (open to the sky). Replaces the old binary covered/uncovered.
type ShadeTier = 'covered' | 'partial' | 'exposed';

function shadeTierOf(section: StadiumSection): ShadeTier {
  // Research-set full coverage wins (e.g. Angel Stadium Terrace — fully under
  // the deck overhangs, not just back rows).
  if (section.fullyCovered) return 'covered';
  // Explicit back-rows classification (researched venues: Yankees, White Sox) wins.
  if (section.partialCoverage) return 'partial';
  if (section.covered) {
    // Only indoor suite/club spaces are fully covered. A covered OPEN-BOWL
    // section (field/lower/upper) is shaded in its back rows only, under the
    // deck overhang — so it is Partial, not fully covered. This applies the
    // Phase-3 three-tier model to EVERY venue, not just the two with
    // hand-authored partialCoverage data.
    return section.level === 'suite' || section.level === 'club' ? 'covered' : 'partial';
  }
  return 'exposed';
}

export default function StadiumPageSSR({ stadium, sections, amenities, guide }: StadiumPageSSRProps) {

  // Pre-calculate shade data for common scenarios
  const months = [
    { num: 3, name: 'April', pattern: 'Lower sun angle — more shade available, especially in afternoon games' },
    { num: 4, name: 'May', pattern: 'Sun angle rising — shade coverage decreases, evening games best for comfort' },
    { num: 5, name: 'June', pattern: 'Near summer solstice — fewest shaded seats, covered sections essential' },
    { num: 6, name: 'July', pattern: 'Peak summer - maximum sun exposure' },
    { num: 7, name: 'August', pattern: 'Late summer - intense afternoon sun' },
    { num: 8, name: 'September', pattern: 'Early fall - decreasing sun angle' },
    { num: 9, name: 'October', pattern: 'Playoff season - comfortable temperatures' },
  ];

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
    { id: 'afternoon', label: '4:00 PM', recommendation: `Afternoon sun on the ${litSideAt('afternoon').toLowerCase().replace(/ side$/, '')} side` },
    { id: 'evening', label: '7:00 PM', recommendation: 'Sunset glare possible in outfield sections' },
  ];

  // Group sections by shade characteristics (3-tier model)
  const coveredSections = sections.filter(s => shadeTierOf(s) === 'covered');
  const partialSections = sections.filter(s => shadeTierOf(s) === 'partial');
  const upperDeckSections = sections.filter(s => s.level === 'upper' && shadeTierOf(s) === 'exposed');
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

      {/* Interactive at-a-glance seating bowl (pick a date/time) */}
      <InteractiveSeatingBowl
        sections={sections}
        orientation={stadium.orientation}
        latitude={stadium.latitude}
        longitude={stadium.longitude}
        timezone={stadium.timezone}
        roof={stadium.roof}
        name={stadium.name}
      />

      {/* Best Shaded Sections */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2>Best Shaded Seats at {stadium.name}</h2>
          <p>Based on stadium orientation and historical data, these sections offer the most shade:</p>
          
          <div className={styles.sectionsGrid}>
            {bestShadedSections.map((section, idx) => (
              <div key={section.id} className={styles.sectionCard}>
                <div className={styles.sectionRank}>#{idx + 1}</div>
                <h3>{section.name}</h3>
                <ul className={styles.sectionFeatures}>
                  <li>Level: {section.level}</li>
                  {shadeTierOf(section) === 'covered' && <li className={styles.covered}>✓ Covered</li>}
                  {shadeTierOf(section) === 'partial' && <li className={styles.covered}>◐ Covered {section.coveredRows || 'back rows only'}</li>}
                  {section.price && <li>Price: {section.price}</li>}
                  {section.rows && <li>Rows: {section.rows}</li>}
                </ul>
                {shadeTierOf(section) === 'covered' && (
                  <p className={styles.sectionNote}>Guaranteed shade — fully covered seating</p>
                )}
                {shadeTierOf(section) === 'partial' && (
                  <p className={styles.sectionNote}>Shade in the {section.coveredRows || 'back rows'} under the overhang; front rows exposed</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seasonal Shade Patterns */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2>Seasonal Shade Patterns</h2>
          <p>Shade availability varies significantly throughout the baseball season:</p>
          
          <div className={styles.monthsGrid}>
            {months.map(month => (
              <div key={month.num} className={styles.monthCard}>
                <h3>{month.name}</h3>
                <p className={styles.monthPattern}>{month.pattern}</p>
                <div className={styles.monthRecommendations}>
                  <h4>Recommendations:</h4>
                  <ul>
                    <li>{getSeasonalPattern(month.num)}</li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Game Time Recommendations */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2>Shade by Game Time</h2>
          <div className={styles.timeGrid}>
            {gameTimes.map(time => (
              <div key={time.id} className={styles.timeCard}>
                <h3>{time.label} Games</h3>
                <p>{time.recommendation}</p>
                <div className={styles.timeSections}>
                  <h4>Best Sections:</h4>
                  {time.id === 'day' && (
                    <ul>
                      <li>Upper deck sections (maximum elevation)</li>
                      <li>Covered/Club level areas</li>
                      <li>{shadedSide(stadium.orientation, APPROX_SUN_AZIMUTH.midday)}</li>
                    </ul>
                  )}
                  {time.id === 'afternoon' && (
                    <ul>
                      <li>{shadedSide(stadium.orientation, APPROX_SUN_AZIMUTH.afternoon)}</li>
                      <li>Behind home plate (upper levels)</li>
                      <li>Covered concourse areas</li>
                    </ul>
                  )}
                  {time.id === 'evening' && (
                    <ul>
                      <li>Most sections have shade by first pitch</li>
                      <li>Avoid outfield for sunset glare</li>
                      <li>Any covered section for guaranteed comfort</li>
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Details Table */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2>All Sections Shade Analysis</h2>
          <div className={styles.sectionsTableWrapper}>
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
                  const tier = shadeTierOf(section);
                  const shadeRating = tier === 'covered' ? 5 :
                                     tier === 'partial' ? 3 :
                                     section.level === 'upper' ? 2 : 1;
                  const coverageLabel = tier === 'covered' ? '✓ Covered' :
                                        tier === 'partial' ? `◐ ${section.coveredRows || 'back rows'}` :
                                        '— Exposed';
                  const bestTime = tier === 'covered' ? 'All day' :
                                  tier === 'partial' ? 'Day games (back rows)' :
                                  'Evening games';
                  const notes = tier === 'covered' ? 'Guaranteed shade — fully covered' :
                                tier === 'partial' ? 'Overhang shade in the back rows only; front rows exposed' :
                                section.level === 'upper' ? 'Exposed — some relief from self-shading late in the game' :
                                'Exposed — little to no shade';

                  return (
                    <tr key={section.id}>
                      <td>{section.name}</td>
                      <td>{section.level}</td>
                      <td>{coverageLabel}</td>
                      <td>
                        <span className={`${styles.rating} ${styles[`rating${shadeRating}`]}`}>
                          {'★'.repeat(shadeRating)}{'☆'.repeat(5 - shadeRating)}
                        </span>
                      </td>
                      <td>{bestTime}</td>
                      <td>{notes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
                <p>All club level and upper deck concourses provide shade and climate-controlled areas.</p>
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
            <p>For a 1 PM game, the {dayGameShadeSide} falls into shade first, so seats there and up in the back rows of the upper deck stay coolest.{coveredSections.length > 0 ? ` Fully covered sections like ${coveredSections.slice(0, 3).map(s => s.name).join(', ')} offer guaranteed shade all day.` : ''}</p>
          </div>

          <div className={styles.faqItem}>
            <h3>Which sections have covered seating?</h3>
            <p>
              {coveredSections.length > 0
                ? `${coveredSections.length} section${coveredSections.length === 1 ? '' : 's'} at ${stadium.name} ${coveredSections.length === 1 ? 'is' : 'are'} fully covered (all rows) — mostly indoor, suite, and club-level spaces`
                : `${stadium.name} has limited fully covered seating`}
              {partialSections.length > 0
                ? `, and ${partialSections.length} more are shaded in their back rows only, under the upper-deck overhang and roof. Field-level and open bleacher sections are exposed.`
                : '. Field-level and open bleacher sections are exposed.'}
            </p>
            {(coveredSections.length > 0 || partialSections.length > 0) && (
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
            <p>For day games, shade typically reaches the field level sections by the 5th-6th inning. Evening games (7 PM starts) usually have most of the stadium in shade by first pitch, except for outfield sections which may experience sunset glare.</p>
          </div>
          
          <div className={styles.faqItem}>
            <h3>Are there shaded standing room areas?</h3>
            <p>Yes, the upper deck concourse and club level concourses offer shaded standing room areas with views of the field. These are great options for escaping the sun during day games.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.stadiumCta}>
        <div className={styles.container}>
          <h2>Plan Your Visit to {stadium.name}</h2>
          <p>Remember, shade patterns change throughout the season and even during the game. For the most accurate, real-time shade information for your specific game, use our interactive shade tracker.</p>
          
          <div className={styles.ctaButtons}>
            <a href={`/?stadium=${stadium.id}`} className={`${styles.btn} ${styles.btnPrimary}`}>
              Check Real-Time Shade
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