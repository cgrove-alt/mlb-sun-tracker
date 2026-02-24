import React, { useMemo } from 'react';
import { getWorldCupVenueById } from '../data/worldcup2026/venues';
import { useTranslation } from '../i18n/i18nContext';

export interface WorldCupBadgeProps {
  stadiumId?: string;
  matchCount?: number;
  variant?: 'small' | 'medium' | 'large';
  showMatchCount?: boolean;
  country?: 'USA' | 'Mexico' | 'Canada';
}

export const WorldCupBadge: React.FC<WorldCupBadgeProps> = ({
  stadiumId,
  matchCount: providedMatchCount,
  variant = 'medium',
  showMatchCount = true,
  country: providedCountry
}) => {
  const { t } = useTranslation();
  const venueData = useMemo(() => {
    if (!stadiumId) return null;

    const wcVenueId = stadiumId.endsWith('-wc') ? stadiumId : `${stadiumId}-wc`;
    return getWorldCupVenueById(wcVenueId);
  }, [stadiumId]);

  if (!venueData) {
    return null;
  }

  const matchCount = providedMatchCount ?? venueData.hostMatches;
  const country = providedCountry ?? venueData.country;

  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base'
  };

  const countryColors = {
    USA: 'bg-blue-600 text-white',
    Mexico: 'bg-green-600 text-white',
    Canada: 'bg-red-600 text-white'
  };

  const bgColor = countryColors[country] || 'bg-purple-600 text-white';
  const sizeClass = sizeClasses[variant];

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${bgColor} ${sizeClass}`}>
      <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
      <span>{t('worldcup.badge.worldCupVenue')}</span>
      {showMatchCount && matchCount > 0 && (
        <span className="opacity-90">• {matchCount} {matchCount === 1 ? t('worldcup.badge.match') : t('worldcup.badge.matches')}</span>
      )}
    </div>
  );
};

export default WorldCupBadge;
