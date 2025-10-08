'use client';

import React from 'react';
import { RETENTION_POLICIES, formatRetentionPeriod } from '../utils/dataRetention';

export default function DataRetentionInfo() {
  return (
    <div className="my-5">
      <h3 className="text-[#2c3e50] mb-3 text-[1.4rem]">Data Retention Policies</h3>
      <p className="text-gray-600 mb-5 text-base">
        Your data is automatically deleted after these periods to protect your privacy:
      </p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 mb-5">
        {RETENTION_POLICIES.map((policy, index) => (
          <div key={index} className="bg-white border border-gray-300 rounded-lg p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
              <h4 className="m-0 text-[#2c3e50] text-[1.1rem]">{policy.category}</h4>
              <span className="bg-green-500 text-white px-3 py-1 rounded-2xl text-[0.85rem] font-semibold">
                {formatRetentionPeriod(policy.retentionDays)}
              </span>
            </div>
            <p className="text-gray-600 text-[0.95rem] mb-3 leading-[1.4]">
              {policy.description}
            </p>
            <div className="flex justify-between items-center text-[0.85rem]">
              <span className="text-gray-400">
                {policy.dataKeys.length} data {policy.dataKeys.length === 1 ? 'type' : 'types'}
              </span>
              <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-mono text-[0.8rem]">
                {policy.storageType}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-5 rounded">
        <p className="my-2 text-[#1565c0]">
          <strong>Automatic Cleanup:</strong> Our system automatically removes expired data daily.
          You can also manually delete all your data at any time using the Delete Data tab.
        </p>
      </div>
    </div>
  );
}