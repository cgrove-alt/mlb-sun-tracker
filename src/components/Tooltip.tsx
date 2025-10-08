import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 300,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      adjustPosition();
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const adjustPosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let newPosition = position;

    // Check if tooltip fits in the preferred position
    switch (position) {
      case 'top':
        if (triggerRect.top - tooltipRect.height < 0) {
          newPosition = 'bottom';
        }
        break;
      case 'bottom':
        if (triggerRect.bottom + tooltipRect.height > viewportHeight) {
          newPosition = 'top';
        }
        break;
      case 'left':
        if (triggerRect.left - tooltipRect.width < 0) {
          newPosition = 'right';
        }
        break;
      case 'right':
        if (triggerRect.right + tooltipRect.width > viewportWidth) {
          newPosition = 'left';
        }
        break;
    }

    setActualPosition(newPosition);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      hideTooltip();
    }
  };

  const getTooltipPosition = () => {
    const baseClasses = 'absolute z-[1000] bg-ink-800 contrast-more:bg-black contrast-more:border contrast-more:border-white text-white py-2 px-3 rounded-md text-[0.85rem] md:text-xs md:py-1.5 md:px-2.5 leading-snug max-w-[250px] md:max-w-[200px] break-words shadow-lg pointer-events-none opacity-0 animate-tooltip-fade-in motion-reduce:opacity-100 motion-reduce:animate-none';

    switch (actualPosition) {
      case 'top':
        return `${baseClasses} bottom-full left-1/2 -translate-x-1/2 mb-2`;
      case 'bottom':
        return `${baseClasses} top-full left-1/2 -translate-x-1/2 mt-2`;
      case 'left':
        return `${baseClasses} right-full top-1/2 -translate-y-1/2 mr-2`;
      case 'right':
        return `${baseClasses} left-full top-1/2 -translate-y-1/2 ml-2`;
      default:
        return baseClasses;
    }
  };

  const getArrowClasses = () => {
    const baseClasses = 'absolute w-0 h-0 border-solid';

    switch (actualPosition) {
      case 'top':
        return `${baseClasses} top-full left-1/2 -translate-x-1/2 border-t-[6px] border-x-[6px] border-b-0 border-t-ink-800 contrast-more:border-t-black border-x-transparent`;
      case 'bottom':
        return `${baseClasses} bottom-full left-1/2 -translate-x-1/2 border-b-[6px] border-x-[6px] border-t-0 border-b-ink-800 contrast-more:border-b-black border-x-transparent`;
      case 'left':
        return `${baseClasses} left-full top-1/2 -translate-y-1/2 border-l-[6px] border-y-[6px] border-r-0 border-l-ink-800 contrast-more:border-l-black border-y-transparent`;
      case 'right':
        return `${baseClasses} right-full top-1/2 -translate-y-1/2 border-r-[6px] border-y-[6px] border-l-0 border-r-ink-800 contrast-more:border-r-black border-y-transparent`;
      default:
        return baseClasses;
    }
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      ref={triggerRef}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      onKeyDown={handleKeyDown}
      aria-describedby={isVisible ? 'tooltip' : undefined}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          id="tooltip"
          className={getTooltipPosition()}
          role="tooltip"
          aria-live="polite"
        >
          {content}
          <div className={getArrowClasses()} />
        </div>
      )}
    </div>
  );
};

// Higher-order component for common tooltip patterns
export const withTooltip = (
  Component: React.ComponentType<any>,
  tooltipContent: string,
  position: 'top' | 'bottom' | 'left' | 'right' = 'top'
) => {
  return (props: any) => (
    <Tooltip content={tooltipContent} position={position}>
      <Component {...props} />
    </Tooltip>
  );
};