import React, { useState, useEffect } from 'react';
import './StickyNavigation.css';

interface StickyNavigationProps {
  title?: string;
  showProgress?: boolean;
  showBreadcrumbs?: boolean;
  breadcrumbs?: Array<{ label: string; path?: string }>;
  actions?: React.ReactNode;
  transparent?: boolean;
}

export const StickyNavigation: React.FC<StickyNavigationProps> = ({
  title = 'MLB Sun Tracker',
  showProgress = true,
  showBreadcrumbs = false,
  breadcrumbs = [],
  actions,
  transparent = false
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (currentScrollY / scrollHeight) * 100 : 0;
      
      setScrollProgress(progress);
      setIsScrolled(currentScrollY > 10);
      
      // Hide/show navigation based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav 
      className={`sticky-nav ${isScrolled ? 'sticky-nav--scrolled' : ''} ${!isVisible ? 'sticky-nav--hidden' : ''} ${transparent && !isScrolled ? 'sticky-nav--transparent' : ''}`}
    >
      <div className="sticky-nav__container">
        <div className="sticky-nav__content">
          <div className="sticky-nav__left">
            <button className="sticky-nav__menu-btn" aria-label="Menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            
            <h1 className="sticky-nav__title">{title}</h1>
            
            {showBreadcrumbs && breadcrumbs.length > 0 && (
              <nav className="sticky-nav__breadcrumbs" aria-label="Breadcrumb">
                <ol className="breadcrumbs__list">
                  {breadcrumbs.map((crumb, index) => (
                    <li key={index} className="breadcrumbs__item">
                      {index > 0 && <span className="breadcrumbs__separator">/</span>}
                      {crumb.path ? (
                        <a href={crumb.path} className="breadcrumbs__link">
                          {crumb.label}
                        </a>
                      ) : (
                        <span className="breadcrumbs__current" aria-current="page">
                          {crumb.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </div>
          
          <div className="sticky-nav__right">
            {actions}
          </div>
        </div>
      </div>
      
      {showProgress && (
        <div className="sticky-nav__progress">
          <div 
            className="sticky-nav__progress-bar"
            style={{ width: `${scrollProgress}%` }}
            role="progressbar"
            aria-valuenow={scrollProgress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      )}
    </nav>
  );
};

interface ScrollIndicatorProps {
  sections: Array<{ id: string; label: string }>;
  activeSection?: string;
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ 
  sections, 
  activeSection 
}) => {
  const [currentSection, setCurrentSection] = useState(activeSection || '');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="scroll-indicator">
      <div className="scroll-indicator__track">
        {sections.map((section, index) => (
          <button
            key={section.id}
            className={`scroll-indicator__dot ${currentSection === section.id ? 'active' : ''}`}
            onClick={() => scrollToSection(section.id)}
            aria-label={`Go to ${section.label}`}
            title={section.label}
          >
            <span className="scroll-indicator__label">{section.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

interface BackToTopProps {
  threshold?: number;
  smooth?: boolean;
}

export const BackToTop: React.FC<BackToTopProps> = ({ 
  threshold = 300, 
  smooth = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    if (smooth) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  };

  return (
    <button
      className={`back-to-top ${isVisible ? 'back-to-top--visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 4l-8 8h6v8h4v-8h6z"/>
      </svg>
    </button>
  );
};

interface TabNavigationProps {
  tabs: Array<{ id: string; label: string; icon?: React.ReactNode }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default'
}) => {
  return (
    <div className={`tab-nav tab-nav--${variant}`} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-nav__tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`tabpanel-${tab.id}`}
        >
          {tab.icon && <span className="tab-nav__icon">{tab.icon}</span>}
          <span className="tab-nav__label">{tab.label}</span>
        </button>
      ))}
      <div 
        className="tab-nav__indicator"
        style={{
          transform: `translateX(${tabs.findIndex(t => t.id === activeTab) * 100}%)`,
          width: `${100 / tabs.length}%`
        }}
      />
    </div>
  );
};