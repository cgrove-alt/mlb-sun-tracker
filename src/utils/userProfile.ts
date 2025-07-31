import { UserPreferences } from './preferences';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatarColor: string;
  createdAt: string;
  lastActive: string;
  preferences: UserPreferences;
  favorites: {
    stadiums: string[];
    games: number[];
  };
  stats: {
    stadiumsViewed: string[];
    totalSearches: number;
    lastSearch?: {
      stadiumId: string;
      date: string;
    };
  };
}

export interface UserProfilesData {
  profiles: UserProfile[];
  activeProfileId: string | null;
}

const PROFILES_KEY = 'mlb-sun-tracker-profiles';
const AVATAR_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
  '#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E', '#6AB04C'
];

export const userProfilesStorage = {
  // Load all profiles
  loadProfiles(): UserProfilesData {
    if (typeof window === 'undefined') {
      return { profiles: [], activeProfileId: null };
    }
    try {
      const stored = localStorage.getItem(PROFILES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load profiles from localStorage:', error);
    }
    return { profiles: [], activeProfileId: null };
  },

  // Save profiles data
  saveProfiles(data: UserProfilesData): void {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save profiles to localStorage:', error);
    }
  },

  // Create a new profile
  createProfile(name: string, email?: string): UserProfile {
    const profile: UserProfile = {
      id: `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      preferences: {},
      favorites: {
        stadiums: [],
        games: []
      },
      stats: {
        stadiumsViewed: [],
        totalSearches: 0
      }
    };

    const data = this.loadProfiles();
    data.profiles.push(profile);
    data.activeProfileId = profile.id;
    this.saveProfiles(data);

    return profile;
  },

  // Get active profile
  getActiveProfile(): UserProfile | null {
    const data = this.loadProfiles();
    if (!data.activeProfileId) return null;
    return data.profiles.find(p => p.id === data.activeProfileId) || null;
  },

  // Set active profile
  setActiveProfile(profileId: string): void {
    const data = this.loadProfiles();
    if (data.profiles.find(p => p.id === profileId)) {
      data.activeProfileId = profileId;
      
      // Update last active time
      const profile = data.profiles.find(p => p.id === profileId);
      if (profile) {
        profile.lastActive = new Date().toISOString();
      }
      
      this.saveProfiles(data);
    }
  },

  // Update profile
  updateProfile(profileId: string, updates: Partial<UserProfile>): void {
    const data = this.loadProfiles();
    const profileIndex = data.profiles.findIndex(p => p.id === profileId);
    
    if (profileIndex !== -1) {
      data.profiles[profileIndex] = {
        ...data.profiles[profileIndex],
        ...updates,
        id: profileId // Ensure ID doesn't change
      };
      this.saveProfiles(data);
    }
  },

  // Delete profile
  deleteProfile(profileId: string): void {
    const data = this.loadProfiles();
    data.profiles = data.profiles.filter(p => p.id !== profileId);
    
    // If deleted profile was active, set another as active
    if (data.activeProfileId === profileId) {
      data.activeProfileId = data.profiles.length > 0 ? data.profiles[0].id : null;
    }
    
    this.saveProfiles(data);
  },

  // Add favorite stadium
  addFavoriteStadium(profileId: string, stadiumId: string): void {
    const data = this.loadProfiles();
    const profile = data.profiles.find(p => p.id === profileId);
    
    if (profile && !profile.favorites.stadiums.includes(stadiumId)) {
      profile.favorites.stadiums.push(stadiumId);
      this.saveProfiles(data);
    }
  },

  // Remove favorite stadium
  removeFavoriteStadium(profileId: string, stadiumId: string): void {
    const data = this.loadProfiles();
    const profile = data.profiles.find(p => p.id === profileId);
    
    if (profile) {
      profile.favorites.stadiums = profile.favorites.stadiums.filter(id => id !== stadiumId);
      this.saveProfiles(data);
    }
  },

  // Update profile stats
  updateStats(profileId: string, stadiumId: string): void {
    const data = this.loadProfiles();
    const profile = data.profiles.find(p => p.id === profileId);
    
    if (profile) {
      // Update stadiums viewed
      if (!profile.stats.stadiumsViewed.includes(stadiumId)) {
        profile.stats.stadiumsViewed.push(stadiumId);
      }
      
      // Update search count
      profile.stats.totalSearches += 1;
      
      // Update last search
      profile.stats.lastSearch = {
        stadiumId,
        date: new Date().toISOString()
      };
      
      this.saveProfiles(data);
    }
  },

  // Export profile data
  exportProfile(profileId: string): string | null {
    const data = this.loadProfiles();
    const profile = data.profiles.find(p => p.id === profileId);
    
    if (profile) {
      return JSON.stringify(profile, null, 2);
    }
    return null;
  },

  // Import profile data
  importProfile(profileData: string): UserProfile | null {
    try {
      const profile = JSON.parse(profileData) as UserProfile;
      
      // Generate new ID to avoid conflicts
      profile.id = `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      profile.createdAt = new Date().toISOString();
      profile.lastActive = new Date().toISOString();
      
      const data = this.loadProfiles();
      data.profiles.push(profile);
      this.saveProfiles(data);
      
      return profile;
    } catch (error) {
      console.error('Failed to import profile:', error);
      return null;
    }
  },

  // Get all profiles
  getAllProfiles(): UserProfile[] {
    const data = this.loadProfiles();
    return data.profiles;
  }
};