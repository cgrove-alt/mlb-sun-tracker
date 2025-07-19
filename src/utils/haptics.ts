/**
 * Haptic feedback utilities for touch interactions
 */

export enum HapticFeedbackType {
  Light = 10,
  Medium = 20,
  Heavy = 30,
  Success = 50,
  Warning = 75,
  Error = 100
}

/**
 * Trigger haptic feedback if supported by the device
 * @param duration - Duration in milliseconds
 * @param type - Type of haptic feedback
 */
export const triggerHaptic = (
  duration: number = HapticFeedbackType.Light,
  pattern?: number[]
): void => {
  if ('vibrate' in navigator) {
    try {
      if (pattern) {
        navigator.vibrate(pattern);
      } else {
        navigator.vibrate(duration);
      }
    } catch (error) {
      // Silently fail if vibration is not supported or fails
      console.debug('Haptic feedback not available:', error);
    }
  }
};

/**
 * Haptic feedback presets
 */
export const haptics = {
  tap: () => triggerHaptic(HapticFeedbackType.Light),
  select: () => triggerHaptic(HapticFeedbackType.Medium),
  success: () => triggerHaptic(HapticFeedbackType.Success),
  warning: () => triggerHaptic(HapticFeedbackType.Warning),
  error: () => triggerHaptic(HapticFeedbackType.Error),
  
  // Pattern-based haptics
  doubleTab: () => triggerHaptic(undefined, [10, 50, 10]),
  longPress: () => triggerHaptic(HapticFeedbackType.Heavy),
  swipe: () => triggerHaptic(undefined, [5, 10, 5])
};

/**
 * Hook for adding haptic feedback to elements
 */
export const useHapticFeedback = () => {
  return {
    onTap: haptics.tap,
    onSelect: haptics.select,
    onSuccess: haptics.success,
    onWarning: haptics.warning,
    onError: haptics.error,
    onSwipe: haptics.swipe
  };
};