'use client';

import React from 'react';
import styles from './FindMyShade.module.css';

type ShadeChoice = 'need-shade' | 'neutral' | 'love-sun';

interface StepShadePreferenceProps {
  value: ShadeChoice;
  onChange: (v: ShadeChoice) => void;
}

const OPTIONS: { value: ShadeChoice; icon: string; label: string }[] = [
  { value: 'need-shade', icon: '🌳', label: 'Maximum Shade' },
  { value: 'neutral',    icon: '⛅', label: 'Some Shade' },
  { value: 'love-sun',   icon: '☀️', label: "Don't Care" },
];

export const StepShadePreference: React.FC<StepShadePreferenceProps> = ({ value, onChange }) => {
  return (
    <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
      <legend className={styles.stepTitle}>How much shade do you want?</legend>
      <div className={styles.optionGrid} role="radiogroup" aria-label="Shade preference">
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={value === opt.value}
            className={`${styles.optionBtn} ${value === opt.value ? styles.optionBtnSelected : ''}`}
            onClick={() => onChange(opt.value)}
          >
            <span className={styles.optionIcon}>{opt.icon}</span>
            {opt.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
};

export default StepShadePreference;
