'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import styles from './StickyShadeBar.module.css';
import { MLBGame, mlbApi } from '../src/services/mlbApi';
import { format } from 'date-fns';
import { formatGameTimeInStadiumTZ } from '../src/utils/dateTimeUtils';
import { MLB_STADIUMS } from '../src/data/stadiums';

interface StickyShadeBarProps {
  stadiumName: string;
  stadiumId: string;
}

interface GameOption {
  value: string;
  label: string;
  game: MLBGame;
}

export default function StickyShadeBar({ stadiumName, stadiumId }: StickyShadeBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [games, setGames] = useState<MLBGame[]>([]);
  const [selectedGame, setSelectedGame] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [section, setSection] = useState(() => {
    return searchParams.get('section') || '';
  });
  
  // Find the stadium data
  const stadium = MLB_STADIUMS.find(s => s.id === stadiumId);

  // Load games when component mounts
  useEffect(() => {
    const loadGames = async () => {
      if (!stadium) {
        setError('Stadium not found');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const today = new Date();
        const endDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
        
        // Use API route to avoid CORS issues
        const response = await fetch(`/api/mlb/schedule?stadiumId=${stadiumId}&startDate=${today.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        
        const data = await response.json();
        setGames(data.games || []);
        
        // If there's a gameId in URL params, select it
        const gameId = searchParams.get('gameId');
        if (gameId) {
          setSelectedGame(gameId);
        } else if (data.games && data.games.length > 0) {
          // Select first game by default
          setSelectedGame(data.games[0].gamePk.toString());
        }
      } catch (err) {
        console.error('Error loading games:', err);
        setError('Failed to load games');
      } finally {
        setLoading(false);
      }
    };
    
    loadGames();
  }, [stadiumId, stadium, searchParams]);
  
  // Generate game options for dropdown
  const gameOptions = useCallback((): GameOption[] => {
    return games.map(game => {
      const gameDate = new Date(game.gameDate);
      const opponent = game.teams.away.team.name;
      
      let formattedDate, formattedTime;
      try {
        formattedDate = format(gameDate, 'MMM d');
        formattedTime = stadium ? formatGameTimeInStadiumTZ(gameDate, stadium.timezone) : 
                             format(gameDate, 'h:mm a');
      } catch (error) {
        console.error('Date formatting error in gameOptions:', error);
        // Fallback to manual formatting
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        formattedDate = `${months[gameDate.getMonth()]} ${gameDate.getDate()}`;
        
        const hours = gameDate.getHours();
        const minutes = gameDate.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        formattedTime = `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      }
      
      return {
        value: game.gamePk.toString(),
        label: `vs ${opponent} - ${formattedDate} at ${formattedTime}`,
        game
      };
    });
  }, [games, stadium]);

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedGame) return;
    
    // Find the selected game
    const game = games.find(g => g.gamePk.toString() === selectedGame);
    if (!game) return;
    
    // Extract date and time from game
    const gameDate = new Date(game.gameDate);
    let date, time;
    
    try {
      date = format(gameDate, 'yyyy-MM-dd');
      time = format(gameDate, 'HH:mm');
    } catch (error) {
      console.error('Date formatting error:', error);
      // Fallback to manual date formatting
      const year = gameDate.getFullYear();
      const month = String(gameDate.getMonth() + 1).padStart(2, '0');
      const day = String(gameDate.getDate()).padStart(2, '0');
      const hours = String(gameDate.getHours()).padStart(2, '0');
      const minutes = String(gameDate.getMinutes()).padStart(2, '0');
      
      date = `${year}-${month}-${day}`;
      time = `${hours}:${minutes}`;
    }
    
    // Build query string
    const params = new URLSearchParams();
    params.set('gameId', selectedGame);
    params.set('date', date);
    params.set('time', time);
    if (section) {
      params.set('section', section);
    }
    
    // Update URL with new params
    router.push(`${pathname}?${params.toString()}`);
    
    // Trigger shade calculation event
    window.dispatchEvent(new CustomEvent('calculateShade', {
      detail: { date, time, section, stadiumId, gameId: selectedGame }
    }));
  }, [selectedGame, games, section, pathname, router, stadiumId]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key to clear focus from inputs
      if (e.key === 'Escape') {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && activeElement.blur) {
          activeElement.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={styles.stickyBar}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.stadiumName}>{stadiumName}</div>
        
        <div className={styles.inputs}>
          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label htmlFor="shade-game" className={styles.srOnly}>Select Game</label>
              {loading ? (
                <select 
                  id="shade-game"
                  className={styles.input}
                  disabled
                  aria-label="Loading games..."
                >
                  <option>Loading games...</option>
                </select>
              ) : error ? (
                <select 
                  id="shade-game"
                  className={styles.input}
                  disabled
                  aria-label="Error loading games"
                >
                  <option>{error}</option>
                </select>
              ) : games.length === 0 ? (
                <select 
                  id="shade-game"
                  className={styles.input}
                  disabled
                  aria-label="No games scheduled"
                >
                  <option>No games scheduled</option>
                </select>
              ) : (
                <select
                  id="shade-game"
                  className={styles.input}
                  value={selectedGame}
                  onChange={(e) => setSelectedGame(e.target.value)}
                  aria-label="Select game for shade calculation"
                  required
                >
                  <option value="">Select a game...</option>
                  {gameOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="shade-section" className={styles.srOnly}>Section (optional)</label>
              <input
                type="text"
                id="shade-section"
                className={styles.input}
                value={section}
                onChange={(e) => setSection(e.target.value)}
                placeholder="Section"
                aria-label="Enter section number (optional)"
              />
            </div>
          </div>
        </div>
        
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={!selectedGame || loading}
          aria-label="Calculate shade for selected game"
        >
          Check Shade
        </button>
      </form>
    </div>
  );
}