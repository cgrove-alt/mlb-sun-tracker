'use client';

import React from 'react';
import Link from 'next/link';
import { WORLD_CUP_2026_INFO } from '../../data/worldcup2026/types';
import { ALL_WORLD_CUP_VENUES } from '../../data/worldcup2026/venues';
import { useTranslation } from '../../i18n/i18nContext';

interface KeyDatesTimelineProps {
  className?: string;
}

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  venue?: string;
  city?: string;
}

export function KeyDatesTimeline({ className = '' }: KeyDatesTimelineProps) {
  const { t } = useTranslation();

  const timelineEvents: TimelineEvent[] = [
    {
      date: WORLD_CUP_2026_INFO.openingMatch.date,
      title: 'Opening Match 🎉',
      description: `${WORLD_CUP_2026_INFO.openingMatch.teams} - The tournament begins!`,
      venue: WORLD_CUP_2026_INFO.openingMatch.venue,
      city: WORLD_CUP_2026_INFO.openingMatch.city,
      icon: '⚽',
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300'
    },
    {
      date: '2026-06-11 to 2026-06-26',
      title: 'Group Stage',
      description: '48 teams compete in 16 groups. Every team plays 3 matches.',
      icon: '🏆',
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300'
    },
    {
      date: '2026-06-27 to 2026-06-30',
      title: 'Round of 32',
      description: 'Top teams advance. 16 knockout matches determine the Round of 16.',
      icon: '🎯',
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300'
    },
    {
      date: '2026-07-01 to 2026-07-03',
      title: 'Round of 16',
      description: 'Win or go home. 8 matches to determine the quarterfinals.',
      icon: '⚡',
      color: 'text-orange-700',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-300'
    },
    {
      date: '2026-07-09 to 2026-07-11',
      title: 'Quarterfinals',
      description: 'Only 8 teams remain. 4 matches decide the semifinalists.',
      icon: '🔥',
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300'
    },
    {
      date: '2026-07-14 & 2026-07-15',
      title: 'Semifinals',
      description: 'The final four compete for a spot in the championship.',
      icon: '⭐',
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-300'
    },
    {
      date: '2026-07-18',
      title: 'Third Place Match',
      description: 'Semifinal losers compete for the bronze medal.',
      icon: '🥉',
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-300'
    },
    {
      date: WORLD_CUP_2026_INFO.final.date,
      title: 'Final 🏆',
      description: 'The championship match. One team will be crowned World Cup champion!',
      venue: WORLD_CUP_2026_INFO.final.venue,
      city: WORLD_CUP_2026_INFO.final.city,
      icon: '👑',
      color: 'text-indigo-700',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-300'
    }
  ];

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 md:p-8 ${className}`}>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">📅 Tournament Timeline</h2>
        <p className="text-gray-600">Key dates and match rounds from June 11 to July 19, 2026</p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-300 via-blue-300 to-indigo-300"></div>

        {/* Timeline Events */}
        <div className="space-y-8">
          {timelineEvents.map((event, index) => {
            const isEven = index % 2 === 0;
            const venueInfo = event.venue ? ALL_WORLD_CUP_VENUES.find(v => v.id === event.venue) : null;

            return (
              <div
                key={index}
                className={`relative flex items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Content Card */}
                <div className={`w-full md:w-5/12 ${isEven ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'}`}>
                  <div className={`${event.bgColor} border-2 ${event.borderColor} rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow`}>
                    <div className={`flex items-center gap-2 mb-2 ${isEven ? 'md:justify-end' : 'md:justify-start'} justify-start`}>
                      <span className="text-2xl">{event.icon}</span>
                      <h3 className={`text-xl font-bold ${event.color}`}>{event.title}</h3>
                    </div>

                    <p className="text-sm font-semibold text-gray-600 mb-2">{event.date}</p>
                    <p className="text-gray-700 mb-3">{event.description}</p>

                    {venueInfo && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          📍 {venueInfo.commonName}
                        </p>
                        <p className="text-sm text-gray-600">{event.city}</p>
                        <Link
                          href={venueInfo.nflStadiumId ? `/venue/${venueInfo.nflStadiumId}` : `/venue/${venueInfo.id}`}
                          className="inline-block mt-2 text-sm font-medium text-purple-600 hover:text-purple-700"
                        >
                          Find Shaded Seats →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Center Dot */}
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-white border-4 border-purple-600 shadow-md z-10 items-center justify-center">
                  <span className="text-xs">{event.icon}</span>
                </div>

                {/* Spacer for other side */}
                <div className="hidden md:block w-5/12"></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-12 text-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Plan Your World Cup Journey
        </h3>
        <p className="text-gray-700 mb-4">
          View the complete match schedule and find shaded seats at all 16 venues
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/worldcup2026/schedule"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors shadow-md"
          >
            📅 Full Match Schedule
          </Link>
          <Link
            href="/worldcup2026/compare"
            className="px-6 py-3 bg-white text-purple-600 border-2 border-purple-600 rounded-lg font-bold hover:bg-purple-50 transition-colors shadow-md"
          >
            ⚖️ Compare Venues
          </Link>
        </div>
      </div>
    </div>
  );
}
