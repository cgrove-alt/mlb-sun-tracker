import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initGA, trackPageView, trackPerformance } from './utils/analytics';

// Initialize Google Analytics
initGA();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Track initial page view
trackPageView(window.location.pathname, document.title);

// Send performance metrics to Google Analytics
reportWebVitals((metric) => {
  trackPerformance(metric.name, metric.value);
});
