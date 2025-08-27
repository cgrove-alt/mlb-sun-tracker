import React from 'react';
import Link from 'next/link';
import { MLB_STADIUMS } from '../../src/data/stadiums';
import { getStadiumSections } from '../../src/data/stadiumSections';
import styles from './StadiumsPageSSR.module.css';

export default function StadiumsPageSSR() {
  // Group stadiums by division
  const divisions: Record<string, typeof MLB_STADIUMS> = {
    'AL East': [],
    'AL Central': [],
    'AL West': [],
    'NL East': [],
    'NL Central': [],
    'NL West': [],
  };

  // Division mapping
  const teamDivisions: Record<string, string> = {
    'Orioles': 'AL East',
    'Red Sox': 'AL East',
    'Yankees': 'AL East',
    'Rays': 'AL East',
    'Blue Jays': 'AL East',
    'Guardians': 'AL Central',
    'White Sox': 'AL Central',
    'Tigers': 'AL Central',
    'Royals': 'AL Central',
    'Twins': 'AL Central',
    'Astros': 'AL West',
    'Athletics': 'AL West',
    'Angels': 'AL West',
    'Mariners': 'AL West',
    'Rangers': 'AL West',
    'Braves': 'NL East',
    'Marlins': 'NL East',
    'Mets': 'NL East',
    'Phillies': 'NL East',
    'Nationals': 'NL East',
    'Brewers': 'NL Central',
    'Cardinals': 'NL Central',
    'Cubs': 'NL Central',
    'Reds': 'NL Central',
    'Pirates': 'NL Central',
    'Diamondbacks': 'NL West',
    'Rockies': 'NL West',
    'Dodgers': 'NL West',
    'Padres': 'NL West',
    'Giants': 'NL West',
  };

  // Group stadiums
  MLB_STADIUMS.forEach(stadium => {
    const division = teamDivisions[stadium.team] || 'NL West';
    if (divisions[division]) {
      divisions[division].push(stadium);
    }
  });

  return (
    <div className={styles.stadiumsPage}>
      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1>MLB Stadium Shade Guides</h1>
          <p className={styles.lead}>
            Find the best shaded seats at all 30 Major League Baseball stadiums. 
            Each guide includes detailed shade analysis, covered sections, and seasonal recommendations.
          </p>
          
          <div className={styles.statsGrid}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>30</span>
              <span className={styles.statLabel}>MLB Stadiums</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>5,000+</span>
              <span className={styles.statLabel}>Sections Analyzed</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>Real-time</span>
              <span className={styles.statLabel}>Shade Calculations</span>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className={styles.quickLinks}>
          <h2>Popular Stadiums</h2>
          <div className={styles.popularGrid}>
            {['yankees', 'dodgers', 'cubs', 'redsox', 'giants'].map(id => {
              const stadium = MLB_STADIUMS.find(s => s.id === id);
              if (!stadium) return null;
              const sections = getStadiumSections(stadium.id);
              const coveredCount = sections.filter(s => s.covered).length;
              
              return (
                <Link key={id} href={`/stadium/${id}`} className={styles.popularCard}>
                  <h3>{stadium.name}</h3>
                  <p className={styles.team}>{stadium.team}</p>
                  <div className={styles.cardStats}>
                    <span>{stadium.roof === 'open' ? '☀️ Open Air' : '🏟️ ' + stadium.roof}</span>
                    {coveredCount > 0 && <span>🛡️ {coveredCount} Covered</span>}
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
                  const sections = getStadiumSections(stadium.id);
                  const coveredCount = sections.filter(s => s.covered).length;
                  const upperCount = sections.filter(s => s.level === 'upper').length;
                  
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
                          <strong>{coveredCount}</strong>
                          <span>Covered Sections</span>
                        </div>
                        <div className={styles.shadeStat}>
                          <strong>{upperCount}</strong>
                          <span>Upper Deck</span>
                        </div>
                        <div className={styles.shadeStat}>
                          <strong>{sections.length}</strong>
                          <span>Total Sections</span>
                        </div>
                      </div>
                      
                      <div className={styles.shadeRating}>
                        <span className={styles.ratingLabel}>Shade Rating:</span>
                        <div className={styles.ratingBar}>
                          <div 
                            className={styles.ratingFill}
                            style={{ 
                              width: `${Math.min(100, (coveredCount / sections.length) * 100 + (upperCount / sections.length) * 50)}%` 
                            }}
                          />
                        </div>
                      </div>
                      
                      <span className={styles.viewGuide}>View Shade Guide →</span>
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
                Evening games (7 PM starts) typically have most seats in shade by first pitch.
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
              <h3>🎯 Best Shade Strategies</h3>
              <p>
                Upper deck sections, third base side (for day games), and any covered sections 
                typically offer the best shade protection.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
