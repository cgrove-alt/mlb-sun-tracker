import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/CookieBanner.module.css';

interface CookiePreferences {
  necessary: boolean;
  performance: boolean;
  functional: boolean;
  timestamp: number;
}

const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be disabled
    performance: false,
    functional: false,
    timestamp: Date.now()
  });

  useEffect(() => {
    // Check if user has already made a choice
    const storedConsent = localStorage.getItem('cookie_consent');
    if (!storedConsent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      // Load saved preferences
      try {
        const savedPrefs = JSON.parse(storedConsent);
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
  }, []);

  const applyCookiePreferences = (prefs: CookiePreferences) => {
    // Apply preferences to third-party services
    if (typeof window !== 'undefined') {
      // Google Analytics
      if (prefs.performance) {
        // Enable GA
        (window as any).gtag = (window as any).gtag || function() {
          ((window as any).dataLayer = (window as any).dataLayer || []).push(arguments);
        };
      } else {
        // Disable GA
        (window as any)['ga-disable-GA_MEASUREMENT_ID'] = true;
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
    localStorage.setItem('cookie_consent', JSON.stringify(prefsWithTimestamp));
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    applyCookiePreferences(prefsWithTimestamp);
    setPreferences(prefsWithTimestamp);
    setShowBanner(false);
    setShowPreferences(false);
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