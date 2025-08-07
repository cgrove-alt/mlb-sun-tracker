// PWA Installation Manager
// Handles PWA install prompts with user-action-based triggering

export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

export interface PWAManager {
  init(): void;
  triggerInstallPrompt(): void;
  cleanup(): void;
  isInstallable(): boolean;
}

class PWAInstallManager implements PWAManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private hasShownPrompt = false;
  private userActionCount = 0;
  private requiredActions = 1; // Show after first shade calculation
  private installPromptCallback: ((prompt: BeforeInstallPromptEvent) => void) | null = null;
  private sessionKey = 'pwa_install_dismissed';
  private installKey = 'pwa_installed';

  constructor() {
    // Check if already installed
    if (this.isStandalone()) {
      sessionStorage.setItem(this.installKey, 'true');
    }
  }

  init(): void {
    // Only initialize if not already installed and not dismissed this session
    if (this.isAlreadyInstalled() || this.isDismissedThisSession()) {
      return;
    }

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt);

    // Listen for app install success
    window.addEventListener('appinstalled', this.handleAppInstalled);

    // Listen for custom events that indicate user engagement
    this.setupUserActionListeners();
  }

  private handleBeforeInstallPrompt = (e: Event): void => {
    // Prevent the default prompt
    e.preventDefault();
    
    // Store the event for later use
    this.deferredPrompt = e as BeforeInstallPromptEvent;
    
    console.log('PWA install prompt deferred, waiting for user action');
  };

  private handleAppInstalled = (): void => {
    console.log('PWA was installed');
    sessionStorage.setItem(this.installKey, 'true');
    this.cleanup();
  };

  private setupUserActionListeners(): void {
    // Listen for shade calculation events
    window.addEventListener('shade-calculation-complete', this.handleUserAction);
    
    // Also listen for other engagement signals
    window.addEventListener('stadium-favorite-added', this.handleUserAction);
    window.addEventListener('game-scheduled', this.handleUserAction);
    window.addEventListener('filter-applied', this.handleUserAction);
  }

  private handleUserAction = (): void => {
    this.userActionCount++;
    
    // Check if we should show the install prompt
    if (
      this.userActionCount >= this.requiredActions &&
      !this.hasShownPrompt &&
      this.deferredPrompt &&
      !this.isDismissedThisSession() &&
      !this.isAlreadyInstalled()
    ) {
      this.triggerInstallPrompt();
    }
  };

  triggerInstallPrompt(): void {
    if (!this.deferredPrompt || this.hasShownPrompt) {
      return;
    }

    this.hasShownPrompt = true;
    
    // Dispatch event to show the toast notification
    window.dispatchEvent(new CustomEvent('show-pwa-install-toast', {
      detail: {
        prompt: this.deferredPrompt,
        onInstall: this.handleInstallAccepted,
        onDismiss: this.handleInstallDismissed
      }
    }));
  }

  private handleInstallAccepted = async (): Promise<void> => {
    if (!this.deferredPrompt) return;

    try {
      // Show the browser's install prompt
      await this.deferredPrompt.prompt();
      
      // Wait for the user's choice
      const { outcome } = await this.deferredPrompt.userChoice;
      
      console.log(`User ${outcome} the PWA install prompt`);
      
      if (outcome === 'accepted') {
        sessionStorage.setItem(this.installKey, 'true');
      } else {
        // User dismissed, don't show again this session
        sessionStorage.setItem(this.sessionKey, 'true');
      }
    } catch (error) {
      console.error('Error showing install prompt:', error);
    } finally {
      this.deferredPrompt = null;
    }
  };

  private handleInstallDismissed = (): void => {
    // User dismissed our toast, don't show again this session
    sessionStorage.setItem(this.sessionKey, 'true');
    this.hasShownPrompt = true;
  };

  cleanup(): void {
    window.removeEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt);
    window.removeEventListener('appinstalled', this.handleAppInstalled);
    window.removeEventListener('shade-calculation-complete', this.handleUserAction);
    window.removeEventListener('stadium-favorite-added', this.handleUserAction);
    window.removeEventListener('game-scheduled', this.handleUserAction);
    window.removeEventListener('filter-applied', this.handleUserAction);
  }

  isInstallable(): boolean {
    return this.deferredPrompt !== null && !this.isAlreadyInstalled();
  }

  private isDismissedThisSession(): boolean {
    return sessionStorage.getItem(this.sessionKey) === 'true';
  }

  private isAlreadyInstalled(): boolean {
    // Check if already installed
    return (
      sessionStorage.getItem(this.installKey) === 'true' ||
      this.isStandalone()
    );
  }

  private isStandalone(): boolean {
    // Check if app is running in standalone mode (already installed)
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://') ||
      window.matchMedia('(display-mode: minimal-ui)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      window.matchMedia('(display-mode: window-controls-overlay)').matches
    );
  }

  // Static method to dispatch shade calculation event
  static notifyShadeCalculation(): void {
    window.dispatchEvent(new CustomEvent('shade-calculation-complete'));
  }

  // Static method to dispatch other engagement events
  static notifyUserEngagement(type: 'favorite' | 'schedule' | 'filter'): void {
    const eventMap = {
      favorite: 'stadium-favorite-added',
      schedule: 'game-scheduled',
      filter: 'filter-applied'
    };
    
    const eventName = eventMap[type];
    if (eventName) {
      window.dispatchEvent(new CustomEvent(eventName));
    }
  }
}

// Export the class for static methods
export { PWAInstallManager };

// Create and export a singleton instance
export const pwaManager = new PWAInstallManager();

// Helper function to check if PWA is supported
export function isPWASupported(): boolean {
  return 'serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window;
}

// Helper function to check if running as installed PWA
export function isRunningAsPWA(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}