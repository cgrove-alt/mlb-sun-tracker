import React from 'react';
import Link from 'next/link';
import { MLB_STADIUMS } from '../../src/data/stadiums';
import { MLB_DIVISIONS, DIVISION_ORDER } from '../../src/data/mlbDivisions';
import styles from './StadiumsPageSSR.module.css';
import { VENUE_COUNT } from '../../src/data/venueCount';

const LEAGUES = [
  { id: 'mlb', name: 'MLB', label: 'Major League Baseball', count: 30 },
  { id: 'milb', name: 'MiLB', label: 'Minor League Baseball', count: 120 },
  { id: 'nfl', name: 'NFL', label: 'National Football League', count: 32 },
];

export default function StadiumsPageSSR() {
  // Group stadiums by division using the shared, id-keyed division map.
  const divisions: Record<string, typeof MLB_STADIUMS> = {};
  for (const d of DIVISION_ORDER) divisions[d] = [];
  MLB_STADIUMS.forEach(stadium => {
    const division = MLB_DIVISIONS[stadium.id];
    if (division && divisions[division]) {
      divisions[division].push(stadium);
    }
  });

  return (
    <div className={styles.stadiumsPage}>
      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1>All Stadium Sun Guides</h1>
          <p className={styles.lead}>
            Review seating inventory, roof type, orientation, solar context, and measurement
            confidence at {VENUE_COUNT} venues across Major League Baseball, Minor League Baseball,
            and the NFL.
          </p>

          <div className={styles.statsGrid}>
            <div className={styles.stat}>
              {/* Was hardcoded 182: it silently goes stale the moment a venue
                  is added or removed. VENUE_COUNT is derived from the data. */}
              <span className={styles.statNumber}>{VENUE_COUNT}</span>
              <span className={styles.statLabel}>Venues</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>3</span>
              <span className={styles.statLabel}>Leagues (MLB, MiLB, NFL)</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>Field-level</span>
              <span className={styles.statLabel}>Confidence Disclosures</span>
            </div>
          </div>
        </section>

        {/* Browse by League */}
        <section className={styles.quickLinks}>
          <h2>Browse by League</h2>
          <div className={styles.popularGrid}>
            {LEAGUES.map((league) => (
              <Link key={league.id} href={`/league/${league.id}`} className={styles.popularCard}>
                <h3>{league.name}</h3>
                <p className={styles.team}>{league.label}</p>
                <div className={styles.cardStats}>
                  <span>{league.count} venues →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section className={styles.quickLinks}>
          <h2>Popular Stadiums</h2>
          <div className={styles.popularGrid}>
            {['yankees', 'dodgers', 'cubs', 'redsox', 'giants'].map(id => {
              const stadium = MLB_STADIUMS.find(s => s.id === id);
              if (!stadium) return null;

              return (
                <Link key={id} href={`/stadium/${id}`} className={styles.popularCard}>
                  <h3>{stadium.name}</h3>
                  <p className={styles.team}>{stadium.team}</p>
                  <div className={styles.cardStats}>
                    <span>{stadium.roof === 'open' ? '☀️ Open Air' : '🏟️ ' + stadium.roof}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* All Stadiums by Division */}
        <section>
          <h2>All MLB Stadiums by Division</h2>
          
          {Object.entries(divisions).map(([division, stadiums]) => (
            <div key={division} className={styles.divisionSection}>
              <h3 className={styles.divisionTitle}>{division}</h3>
              <div className={styles.stadiumsGrid}>
                {stadiums.map(stadium => {
                  
                  return (
                    <Link key={stadium.id} href={`/stadium/${stadium.id}`} className={styles.stadiumCard}>
                      <div className={styles.stadiumHeader}>
                        <h4>{stadium.name}</h4>
                        <span className={styles.teamBadge}>{stadium.team}</span>
                      </div>
                      
                      <div className={styles.stadiumDetails}>
                        <div className={styles.detail}>
                          <span className={styles.label}>Location:</span>
                          <span>{stadium.city}, {stadium.state}</span>
                        </div>
                        <div className={styles.detail}>
                          <span className={styles.label}>Roof:</span>
                          <span>
                            {stadium.roof === 'open' ? 'Open Air' : 
                             stadium.roof === 'retractable' ? 'Retractable' : 'Fixed'}
                          </span>
                        </div>
                        <div className={styles.detail}>
                          <span className={styles.label}>Orientation:</span>
                          <span>{stadium.orientation}°</span>
                        </div>
                      </div>
                      
                      <div className={styles.shadeStats}>
                        <div className={styles.shadeStat}>
                          <strong>{stadium.capacity?.toLocaleString() || 'N/A'}</strong>
                          <span>Capacity</span>
                        </div>
                        <div className={styles.shadeStat}>
                          <strong>{stadium.roof}</strong>
                          <span>Roof Type</span>
                        </div>
                      </div>
                      
                      <span className={styles.viewGuide}>View Data Status →</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* Helpful Information */}
        <section className={styles.infoSection}>
          <h2>Understanding Stadium Shade</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h3>🏟️ Stadium Orientation</h3>
              <p>
                Most MLB stadiums face northeast to minimize sun glare for batters. 
                This orientation affects which sections get shade during different parts of the game.
              </p>
            </div>
            <div className={styles.infoCard}>
              <h3>☀️ Time of Day Matters</h3>
              <p>
                Day games (1 PM starts) have maximum sun exposure. 
                Sun position depends on the actual date, time, and location. Before sunset,
                exact seat exposure still depends on measured stadium structures.
              </p>
            </div>
            <div className={styles.infoCard}>
              <h3>📅 Seasonal Changes</h3>
              <p>
                Sun angles change throughout the season. 
                Summer games (June-August) have the highest sun angle and least natural shade.
              </p>
            </div>
            <div className={styles.infoCard}>
              <h3>🎯 Conservative Planning</h3>
              <p>
                Confirm exact covered rows and retractable-roof state with the venue. Bring sun
                protection whenever seat coverage has not been verified.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
