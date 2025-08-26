'use client';

import React from 'react';
import styles from './MobileStepper.module.css';

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
        className={styles.bar}
        role="progressbar"
        aria-valuenow={activeStep + 1}
        aria-valuemin={1}
        aria-valuemax={steps}
        aria-label={`Step ${activeStep + 1} of ${steps}`}
      >
        {Array.from({ length: steps }).map((_, index) => (
          <div
            key={index}
            className={styles.dot}
            data-active={index <= activeStep}
            aria-hidden="true"
          />
        ))}
      </div>
      
      {!hideActions && (
        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles.prev}`}
            onClick={onPrev}
            disabled={disablePrev || activeStep === 0}
            type="button"
            aria-label={prevLabel}
          >
            {prevLabel}
          </button>
          
          <button
            className={`${styles.btn} ${styles.next}`}
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
      className={`${styles.bar} ${className}`}
      role="progressbar"
      aria-valuenow={activeStep + 1}
      aria-valuemin={1}
      aria-valuemax={steps}
      aria-label={`Step ${activeStep + 1} of ${steps}`}
    >
      {Array.from({ length: steps }).map((_, index) => (
        <div
          key={index}
          className={styles.dot}
          data-active={index <= activeStep}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}