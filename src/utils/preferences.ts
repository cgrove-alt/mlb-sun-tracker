import { SunFilterCriteria } from '../components/EnhancedSunFilter';

export type ShadePreference = 'love-sun' | 'prefer-sun' | 'neutral' | 'prefer-shade' | 'need-shade';

export interface UserPreferences {
  // Existing preferences
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

  // New shade/comfort preferences
  shadePreference?: ShadePreference;
  defaultGameTime?: string; // e.g., "13:00", "19:00"
  weatherSensitivity?: 'low' | 'medium' | 'high';

  // Favorites
  favoriteTeams?: string[]; // Team IDs
  favoriteStadiums?: string[]; // Stadium IDs
  recentStadiums?: string[]; // Recently viewed stadiums (max 5)
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
  },

  // Add a stadium to favorites
  addFavoriteStadium(stadiumId: string): void {
    const prefs = this.load();
    const favorites = prefs.favoriteStadiums || [];
    if (!favorites.includes(stadiumId)) {
      favorites.push(stadiumId);
      this.update('favoriteStadiums', favorites);
    }
  },

  // Remove a stadium from favorites
  removeFavoriteStadium(stadiumId: string): void {
    const prefs = this.load();
    const favorites = prefs.favoriteStadiums || [];
    const updated = favorites.filter(id => id !== stadiumId);
    this.update('favoriteStadiums', updated);
  },

  // Check if stadium is a favorite
  isFavoriteStadium(stadiumId: string): boolean {
    const prefs = this.load();
    return (prefs.favoriteStadiums || []).includes(stadiumId);
  },

  // Add a team to favorites
  addFavoriteTeam(teamId: string): void {
    const prefs = this.load();
    const favorites = prefs.favoriteTeams || [];
    if (!favorites.includes(teamId)) {
      favorites.push(teamId);
      this.update('favoriteTeams', favorites);
    }
  },

  // Remove a team from favorites
  removeFavoriteTeam(teamId: string): void {
    const prefs = this.load();
    const favorites = prefs.favoriteTeams || [];
    const updated = favorites.filter(id => id !== teamId);
    this.update('favoriteTeams', updated);
  },

  // Add to recent stadiums (keeps max 5)
  addRecentStadium(stadiumId: string): void {
    const prefs = this.load();
    let recent = prefs.recentStadiums || [];
    // Remove if already exists to move to front
    recent = recent.filter(id => id !== stadiumId);
    // Add to front
    recent.unshift(stadiumId);
    // Keep only 5
    recent = recent.slice(0, 5);
    this.update('recentStadiums', recent);
  },

  // Get shade preference with default
  getShadePreference(): ShadePreference {
    return this.get('shadePreference', 'neutral');
  },

  // Set shade preference
  setShadePreference(pref: ShadePreference): void {
    this.update('shadePreference', pref);
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