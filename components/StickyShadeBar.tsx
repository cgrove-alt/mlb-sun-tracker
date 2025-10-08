'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
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
    <div className="fixed left-0 right-0 z-[var(--z-sticky-shade-bar,220)] bg-[var(--color-ui-surface,var(--color-white,#ffffff))] shadow-[var(--shadow-md,0_4px_6px_-1px_rgba(0,0,0,0.1))] p-[10px_12px] pb-[calc(10px+env(safe-area-inset-bottom))] transition-[var(--transition-fast,all_150ms_cubic-bezier(0.4,0,0.2,1))] border-t border-[var(--color-ui-border,#E5E7EB)] bottom-0 pointer-events-none md:top-[60px] md:border-b md:border-t-0 md:p-[12px_16px]">
      <form className="flex flex-col gap-2 max-w-[1200px] mx-auto pointer-events-auto md:flex-row md:items-center md:gap-4 [&>*]:pointer-events-auto" onSubmit={handleSubmit}>
        <div className="font-semibold text-base text-[var(--color-ink-800,#1B2432)] whitespace-nowrap overflow-hidden text-ellipsis mb-1 max-[600px]:!text-[14px] max-[600px]:!mb-2 md:mb-0 md:mr-auto">{stadiumName}</div>

        <div className="flex flex-col gap-1.5 w-full sm:flex sm:gap-2 md:flex md:gap-3 md:w-auto md:flex-[0_0_auto] max-[600px]:!gap-2.5">
          <div className="grid grid-cols-[2fr_1fr] gap-1.5 w-full sm:grid-cols-[3fr_1fr] max-[600px]:!flex max-[600px]:!flex-col max-[600px]:!gap-2 max-[600px]:!w-full">
            <div className="relative min-w-0 max-[600px]:!w-full">
              <label htmlFor="shade-game" className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0 clip-[rect(0,0,0,0)]">Select Game</label>
              {loading ? (
                <select
                  id="shade-game"
                  className="w-full py-2 px-2.5 border border-[var(--color-ui-border,#E5E7EB)] rounded-md bg-white text-[var(--color-ink-900,#0B1220)] text-sm leading-[1.3] transition-[var(--transition-fast,all_150ms_cubic-bezier(0.4,0,0.2,1))] appearance-none min-h-[38px] h-[38px] md:py-2 md:px-3 md:min-w-[120px] pr-9 bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2024%2024%27%20fill=%27none%27%20stroke=%27currentColor%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpolyline%20points=%276%209%2012%2015%2018%209%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[right_8px_center] bg-no-repeat bg-[length:20px] max-[600px]:!w-full max-[600px]:!min-h-[44px] max-[600px]:!h-[44px] max-[600px]:!py-2.5 max-[600px]:!px-3 max-[600px]:!text-base max-[600px]:!pr-10"
                  disabled
                  aria-label="Loading games..."
                >
                  <option>Loading games...</option>
                </select>
              ) : error ? (
                <select
                  id="shade-game"
                  className="w-full py-2 px-2.5 border border-[var(--color-ui-border,#E5E7EB)] rounded-md bg-white text-[var(--color-ink-900,#0B1220)] text-sm leading-[1.3] transition-[var(--transition-fast,all_150ms_cubic-bezier(0.4,0,0.2,1))] appearance-none min-h-[38px] h-[38px] md:py-2 md:px-3 md:min-w-[120px] pr-9 bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2024%2024%27%20fill=%27none%27%20stroke=%27currentColor%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpolyline%20points=%276%209%2012%2015%2018%209%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[right_8px_center] bg-no-repeat bg-[length:20px] max-[600px]:!w-full max-[600px]:!min-h-[44px] max-[600px]:!h-[44px] max-[600px]:!py-2.5 max-[600px]:!px-3 max-[600px]:!text-base max-[600px]:!pr-10"
                  disabled
                  aria-label="Error loading games"
                >
                  <option>{error}</option>
                </select>
              ) : games.length === 0 ? (
                <select
                  id="shade-game"
                  className="w-full py-2 px-2.5 border border-[var(--color-ui-border,#E5E7EB)] rounded-md bg-white text-[var(--color-ink-900,#0B1220)] text-sm leading-[1.3] transition-[var(--transition-fast,all_150ms_cubic-bezier(0.4,0,0.2,1))] appearance-none min-h-[38px] h-[38px] md:py-2 md:px-3 md:min-w-[120px] pr-9 bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2024%2024%27%20fill=%27none%27%20stroke=%27currentColor%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpolyline%20points=%276%209%2012%2015%2018%209%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[right_8px_center] bg-no-repeat bg-[length:20px] max-[600px]:!w-full max-[600px]:!min-h-[44px] max-[600px]:!h-[44px] max-[600px]:!py-2.5 max-[600px]:!px-3 max-[600px]:!text-base max-[600px]:!pr-10"
                  disabled
                  aria-label="No games scheduled"
                >
                  <option>No games scheduled</option>
                </select>
              ) : (
                <select
                  id="shade-game"
                  className="w-full py-2 px-2.5 border border-[var(--color-ui-border,#E5E7EB)] rounded-md bg-white text-[var(--color-ink-900,#0B1220)] text-sm leading-[1.3] transition-[var(--transition-fast,all_150ms_cubic-bezier(0.4,0,0.2,1))] appearance-none min-h-[38px] h-[38px] hover:border-[var(--color-gray-400,#bdbdbd)] focus:outline-2 focus:outline-transparent focus:outline-offset-2 focus:border-[var(--color-ui-accent,var(--color-primary,#0F3E7C))] focus:shadow-[0_0_0_3px_rgba(15,62,124,0.1)] focus-visible:outline-2 focus-visible:outline-[var(--color-ui-accent,var(--color-primary,#0F3E7C))] focus-visible:outline-offset-2 placeholder:text-[var(--color-gray-500,#9e9e9e)] placeholder:text-sm md:py-2 md:px-3 md:min-w-[250px] pr-9 bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2024%2024%27%20fill=%27none%27%20stroke=%27currentColor%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%3e%3cpolyline%20points=%276%209%2012%2015%2018%209%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[right_8px_center] bg-no-repeat bg-[length:20px] max-[600px]:!w-full max-[600px]:!min-h-[44px] max-[600px]:!h-[44px] max-[600px]:!py-2.5 max-[600px]:!px-3 max-[600px]:!text-base max-[600px]:!pr-10"
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

            <div className="relative min-w-0 max-[600px]:!w-full">
              <label htmlFor="shade-section" className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0 clip-[rect(0,0,0,0)]">Section (optional)</label>
              <input
                type="text"
                id="shade-section"
                className="w-full py-2 px-2.5 border border-[var(--color-ui-border,#E5E7EB)] rounded-md bg-white text-[var(--color-ink-900,#0B1220)] text-sm leading-[1.3] transition-[var(--transition-fast,all_150ms_cubic-bezier(0.4,0,0.2,1))] appearance-none min-h-[38px] h-[38px] hover:border-[var(--color-gray-400,#bdbdbd)] focus:outline-2 focus:outline-transparent focus:outline-offset-2 focus:border-[var(--color-ui-accent,var(--color-primary,#0F3E7C))] focus:shadow-[0_0_0_3px_rgba(15,62,124,0.1)] focus-visible:outline-2 focus-visible:outline-[var(--color-ui-accent,var(--color-primary,#0F3E7C))] focus-visible:outline-offset-2 placeholder:text-[var(--color-gray-500,#9e9e9e)] placeholder:text-sm md:py-2 md:px-3 md:min-w-[100px] pr-2 max-[600px]:!w-full max-[600px]:!min-h-[44px] max-[600px]:!h-[44px] max-[600px]:!py-2.5 max-[600px]:!px-3 max-[600px]:!text-base"
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
          className="w-full py-2.5 px-5 bg-[var(--color-ui-accent,var(--color-primary,#0F3E7C))] text-[var(--color-ondark-900,#FFFFFF)] border-none rounded-md text-sm font-medium cursor-pointer transition-[var(--transition-fast,all_150ms_cubic-bezier(0.4,0,0.2,1))] min-h-[40px] mt-1 shadow-[var(--shadow-sm,0_1px_2px_0_rgba(0,0,0,0.05))] hover:bg-[var(--color-ui-accent-dark,var(--color-primary-dark,#0A2B57))] hover:-translate-y-px hover:shadow-[var(--shadow-md,0_4px_6px_-1px_rgba(0,0,0,0.1))] active:translate-y-0 active:shadow-[var(--shadow-sm,0_1px_2px_0_rgba(0,0,0,0.05))] focus:outline-2 focus:outline-transparent focus:outline-offset-2 focus:shadow-[0_0_0_3px_rgba(15,62,124,0.2)] focus-visible:outline-2 focus-visible:outline-[var(--color-ui-accent,var(--color-primary,#0F3E7C))] focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed md:w-auto md:min-w-[120px] md:min-h-[38px] md:py-2 md:mt-0 max-[600px]:!w-full max-[600px]:!min-h-[44px] max-[600px]:!h-[44px] max-[600px]:!mt-2.5 max-[600px]:!text-base max-[600px]:!font-semibold"
          disabled={!selectedGame || loading}
          aria-label="Calculate shade for selected game"
        >
          Check Shade
        </button>
      </form>
    </div>
  );
}