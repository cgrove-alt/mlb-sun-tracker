import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/i18nContext';
import { isOffline, getCacheInfo } from '../utils/serviceWorkerRegistration';
import './OfflineIndicator.css';

export const OfflineIndicator: React.FC = () => {
  const { t, isLoading: translationsLoading } = useTranslation();
  const [offline, setOffline] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);
  const [syncPending, setSyncPending] = useState(false);
  const [cacheInfo, setCacheInfo] = useState<{ percentage: number } | null>(null);
  const [hasBeenOffline, setHasBeenOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      // Only show "back online" message if we were previously offline
      if (hasBeenOffline) {
        setOffline(false);
        setSyncPending(true);
        setShowIndicator(true);
        
        // Hide indicator after showing "back online" message
        setTimeout(() => {
          setShowIndicator(false);
          setSyncPending(false);
        }, 3000);
      }
    };

    const handleOffline = () => {
      setOffline(true);
      setShowIndicator(true);
      setHasBeenOffline(true);
    };

    const handleSyncComplete = () => {
      setSyncPending(false);
    };

    // Check initial state - only show indicator if actually offline
    const initialOfflineState = isOffline();
    if (process.env.NODE_ENV === 'development') {
      console.log('[OfflineIndicator] Initial state:', { 
        offline: initialOfflineState, 
        navigatorOnLine: navigator.onLine 
      });
    }
    
    if (initialOfflineState) {
      setOffline(true);
      setShowIndicator(true);
      setHasBeenOffline(true);
    }

    // Get cache info only when offline
    if (initialOfflineState) {
      getCacheInfo().then(setCacheInfo).catch(error => {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to get cache info:', error);
        }
      });
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('sw-sync-complete', handleSyncComplete);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('sw-sync-complete', handleSyncComplete);
    };
  }, []);

  // Update cache info when offline status changes
  useEffect(() => {
    if (offline) {
      getCacheInfo().then(setCacheInfo).catch(error => {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to get cache info:', error);
        }
      });
    }
  }, [offline]);

  // Don't show indicator if translations are still loading or if we shouldn't show it
  if (!showIndicator || translationsLoading) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[OfflineIndicator] Not showing:', { showIndicator, translationsLoading });
    }
    return null;
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log('[OfflineIndicator] Rendering:', { offline, syncPending, showIndicator });
  }

  return (
    <div className={`offline-indicator ${offline ? 'offline' : 'online'} ${syncPending ? 'syncing' : ''}`}>
      <div className="offline-indicator-content">
        {offline ? (
          <>
            <span className="offline-icon">📵</span>
            <span className="offline-text">{t('offline.message') || "You're offline - Using cached data"}</span>
            {cacheInfo && (
              <span className="cache-info">
                {t('offline.cacheUsage', { percentage: cacheInfo.percentage.toFixed(1) }) || `Cache: ${cacheInfo.percentage.toFixed(1)}%`}
              </span>
            )}
          </>
        ) : syncPending ? (
          <>
            <span className="sync-icon">🔄</span>
            <span className="sync-text">{t('offline.syncing') || 'Syncing your data...'}</span>
          </>
        ) : (
          <>
            <span className="online-icon">✅</span>
            <span className="online-text">{t('offline.backOnline') || 'Back online!'}</span>
          </>
        )}
      </div>
    </div>
  );
};