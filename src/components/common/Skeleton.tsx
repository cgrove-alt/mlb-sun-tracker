'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'button';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Skeleton Component
 * Provides skeleton loading placeholders for better perceived performance
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}) => {
  const baseClasses = 'bg-gray-200';

  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded',
    circular: 'rounded-full',
    button: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1em' : '100%'),
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};

/**
 * SeatButtonSkeleton Component
 * Specialized skeleton for seat button loading states
 */
export const SeatButtonSkeleton: React.FC<{ showPercentage?: boolean }> = ({
  showPercentage = false
}) => (
  <div
    className="px-3 py-2 rounded border-2 border-gray-300 bg-gray-100 min-w-[3rem] flex flex-col items-center gap-0.5 animate-pulse"
    aria-hidden="true"
  >
    {/* Seat number skeleton */}
    <div className="w-6 h-4 bg-gray-300 rounded" />

    {/* Percentage skeleton */}
    {showPercentage && (
      <div className="w-8 h-3 bg-gray-300 rounded" />
    )}
  </div>
);

/**
 * SeatRowSkeleton Component
 * Skeleton for an entire row of seats
 */
export const SeatRowSkeleton: React.FC<{
  seatCount?: number;
  showPercentages?: boolean;
}> = ({
  seatCount = 12,
  showPercentages = false
}) => (
  <div className="row-container px-2">
    {/* Row label skeleton */}
    <div className="flex items-center gap-4 mb-2">
      <div className="w-16 h-5 bg-gray-300 rounded animate-pulse" />
      <div className="flex-1 h-px bg-gray-300" />
      <div className="w-12 h-4 bg-gray-300 rounded animate-pulse" />
    </div>

    {/* Seats skeleton */}
    <div className="flex flex-wrap gap-2 pb-4">
      {Array.from({ length: seatCount }).map((_, idx) => (
        <SeatButtonSkeleton key={idx} showPercentage={showPercentages} />
      ))}
    </div>
  </div>
);

/**
 * SectionCardSkeleton Component
 * Skeleton for section navigation cards
 */
export const SectionCardSkeleton: React.FC = () => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
    <div className="flex justify-between items-center mb-3">
      <div className="w-24 h-5 bg-gray-300 rounded" />
      <div className="w-16 h-5 bg-gray-300 rounded" />
    </div>
    <div className="flex gap-4 mb-3">
      <div className="w-20 h-4 bg-gray-300 rounded" />
      <div className="w-16 h-4 bg-gray-300 rounded" />
    </div>
    <div className="w-full h-8 bg-gray-300 rounded mb-3" />
    <div className="w-24 h-4 bg-gray-300 rounded" />
  </div>
);

export default Skeleton;
