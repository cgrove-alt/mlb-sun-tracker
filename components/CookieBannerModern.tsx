'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ModernButton } from '../src/components/ModernButton';
import { useGlobalPrivacyControl } from '../hooks/useGlobalPrivacyControl';
import { cookieConsent, cookiesEnabled } from '../utils/cookies';

interface CookiePreferences {
  necessary: boolean;
  performance: boolean;
  functional: boolean;
  timestamp: number;
}

const CookieBannerModern: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showGPCNotice, setShowGPCNotice] = useState(false);
  const [cookiesAvailable, setCookiesAvailable] = useState(true);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    performance: false,
    functional: false,
    timestamp: Date.now()
  });
  
  const { isGPCEnabled, isGPCSupported } = useGlobalPrivacyControl();

  useEffect(() => {
    const areCookiesEnabled = cookiesEnabled();
    setCookiesAvailable(areCookiesEnabled);
    
    let storedConsent = areCookiesEnabled ? cookieConsent.getConsent() : null;
    let gpcAutoApplied = areCookiesEnabled ? cookieConsent.isGPCHonored() : false;
    
    if (!storedConsent) {
      const localStorageConsent = localStorage.getItem('cookie_consent');
      if (localStorageConsent) {
        try {
          storedConsent = JSON.parse(localStorageConsent);
          if (cookieConsent.setConsent(storedConsent)) {
            console.log('[Cookie Migration] Migrated consent from localStorage to cookie');
          }
        } catch (e) {
          console.error('Error migrating cookie consent:', e);
        }
      }
    }
    
    if (!gpcAutoApplied) {
      gpcAutoApplied = localStorage.getItem('gpc_auto_applied') === 'true';
      if (gpcAutoApplied) {
        cookieConsent.setGPCHonored(true);
      }
    }
    
    if (isGPCEnabled && !gpcAutoApplied && !storedConsent) {
      console.log('[GPC] Auto-applying privacy preferences due to GPC signal');
      
      const gpcPreferences = {
        necessary: true,
        performance: false,
        functional: false,
        timestamp: Date.now()
      };
      
      const saved = cookieConsent.setConsent(gpcPreferences);
      if (saved) {
        cookieConsent.setConsentDate(new Date().toISOString());
        cookieConsent.setGPCHonored(true);
      }
      
      localStorage.setItem('cookie_consent', JSON.stringify(gpcPreferences));
      localStorage.setItem('cookie_consent_date', new Date().toISOString());
      localStorage.setItem('gpc_auto_applied', 'true');
      applyCookiePreferences(gpcPreferences);
      setPreferences(gpcPreferences);
      
      setShowGPCNotice(true);
      setTimeout(() => setShowGPCNotice(false), 5000);
      
    } else if (!storedConsent && !isGPCEnabled) {
      setTimeout(() => setShowBanner(true), 1000);
    } else if (storedConsent) {
      try {
        const savedPrefs = typeof storedConsent === 'string' ? JSON.parse(storedConsent) : storedConsent;
        setPreferences(savedPrefs);
        applyCookiePreferences(savedPrefs);
      } catch (e) {
        console.error('Error loading preferences:', e);
        setTimeout(() => setShowBanner(true), 1000);
      }
    }
    
    if (typeof window !== 'undefined') {
      (window as any).showCookiePreferences = () => {
        setShowPreferences(true);
        setShowBanner(false);
      };
    }
  }, [isGPCEnabled]);

  const applyCookiePreferences = (prefs: CookiePreferences) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': prefs.performance ? 'granted' : 'denied',
        'functionality_storage': prefs.functional ? 'granted' : 'denied',
        'security_storage': 'granted',
        'personalization_storage': 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
      });
      
      if (prefs.performance) {
        (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
          page_path: window.location.pathname,
        });
      }
    }
    
    localStorage.setItem('ga_opt_out', (!prefs.performance).toString());
  };

  const handleAcceptAll = () => {
    const newPreferences = {
      necessary: true,
      performance: true,
      functional: true,
      timestamp: Date.now()
    };
    
    const saved = cookieConsent.setConsent(newPreferences);
    if (saved) {
      cookieConsent.setConsentDate(new Date().toISOString());
    }
    
    localStorage.setItem('cookie_consent', JSON.stringify(newPreferences));
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    
    applyCookiePreferences(newPreferences);
    setPreferences(newPreferences);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleRejectAll = () => {
    const newPreferences = {
      necessary: true,
      performance: false,
      functional: false,
      timestamp: Date.now()
    };
    
    const saved = cookieConsent.setConsent(newPreferences);
    if (saved) {
      cookieConsent.setConsentDate(new Date().toISOString());
    }
    
    localStorage.setItem('cookie_consent', JSON.stringify(newPreferences));
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    
    applyCookiePreferences(newPreferences);
    setPreferences(newPreferences);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleSavePreferences = () => {
    const saved = cookieConsent.setConsent(preferences);
    if (saved) {
      cookieConsent.setConsentDate(new Date().toISOString());
    }
    
    localStorage.setItem('cookie_consent', JSON.stringify(preferences));
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    
    applyCookiePreferences(preferences);
    setShowBanner(false);
    setShowPreferences(false);
  };

  if (showGPCNotice) {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slide-up">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 shadow-lg backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🛡️</span>
            <div>
              <h4 className="font-semibold text-green-900 mb-1">Privacy Preserved</h4>
              <p className="text-sm text-green-700">
                We've honored your Global Privacy Control signal and applied strict privacy settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!showBanner && !showPreferences) return null;

  return (
    <>
      {/* Glass morphism overlay */}
      {(showBanner || showPreferences) && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
      )}

      {/* Main Banner */}
      {showBanner && !showPreferences && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
          <div className="mx-auto max-w-7xl">
            <div className="bg-white/95 backdrop-blur-md border-2 border-ink-200 rounded-2xl shadow-2xl p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-ink-900 mb-2 flex items-center gap-2">
                    <span>🍪</span> We value your privacy
                  </h3>
                  <p className="text-sm text-ink-600 mb-2">
                    We use cookies to enhance your experience and analyze site traffic. 
                    By clicking "Accept All", you consent to our use of cookies.
                  </p>
                  <p className="text-xs text-ink-500">
                    Learn more in our{' '}
                    <Link href="/cookies" className="text-primary-500 hover:text-primary-600 underline">
                      Cookie Policy
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-primary-500 hover:text-primary-600 underline">
                      Privacy Policy
                    </Link>.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <ModernButton
                    onClick={() => setShowPreferences(true)}
                    variant="ghost"
                    size="md"
                  >
                    Manage Preferences
                  </ModernButton>
                  <ModernButton
                    onClick={handleRejectAll}
                    variant="secondary"
                    size="md"
                  >
                    Reject All
                  </ModernButton>
                  <ModernButton
                    onClick={handleAcceptAll}
                    variant="primary"
                    size="md"
                  >
                    Accept All
                  </ModernButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-md border-2 border-ink-200 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-ink-900 mb-4">Cookie Preferences</h2>
              
              {!cookiesAvailable && (
                <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    ⚠️ Cookies appear to be disabled in your browser. 
                    Your preferences will be saved locally but may not persist across sessions.
                  </p>
                </div>
              )}

              {isGPCSupported && isGPCEnabled && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✓ Global Privacy Control detected. We're respecting your privacy signal.
                  </p>
                </div>
              )}
              
              <div className="space-y-4">
                {/* Necessary Cookies */}
                <div className="p-4 bg-ink-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-ink-900">Necessary Cookies</h3>
                    <span className="text-sm text-ink-500 bg-ink-200 px-2 py-1 rounded">Always Active</span>
                  </div>
                  <p className="text-sm text-ink-600">
                    Essential for the website to function properly. These cannot be disabled.
                  </p>
                </div>

                {/* Performance Cookies */}
                <div className="p-4 bg-white border border-ink-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-ink-900">Performance Cookies</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.performance}
                        onChange={(e) => setPreferences({...preferences, performance: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-ink-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                  <p className="text-sm text-ink-600">
                    Help us understand how visitors interact with our website.
                  </p>
                </div>

                {/* Functional Cookies */}
                <div className="p-4 bg-white border border-ink-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-ink-900">Functional Cookies</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.functional}
                        onChange={(e) => setPreferences({...preferences, functional: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-ink-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                  <p className="text-sm text-ink-600">
                    Enable enhanced functionality and personalization.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-ink-200">
                <ModernButton
                  onClick={() => {
                    setShowPreferences(false);
                    setShowBanner(true);
                  }}
                  variant="ghost"
                  size="md"
                >
                  Cancel
                </ModernButton>
                <ModernButton
                  onClick={handleSavePreferences}
                  variant="primary"
                  size="md"
                >
                  Save Preferences
                </ModernButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieBannerModern;