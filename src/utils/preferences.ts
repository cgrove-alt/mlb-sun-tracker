import { SunFilterCriteria } from '../components/EnhancedSunFilter';

export interface UserPreferences {
  selectedStadiumId?: string;
  selectedLeague?: string;
  selectedMiLBLevel?: string;
  filterCriteria?: SunFilterCriteria;
  viewMode?: 'games' | 'custom';
  lastUsedDate?: string;
  lastUsedTime?: string;
  sortBy?: 'name' | 'exposure' | 'level' | 'price';
  sortOrder?: 'asc' | 'desc';
  sectionViewMode?: 'quick' | 'detailed';
}

const PREFERENCES_KEY = 'mlb-sun-tracker-preferences';

export const preferencesStorage = {
  // Load preferences from localStorage
  load(): UserPreferences {
    if (typeof window === 'undefined') {
      return {};
    }
    try {
      const stored = localStorage.getItem(PREFERENCES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load preferences from localStorage:', error);
    }
    return {};
  },

  // Save preferences to localStorage
  save(preferences: UserPreferences): void {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const currentPrefs = this.load();
      const updated = { ...currentPrefs, ...preferences };
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to save preferences to localStorage:', error);
    }
  },

  // Update a specific preference
  update(key: keyof UserPreferences, value: any): void {
    const preferences = this.load();
    preferences[key] = value;
    this.save(preferences);
  },

  // Clear all preferences
  clear(): void {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      localStorage.removeItem(PREFERENCES_KEY);
    } catch (error) {
      console.warn('Failed to clear preferences from localStorage:', error);
    }
  },

  // Get a specific preference with fallback
  get<T>(key: keyof UserPreferences, fallback: T): T {
    const preferences = this.load();
    return preferences[key] !== undefined ? preferences[key] as T : fallback;
  }
};

// Hook for React components to use preferences
export const usePreferences = () => {
  const loadPreferences = () => preferencesStorage.load();
  const savePreferences = (prefs: UserPreferences) => preferencesStorage.save(prefs);
  const updatePreference = (key: keyof UserPreferences, value: any) => preferencesStorage.update(key, value);
  
  return {
    loadPreferences,
    savePreferences,
    updatePreference,
    clearPreferences: preferencesStorage.clear
  };
};