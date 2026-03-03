'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { WORLD_CUP_2026_MATCHES } from '../../data/worldcup2026/matches';
import { ALL_WORLD_CUP_VENUES } from '../../data/worldcup2026/venues';
import { getKickoffShade, getShadeGuide } from '../../data/worldcup2026/shadeGuides';

function getShadeBadgeColor(shadePct: number): string {
  if (shadePct >= 80) return 'bg-green-100 text-green-800 border-green-200';
  if (shadePct >= 50) return 'bg-blue-100 text-blue-800 border-blue-200';
  if (shadePct >= 30) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  return 'bg-red-100 text-red-800 border-red-200';
}

export default function MatchShadeFinder() {
  const [selectedMatchId, setSelectedMatchId] = useState('');

  const sortedMatches = useMemo(() =>
    [...WORLD_CUP_2026_MATCHES].sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.kickoffTime.localeCompare(b.kickoffTime);
    }),
    []
  );

  const selectedMatch = sortedMatches.find(m => m.matchId === selectedMatchId);
  const venue = selectedMatch ? ALL_WORLD_CUP_VENUES.find(v => v.id === selectedMatch.venue) : null;

  // Find the closest kickoff time from our pre-computed data
  const getClosestKickoff = (time: string): string => {
    const hour = parseInt(time.split(':')[0]);
    if (hour <= 13) return '12:00';
    if (hour <= 16) return '15:00';
    if (hour <= 19) return '18:00';
    return '21:00';
  };

  const shadeData = selectedMatch && venue
    ? getKickoffShade(venue.id, getClosestKickoff(selectedMatch.kickoffTime))
    : null;

  const shadeGuide = venue ? getShadeGuide(venue.id) : null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Find Shade at Your Match
      </h2>
      <p className="text-gray-600 mb-6">
        Select a match to see shade analysis and the best sections to sit in.
      </p>

      <select
        value={selectedMatchId}
        onChange={e => setSelectedMatchId(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-6"
      >
        <option value="">Choose a match...</option>
        {sortedMatches.map(match => {
          const matchVenue = ALL_WORLD_CUP_VENUES.find(v => v.id === match.venue);
          return (
            <option key={match.matchId} value={match.matchId}>
              {formatDate(match.date)} {match.kickoffTime} — {match.teamA} vs {match.teamB} ({match.round}) @ {matchVenue?.commonName || match.venue}
            </option>
          );
        })}
      </select>

      {selectedMatch && venue && shadeData && shadeGuide && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{venue.commonName}</h3>
              <p className="text-sm text-gray-500">
                {formatDate(selectedMatch.date)} at {selectedMatch.kickoffTime} local time
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getShadeBadgeColor(shadeData.shadePct)}`}>
              {shadeData.shadePct}% Shade
            </span>
          </div>

          <p className="text-gray-700">{shadeData.recommendation}</p>

          {shadeData.bestSections.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <h4 className="text-sm font-semibold text-green-800 mb-2">Best sections for shade</h4>
                <div className="flex flex-wrap gap-1">
                  {shadeData.bestSections.map(s => (
                    <span key={s} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">{s}</span>
                  ))}
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                <h4 className="text-sm font-semibold text-red-800 mb-2">Most sun exposure</h4>
                <div className="flex flex-wrap gap-1">
                  {shadeData.worstSections.map(s => (
                    <span key={s} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Link
            href={`/worldcup2026/venues/${venue.id}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            View full venue shade guide
          </Link>
        </div>
      )}
    </section>
  );
}
