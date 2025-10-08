import React, { useState, useEffect } from 'react';
import { useHapticFeedback } from '../hooks/useHapticFeedback';

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
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-[400px] mx-auto md:p-5 md:rounded-t-lg md:rounded-b-none md:m-0 md:w-full md:max-w-none">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 m-0">Haptic Feedback Settings</h3>
        {onClose && (
          <button
            className="w-12 h-12 flex items-center justify-center bg-transparent border-0 text-[28px] text-gray-500 cursor-pointer rounded-full transition-all hover:bg-gray-100 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <label className="flex justify-between items-center min-h-[48px] cursor-pointer">
            <span className="text-base text-gray-900 font-medium">Enable Haptic Feedback</span>
            <div className="relative w-[60px] h-8">
              <input
                type="checkbox"
                checked={enabled}
                onChange={handleToggle}
                aria-label="Toggle haptic feedback"
                className="opacity-0 w-0 h-0 peer"
              />
              <span className="absolute cursor-pointer inset-0 bg-gray-300 transition-all rounded-full before:absolute before:content-[''] before:h-6 before:w-6 before:left-1 before:bottom-1 before:bg-white before:transition-all before:rounded-full before:shadow-sm peer-checked:bg-primary-700 peer-checked:before:translate-x-7"></span>
            </div>
          </label>
          {!haptic.hasIOSHaptics && (
            <p className="text-sm text-gray-500 italic m-0">
              Your device may have limited haptic support
            </p>
          )}
        </div>

        {enabled && (
          <>
            <div className="flex flex-col gap-3">
              <h4 className="text-base font-semibold text-gray-700 m-0">Intensity</h4>
              <div className="flex gap-2">
                {(['light', 'medium', 'heavy'] as const).map(level => (
                  <button
                    key={level}
                    className={`
                      flex-1 min-h-[48px] py-3 px-4 border-2 border-transparent rounded-lg text-base font-medium cursor-pointer transition-all
                      ${intensity === level
                        ? 'bg-primary-700 text-white border-primary-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `.trim().replace(/\s+/g, ' ')}
                    onClick={() => handleIntensityChange(level)}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-base font-semibold text-gray-700 m-0">Test Patterns</h4>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
                <button
                  className="min-h-[48px] py-3 px-4 bg-white border-2 border-gray-300 rounded-lg text-base font-medium text-gray-700 cursor-pointer transition-all hover:bg-gray-50 hover:border-primary-700 hover:text-primary-700 active:scale-95"
                  onClick={() => testPattern('tap')}
                >
                  Tap
                </button>
                <button
                  className="min-h-[48px] py-3 px-4 bg-white border-2 border-gray-300 rounded-lg text-base font-medium text-gray-700 cursor-pointer transition-all hover:bg-gray-50 hover:border-primary-700 hover:text-primary-700 active:scale-95"
                  onClick={() => testPattern('success')}
                >
                  Success
                </button>
                <button
                  className="min-h-[48px] py-3 px-4 bg-white border-2 border-gray-300 rounded-lg text-base font-medium text-gray-700 cursor-pointer transition-all hover:bg-gray-50 hover:border-primary-700 hover:text-primary-700 active:scale-95"
                  onClick={() => testPattern('error')}
                >
                  Error
                </button>
                <button
                  className="min-h-[48px] py-3 px-4 bg-white border-2 border-gray-300 rounded-lg text-base font-medium text-gray-700 cursor-pointer transition-all hover:bg-gray-50 hover:border-primary-700 hover:text-primary-700 active:scale-95"
                  onClick={() => testPattern('swipe')}
                >
                  Swipe
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-base font-semibold text-gray-700 m-0">When to Use Haptics</h4>
              <ul className="list-none p-0 m-0 flex flex-col gap-2">
                <li className="relative pl-6 text-sm text-gray-600 leading-normal before:content-['✓'] before:absolute before:left-0 before:text-success before:font-bold">
                  Button taps and selections
                </li>
                <li className="relative pl-6 text-sm text-gray-600 leading-normal before:content-['✓'] before:absolute before:left-0 before:text-success before:font-bold">
                  Swipe gestures and navigation
                </li>
                <li className="relative pl-6 text-sm text-gray-600 leading-normal before:content-['✓'] before:absolute before:left-0 before:text-success before:font-bold">
                  Success/error notifications
                </li>
                <li className="relative pl-6 text-sm text-gray-600 leading-normal before:content-['✓'] before:absolute before:left-0 before:text-success before:font-bold">
                  Toggle switches and sliders
                </li>
                <li className="relative pl-6 text-sm text-gray-600 leading-normal before:content-['✓'] before:absolute before:left-0 before:text-success before:font-bold">
                  Favorite actions
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};