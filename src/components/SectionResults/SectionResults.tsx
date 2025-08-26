import React from 'react';
import styles from './SectionResults.module.css';

export interface SectionResultsProps {
  title: string;
  timeLabel?: string;
  sections: string[];
  ctaText?: string;
  ctaHref?: string;
  className?: string;
}

export default function SectionResults({
  title,
  timeLabel,
  sections,
  ctaText,
  ctaHref,
  className = '',
}: SectionResultsProps) {
  return (
    <div className={`${styles.wrap} ${className}`.trim()}>
      <div className={styles.top}>
        <h3 className={styles.title}>{title}</h3>
        {timeLabel && <span className={styles.badge}>{timeLabel}</span>}
      </div>
      {sections.length > 0 && (
        <div className={styles.list}>
          {sections.map((section, index) => (
            <span key={index} className={styles.pill}>
              {section}
            </span>
          ))}
        </div>
      )}
      {ctaText && ctaHref && (
        <a className={styles.cta} href={ctaHref}>
          {ctaText} →
        </a>
      )}
    </div>
  );
}

export function SectionResultsSkeleton() {
  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <div
          style={{
            height: '24px',
            width: '180px',
            background: 'var(--ui-skeleton)',
            borderRadius: '4px',
          }}
        />
        <div
          style={{
            height: '28px',
            width: '100px',
            background: 'var(--ui-skeleton)',
            borderRadius: '16px',
          }}
        />
      </div>
      <div className={styles.list}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              height: '32px',
              background: 'var(--ui-skeleton)',
              borderRadius: '8px',
            }}
          />
        ))}
      </div>
    </div>
  );
}