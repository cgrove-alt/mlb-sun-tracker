'use client';

import React from 'react';

export interface MobileStepperProps {
  steps: number;
  activeStep: number;
  onNext?: () => void;
  onPrev?: () => void;
  nextLabel?: string;
  prevLabel?: string;
  disableNext?: boolean;
  disablePrev?: boolean;
  hideActions?: boolean;
  className?: string;
}

export default function MobileStepper({
  steps,
  activeStep,
  onNext,
  onPrev,
  nextLabel = 'Next',
  prevLabel = 'Back',
  disableNext = false,
  disablePrev = false,
  hideActions = false,
  className = ''
}: MobileStepperProps) {
  return (
    <div className={className}>
      <div
        className="flex gap-2 p-2 px-4 border-b border-gray-200"
        role="progressbar"
        aria-valuenow={activeStep + 1}
        aria-valuemin={1}
        aria-valuemax={steps}
        aria-label={`Step ${activeStep + 1} of ${steps}`}
      >
        {Array.from({ length: steps }).map((_, index) => (
          <div
            key={index}
            className={`flex-1 h-1 rounded-full ${index <= activeStep ? 'bg-primary-700' : 'bg-gray-100'}`}
            data-active={index <= activeStep}
            aria-hidden="true"
          />
        ))}
      </div>

      {!hideActions && (
        <div className="flex gap-3 p-3 px-4">
          <button
            className="flex-1 text-center px-3 py-3 rounded-xl font-semibold bg-gray-50 border border-gray-200 text-ink-800"
            onClick={onPrev}
            disabled={disablePrev || activeStep === 0}
            type="button"
            aria-label={prevLabel}
          >
            {prevLabel}
          </button>

          <button
            className="flex-1 text-center px-3 py-3 rounded-xl font-semibold bg-ink-800 text-white"
            onClick={onNext}
            disabled={disableNext || activeStep === steps - 1}
            type="button"
            aria-label={nextLabel}
          >
            {nextLabel}
          </button>
        </div>
      )}
    </div>
  );
}

// Variant for displaying only the progress dots
export function StepperDots({
  steps,
  activeStep,
  className = ''
}: {
  steps: number;
  activeStep: number;
  className?: string;
}) {
  return (
    <div
      className={`flex gap-2 p-2 px-4 border-b border-gray-200 ${className}`}
      role="progressbar"
      aria-valuenow={activeStep + 1}
      aria-valuemin={1}
      aria-valuemax={steps}
      aria-label={`Step ${activeStep + 1} of ${steps}`}
    >
      {Array.from({ length: steps }).map((_, index) => (
        <div
          key={index}
          className={`flex-1 h-1 rounded-full ${index <= activeStep ? 'bg-primary-700' : 'bg-gray-100'}`}
          data-active={index <= activeStep}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}