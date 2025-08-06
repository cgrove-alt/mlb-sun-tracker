import React from 'react';
import './InteractiveEmptyStates.css';

interface EmptyStateProps {
  variant: 'no-stadium' | 'no-game' | 'no-results' | 'error' | 'offline' | 'loading' | 'coming-soon';
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  animated?: boolean;
}

export const InteractiveEmptyState: React.FC<EmptyStateProps> = ({
  variant,
  title,
  description,
  action,
  icon,
  animated = true
}) => {
  const getVariantContent = () => {
    switch (variant) {
      case 'no-stadium':
        return {
          defaultTitle: 'Choose Your Stadium',
          defaultDescription: 'Select a venue to explore sun patterns and find the perfect shaded seats',
          defaultIcon: (
            <svg className="empty-state__icon" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" opacity="0.2"/>
              <path d="M60 120 L60 80 L100 60 L140 80 L140 120 L100 140 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
              <circle cx="100" cy="60" r="8" fill="currentColor"/>
              <circle cx="60" cy="80" r="8" fill="currentColor"/>
              <circle cx="140" cy="80" r="8" fill="currentColor"/>
              <circle cx="60" cy="120" r="8" fill="currentColor"/>
              <circle cx="140" cy="120" r="8" fill="currentColor"/>
              <circle cx="100" cy="140" r="8" fill="currentColor"/>
              {animated && (
                <>
                  <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="2" className="animate-pulse"/>
                  <path d="M85 100 L95 110 L115 90" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="animate-draw"/>
                </>
              )}
            </svg>
          )
        };
      
      case 'no-game':
        return {
          defaultTitle: 'Select Game Time',
          defaultDescription: 'Choose a game or set a custom date and time to calculate sun exposure',
          defaultIcon: (
            <svg className="empty-state__icon" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" opacity="0.2"/>
              <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
              <path d="M100 70 L100 100 L120 120" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              {animated && (
                <>
                  <path d="M100 40 L100 50" stroke="currentColor" strokeWidth="2" className="animate-tick"/>
                  <path d="M140 60 L134 66" stroke="currentColor" strokeWidth="2" className="animate-tick" style={{animationDelay: '0.1s'}}/>
                  <path d="M160 100 L150 100" stroke="currentColor" strokeWidth="2" className="animate-tick" style={{animationDelay: '0.2s'}}/>
                  <path d="M140 140 L134 134" stroke="currentColor" strokeWidth="2" className="animate-tick" style={{animationDelay: '0.3s'}}/>
                  <path d="M100 160 L100 150" stroke="currentColor" strokeWidth="2" className="animate-tick" style={{animationDelay: '0.4s'}}/>
                  <path d="M60 140 L66 134" stroke="currentColor" strokeWidth="2" className="animate-tick" style={{animationDelay: '0.5s'}}/>
                  <path d="M40 100 L50 100" stroke="currentColor" strokeWidth="2" className="animate-tick" style={{animationDelay: '0.6s'}}/>
                  <path d="M60 60 L66 66" stroke="currentColor" strokeWidth="2" className="animate-tick" style={{animationDelay: '0.7s'}}/>
                </>
              )}
            </svg>
          )
        };
      
      case 'no-results':
        return {
          defaultTitle: 'No Sections Found',
          defaultDescription: 'Try adjusting your filters to see more seating options',
          defaultIcon: (
            <svg className="empty-state__icon" viewBox="0 0 200 200" fill="none">
              <circle cx="80" cy="80" r="50" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
              <path d="M115 115 L140 140" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="140" cy="140" r="8" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2"/>
              {animated && (
                <>
                  <path d="M60 80 L100 80" stroke="currentColor" strokeWidth="2" opacity="0.4" className="animate-fadeInOut"/>
                  <path d="M60 90 L90 90" stroke="currentColor" strokeWidth="2" opacity="0.4" className="animate-fadeInOut" style={{animationDelay: '0.2s'}}/>
                  <path d="M60 70 L85 70" stroke="currentColor" strokeWidth="2" opacity="0.4" className="animate-fadeInOut" style={{animationDelay: '0.4s'}}/>
                </>
              )}
            </svg>
          )
        };
      
      case 'error':
        return {
          defaultTitle: 'Something Went Wrong',
          defaultDescription: 'We encountered an error. Please try again or refresh the page',
          defaultIcon: (
            <svg className="empty-state__icon empty-state__icon--error" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" opacity="0.2"/>
              <path d="M100 60 L100 110" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="100" cy="130" r="4" fill="currentColor"/>
              {animated && (
                <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" fill="none" className="animate-shake"/>
              )}
            </svg>
          )
        };
      
      case 'offline':
        return {
          defaultTitle: 'You\'re Offline',
          defaultDescription: 'Check your internet connection and try again',
          defaultIcon: (
            <svg className="empty-state__icon" viewBox="0 0 200 200" fill="none">
              <path d="M100 140 L60 100 L80 100 L100 120 L120 100 L140 100 Z" fill="currentColor" fillOpacity="0.2"/>
              <path d="M70 70 Q100 50 130 70" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3"/>
              <path d="M80 80 Q100 70 120 80" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3"/>
              <path d="M90 90 Q100 85 110 90" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3"/>
              <line x1="40" y1="40" x2="160" y2="160" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              {animated && (
                <line x1="40" y1="40" x2="160" y2="160" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="animate-draw"/>
              )}
            </svg>
          )
        };
      
      case 'loading':
        return {
          defaultTitle: 'Loading...',
          defaultDescription: 'Getting everything ready for you',
          defaultIcon: (
            <svg className="empty-state__icon animate-spin" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="4" opacity="0.1"/>
              <path d="M100 20 A80 80 0 0 1 180 100" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          )
        };
      
      case 'coming-soon':
        return {
          defaultTitle: 'Coming Soon',
          defaultDescription: 'This feature is under development and will be available soon',
          defaultIcon: (
            <svg className="empty-state__icon" viewBox="0 0 200 200" fill="none">
              <rect x="60" y="80" width="80" height="80" rx="8" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
              <path d="M70 100 L130 100 M70 120 L130 120 M70 140 L110 140" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
              {animated && (
                <>
                  <circle cx="140" cy="80" r="20" fill="currentColor" className="animate-pulse"/>
                  <text x="140" y="87" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">!</text>
                </>
              )}
            </svg>
          )
        };
      
      default:
        return {
          defaultTitle: 'Nothing Here',
          defaultDescription: 'There\'s nothing to display right now',
          defaultIcon: null
        };
    }
  };

  const content = getVariantContent();

  return (
    <div className={`empty-state empty-state--${variant} ${animated ? 'empty-state--animated' : ''}`}>
      <div className="empty-state__content">
        {icon || content.defaultIcon}
        <h3 className="empty-state__title">{title || content.defaultTitle}</h3>
        <p className="empty-state__description">{description || content.defaultDescription}</p>
        {action && <div className="empty-state__action">{action}</div>}
      </div>
    </div>
  );
};

// Skeleton state for loading
export const SkeletonState: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="skeleton-state">
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="skeleton-state__line" style={{ width: `${100 - i * 20}%` }} />
    ))}
  </div>
);

// Animated placeholder
export const AnimatedPlaceholder: React.FC<{ type: 'stadium' | 'calendar' | 'search' }> = ({ type }) => {
  const getPlaceholder = () => {
    switch (type) {
      case 'stadium':
        return (
          <div className="placeholder placeholder--stadium">
            <div className="placeholder__field animate-float" />
            <div className="placeholder__stands">
              <div className="placeholder__stand placeholder__stand--left animate-slideInLeft" />
              <div className="placeholder__stand placeholder__stand--right animate-slideInRight" />
              <div className="placeholder__stand placeholder__stand--top animate-slideInDown" />
            </div>
            <div className="placeholder__sun animate-spin-slow" />
          </div>
        );
      
      case 'calendar':
        return (
          <div className="placeholder placeholder--calendar">
            <div className="placeholder__header" />
            <div className="placeholder__grid">
              {Array.from({ length: 28 }).map((_, i) => (
                <div 
                  key={i} 
                  className="placeholder__day animate-fadeIn" 
                  style={{ animationDelay: `${i * 0.02}s` }}
                />
              ))}
            </div>
          </div>
        );
      
      case 'search':
        return (
          <div className="placeholder placeholder--search">
            <div className="placeholder__searchbar">
              <div className="placeholder__icon animate-pulse" />
              <div className="placeholder__input animate-shimmer" />
            </div>
            <div className="placeholder__results">
              {Array.from({ length: 3 }).map((_, i) => (
                <div 
                  key={i} 
                  className="placeholder__result animate-fadeInUp" 
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return <div className="animated-placeholder">{getPlaceholder()}</div>;
};