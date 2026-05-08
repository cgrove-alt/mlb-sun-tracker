'use client';

import dynamic from 'next/dynamic';
import { Suspense, useMemo, useState, useCallback, useEffect } from 'react';
import { LoadingSpinner } from '../../../src/components/LoadingSpinner';
import { usePullToRefresh } from '../../../src/hooks/usePullToRefresh';
import { PullToRefreshIndicator } from '../../../src/components/PullToRefreshIndicator';
import { formatInTimeZone } from '../../../src/utils/dateTimeUtils';
import { mlbApi, MLBGame } from '../../../src/services/mlbApi';

const ComprehensiveStadiumGuide = dynamic(
  () => import('../../../src/components/ComprehensiveStadiumGuide'),
  {
    loading: () => <LoadingSpinner />,
    ssr: true,
  }
);

const SeatRecommendationsSection = dynamic(
  () => import('../../../src/components/SeatRecommendationsSection'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

interface StadiumPageClientProps {
  stadium: any;
  sections: any[];
  amenities: any;
  guide: any;
  useComprehensive?: boolean;
}

export default function StadiumPageClient({
  stadium,
  sections,
  amenities,
  guide,
  useComprehensive = false
}: StadiumPageClientProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [games, setGames] = useState<MLBGame[]>([]);
  const [selectedGame, setSelectedGame] = useState<MLBGame | null>(null);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [gamesError, setGamesError] = useState<string | null>(null);

  const stadiumTz: string = stadium?.timezone || 'America/New_York';

  // Load real home games for this stadium from the MLB Stats API.
  // The user picks which game they're going to; all shade/weather math
  // downstream is tied to the actual first-pitch datetime of that game.
  useEffect(() => {
    let cancelled = false;
    const loadGames = async () => {
      setGamesLoading(true);
      setGamesError(null);
      try {
        const today = new Date();
        const endDate = new Date(today.getFullYear(), 9, 31); // Oct 31 — regular season end
        const allGames = await mlbApi.getSchedule(
          today.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0]
        );
        if (cancelled) return;
        const homeGames = mlbApi.getHomeGamesForStadium(stadium.id, allGames);
        setGames(homeGames);
        // Default to the soonest upcoming home game; user can change it below.
        setSelectedGame(homeGames[0] || null);
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to load MLB schedule:', err);
        setGamesError('Unable to load the schedule right now. Please try again.');
        setGames([]);
        setSelectedGame(null);
      } finally {
        if (!cancelled) setGamesLoading(false);
      }
    };
    loadGames();
    return () => {
      cancelled = true;
    };
  }, [stadium.id, refreshKey]);

  // The datetime of the user's selected game (or null if none selected yet).
  const gameDateTime = useMemo(
    () => (selectedGame ? new Date(selectedGame.gameDate) : null),
    [selectedGame]
  );

  // HH:mm string in the stadium's local timezone — required by
  // SeatRecommendationsSection, which splits it for weather lookups.
  const gameTimeStr = useMemo(() => {
    if (!gameDateTime) return null;
    return formatInTimeZone(gameDateTime, stadiumTz, 'HH:mm');
  }, [gameDateTime, stadiumTz]);

  // Pull-to-refresh handler
  const handleRefresh = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    setRefreshKey((prev) => prev + 1);
  }, []);

  const pullToRefresh = usePullToRefresh({
    onRefresh: handleRefresh,
    enabled: typeof window !== 'undefined' && window.innerWidth < 768,
  });

  const handleGameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pk = Number(e.target.value);
    const next = games.find((g) => g.gamePk === pk) || null;
    setSelectedGame(next);
  };

  const handleRetryGames = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <>
      <PullToRefreshIndicator
        pullDistance={pullToRefresh.pullDistance}
        isRefreshing={pullToRefresh.isRefreshing}
        progress={pullToRefresh.progress}
      />

      {/* Stadium Guide */}
      <div className="stadium-guide-wrapper">
        <Suspense
          fallback={
            <div className="flex justify-center items-center p-8">
              <LoadingSpinner message="Loading stadium guide..." />
            </div>
          }
        >
          <ComprehensiveStadiumGuide stadiumId={stadium.id} />
        </Suspense>
      </div>

      {/* Game picker — user selects which game they're attending so shade and
          weather are calculated for the real first-pitch time. */}
      <section
        aria-labelledby="game-picker-heading"
        className="mt-8 mb-6 p-4 rounded-lg border border-blue-200 bg-blue-50"
      >
        <h2
          id="game-picker-heading"
          className="text-lg font-semibold text-blue-900 mb-3"
        >
          Pick your game
        </h2>

        {gamesLoading && (
          <div
            className="flex items-center gap-2 text-sm text-blue-800"
            role="status"
            aria-live="polite"
          >
            <span
              className="h-4 w-4 rounded-full bg-blue-300 animate-pulse"
              aria-hidden="true"
            />
            Loading the {stadium.team} schedule…
          </div>
        )}

        {!gamesLoading && gamesError && (
          <div className="text-sm text-red-800" role="alert">
            {gamesError}{' '}
            <button
              type="button"
              onClick={handleRetryGames}
              className="ml-2 underline font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {!gamesLoading && !gamesError && games.length === 0 && (
          <p className="text-sm text-blue-800">
            No upcoming home games for the {stadium.team}. Check back once the
            next homestand is on the schedule.
          </p>
        )}

        {!gamesLoading && !gamesError && games.length > 0 && (
          <>
            <label htmlFor="game-picker-select" className="sr-only">
              Select your game
            </label>
            <select
              id="game-picker-select"
              value={selectedGame?.gamePk ?? ''}
              onChange={handleGameChange}
              className="w-full rounded-md border border-blue-300 bg-white px-3 py-2 text-sm text-ink-900"
            >
              {games.map((g) => {
                const dt = new Date(g.gameDate);
                const label = formatInTimeZone(
                  dt,
                  stadiumTz,
                  'EEE MMM d, h:mm a zzz'
                );
                return (
                  <option key={g.gamePk} value={g.gamePk}>
                    {label} — {g.teams.away.team.name} @{' '}
                    {g.teams.home.team.name}
                  </option>
                );
              })}
            </select>
            {selectedGame && (
              <p className="mt-2 text-xs text-blue-700">
                Shade and weather below are calculated for this game's real
                first pitch in {stadium.city} local time.
              </p>
            )}
          </>
        )}
      </section>

      {/* AI Seat Recommendations — gated on a real selected game */}
      <div className="mt-4" style={{ display: 'block' }}>
        {!selectedGame ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Select a game above to see section-by-section shade
              recommendations for your specific first-pitch time.
            </p>
          </div>
        ) : sections.length > 0 && gameTimeStr && gameDateTime ? (
          <SeatRecommendationsSection
            sections={sections}
            stadiumId={stadium.id}
            gameTime={gameTimeStr}
            gameDate={gameDateTime}
          />
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <div className="text-gray-700 mb-2 font-medium">
              Recommendations unavailable
            </div>
            <p className="text-sm text-gray-500">
              Basic section information is still available above.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
