// Server component: the venue page's static content (header, monthly sun
// heights, tips, FAQ). The one interactive part is the shade finder, a
// client component that loads the park's games and sections in the browser.
import React from 'react';
import { Stadium } from '../../../src/data/stadiums';
import type { StadiumSection } from '../../../src/data/stadiumSectionTypes';
import { StadiumAmenities } from '../../../src/data/stadiumAmenities';
import StadiumTitleBlock from '../../../src/components/StadiumTitleBlock';
import { StadiumTitleData } from '../../../src/components/StadiumTitleBlock';
import ShadeFinder from '../../../src/components/ShadeFinder/ShadeFinder';
import { finderParks } from '../../../src/components/ShadeFinder/finderParks';
import { buildSeasonalShadeCopy } from '../../../src/utils/seasonalShade';
import { stadiumHistories } from '../../../src/data/stadiumDetails';
import styles from './StadiumPageSSR.module.css';

interface StadiumPageSSRProps {
  stadium: Stadium;
  sections: StadiumSection[];
  amenities: StadiumAmenities | null;
  guide: unknown;
}

export default function StadiumPageSSR({ stadium, amenities }: StadiumPageSSRProps) {
  const isDome = stadium.roof === 'fixed';

  // Monthly midday sun height computed from THIS park's latitude.
  const months = buildSeasonalShadeCopy(
    stadium.latitude,
    stadium.longitude,
    stadium.name,
    [3, 4, 5, 6, 7, 8, 9],
  ).map(m => ({ num: m.month, name: m.name, pattern: m.note, peakAltitudeDeg: m.peakAltitudeDeg }));

  const stadiumHistory = stadiumHistories[stadium.id];
  const titleData: StadiumTitleData = {
    purpose: 'shade-guide',
    stadium: { name: stadium.name, id: stadium.id },
    team: { name: stadium.team, league: 'MLB' },
    quickFacts: {
      location: { city: stadium.city, state: stadium.state },
      capacity: stadium.capacity,
      orientation: stadium.orientation,
      roofType: stadium.roof,
      yearBuilt: stadiumHistory?.opened,
    },
  };

  return (
    <div className={styles.stadiumSsrPage}>
      <section className={styles.stadiumHero}>
        <div className={styles.container}>
          <StadiumTitleBlock data={titleData} showBreadcrumb={true} />
        </div>
      </section>

      {/* The answer: every section's sun and shade for the fan's game. */}
      <section className={styles.section} aria-labelledby="game-shade-title">
        <div className={styles.container}>
          <h2 id="game-shade-title">Shade for your game</h2>
          <p>
            {isDome
              ? `${stadium.name} has a fixed roof, so every seat is out of the sun. Pick a game to check any section.`
              : 'Pick your game to see every section in sun or shade, inning by inning. Tap a section on the map, or search for yours.'}
          </p>
        </div>
        <ShadeFinder parks={finderParks(stadium.id)} lockedStadiumId={stadium.id} />
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <h2>How High the Sun Gets</h2>
          {isDome ? (
            <p>{stadium.name} has a fixed roof and is climate-controlled, so the time of year doesn&apos;t change anything: every seat is out of the sun all season.</p>
          ) : (
            <>
              <p>The higher the sun, the less shade the stands throw. Midday sun height at {stadium.name} by month:</p>
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

      <section className={styles.section}>
        <div className={styles.container}>
          <h2>Sun Protection Tips for {stadium.name}</h2>
          <div className={styles.tipsGrid}>
            <div className={styles.tipCard}>
              <h3>☀️ Peak Sun Hours</h3>
              <p>The sun is strongest between 11 AM and 4 PM. Day games at {stadium.name} get the most sun during these hours.</p>
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

      {amenities && (
        <section className={styles.section}>
          <div className={styles.container}>
            <h2>Shade-Related Amenities</h2>
            <div className={styles.amenitiesGrid}>
              <div className={styles.amenityCategory}>
                <h3>Covered Concourse Areas</h3>
                <p>Concourse coverage and access can vary. Check the club&apos;s official venue guide for current shelter and access information.</p>
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

      <section className={styles.section}>
        <div className={styles.container}>
          <h2>Frequently Asked Questions</h2>

          <div className={styles.faqItem}>
            <h3>Where are the shaded seats at {stadium.name}?</h3>
            <p>{isDome
              ? `${stadium.name} has a fixed roof, so every seat is out of the sun at any game time.`
              : 'It depends on when the game starts: shade moves across the park as the sun drops. Pick your game above to see every section, inning by inning.'}</p>
          </div>

          <div className={styles.faqItem}>
            <h3>Which sections have covered seating?</h3>
            <p>{isDome
              ? `${stadium.name}'s roof covers the whole seating bowl.`
              : 'Rows under a deck or roof are built into the map above: they show as shaded even when the sun is high overhead, and tapping a section shows how its shade changes through the game.'}</p>
          </div>

          <div className={styles.faqItem}>
            <h3>How early does shade reach the lower bowl?</h3>
            <p>{isDome
              ? 'There is no direct sun inside the roof.'
              : 'Pick your game above and move the slider: it steps through the game every half hour, labelled by inning.'}</p>
          </div>

          <div className={styles.faqItem}>
            <h3>Are there shaded standing room areas?</h3>
            <p>Standing-room and concourse access can change by event and ticket type. Check the club&apos;s current venue guide; standing-room areas aren&apos;t rated on the map.</p>
          </div>
        </div>
      </section>

      <section className={styles.stadiumCta}>
        <div className={styles.container}>
          <h2>More Ballparks</h2>
          <p>Planning another trip? Every MLB ballpark has the same game-by-game shade map.</p>
          <div className={styles.ctaButtons}>
            <a href="/stadiums" className={`${styles.btn} ${styles.btnSecondary}`}>
              View All Stadiums
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
