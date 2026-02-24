import React from 'react';
import { SunIcon, CloudIcon, PartlyCloudyIcon } from '../Icons';

interface InningData {
  inning: number;
  label: string;
  shadePercentage: number;
  isShaded: boolean;
}

interface ShadeTimelineProps {
  /** Shade percentages for each inning (9 innings) */
  inningShadeData?: InningData[];
  /** Overall shade percentage for the row */
  overallShade: number;
  /** Compact mode for mobile */
  compact?: boolean;
}

/**
 * ShadeTimeline - Visualizes shade coverage across game innings
 * Shows inning-by-inning breakdown to help fans understand when they'll be in sun/shade
 */
export const ShadeTimeline: React.FC<ShadeTimelineProps> = ({
  inningShadeData,
  overallShade,
  compact = false,
}) => {
  // Generate default inning data if not provided
  const defaultInnings: InningData[] = React.useMemo(() => {
    // Simple interpolation: assume shade increases linearly throughout game
    // This is a fallback when we don't have detailed inning data
    const innings: InningData[] = [];
    for (let i = 1; i <= 9; i++) {
      const progress = (i - 1) / 8; // 0 to 1
      const shadePercentage = overallShade * (0.5 + progress * 0.5); // Starts at 50% of final, grows to 100%
      innings.push({
        inning: i,
        label: i <= 9 ? `${i}` : `${i - 9}`,
        shadePercentage: Math.round(shadePercentage),
        isShaded: shadePercentage >= 50,
      });
    }
    return innings;
  }, [overallShade]);

  const innings = inningShadeData || defaultInnings;

  const getInningIcon = (shade: number) => {
    if (shade >= 75) return <CloudIcon size={compact ? 16 : 20} color="#6b7280" />;
    if (shade >= 40) return <PartlyCloudyIcon size={compact ? 16 : 20} color="#f59e0b" />;
    return <SunIcon size={compact ? 16 : 20} color="#f97316" />;
  };

  const getInningColorClass = (shade: number) => {
    if (shade >= 75) return 'bg-gray-200 border-gray-400';
    if (shade >= 40) return 'bg-amber-100 border-amber-400';
    return 'bg-orange-100 border-orange-400';
  };

  const getOptimalArrivalRecommendation = () => {
    // Find when shade coverage crosses 60% threshold
    for (let i = 0; i < innings.length; i++) {
      if (innings[i].shadePercentage >= 60) {
        if (i === 0) return 'Shaded from first pitch';
        if (i <= 2) return `Mostly shaded by inning ${i + 1}`;
        if (i <= 5) return `Best to arrive by inning ${i + 1} for shade`;
        return 'Limited shade throughout game';
      }
    }
    return 'Full sun exposure during game';
  };

  if (compact) {
    return (
      <div className="space-y-2">
        {/* Compact timeline bar */}
        <div className="flex items-center gap-1">
          {innings.map((inning) => (
            <div
              key={inning.inning}
              className={`flex-1 h-8 rounded flex items-center justify-center border-2 transition-all ${getInningColorClass(
                inning.shadePercentage
              )}`}
              title={`Inning ${inning.inning}: ${inning.shadePercentage}% shade`}
            >
              <span className="text-xs font-medium text-gray-700">{inning.label}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 italic">{getOptimalArrivalRecommendation()}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-semibold text-gray-900">Shade Throughout Game</h5>
        <div className="text-xs text-gray-600">
          <span className="font-medium">{overallShade}%</span> average shade
        </div>
      </div>

      {/* Timeline grid */}
      <div className="grid grid-cols-9 gap-2">
        {innings.map((inning) => (
          <div
            key={inning.inning}
            className={`relative p-2 rounded-lg border-2 transition-all hover:shadow-md ${getInningColorClass(
              inning.shadePercentage
            )}`}
            role="img"
            aria-label={`Inning ${inning.inning}: ${inning.shadePercentage}% shade coverage`}
          >
            {/* Inning number */}
            <div className="text-xs font-bold text-center text-gray-700 mb-1">
              {inning.label}
            </div>
            {/* Icon */}
            <div className="flex justify-center mb-1">{getInningIcon(inning.shadePercentage)}</div>
            {/* Percentage */}
            <div className="text-xs font-medium text-center text-gray-800">
              {inning.shadePercentage}%
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation */}
      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <div className="mt-0.5">
            <SunIcon size={18} color="#3b82f6" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">Optimal Timing</p>
            <p className="text-xs text-blue-800 mt-1">{getOptimalArrivalRecommendation()}</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-600 pt-2 border-t border-gray-200">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-gray-200 border-2 border-gray-400" />
          <span>75%+ Shade</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-amber-100 border-2 border-amber-400" />
          <span>40-74% Shade</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded bg-orange-100 border-2 border-orange-400" />
          <span>&lt;40% Shade</span>
        </div>
      </div>
    </div>
  );
};
