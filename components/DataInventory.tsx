'use client';

import React from 'react';
import { UserDataReport } from '../utils/dataManagement';
import styles from '../styles/PrivacyComponents.module.css';

interface DataInventoryProps {
  dataReport: UserDataReport | null;
  onRefresh?: () => void;
}

const DataInventory: React.FC<DataInventoryProps> = ({ dataReport, onRefresh }) => {
  if (!dataReport) {
    return (
      <div className={styles.inventoryContainer}>
        <div className={styles.emptyState}>
          <p>No data inventory available. Click refresh to load your data.</p>
          {onRefresh && (
            <button onClick={onRefresh} className={styles.refreshButton}>
              🔄 Refresh Data
            </button>
          )}
        </div>
      </div>
    );
  }

  const formatValue = (value: any): string => {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className={styles.inventoryContainer}>
      {/* Summary Card */}
      <div className={styles.summaryCard}>
        <h3>📊 Data Summary</h3>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Total Items:</span>
            <span className={styles.summaryValue}>{dataReport.summary.totalItems}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Data Size:</span>
            <span className={styles.summaryValue}>{formatBytes(dataReport.summary.totalSize)}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Sources:</span>
            <span className={styles.summaryValue}>{dataReport.summary.sources.join(', ')}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Last Updated:</span>
            <span className={styles.summaryValue}>
              {new Date(dataReport.timestamp).toLocaleString()}
            </span>
          </div>
        </div>
        {onRefresh && (
          <button onClick={onRefresh} className={styles.refreshButton}>
            🔄 Refresh Inventory
          </button>
        )}
      </div>

      {/* Data Categories */}
      {dataReport.categories.map((category, index) => (
        <div key={index} className={styles.categoryCard}>
          <div className={styles.categoryHeader}>
            <h3>{category.name}</h3>
            <span className={styles.categoryBadge}>{category.source}</span>
          </div>
          <p className={styles.categoryDescription}>{category.description}</p>
          
          {Object.keys(category.data).length > 0 ? (
            <div className={styles.dataTable}>
              <table>
                <thead>
                  <tr>
                    <th>Data Key</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(category.data).map(([key, value]) => (
                    <tr key={key}>
                      <td className={styles.dataKey}>{key}</td>
                      <td className={styles.dataValue}>
                        <pre>{formatValue(value)}</pre>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.noData}>
              <p>No data stored in this category</p>
            </div>
          )}
        </div>
      ))}

      {/* Privacy Notice */}
      <div className={styles.privacyNotice}>
        <p>
          <strong>Privacy Note:</strong> This inventory shows all data stored locally in your 
          browser by The Shadium. We do not have access to this data on our servers. All data 
          shown here is stored on your device.
        </p>
      </div>
    </div>
  );
};

export default DataInventory;