import React from 'react';
import { useTranslation } from '../i18n/i18nContext';
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
  const { t } = useTranslation();
  const getEmptyStateContent = () => {
    switch (type) {
      case 'no-stadium':
        return {
          icon: '🏟️',
          title: title || t('emptyStates.noStadium.title'),
          message: message || t('emptyStates.noStadium.message')
        };
      case 'no-game':
        return {
          icon: '⚾',
          title: title || t('emptyStates.noGame.title'),
          message: message || t('emptyStates.noGame.message')
        };
      case 'no-sections':
        return {
          icon: '🔍',
          title: title || t('emptyStates.noSections.title'),
          message: message || t('emptyStates.noSections.message')
        };
      case 'loading':
        return {
          icon: '⏳',
          title: title || t('emptyStates.loading.title'),
          message: message || t('emptyStates.loading.message')
        };
      default:
        return {
          icon: '🤔',
          title: title || t('emptyStates.error.title'),
          message: message || t('emptyStates.error.message')
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