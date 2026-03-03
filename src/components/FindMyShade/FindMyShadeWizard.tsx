'use client';

import React, { useState, useCallback } from 'react';
import { UserPreferences } from '../../services/seatRecommendationEngine';
import { StepGameTime } from './StepGameTime';
import { StepShadePreference } from './StepShadePreference';
import { StepBudget } from './StepBudget';
import { WizardResults } from './WizardResults';
import { StepperDots } from '../MobileStepper/MobileStepper';
import styles from './FindMyShade.module.css';

interface FindMyShadeWizardProps {
  stadiumId: string;
  onViewOnMap?: (sectionId: string) => void;
}

type ShadeChoice = 'need-shade' | 'neutral' | 'love-sun';
type BudgetChoice = 'budget' | 'moderate' | 'premium' | 'any';

const TOTAL_STEPS = 4;

export const FindMyShadeWizard: React.FC<FindMyShadeWizardProps> = ({
  stadiumId,
  onViewOnMap,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  // Step 1: game time
  const today = new Date().toISOString().split('T')[0];
  const [gameDate, setGameDate] = useState(today);
  const [gameTime, setGameTime] = useState('13:00');

  // Step 2: shade preference
  const [shadeChoice, setShadeChoice] = useState<ShadeChoice>('need-shade');

  // Step 3: budget
  const [budgetChoice, setBudgetChoice] = useState<BudgetChoice>('any');

  const preferences: UserPreferences = {
    sunPreference: shadeChoice,
    budgetRange: budgetChoice,
    groupSize: 2,
    accessibilityNeeds: false,
    viewPreference: 'any',
    amenityPriorities: ['shade', 'view'],
    weatherSensitivity: 'medium',
    hasChildren: false,
  };

  const handleNext = useCallback(() => {
    if (step < TOTAL_STEPS - 1) setStep(s => s + 1);
  }, [step]);

  const handleBack = useCallback(() => {
    if (step > 0) setStep(s => s - 1);
  }, [step]);

  const handleReset = useCallback(() => {
    setStep(0);
    setShadeChoice('need-shade');
    setBudgetChoice('any');
    setGameDate(today);
    setGameTime('13:00');
  }, [today]);

  return (
    <div className={styles.card}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="find-my-shade-wizard"
      >
        <span>Find My Shade</span>
        <span className={`${styles.triggerIcon} ${isOpen ? styles.triggerIconOpen : ''}`}>
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {isOpen && (
        <div id="find-my-shade-wizard" className={styles.body}>
          <StepperDots steps={TOTAL_STEPS} activeStep={step} />

          <div style={{ marginTop: '1rem' }}>
            {step === 0 && (
              <StepGameTime
                date={gameDate}
                time={gameTime}
                onDateChange={setGameDate}
                onTimeChange={setGameTime}
              />
            )}
            {step === 1 && (
              <StepShadePreference value={shadeChoice} onChange={setShadeChoice} />
            )}
            {step === 2 && (
              <StepBudget value={budgetChoice} onChange={setBudgetChoice} />
            )}
            {step === 3 && (
              <WizardResults
                stadiumId={stadiumId}
                preferences={preferences}
                gameDate={gameDate}
                gameTime={gameTime}
                onViewOnMap={onViewOnMap}
              />
            )}
          </div>

          <div className={styles.actions}>
            {step > 0 && step < TOTAL_STEPS - 1 ? (
              <button className={styles.btnSecondary} onClick={handleBack} type="button">
                Back
              </button>
            ) : step === TOTAL_STEPS - 1 ? (
              <button className={styles.btnSecondary} onClick={handleReset} type="button">
                Start Over
              </button>
            ) : (
              <span />
            )}
            {step < TOTAL_STEPS - 1 && (
              <button className={styles.btnPrimary} onClick={handleNext} type="button">
                {step === TOTAL_STEPS - 2 ? 'See Results' : 'Next'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FindMyShadeWizard;
