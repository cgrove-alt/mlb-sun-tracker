import React, { useState, useEffect } from 'react';
import './FloatingActionButton.css';

interface FABAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  actions?: FABAction[];
  icon?: React.ReactNode;
  label?: string;
  onClick?: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'bottom-center';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  extended?: boolean;
  hideOnScroll?: boolean;
  showAfterScroll?: number;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  actions,
  icon,
  label,
  onClick,
  position = 'bottom-right',
  variant = 'primary',
  size = 'medium',
  extended = false,
  hideOnScroll = false,
  showAfterScroll = 0
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(showAfterScroll === 0);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (!hideOnScroll && showAfterScroll === 0) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show after scroll threshold
      if (showAfterScroll > 0) {
        setIsVisible(currentScrollY > showAfterScroll);
      }
      
      // Hide on scroll down, show on scroll up
      if (hideOnScroll) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hideOnScroll, showAfterScroll, lastScrollY]);

  const handleMainClick = () => {
    if (actions && actions.length > 0) {
      setIsOpen(!isOpen);
    } else if (onClick) {
      onClick();
    }
  };

  const handleActionClick = (action: FABAction) => {
    action.onClick();
    setIsOpen(false);
  };

  const handleBackdropClick = () => {
    setIsOpen(false);
  };

  const defaultIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
    </svg>
  );

  return (
    <>
      {isOpen && <div className="fab-backdrop" onClick={handleBackdropClick} />}
      
      <div className={`fab-container fab-container--${position} ${!isVisible ? 'fab-container--hidden' : ''}`}>
        {actions && actions.length > 0 && (
          <div className={`fab-actions ${isOpen ? 'fab-actions--open' : ''}`}>
            {actions.map((action, index) => (
              <div
                key={action.id}
                className="fab-action"
                style={{ 
                  transitionDelay: isOpen ? `${index * 0.05}s` : `${(actions.length - index) * 0.05}s`,
                  '--action-color': action.color
                } as React.CSSProperties}
              >
                <button
                  className="fab-action__button"
                  onClick={() => handleActionClick(action)}
                  aria-label={action.label}
                >
                  {action.icon}
                </button>
                <span className="fab-action__label">{action.label}</span>
              </div>
            ))}
          </div>
        )}
        
        <button
          className={`fab fab--${variant} fab--${size} ${extended ? 'fab--extended' : ''} ${isOpen ? 'fab--open' : ''}`}
          onClick={handleMainClick}
          aria-label={label || 'Floating action button'}
        >
          <span className="fab__icon">
            {isOpen && actions ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            ) : (
              icon || defaultIcon
            )}
          </span>
          {extended && label && <span className="fab__label">{label}</span>}
        </button>
      </div>
    </>
  );
};

// Speed Dial FAB Component
export const SpeedDialFAB: React.FC<{
  actions: FABAction[];
  position?: 'bottom-right' | 'bottom-left';
}> = ({ actions, position = 'bottom-right' }) => {
  return (
    <FloatingActionButton
      actions={actions}
      position={position}
      variant="primary"
    />
  );
};

// Quick Action FAB Component
export const QuickActionFAB: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success';
}> = ({ icon, label, onClick, variant = 'primary' }) => {
  return (
    <FloatingActionButton
      icon={icon}
      label={label}
      onClick={onClick}
      variant={variant}
      extended
    />
  );
};

// Share FAB Component
export const ShareFAB: React.FC<{
  onShare: () => void;
  position?: 'bottom-right' | 'bottom-left';
}> = ({ onShare, position = 'bottom-right' }) => {
  const shareIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
    </svg>
  );

  return (
    <FloatingActionButton
      icon={shareIcon}
      label="Share"
      onClick={onShare}
      position={position}
      variant="secondary"
      size="medium"
    />
  );
};

// Filter FAB Component
export const FilterFAB: React.FC<{
  onOpenFilter: () => void;
  activeFilters?: number;
}> = ({ onOpenFilter, activeFilters = 0 }) => {
  const filterIcon = (
    <div className="fab-icon-with-badge">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
      </svg>
      {activeFilters > 0 && (
        <span className="fab-badge">{activeFilters}</span>
      )}
    </div>
  );

  return (
    <FloatingActionButton
      icon={filterIcon}
      label="Filters"
      onClick={onOpenFilter}
      position="bottom-center"
      variant="primary"
      extended={activeFilters > 0}
    />
  );
};

// Chat/Help FAB Component
export const HelpFAB: React.FC<{
  onHelp: () => void;
}> = ({ onHelp }) => {
  const helpIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>
    </svg>
  );

  return (
    <FloatingActionButton
      icon={helpIcon}
      label="Help"
      onClick={onHelp}
      position="bottom-left"
      variant="success"
      size="medium"
      showAfterScroll={200}
    />
  );
};