'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { MatchCountdown } from '../MatchCountdown';
import { WORLD_CUP_2026_INFO } from '../../data/worldcup2026/types';
import { getNextMatch } from '../../data/worldcup2026/matches';
import { ALL_WORLD_CUP_VENUES } from '../../data/worldcup2026/venues';
import { useTranslation } from '../../i18n/i18nContext';

interface WorldCupHeroProps {
  className?: string;
}

export function WorldCupHero({ className = '' }: WorldCupHeroProps) {
  const { t } = useTranslation();
  const nextMatch = useMemo(() => getNextMatch(), []);

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white ${className}`}>
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] animate-pulse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          {/* World Cup Badge */}
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              <span className="text-2xl">⚽</span>
              <span className="text-lg font-bold">FIFA World Cup 2026</span>
              <span className="text-2xl">⚽</span>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in leading-tight">
            {t('worldcup.title')}
          </h1>

          {/* Subtitle */}
          <p className="text-2xl md:text-3xl text-purple-100 mb-4 font-medium">
            {t('worldcup.subtitle')}
          </p>

          {/* Description */}
          <p className="text-xl text-purple-200 mb-8 max-w-3xl mx-auto">
            {t('worldcup.description')}
          </p>

          {/* Host Countries Badge */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇺🇸</span>
                <span className="font-semibold">USA</span>
              </div>
              <div className="h-6 w-px bg-white/30"></div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇲🇽</span>
                <span className="font-semibold">Mexico</span>
              </div>
              <div className="h-6 w-px bg-white/30"></div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇨🇦</span>
                <span className="font-semibold">Canada</span>
              </div>
            </div>
          </div>

          {/* Opening Match Countdown */}
          {nextMatch && (
            <div className="mb-8 max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">🎉 {t('worldcup.countdown.title')}</h2>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <MatchCountdown
                  matchDate={nextMatch.date}
                  kickoffTime={nextMatch.kickoffTime}
                  timezone={ALL_WORLD_CUP_VENUES.find(v => v.id === nextMatch.venue)?.timezone || 'UTC'}
                  teamA={nextMatch.teamA}
                  teamB={nextMatch.teamB}
                  venueName={ALL_WORLD_CUP_VENUES.find(v => v.id === nextMatch.venue)?.commonName || 'TBD'}
                  size="large"
                />
              </div>
            </div>
          )}

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-colors">
              <div className="text-4xl font-bold mb-1">{WORLD_CUP_2026_INFO.totalVenues}</div>
              <div className="text-sm text-purple-200">{t('worldcup.stats.totalVenues')}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-colors">
              <div className="text-4xl font-bold mb-1">{WORLD_CUP_2026_INFO.totalMatches}</div>
              <div className="text-sm text-purple-200">{t('worldcup.stats.totalMatches')}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-colors">
              <div className="text-4xl font-bold mb-1">{WORLD_CUP_2026_INFO.participatingTeams}</div>
              <div className="text-sm text-purple-200">{t('worldcup.info.teams')}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-colors">
              <div className="text-4xl font-bold mb-1">{WORLD_CUP_2026_INFO.totalCountries}</div>
              <div className="text-sm text-purple-200">{t('worldcup.hostCountries')}</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/worldcup2026/schedule"
              className="px-8 py-4 bg-white text-purple-600 rounded-lg font-bold text-lg hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              📅 {t('worldcup.viewSchedule')}
            </Link>
            <a
              href="#venues"
              className="px-8 py-4 bg-purple-500 text-white rounded-lg font-bold text-lg hover:bg-purple-400 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🏟️ {t('worldcup.navigation.venues')}
            </a>
            <Link
              href="/worldcup2026/compare"
              className="px-8 py-4 bg-indigo-500 text-white rounded-lg font-bold text-lg hover:bg-indigo-400 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              ⚖️ Compare Venues
            </Link>
          </div>

          {/* Tournament Dates */}
          <div className="mt-8 text-purple-100 text-lg">
            <span className="font-semibold">{WORLD_CUP_2026_INFO.startDate}</span>
            {' '}&mdash;{' '}
            <span className="font-semibold">{WORLD_CUP_2026_INFO.endDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
