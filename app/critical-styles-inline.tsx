export const CriticalStylesInline = () => {
  // Critical CSS for above-the-fold content
  const criticalCSS = `
    /* Critical reset and base styles */
    *, *::before, *::after {
      box-sizing: border-box;
    }

    html {
      overflow-x: hidden;
      font-size: 16px;
      -webkit-text-size-adjust: 100%;
      scroll-behavior: smooth;
    }

    /* Reserve space for sticky header to avoid CLS */
    header {
      height: 64px;
    }
    
    body {
      margin: 0;
      padding: 0;
      width: 100%;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", sans-serif;
      line-height: 1.5;
      color: #212121;
      background: #ffffff;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Critical layout containers */
    main {
      display: block;
      min-height: 100vh;
    }

    /* Hero section critical styles */
    .hero-section {
      position: relative;
      width: 100%;
      height: 100vh;
      min-height: 600px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hero-content {
      text-align: center;
      color: white;
      padding: 2rem;
      max-width: 800px;
      width: 100%;
      position: relative;
      z-index: 1;
    }

    .hero-headline {
      font-size: clamp(2rem, 5vw, 4rem);
      font-weight: 800;
      margin: 0 0 1.5rem;
      line-height: 1.1;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .hero-subheadline {
      font-size: clamp(1rem, 2.5vw, 1.5rem);
      margin: 0 0 2.5rem;
      opacity: 0.95;
      font-weight: 300;
    }

    .hero-cta-button {
      background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
      color: white;
      border: none;
      padding: 1rem 2.5rem;
      font-size: 1.25rem;
      font-weight: 600;
      border-radius: 50px;
      cursor: pointer;
      box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
      text-transform: uppercase;
      letter-spacing: 1px;
      min-height: 60px;
      touch-action: manipulation;
    }

    /* Screen reader only content */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    /* Loading spinner critical styles */
    .app-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      gap: 1rem;
    }

    .loading-spinner {
      display: inline-block;
      width: 40px;
      height: 40px;
      border: 3px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      border-top-color: #1e40af;
      animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Mobile critical styles */
    @media (max-width: 768px) {
      .hero-content {
        padding: 1.5rem;
      }

      .hero-cta-button {
        padding: 1rem 2rem;
        font-size: 1.1rem;
        min-height: 56px;
        width: 100%;
        max-width: 300px;
      }
    }

    /* Prevent FOUC */
    .app-hidden {
      display: none;
    }

    .app-visible {
      display: block;
    }

    /* Safe area support */
    @supports (padding: env(safe-area-inset-top)) {
      body {
        padding-top: env(safe-area-inset-top);
        padding-left: env(safe-area-inset-left);
        padding-right: env(safe-area-inset-right);
        padding-bottom: env(safe-area-inset-bottom);
      }
    }
  `;

  return (
    <style
      dangerouslySetInnerHTML={{ __html: criticalCSS }}
      data-critical="true"
    />
  );
};