import React from 'react';
import { StadiumIcon, BaseballIcon, SearchIcon } from './Icons';
import { LoadingSpinner } from './LoadingSpinner';
import './EmptyStates.css';

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
          message: message || 'Choose a stadium to see sun exposure data for upcoming games.'
        };
      case 'no-game':
        return {
          icon: <BaseballIcon size={48} color="#9ca3af" />,
          title: title || 'Select a Game or Time',
          message: message || 'Choose a game time to see which sections will be in sun or shade.'
        };
      case 'no-sections':
        return {
          icon: <SearchIcon size={48} color="#9ca3af" />,
          title: title || 'No Sections Found',
          message: message || 'Try adjusting your filters to see more sections.'
        };
      case 'loading':
        return {
          icon: null,
          title: title || 'Loading...',
          message: message || 'Please wait while we calculate sun exposure data.'
        };
      default:
        return {
          icon: '🤔',
          title: title || 'Something went wrong',
          message: message || 'Please try again or contact support if the problem persists.'
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className={`empty-state empty-state-${type}`}>
      <div className="empty-state-content">
        <div className="empty-state-icon">{content.icon}</div>
        <h3 className="empty-state-title">{content.title}</h3>
        <p className="empty-state-message">{content.message}</p>
        {action && <div className="empty-state-action">{action}</div>}
        {type === 'loading' && (
          <LoadingSpinner size="medium" />
        )}
      </div>
    </div>
  );
};