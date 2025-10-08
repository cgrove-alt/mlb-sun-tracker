import React from 'react';

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
  const sizeClasses = {
    small: { container: 'p-2.5 gap-2', spinner: 'w-6 h-6', message: 'text-xs' },
    medium: { container: 'p-5 gap-4', spinner: 'w-10 h-10', message: 'text-sm' },
    large: { container: 'p-10 gap-6', spinner: 'w-15 h-15', message: 'text-base' },
  };

  const { container, spinner, message: messageSize } = sizeClasses[size];

  const spinnerContent = (
    <div className={`flex flex-col items-center justify-center ${container}`}>
      <div className="relative">
        <svg className={`${spinner} animate-pulse-spinner`} viewBox="0 0 50 50">
          <circle
            className="stroke-gray-200"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="5"
          />
          <circle
            className="stroke-indigo-500 animate-dash"
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="31.415 31.415"
            transform="rotate(-90 25 25)"
          />
        </svg>
      </div>
      {message && <p className={`m-0 text-ink-500 ${messageSize} text-center`}>{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/90 flex items-center justify-center z-[9999]">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};