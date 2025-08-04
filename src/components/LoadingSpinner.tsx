import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  message,
  fullScreen = false
}) => {
  const spinnerContent = (
    <div className={`loading-spinner-container ${size}`}>
      <div className="loading-spinner-wrapper">
        <svg className="loading-spinner" viewBox="0 0 50 50">
          <circle
            className="loading-spinner-track"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="5"
          />
          <circle
            className="loading-spinner-fill"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="5"
            strokeDasharray="31.415 31.415"
            transform="rotate(-90 25 25)"
          />
        </svg>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loading-spinner-overlay">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};