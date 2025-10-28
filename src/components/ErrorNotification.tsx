import React, { useState, useEffect } from 'react';
import { ErrorIcon, WarningIcon, InfoIcon, CloseIcon } from './common/Icons';
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
        return <ErrorIcon size={20} />;
      case 'warning':
        return <WarningIcon size={20} />;
      case 'info':
        return <InfoIcon size={20} />;
      default:
        return <ErrorIcon size={20} />;
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
          <CloseIcon size={16} />
        </button>
      </div>
    </div>
  );
};

export interface ErrorContextType {
  showError: (message: string, type?: 'error' | 'warning' | 'info', duration?: number) => void;
  clearError: () => void;
}

export const ErrorContext = React.createContext<ErrorContextType | null>(null);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setError] = useState<{ message: string; type: 'error' | 'warning' | 'info'; duration?: number } | null>(null);

  const showError = (message: string, type: 'error' | 'warning' | 'info' = 'error', duration?: number) => {
    setError({ message, type, duration });
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
          duration={error.duration}
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