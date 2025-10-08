import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import { StadiumTitleBlockProps } from './StadiumTitleBlock.types';

const StadiumTitleBlock: React.FC<StadiumTitleBlockProps> = ({
  data,
  showBreadcrumb = true,
  className = '',
  compact = false,
  gameInfo,
  weatherInfo,
  shadeInfo,
  onCalculateShade,
  onViewSections
}) => {
  const { purpose, stadium, team, quickFacts } = data;
  const { location, capacity, orientation, roofType, yearBuilt } = quickFacts;

  // State for expandable sections
  const [isExpanded, setIsExpanded] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Format roof type for display
  const getRoofTypeDisplay = (type: string) => {
    switch (type) {
      case 'open': return 'Open Air';
      case 'retractable': return 'Retractable Roof';
      case 'fixed': return 'Fixed Roof';
      default: return type;
    }
  };

  // Format purpose badge text
  const getPurposeText = (purpose: string) => {
    switch (purpose) {
      case 'shade-guide': return 'SHADE GUIDE';
      case 'game-day': return 'GAME DAY';
      case 'visitor-guide': return 'VISITOR GUIDE';
      default: return purpose.toUpperCase();
    }
  };

  // Get league-specific icon
  const getLeagueIcon = (league: string) => {
    switch (league) {
      case 'NFL': return '🏈';
      case 'MiLB': return '⚾';
      case 'MLB':
      default: return '⚾';
    }
  };

  // Format capacity based on league
  const getCapacityLabel = (league: string) => {
    switch (league) {
      case 'NFL': return 'capacity';
      case 'MiLB': return 'seats';
      case 'MLB':
      default: return 'seats';
    }
  };

  // Get climate zone based on state
  const getClimateZone = (state: string) => {
    const zones: Record<string, string> = {
      'CA': 'Mediterranean',
      'AZ': 'Desert',
      'TX': 'Subtropical',
      'FL': 'Tropical',
      'NY': 'Continental',
      'MA': 'Continental',
      'IL': 'Continental',
      'CO': 'Semi-arid',
      'WA': 'Marine',
      'GA': 'Humid Subtropical'
    };
    return zones[state] || 'Temperate';
  };

  // Get timezone based on state
  const getTimeZone = (state: string) => {
    const timezones: Record<string, string> = {
      'CA': 'Pacific',
      'WA': 'Pacific',
      'AZ': 'Mountain',
      'CO': 'Mountain',
      'TX': 'Central',
      'IL': 'Central',
      'WI': 'Central',
      'FL': 'Eastern',
      'NY': 'Eastern',
      'MA': 'Eastern',
      'GA': 'Eastern'
    };
    return timezones[state] || 'Eastern';
  };

  // Handlers
  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const handleShare = useCallback((platform: string) => {
    const url = window.location.href;
    const text = `Check out ${stadium.name} - Home of the ${team.name}`;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        // Could show a toast notification here
        break;
    }
    setShowShareMenu(false);
  }, [stadium.name, team.name]);

  const toggleFavorite = useCallback(() => {
    setIsFavorite(prev => !prev);
    // In production, this would save to localStorage or backend
    if (typeof window !== 'undefined') {
      const favorites = JSON.parse(localStorage.getItem('favoriteStadiums') || '[]');
      if (!isFavorite) {
        favorites.push(stadium.id);
      } else {
        const index = favorites.indexOf(stadium.id);
        if (index > -1) favorites.splice(index, 1);
      }
      localStorage.setItem('favoriteStadiums', JSON.stringify(favorites));
    }
  }, [isFavorite, stadium.id]);

  // Check if stadium is favorite on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const favorites = JSON.parse(localStorage.getItem('favoriteStadiums') || '[]');
      setIsFavorite(favorites.includes(stadium.id));
    }
  }, [stadium.id]);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Stadiums', href: '/stadiums' },
    { label: stadium.name }
  ];

  return (
    <div className={`flex flex-col gap-4 p-6 mb-6 bg-white rounded-xl shadow-[0_1px_3px_0_rgb(0_0_0_/_0.1),_0_1px_2px_-1px_rgb(0_0_0_/_0.1)] relative w-full box-border ${className} ${compact ? 'p-4 gap-3' : ''}`}>
      {/* Breadcrumb Navigation */}
      {showBreadcrumb && (
        <div className="mb-2">
          <Breadcrumb items={breadcrumbItems} className="text-sm text-gray-500" />
        </div>
      )}

      {/* Purpose Badge with Game Indicator */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="inline-flex items-center px-3 py-1.5 bg-[linear-gradient(135deg,#3b82f6_0%,#10b981_100%)] rounded-[20px] shadow-[0_2px_4px_rgba(59,130,246,0.2)] transition-transform hover:translate-y-[-1px] hover:shadow-[0_4px_6px_rgba(59,130,246,0.25)]" aria-label={`${getPurposeText(purpose)} for ${stadium.name}`}>
          <span className="text-[10px] font-bold tracking-[0.1em] text-white uppercase">{getPurposeText(purpose)}</span>
        </div>

        {gameInfo?.isToday && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#fef3c7] border border-[#fbbf24] rounded-[20px] animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]">
            <span className="text-[10px] animate-[blink_1.5s_ease-in-out_infinite]">🔴</span>
            <span className="text-xs font-semibold text-[#92400e]">
              Game Today {gameInfo.time && `at ${gameInfo.time}`}
            </span>
          </div>
        )}
      </div>

      {/* Stadium Name with Interactive Controls */}
      <div className="flex justify-between items-start gap-4">
        <h1 className="text-4xl font-extrabold leading-tight text-gray-900 m-0 tracking-[-0.02em] flex-1">
          {stadium.name}
        </h1>

        <div className="flex gap-2 items-center">
          {/* Favorite Button */}
          <button
            className={`w-9 h-9 rounded-full border border-gray-300 bg-white text-gray-500 text-lg cursor-pointer transition-all flex items-center justify-center relative hover:bg-gray-100 hover:border-gray-400 hover:scale-105 active:scale-95 ${isFavorite ? 'text-amber-400 bg-amber-50 border-amber-400' : ''}`}
            onClick={toggleFavorite}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '⭐' : '☆'}
          </button>

          {/* Share Button */}
          <div className="relative">
            <button
              className="w-9 h-9 rounded-full border border-gray-300 bg-white text-gray-500 text-lg cursor-pointer transition-all flex items-center justify-center relative hover:bg-gray-100 hover:border-gray-400 hover:scale-105 active:scale-95"
              onClick={() => setShowShareMenu(!showShareMenu)}
              aria-label="Share stadium"
              title="Share"
            >
              📤
            </button>
            {showShareMenu && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] overflow-hidden z-50 min-w-[120px]">
                <button className="block w-full px-3 py-2 text-left text-sm text-gray-700 bg-none border-none cursor-pointer transition-colors hover:bg-gray-100" onClick={() => handleShare('twitter')}>Twitter</button>
                <button className="block w-full px-3 py-2 text-left text-sm text-gray-700 bg-none border-none cursor-pointer transition-colors hover:bg-gray-100" onClick={() => handleShare('facebook')}>Facebook</button>
                <button className="block w-full px-3 py-2 text-left text-sm text-gray-700 bg-none border-none cursor-pointer transition-colors hover:bg-gray-100" onClick={() => handleShare('copy')}>Copy Link</button>
              </div>
            )}
          </div>

          {/* Expand/Collapse Button */}
          <button
            className="w-9 h-9 rounded-full border border-gray-300 bg-white text-gray-500 text-lg cursor-pointer transition-all flex items-center justify-center relative hover:bg-gray-100 hover:border-gray-400 hover:scale-105 active:scale-95"
            onClick={toggleExpanded}
            aria-label={isExpanded ? 'Show less details' : 'Show more details'}
            title={isExpanded ? 'Show less' : 'Show more'}
          >
            {isExpanded ? '−' : '+'}
          </button>
        </div>
      </div>

      {/* Team Information - Secondary Context */}
      <div className="flex items-center gap-2 flex-wrap text-sm text-gray-600">
        <span className="font-semibold text-gray-900">{team.name}</span>
        <span className="text-gray-400">•</span>
        <span className="flex items-center gap-1">
          <span className="text-base" aria-hidden="true">
            {getLeagueIcon(team.league)}
          </span>
          {team.league}
        </span>
        {team.division && (
          <>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{team.division}</span>
          </>
        )}
      </div>

      {/* Quick Facts - Metadata Pills */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700 border border-gray-200 transition-colors hover:bg-gray-200">
          <span className="text-base" aria-hidden="true">📍</span>
          <span>{location.city}, {location.state}</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700 border border-gray-200 transition-colors hover:bg-gray-200">
          <span className="text-base" aria-hidden="true">🏟️</span>
          <span>{capacity.toLocaleString()} {getCapacityLabel(team.league)}</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700 border border-gray-200 transition-colors hover:bg-gray-200">
          <span className="text-base" aria-hidden="true">🧭</span>
          <span>{orientation}° orientation</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700 border border-gray-200 transition-colors hover:bg-gray-200">
          <span className="text-base" aria-hidden="true">☀️</span>
          <span>{getRoofTypeDisplay(roofType)}</span>
        </div>

        {yearBuilt && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700 border border-gray-200 transition-colors hover:bg-gray-200">
            <span className="text-base" aria-hidden="true">📅</span>
            <span>Built {yearBuilt}</span>
          </div>
        )}
      </div>

      {/* Expandable Additional Details */}
      {isExpanded && (
        <div className="mt-5 pt-5 border-t border-gray-300 animate-[slideDown_0.3s_ease-out]">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5">
            {/* Stadium Details */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
              <h3 className="text-sm font-semibold text-gray-700 m-0 mb-3 uppercase tracking-wide">Stadium Details</h3>
              <dl className="grid gap-2 m-0">
                <dt className="text-xs text-gray-500 font-medium">Full Name</dt>
                <dd className="text-sm font-semibold text-gray-900 m-0 mb-2">{stadium.name}</dd>
                <dt className="text-xs text-gray-500 font-medium">Home Team</dt>
                <dd className="text-sm font-semibold text-gray-900 m-0 mb-2">{team.name}</dd>
                <dt className="text-xs text-gray-500 font-medium">League</dt>
                <dd className="text-sm font-semibold text-gray-900 m-0 mb-2">{team.league} {team.division && `- ${team.division}`}</dd>
                <dt className="text-xs text-gray-500 font-medium">Year Built</dt>
                <dd className="text-sm font-semibold text-gray-900 m-0 mb-2">{yearBuilt || 'N/A'}</dd>
                <dt className="text-xs text-gray-500 font-medium">Seating Capacity</dt>
                <dd className="text-sm font-semibold text-gray-900 m-0 mb-2">{capacity.toLocaleString()}</dd>
                <dt className="text-xs text-gray-500 font-medium">Field Orientation</dt>
                <dd className="text-sm font-semibold text-gray-900 m-0 mb-2">{orientation}° (Home to Center)</dd>
              </dl>
            </div>

            {/* Location & Weather */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
              <h3 className="text-sm font-semibold text-gray-700 m-0 mb-3 uppercase tracking-wide">Location & Climate</h3>
              <dl className="grid gap-2 m-0">
                <dt className="text-xs text-gray-500 font-medium">City</dt>
                <dd className="text-sm font-semibold text-gray-900 m-0 mb-2">{location.city}</dd>
                <dt className="text-xs text-gray-500 font-medium">State</dt>
                <dd className="text-sm font-semibold text-gray-900 m-0 mb-2">{location.state}</dd>
                <dt className="text-xs text-gray-500 font-medium">Roof Type</dt>
                <dd className="text-sm font-semibold text-gray-900 m-0 mb-2">{getRoofTypeDisplay(roofType)}</dd>
                <dt className="text-xs text-gray-500 font-medium">Climate Zone</dt>
                <dd className="text-sm font-semibold text-gray-900 m-0 mb-2">{getClimateZone(location.state)}</dd>
                <dt className="text-xs text-gray-500 font-medium">Time Zone</dt>
                <dd className="text-sm font-semibold text-gray-900 m-0 mb-2">{getTimeZone(location.state)}</dd>
              </dl>
            </div>

            {/* Shade Information */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
              <h3 className="text-sm font-semibold text-gray-700 m-0 mb-3 uppercase tracking-wide">Shade Information</h3>
              <dl className="grid gap-2 m-0">
                <dt className="text-xs text-gray-500 font-medium">Best Shade Time</dt>
                <dd className="text-sm font-semibold text-gray-900 m-0 mb-2">Evening games (7:00 PM+)</dd>
                <dt className="text-xs text-gray-500 font-medium">Most Sun Exposure</dt>
                <dd className="text-sm font-semibold text-gray-900 m-0 mb-2">Day games (12:00-3:00 PM)</dd>
                <dt className="text-xs text-gray-500 font-medium">Covered Sections</dt>
                <dd className="text-sm font-semibold text-gray-900 m-0 mb-2">{roofType !== 'open' ? 'All sections (roof)' : 'Upper deck overhang'}</dd>
                <dt className="text-xs text-gray-500 font-medium">Shade Direction</dt>
                <dd className="text-sm font-semibold text-gray-900 m-0 mb-2">{orientation < 90 || orientation > 270 ? 'Third base side' : 'First base side'}</dd>
              </dl>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Info Row - Weather & Shade */}
      {(weatherInfo || shadeInfo) && (
        <div className="flex gap-3 flex-wrap">
          {weatherInfo && (
            <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg flex-1 min-w-[200px]">
              <span className="text-3xl">
                {weatherInfo.icon || '☀️'}
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-2xl font-bold text-gray-900">
                  {weatherInfo.temperature}°F
                </span>
                <span className="text-sm text-gray-600">
                  {weatherInfo.condition}
                </span>
              </div>
            </div>
          )}

          {shadeInfo?.percentage !== undefined && (
            <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg flex-1 min-w-[200px]">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-extrabold text-green-700">
                  {shadeInfo.percentage}%
                </span>
                <span className="text-sm font-medium text-green-600">Shaded</span>
              </div>
              {shadeInfo.bestSections && shadeInfo.bestSections.length > 0 && (
                <span className="text-xs text-green-700">
                  Best: {shadeInfo.bestSections.slice(0, 3).join(', ')}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Quick Action Buttons */}
      {(onCalculateShade || onViewSections) && (
        <div className="flex gap-3 flex-wrap">
          {onCalculateShade && (
            <button
              className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-6 py-3 bg-[linear-gradient(135deg,#3b82f6_0%,#2563eb_100%)] text-white font-semibold rounded-lg transition-all hover:shadow-[0_4px_12px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 active:translate-y-0 border-none cursor-pointer"
              onClick={onCalculateShade}
              aria-label="Calculate shade for this stadium"
            >
              <span className="text-xl">🌤️</span>
              <span>Calculate Shade</span>
            </button>
          )}
          {onViewSections && (
            <button
              className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 transition-all hover:bg-blue-50 hover:shadow-[0_2px_8px_rgba(59,130,246,0.2)] active:scale-[0.98] cursor-pointer"
              onClick={onViewSections}
              aria-label="View all sections"
            >
              <span className="text-xl">🏟️</span>
              <span>View Sections</span>
            </button>
          )}
        </div>
      )}

      {/* Accessibility: Hidden text for screen readers */}
      <div className="sr-only" aria-live="polite">
        {stadium.name} stadium information: Home of the {team.name} in {team.league}.
        Located in {location.city}, {location.state} with a capacity of {capacity.toLocaleString()} seats.
        The stadium has {getRoofTypeDisplay(roofType).toLowerCase()} and faces {orientation} degrees.
        {yearBuilt && ` Built in ${yearBuilt}.`}
      </div>
    </div>
  );
};

export default StadiumTitleBlock;