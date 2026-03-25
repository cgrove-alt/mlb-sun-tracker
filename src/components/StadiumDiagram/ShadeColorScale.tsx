import React from 'react';
import { SHADE_SCORE_BANDS } from '../../utils/shadeScore';
import styles from './ShadeColorScale.module.css';

interface ShadeColorScaleProps {
  className?: string;
}

export const ShadeColorScale: React.FC<ShadeColorScaleProps> = ({ className = '' }) => {
  return (
    <div className={`${styles.container} ${className}`} role="img" aria-label="Shade Score color scale legend">
      <h3 className={styles.title}>Shade Score</h3>
      <div className={styles.scale}>
        {SHADE_SCORE_BANDS.map((band) => (
          <div key={band.score} className={styles.colorItem}>
            <div
              className={styles.colorBox}
              style={{ backgroundColor: band.color, color: band.textColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem' }}
            >
              {band.score}
            </div>
            <div className={styles.labelContainer}>
              <span className={styles.label}>{band.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
