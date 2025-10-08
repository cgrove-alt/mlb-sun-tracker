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

// SVG Illustration Components
const StadiumIllustration = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="50" fill="#f3f4f6" opacity="0.5"/>
    <path d="M30 55 L30 75 L50 80 L50 60 Z" fill="#e5e7eb"/>
    <path d="M50 60 L50 80 L70 80 L70 60 Z" fill="#d1d5db"/>
    <path d="M70 60 L70 80 L90 75 L90 55 Z" fill="#e5e7eb"/>
    <ellipse cx="60" cy="60" rx="25" ry="12" fill="#34d399" opacity="0.3"/>
    <circle cx="75" cy="35" r="15" fill="#fbbf24" opacity="0.6">
      <animate attributeName="opacity" values="0.6;0.8;0.6" dur="2s" repeatCount="indefinite"/>
    </circle>
  </svg>
);

const GameIllustration = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="50" fill="#f3f4f6" opacity="0.5"/>
    <circle cx="60" cy="60" r="25" fill="white" stroke="#d1d5db" strokeWidth="2"/>
    <path d="M45 60 Q52 48, 60 60 T75 60" stroke="#ef4444" strokeWidth="2" fill="none"/>
    <path d="M60 45 Q48 52, 60 60 T60 75" stroke="#ef4444" strokeWidth="2" fill="none"/>
    <circle cx="60" cy="60" r="3" fill="#ef4444"/>
    <path d="M35 70 L35 75 Q60 85, 85 75 L85 70" stroke="#9ca3af" strokeWidth="2" fill="none"/>
    <rect x="40" y="80" width="40" height="8" rx="2" fill="#d1d5db"/>
  </svg>
);

const SearchIllustration = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="50" fill="#f3f4f6" opacity="0.5"/>
    <circle cx="50" cy="50" r="20" fill="none" stroke="#9ca3af" strokeWidth="3"/>
    <line x1="65" y1="65" x2="80" y2="80" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round"/>
    <path d="M30 95 L45 95 M55 95 L70 95 M80 95 L95 95" stroke="#e5e7eb" strokeWidth="3" strokeLinecap="round"/>
    <path d="M30 85 L60 85 M70 85 L95 85" stroke="#e5e7eb" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const SunCalculationIllustration = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="50" fill="#f3f4f6" opacity="0.5"/>
    <circle cx="60" cy="45" r="12" fill="#fbbf24">
      <animate attributeName="r" values="12;14;12" dur="2s" repeatCount="indefinite"/>
    </circle>
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
      const rad = (angle * Math.PI) / 180;
      const x1 = 60 + Math.cos(rad) * 16;
      const y1 = 45 + Math.sin(rad) * 16;
      const x2 = 60 + Math.cos(rad) * 22;
      const y2 = 45 + Math.sin(rad) * 22;
      return (
        <line
          key={angle}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#fbbf24"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />
      );
    })}
    <rect x="30" y="70" width="60" height="20" rx="4" fill="#e5e7eb"/>
    <circle cx="45" cy="80" r="3" fill="#34d399">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="60" cy="80" r="3" fill="#fbbf24">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" begin="0.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="75" cy="80" r="3" fill="#f97316">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" begin="1s" repeatCount="indefinite"/>
    </circle>
  </svg>
);

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
          icon: <StadiumIllustration />,
          title: title || 'Select a Stadium',
          message: message || 'Choose a stadium to see sun exposure data for upcoming games.'
        };
      case 'no-game':
        return {
          icon: <GameIllustration />,
          title: title || 'Select a Game or Time',
          message: message || 'Choose a game time to see which sections will be in sun or shade.'
        };
      case 'no-sections':
        return {
          icon: <SearchIllustration />,
          title: title || 'No Sections Found',
          message: message || 'Try adjusting your filters to see more sections.'
        };
      case 'loading':
        return {
          icon: <SunCalculationIllustration />,
          title: title || 'Calculating Sun Exposure',
          message: message || 'Analyzing shade patterns for your selected time...'
        };
      default:
        return {
          icon: <SearchIllustration />,
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
      </div>
    </div>
  );
};