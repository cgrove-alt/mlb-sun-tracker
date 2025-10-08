import React from 'react';
import { StadiumIcon, BaseballIcon, SearchIcon } from './Icons';
import { LoadingSpinner } from './LoadingSpinner';

interface EmptyStateProps {
  type: 'no-stadium' | 'no-game' | 'no-sections' | 'loading';
  title?: string;
  message?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  message,
  action
}) => {
  const getEmptyStateContent = () => {
    switch (type) {
      case 'no-stadium':
        return {
          icon: <StadiumIcon size={48} color="#9ca3af" />,
          title: title || 'Select a Stadium',
          message: message || 'Choose a stadium to see sun exposure data for upcoming games.',
          bgClass: 'bg-gradient-to-br from-blue-50 to-indigo-100 border border-indigo-200'
        };
      case 'no-game':
        return {
          icon: <BaseballIcon size={48} color="#9ca3af" />,
          title: title || 'Select a Game or Time',
          message: message || 'Choose a game time to see which sections will be in sun or shade.',
          bgClass: 'bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-400'
        };
      case 'no-sections':
        return {
          icon: <SearchIcon size={48} color="#9ca3af" />,
          title: title || 'No Sections Found',
          message: message || 'Try adjusting your filters to see more sections.',
          bgClass: 'bg-gradient-to-br from-purple-50 to-purple-200 border border-purple-400'
        };
      case 'loading':
        return {
          icon: null,
          title: title || 'Loading...',
          message: message || 'Please wait while we calculate sun exposure data.',
          bgClass: 'bg-gradient-to-br from-green-50 to-green-100 border border-green-400'
        };
      default:
        return {
          icon: '🤔',
          title: title || 'Something went wrong',
          message: message || 'Please try again or contact support if the problem persists.',
          bgClass: 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200'
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className={`flex justify-center items-center min-h-[200px] md:min-h-[150px] px-5 py-10 md:px-4 md:py-8 text-center rounded-xl ${content.bgClass}`}>
      <div className="max-w-md">
        <div className="text-5xl md:text-4xl mb-4 opacity-80">{content.icon}</div>
        <h3 className="m-0 mb-3 text-xl md:text-lg font-semibold text-ink-800">{content.title}</h3>
        <p className="m-0 mb-5 text-ink-600 leading-relaxed text-[0.95rem] md:text-sm">{content.message}</p>
        {action && <div className="mt-4">{action}</div>}
        {type === 'loading' && (
          <LoadingSpinner size="medium" />
        )}
      </div>
    </div>
  );
};