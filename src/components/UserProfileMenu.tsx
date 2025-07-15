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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-profile-menu')) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
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
          className="profile-menu-trigger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-haspopup="menu"
        >
          <div
            className="profile-avatar"
            style={{ backgroundColor: currentProfile.avatarColor }}
          >
            {getInitials(currentProfile.name)}
          </div>
          <span className="profile-name">{currentProfile.name}</span>
          <span className="dropdown-icon">▼</span>
        </button>
      </Tooltip>

      {isMenuOpen && (
        <div className="profile-menu-dropdown" role="menu">
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
            <div className="create-profile-form">
              <input
                type="text"
                placeholder="Profile name"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateProfile()}
                autoFocus
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={newProfileEmail}
                onChange={(e) => setNewProfileEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateProfile()}
              />
              <div className="form-actions">
                <button
                  onClick={handleCreateProfile}
                  disabled={!newProfileName.trim()}
                  className="btn-primary"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setIsCreatingProfile(false);
                    setNewProfileName('');
                    setNewProfileEmail('');
                  }}
                  className="btn-secondary"
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