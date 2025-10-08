import React from 'react';
import Link from 'next/link';

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
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider ml-2 bg-orange-100 text-orange-800">Dome</span>;
      case 'retractable':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider ml-2 bg-blue-100 text-blue-800">Retractable</span>;
      default:
        return null; // Open stadiums don't need a badge
    }
  };

  const formatCapacity = (num: number) => {
    return num.toLocaleString();
  };

  const location = state ? `${city}, ${state}` : city;

  const baseClasses = 'bg-paper border border-ui-border rounded-xl p-5 shadow-sm transition-all duration-200 relative flex flex-col hover:shadow-md hover:-translate-y-0.5 focus-within:outline focus-within:outline-2 focus-within:outline-accent-600 focus-within:outline-offset-2 sm:p-4';
  const featuredClasses = featured ? 'border-accent-600 border-2' : '';
  const compactClasses = compact ? '!p-4' : '';
  const loadingClasses = loading ? 'relative overflow-hidden after:content-[""] after:absolute after:inset-0 after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)] after:animate-[shimmer_2s_infinite]' : '';

  const cardClasses = [baseClasses, featuredClasses, compactClasses, loadingClasses, className]
    .filter(Boolean)
    .join(' ');

  const cardContent = (
    <>
      <h3 className={`text-ink-800 font-semibold text-lg leading-tight text-balance m-0 mb-1 ${featured ? 'text-accent-700' : ''} ${compact ? 'text-base' : ''}`}>
        {name}
        {getRoofBadge()}
      </h3>
      <p className={`text-ink-700 m-0 text-sm leading-normal ${compact ? 'text-[13px]' : ''}`}>
        {team} • {location}
      </p>
      <div className={`flex flex-wrap gap-3 mt-2.5 text-ink-900 text-sm pt-2.5 border-t border-ui-border ${compact ? 'text-[13px] pt-2 mt-2' : ''}`}>
        <span className="flex items-center gap-1">
          <span className="text-ink-700 font-normal">Roof:</span>
          <span className="text-ink-900 font-medium">{roof}</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="text-ink-700 font-normal">Capacity:</span>
          <span className="text-ink-900 font-medium">{formatCapacity(capacity)}</span>
        </span>
      </div>
      <Link href={href} className="cta-btn cta-btn-sm" onClick={onClick}>
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
    <div className="bg-paper border border-ui-border rounded-xl p-5 shadow-sm relative flex flex-col overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)] after:animate-[shimmer_2s_infinite] sm:p-4">
      <div className="h-6 bg-gray-100 rounded mb-2" />
      <div className="h-4 bg-gray-100 rounded mb-4 w-[70%]" />
      <div className="flex gap-3">
        <div className="h-3.5 bg-gray-100 rounded w-[60px]" />
        <div className="h-3.5 bg-gray-100 rounded w-[80px]" />
      </div>
      <div className="h-5 bg-gray-100 rounded mt-auto w-[120px]" />
    </div>
  );
};

export default StadiumCard;