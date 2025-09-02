'use client';

import React from 'react';
import { useGlobalPrivacyControl } from '../hooks/useGlobalPrivacyControl';
import styles from '../styles/GPCStatusIndicator.module.css';

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
      <div className={`${styles.compactIndicator} ${className || ''}`}>
        {isGPCEnabled ? (
          <>
            <span className={styles.gpcIcon}>🛡️</span>
            <span className={styles.gpcStatus}>GPC Active</span>
          </>
        ) : (
          <>
            <span className={styles.gpcIcon}>ℹ️</span>
            <span className={styles.gpcStatus}>GPC Available</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`${styles.detailedIndicator} ${className || ''}`}>
      <div className={styles.gpcHeader}>
        <span className={styles.gpcIcon}>
          {isGPCEnabled ? '🛡️' : 'ℹ️'}
        </span>
        <h4>Global Privacy Control</h4>
      </div>
      <div className={styles.gpcBody}>
        {isGPCEnabled ? (
          <>
            <p className={styles.activeStatus}>
              ✓ Your Global Privacy Control signal is <strong>active</strong>
            </p>
            <p className={styles.description}>
              We are honoring your privacy preference. No personal data is being 
              sold or shared, and analytics tracking is disabled.
            </p>
          </>
        ) : (
          <>
            <p className={styles.inactiveStatus}>
              Your browser supports GPC but it is not currently enabled
            </p>
            <p className={styles.description}>
              You can enable Global Privacy Control in your browser settings to 
              automatically communicate your privacy preferences to websites.
            </p>
            <a 
              href="https://globalprivacycontrol.org/#how-to-enable"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.learnMore}
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