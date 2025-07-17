import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/i18nContext';
import { isOffline, getCacheInfo } from '../utils/serviceWorkerRegistration';
import './OfflineIndicator.css';

export const OfflineIndicator: React.FC = () => {
  const { t } = useTranslation();
  const [offline, setOffline] = useState(isOffline());
  const [showIndicator, setShowIndicator] = useState(false);
  const [syncPending, setSyncPending] = useState(false);
  const [cacheInfo, setCacheInfo] = useState<{ percentage: number } | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setOffline(false);
      setSyncPending(true);
      
      // Hide indicator after showing "back online" message
      setTimeout(() => {
        setShowIndicator(false);
        setSyncPending(false);
      }, 3000);
    };

    const handleOffline = () => {
      setOffline(true);
      setShowIndicator(true);
    };

    const handleSyncComplete = () => {
      setSyncPending(false);
    };

    // Check initial state
    if (isOffline()) {
      setOffline(true);
      setShowIndicator(true);
    }

    // Get cache info
    getCacheInfo().then(setCacheInfo).catch(console.error);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('sw-sync-complete', handleSyncComplete);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('sw-sync-complete', handleSyncComplete);
    };
  }, []);

  if (!showIndicator && !syncPending) {
    return null;
  }

  return (
    <div className={`offline-indicator ${offline ? 'offline' : 'online'} ${syncPending ? 'syncing' : ''}`}>
      <div className="offline-indicator-content">
        {offline ? (
          <>
            <span className="offline-icon">📵</span>
            <span className="offline-text">{t('offline.message')}</span>
            {cacheInfo && (
              <span className="cache-info">
                {t('offline.cacheUsage', { percentage: cacheInfo.percentage.toFixed(1) })}
              </span>
            )}
          </>
        ) : syncPending ? (
          <>
            <span className="sync-icon">🔄</span>
            <span className="sync-text">{t('offline.syncing')}</span>
          </>
        ) : (
          <>
            <span className="online-icon">✅</span>
            <span className="online-text">{t('offline.backOnline')}</span>
          </>
        )}
      </div>
    </div>
  );
};