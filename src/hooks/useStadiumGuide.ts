// React hook for dynamically loading stadium guides
import { useState, useEffect } from 'react';
import { StadiumGuide } from '../data/stadiumGuides';
import { loadStadiumGuide, loadGuidesByLeague, prefetchGuides } from '../data/guides/dynamicLoader';

interface UseStadiumGuideResult {
  guide: StadiumGuide | undefined;
  loading: boolean;
  error: Error | null;
}

export function useStadiumGuide(
  stadiumId: string,
  league?: 'MLB' | 'NFL' | 'AAA' | 'AA' | 'A+' | 'A'
): UseStadiumGuideResult {
  const [guide, setGuide] = useState<StadiumGuide | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadGuide() {
      try {
        setLoading(true);
        setError(null);

        const loadedGuide = await loadStadiumGuide(stadiumId, league);

        if (!cancelled) {
          setGuide(loadedGuide);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to load stadium guide'));
          setLoading(false);
        }
      }
    }

    loadGuide();

    return () => {
      cancelled = true;
    };
  }, [stadiumId, league]);

  return { guide, loading, error };
}

interface UseStadiumGuidesResult {
  guides: Record<string, StadiumGuide>;
  loading: boolean;
  error: Error | null;
}

export function useStadiumGuides(
  league: 'MLB' | 'NFL' | 'AAA' | 'AA' | 'A+' | 'A'
): UseStadiumGuidesResult {
  const [guides, setGuides] = useState<Record<string, StadiumGuide>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadGuides() {
      try {
        setLoading(true);
        setError(null);

        const loadedGuides = await loadGuidesByLeague(league);

        if (!cancelled) {
          setGuides(loadedGuides);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to load stadium guides'));
          setLoading(false);
        }
      }
    }

    loadGuides();

    return () => {
      cancelled = true;
    };
  }, [league]);

  return { guides, loading, error };
}

// Hook to prefetch guides for adjacent leagues
export function usePrefetchGuides(
  currentLeague: 'MLB' | 'NFL' | 'AAA' | 'AA' | 'A+' | 'A',
  prefetchLeagues?: Array<'MLB' | 'NFL' | 'AAA' | 'AA' | 'A+' | 'A'>
) {
  useEffect(() => {
    // Determine what to prefetch
    const toPrefetch = prefetchLeagues || getAdjacentLeagues(currentLeague);

    // Prefetch with a slight delay to prioritize current content
    const timeoutId = setTimeout(() => {
      toPrefetch.forEach(league => {
        if (league !== currentLeague) {
          prefetchGuides(league);
        }
      });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [currentLeague, prefetchLeagues]);
}

// Helper to get adjacent leagues for prefetching
function getAdjacentLeagues(
  league: 'MLB' | 'NFL' | 'AAA' | 'AA' | 'A+' | 'A'
): Array<'MLB' | 'NFL' | 'AAA' | 'AA' | 'A+' | 'A'> {
  const milbLeagues: Array<'AAA' | 'AA' | 'A+' | 'A'> = ['AAA', 'AA', 'A+', 'A'];

  if (league === 'MLB') {
    return ['AAA']; // Most likely to navigate to AAA from MLB
  } else if (league === 'NFL') {
    return ['MLB']; // Most likely to navigate to MLB from NFL
  } else if (milbLeagues.includes(league as any)) {
    // For MiLB, prefetch adjacent levels
    const index = milbLeagues.indexOf(league as any);
    const adjacent = [];

    if (index > 0) adjacent.push(milbLeagues[index - 1]);
    if (index < milbLeagues.length - 1) adjacent.push(milbLeagues[index + 1]);

    return adjacent as Array<'MLB' | 'NFL' | 'AAA' | 'AA' | 'A+' | 'A'>;
  }

  return [];
}