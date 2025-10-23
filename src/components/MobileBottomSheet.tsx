'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { trackEvent } from '../utils/analytics';

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  snapPoints?: number[]; // Percentage heights for collapsed, half, full states [25, 50, 90]
  initialSnapPoint?: number; // Index of initial snap point
  className?: string;
}

type SheetState = 'collapsed' | 'half' | 'full' | 'closed';

export function MobileBottomSheet({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = [25, 50, 90],
  initialSnapPoint = 1,
  className = '',
}: MobileBottomSheetProps) {
  const [sheetState, setSheetState] = useState<SheetState>('closed');
  const [translateY, setTranslateY] = useState(100); // Percentage
  const [isDragging, setIsDragging] = useState(false);

  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const currentTranslateY = useRef(100);

  // Initialize sheet state when opened
  useEffect(() => {
    if (isOpen && sheetState === 'closed') {
      const initialHeight = 100 - snapPoints[initialSnapPoint];
      setTranslateY(initialHeight);
      setSheetState(getStateFromHeight(100 - initialHeight));
      trackEvent('mobile_bottom_sheet_open', 'engagement', title || 'unknown');
    } else if (!isOpen && sheetState !== 'closed') {
      setTranslateY(100);
      setSheetState('closed');
    }
  }, [isOpen, sheetState, snapPoints, initialSnapPoint, title]);

  // Map height to state
  function getStateFromHeight(height: number): SheetState {
    const threshold = 5; // Percentage threshold for snapping
    if (height <= snapPoints[0] + threshold) return 'collapsed';
    if (height <= snapPoints[1] + threshold) return 'half';
    if (height <= snapPoints[2] + threshold) return 'full';
    return 'closed';
  }

  // Snap to nearest snap point
  function snapToNearestPoint(currentHeight: number) {
    // Find nearest snap point
    let nearestPoint = snapPoints[0];
    let minDiff = Math.abs(currentHeight - snapPoints[0]);

    for (const point of snapPoints) {
      const diff = Math.abs(currentHeight - point);
      if (diff < minDiff) {
        minDiff = diff;
        nearestPoint = point;
      }
    }

    // If dragging down past threshold, close
    if (currentHeight < 15) {
      onClose();
      return;
    }

    const finalTranslateY = 100 - nearestPoint;
    setTranslateY(finalTranslateY);
    setSheetState(getStateFromHeight(nearestPoint));
    currentTranslateY.current = finalTranslateY;
  }

  // Touch start handler
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    dragStartY.current = e.touches[0].clientY;
    currentTranslateY.current = translateY;
  };

  // Touch move handler
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - dragStartY.current;
    const windowHeight = window.innerHeight;
    const deltaPercentage = (deltaY / windowHeight) * 100;

    const newTranslateY = Math.max(
      100 - snapPoints[2], // Don't go above fully open
      Math.min(100, currentTranslateY.current + deltaPercentage) // Don't go below fully closed
    );

    setTranslateY(newTranslateY);
  };

  // Touch end handler
  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const currentHeight = 100 - translateY;
    snapToNearestPoint(currentHeight);
  };

  // Mouse handlers for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartY.current = e.clientY;
    currentTranslateY.current = translateY;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const currentY = e.clientY;
    const deltaY = currentY - dragStartY.current;
    const windowHeight = window.innerHeight;
    const deltaPercentage = (deltaY / windowHeight) * 100;

    const newTranslateY = Math.max(
      100 - snapPoints[2],
      Math.min(100, currentTranslateY.current + deltaPercentage)
    );

    setTranslateY(newTranslateY);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const currentHeight = 100 - translateY;
    snapToNearestPoint(currentHeight);
  };

  // Mouse event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  // Keyboard handler (ESC to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen && sheetState === 'closed') {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity z-40 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={`fixed left-0 right-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 transition-transform ${
          isDragging ? '' : 'duration-300 ease-out'
        } ${className}`}
        style={{
          transform: `translateY(${translateY}%)`,
          maxHeight: '90vh',
        }}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Bottom sheet'}
      >
        {/* Drag Handle */}
        <div
          className="flex items-center justify-center py-4 cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="px-6 pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <svg
                  className="w-6 h-6 text-gray-500"
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
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 100px)' }}>
          {children}
        </div>
      </div>
    </>
  );
}
