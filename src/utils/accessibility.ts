// Accessibility Utilities for MLB Sun Tracker

/**
 * Announce message to screen readers
 */
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Trap focus within a container (useful for modals)
 */
export const trapFocus = (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll<HTMLElement>(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  };
  
  container.addEventListener('keydown', handleKeyDown);
  
  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
};

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Check if user prefers high contrast
 */
export const prefersHighContrast = (): boolean => {
  return window.matchMedia('(prefers-contrast: high)').matches;
};

/**
 * Get appropriate focus visible styles
 */
export const getFocusStyles = (color: string = 'primary') => {
  const colors: Record<string, string> = {
    primary: 'rgba(15, 62, 124, 0.5)',
    secondary: 'rgba(46, 125, 50, 0.5)',
    error: 'rgba(198, 40, 40, 0.5)',
    warning: 'rgba(245, 124, 0, 0.5)'
  };
  
  return {
    outline: 'none',
    boxShadow: `0 0 0 3px ${colors[color] || colors.primary}`,
    borderColor: 'var(--color-primary)'
  };
};

/**
 * Generate unique ID for form elements
 */
export const generateId = (prefix: string = 'element'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Format time for screen readers
 */
export const formatTimeForScreenReader = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  };
  
  return date.toLocaleDateString('en-US', options);
};

/**
 * Format percentage for screen readers
 */
export const formatPercentageForScreenReader = (percentage: number): string => {
  if (percentage === 0) return 'No sun exposure';
  if (percentage === 100) return 'Full sun exposure';
  if (percentage < 20) return `${percentage} percent sun exposure, mostly shaded`;
  if (percentage < 40) return `${percentage} percent sun exposure, partially shaded`;
  if (percentage < 60) return `${percentage} percent sun exposure, moderate sun`;
  if (percentage < 80) return `${percentage} percent sun exposure, mostly sunny`;
  return `${percentage} percent sun exposure, very sunny`;
};

/**
 * Keyboard navigation helper
 */
export class KeyboardNavigator {
  private elements: HTMLElement[];
  private currentIndex: number = 0;
  
  constructor(elements: NodeListOf<HTMLElement> | HTMLElement[]) {
    this.elements = Array.from(elements);
  }
  
  handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        this.focusNext();
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        this.focusPrevious();
        break;
      case 'Home':
        e.preventDefault();
        this.focusFirst();
        break;
      case 'End':
        e.preventDefault();
        this.focusLast();
        break;
    }
  };
  
  focusNext() {
    this.currentIndex = (this.currentIndex + 1) % this.elements.length;
    this.elements[this.currentIndex].focus();
  }
  
  focusPrevious() {
    this.currentIndex = (this.currentIndex - 1 + this.elements.length) % this.elements.length;
    this.elements[this.currentIndex].focus();
  }
  
  focusFirst() {
    this.currentIndex = 0;
    this.elements[0].focus();
  }
  
  focusLast() {
    this.currentIndex = this.elements.length - 1;
    this.elements[this.currentIndex].focus();
  }
  
  updateElements(elements: NodeListOf<HTMLElement> | HTMLElement[]) {
    this.elements = Array.from(elements);
  }
}

/**
 * Skip links manager
 */
export class SkipLinksManager {
  private skipLinks: Map<string, string> = new Map();
  
  addSkipLink(label: string, targetId: string) {
    this.skipLinks.set(label, targetId);
  }
  
  renderSkipLinks(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'skip-links';
    container.setAttribute('role', 'navigation');
    container.setAttribute('aria-label', 'Skip links');
    
    this.skipLinks.forEach((targetId, label) => {
      const link = document.createElement('a');
      link.href = `#${targetId}`;
      link.className = 'skip-link';
      link.textContent = label;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(targetId);
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
      container.appendChild(link);
    });
    
    return container;
  }
}

/**
 * ARIA live region manager
 */
export class LiveRegionManager {
  private liveRegion: HTMLElement;
  
  constructor(priority: 'polite' | 'assertive' = 'polite') {
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('role', 'status');
    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.className = 'sr-only';
    document.body.appendChild(this.liveRegion);
  }
  
  announce(message: string) {
    this.liveRegion.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      this.liveRegion.textContent = '';
    }, 1000);
  }
  
  destroy() {
    document.body.removeChild(this.liveRegion);
  }
}

/**
 * Focus management utilities
 */
export const focusManagement = {
  // Save current focus
  saveFocus(): HTMLElement | null {
    return document.activeElement as HTMLElement;
  },
  
  // Restore focus to element
  restoreFocus(element: HTMLElement | null) {
    if (element && typeof element.focus === 'function') {
      element.focus();
    }
  },
  
  // Focus first focusable element in container
  focusFirstElement(container: HTMLElement) {
    const focusable = container.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable) {
      focusable.focus();
    }
  },
  
  // Check if element is focusable
  isFocusable(element: HTMLElement): boolean {
    const focusableElements = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'];
    return focusableElements.includes(element.tagName) || 
           element.hasAttribute('tabindex') && 
           element.getAttribute('tabindex') !== '-1';
  }
};

/**
 * Color contrast checker
 */
export const checkColorContrast = (foreground: string, background: string): number => {
  // Convert hex to RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };
  
  // Calculate relative luminance
  const getLuminance = (color: { r: number; g: number; b: number }): number => {
    const { r, g, b } = color;
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);
  
  const l1 = getLuminance(fg);
  const l2 = getLuminance(bg);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check if contrast ratio meets WCAG standards
 */
export const meetsWCAGStandard = (
  ratio: number,
  level: 'AA' | 'AAA' = 'AA',
  largeText: boolean = false
): boolean => {
  if (level === 'AA') {
    return largeText ? ratio >= 3 : ratio >= 4.5;
  } else {
    return largeText ? ratio >= 4.5 : ratio >= 7;
  }
};