'use client';

import React from 'react';
import { RETENTION_POLICIES, formatRetentionPeriod } from '../utils/dataRetention';
import styles from '../styles/Legal.module.css';

export default function DataRetentionInfo() {
  return (
    <div className={styles.retentionInfo}>
      <h3>Data Retention Policies</h3>
      <p className={styles.description}>
        Your data is automatically deleted after these periods to protect your privacy:
      </p>
      
      <div className={styles.retentionGrid}>
        {RETENTION_POLICIES.map((policy, index) => (
          <div key={index} className={styles.retentionCard}>
            <div className={styles.retentionHeader}>
              <h4>{policy.category}</h4>
              <span className={styles.retentionPeriod}>
                {formatRetentionPeriod(policy.retentionDays)}
              </span>
            </div>
            <p className={styles.retentionDescription}>
              {policy.description}
            </p>
            <div className={styles.retentionDetails}>
              <span className={styles.dataCount}>
                {policy.dataKeys.length} data {policy.dataKeys.length === 1 ? 'type' : 'types'}
              </span>
              <span className={styles.storageType}>
                {policy.storageType}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.infoBox}>
        <p>
          <strong>Automatic Cleanup:</strong> Our system automatically removes expired data daily. 
          You can also manually delete all your data at any time using the Delete Data tab.
        </p>
      </div>
    </div>
  );
}