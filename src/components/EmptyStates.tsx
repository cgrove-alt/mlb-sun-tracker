import React from 'react';
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
          icon: '🏟️',
          title: title || 'Choose Your Stadium',
          message: message || 'Select an MLB stadium to get started with sun exposure analysis.'
        };
      case 'no-game':
        return {
          icon: '⚾',
          title: title || 'Select Game Time',
          message: message || 'Choose a game or set a custom time to see sun analysis.'
        };
      case 'no-sections':
        return {
          icon: '🔍',
          title: title || 'No Sections Found',
          message: message || 'Try adjusting your filters to see more seating options.'
        };
      case 'loading':
        return {
          icon: '⏳',
          title: title || 'Calculating...',
          message: message || 'Analyzing sun exposure for all stadium sections.'
        };
      default:
        return {
          icon: '🤔',
          title: title || 'Something went wrong',
          message: message || 'Please try again.'
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
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>
    </div>
  );
};