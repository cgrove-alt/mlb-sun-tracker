import React from 'react';
import './AttributionFooter.css';

interface AttributionFooterProps {
  variant?: 'full' | 'compact';
  showDataSources?: boolean;
  showLegalLinks?: boolean;
  className?: string;
}

export const AttributionFooter: React.FC<AttributionFooterProps> = ({
  variant = 'full',
  showDataSources = true,
  showLegalLinks = true,
  className = ''
}) => {
  const currentYear = new Date().getFullYear();

  if (variant === 'compact') {
    return (
      <footer className={`attribution-footer attribution-footer--compact ${className}`}>
        <div className="attribution-footer__container">
          <p className="attribution-footer__copyright">
            © {currentYear} MLB Sun Tracker | 
            <a href="/terms.html" target="_blank" rel="noopener noreferrer"> Terms</a> | 
            <a href="/privacy.html" target="_blank" rel="noopener noreferrer"> Privacy</a>
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`attribution-footer ${className}`}>
      <div className="attribution-footer__container">
        {/* Data Sources Section */}
        {showDataSources && (
          <div className="attribution-footer__section">
            <h3 className="attribution-footer__title">Data Sources & Attribution</h3>
            <div className="attribution-footer__sources">
              <div className="source-item">
                <h4>Schedule & Game Data</h4>
                <p>
                  Powered by <a href="https://statsapi.mlb.com" target="_blank" rel="noopener noreferrer">MLB Stats API</a>
                </p>
                <p className="source-note">
                  MLB, MiLB, and team data © {currentYear} MLB Advanced Media, L.P.
                </p>
              </div>
              
              <div className="source-item">
                <h4>Weather Information</h4>
                <p>
                  Weather data provided by <a href="https://openweathermap.org" target="_blank" rel="noopener noreferrer">OpenWeather</a>
                </p>
                <p className="source-note">
                  Real-time forecasts and historical weather patterns
                </p>
              </div>
              
              <div className="source-item">
                <h4>Stadium Information</h4>
                <p>Stadium layouts and seating data compiled from public sources</p>
                <p className="source-note">
                  Venue information aggregated from official team websites and fan resources
                </p>
              </div>

              <div className="source-item">
                <h4>Sun Calculations</h4>
                <p>
                  Solar position algorithms based on <a href="https://www.esrl.noaa.gov/gmd/grad/solcalc/calcdetails.html" target="_blank" rel="noopener noreferrer">NOAA Solar Calculator</a>
                </p>
                <p className="source-note">
                  Astronomical calculations for accurate sun tracking
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer Section */}
        <div className="attribution-footer__section">
          <h3 className="attribution-footer__title">Important Disclaimers</h3>
          <div className="attribution-footer__disclaimer">
            <p>
              <strong>Accuracy Notice:</strong> Sun exposure calculations are estimates based on stadium orientation, 
              time of day, and seasonal factors. Actual conditions may vary due to weather, stadium modifications, 
              and other environmental factors.
            </p>
            <p>
              <strong>Affiliation:</strong> MLB Sun Tracker is an independent project and is not affiliated with, 
              endorsed by, or sponsored by Major League Baseball, Minor League Baseball, the National Football League, 
              or any team organizations.
            </p>
            <p>
              <strong>Trademarks:</strong> All team names, logos, and trademarks are property of their respective 
              owners and are used for identification purposes only.
            </p>
            <p>
              <strong>Health Advisory:</strong> Always use appropriate sun protection regardless of seating location. 
              This tool provides estimates only and should not be relied upon as the sole factor in sun safety decisions.
            </p>
          </div>
        </div>

        {/* Technology Credits */}
        <div className="attribution-footer__section">
          <h3 className="attribution-footer__title">Built With</h3>
          <div className="attribution-footer__tech">
            <span className="tech-badge">React</span>
            <span className="tech-badge">TypeScript</span>
            <span className="tech-badge">Next.js</span>
            <span className="tech-badge">Vercel</span>
            <span className="tech-separator">•</span>
            <span className="open-source">
              <a href="https://github.com/cgrove-alt/mlb-sun-tracker" target="_blank" rel="noopener noreferrer">
                Open Source on GitHub
              </a>
            </span>
          </div>
        </div>

        {/* Legal Links Section */}
        {showLegalLinks && (
          <div className="attribution-footer__section attribution-footer__legal">
            <div className="legal-links">
              <a href="/terms.html" target="_blank" rel="noopener noreferrer">Terms of Service</a>
              <span className="separator">•</span>
              <a href="/privacy.html" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
              <span className="separator">•</span>
              <a href="https://github.com/cgrove-alt/mlb-sun-tracker/issues" target="_blank" rel="noopener noreferrer">Report Issue</a>
              <span className="separator">•</span>
              <a href="mailto:support@mlbsuntracker.com">Contact</a>
            </div>
          </div>
        )}

        {/* Copyright */}
        <div className="attribution-footer__copyright">
          <p>© {currentYear} MLB Sun Tracker. All rights reserved.</p>
          <p className="made-with">
            Made with ⚾ for baseball fans everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};

// Mini attribution for embedded use
export const MiniAttribution: React.FC = () => {
  return (
    <div className="mini-attribution">
      <p>
        Data: <a href="https://statsapi.mlb.com" target="_blank" rel="noopener noreferrer">MLB</a> • 
        Weather: <a href="https://openweathermap.org" target="_blank" rel="noopener noreferrer">OpenWeather</a> • 
        <a href="/privacy.html" target="_blank" rel="noopener noreferrer">Privacy</a>
      </p>
    </div>
  );
};

// Inline citation component for specific data points
interface DataCitationProps {
  source: 'mlb' | 'weather' | 'stadium' | 'calculation';
  inline?: boolean;
}

export const DataCitation: React.FC<DataCitationProps> = ({ source, inline = false }) => {
  const citations = {
    mlb: { text: 'MLB Stats API', url: 'https://statsapi.mlb.com' },
    weather: { text: 'OpenWeather', url: 'https://openweathermap.org' },
    stadium: { text: 'Public Sources', url: null },
    calculation: { text: 'NOAA Solar Calculator', url: 'https://www.esrl.noaa.gov/gmd/grad/solcalc/' }
  };

  const citation = citations[source];

  if (inline) {
    return (
      <span className="data-citation data-citation--inline">
        {citation.url ? (
          <a href={citation.url} target="_blank" rel="noopener noreferrer" title={`Source: ${citation.text}`}>
            <sup>[source]</sup>
          </a>
        ) : (
          <sup title={`Source: ${citation.text}`}>[source]</sup>
        )}
      </span>
    );
  }

  return (
    <div className="data-citation">
      <span className="data-citation__label">Source: </span>
      {citation.url ? (
        <a href={citation.url} target="_blank" rel="noopener noreferrer" className="data-citation__link">
          {citation.text}
        </a>
      ) : (
        <span className="data-citation__text">{citation.text}</span>
      )}
    </div>
  );
};