'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface Game {
  gamePk: number;
  date: string;
  localTime: string;
  homeTeam: string;
  awayTeam: string;
  stadiumId: string;
  status: string;
  isHome: boolean;
}

interface GamePickerProps {
  teamId: number;
  stadiumSlug: string;
  league: string;
  currentDate?: string;
  currentTime?: string;
}

function formatGameDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2,'0')} ${ampm}`;
}

export function GamePicker({ teamId, stadiumSlug, league, currentDate, currentTime }: GamePickerProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const year = new Date().getFullYear();
    fetch(`/api/schedule/${teamId}?year=${year}`)
      .then(r => r.json())
      .then(data => {
        const now = new Date();
        const upcoming = (data.games || [])
          .filter((g: Game) => new Date(g.date + 'T23:59:59') >= now)
          .filter((g: Game) => g.status !== 'final')
          .slice(0, 7);
        setGames(upcoming);
      })
      .catch(() => setGames([]))
      .finally(() => setLoading(false));
  }, [teamId]);

  const selectGame = (game: Game) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('date', game.date);
    params.set('time', game.localTime);
    params.delete('offset');
    // If away game, navigate to the actual stadium
    if (!game.isHome && game.stadiumId !== stadiumSlug) {
      router.push(`/${league}/${game.stadiumId}?${params.toString()}`);
    } else {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  if (loading) {
    return (
      <div className="space-y-2 animate-pulse">
        {[1,2,3].map(i => <div key={i} className="h-14 bg-gray-100 rounded-lg" />)}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-4">No upcoming home games found. Use the date picker above.</p>
    );
  }

  return (
    <div className="space-y-2" role="list" aria-label="Upcoming games">
      {games.map(game => {
        const isSelected = currentDate === game.date && currentTime === game.localTime;
        const isAway = !game.isHome;
        return (
          <button
            key={game.gamePk}
            onClick={() => selectGame(game)}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
              isSelected
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            role="listitem"
            aria-pressed={isSelected}
          >
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium text-gray-900">
                  {game.isHome ? `vs ${game.awayTeam}` : `@ ${game.homeTeam}`}
                </span>
                {isAway && (
                  <span className="ml-2 text-xs text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">Away</span>
                )}
              </div>
              <div className="text-right text-sm text-gray-600">
                <div>{formatGameDate(game.date)}</div>
                <div className="font-medium">{formatTime(game.localTime)}</div>
              </div>
            </div>
            {game.status === 'postponed' && (
              <div className="text-xs text-red-600 mt-1">Postponed – TBD</div>
            )}
          </button>
        );
      })}
    </div>
  );
}
