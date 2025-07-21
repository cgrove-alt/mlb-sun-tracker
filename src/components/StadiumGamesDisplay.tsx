import React from 'react';
import { MLBGame } from '../services/mlbApi';
import { Stadium } from '../data/stadiums';
import { formatGameTimeInStadiumTZ } from '../utils/dateTimeUtils';
import { BaseballIcon, CalendarIcon } from './Icons';
import './StadiumGamesDisplay.css';

interface StadiumGamesDisplayProps {
  stadium: Stadium;
  games: MLBGame[];
  selectedGame?: MLBGame | null;
  onGameSelect: (game: MLBGame) => void;
}

// Helper function to get team abbreviation from full name
const getTeamAbbreviation = (teamName: string): string => {
  const abbreviations: Record<string, string> = {
    'Arizona Diamondbacks': 'ARI',
    'Atlanta Braves': 'ATL',
    'Baltimore Orioles': 'BAL',
    'Boston Red Sox': 'BOS',
    'Chicago Cubs': 'CHC',
    'Chicago White Sox': 'CWS',
    'Cincinnati Reds': 'CIN',
    'Cleveland Guardians': 'CLE',
    'Colorado Rockies': 'COL',
    'Detroit Tigers': 'DET',
    'Houston Astros': 'HOU',
    'Kansas City Royals': 'KC',
    'Los Angeles Angels': 'LAA',
    'Los Angeles Dodgers': 'LAD',
    'Miami Marlins': 'MIA',
    'Milwaukee Brewers': 'MIL',
    'Minnesota Twins': 'MIN',
    'New York Mets': 'NYM',
    'New York Yankees': 'NYY',
    'Oakland Athletics': 'OAK',
    'Philadelphia Phillies': 'PHI',
    'Pittsburgh Pirates': 'PIT',
    'San Diego Padres': 'SD',
    'San Francisco Giants': 'SF',
    'Seattle Mariners': 'SEA',
    'St. Louis Cardinals': 'STL',
    'Tampa Bay Rays': 'TB',
    'Texas Rangers': 'TEX',
    'Toronto Blue Jays': 'TOR',
    'Washington Nationals': 'WSH'
  };
  
  return abbreviations[teamName] || teamName.substring(0, 3).toUpperCase();
};

export const StadiumGamesDisplay: React.FC<StadiumGamesDisplayProps> = ({
  stadium,
  games,
  selectedGame,
  onGameSelect
}) => {
  if (!games || games.length === 0) {
    return (
      <div className="stadium-games-empty">
        <BaseballIcon size={32} color="#999" />
        <p>No upcoming home games scheduled</p>
      </div>
    );
  }

  // Group games by month
  const gamesByMonth = games.reduce((acc, game) => {
    const date = new Date(game.gameDate);
    const monthKey = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(game);
    return acc;
  }, {} as Record<string, MLBGame[]>);

  return (
    <div className="stadium-games-display">
      <div className="stadium-games-header">
        <CalendarIcon size={20} />
        <h3>All Upcoming Home Games at {stadium.name}</h3>
        <span className="games-count">{games.length} games</span>
      </div>
      
      <div className="stadium-games-content">
        {Object.entries(gamesByMonth).map(([month, monthGames]) => (
          <div key={month} className="games-month-group">
            <h4 className="games-month-title">{month}</h4>
            <div className="games-grid">
              {monthGames.map((game) => {
                const isSelected = selectedGame?.gamePk === game.gamePk;
                const gameDate = new Date(game.gameDate);
                const dayOfWeek = gameDate.toLocaleDateString('en-US', { weekday: 'short' });
                const dayOfMonth = gameDate.getDate();
                
                return (
                  <button
                    key={game.gamePk}
                    className={`game-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => onGameSelect(game)}
                    aria-label={`Select game on ${gameDate.toLocaleDateString()} against ${game.teams.away.team.name}`}
                  >
                    <div className="game-date">
                      <span className="game-day-week">{dayOfWeek}</span>
                      <span className="game-day-num">{dayOfMonth}</span>
                    </div>
                    <div className="game-info">
                      <div className="game-teams">
                        <span className="away-team">{getTeamAbbreviation(game.teams.away.team.name)}</span>
                        <span className="vs">@</span>
                        <span className="home-team">{getTeamAbbreviation(game.teams.home.team.name)}</span>
                      </div>
                      <div className="game-time">
                        {formatGameTimeInStadiumTZ(game.gameDate, stadium.timezone)}
                      </div>
                    </div>
                    {isSelected && <div className="selected-indicator">✓</div>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};