'use client';

import React from 'react';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface DataFreshnessProps {
  lastUpdated?: string; // ISO 8601 timestamp
  stadiumName?: string;
  className?: string;
  showReportLink?: boolean;
  onReportClick?: () => void;
}

/**
 * DataFreshness Component
 * Displays when stadium data was last updated with visual indicators
 * Shows alert if data is more than 1 year old
 */
export function DataFreshness({
  lastUpdated,
  stadiumName,
  className = '',
  showReportLink = true,
  onReportClick,
}: DataFreshnessProps) {
  // If no timestamp, show warning
  if (!lastUpdated) {
    return (
      <div
        className={`flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm ${className}`}
        role="alert"
        aria-live="polite"
      >
        <AlertCircle className="h-4 w-4 flex-shrink-0 text-yellow-600" aria-hidden="true" />
        <div className="flex-1">
          <p className="font-medium text-yellow-800">Data update date unavailable</p>
          <p className="mt-1 text-yellow-700">
            This stadium&apos;s data may not include the latest information.
            {showReportLink && (
              <>
                {' '}
                <button
                  onClick={onReportClick}
                  className="font-medium underline hover:text-yellow-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1"
                  aria-label={`Report inaccuracy for ${stadiumName || 'this stadium'}`}
                >
                  Report an inaccuracy
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  const updatedDate = new Date(lastUpdated);
  const now = new Date();
  const daysSinceUpdate = Math.floor((now.getTime() - updatedDate.getTime()) / (1000 * 60 * 60 * 24));
  const yearsSinceUpdate = daysSinceUpdate / 365;

  // Format date for display
  const formattedDate = updatedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Determine freshness level
  const isStale = yearsSinceUpdate > 1;
  const isOld = yearsSinceUpdate > 2;

  // Get appropriate icon and styling
  let Icon = CheckCircle;
  let iconColor = 'text-green-600';
  let bgColor = 'bg-green-50';
  let borderColor = 'border-green-200';
  let textColor = 'text-green-800';
  let subtextColor = 'text-green-700';
  let freshnessLabel = 'Data is current';

  if (isOld) {
    Icon = AlertCircle;
    iconColor = 'text-red-600';
    bgColor = 'bg-red-50';
    borderColor = 'border-red-200';
    textColor = 'text-red-800';
    subtextColor = 'text-red-700';
    freshnessLabel = 'Data may be outdated';
  } else if (isStale) {
    Icon = Clock;
    iconColor = 'text-yellow-600';
    bgColor = 'bg-yellow-50';
    borderColor = 'border-yellow-200';
    textColor = 'text-yellow-800';
    subtextColor = 'text-yellow-700';
    freshnessLabel = 'Data needs review';
  }

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border ${borderColor} ${bgColor} p-3 text-sm ${className}`}
      role="status"
      aria-live="polite"
    >
      <Icon className={`h-4 w-4 flex-shrink-0 ${iconColor}`} aria-hidden="true" />
      <div className="flex-1">
        <p className={`font-medium ${textColor}`}>
          {freshnessLabel} &middot; Last updated: {formattedDate}
        </p>
        {(isStale || isOld) && showReportLink && (
          <p className={`mt-1 ${subtextColor}`}>
            {isOld
              ? 'This data is over 2 years old. Stadium layouts or seating may have changed.'
              : 'This data is over 1 year old and may need updating.'}{' '}
            <button
              onClick={onReportClick}
              className="font-medium underline hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-1"
              style={{ color: 'inherit' }}
              aria-label={`Report inaccuracy for ${stadiumName || 'this stadium'}`}
            >
              Report an inaccuracy
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default DataFreshness;
