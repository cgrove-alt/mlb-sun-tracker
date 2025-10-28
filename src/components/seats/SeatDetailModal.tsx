'use client';

import React, { useEffect } from 'react';
import type { Seat } from '@/types/seat';
import { CloudIcon, SunIcon, FireIcon } from '../common/Icons';

interface SeatDetailModalProps {
  seat: Seat | null;
  sunExposure: number; // 0-100 percentage
  timeline?: Array<{ time: string; inSun: boolean }>; // Optional timeline data
  onClose: () => void;
}

/**
 * SeatDetailModal Component
 * Modal displaying detailed information about a specific seat
 */
export const SeatDetailModal: React.FC<SeatDetailModalProps> = ({
  seat,
  sunExposure,
  timeline,
  onClose,
}) => {
  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (seat) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [seat, onClose]);

  if (!seat) return null;

  // Get sun exposure icon and description
  const getSunInfo = (exposure: number) => {
    if (exposure === 0) {
      return {
        icon: <CloudIcon size={48} />,
        label: 'Full Shade',
        color: 'text-gray-700',
        bgColor: 'bg-gray-100',
      };
    }
    if (exposure < 30) {
      return {
        icon: <CloudIcon size={48} />,
        label: 'Mostly Shaded',
        color: 'text-green-700',
        bgColor: 'bg-green-100',
      };
    }
    if (exposure < 70) {
      return {
        icon: <SunIcon size={48} color="#f59e0b" />,
        label: 'Partial Sun',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-100',
      };
    }
    if (exposure < 90) {
      return {
        icon: <SunIcon size={48} color="#f97316" />,
        label: 'Mostly Sunny',
        color: 'text-orange-700',
        bgColor: 'bg-orange-100',
      };
    }
    return {
      icon: <FireIcon size={48} color="#dc2626" />,
      label: 'Full Sun',
      color: 'text-red-700',
      bgColor: 'bg-red-100',
    };
  };

  const sunInfo = getSunInfo(sunExposure);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="seat-detail-title"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
            <h2
              id="seat-detail-title"
              className="text-xl font-bold text-gray-900"
            >
              Seat Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Seat Information */}
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Section {seat.sectionId}</div>
              <div className="text-3xl font-bold text-gray-900">
                Row {seat.row}, Seat {seat.seatNumber}
              </div>
            </div>

            {/* Sun Exposure Summary */}
            <div className={`${sunInfo.bgColor} rounded-xl p-6 text-center`}>
              <div className="flex justify-center mb-3">{sunInfo.icon}</div>
              <div className={`text-2xl font-bold ${sunInfo.color} mb-2`}>
                {Math.round(sunExposure)}% Sun Exposure
              </div>
              <div className={`text-sm ${sunInfo.color}`}>{sunInfo.label}</div>
            </div>

            {/* Sun Exposure Bar */}
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Shade</span>
                <span>Sun</span>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-300"
                  style={{ width: `${sunExposure}%` }}
                />
              </div>
            </div>

            {/* Seat Properties */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Level
                </div>
                <div className="text-sm font-semibold text-gray-900 capitalize">
                  {seat.sectionId}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Covered
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {seat.covered ? 'Yes' : 'No'}
                </div>
              </div>
            </div>

            {/* Accessibility Info */}
            {(seat.accessibility.wheelchairAccessible ||
              seat.accessibility.elevatorAccess ||
              !seat.accessibility.requiresStairs) && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm font-semibold text-blue-900 mb-2">
                  Accessibility
                </div>
                <div className="space-y-1 text-sm text-blue-800">
                  {seat.accessibility.wheelchairAccessible && (
                    <div>♿ Wheelchair accessible</div>
                  )}
                  {seat.accessibility.elevatorAccess && (
                    <div>🛗 Elevator access</div>
                  )}
                  {!seat.accessibility.requiresStairs && (
                    <div>✓ No stairs required</div>
                  )}
                </div>
              </div>
            )}

            {/* Timeline Preview (if available) */}
            {timeline && timeline.length > 0 && (
              <div>
                <div className="text-sm font-semibold text-gray-700 mb-3">
                  Sun Exposure During Game
                </div>
                <div className="flex gap-1 h-12">
                  {timeline.map((point, idx) => (
                    <div
                      key={idx}
                      className="flex-1 relative group"
                      title={`${point.time}: ${point.inSun ? 'In Sun' : 'In Shade'}`}
                    >
                      <div
                        className={`h-full ${
                          point.inSun ? 'bg-orange-400' : 'bg-gray-300'
                        } transition-colors`}
                      />
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
                        <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                          {point.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Start</span>
                  <span>End</span>
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="bg-gradient-to-r from-accent-50 to-accent-100 rounded-lg p-4">
              <div className="text-sm font-semibold text-accent-900 mb-2">
                💡 Recommendation
              </div>
              <div className="text-sm text-accent-800">
                {sunExposure <= 30 && (
                  "Great choice for shade! This seat offers excellent protection from the sun."
                )}
                {sunExposure > 30 && sunExposure <= 70 && (
                  "This seat gets partial sun. Consider bringing sunglasses and sunscreen."
                )}
                {sunExposure > 70 && (
                  "High sun exposure. Bring sunscreen, hat, and plenty of water!"
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full bg-accent-600 hover:bg-accent-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeatDetailModal;
