// CSS Loading Optimization Utilities

export class CSSLoader {
  private static loadedCSS = new Set<string>();
  private static cssQueue: Array<{ href: string; priority: number }> = [];
  private static isLoading = false;

  // Load CSS with priority
  static async loadCSS(href: string, priority: number = 0): Promise<void> {
    if (this.loadedCSS.has(href)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      // Check if already in document
      const existing = document.querySelector(`link[href="${href}"]`);
      if (existing) {
        this.loadedCSS.add(href);
        resolve();
        return;
      }

      // Create link element
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.crossOrigin = 'anonymous';

      // Set loading priority
      if (priority > 0) {
        link.setAttribute('fetchpriority', 'high');
      }

      link.onload = () => {
        this.loadedCSS.add(href);
        resolve();
      };

      link.onerror = () => {
        reject(new Error(`Failed to load CSS: ${href}`));
      };

      // Insert based on priority
      if (priority > 0) {
        // High priority - insert at beginning
        const firstLink = document.head.querySelector('link[rel="stylesheet"]');
        if (firstLink) {
          document.head.insertBefore(link, firstLink);
        } else {
          document.head.appendChild(link);
        }
      } else {
        // Normal priority - append at end
        document.head.appendChild(link);
      }
    });
  }

  // Preload CSS without applying it
  static preloadCSS(href: string): void {
    if (document.querySelector(`link[href="${href}"][rel="preload"]`)) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }

  // Load CSS in idle time
  static loadCSSWhenIdle(href: string): void {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.loadCSS(href, 0);
      }, { timeout: 2000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        this.loadCSS(href, 0);
      }, 100);
    }
  }

  // Queue CSS loading to prevent blocking
  static queueCSS(href: string, priority: number = 0): void {
    this.cssQueue.push({ href, priority });
    this.cssQueue.sort((a, b) => b.priority - a.priority);
    
    if (!this.isLoading) {
      this.processQueue();
    }
  }

  private static async processQueue(): Promise<void> {
    if (this.cssQueue.length === 0) {
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    const { href, priority } = this.cssQueue.shift()!;
    
    try {
      await this.loadCSS(href, priority);
    } catch (error) {
      console.error('CSS loading error:', error);
    }

    // Continue processing queue
    this.processQueue();
  }

  // Optimize CSS delivery for mobile
  static optimizeForMobile(): void {
    // Get viewport width
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Defer non-critical CSS on mobile
      const nonCriticalSelectors = [
        'link[href*="WebGL"]',
        'link[href*="3D"]',
        'link[href*="animation"]',
      ];

      nonCriticalSelectors.forEach(selector => {
        const links = document.querySelectorAll(selector);
        links.forEach((link: Element) => {
          link.setAttribute('media', 'print');
          link.addEventListener('load', () => {
            link.setAttribute('media', 'all');
          });
        });
      });
    }
  }

  // Remove unused CSS (for dynamic content)
  static removeUnusedCSS(href: string): void {
    const link = document.querySelector(`link[href="${href}"]`);
    if (link) {
      link.remove();
      this.loadedCSS.delete(href);
    }
  }
}

// Initialize on page load
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    CSSLoader.optimizeForMobile();
  });
}