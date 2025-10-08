import React, { useState, useEffect } from 'react';
import { ErrorIcon, WarningIcon, InfoIcon, CloseIcon } from './Icons';

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

  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-warning';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-600';
      default:
        return 'bg-red-50 border-red-200 text-red-700';
    }
  };

  return (
    <div
      className={`fixed top-5 right-5 left-5 md:left-auto md:top-5 md:right-5 max-w-md z-[1000] rounded-lg p-4 shadow-lg animate-slide-in ${getTypeStyles()} border`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <span className="text-xl flex-shrink-0">{getIcon()}</span>
        <span className="flex-1 text-sm leading-snug">{message}</span>
        <button
          className="bg-transparent border-0 text-lg cursor-pointer p-2.5 rounded min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation opacity-70 hover:opacity-100 focus:outline focus:outline-2 focus:outline-current focus:outline-offset-2 transition-opacity duration-200"
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