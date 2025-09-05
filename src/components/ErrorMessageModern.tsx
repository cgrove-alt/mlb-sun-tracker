import React from 'react';
import { ModernButton } from './ModernButton';

interface ErrorMessageModernProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  variant?: 'warning' | 'error' | 'info';
  fullScreen?: boolean;
}

export const ErrorMessageModern: React.FC<ErrorMessageModernProps> = ({
  title,
  message,
  onRetry,
  variant = 'error',
  fullScreen = false
}) => {
  const variantStyles = {
    warning: {
      bg: 'bg-gradient-to-r from-amber-50 to-yellow-50',
      border: 'border-amber-200',
      icon: '⚠️',
      titleColor: 'text-amber-900',
      textColor: 'text-amber-700'
    },
    error: {
      bg: 'bg-gradient-to-r from-red-50 to-pink-50',
      border: 'border-red-200',
      icon: '❌',
      titleColor: 'text-red-900',
      textColor: 'text-red-700'
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-50 to-cyan-50',
      border: 'border-blue-200',
      icon: 'ℹ️',
      titleColor: 'text-blue-900',
      textColor: 'text-blue-700'
    }
  };

  const style = variantStyles[variant];

  const errorContent = (
    <div className={`${style.bg} ${style.border} border-2 rounded-xl p-6 shadow-lg backdrop-blur-sm`}>
      <div className="flex items-start gap-4">
        <span className="text-2xl flex-shrink-0" role="img" aria-label={variant}>
          {style.icon}
        </span>
        <div className="flex-1">
          {title && (
            <h3 className={`font-semibold text-lg mb-2 ${style.titleColor}`}>
              {title}
            </h3>
          )}
          <p className={`${style.textColor} mb-4`}>
            {message}
          </p>
          {onRetry && (
            <ModernButton
              onClick={onRetry}
              variant={variant === 'error' ? 'danger' : 'primary'}
              size="sm"
            >
              Try Again
            </ModernButton>
          )}
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm">
        <div className="max-w-md w-full">
          {errorContent}
        </div>
      </div>
    );
  }

  return errorContent;
};

export default React.memo(ErrorMessageModern);