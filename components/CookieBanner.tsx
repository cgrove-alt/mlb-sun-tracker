'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/CookieBanner.module.css';
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
      <div className={styles.gpcNotice}>
        <div className={styles.gpcContent}>
          <span className={styles.gpcIcon}>🛡️</span>
          <span className={styles.gpcText}>
            Global Privacy Control signal detected. Your privacy preferences have been automatically set to maximum protection.
          </span>
          <button 
            className={styles.gpcDismiss}
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
      <div className={styles.overlay} onClick={() => setShowBanner(false)} />
      <div className={styles.banner}>
        {!showPreferences ? (
          <div className={styles.mainContent}>
            <div className={styles.header}>
              <h3>🍪 Cookie Consent</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowBanner(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            
            <div className={styles.body}>
              <p>
                The Shadium uses cookies to enhance your experience. We use cookies for 
                essential website functions, analytics, and personalization.
              </p>
              {isGPCSupported && isGPCEnabled && (
                <p className={styles.gpcIndicator}>
                  <span className={styles.gpcBadge}>GPC Active</span>
                  Your browser's Global Privacy Control signal is enabled. We're honoring your privacy preference.
                </p>
              )}
              <p className={styles.learnMore}>
                Learn more in our <Link href="/cookies">Cookie Policy</Link> and{' '}
                <Link href="/privacy">Privacy Policy</Link>.
              </p>
            </div>
            
            <div className={styles.actions}>
              <button 
                className={styles.customizeButton}
                onClick={() => setShowPreferences(true)}
              >
                Customize
              </button>
              <button 
                className={styles.rejectButton}
                onClick={acceptNecessary}
              >
                Necessary Only
              </button>
              <button 
                className={styles.acceptButton}
                onClick={acceptAll}
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.preferencesContent}>
            <div className={styles.header}>
              <h3>⚙️ Cookie Preferences</h3>
              <button 
                className={styles.backButton}
                onClick={() => setShowPreferences(false)}
              >
                ← Back
              </button>
            </div>
            
            <div className={styles.preferencesList}>
              <div className={styles.preferenceItem}>
                <div className={styles.preferenceHeader}>
                  <label className={styles.preferenceLabel}>
                    <input 
                      type="checkbox"
                      checked={preferences.necessary}
                      disabled
                      className={styles.checkbox}
                    />
                    <div>
                      <strong>Necessary Cookies</strong>
                      <span className={styles.required}>Always Active</span>
                    </div>
                  </label>
                </div>
                <p className={styles.preferenceDescription}>
                  Essential for the website to function. These cannot be disabled.
                </p>
              </div>
              
              <div className={styles.preferenceItem}>
                <div className={styles.preferenceHeader}>
                  <label className={styles.preferenceLabel}>
                    <input 
                      type="checkbox"
                      checked={preferences.performance}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        performance: e.target.checked
                      })}
                      className={styles.checkbox}
                    />
                    <div>
                      <strong>Performance Cookies</strong>
                      <span className={styles.optional}>Optional</span>
                    </div>
                  </label>
                </div>
                <p className={styles.preferenceDescription}>
                  Help us understand how visitors use our website through analytics.
                </p>
              </div>
              
              <div className={styles.preferenceItem}>
                <div className={styles.preferenceHeader}>
                  <label className={styles.preferenceLabel}>
                    <input 
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        functional: e.target.checked
                      })}
                      className={styles.checkbox}
                    />
                    <div>
                      <strong>Functional Cookies</strong>
                      <span className={styles.optional}>Optional</span>
                    </div>
                  </label>
                </div>
                <p className={styles.preferenceDescription}>
                  Remember your preferences and provide enhanced features.
                </p>
              </div>
            </div>
            
            <div className={styles.actions}>
              <button 
                className={styles.cancelButton}
                onClick={() => setShowBanner(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.saveButton}
                onClick={saveCustomPreferences}
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
        
        <div className={styles.footer}>
          <p>
            By using our site, you agree to our{' '}
            <Link href="/terms">Terms of Service</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default CookieBanner;