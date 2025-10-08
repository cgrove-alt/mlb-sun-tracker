'use client';

import React, { useState } from 'react';
import {
  exportUserData,
  downloadDataAsFile,
  logPrivacyRequest,
  UserDataReport,
  collectAllUserData
} from '../utils/dataManagement';

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
    <div className="my-5">
      <div className="flex flex-col gap-3 mb-5">
        <label className="flex items-start p-3 border-2 border-gray-200 rounded-lg cursor-pointer transition-all hover:border-blue-500 hover:bg-[rgba(33,150,243,0.05)]">
          <input
            type="radio"
            name="exportFormat"
            value="json"
            checked={exportFormat === 'json'}
            onChange={(e) => setExportFormat(e.target.value as 'json')}
            disabled={exporting}
            className="mr-3 mt-1"
          />
          <span className="flex flex-col gap-1">
            <strong className="text-base text-neutral-800">JSON</strong>
            <small className="text-[0.85rem] text-gray-600">Machine-readable format for data portability</small>
          </span>
        </label>

        <label className="flex items-start p-3 border-2 border-gray-200 rounded-lg cursor-pointer transition-all hover:border-blue-500 hover:bg-[rgba(33,150,243,0.05)]">
          <input
            type="radio"
            name="exportFormat"
            value="html"
            checked={exportFormat === 'html'}
            onChange={(e) => setExportFormat(e.target.value as 'html')}
            disabled={exporting}
            className="mr-3 mt-1"
          />
          <span className="flex flex-col gap-1">
            <strong className="text-base text-neutral-800">HTML Report</strong>
            <small className="text-[0.85rem] text-gray-600">Human-readable report for viewing</small>
          </span>
        </label>
      </div>

      <button
        onClick={handleExport}
        disabled={exporting}
        className="w-full px-6 py-3.5 bg-[linear-gradient(135deg,#2196f3_0%,#1976d2_100%)] text-white border-0 rounded-lg text-lg font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:bg-[linear-gradient(135deg,#1976d2_0%,#1565c0_100%)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(33,150,243,0.3)]"
      >
        {exporting ? (
          <>
            <span className="w-6 h-6 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></span>
            Preparing Export...
          </>
        ) : (
          <>
            💾 Export My Data as {exportFormat.toUpperCase()}
          </>
        )}
      </button>

      <div className="mt-5 p-4 bg-gray-100 rounded-lg">
        <p className="my-2 text-[0.9rem] text-gray-600">
          <strong>What's included:</strong> All locally stored preferences, settings,
          and usage data from your browser.
        </p>
        <p className="my-2 text-[0.9rem] text-gray-600">
          <strong>Privacy:</strong> This export happens entirely in your browser.
          No data is sent to our servers.
        </p>
      </div>
    </div>
  );
};

export default DataExportButton;