import React from 'react';
import { SHADE_COLORS } from './shadeColors';
import styles from './ShadeColorScale.module.css';

interface ShadeColorScaleProps {
  className?: string;
}

export const ShadeColorScale: React.FC<ShadeColorScaleProps> = ({ className = '' }) => {
  return (
    <div className={`${styles.container} ${className}`} role="img" aria-label="Shade coverage color scale legend">
      <h3 className={styles.title}>Shade Coverage</h3>
      <div className={styles.scale}>
        {SHADE_COLORS.map((color, index) => (
          <div key={index} className={styles.colorItem}>
            <div
              className={styles.colorBox}
              style={{ backgroundColor: color.fill }}
              aria-hidden="true"
            />
            <div className={styles.labelContainer}>
              <span className={styles.label}>{color.label}</span>
              <span className={styles.range}>
                {color.range.min}% - {color.range.max === 100 ? '100%' : `${color.range.max}%`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
