import React from 'react';

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
  const getVariantClasses = () => {
    if (variant === 'solid') {
      return 'bg-[#0F172A] text-gray-200';
    }
    if (variant === 'light') {
      return 'bg-white/90 text-ink-800 [text-shadow:none] [-webkit-text-stroke:0]';
    }
    // default
    return 'bg-black/55 text-white backdrop-blur-sm backdrop-saturate-115 [-webkit-backdrop-filter:saturate(115%)_blur(2px)] [-webkit-text-stroke:0.35px_rgba(0,0,0,0.65)] [text-shadow:0_0.5px_0_rgba(0,0,0,0.6),0_1px_1px_rgba(0,0,0,0.35)]';
  };

  const getSizeClasses = () => {
    if (size === 'small') return 'py-px px-1.5 text-[11px] rounded-md';
    if (size === 'large') return 'py-1 px-3 text-[15px] rounded-[10px]';
    return 'py-0.5 px-2 text-xs rounded-lg';
  };

  const getStatusClasses = () => {
    if (status === 'shaded') return '!bg-[rgba(34,139,34,0.7)] !text-white';
    if (status === 'sunny') return '!bg-[rgba(255,165,0,0.7)] !text-white';
    if (status === 'partial') return '!bg-[rgba(70,130,180,0.7)] !text-white';
    return '';
  };

  const isInteractive = onClick || tabIndex !== undefined;

  const baseClasses = 'inline-flex items-center font-semibold leading-tight antialiased select-none transition-all duration-200 hover:-translate-y-px hover:shadow-[0_2px_8px_rgba(0,0,0,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-700 focus-visible:outline-offset-2 contrast-more:!bg-black contrast-more:!text-white contrast-more:border-2 contrast-more:border-white contrast-more:[text-shadow:none] contrast-more:[-webkit-text-stroke:0] print:!bg-white print:!text-black print:border print:border-black print:[text-shadow:none] print:[-webkit-text-stroke:0] motion-reduce:transition-none';

  return (
    <span
      className={`${baseClasses} ${getVariantClasses()} ${getSizeClasses()} ${getStatusClasses()} ${className}`}
      onClick={onClick}
      tabIndex={isInteractive ? tabIndex ?? 0 : undefined}
      role={isInteractive ? 'button' : undefined}
      aria-label={ariaLabel}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      {icon && <span className="inline-flex w-3.5 h-3.5 flex-shrink-0">{icon}</span>}
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
      className={`fill-white stroke-black/65 [stroke-width:0.8] [paint-order:stroke] font-semibold text-xs ${className}`}
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {children}
    </text>
  );
};

export default SectionLabel;