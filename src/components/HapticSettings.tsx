import React, { useState, useEffect } from 'react';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import './HapticSettings.css';

interface HapticSettingsProps {
  onClose?: () => void;
}

export const HapticSettings: React.FC<HapticSettingsProps> = ({ onClose }) => {
  const haptic = useHapticFeedback();
  const [enabled, setEnabled] = useState(haptic.isEnabled());
  const [intensity, setIntensity] = useState<'light' | 'medium' | 'heavy'>('medium');

  useEffect(() => {
    // Load saved preferences
    const saved = localStorage.getItem('hapticSettings');
    if (saved) {
      const { enabled: savedEnabled, intensity: savedIntensity } = JSON.parse(saved);
      setEnabled(savedEnabled);
      setIntensity(savedIntensity);
      haptic.setEnabled(savedEnabled);
    }
  }, [haptic]);

  const handleToggle = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    haptic.setEnabled(newEnabled);
    
    // Save preference
    localStorage.setItem('hapticSettings', JSON.stringify({
      enabled: newEnabled,
      intensity
    }));

    // Give feedback on toggle
    if (newEnabled) {
      haptic.success();
    }
  };

  const handleIntensityChange = (newIntensity: 'light' | 'medium' | 'heavy') => {
    setIntensity(newIntensity);
    
    // Save preference
    localStorage.setItem('hapticSettings', JSON.stringify({
      enabled,
      intensity: newIntensity
    }));

    // Give feedback with selected intensity
    haptic[newIntensity]();
  };

  const testPattern = (pattern: keyof typeof haptic) => {
    if (enabled && typeof haptic[pattern] === 'function') {
      (haptic[pattern] as Function)();
    }
  };

  return (
    <div className="haptic-settings">
      <div className="haptic-settings-header">
        <h3>Haptic Feedback Settings</h3>
        {onClose && (
          <button className="close-button" onClick={onClose} aria-label="Close">
            ×
          </button>
        )}
      </div>

      <div className="haptic-settings-content">
        <div className="setting-group">
          <label className="toggle-label">
            <span>Enable Haptic Feedback</span>
            <div className="toggle-switch">
              <input
                type="checkbox"
                checked={enabled}
                onChange={handleToggle}
                aria-label="Toggle haptic feedback"
              />
              <span className="toggle-slider"></span>
            </div>
          </label>
          {!haptic.hasIOSHaptics && (
            <p className="setting-note">
              Your device may have limited haptic support
            </p>
          )}
        </div>

        {enabled && (
          <>
            <div className="setting-group">
              <h4>Intensity</h4>
              <div className="intensity-options">
                {(['light', 'medium', 'heavy'] as const).map(level => (
                  <button
                    key={level}
                    className={`intensity-button ${intensity === level ? 'active' : ''}`}
                    onClick={() => handleIntensityChange(level)}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-group">
              <h4>Test Patterns</h4>
              <div className="test-patterns">
                <button 
                  className="test-button"
                  onClick={() => testPattern('tap')}
                >
                  Tap
                </button>
                <button 
                  className="test-button"
                  onClick={() => testPattern('success')}
                >
                  Success
                </button>
                <button 
                  className="test-button"
                  onClick={() => testPattern('error')}
                >
                  Error
                </button>
                <button 
                  className="test-button"
                  onClick={() => testPattern('swipe')}
                >
                  Swipe
                </button>
              </div>
            </div>

            <div className="setting-group">
              <h4>When to Use Haptics</h4>
              <ul className="haptic-usage-list">
                <li>Button taps and selections</li>
                <li>Swipe gestures and navigation</li>
                <li>Success/error notifications</li>
                <li>Toggle switches and sliders</li>
                <li>Favorite actions</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};