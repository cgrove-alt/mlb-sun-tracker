import React from 'react';
import Link from 'next/link';
import styles from './StadiumCard.module.css';

interface StadiumCardProps {
  /** Stadium name */
  name: string;
  /** Team name */
  team: string;
  /** City location */
  city: string;
  /** State (optional) */
  state?: string;
  /** Type of roof */
  roof: 'open' | 'closed' | 'retractable';
  /** Stadium capacity */
  capacity: number;
  /** Link destination */
  href: string;
  /** Whether this is a featured stadium */
  featured?: boolean;
  /** Compact variant for smaller spaces */
  compact?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Click handler (optional) */
  onClick?: () => void;
}

/**
 * StadiumCard Component
 * 
 * A clean, accessible card component for displaying stadium information.
 * Follows the design token system with proper contrast and hover states.
 * 
 * @example
 * ```tsx
 * <StadiumCard
 *   name="Yankee Stadium"
 *   team="New York Yankees"
 *   city="Bronx"
 *   state="NY"
 *   roof="open"
 *   capacity={54251}
 *   href="/stadium/yankees"
 * />
 * 
 * // Featured stadium
 * <StadiumCard
 *   name="Dodger Stadium"
 *   team="Los Angeles Dodgers"
 *   city="Los Angeles"
 *   state="CA"
 *   roof="open"
 *   capacity={56000}
 *   href="/stadium/dodgers"
 *   featured
 * />
 * 
 * // Compact variant
 * <StadiumCard
 *   name="Fenway Park"
 *   team="Boston Red Sox"
 *   city="Boston"
 *   state="MA"
 *   roof="open"
 *   capacity={37755}
 *   href="/stadium/red-sox"
 *   compact
 * />
 * ```
 */
export const StadiumCard: React.FC<StadiumCardProps> = ({
  name,
  team,
  city,
  state,
  roof,
  capacity,
  href,
  featured = false,
  compact = false,
  loading = false,
  className = '',
  onClick,
}) => {
  const getRoofBadge = () => {
    switch (roof) {
      case 'closed':
        return <span className={`${styles.badge} ${styles.badgeClosed}`}>Dome</span>;
      case 'retractable':
        return <span className={`${styles.badge} ${styles.badgeRetractable}`}>Retractable</span>;
      default:
        return null; // Open stadiums don't need a badge
    }
  };

  const formatCapacity = (num: number) => {
    return num.toLocaleString();
  };

  const location = state ? `${city}, ${state}` : city;

  const cardClasses = [
    styles.card,
    featured && styles.featured,
    compact && styles.compact,
    loading && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const cardContent = (
    <>
      <h3 className={styles.title}>
        {name}
        {getRoofBadge()}
      </h3>
      <p className={styles.meta}>
        {team} • {location}
      </p>
      <div className={styles.metrics}>
        <span className={styles.metric}>
          <span className={styles.metricLabel}>Roof:</span>
          <span className={styles.metricValue}>{roof}</span>
        </span>
        <span className={styles.metric}>
          <span className={styles.metricLabel}>Capacity:</span>
          <span className={styles.metricValue}>{formatCapacity(capacity)}</span>
        </span>
      </div>
      <Link href={href} className={styles.cta} onClick={onClick}>
        View Shade Guide →
      </Link>
    </>
  );

  return (
    <article className={cardClasses} aria-label={`Stadium card for ${name}`}>
      {cardContent}
    </article>
  );
};

/**
 * StadiumCardGrid Component
 * 
 * Helper component for creating responsive grids of stadium cards
 * 
 * @example
 * ```tsx
 * <StadiumCardGrid>
 *   {stadiums.map(stadium => (
 *     <StadiumCard key={stadium.id} {...stadium} />
 *   ))}
 * </StadiumCardGrid>
 * ```
 */
export const StadiumCardGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px',
      }}
    >
      {children}
    </div>
  );
};

/**
 * StadiumCardSkeleton Component
 * 
 * Loading skeleton for StadiumCard
 */
export const StadiumCardSkeleton: React.FC = () => {
  return (
    <div className={`${styles.card} ${styles.loading}`}>
      <div style={{ height: '24px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '8px' }} />
      <div style={{ height: '16px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '16px', width: '70%' }} />
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ height: '14px', background: '#f0f0f0', borderRadius: '4px', width: '60px' }} />
        <div style={{ height: '14px', background: '#f0f0f0', borderRadius: '4px', width: '80px' }} />
      </div>
      <div style={{ height: '20px', background: '#f0f0f0', borderRadius: '4px', marginTop: 'auto', width: '120px' }} />
    </div>
  );
};

export default StadiumCard;