// Critical inline styles for above-the-fold content
export const criticalStyles = `
  /* Reset and base styles */
  html {
    scroll-behavior: smooth;
  }
  
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
  }
  
  #root {
    min-height: 100vh;
  }
  
  /* Prevent layout shift for header */
  header {
    height: 64px;
  }
  
  /* Critical button styles */
  button {
    -webkit-user-select: none;
    user-select: none;
    touch-action: manipulation;
  }
  
  /* Loading states */
  .loading-spinner {
    display: inline-block;
    width: 40px;
    height: 40px;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: #2196f3;
    animation: spin 1s ease-in-out infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  /* Mobile-specific critical styles */
  @media (max-width: 768px) {
    body {
      font-size: 16px; /* Prevent zoom on iOS */
      touch-action: pan-y; /* Allow vertical scrolling */
    }
    
    input, select, textarea {
      font-size: 16px; /* Prevent zoom on form focus */
    }
    
    /* Ensure main content is scrollable */
    main {
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
  }
`;

export const CriticalStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: criticalStyles }} />
);