// World Cup Match Countdown Timer
// Displays countdown to next match with real-time updates

import React, { useState, useEffect } from 'react';

export interface MatchCountdownProps {
  /** Match date in ISO format (YYYY-MM-DD) */
  matchDate: string;
  /** Match kickoff time (HH:MM in 24-hour format) */
  kickoffTime: string;
  /** Timezone of the venue */
  timezone?: string;
  /** Team A name */
  teamA?: string;
  /** Team B name */
  teamB?: string;
  /** Venue name */
  venueName?: string;
  /** Display size */
  size?: 'small' | 'medium' | 'large';
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

/**
 * Calculate time remaining until match
 */
function calculateTimeRemaining(matchDate: string, kickoffTime: string): TimeRemaining {
  const [hours, minutes] = kickoffTime.split(':').map(Number);
  const matchDateTime = new Date(matchDate);
  matchDateTime.setHours(hours, minutes, 0, 0);

  const now = new Date();
  const diff = matchDateTime.getTime() - now.getTime();

  if (diff < 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secondsRemaining = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    days,
    hours: hoursRemaining,
    minutes: minutesRemaining,
    seconds: secondsRemaining,
    isPast: false
  };
}

/**
 * Match Countdown Component
 * Real-time countdown to World Cup match
 */
export const MatchCountdown: React.FC<MatchCountdownProps> = ({
  matchDate,
  kickoffTime,
  timezone,
  teamA,
  teamB,
  venueName,
  size = 'medium'
}) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(
    calculateTimeRemaining(matchDate, kickoffTime)
  );

  useEffect(() => {
    // Update countdown every second
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(matchDate, kickoffTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [matchDate, kickoffTime]);

  if (timeRemaining.isPast) {
    return (
      <div className="text-center p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600">Match completed</p>
      </div>
    );
  }

  // Size configurations
  const sizeConfig = {
    small: {
      container: 'p-3',
      title: 'text-sm',
      number: 'text-2xl',
      label: 'text-xs',
      teams: 'text-xs',
      venue: 'text-xs'
    },
    medium: {
      container: 'p-4',
      title: 'text-base',
      number: 'text-3xl',
      label: 'text-sm',
      teams: 'text-sm',
      venue: 'text-xs'
    },
    large: {
      container: 'p-6',
      title: 'text-lg',
      number: 'text-4xl',
      label: 'text-base',
      teams: 'text-base',
      venue: 'text-sm'
    }
  };

  const config = sizeConfig[size];

  return (
    <div className={`${config.container} bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200`}>
      {/* Match info */}
      {(teamA || teamB) && (
        <div className={`text-center mb-3 ${config.teams} font-semibold text-gray-800`}>
          {teamA || 'TBD'} vs {teamB || 'TBD'}
        </div>
      )}

      {/* Countdown grid */}
      <div className="grid grid-cols-4 gap-2">
        {/* Days */}
        <div className="text-center">
          <div className={`${config.number} font-bold text-purple-600`}>
            {timeRemaining.days}
          </div>
          <div className={`${config.label} text-gray-600 uppercase tracking-wide`}>
            {timeRemaining.days === 1 ? 'Day' : 'Days'}
          </div>
        </div>

        {/* Hours */}
        <div className="text-center">
          <div className={`${config.number} font-bold text-blue-600`}>
            {String(timeRemaining.hours).padStart(2, '0')}
          </div>
          <div className={`${config.label} text-gray-600 uppercase tracking-wide`}>
            {timeRemaining.hours === 1 ? 'Hour' : 'Hours'}
          </div>
        </div>

        {/* Minutes */}
        <div className="text-center">
          <div className={`${config.number} font-bold text-indigo-600`}>
            {String(timeRemaining.minutes).padStart(2, '0')}
          </div>
          <div className={`${config.label} text-gray-600 uppercase tracking-wide`}>
            {timeRemaining.minutes === 1 ? 'Min' : 'Mins'}
          </div>
        </div>

        {/* Seconds */}
        <div className="text-center">
          <div className={`${config.number} font-bold text-pink-600`}>
            {String(timeRemaining.seconds).padStart(2, '0')}
          </div>
          <div className={`${config.label} text-gray-600 uppercase tracking-wide`}>
            {timeRemaining.seconds === 1 ? 'Sec' : 'Secs'}
          </div>
        </div>
      </div>

      {/* Venue info */}
      {venueName && (
        <div className={`text-center mt-3 ${config.venue} text-gray-600`}>
          {venueName}
        </div>
      )}

      {/* Kickoff time */}
      <div className={`text-center mt-2 ${config.venue} text-gray-500`}>
        Kickoff: {kickoffTime} {timezone && `(${timezone})`}
      </div>
    </div>
  );
};

export default MatchCountdown;
