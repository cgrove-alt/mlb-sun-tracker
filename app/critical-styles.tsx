// Critical inline styles for above-the-fold content
export const criticalStyles = `
  /* Minimal critical styles */
  html {
    scroll-behavior: smooth;
  }
  
  /* Reserve space for sticky header to avoid CLS */
  header {
    height: 64px;
  }
  
  /* Loading states */
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
`;

export const CriticalStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: criticalStyles }} />
);