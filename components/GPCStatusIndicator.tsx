'use client';

import React from 'react';
import { useGlobalPrivacyControl } from '../hooks/useGlobalPrivacyControl';

interface GPCStatusIndicatorProps {
  variant?: 'compact' | 'detailed';
  className?: string;
}

const GPCStatusIndicator: React.FC<GPCStatusIndicatorProps> = ({ 
  variant = 'compact',
  className 
}) => {
  const { isGPCEnabled, isGPCSupported } = useGlobalPrivacyControl();

  // Don't show anything if GPC is not supported
  if (!isGPCSupported) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 bg-green-600/10 dark:bg-green-600/15 border border-green-600/30 dark:border-green-600/40 rounded-full text-[0.85rem] text-green-800 dark:text-green-400 sm:text-[0.8rem] sm:px-2.5 ${className || ''}`}>
        {isGPCEnabled ? (
          <>
            <span className="text-base leading-none sm:text-[0.9rem]">🛡️</span>
            <span className="font-medium">GPC Active</span>
          </>
        ) : (
          <>
            <span className="text-base leading-none sm:text-[0.9rem]">ℹ️</span>
            <span className="font-medium">GPC Available</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-4 my-4 sm:p-3 sm:my-3 print:hidden ${className || ''}`}>
      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-base leading-none sm:text-[0.9rem]">
          {isGPCEnabled ? '🛡️' : 'ℹ️'}
        </span>
        <h4 className="m-0 text-[1.1rem] text-neutral-800 dark:text-white sm:text-base">Global Privacy Control</h4>
      </div>
      <div className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
        {isGPCEnabled ? (
          <>
            <p className="my-2 text-[0.95rem] text-green-700 dark:text-green-400 font-medium sm:text-[0.9rem]">
              ✓ Your Global Privacy Control signal is <strong className="text-green-900 dark:text-green-500 uppercase text-[0.9rem]">active</strong>
            </p>
            <p className="mt-2 text-neutral-600 dark:text-neutral-500 text-[0.9rem] sm:text-[0.85rem]">
              We are honoring your privacy preference. No personal data is being
              sold or shared, and analytics tracking is disabled.
            </p>
          </>
        ) : (
          <>
            <p className="my-2 text-[0.95rem] text-neutral-600 dark:text-neutral-500 sm:text-[0.9rem]">
              Your browser supports GPC but it is not currently enabled
            </p>
            <p className="mt-2 text-neutral-600 dark:text-neutral-500 text-[0.9rem] sm:text-[0.85rem]">
              You can enable Global Privacy Control in your browser settings to
              automatically communicate your privacy preferences to websites.
            </p>
            <a
              href="https://globalprivacycontrol.org/#how-to-enable"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-blue-500 dark:text-sky-400 font-medium text-[0.9rem] transition-colors hover:text-blue-700 dark:hover:text-sky-300 hover:underline"
            >
              Learn how to enable GPC →
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default GPCStatusIndicator;