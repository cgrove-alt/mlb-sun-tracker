'use client';

import React from 'react';
import styles from './FindMyShade.module.css';

interface StepGameTimeProps {
  date: string;
  time: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

const TIME_OPTIONS = [
  '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30',
];

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${display}:${m.toString().padStart(2, '0')} ${period}`;
}

export const StepGameTime: React.FC<StepGameTimeProps> = ({
  date, time, onDateChange, onTimeChange
}) => {
  return (
    <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
      <legend className={styles.stepTitle}>When is the game?</legend>
      <div className={styles.dateTimeRow}>
        <input
          type="date"
          value={date}
          onChange={e => onDateChange(e.target.value)}
          aria-label="Game date"
        />
        <select
          value={time}
          onChange={e => onTimeChange(e.target.value)}
          aria-label="Game time"
        >
          {TIME_OPTIONS.map(t => (
            <option key={t} value={t}>{formatTime(t)}</option>
          ))}
        </select>
      </div>
    </fieldset>
  );
};

export default StepGameTime;
