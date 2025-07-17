/**
 * Custom hook for haptic feedback on mobile devices
 */
export const useHapticFeedback = () => {
  const triggerHaptic = (pattern: number | number[]) => {
    if ('vibrate' in navigator && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (error) {
        // Fail silently - not all devices support vibration
        console.debug('Haptic feedback not supported:', error);
      }
    }
  };

  return {
    light: () => triggerHaptic(10),
    medium: () => triggerHaptic(20),
    heavy: () => triggerHaptic(30),
    success: () => triggerHaptic([10, 10, 10]), // Pattern for success
    error: () => triggerHaptic([30, 10, 30]), // Pattern for error
  };
};