/**
 * ClimateMessaging Component
 *
 * Displays region-specific climate warnings and shade recommendations
 * for World Cup 2026 venues across USA, Mexico, and Canada.
 */

import React from 'react';

interface ClimateInfo {
  country: 'USA' | 'Mexico' | 'Canada';
  message: string;
  icon: string;
  severity: 'high' | 'medium' | 'low';
  tips: string[];
}

const CLIMATE_DATA: Record<'USA' | 'Mexico' | 'Canada', ClimateInfo> = {
  USA: {
    country: 'USA',
    message: 'Summer heat - shade critical for comfort',
    icon: '☀️',
    severity: 'high',
    tips: [
      'June-July temperatures often exceed 85°F (29°C)',
      'Shaded seats provide 10-15°F cooler experience',
      'Afternoon matches (3-5pm) have highest sun exposure',
      'Stay hydrated and consider sun protection'
    ]
  },
  Mexico: {
    country: 'Mexico',
    message: 'High altitude - intense sun exposure',
    icon: '🌡️',
    severity: 'high',
    tips: [
      'High altitude increases UV exposure by 8-10%',
      'Shade is essential for comfort at 7,000+ feet elevation',
      'Drink extra water due to altitude and heat',
      'Sun protection critical even in covered areas'
    ]
  },
  Canada: {
    country: 'Canada',
    message: 'Mild climate - less sun concern, but still check',
    icon: '🌤️',
    severity: 'low',
    tips: [
      'June-July temperatures typically 65-75°F (18-24°C)',
      'Shade still improves comfort during sunny days',
      'Evening matches may be cooler, bring layers',
      'UV exposure still significant in summer months'
    ]
  }
};

interface ClimateMessagingProps {
  country: 'USA' | 'Mexico' | 'Canada';
  variant?: 'compact' | 'detailed';
  className?: string;
}

export function ClimateMessaging({
  country,
  variant = 'compact',
  className = ''
}: ClimateMessagingProps) {
  const climate = CLIMATE_DATA[country];

  const severityColors = {
    high: 'bg-red-50 border-red-200 text-red-900',
    medium: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    low: 'bg-blue-50 border-blue-200 text-blue-900'
  };

  const severityIconColors = {
    high: 'text-red-600',
    medium: 'text-yellow-600',
    low: 'text-blue-600'
  };

  if (variant === 'compact') {
    return (
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${severityColors[climate.severity]} ${className}`}
        role="alert"
        aria-label={`Climate information for ${country}`}
      >
        <span className={`text-xl ${severityIconColors[climate.severity]}`} aria-hidden="true">
          {climate.icon}
        </span>
        <span className="text-sm font-medium">
          {climate.message}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border ${severityColors[climate.severity]} p-6 ${className}`}
      role="alert"
      aria-label={`Climate information for ${country}`}
    >
      <div className="flex items-start gap-3 mb-4">
        <span className={`text-3xl ${severityIconColors[climate.severity]}`} aria-hidden="true">
          {climate.icon}
        </span>
        <div>
          <h3 className="text-lg font-bold mb-1">
            {country} Climate Guide
          </h3>
          <p className="text-base font-medium">
            {climate.message}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide opacity-75">
          What to Know:
        </p>
        <ul className="space-y-2">
          {climate.tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="text-base mt-0.5" aria-hidden="true">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * CountryClimateGrid Component
 *
 * Displays climate information for all three host countries in a responsive grid
 */
interface CountryClimateGridProps {
  className?: string;
}

export function CountryClimateGrid({ className = '' }: CountryClimateGridProps) {
  return (
    <div className={`grid md:grid-cols-3 gap-6 ${className}`}>
      <ClimateMessaging country="USA" variant="detailed" />
      <ClimateMessaging country="Mexico" variant="detailed" />
      <ClimateMessaging country="Canada" variant="detailed" />
    </div>
  );
}

/**
 * Get climate severity badge color for UI indicators
 */
export function getClimateSeverityColor(country: 'USA' | 'Mexico' | 'Canada'): string {
  const climate = CLIMATE_DATA[country];
  const colors = {
    high: 'red',
    medium: 'yellow',
    low: 'blue'
  };
  return colors[climate.severity];
}

/**
 * Get climate message for a specific country (for use in other components)
 */
export function getClimateMessage(country: 'USA' | 'Mexico' | 'Canada'): string {
  return CLIMATE_DATA[country].message;
}
