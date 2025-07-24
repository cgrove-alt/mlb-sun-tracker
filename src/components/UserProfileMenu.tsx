import React, { useState, useRef, useEffect } from 'react';
import { useUserProfile } from '../contexts/UserProfileContext';
import { Tooltip } from './Tooltip';
import './UserProfileMenu.css';

export const UserProfileMenu: React.FC = () => {
  const {
    currentProfile,
    allProfiles,
    switchProfile,
    createProfile,
    deleteProfile,
    exportProfile,
    importProfile
  } = useUserProfile();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileEmail, setNewProfileEmail] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuItemsRef = useRef<HTMLElement[]>([]);

  // Get focusable menu items
  const getFocusableItems = () => {
    if (!menuRef.current) return [];
    return Array.from(menuRef.current.querySelectorAll('[role="menuitem"], button, input')) as HTMLElement[];
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    const focusableItems = getFocusableItems();
    
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        setIsMenuOpen(false);
        triggerRef.current?.focus();
        break;
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = activeIndex < focusableItems.length - 1 ? activeIndex + 1 : 0;
        setActiveIndex(nextIndex);
        focusableItems[nextIndex]?.focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = activeIndex > 0 ? activeIndex - 1 : focusableItems.length - 1;
        setActiveIndex(prevIndex);
        focusableItems[prevIndex]?.focus();
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        focusableItems[0]?.focus();
        break;
      case 'End':
        event.preventDefault();
        const lastIndex = focusableItems.length - 1;
        setActiveIndex(lastIndex);
        focusableItems[lastIndex]?.focus();
        break;
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-profile-menu')) {
        setIsMenuOpen(false);
        setActiveIndex(-1);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
        setActiveIndex(-1);
        triggerRef.current?.focus();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isMenuOpen]);

  // Focus management when menu opens
  useEffect(() => {
    if (isMenuOpen) {
      // Focus first menu item after a brief delay
      setTimeout(() => {
        const focusableItems = getFocusableItems();
        if (focusableItems.length > 0) {
          setActiveIndex(0);
          focusableItems[0]?.focus();
        }
      }, 100);
    }
  }, [isMenuOpen]);

  const handleCreateProfile = () => {
    if (newProfileName.trim()) {
      createProfile(newProfileName.trim(), newProfileEmail.trim() || undefined);
      setNewProfileName('');
      setNewProfileEmail('');
      setIsCreatingProfile(false);
      setIsMenuOpen(false);
    }
  };

  const handleExportProfile = () => {
    const profileData = exportProfile();
    if (profileData) {
      const blob = new Blob([profileData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mlb-sun-tracker-profile-${currentProfile?.name.replace(/\s+/g, '-').toLowerCase()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleImportProfile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (importProfile(content)) {
          setIsMenuOpen(false);
        } else {
          alert('Failed to import profile. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!currentProfile) return null;

  return (
    <div className="user-profile-menu">
      <Tooltip content={`Logged in as ${currentProfile.name}`}>
        <button
          ref={triggerRef}
          className="profile-menu-trigger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsMenuOpen(!isMenuOpen);
            }
          }}
          aria-expanded={isMenuOpen}
          aria-haspopup="menu"
          aria-controls="profile-menu"
          id="profile-menu-trigger"
        >
          <div
            className="profile-avatar"
            style={{ backgroundColor: currentProfile.avatarColor }}
          >
            {getInitials(currentProfile.name)}
          </div>
          <span className="profile-name">{currentProfile.name}</span>
          <span className="dropdown-icon" aria-hidden="true">▼</span>
        </button>
      </Tooltip>

      {isMenuOpen && (
        <div 
          ref={menuRef}
          className="profile-menu-dropdown" 
          role="menu"
          id="profile-menu"
          aria-labelledby="profile-menu-trigger"
          onKeyDown={handleKeyDown}
        >
          {/* Current Profile Info */}
          <div className="profile-info">
            <div className="profile-info-header">
              <div
                className="profile-avatar-large"
                style={{ backgroundColor: currentProfile.avatarColor }}
              >
                {getInitials(currentProfile.name)}
              </div>
              <div className="profile-details">
                <div className="profile-name-large">{currentProfile.name}</div>
                {currentProfile.email && (
                  <div className="profile-email">{currentProfile.email}</div>
                )}
                <div className="profile-stats">
                  <span>{currentProfile.stats.stadiumsViewed.length} stadiums viewed</span>
                  <span>{currentProfile.favorites.stadiums.length} favorites</span>
                </div>
              </div>
            </div>
          </div>

          <div className="menu-divider" />

          {/* Profile Switcher */}
          {allProfiles.length > 1 && (
            <>
              <div className="menu-section-title">Switch Profile</div>
              {allProfiles
                .filter(p => p.id !== currentProfile.id)
                .map(profile => (
                  <button
                    key={profile.id}
                    className="menu-item profile-switch-item"
                    onClick={() => {
                      switchProfile(profile.id);
                      setIsMenuOpen(false);
                    }}
                    role="menuitem"
                  >
                    <div
                      className="profile-avatar-small"
                      style={{ backgroundColor: profile.avatarColor }}
                    >
                      {getInitials(profile.name)}
                    </div>
                    <span>{profile.name}</span>
                  </button>
                ))}
              <div className="menu-divider" />
            </>
          )}

          {/* Profile Actions */}
          {isCreatingProfile ? (
            <div className="create-profile-form" role="dialog" aria-labelledby="create-profile-heading">
              <h4 id="create-profile-heading" className="form-heading">Create New Profile</h4>
              <div className="form-field">
                <label htmlFor="profile-name-input" className="form-label">
                  Profile Name *
                </label>
                <input
                  id="profile-name-input"
                  type="text"
                  placeholder="Enter profile name"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateProfile()}
                  autoFocus
                  required
                  aria-describedby="profile-name-help"
                />
                <div id="profile-name-help" className="form-help">
                  This will be displayed as your profile name
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="profile-email-input" className="form-label">
                  Email (Optional)
                </label>
                <input
                  id="profile-email-input"
                  type="email"
                  placeholder="Enter email address"
                  value={newProfileEmail}
                  onChange={(e) => setNewProfileEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateProfile()}
                  aria-describedby="profile-email-help"
                />
                <div id="profile-email-help" className="form-help">
                  Used for profile identification and data export
                </div>
              </div>
              <div className="form-actions">
                <button
                  onClick={handleCreateProfile}
                  disabled={!newProfileName.trim()}
                  className="btn-primary"
                  role="menuitem"
                  aria-describedby="create-btn-help"
                >
                  Create Profile
                </button>
                <div id="create-btn-help" className="sr-only">
                  {!newProfileName.trim() ? 'Profile name is required' : 'Create new profile with entered information'}
                </div>
                <button
                  onClick={() => {
                    setIsCreatingProfile(false);
                    setNewProfileName('');
                    setNewProfileEmail('');
                  }}
                  className="btn-secondary"
                  role="menuitem"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                className="menu-item"
                onClick={() => setIsCreatingProfile(true)}
                role="menuitem"
              >
                <span className="menu-icon">➕</span>
                Create New Profile
              </button>
            </>
          )}

          <button
            className="menu-item"
            onClick={handleExportProfile}
            role="menuitem"
          >
            <span className="menu-icon">💾</span>
            Export Profile
          </button>

          <button
            className="menu-item"
            onClick={() => fileInputRef.current?.click()}
            role="menuitem"
          >
            <span className="menu-icon">📥</span>
            Import Profile
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportProfile}
            style={{ display: 'none' }}
          />

          {allProfiles.length > 1 && (
            <>
              <div className="menu-divider" />
              <button
                className="menu-item menu-item-danger"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete the profile "${currentProfile.name}"?`)) {
                    deleteProfile(currentProfile.id);
                    setIsMenuOpen(false);
                  }
                }}
                role="menuitem"
              >
                <span className="menu-icon">🗑️</span>
                Delete Profile
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};