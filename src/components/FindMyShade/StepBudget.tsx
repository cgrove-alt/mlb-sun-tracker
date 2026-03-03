'use client';

import React from 'react';
import styles from './FindMyShade.module.css';

type BudgetChoice = 'budget' | 'moderate' | 'premium' | 'any';

interface StepBudgetProps {
  value: BudgetChoice;
  onChange: (v: BudgetChoice) => void;
}

const OPTIONS: { value: BudgetChoice; icon: string; label: string }[] = [
  { value: 'budget',   icon: '💵', label: 'Value' },
  { value: 'moderate', icon: '💳', label: 'Mid-Range' },
  { value: 'premium',  icon: '💎', label: 'Premium' },
  { value: 'any',      icon: '🎯', label: 'Any Budget' },
];

export const StepBudget: React.FC<StepBudgetProps> = ({ value, onChange }) => {
  return (
    <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
      <legend className={styles.stepTitle}>What's your budget?</legend>
      <div className={styles.optionGrid} role="radiogroup" aria-label="Budget preference">
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

export default StepBudget;
