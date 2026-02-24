import React from 'react';
import { SeatingSectionSun } from '../../utils/sunCalculations';
import {
  CloseIcon,
  CloudIcon,
  PartlyCloudyIcon,
  SunIcon,
  FireIcon,
  FieldLevelIcon,
  LowerLevelIcon,
  ClubLevelIcon,
  UpperLevelIcon,
  CrownIcon,
  ValuePriceIcon,
  ModeratePriceIcon,
  PremiumPriceIcon,
  LuxuryPriceIcon,
  UmbrellaIcon,
  TrophyIcon,
} from '../Icons';

interface ComparisonCardProps {
  section: SeatingSectionSun;
  onRemove: (sectionId: string) => void;
  isBestValue?: boolean;
  isBestShade?: boolean;
  isBestPrice?: boolean;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({
  section,
  onRemove,
  isBestValue = false,
  isBestShade = false,
  isBestPrice = false,
}) => {
  const roundedExposure = Math.round(section.sunExposure);

  const getSunExposureIcon = (exposure: number) => {
    if (exposure === 0) return <CloudIcon size={48} />;
    if (exposure < 25) return <PartlyCloudyIcon size={48} />;
    if (exposure < 50) return <SunIcon size={48} color="#f59e0b" />;
    if (exposure < 75) return <SunIcon size={48} color="#f97316" />;
    return <FireIcon size={48} color="#dc2626" />;
  };

  const getSunExposureColorClass = (exposure: number): string => {
    if (exposure === 0) return 'sun-exposure-none';
    if (exposure < 25) return 'sun-exposure-low';
    if (exposure < 50) return 'sun-exposure-medium';
    if (exposure < 75) return 'sun-exposure-high';
    return 'sun-exposure-very-high';
  };

  const getSunExposureLabel = (exposure: number): string => {
    if (exposure === 0) return 'Full Shade';
    if (exposure < 25) return 'Mostly Shade';
    if (exposure < 50) return 'Partial Sun';
    if (exposure < 75) return 'Mostly Sun';
    return 'Full Sun';
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'field':
        return <FieldLevelIcon size={20} />;
      case 'lower':
        return <LowerLevelIcon size={20} />;
      case 'club':
        return <ClubLevelIcon size={20} />;
      case 'upper':
        return <UpperLevelIcon size={20} />;
      case 'suite':
        return <CrownIcon size={20} />;
      default:
        return null;
    }
  };

  const getPriceIcon = (price?: 'value' | 'moderate' | 'premium' | 'luxury') => {
    if (!price) return null;
    switch (price) {
      case 'value':
        return <ValuePriceIcon size={20} color="#059669" />;
      case 'moderate':
        return <ModeratePriceIcon size={20} color="#3b82f6" />;
      case 'premium':
        return <PremiumPriceIcon size={20} color="#f59e0b" />;
      case 'luxury':
        return <LuxuryPriceIcon size={20} color="#dc2626" />;
    }
  };

  const getLevelLabel = (level: string): string => {
    const labels: Record<string, string> = {
      field: 'Field Level',
      lower: 'Lower Bowl',
      club: 'Club Level',
      upper: 'Upper Deck',
      suite: 'Suite',
    };
    return labels[level] || level;
  };

  const getPriceLabel = (price?: string): string => {
    if (!price) return 'N/A';
    const labels: Record<string, string> = {
      value: 'Value',
      moderate: 'Moderate',
      premium: 'Premium',
      luxury: 'Luxury',
    };
    return labels[price] || price;
  };

  return (
    <div className="comparison-card">
      {/* Remove button */}
      <button
        onClick={() => onRemove(section.section.id)}
        className="comparison-card-remove"
        aria-label={`Remove section ${section.section.name} from comparison`}
      >
        <CloseIcon size={20} />
      </button>

      {/* Winner badges */}
      {(isBestValue || isBestShade || isBestPrice) && (
        <div className="comparison-badges">
          {isBestValue && (
            <div className="comparison-badge badge-value" title="Best Overall Value">
              <TrophyIcon size={16} /> Best Value
            </div>
          )}
          {isBestShade && (
            <div className="comparison-badge badge-shade" title="Most Shade">
              <UmbrellaIcon size={16} /> Most Shade
            </div>
          )}
          {isBestPrice && (
            <div className="comparison-badge badge-price" title="Best Price">
              <ValuePriceIcon size={16} /> Best Price
            </div>
          )}
        </div>
      )}

      {/* Section name */}
      <div className="comparison-card-header">
        <h3 className="comparison-card-title">Section {section.section.name}</h3>
      </div>

      {/* Sun exposure - main metric */}
      <div className={`comparison-sun-exposure ${getSunExposureColorClass(roundedExposure)}`}>
        <div className="sun-exposure-icon">{getSunExposureIcon(roundedExposure)}</div>
        <div className="sun-exposure-percentage">{roundedExposure}%</div>
        <div className="sun-exposure-label">{getSunExposureLabel(roundedExposure)}</div>
      </div>

      {/* Details grid */}
      <div className="comparison-details">
        <div className="comparison-detail-row">
          <div className="comparison-detail-label">
            {getLevelIcon(section.section.level)}
            <span>Level</span>
          </div>
          <div className="comparison-detail-value">{getLevelLabel(section.section.level)}</div>
        </div>

        <div className="comparison-detail-row">
          <div className="comparison-detail-label">
            {getPriceIcon(section.section.price)}
            <span>Price</span>
          </div>
          <div className="comparison-detail-value">{getPriceLabel(section.section.price)}</div>
        </div>

        <div className="comparison-detail-row">
          <div className="comparison-detail-label">
            <UmbrellaIcon size={20} />
            <span>Coverage</span>
          </div>
          <div className="comparison-detail-value">
            {section.section.covered ? (
              <span className="text-green-600 font-medium">✓ Covered</span>
            ) : (
              <span className="text-gray-500">Uncovered</span>
            )}
          </div>
        </div>

        {section.timeInSun !== undefined && (
          <div className="comparison-detail-row">
            <div className="comparison-detail-label">
              <SunIcon size={20} />
              <span>Time in Sun</span>
            </div>
            <div className="comparison-detail-value">
              {section.timeInSun > 0 ? `~${Math.round(section.timeInSun)} min` : 'None'}
            </div>
          </div>
        )}
      </div>

      {/* Additional info */}
      <div className="comparison-additional-info">
        {section.section.partialCoverage && section.section.coveredRows && (
          <div className="comparison-info-item">
            <span className="info-icon">ℹ️</span>
            <span className="text-sm text-gray-600">
              Partial coverage: {section.section.coveredRows}
            </span>
          </div>
        )}
        {section.section.rows && (
          <div className="comparison-info-item">
            <span className="text-sm text-gray-600">{section.section.rows} rows total</span>
          </div>
        )}
      </div>
    </div>
  );
};
