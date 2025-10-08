'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useGlobalPrivacyControl } from '../hooks/useGlobalPrivacyControl';
import { cookieConsent, cookiesEnabled } from '../utils/cookies';

interface CookiePreferences {
  necessary: boolean;
  performance: boolean;
  functional: boolean;
  timestamp: number;
}

const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showGPCNotice, setShowGPCNotice] = useState(false);
  const [cookiesAvailable, setCookiesAvailable] = useState(true);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be disabled
    performance: false,
    functional: false,
    timestamp: Date.now()
  });
  
  const { isGPCEnabled, isGPCSupported } = useGlobalPrivacyControl();

  useEffect(() => {
    // Check if cookies are enabled
    const areCookiesEnabled = cookiesEnabled();
    setCookiesAvailable(areCookiesEnabled);
    
    // Check cookies first, then localStorage as fallback
    let storedConsent = areCookiesEnabled ? cookieConsent.getConsent() : null;
    let gpcAutoApplied = areCookiesEnabled ? cookieConsent.isGPCHonored() : false;
    
    // Migration: If no cookie but localStorage exists, migrate to cookie
    if (!storedConsent) {
      const localStorageConsent = localStorage.getItem('cookie_consent');
      if (localStorageConsent) {
        try {
          storedConsent = JSON.parse(localStorageConsent);
          // Migrate to cookie
          if (cookieConsent.setConsent(storedConsent)) {
            console.log('[Cookie Migration] Migrated consent from localStorage to cookie');
          }
        } catch (e) {
          console.error('Error migrating cookie consent:', e);
        }
      }
    }
    
    // Check GPC auto-applied status
    if (!gpcAutoApplied) {
      gpcAutoApplied = localStorage.getItem('gpc_auto_applied') === 'true';
      if (gpcAutoApplied) {
        cookieConsent.setGPCHonored(true);
      }
    }
    
    // If GPC is enabled and we haven't auto-applied preferences yet
    if (isGPCEnabled && !gpcAutoApplied && !storedConsent) {
      console.log('[GPC] Auto-applying privacy preferences due to GPC signal');
      
      // Auto-apply necessary-only preferences
      const gpcPreferences = {
        necessary: true,
        performance: false,
        functional: false,
        timestamp: Date.now()
      };
      
      // Save preferences to both cookie and localStorage
      const saved = cookieConsent.setConsent(gpcPreferences);
      if (saved) {
        cookieConsent.setConsentDate(new Date().toISOString());
        cookieConsent.setGPCHonored(true);
      }
      // Also save to localStorage as backup
      localStorage.setItem('cookie_consent', JSON.stringify(gpcPreferences));
      localStorage.setItem('cookie_consent_date', new Date().toISOString());
      localStorage.setItem('gpc_auto_applied', 'true');
      applyCookiePreferences(gpcPreferences);
      setPreferences(gpcPreferences);
      
      // Show GPC notice briefly
      setShowGPCNotice(true);
      setTimeout(() => setShowGPCNotice(false), 5000);
      
    } else if (!storedConsent && !isGPCEnabled) {
      // Show banner after a short delay for better UX (only if GPC is not enabled)
      setTimeout(() => setShowBanner(true), 1000);
    } else if (storedConsent) {
      // Load saved preferences
      try {
        const savedPrefs = typeof storedConsent === 'string' ? JSON.parse(storedConsent) : storedConsent;
        setPreferences(savedPrefs);
        applyCookiePreferences(savedPrefs);
      } catch (e) {
        console.error('Error loading cookie preferences:', e);
      }
    }

    // Expose function to show preferences (for footer link)
    if (typeof window !== 'undefined') {
      (window as any).showCookiePreferences = () => {
        setShowPreferences(true);
        setShowBanner(true);
      };
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).showCookiePreferences;
      }
    };
  }, [isGPCEnabled, isGPCSupported]);

  const applyCookiePreferences = (prefs: CookiePreferences) => {
    // Apply preferences to third-party services
    if (typeof window !== 'undefined') {
      const GA_MEASUREMENT_ID = 'G-JXGEKF957C';
      
      // Google Analytics
      if (prefs.performance) {
        // Enable GA - remove the opt-out flag
        delete (window as any)[`ga-disable-${GA_MEASUREMENT_ID}`];
        (window as any).gtag = (window as any).gtag || function() {
          ((window as any).dataLayer = (window as any).dataLayer || []).push(arguments);
        };
      } else {
        // Disable GA - set the opt-out flag with the actual ID
        (window as any)[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
        
        // Clear existing GA cookies
        document.cookie.split(';').forEach(cookie => {
          const [name] = cookie.split('=');
          if (name.trim().match(/^(_ga|_gid|_gat|_ga_)/)) {
            // Delete GA cookies for all possible domains
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
          }
        });
      }

      // Functional cookies
      if (!prefs.functional) {
        // Clear functional cookies
        document.cookie.split(';').forEach(cookie => {
          const [name] = cookie.split('=');
          if (name.trim().match(/^(stadium_preferences|user_location|recent_searches)/)) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          }
        });
      }
    }
  };

  const savePreferences = (prefs: CookiePreferences) => {
    const prefsWithTimestamp = { ...prefs, timestamp: Date.now() };
    
    // Save to cookie (primary storage)
    const cookieSaved = cookieConsent.setConsent(prefsWithTimestamp);
    if (cookieSaved) {
      cookieConsent.setConsentDate(new Date().toISOString());
    } else {
      console.warn('[Cookie Consent] Failed to save to cookie, using localStorage only');
    }
    
    // Also save to localStorage (backup storage)
    localStorage.setItem('cookie_consent', JSON.stringify(prefsWithTimestamp));
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    
    applyCookiePreferences(prefsWithTimestamp);
    setPreferences(prefsWithTimestamp);
    setShowBanner(false);
    setShowPreferences(false);
    
    // Emit event for other components to listen to
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cookieConsentChanged', { 
        detail: prefsWithTimestamp 
      }));
    }
  };

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      performance: true,
      functional: true,
      timestamp: Date.now()
    };
    savePreferences(allAccepted);
  };

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      performance: false,
      functional: false,
      timestamp: Date.now()
    };
    savePreferences(necessaryOnly);
  };

  const saveCustomPreferences = () => {
    savePreferences(preferences);
  };

  // Show GPC notice if applicable
  if (showGPCNotice && !showBanner) {
    return (
      <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-[#4caf50] text-white rounded-lg p-3 px-5 shadow-[0_4px_12px_rgba(76,175,80,0.3)] z-[10000] animate-[slideDown_0.4s_ease-out] max-w-[500px] w-[calc(100%-40px)] sm:top-5 sm:p-3 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="text-2xl flex-shrink-0">🛡️</span>
          <span className="flex-1 text-[0.95rem] leading-[1.4]">
            Global Privacy Control signal detected. Your privacy preferences have been automatically set to maximum protection.
          </span>
          <button
            className="bg-[rgba(255,255,255,0.2)] border border-[rgba(255,255,255,0.3)] text-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer text-[1.2rem] transition-[background] flex-shrink-0 hover:bg-[rgba(255,255,255,0.3)]"
            onClick={() => setShowGPCNotice(false)}
            aria-label="Dismiss"
          >
            ✓
          </button>
        </div>
      </div>
    );
  }
  
  if (!showBanner) return null;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.5)] z-[9998] animate-[fadeIn_0.3s_ease-in-out]" onClick={() => setShowBanner(false)} />
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] max-w-[600px] w-[calc(100%-40px)] z-[9999] animate-[slideUp_0.4s_ease-out] overflow-hidden sm:bottom-0 sm:left-0 sm:right-0 sm:translate-x-0 sm:w-full sm:rounded-t-xl sm:rounded-b-none sm:max-w-none">
        {!showPreferences ? (
          <div className="p-5">
            <div className="flex justify-between items-center mb-[15px] pb-[15px] border-b border-[#e0e0e0]">
              <h3 className="m-0 text-[1.3rem] text-[#1a1a1a] font-semibold">🍪 Cookie Consent</h3>
              <button
                className="bg-none border-none text-2xl text-[#666] cursor-pointer p-0 w-[30px] h-[30px] flex items-center justify-center rounded-full transition-[background,color] hover:bg-[#f0f0f0] hover:text-[#333]"
                onClick={() => setShowBanner(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="mb-5">
              <p className="my-2.5 text-[#444] leading-[1.6] text-[0.95rem]">
                The Shadium uses cookies to enhance your experience. We use cookies for
                essential website functions, analytics, and personalization.
              </p>
              {isGPCSupported && isGPCEnabled && (
                <p className="bg-[#e8f5e9] border-l-4 border-[#4caf50] p-2.5 px-3 my-3 rounded text-[0.9rem] text-[#2e7d32]">
                  <span className="inline-block bg-[#4caf50] text-white py-0.5 px-2 rounded text-[0.8rem] font-semibold mr-2 uppercase">GPC Active</span>
                  Your browser's Global Privacy Control signal is enabled. We're honoring your privacy preference.
                </p>
              )}
              <p className="my-2.5 text-[#444] leading-[1.6] text-[0.95rem] text-[0.9rem] text-[#666]">
                Learn more in our <Link href="/cookies" className="text-[#2196f3] no-underline font-medium hover:underline">Cookie Policy</Link> and{' '}
                <Link href="/privacy" className="text-[#2196f3] no-underline font-medium hover:underline">Privacy Policy</Link>.
              </p>
            </div>

            <div className="flex gap-2.5 justify-end flex-wrap sm:flex-col">
              <button
                className="py-2.5 px-5 rounded-md border-none text-[0.95rem] font-medium cursor-pointer transition-all whitespace-nowrap bg-[#f0f0f0] text-[#333] border border-[#ddd] hover:bg-[#e0e0e0] hover:border-[#ccc] sm:w-full"
                onClick={() => setShowPreferences(true)}
              >
                Customize
              </button>
              <button
                className="py-2.5 px-5 rounded-md border-none text-[0.95rem] font-medium cursor-pointer transition-all whitespace-nowrap bg-white text-[#666] border border-[#ddd] hover:bg-[#f8f8f8] hover:border-[#bbb] sm:w-full"
                onClick={acceptNecessary}
              >
                Necessary Only
              </button>
              <button
                className="py-2.5 px-5 rounded-md border-none text-[0.95rem] font-medium cursor-pointer transition-all whitespace-nowrap bg-[#2196f3] text-white hover:bg-[#1976d2] sm:w-full"
                onClick={acceptAll}
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5">
            <div className="flex justify-between items-center mb-[15px] pb-[15px] border-b border-[#e0e0e0]">
              <h3 className="m-0 text-[1.3rem] text-[#1a1a1a] font-semibold">⚙️ Cookie Preferences</h3>
              <button
                className="bg-none border-none text-base text-[#666] cursor-pointer p-0 w-auto py-1.5 px-2.5 rounded-md flex items-center justify-center transition-[background,color] hover:bg-[#f0f0f0] hover:text-[#333]"
                onClick={() => setShowPreferences(false)}
              >
                ← Back
              </button>
            </div>

            <div className="my-5 max-h-[300px] overflow-y-auto sm:max-h-[250px]">
              <div className="p-[15px] mb-2.5 bg-[#f9f9f9] rounded-lg border border-[#e0e0e0]">
                <div className="mb-2">
                  <label className="flex items-start cursor-pointer gap-3">
                    <input
                      type="checkbox"
                      checked={preferences.necessary}
                      disabled
                      className="mt-0.5 w-[18px] h-[18px] cursor-not-allowed opacity-60"
                    />
                    <div>
                      <strong className="text-[#333] text-base block mb-0.5">Necessary Cookies</strong>
                      <span className="inline-block ml-2 py-0.5 px-2 bg-[#4caf50] text-white text-xs rounded font-medium">Always Active</span>
                    </div>
                  </label>
                </div>
                <p className="m-0 text-[#666] text-[0.85rem] leading-[1.5] ml-[30px] sm:ml-0 sm:mt-2">
                  Essential for the website to function. These cannot be disabled.
                </p>
              </div>

              <div className="p-[15px] mb-2.5 bg-[#f9f9f9] rounded-lg border border-[#e0e0e0]">
                <div className="mb-2">
                  <label className="flex items-start cursor-pointer gap-3">
                    <input
                      type="checkbox"
                      checked={preferences.performance}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        performance: e.target.checked
                      })}
                      className="mt-0.5 w-[18px] h-[18px] cursor-pointer"
                    />
                    <div>
                      <strong className="text-[#333] text-base block mb-0.5">Performance Cookies</strong>
                      <span className="inline-block ml-2 py-0.5 px-2 bg-[#ff9800] text-white text-xs rounded font-medium">Optional</span>
                    </div>
                  </label>
                </div>
                <p className="m-0 text-[#666] text-[0.85rem] leading-[1.5] ml-[30px] sm:ml-0 sm:mt-2">
                  Help us understand how visitors use our website through analytics.
                </p>
              </div>

              <div className="p-[15px] mb-2.5 bg-[#f9f9f9] rounded-lg border border-[#e0e0e0]">
                <div className="mb-2">
                  <label className="flex items-start cursor-pointer gap-3">
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        functional: e.target.checked
                      })}
                      className="mt-0.5 w-[18px] h-[18px] cursor-pointer"
                    />
                    <div>
                      <strong className="text-[#333] text-base block mb-0.5">Functional Cookies</strong>
                      <span className="inline-block ml-2 py-0.5 px-2 bg-[#ff9800] text-white text-xs rounded font-medium">Optional</span>
                    </div>
                  </label>
                </div>
                <p className="m-0 text-[#666] text-[0.85rem] leading-[1.5] ml-[30px] sm:ml-0 sm:mt-2">
                  Remember your preferences and provide enhanced features.
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 justify-end flex-wrap sm:flex-col">
              <button
                className="py-2.5 px-5 rounded-md border-none text-[0.95rem] font-medium cursor-pointer transition-all whitespace-nowrap bg-[#f0f0f0] text-[#666] hover:bg-[#e0e0e0] sm:w-full"
                onClick={() => setShowBanner(false)}
              >
                Cancel
              </button>
              <button
                className="py-2.5 px-5 rounded-md border-none text-[0.95rem] font-medium cursor-pointer transition-all whitespace-nowrap bg-[#4caf50] text-white hover:bg-[#45a049] sm:w-full"
                onClick={saveCustomPreferences}
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}

        <div className="bg-[#f5f5f5] p-3 px-5 border-t border-[#e0e0e0] m-0 -mx-5 -mb-5">
          <p className="m-0 text-[0.85rem] text-[#666] text-center">
            By using our site, you agree to our{' '}
            <Link href="/terms" className="text-[#2196f3] no-underline hover:underline">Terms of Service</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default CookieBanner;