'use client';

import dynamic from 'next/dynamic';
import { VENUE_COUNT, MLB_COUNT, MILB_COUNT, NFL_COUNT } from '../src/data/venueCount';
import HomepageSchema from './HomepageSchema';
import Link from 'next/link';
import ShadeFinder, { type FinderPark } from '../src/components/ShadeFinder/ShadeFinder';
import styles from './HomePage.module.css';

// Below-the-fold, non-critical: defer so it never competes with initial paint.
const PWAInstallPrompt = dynamic(() => import('../components/PWAInstallPrompt'), {
  ssr: false,
});

export default function HomePage({ parks }: { parks: FinderPark[] }) {
  return (
    <>
      <HomepageSchema />
      <div className={styles.home}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.content}>
            <h1 className={`${styles.headline} h1 break-words md:break-normal`}>
              Will your seats be in the shade?
            </h1>
            <p className={`${styles.subheadline} max-w-prose`}>
              Pick your ballpark and game to see every section in sun or shade, inning by inning.
            </p>
          </div>
        </section>

        <section className={styles.finder} aria-label="Find shaded seats">
          <ShadeFinder parks={parks} />
          <p className={styles.other}>
            Going to an NFL or minor league game? <Link href="/seats-shade-finder">Use the full stadium finder</Link>.
          </p>
        </section>

        {/*
          This section used to be `className="sr-only"` — the venue counts, the
          methodology summary and the popular-venue links were written for
          crawlers and screen readers but hidden from sighted users, leaving the
          homepage as just a headline, one line of copy and a button. It is real
          content that answers "what is this and does it cover my team", so it
          is now visible to everyone. The markup is unchanged, only the
          presentation.
        */}
        <section className="home-intro" aria-labelledby="home-intro-title">
          <h2 id="home-intro-title" className="home-intro__title">
            Find Shaded Seats at MLB, MiLB &amp; NFL Stadiums
          </h2>
          <p className="home-intro__lead">
            The Shadium covers {VENUE_COUNT} venues across Major League Baseball (all {MLB_COUNT} ballparks), Minor League
            Baseball ({MILB_COUNT} parks), and the NFL ({NFL_COUNT} stadiums). For every MLB ballpark, pick your game to see
            which sections are in the shade, from first pitch to the final out.
          </p>

          {/* What the tool actually accounts for — i.e. why its answer differs
              from the usual "just sit on the third-base side" advice. */}
          <ul className="home-features">
            <li className="home-features__item">
              <span className="home-features__icon" aria-hidden="true">🧭</span>
              <span>
                <strong>Each ballpark&apos;s real layout.</strong> Every park faces its own direction,
                measured from aerial photos, and the map uses its real seating sections.
              </span>
            </li>
            <li className="home-features__item">
              <span className="home-features__icon" aria-hidden="true">🕐</span>
              <span>
                <strong>Your actual first pitch.</strong> Sun position is computed for the real game
                time in the stadium&apos;s own timezone, so a 1:05pm start and a 7:10pm start give
                different answers.
              </span>
            </li>
            <li className="home-features__item">
              <span className="home-features__icon" aria-hidden="true">🏟️</span>
              <span>
                <strong>Decks and roofs count.</strong> Rows under an upper deck or roof are shaded
                even at noon, and every answer says how sure we are.
              </span>
            </li>
            <li className="home-features__item">
              <span className="home-features__icon" aria-hidden="true">🌤️</span>
              <span>
                <strong>The whole game, not just first pitch.</strong> Shade moves as the sun drops,
                so each section shows sun or shade every half hour, labelled by inning.
              </span>
            </li>
          </ul>

          <div className="home-intro__grid">
            <div className="home-intro__col">
              <h3 className="home-intro__subtitle">Popular venue shade guides</h3>
              <ul className="home-intro__links">
                <li><Link href="/stadium/yankees">Are my seats shaded at Yankee Stadium? (MLB)</Link></li>
                <li><Link href="/stadium/dodgers">Find shaded seats at Dodger Stadium (MLB)</Link></li>
                <li><Link href="/stadium/metlife-stadium-giants">Shaded sections at MetLife Stadium (NFL)</Link></li>
                <li><Link href="/stadium/las-vegas-aviators">Las Vegas Ballpark shade finder (MiLB)</Link></li>
                <li><Link href="/stadium/sofi-stadium-rams">SoFi Stadium sun exposure guide (NFL)</Link></li>
              </ul>
            </div>

            <div className="home-intro__col">
              <h3 className="home-intro__subtitle">How it works</h3>
              <p>
                Pick a ballpark and a game. We work out where the sun is for each half hour of the
                game and which rows their own stand, deck or roof keeps out of it. <Link href="/how-it-works">How it works</Link>.
              </p>
            </div>
          </div>
        </section>

        <PWAInstallPrompt />
      </div>
    </>
  );
}
