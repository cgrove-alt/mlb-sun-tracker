'use client';

/**
 * The multi-league finder (MLB, MiLB and NFL venues with a custom date and
 * time). It used to sit hidden on the homepage; MLB fans now use the
 * game-by-game shade map there, and this page keeps the full finder for NFL
 * and minor league games.
 */
import dynamic from 'next/dynamic';
import { ErrorBoundary } from '../../src/components/ErrorBoundary';

const UnifiedApp = dynamic(() => import('../../src/UnifiedApp'), {
  ssr: false,
  loading: () => <p className="text-ink-700">Loading the stadium finder…</p>,
});

export default function FullFinder() {
  return (
    <ErrorBoundary level="section">
      <UnifiedApp />
    </ErrorBoundary>
  );
}
