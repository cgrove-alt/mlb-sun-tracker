import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, userProfilesStorage } from '../utils/userProfile';
import { UserPreferences, preferencesStorage } from '../utils/preferences';

interface UserProfileContextType {
  currentProfile: UserProfile | null;
  allProfiles: UserProfile[];
  isLoading: boolean;
  createProfile: (name: string, email?: string) => void;
  switchProfile: (profileId: string) => void;
  updateCurrentProfile: (updates: Partial<UserProfile>) => void;
  deleteProfile: (profileId: string) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  addFavoriteStadium: (stadiumId: string) => void;
  removeFavoriteStadium: (stadiumId: string) => void;
  isFavoriteStadium: (stadiumId: string) => boolean;
  trackStadiumView: (stadiumId: string) => void;
  exportProfile: () => string | null;
  importProfile: (profileData: string) => boolean;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

interface UserProfileProviderProps {
  children: ReactNode;
}

export const UserProfileProvider: React.FC<UserProfileProviderProps> = ({ children }) => {
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [allProfiles, setAllProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load profiles on mount
  useEffect(() => {
    loadProfiles();
  }, []);

  // Sync preferences when profile changes
  useEffect(() => {
    if (currentProfile) {
      // Save current profile's preferences to the main preferences storage
      preferencesStorage.save(currentProfile.preferences);
    }
  }, [currentProfile]);

  const loadProfiles = () => {
    setIsLoading(true);
    const data = userProfilesStorage.loadProfiles();
    setAllProfiles(data.profiles);
    
    // Check if there's an active profile
    const activeProfile = userProfilesStorage.getActiveProfile();
    
    if (activeProfile) {
      setCurrentProfile(activeProfile);
    } else if (data.profiles.length === 0) {
      // No profiles exist, create a default one
      const defaultProfile = userProfilesStorage.createProfile('Guest');
      setCurrentProfile(defaultProfile);
      setAllProfiles([defaultProfile]);
    } else {
      // Set the first profile as active
      userProfilesStorage.setActiveProfile(data.profiles[0].id);
      setCurrentProfile(data.profiles[0]);
    }
    
    setIsLoading(false);
  };

  const createProfile = (name: string, email?: string) => {
    const newProfile = userProfilesStorage.createProfile(name, email);
    setCurrentProfile(newProfile);
    setAllProfiles(userProfilesStorage.getAllProfiles());
  };

  const switchProfile = (profileId: string) => {
    userProfilesStorage.setActiveProfile(profileId);
    const profile = userProfilesStorage.getActiveProfile();
    if (profile) {
      setCurrentProfile(profile);
      // Load the profile's preferences
      preferencesStorage.save(profile.preferences);
    }
  };

  const updateCurrentProfile = (updates: Partial<UserProfile>) => {
    if (currentProfile) {
      userProfilesStorage.updateProfile(currentProfile.id, updates);
      const updatedProfile = userProfilesStorage.getActiveProfile();
      if (updatedProfile) {
        setCurrentProfile(updatedProfile);
      }
      setAllProfiles(userProfilesStorage.getAllProfiles());
    }
  };

  const deleteProfile = (profileId: string) => {
    userProfilesStorage.deleteProfile(profileId);
    setAllProfiles(userProfilesStorage.getAllProfiles());
    
    // If deleted the current profile, load the new active one
    if (currentProfile?.id === profileId) {
      const newActiveProfile = userProfilesStorage.getActiveProfile();
      setCurrentProfile(newActiveProfile);
    }
  };

  const updatePreferences = (preferences: Partial<UserPreferences>) => {
    if (currentProfile) {
      const updatedPreferences = { ...currentProfile.preferences, ...preferences };
      updateCurrentProfile({ preferences: updatedPreferences });
    }
  };

  const addFavoriteStadium = (stadiumId: string) => {
    if (currentProfile) {
      userProfilesStorage.addFavoriteStadium(currentProfile.id, stadiumId);
      const updatedProfile = userProfilesStorage.getActiveProfile();
      if (updatedProfile) {
        setCurrentProfile(updatedProfile);
      }
    }
  };

  const removeFavoriteStadium = (stadiumId: string) => {
    if (currentProfile) {
      userProfilesStorage.removeFavoriteStadium(currentProfile.id, stadiumId);
      const updatedProfile = userProfilesStorage.getActiveProfile();
      if (updatedProfile) {
        setCurrentProfile(updatedProfile);
      }
    }
  };

  const isFavoriteStadium = (stadiumId: string): boolean => {
    return currentProfile?.favorites.stadiums.includes(stadiumId) || false;
  };

  const trackStadiumView = (stadiumId: string) => {
    if (currentProfile) {
      userProfilesStorage.updateStats(currentProfile.id, stadiumId);
      const updatedProfile = userProfilesStorage.getActiveProfile();
      if (updatedProfile) {
        setCurrentProfile(updatedProfile);
      }
    }
  };

  const exportProfile = (): string | null => {
    if (currentProfile) {
      return userProfilesStorage.exportProfile(currentProfile.id);
    }
    return null;
  };

  const importProfile = (profileData: string): boolean => {
    const imported = userProfilesStorage.importProfile(profileData);
    if (imported) {
      setAllProfiles(userProfilesStorage.getAllProfiles());
      switchProfile(imported.id);
      return true;
    }
    return false;
  };

  const contextValue: UserProfileContextType = {
    currentProfile,
    allProfiles,
    isLoading,
    createProfile,
    switchProfile,
    updateCurrentProfile,
    deleteProfile,
    updatePreferences,
    addFavoriteStadium,
    removeFavoriteStadium,
    isFavoriteStadium,
    trackStadiumView,
    exportProfile,
    importProfile
  };

  return (
    <UserProfileContext.Provider value={contextValue}>
      {children}
    </UserProfileContext.Provider>
  );
};