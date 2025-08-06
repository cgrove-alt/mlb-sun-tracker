import { useState, useEffect, createContext, useContext } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface DarkModeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

interface DarkModeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({
  children,
  defaultTheme = 'system',
  storageKey = 'theme-preference'
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    }
    return defaultTheme;
  });

  const [isDark, setIsDark] = useState(false);

  // Determine if dark mode should be active
  useEffect(() => {
    const updateDarkMode = () => {
      let shouldBeDark = false;

      if (theme === 'dark') {
        shouldBeDark = true;
      } else if (theme === 'system') {
        shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      setIsDark(shouldBeDark);

      // Update document attributes
      const root = document.documentElement;
      if (shouldBeDark) {
        root.setAttribute('data-theme', 'dark');
        root.classList.add('dark');
      } else {
        root.setAttribute('data-theme', 'light');
        root.classList.remove('dark');
      }

      // Update meta theme-color
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', shouldBeDark ? '#0F1419' : '#FFFFFF');
      }
    };

    updateDarkMode();

    // Listen for system theme changes
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateDarkMode();
      
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, newTheme);
    }
  };

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('light');
    } else {
      // If system, toggle to opposite of current state
      setTheme(isDark ? 'light' : 'dark');
    }
  };

  return (
    <DarkModeContext.Provider value={{ theme, isDark, setTheme, toggleTheme }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Dark Mode Toggle Component
interface DarkModeToggleProps {
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  variant?: 'switch' | 'button' | 'dropdown';
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  size = 'medium',
  showLabel = false,
  variant = 'switch'
}) => {
  const { theme, isDark, setTheme, toggleTheme } = useDarkMode();

  if (variant === 'switch') {
    return (
      <div className={`dark-mode-toggle dark-mode-toggle--${size}`}>
        {showLabel && (
          <label className="dark-mode-toggle__label">
            Dark Mode
          </label>
        )}
        <button
          className={`dark-mode-toggle__switch ${isDark ? 'active' : ''}`}
          onClick={toggleTheme}
          role="switch"
          aria-checked={isDark}
          aria-label="Toggle dark mode"
        >
          <span className="dark-mode-toggle__thumb">
            {isDark ? '🌙' : '☀️'}
          </span>
        </button>
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <button
        className={`dark-mode-toggle__button dark-mode-toggle__button--${size}`}
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
        {showLabel && (
          <span className="dark-mode-toggle__button-label">
            {isDark ? 'Light' : 'Dark'}
          </span>
        )}
      </button>
    );
  }

  // Dropdown variant
  return (
    <div className="dark-mode-toggle__dropdown">
      <button
        className="dark-mode-toggle__dropdown-trigger"
        aria-label="Theme selector"
        aria-haspopup="true"
      >
        {theme === 'light' && '☀️'}
        {theme === 'dark' && '🌙'}
        {theme === 'system' && '💻'}
        {showLabel && <span>{theme}</span>}
      </button>
      <div className="dark-mode-toggle__dropdown-menu">
        <button
          className={theme === 'light' ? 'active' : ''}
          onClick={() => setTheme('light')}
        >
          ☀️ Light
        </button>
        <button
          className={theme === 'dark' ? 'active' : ''}
          onClick={() => setTheme('dark')}
        >
          🌙 Dark
        </button>
        <button
          className={theme === 'system' ? 'active' : ''}
          onClick={() => setTheme('system')}
        >
          💻 System
        </button>
      </div>
    </div>
  );
};

// Style tag for dark mode toggle (can be moved to separate CSS file)
export const DarkModeStyles = () => (
  <style>{`
    .dark-mode-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .dark-mode-toggle__label {
      font-size: 14px;
      font-weight: 500;
      color: var(--color-gray-700);
    }

    .dark-mode-toggle__switch {
      position: relative;
      width: 52px;
      height: 28px;
      background: var(--color-gray-400);
      border: none;
      border-radius: 999px;
      cursor: pointer;
      transition: background 0.3s ease;
      padding: 2px;
    }

    .dark-mode-toggle__switch.active {
      background: var(--color-primary);
    }

    .dark-mode-toggle__thumb {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 24px;
      height: 24px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
      font-size: 14px;
    }

    .dark-mode-toggle__switch.active .dark-mode-toggle__thumb {
      transform: translateX(24px);
    }

    .dark-mode-toggle__button {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      background: var(--color-gray-100);
      border: 1px solid var(--color-gray-300);
      border-radius: 8px;
      color: var(--color-gray-700);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .dark-mode-toggle__button:hover {
      background: var(--color-gray-200);
      border-color: var(--color-gray-400);
    }

    .dark-mode-toggle__button--small {
      padding: 6px 8px;
      font-size: 12px;
    }

    .dark-mode-toggle__button--large {
      padding: 10px 16px;
      font-size: 16px;
    }

    [data-theme="dark"] .dark-mode-toggle__label {
      color: var(--color-gray-300);
    }

    [data-theme="dark"] .dark-mode-toggle__button {
      background: var(--color-gray-800);
      border-color: var(--color-gray-600);
      color: var(--color-gray-300);
    }

    [data-theme="dark"] .dark-mode-toggle__button:hover {
      background: var(--color-gray-700);
      border-color: var(--color-gray-500);
    }
  `}</style>
);