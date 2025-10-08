import React, { useState, useEffect } from 'react';
import { BeforeInstallPromptEvent } from '../utils/pwa';

interface InstallToastEvent extends CustomEvent {
  detail: {
    prompt: BeforeInstallPromptEvent;
    onInstall: () => Promise<void>;
    onDismiss: () => void;
  };
}

export const PWAInstallToast: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installHandler, setInstallHandler] = useState<(() => Promise<void>) | null>(null);
  const [dismissHandler, setDismissHandler] = useState<(() => void) | null>(null);

  useEffect(() => {
    const handleShowToast = (event: Event) => {
      const installEvent = event as InstallToastEvent;
      setInstallHandler(() => installEvent.detail.onInstall);
      setDismissHandler(() => installEvent.detail.onDismiss);
      setShowToast(true);
      
      // Auto-hide after 10 seconds if no action taken
      setTimeout(() => {
        if (showToast) {
          handleDismiss();
        }
      }, 10000);
    };

    window.addEventListener('show-pwa-install-toast', handleShowToast);

    return () => {
      window.removeEventListener('show-pwa-install-toast', handleShowToast);
    };
  }, []);

  const handleInstall = async () => {
    if (!installHandler) return;
    
    setIsInstalling(true);
    try {
      await installHandler();
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
      setShowToast(false);
    }
  };

  const handleDismiss = () => {
    if (dismissHandler) {
      dismissHandler();
    }
    setShowToast(false);
  };

  if (!showToast) return null;

  return (
    <div className={`
      fixed left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.05)]
      p-4 z-[10000] max-w-[calc(100vw-32px)] w-[420px] animate-toast-slide-up
      motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:bottom-5
      contrast-more:border-2 contrast-more:border-current
      sm:w-[calc(100vw-24px)] sm:bottom-[calc(1rem+env(safe-area-inset-bottom))]
      ${showToast ? 'bottom-5' : '-bottom-[100px]'}
    `.trim().replace(/\s+/g, ' ')}>
      <div className="flex items-center gap-3 sm:flex-wrap">
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-lg flex items-center justify-center text-white sm:w-9 sm:h-9">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"
                  fill="currentColor" opacity="0.3"/>
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 12l2 2 4-4"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="flex-1 min-w-0 sm:flex-[1_1_calc(100%-100px)]">
          <div className="text-base font-semibold text-gray-900 mb-0.5">Install The Shadium</div>
          <div className="text-sm text-gray-600 leading-snug">
            Quick access to shade calculations, offline support, and faster loading
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 sm:ml-12">
          <button
            className="bg-primary-700 text-white border-0 rounded-md py-2 px-4 text-sm font-semibold cursor-pointer transition-all whitespace-nowrap hover:bg-primary-800 hover:-translate-y-px hover:shadow-[0_2px_8px_rgba(37,99,235,0.3)] disabled:opacity-70 disabled:cursor-not-allowed contrast-more:border-2 contrast-more:border-current"
            onClick={handleInstall}
            disabled={isInstalling}
          >
            {isInstalling ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white rounded-full animate-pulse-install motion-reduce:animate-none motion-reduce:opacity-70"></span>
                Installing...
              </span>
            ) : (
              'Install'
            )}
          </button>

          <button
            className="bg-transparent border-0 p-2 cursor-pointer text-gray-500 transition-all rounded-md flex items-center justify-center hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleDismiss}
            aria-label="Dismiss"
            disabled={isInstalling}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};