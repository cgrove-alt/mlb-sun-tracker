import React, { useState, useEffect } from 'react';
import './ErrorNotification.css';

export interface ErrorNotificationProps {
  message: string;
  type: 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  message,
  type = 'error',
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '❌';
    }
  };

  return (
    <div 
      className={`error-notification error-notification-${type}`}
      role="alert"
      aria-live="polite"
    >
      <div className="error-notification-content">
        <span className="error-notification-icon">{getIcon()}</span>
        <span className="error-notification-message">{message}</span>
        <button 
          className="error-notification-close"
          onClick={handleClose}
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export interface ErrorContextType {
  showError: (message: string, type?: 'error' | 'warning' | 'info') => void;
  clearError: () => void;
}

export const ErrorContext = React.createContext<ErrorContextType | null>(null);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setError] = useState<{ message: string; type: 'error' | 'warning' | 'info' } | null>(null);

  const showError = (message: string, type: 'error' | 'warning' | 'info' = 'error') => {
    setError({ message, type });
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <ErrorContext.Provider value={{ showError, clearError }}>
      {children}
      {error && (
        <ErrorNotification
          message={error.message}
          type={error.type}
          onClose={clearError}
        />
      )}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = React.useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};