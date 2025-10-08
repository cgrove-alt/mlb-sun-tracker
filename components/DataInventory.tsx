'use client';

import React from 'react';
import { UserDataReport } from '../utils/dataManagement';

interface DataInventoryProps {
  dataReport: UserDataReport | null;
  onRefresh?: () => void;
}

const DataInventory: React.FC<DataInventoryProps> = ({ dataReport, onRefresh }) => {
  if (!dataReport) {
    return (
      <div className="my-5">
        <div className="text-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p>No data inventory available. Click refresh to load your data.</p>
          {onRefresh && (
            <button onClick={onRefresh} className="mt-4 px-6 py-2.5 bg-blue-600 text-white border-0 rounded-lg text-base font-semibold cursor-pointer transition-colors hover:bg-blue-700">
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
    <div className="my-5">
      {/* Summary Card */}
      <div className="bg-white border border-gray-300 rounded-lg p-5 mb-5 shadow-sm">
        <h3>📊 Data Summary</h3>
        <div className="grid grid-cols-1 gap-3 my-5 md:grid-cols-2">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200">
            <span className="font-medium text-gray-700 text-sm">Total Items:</span>
            <span className="font-bold text-blue-600 text-base">{dataReport.summary.totalItems}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200">
            <span className="font-medium text-gray-700 text-sm">Data Size:</span>
            <span className="font-bold text-blue-600 text-base">{formatBytes(dataReport.summary.totalSize)}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200">
            <span className="font-medium text-gray-700 text-sm">Sources:</span>
            <span className="font-bold text-blue-600 text-base">{dataReport.summary.sources.join(', ')}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200">
            <span className="font-medium text-gray-700 text-sm">Last Updated:</span>
            <span className="font-bold text-blue-600 text-base">
              {new Date(dataReport.timestamp).toLocaleString()}
            </span>
          </div>
        </div>
        {onRefresh && (
          <button onClick={onRefresh} className="mt-4 px-6 py-2.5 bg-blue-600 text-white border-0 rounded-lg text-base font-semibold cursor-pointer transition-colors hover:bg-blue-700">
            🔄 Refresh Inventory
          </button>
        )}
      </div>

      {/* Data Categories */}
      {dataReport.categories.map((category, index) => (
        <div key={index} className="bg-white border border-gray-300 rounded-lg p-5 mb-5 shadow-sm">
          <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
            <h3>{category.name}</h3>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wide">{category.source}</span>
          </div>
          <p className="text-gray-600 text-[0.95rem] leading-relaxed mb-4">{category.description}</p>

          {Object.keys(category.data).length > 0 ? (
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-300">Data Key</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b border-gray-300">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(category.data).map(([key, value]) => (
                    <tr key={key} className="border-b border-gray-200 last:border-b-0">
                      <td className="px-4 py-3 font-mono text-sm text-gray-900 align-top bg-gray-50 font-medium">{key}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-700">
                        <pre className="m-0 whitespace-pre-wrap break-words max-w-full">{formatValue(value)}</pre>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-5 bg-gray-50 rounded border border-gray-200 text-gray-500 italic">
              <p>No data stored in this category</p>
            </div>
          )}
        </div>
      ))}

      {/* Privacy Notice */}
      <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded text-[0.9rem] text-blue-900">
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