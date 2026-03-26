'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MLBApiService, MLBGame } from '../../services/mlbApi';
import { calculateShadeScore, getShadeScoreColor, getShadeScoreTextColor } from '../../utils/shadeScore';

const mlbApi = new MLBApiService();

// Simple team abbreviation lookup
const TEAM_ABBREVS: Record<number, string> = {
  108: 'LAA', 117: 'HOU', 133: 'OAK', 141: 'TOR', 144: 'ATL',
  158: 'MIL', 138: 'STL', 112: 'CHC', 109: 'AZ', 119: 'LAD',
  137: 'SF', 114: 'CLE', 136: 'SEA', 146: 'MIA', 121: 'NYM',
  120: 'WSH', 110: 'BAL', 135: 'SD', 143: 'PHI', 134: 'PIT',
  140: 'TEX', 139: 'TB', 111: 'BOS', 113: 'CIN', 115: 'COL',
  118: 'KC', 116: 'DET', 142: 'MIN', 145: 'CWS', 147: 'NYY',
};

export const TodaysGames: React.FC = () => {
  const [games, setGames] = useState<MLBGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const todaysGames = await mlbApi.getSchedule(today, today);
        setGames(todaysGames);
      } catch {
        setGames([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  if (loading) {
    return (
      <section style={{ padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1f2937', marginBottom: '1rem' }}>
            Today&apos;s Games
          </h2>
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                minWidth: '220px', height: '120px',
                background: '#f1f5f9', borderRadius: '0.75rem',
                animation: 'pulse 1.5s infinite',
              }} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1f2937', marginBottom: '1rem' }}>
          Today&apos;s Games
        </h2>

        {games.length === 0 ? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
            No games today. Browse all stadiums below.
          </p>
        ) : (
          <div style={{
            display: 'flex', gap: '1rem', overflowX: 'auto',
            scrollSnapType: 'x mandatory', paddingBottom: '0.5rem',
          }}>
            {games.map(game => {
              const stadiumId = mlbApi.getStadiumIdFromTeamId(game.teams.home.team.id);
              const href = stadiumId ? `/stadium/${stadiumId}` : '#';
              const gameTime = new Date(game.gameDate);
              const timeStr = gameTime.toLocaleTimeString('en-US', {
                hour: 'numeric', minute: '2-digit', hour12: true,
              });
              const awayAbbrev = TEAM_ABBREVS[game.teams.away.team.id] || '???';
              const homeAbbrev = TEAM_ABBREVS[game.teams.home.team.id] || '???';

              // Rough shade score for display (default midday)
              const shade = calculateShadeScore(50);

              return (
                <Link key={game.gamePk} href={href} style={{
                  minWidth: '220px', scrollSnapAlign: 'start',
                  background: 'white', border: '1px solid #e2e8f0',
                  borderRadius: '0.75rem', padding: '1rem',
                  textDecoration: 'none', color: 'inherit',
                  transition: 'box-shadow 0.2s', display: 'flex', flexDirection: 'column', gap: '0.5rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                      {awayAbbrev} @ {homeAbbrev}
                    </span>
                    <span style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: getShadeScoreColor(shade.score),
                      color: getShadeScoreTextColor(shade.score),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700,
                    }} aria-label={`Shade Score ${shade.score}`}>
                      {shade.score}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                    {timeStr}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {game.venue.name}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default TodaysGames;
