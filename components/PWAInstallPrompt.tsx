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
  // Update notifications are intentionally NOT handled here. The app
  // auto-updates silently — see components/ServiceWorkerRegistration.tsx, the
  // single owner of service-worker registration + update behavior.

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


    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
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

  return (
    <>
      {/* PWA Install Prompt */}
      {showPrompt && deferredPrompt && (
        <div className="pwa-install-prompt">
          <span>📱 Install The Shadium for quick access!</span>
          <button onClick={handleInstallClick}>Install</button>
          <button className="close-btn" onClick={handleDismissInstall}>
            ✕
          </button>
        </div>
      )}
    </>
  );
}