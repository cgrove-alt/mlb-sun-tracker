import React, { useCallback, useRef, useEffect } from 'react';

/**
 * Enhanced haptic feedback hook with multiple patterns and iOS support
 */
export const useHapticFeedback = () => {
  const isEnabledRef = useRef(true);
  const lastTriggerRef = useRef(0);

  // Check for iOS specific haptic API
  const hasIOSHaptics = useCallback(() => {
    return 'ontouchstart' in window && 
           /iPhone|iPad|iPod/.test(navigator.userAgent) &&
           'vibrate' in navigator;
  }, []);

  // Check user preferences
  useEffect(() => {
    // Check if user has disabled haptics in settings
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    isEnabledRef.current = !mediaQuery.matches;

    const handleChange = (e: MediaQueryListEvent) => {
      isEnabledRef.current = !e.matches;
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const triggerHaptic = useCallback((pattern: number | number[]) => {
    // Check if haptics are enabled and not triggered too frequently
    const now = Date.now();
    if (!isEnabledRef.current || now - lastTriggerRef.current < 50) {
      return;
    }
    lastTriggerRef.current = now;

    if ('vibrate' in navigator && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (error) {
        console.debug('Haptic feedback error:', error);
      }
    }
  }, []);

  // Predefined haptic patterns
  const patterns = {
    // Basic impacts
    light: () => triggerHaptic(5),
    medium: () => triggerHaptic(10),
    heavy: () => triggerHaptic(20),
    
    // UI feedback
    tap: () => triggerHaptic(3),
    doubleTap: () => triggerHaptic([3, 50, 3]),
    longPress: () => triggerHaptic(25),
    
    // State changes
    success: () => triggerHaptic([5, 50, 5, 50, 5]),
    warning: () => triggerHaptic([10, 30, 10]),
    error: () => triggerHaptic([20, 50, 20, 50, 20]),
    
    // Navigation
    swipe: () => triggerHaptic(8),
    pageChange: () => triggerHaptic([5, 30, 5]),
    tabSwitch: () => triggerHaptic(7),
    
    // Input feedback
    keyPress: () => triggerHaptic(2),
    toggle: () => triggerHaptic(10),
    slider: () => triggerHaptic(4),
    
    // Game-specific
    sectionSelect: () => triggerHaptic([5, 20, 5]),
    favoriteAdd: () => triggerHaptic([10, 30, 10, 30, 10]),
    favoriteRemove: () => triggerHaptic([5, 20, 5]),
    
    // Custom pattern
    custom: (pattern: number | number[]) => triggerHaptic(pattern)
  };

  // Enable/disable haptics
  const setEnabled = useCallback((enabled: boolean) => {
    isEnabledRef.current = enabled;
  }, []);

  const isEnabled = useCallback(() => {
    return isEnabledRef.current && 'vibrate' in navigator;
  }, []);

  return {
    ...patterns,
    setEnabled,
    isEnabled,
    hasIOSHaptics: hasIOSHaptics()
  };
};

// HOC to add haptic feedback to components
export function withHapticFeedback<P extends object>(
  Component: React.ComponentType<P>,
  hapticType: keyof ReturnType<typeof useHapticFeedback> = 'tap'
) {
  return (props: P) => {
    const haptic = useHapticFeedback();
    
    const handleInteraction = useCallback((originalHandler?: Function) => {
      return (...args: any[]) => {
        if (typeof haptic[hapticType] === 'function') {
          (haptic[hapticType] as Function)();
        }
        originalHandler?.(...args);
      };
    }, [haptic, hapticType]);

    const enhancedProps = {
      ...props,
      onClick: handleInteraction((props as any).onClick),
      onTouchStart: handleInteraction((props as any).onTouchStart)
    };

    return <Component {...enhancedProps} />;
  };
}