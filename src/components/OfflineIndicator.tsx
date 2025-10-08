import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/i18nContext';
import { isOffline, getCacheInfo } from '../utils/serviceWorkerRegistration';

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

    }
    return null;
  }
  
  if (process.env.NODE_ENV === 'development') {

  }

  const getBgColor = () => {
    if (syncPending) return 'bg-orange-500';
    if (offline) return 'bg-error';
    return 'bg-success';
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-[9999] ${getBgColor()} text-white py-2 px-4 md:py-1.5 md:px-3 text-center text-sm md:text-xs font-medium shadow-md animate-slide-down`}>
      <div className="flex items-center justify-center gap-2 max-w-screen-xl mx-auto">
        {offline ? (
          <>
            <span className="text-lg md:text-base animate-pulse">📵</span>
            <span>{t('offline.message') || "You're offline - Using cached data"}</span>
            {cacheInfo && (
              <span className="text-xs opacity-90 ml-2 hidden md:inline">
                {t('offline.cacheUsage', { percentage: cacheInfo.percentage.toFixed(1) }) || `Cache: ${cacheInfo.percentage.toFixed(1)}%`}
              </span>
            )}
          </>
        ) : syncPending ? (
          <>
            <span className="text-lg md:text-base animate-pulse-sync">🔄</span>
            <span>{t('offline.syncing') || 'Syncing your data...'}</span>
          </>
        ) : (
          <>
            <span className="text-lg md:text-base animate-pulse">✅</span>
            <span>{t('offline.backOnline') || 'Back online!'}</span>
          </>
        )}
      </div>
    </div>
  );
};