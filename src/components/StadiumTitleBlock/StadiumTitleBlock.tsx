import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import { StadiumTitleBlockProps } from './StadiumTitleBlock.types';
import styles from './StadiumTitleBlock.module.css';

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
    <div className={`${styles.titleBlock} ${className} ${compact ? styles.compact : ''}`}>
      {/* Breadcrumb Navigation */}
      {showBreadcrumb && (
        <div className={styles.breadcrumbWrapper}>
          <Breadcrumb items={breadcrumbItems} className={styles.breadcrumb} />
        </div>
      )}

      {/* Purpose Badge with Game Indicator */}
      <div className={styles.badgeRow}>
        <div className={styles.purposeBadge} aria-label={`${getPurposeText(purpose)} for ${stadium.name}`}>
          <span className={styles.purposeText}>{getPurposeText(purpose)}</span>
        </div>

        {gameInfo?.isToday && (
          <div className={styles.gameIndicator}>
            <span className={styles.liveIcon}>🔴</span>
            <span className={styles.gameText}>
              Game Today {gameInfo.time && `at ${gameInfo.time}`}
            </span>
          </div>
        )}
      </div>

      {/* Stadium Name with Interactive Controls */}
      <div className={styles.titleRow}>
        <h1 className={styles.stadiumName}>
          {stadium.name}
        </h1>

        <div className={styles.controls}>
          {/* Favorite Button */}
          <button
            className={`${styles.controlButton} ${isFavorite ? styles.favorited : ''}`}
            onClick={toggleFavorite}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '⭐' : '☆'}
          </button>

          {/* Share Button */}
          <div className={styles.shareWrapper}>
            <button
              className={styles.controlButton}
              onClick={() => setShowShareMenu(!showShareMenu)}
              aria-label="Share stadium"
              title="Share"
            >
              📤
            </button>
            {showShareMenu && (
              <div className={styles.shareMenu}>
                <button onClick={() => handleShare('twitter')}>Twitter</button>
                <button onClick={() => handleShare('facebook')}>Facebook</button>
                <button onClick={() => handleShare('copy')}>Copy Link</button>
              </div>
            )}
          </div>

          {/* Expand/Collapse Button */}
          <button
            className={styles.controlButton}
            onClick={toggleExpanded}
            aria-label={isExpanded ? 'Show less details' : 'Show more details'}
            title={isExpanded ? 'Show less' : 'Show more'}
          >
            {isExpanded ? '−' : '+'}
          </button>
        </div>
      </div>

      {/* Team Information - Secondary Context */}
      <div className={styles.teamInfo}>
        <span className={styles.teamName}>{team.name}</span>
        <span className={styles.separator}>•</span>
        <span className={styles.league}>
          <span className={styles.leagueIcon} aria-hidden="true">
            {getLeagueIcon(team.league)}
          </span>
          {team.league}
        </span>
        {team.division && (
          <>
            <span className={styles.separator}>•</span>
            <span className={styles.division}>{team.division}</span>
          </>
        )}
      </div>

      {/* Quick Facts - Metadata Pills */}
      <div className={styles.quickFacts}>
        <div className={styles.factPill}>
          <span className={styles.factIcon} aria-hidden="true">📍</span>
          <span className={styles.factText}>{location.city}, {location.state}</span>
        </div>

        <div className={styles.factPill}>
          <span className={styles.factIcon} aria-hidden="true">🏟️</span>
          <span className={styles.factText}>{capacity.toLocaleString()} {getCapacityLabel(team.league)}</span>
        </div>

        <div className={styles.factPill}>
          <span className={styles.factIcon} aria-hidden="true">🧭</span>
          <span className={styles.factText}>{orientation}° orientation</span>
        </div>

        <div className={styles.factPill}>
          <span className={styles.factIcon} aria-hidden="true">☀️</span>
          <span className={styles.factText}>{getRoofTypeDisplay(roofType)}</span>
        </div>

        {yearBuilt && (
          <div className={styles.factPill}>
            <span className={styles.factIcon} aria-hidden="true">📅</span>
            <span className={styles.factText}>Built {yearBuilt}</span>
          </div>
        )}
      </div>

      {/* Expandable Additional Details */}
      {isExpanded && (
        <div className={styles.expandedSection}>
          <div className={styles.detailsGrid}>
            {/* Stadium Details */}
            <div className={styles.detailCard}>
              <h3>Stadium Details</h3>
              <dl className={styles.detailsList}>
                <dt>Full Name</dt>
                <dd>{stadium.name}</dd>
                <dt>Home Team</dt>
                <dd>{team.name}</dd>
                <dt>League</dt>
                <dd>{team.league} {team.division && `- ${team.division}`}</dd>
                <dt>Year Built</dt>
                <dd>{yearBuilt || 'N/A'}</dd>
                <dt>Seating Capacity</dt>
                <dd>{capacity.toLocaleString()}</dd>
                <dt>Field Orientation</dt>
                <dd>{orientation}° (Home to Center)</dd>
              </dl>
            </div>

            {/* Location & Weather */}
            <div className={styles.detailCard}>
              <h3>Location & Climate</h3>
              <dl className={styles.detailsList}>
                <dt>City</dt>
                <dd>{location.city}</dd>
                <dt>State</dt>
                <dd>{location.state}</dd>
                <dt>Roof Type</dt>
                <dd>{getRoofTypeDisplay(roofType)}</dd>
                <dt>Climate Zone</dt>
                <dd>{getClimateZone(location.state)}</dd>
                <dt>Time Zone</dt>
                <dd>{getTimeZone(location.state)}</dd>
              </dl>
            </div>

            {/* Shade Information */}
            <div className={styles.detailCard}>
              <h3>Shade Information</h3>
              <dl className={styles.detailsList}>
                <dt>Best Shade Time</dt>
                <dd>Evening games (7:00 PM+)</dd>
                <dt>Most Sun Exposure</dt>
                <dd>Day games (12:00-3:00 PM)</dd>
                <dt>Covered Sections</dt>
                <dd>{roofType !== 'open' ? 'All sections (roof)' : 'Upper deck overhang'}</dd>
                <dt>Shade Direction</dt>
                <dd>{orientation < 90 || orientation > 270 ? 'Third base side' : 'First base side'}</dd>
              </dl>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Info Row - Weather & Shade */}
      {(weatherInfo || shadeInfo) && (
        <div className={styles.enhancedInfo}>
          {weatherInfo && (
            <div className={styles.weatherCard}>
              <span className={styles.weatherIcon}>
                {weatherInfo.icon || '☀️'}
              </span>
              <div className={styles.weatherDetails}>
                <span className={styles.temperature}>
                  {weatherInfo.temperature}°F
                </span>
                <span className={styles.condition}>
                  {weatherInfo.condition}
                </span>
              </div>
            </div>
          )}

          {shadeInfo?.percentage !== undefined && (
            <div className={styles.shadeCard}>
              <div className={styles.shadeIndicator}>
                <span className={styles.shadePercentage}>
                  {shadeInfo.percentage}%
                </span>
                <span className={styles.shadeLabel}>Shaded</span>
              </div>
              {shadeInfo.bestSections && shadeInfo.bestSections.length > 0 && (
                <span className={styles.shadeSections}>
                  Best: {shadeInfo.bestSections.slice(0, 3).join(', ')}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Quick Action Buttons */}
      {(onCalculateShade || onViewSections) && (
        <div className={styles.actionButtons}>
          {onCalculateShade && (
            <button
              className={styles.actionButton}
              onClick={onCalculateShade}
              aria-label="Calculate shade for this stadium"
            >
              <span className={styles.buttonIcon}>🌤️</span>
              <span className={styles.buttonText}>Calculate Shade</span>
            </button>
          )}
          {onViewSections && (
            <button
              className={`${styles.actionButton} ${styles.secondaryButton}`}
              onClick={onViewSections}
              aria-label="View all sections"
            >
              <span className={styles.buttonIcon}>🏟️</span>
              <span className={styles.buttonText}>View Sections</span>
            </button>
          )}
        </div>
      )}

      {/* Accessibility: Hidden text for screen readers */}
      <div className={styles.srOnly} aria-live="polite">
        {stadium.name} stadium information: Home of the {team.name} in {team.league}.
        Located in {location.city}, {location.state} with a capacity of {capacity.toLocaleString()} seats.
        The stadium has {getRoofTypeDisplay(roofType).toLowerCase()} and faces {orientation} degrees.
        {yearBuilt && ` Built in ${yearBuilt}.`}
      </div>
    </div>
  );
};

export default StadiumTitleBlock;