import React from 'react';

export type AttributionType = 'mlb' | 'weather' | 'nrel' | 'all';

interface AttributionNoticeProps {
  type: AttributionType;
  className?: string;
  showIcon?: boolean;
  compact?: boolean;
}

export const AttributionNotice: React.FC<AttributionNoticeProps> = ({
  type,
  className = '',
  showIcon = true,
  compact = false
}) => {
  const getAttribution = () => {
    switch (type) {
      case 'mlb':
        return (
          <>
            {showIcon && <span className="attribution-icon">⚾</span>}
            <span className="attribution-text">
              MLB data provided by MLB Advanced Media, L.P. Use of any content is subject to the{' '}
              <a 
                href="http://gdx.mlb.com/components/copyright.txt" 
                target="_blank" 
                rel="noopener noreferrer"
                className="attribution-link"
              >
                terms posted here
              </a>
              .
            </span>
          </>
        );
      
      case 'weather':
        return (
          <>
            {showIcon && <span className="attribution-icon">🌤️</span>}
            <span className="attribution-text">
              Weather data by{' '}
              <a 
                href="https://open-meteo.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="attribution-link"
              >
                Open-Meteo.com
              </a>
            </span>
          </>
        );
      
      case 'nrel':
        return (
          <>
            {showIcon && <span className="attribution-icon">☀️</span>}
            <span className="attribution-text">
              Sun calculations powered by{' '}
              <a 
                href="https://midcdmz.nrel.gov/spa/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="attribution-link"
              >
                NREL Solar Position Algorithm
              </a>
              {' '}(Reda & Andreas, 2003)
            </span>
          </>
        );
      
      case 'all':
        return (
          <div className="attribution-list">
            <div className="attribution-item">
              {showIcon && <span className="attribution-icon">⚾</span>}
              <span className="attribution-text">
                MLB data: MLB Advanced Media, L.P. ({' '}
                <a 
                  href="http://gdx.mlb.com/components/copyright.txt" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="attribution-link"
                >
                  Terms
                </a>
                )
              </span>
            </div>
            <div className="attribution-item">
              {showIcon && <span className="attribution-icon">🌤️</span>}
              <span className="attribution-text">
                Weather:{' '}
                <a 
                  href="https://open-meteo.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="attribution-link"
                >
                  Open-Meteo.com
                </a>
              </span>
            </div>
            <div className="attribution-item">
              {showIcon && <span className="attribution-icon">☀️</span>}
              <span className="attribution-text">
                Sun calculations:{' '}
                <a 
                  href="https://midcdmz.nrel.gov/spa/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="attribution-link"
                >
                  NREL SPA
                </a>
              </span>
            </div>
          </div>
        );
    }
  };

  const baseClass = compact ? 'attribution-notice-compact' : 'attribution-notice';
  
  return (
    <div className={`${baseClass} ${className}`} role="contentinfo">
      <style jsx>{`
        .attribution-notice,
        .attribution-notice-compact {
          font-size: 0.75rem;
          color: #6b7280;
          padding: 0.5rem;
          background: rgba(249, 250, 251, 0.5);
          border-radius: 0.375rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .attribution-notice-compact {
          font-size: 0.7rem;
          padding: 0.25rem 0.5rem;
          background: transparent;
        }
        
        .attribution-icon {
          font-size: 1rem;
          flex-shrink: 0;
        }
        
        .attribution-link {
          color: #3b82f6;
          text-decoration: underline;
          transition: color 0.15s;
        }
        
        .attribution-link:hover {
          color: #2563eb;
        }
        
        .attribution-list {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
          width: 100%;
        }
        
        .attribution-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        @media (min-width: 768px) {
          .attribution-list {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 1rem;
          }
          
          .attribution-item {
            flex: 0 1 auto;
          }
        }
      `}</style>
      {getAttribution()}
    </div>
  );
};

export default AttributionNotice;