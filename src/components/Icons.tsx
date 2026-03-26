import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

// Sun/Weather Icons
export const SunIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="4" fill={color}/>
    <path d="M12 2v4M12 18v4M22 12h-4M6 12H2M19.07 4.93l-2.83 2.83M7.76 16.24l-2.83 2.83M19.07 19.07l-2.83-2.83M7.76 7.76L4.93 4.93" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const CloudIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" fill={color} opacity="0.3"/>
    <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const PartlyCloudyIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="10" cy="9" r="3" fill={color}/>
    <path d="M10 2v3M10 14v1M17 9h-3M4 9h3M15.54 3.46l-2.12 2.12M7.58 11.42l-1.06 1.06" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M18 13h-.5A6 6 0 1012 22h6a4 4 0 000-8z" fill={color} opacity="0.3"/>
    <path d="M18 13h-.5A6 6 0 1012 22h6a4 4 0 000-8z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const FireIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2C12 2 7 8 7 13C7 16.3137 9.23858 19 12 19C14.7614 19 17 16.3137 17 13C17 8 12 2 12 2Z" fill={color} opacity="0.3"/>
    <path d="M12 2C12 2 7 8 7 13C7 16.3137 9.23858 19 12 19C14.7614 19 17 16.3137 17 13C17 8 12 2 12 2Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 13C12 13 10 15 10 16C10 17.1046 10.8954 18 12 18C13.1046 18 14 17.1046 14 16C14 15 12 13 12 13Z" fill={color}/>
  </svg>
);

export const MoonIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill={color} opacity="0.3"/>
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ShadeIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3 12h18M3 12c0 4.97 4.03 9 9 9s9-4.03 9-9M3 12c0-4.97 4.03-9 9-9s9 4.03 9 9" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 3v18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9V3z" fill={color} opacity="0.3"/>
  </svg>
);

export const RainIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" fill={color} opacity="0.3"/>
    <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 17v2M8 22v2M12 19v2M12 24v2M16 17v2M16 22v2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// UI Icons
export const CalendarIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke={color} strokeWidth="2"/>
    <line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth="2"/>
    <path d="M8 14h8M8 18h5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const StadiumIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <ellipse cx="12" cy="12" rx="10" ry="6" stroke={color} strokeWidth="2"/>
    <path d="M2 12v4c0 3.314 4.477 6 10 6s10-2.686 10-6v-4" stroke={color} strokeWidth="2"/>
    <path d="M7 12v2M12 12v2M17 12v2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const BaseballIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/>
    <path d="M8.5 4.5C8.5 4.5 9.5 8 9.5 12C9.5 16 8.5 19.5 8.5 19.5" stroke={color} strokeWidth="1.5"/>
    <path d="M15.5 4.5C15.5 4.5 14.5 8 14.5 12C14.5 16 15.5 19.5 15.5 19.5" stroke={color} strokeWidth="1.5"/>
  </svg>
);

export const ClockIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/>
    <path d="M12 6v6l4 2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2"/>
    <path d="M21 21l-4.35-4.35" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const ListIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <line x1="8" y1="6" x2="21" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="12" x2="21" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="18" x2="21" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="4" cy="6" r="1" fill={color}/>
    <circle cx="4" cy="12" r="1" fill={color}/>
    <circle cx="4" cy="18" r="1" fill={color}/>
  </svg>
);

export const InfoIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/>
    <circle cx="12" cy="8" r="1" fill={color}/>
    <path d="M12 11v6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const WarningIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="17" r="1" fill={color}/>
  </svg>
);

export const ErrorIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/>
    <path d="M15 9l-6 6M9 9l6 6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const ChartIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="13" width="4" height="8" fill={color} opacity="0.3"/>
    <rect x="10" y="8" width="4" height="13" fill={color} opacity="0.5"/>
    <rect x="17" y="3" width="4" height="18" fill={color}/>
  </svg>
);

export const MoneyIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/>
    <path d="M12 6v12M9 10h6c0.55 0 1 0.45 1 1v0c0 0.55-0.45 1-1 1h-6c-0.55 0-1 0.45-1 1v0c0 0.55 0.45 1 1 1h6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const TicketIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M20 12v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5a2 2 0 102 2h12a2 2 0 102-2z" stroke={color} strokeWidth="2"/>
    <path d="M20 7V5a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 112 2h12a2 2 0 112-2z" stroke={color} strokeWidth="2"/>
    <line x1="12" y1="3" x2="12" y2="7" stroke={color} strokeWidth="1" strokeDasharray="2 2"/>
    <line x1="12" y1="14" x2="12" y2="19" stroke={color} strokeWidth="1" strokeDasharray="2 2"/>
  </svg>
);

export const CrownIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M5 16L3 7l4.5 3L12 4l4.5 6L21 7l-2 9H5z" fill={color} opacity="0.3"/>
    <path d="M5 16L3 7l4.5 3L12 4l4.5 6L21 7l-2 9H5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 16h14v3a1 1 0 01-1 1H6a1 1 0 01-1-1v-3z" fill={color}/>
  </svg>
);

// Level Icons
export const FieldLevelIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="4" y="16" width="16" height="4" fill={color} opacity="0.8"/>
    <path d="M12 16V12" stroke={color} strokeWidth="2"/>
    <circle cx="12" cy="10" r="2" fill={color}/>
  </svg>
);

export const LowerLevelIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="4" y="12" width="16" height="4" fill={color} opacity="0.6"/>
    <rect x="4" y="16" width="16" height="4" fill={color} opacity="0.3"/>
  </svg>
);

export const ClubLevelIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="4" y="8" width="16" height="4" fill={color} opacity="0.8"/>
    <rect x="4" y="12" width="16" height="4" fill={color} opacity="0.4"/>
    <rect x="4" y="16" width="16" height="4" fill={color} opacity="0.2"/>
    <path d="M8 8V6h8v2" stroke={color} strokeWidth="2"/>
  </svg>
);

export const UpperLevelIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="4" y="4" width="16" height="4" fill={color} opacity="0.8"/>
    <rect x="4" y="8" width="16" height="4" fill={color} opacity="0.5"/>
    <rect x="4" y="12" width="16" height="4" fill={color} opacity="0.3"/>
    <rect x="4" y="16" width="16" height="4" fill={color} opacity="0.1"/>
  </svg>
);

// Price tier icons
export const ValuePriceIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <text x="12" y="16" fontSize="14" fontWeight="bold" textAnchor="middle" fill={color}>$</text>
  </svg>
);

export const ModeratePriceIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <text x="12" y="16" fontSize="14" fontWeight="bold" textAnchor="middle" fill={color}>$$</text>
  </svg>
);

export const PremiumPriceIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <text x="12" y="16" fontSize="14" fontWeight="bold" textAnchor="middle" fill={color}>$$$</text>
  </svg>
);

export const LuxuryPriceIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <text x="12" y="16" fontSize="14" fontWeight="bold" textAnchor="middle" fill={color}>$$$$</text>
  </svg>
);

// Weather icons
export const WindIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2C6.48 2 2 6.48 2 12H4C4 7.58 7.58 4 12 4S20 7.58 20 12 16.42 20 12 20C9.45 20 7.19 18.92 5.61 17.23L7.03 15.81C8.23 17.1 9.97 17.9 12 17.9 15.31 17.9 17.9 15.31 17.9 12S15.31 6.1 12 6.1 6.1 8.69 6.1 12H8.2C8.2 9.85 10.01 8.04 12.26 8.04S16.32 9.85 16.32 12.1 14.51 16.16 12.26 16.16C10.81 16.16 9.58 15.35 8.96 14.17H6.68C7.39 16.46 9.58 18.26 12.26 18.26 15.66 18.26 18.42 15.5 18.42 12.1S15.66 5.94 12.26 5.94 6.1 8.7 6.1 12.1" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 16H18M14 16L17 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const DropletIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const MapPinIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke={color} strokeWidth="2"/>
    <circle cx="12" cy="10" r="3" stroke={color} strokeWidth="2"/>
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M6 9l6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ChevronUpIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M18 15l-6-6-6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const FilterIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const UmbrellaIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M22 12A10 10 0 0 0 12 2v0a10 10 0 0 0-10 10h20z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 12v8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 20a2 2 0 0 1-2 2" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const ThermometerIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="9" x2="12" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const QuestionIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="17" r="1" fill={color}/>
  </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2"/>
    <path d="M12 1v6m0 6v10M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h10M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);