'use client';

import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  useEffect(() => {
    // Handle PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Don't show immediately, wait for user interaction
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    };

    // Handle online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Handle service worker updates
    const handleServiceWorkerUpdate = () => {
      setShowUpdatePrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', handleServiceWorkerUpdate);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('controllerchange', handleServiceWorkerUpdate);
      }
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the PWA install prompt');
      } else {
        console.log('User dismissed the PWA install prompt');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismissInstall = () => {
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  const handleUpdateClick = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration?.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    }
    setShowUpdatePrompt(false);
    window.location.reload();
  };

  const handleDismissUpdate = () => {
    setShowUpdatePrompt(false);
  };

  return (
    <>
      {/* PWA Install Prompt */}
      {showPrompt && deferredPrompt && (
        <div className="pwa-install-prompt">
          <span>📱 Install MLB Sun Tracker for quick access!</span>
          <button onClick={handleInstallClick}>Install</button>
          <button className="close-btn" onClick={handleDismissInstall}>
            ✕
          </button>
        </div>
      )}

      {/* Offline Indicator */}
      <div className={`offline-indicator ${!isOnline ? 'show' : ''}`}>
        📡 You're offline. Some features may not work.
      </div>

      {/* Update Available Notification */}
      {showUpdatePrompt && (
        <div className="update-available">
          <h4>🔄 Update Available</h4>
          <p>A new version of MLB Sun Tracker is available!</p>
          <button onClick={handleUpdateClick}>Update Now</button>
          <button className="dismiss-btn" onClick={handleDismissUpdate}>
            Later
          </button>
        </div>
      )}
    </>
  );
}