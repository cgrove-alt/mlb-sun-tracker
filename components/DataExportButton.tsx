'use client';

import React, { useState } from 'react';
import { 
  exportUserData, 
  downloadDataAsFile, 
  logPrivacyRequest,
  UserDataReport,
  collectAllUserData
} from '../utils/dataManagement';
import styles from '../styles/PrivacyComponents.module.css';

interface DataExportButtonProps {
  dataReport?: UserDataReport | null;
  onExportComplete?: () => void;
}

const DataExportButton: React.FC<DataExportButtonProps> = ({ 
  dataReport: providedReport,
  onExportComplete 
}) => {
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'html'>('json');

  const handleExport = async () => {
    setExporting(true);
    
    try {
      // Use provided report or collect fresh data
      const report = providedReport || await collectAllUserData();
      
      // Generate export based on format
      const exportData = exportUserData(report, exportFormat);
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const filename = `theshadium-data-export-${timestamp}.${exportFormat}`;
      const mimeType = exportFormat === 'json' ? 'application/json' : 'text/html';
      
      // Download the file
      downloadDataAsFile(exportData, filename, mimeType);
      
      // Log the privacy request
      logPrivacyRequest('export', report.requestId);
      
      // Notify completion
      if (onExportComplete) {
        onExportComplete();
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('There was an error exporting your data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className={styles.exportContainer}>
      <div className={styles.formatSelector}>
        <label className={styles.formatLabel}>
          <input
            type="radio"
            name="exportFormat"
            value="json"
            checked={exportFormat === 'json'}
            onChange={(e) => setExportFormat(e.target.value as 'json')}
            disabled={exporting}
          />
          <span className={styles.formatOption}>
            <strong>JSON</strong>
            <small>Machine-readable format for data portability</small>
          </span>
        </label>
        
        <label className={styles.formatLabel}>
          <input
            type="radio"
            name="exportFormat"
            value="html"
            checked={exportFormat === 'html'}
            onChange={(e) => setExportFormat(e.target.value as 'html')}
            disabled={exporting}
          />
          <span className={styles.formatOption}>
            <strong>HTML Report</strong>
            <small>Human-readable report for viewing</small>
          </span>
        </label>
      </div>

      <button
        onClick={handleExport}
        disabled={exporting}
        className={`${styles.exportButton} ${exporting ? styles.loading : ''}`}
      >
        {exporting ? (
          <>
            <span className={styles.spinner}></span>
            Preparing Export...
          </>
        ) : (
          <>
            💾 Export My Data as {exportFormat.toUpperCase()}
          </>
        )}
      </button>

      <div className={styles.exportInfo}>
        <p>
          <strong>What's included:</strong> All locally stored preferences, settings, 
          and usage data from your browser.
        </p>
        <p>
          <strong>Privacy:</strong> This export happens entirely in your browser. 
          No data is sent to our servers.
        </p>
      </div>
    </div>
  );
};

export default DataExportButton;