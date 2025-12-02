/**
 * SeatDetailModal Component
 *
 * Shows detailed information about a selected seat, including:
 * - Row and seat number
 * - Current sun exposure percentage
 * - 3D coordinates
 * - Shade/sun recommendations
 */

'use client';

import React from 'react';
import { SeatSunExposure } from '../hooks/useSeatLevelSunCalculations';

interface SeatDetailModalProps {
  seat: SeatSunExposure | null;
  sectionName: string;
  onClose: () => void;
  isOpen: boolean;
}

export function SeatDetailModal({
  seat,
  sectionName,
  onClose,
  isOpen,
}: SeatDetailModalProps) {
  if (!isOpen || !seat) return null;

  // Format exposure percentage
  const exposurePercent = seat.sunExposure.toFixed(1);

  // Determine status and recommendation
  const getStatusInfo = (exposure: number) => {
    if (exposure < 20) {
      return {
        status: 'Excellent for shade seekers',
        icon: '🌤️',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
      };
    } else if (exposure < 40) {
      return {
        status: 'Good shade coverage',
        icon: '⛅',
        color: 'text-blue-400',
        bgColor: 'bg-blue-400/10',
      };
    } else if (exposure < 60) {
      return {
        status: 'Partial sun exposure',
        icon: '🌥️',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
      };
    } else if (exposure < 80) {
      return {
        status: 'Mostly sunny',
        icon: '🌤️',
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
      };
    } else {
      return {
        status: 'Full sun exposure',
        icon: '☀️',
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
      };
    }
  };

  const statusInfo = getStatusInfo(seat.sunExposure);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl">
        <div className="bg-gray-900 rounded-lg shadow-2xl border border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {sectionName}
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                Row {seat.rowNumber}, Seat {seat.seatNumber}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Sun Exposure Status */}
            <div className={`${statusInfo.bgColor} rounded-lg p-4 mb-6`}>
              <div className="flex items-center gap-3">
                <div className="text-4xl">{statusInfo.icon}</div>
                <div>
                  <div className="text-sm text-gray-400">Current Sun Exposure</div>
                  <div className={`text-3xl font-bold ${statusInfo.color}`}>
                    {exposurePercent}%
                  </div>
                  <div className="text-sm mt-1 text-gray-300">
                    {statusInfo.status}
                  </div>
                </div>
              </div>
            </div>

            {/* Seat Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-400">Row</div>
                <div className="text-2xl font-bold text-white mt-1">
                  {seat.rowNumber}
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-400">Seat Number</div>
                <div className="text-2xl font-bold text-white mt-1">
                  {seat.seatNumber}
                </div>
              </div>
            </div>

            {/* 3D Position (for debugging) */}
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-400 mb-2">3D Coordinates</div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">X:</span>{' '}
                  <span className="text-white font-mono">
                    {seat.position.x.toFixed(1)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Y:</span>{' '}
                  <span className="text-white font-mono">
                    {seat.position.y.toFixed(1)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Z:</span>{' '}
                  <span className="text-white font-mono">
                    {seat.position.z.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-3">
                💡 Recommendations
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                {seat.isInShade ? (
                  <>
                    <li>✓ Great choice for staying cool</li>
                    <li>✓ Reduced glare during day games</li>
                    <li>✓ More comfortable in hot weather</li>
                  </>
                ) : (
                  <>
                    <li>⚠️ Consider bringing sunscreen</li>
                    <li>⚠️ Hat and sunglasses recommended</li>
                    <li>⚠️ May be warmer during afternoon games</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-800 px-6 py-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
