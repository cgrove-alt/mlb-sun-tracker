import React, { useState, useEffect } from 'react';
import { BeforeInstallPromptEvent } from '../utils/pwa';
import './PWAInstallToast.css';

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
    <div className={`pwa-install-toast ${showToast ? 'show' : ''}`}>
      <div className="toast-content">
        <div className="toast-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" 
                  fill="currentColor" opacity="0.3"/>
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 12l2 2 4-4" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <div className="toast-message">
          <div className="toast-title">Install The Shadium</div>
          <div className="toast-description">
            Quick access to shade calculations, offline support, and faster loading
          </div>
        </div>
        
        <div className="toast-actions">
          <button 
            className="toast-action-install"
            onClick={handleInstall}
            disabled={isInstalling}
          >
            {isInstalling ? (
              <span className="installing">
                <span className="spinner"></span>
                Installing...
              </span>
            ) : (
              'Install'
            )}
          </button>
          
          <button 
            className="toast-action-dismiss"
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