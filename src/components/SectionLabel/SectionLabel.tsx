import React from 'react';
import styles from './SectionLabel.module.css';

interface SectionLabelProps {
  /** The text content of the label */
  children: React.ReactNode;
  /** Visual variant of the label */
  variant?: 'default' | 'solid' | 'light';
  /** Size variant */
  size?: 'small' | 'default' | 'large';
  /** Optional status styling */
  status?: 'shaded' | 'sunny' | 'partial';
  /** Optional icon to display */
  icon?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: () => void;
  /** Make the label focusable */
  tabIndex?: number;
  /** ARIA label for accessibility */
  ariaLabel?: string;
}

/**
 * SectionLabel Component
 * 
 * A highly readable label component designed to work on any background:
 * - Photography/imagery (default variant with translucent background)
 * - Solid dark backgrounds (solid variant)
 * - Light backgrounds (light variant)
 * 
 * @example
 * ```tsx
 * // Default usage on photo/map backgrounds
 * <SectionLabel>Section 112</SectionLabel>
 * 
 * // On solid dark background
 * <SectionLabel variant="solid">Field Box 23</SectionLabel>
 * 
 * // With shade status
 * <SectionLabel status="shaded">Upper Deck 301</SectionLabel>
 * 
 * // With icon
 * <SectionLabel icon={<SunIcon />}>Sunny Section</SectionLabel>
 * 
 * // Small size
 * <SectionLabel size="small">Row AA</SectionLabel>
 * ```
 */
export const SectionLabel: React.FC<SectionLabelProps> = ({
  children,
  variant = 'default',
  size = 'default',
  status,
  icon,
  className = '',
  onClick,
  tabIndex,
  ariaLabel,
}) => {
  const classNames = [
    styles.label,
    variant === 'solid' && styles.labelSolid,
    variant === 'light' && styles.labelLight,
    size === 'small' && styles.small,
    size === 'large' && styles.large,
    status === 'shaded' && styles.shaded,
    status === 'sunny' && styles.sunny,
    status === 'partial' && styles.partial,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const isInteractive = onClick || tabIndex !== undefined;

  return (
    <span
      className={classNames}
      onClick={onClick}
      tabIndex={isInteractive ? tabIndex ?? 0 : undefined}
      role={isInteractive ? 'button' : undefined}
      aria-label={ariaLabel}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </span>
  );
};

/**
 * SVG Text Label Component
 * 
 * For use inside SVG elements where HTML elements can't be used.
 * Applies stroke for maximum legibility.
 * 
 * @example
 * ```tsx
 * <svg>
 *   <SvgSectionLabel x={100} y={50}>Section 112</SvgSectionLabel>
 * </svg>
 * ```
 */
export const SvgSectionLabel: React.FC<{
  children: React.ReactNode;
  x: number | string;
  y: number | string;
  className?: string;
}> = ({ children, x, y, className = '' }) => {
  return (
    <text
      x={x}
      y={y}
      className={`${styles.svgText} ${className}`}
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {children}
    </text>
  );
};

export default SectionLabel;