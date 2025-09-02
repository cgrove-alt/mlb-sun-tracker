'use client';

import { useState, useEffect } from 'react';
import { cookieConsent } from '../utils/cookies';

interface GPCStatus {
  isGPCEnabled: boolean;
  isGPCSupported: boolean;
  hasHonoredGPC: boolean;
}

/**
 * Hook to detect and manage Global Privacy Control (GPC) signals
 * GPC is a browser signal that indicates a user's preference to opt-out
 * of data sharing and selling
 */
export function useGlobalPrivacyControl(): GPCStatus {
  const [gpcStatus, setGPCStatus] = useState<GPCStatus>({
    isGPCEnabled: false,
    isGPCSupported: false,
    hasHonoredGPC: false
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if GPC is supported and enabled
    const checkGPC = () => {
      // Check for the standard GPC signal
      const gpcEnabled = !!(navigator as any).globalPrivacyControl;
      
      // Check if the browser supports GPC (has the property, even if false)
      const gpcSupported = 'globalPrivacyControl' in navigator;
      
      // Check if we've already honored a GPC request (check cookie first, then localStorage)
      let gpcHonored = cookieConsent.isGPCHonored();
      if (!gpcHonored) {
        // Fallback to localStorage and migrate if found
        gpcHonored = localStorage.getItem('gpc_honored') === 'true';
        if (gpcHonored) {
          cookieConsent.setGPCHonored(true);
        }
      }
      
      // Log GPC status for debugging
      if (gpcSupported) {
        console.log('[GPC] Global Privacy Control detected:', {
          enabled: gpcEnabled,
          supported: gpcSupported,
          previouslyHonored: gpcHonored
        });
      }
      
      setGPCStatus({
        isGPCEnabled: gpcEnabled,
        isGPCSupported: gpcSupported,
        hasHonoredGPC: gpcHonored
      });

      // If GPC is enabled and we haven't honored it yet, mark it as honored
      if (gpcEnabled && !gpcHonored) {
        // Save to both cookie and localStorage
        cookieConsent.setGPCHonored(true);
        localStorage.setItem('gpc_honored', 'true');
        localStorage.setItem('gpc_honored_date', new Date().toISOString());
        console.log('[GPC] Honoring Global Privacy Control signal');
      }
    };

    checkGPC();

    // Also check on visibility change (in case user changes GPC setting)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkGPC();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return gpcStatus;
}

/**
 * Utility function to check GPC status without using the hook
 * Useful for non-React contexts
 */
export function checkGlobalPrivacyControl(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(navigator as any).globalPrivacyControl;
}

/**
 * Clear GPC honored status (useful for testing)
 */
export function clearGPCStatus(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('gpc_honored');
  localStorage.removeItem('gpc_honored_date');
  console.log('[GPC] Cleared GPC honored status');
}