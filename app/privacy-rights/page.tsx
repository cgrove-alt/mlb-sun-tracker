'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DataExportButton from '../../components/DataExportButton';
import DataDeletionButton from '../../components/DataDeletionButton';
import DataInventory from '../../components/DataInventory';
import GoogleAnalyticsOptOut from '../../components/GoogleAnalyticsOptOut';
import DataRetentionInfo from '../../components/DataRetentionInfo';
import { collectAllUserData, UserDataReport } from '../../utils/dataManagement';
import { initializeDataRetention } from '../../utils/dataRetention';

export default function PrivacyRightsPage() {
  const [activeTab, setActiveTab] = useState<'export' | 'delete' | 'inventory' | 'analytics' | 'retention'>('inventory');
  const [dataReport, setDataReport] = useState<UserDataReport | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDataInventory();
    // Initialize data retention cleanup
    initializeDataRetention();
  }, []);

  const loadDataInventory = async () => {
    setLoading(true);
    try {
      const report = await collectAllUserData();
      setDataReport(report);
    } catch (error) {
      console.error('Error loading data inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-5 bg-[linear-gradient(135deg,#f5f7fa_0%,#c3cfe2_100%)]">
      <div className="max-w-[900px] mx-auto bg-white rounded-xl p-10 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
        <h1 className="text-[2.5rem] text-[#1a1a1a] mb-2.5 border-b-[3px] border-blue-500 pb-4">Privacy Rights Center</h1>
        <p className="text-gray-600 text-[0.95rem] my-1">Exercise Your Privacy Rights</p>
        <p className="text-gray-600 text-[0.95rem] my-1">Your Data, Your Control</p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-5 rounded">
          <p className="my-2 text-[#1565c0]">
            <strong>Welcome to your Privacy Rights Center.</strong> Here you can view, export,
            or delete all personal data we have stored about you. These tools help you exercise
            your rights under GDPR, CCPA, and other privacy regulations.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2.5 my-8 border-b-2 border-gray-300">
          <button
            className={`bg-none border-none px-6 py-3 text-base font-medium text-gray-600 cursor-pointer border-b-[3px] border-transparent transition-all -mb-0.5 hover:text-blue-500 hover:bg-[rgba(33,150,243,0.05)] ${activeTab === 'inventory' ? 'text-blue-500 border-b-blue-500 bg-[rgba(33,150,243,0.05)]' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            📊 Data Inventory
          </button>
          <button
            className={`bg-none border-none px-6 py-3 text-base font-medium text-gray-600 cursor-pointer border-b-[3px] border-transparent transition-all -mb-0.5 hover:text-blue-500 hover:bg-[rgba(33,150,243,0.05)] ${activeTab === 'export' ? 'text-blue-500 border-b-blue-500 bg-[rgba(33,150,243,0.05)]' : ''}`}
            onClick={() => setActiveTab('export')}
          >
            💾 Export Data
          </button>
          <button
            className={`bg-none border-none px-6 py-3 text-base font-medium text-gray-600 cursor-pointer border-b-[3px] border-transparent transition-all -mb-0.5 hover:text-blue-500 hover:bg-[rgba(33,150,243,0.05)] ${activeTab === 'delete' ? 'text-blue-500 border-b-blue-500 bg-[rgba(33,150,243,0.05)]' : ''}`}
            onClick={() => setActiveTab('delete')}
          >
            🗑️ Delete Data
          </button>
          <button
            className={`bg-none border-none px-6 py-3 text-base font-medium text-gray-600 cursor-pointer border-b-[3px] border-transparent transition-all -mb-0.5 hover:text-blue-500 hover:bg-[rgba(33,150,243,0.05)] ${activeTab === 'analytics' ? 'text-blue-500 border-b-blue-500 bg-[rgba(33,150,243,0.05)]' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics Settings
          </button>
          <button
            className={`bg-none border-none px-6 py-3 text-base font-medium text-gray-600 cursor-pointer border-b-[3px] border-transparent transition-all -mb-0.5 hover:text-blue-500 hover:bg-[rgba(33,150,243,0.05)] ${activeTab === 'retention' ? 'text-blue-500 border-b-blue-500 bg-[rgba(33,150,243,0.05)]' : ''}`}
            onClick={() => setActiveTab('retention')}
          >
            ⏱️ Retention Policies
          </button>
        </div>

        {/* Tab Content */}
        <div className="animate-[fadeIn_0.3s_ease-in]">
          {activeTab === 'inventory' && (
            <section className="my-10 pt-5">
              <h2 className="text-[1.8rem] text-[#1a1a1a] mb-5 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-blue-500">Your Data Inventory</h2>
              <p className="leading-[1.8] text-[#444] my-4">
                This shows all the data we currently have stored about you in your browser.
                The Shadium stores data locally on your device - we don't maintain user accounts
                or store personal data on our servers.
              </p>

              {loading ? (
                <div className="text-center p-10 text-gray-600 text-[1.1rem]">Loading your data inventory...</div>
              ) : (
                <DataInventory
                  dataReport={dataReport}
                  onRefresh={loadDataInventory}
                />
              )}
            </section>
          )}

          {activeTab === 'export' && (
            <section className="my-10 pt-5">
              <h2 className="text-[1.8rem] text-[#1a1a1a] mb-5 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-blue-500">Export Your Data</h2>
              <p className="leading-[1.8] text-[#444] my-4">
                Download a complete copy of all data we have stored about you. You can export
                your data in multiple formats for your records or to transfer to another service.
              </p>

              <div className="bg-gray-100 p-5 rounded-lg my-5">
                <h3 className="mt-0 text-[#333]">Available Export Formats:</h3>
                <ul className="my-2.5">
                  <li className="my-2">
                    <strong>JSON Format:</strong> Machine-readable format for data portability
                  </li>
                  <li className="my-2">
                    <strong>HTML Report:</strong> Human-readable report you can view in your browser
                  </li>
                </ul>
              </div>

              <DataExportButton
                dataReport={dataReport}
                onExportComplete={() => {
                  alert('Your data has been exported successfully!');
                }}
              />

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-5 rounded">
                <p className="my-2 text-[#1565c0]">
                  <strong>Note:</strong> Your exported data includes all preferences, settings,
                  and usage data stored locally in your browser. This export does not include
                  any server-side analytics data, as that is anonymized and not linked to
                  individual users.
                </p>
              </div>
            </section>
          )}

          {activeTab === 'delete' && (
            <section className="my-10 pt-5">
              <h2 className="text-[1.8rem] text-[#1a1a1a] mb-5 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-blue-500">Delete Your Data</h2>

              <div className="bg-[#fff3cd] border-2 border-[#ffc107] rounded-lg p-5 my-5">
                <h3 className="text-[#856404] mt-0">⚠️ Warning: This Action Cannot Be Undone</h3>
                <p className="leading-[1.8] text-[#444] my-4">
                  Deleting your data will permanently remove all stored preferences, settings,
                  and usage data from your browser. This includes:
                </p>
                <ul className="my-2.5 text-[#856404] pl-6">
                  <li className="leading-[1.8] my-2">Your stadium preferences and favorites</li>
                  <li className="leading-[1.8] my-2">Cookie consent preferences</li>
                  <li className="leading-[1.8] my-2">Custom settings and filters</li>
                  <li className="leading-[1.8] my-2">Recent searches and viewing history</li>
                  <li className="leading-[1.8] my-2">All locally stored data</li>
                </ul>
              </div>

              <DataDeletionButton
                onDeleteComplete={() => {
                  alert('All your data has been permanently deleted.');
                  loadDataInventory(); // Refresh to show empty state
                }}
              />

              <div className="my-10 pt-5">
                <h3 className="text-[1.3rem] text-[#333] my-6">What happens after deletion?</h3>
                <ul className="my-4 pl-6">
                  <li className="leading-[1.8] text-[#444] my-2">All your preferences will be reset to defaults</li>
                  <li className="leading-[1.8] text-[#444] my-2">You'll need to re-accept cookies if you want to use optional features</li>
                  <li className="leading-[1.8] text-[#444] my-2">The site will treat you as a new visitor</li>
                  <li className="leading-[1.8] text-[#444] my-2">No personal data will remain in your browser from our site</li>
                </ul>
              </div>
            </section>
          )}

          {activeTab === 'analytics' && (
            <section className="my-10 pt-5">
              <h2 className="text-[1.8rem] text-[#1a1a1a] mb-5 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-blue-500">Analytics & Tracking Settings</h2>
              <p className="leading-[1.8] text-[#444] my-4">
                Control how we collect anonymous usage data to improve our service.
                These settings allow you to opt-out of Google Analytics tracking at any time.
              </p>

              <GoogleAnalyticsOptOut />

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-5 rounded">
                <h3 className="text-[1.3rem] text-[#333] my-6">About Google Analytics</h3>
                <p className="my-2 text-[#1565c0]">
                  Google Analytics helps us understand how visitors use our website through
                  anonymous data collection. This includes:
                </p>
                <ul className="my-2.5 text-[#1565c0] pl-6">
                  <li className="my-2">Pages visited and time spent on each page</li>
                  <li className="my-2">General geographic location (country/region level)</li>
                  <li className="my-2">Device and browser type</li>
                  <li className="my-2">How you arrived at our site</li>
                </ul>
                <p className="my-2 text-[#1565c0]">
                  <strong>We do NOT collect:</strong> Personal information, IP addresses,
                  or any data that could identify you individually.
                </p>
              </div>

              <div className="bg-[#e8f5e9] border-l-4 border-green-500 p-4 my-5 rounded">
                <h3 className="text-[1.3rem] text-[#333] my-6">Your Privacy is Protected</h3>
                <p className="my-2 text-green-800">
                  • Your opt-out preference is stored permanently in a cookie<br/>
                  • The opt-out applies immediately and stops all tracking<br/>
                  • You can change this preference at any time<br/>
                  • We honor Global Privacy Control (GPC) signals automatically
                </p>
              </div>
            </section>
          )}

          {activeTab === 'retention' && (
            <section className="my-10 pt-5">
              <h2 className="text-[1.8rem] text-[#1a1a1a] mb-5 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-blue-500">Data Retention Policies</h2>
              <p className="leading-[1.8] text-[#444] my-4">
                We automatically delete your data after specific retention periods to protect your privacy.
                Data that hasn't been accessed within these timeframes is permanently removed.
              </p>

              <DataRetentionInfo />

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-5 rounded">
                <h3 className="text-[1.3rem] text-[#333] my-6">How Retention Works</h3>
                <p className="my-2 text-[#1565c0]">
                  • Data is timestamped when stored in your browser<br/>
                  • Our system checks daily for expired data<br/>
                  • Expired data is automatically deleted<br/>
                  • Active use of a feature refreshes its retention period<br/>
                  • You can always delete all data manually using the Delete Data tab
                </p>
              </div>
            </section>
          )}
        </div>

        {/* Additional Information */}
        <section className="my-10 pt-5">
          <h2 className="text-[1.8rem] text-[#1a1a1a] mb-5 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-blue-500">Frequently Asked Questions</h2>

          <div className="bg-gray-50 p-5 rounded-lg my-5 border-l-4 border-blue-500">
            <h3 className="mt-0 text-[#333]">Where is my data stored?</h3>
            <p className="leading-[1.8] text-[#444] my-4">
              All personal data is stored locally in your browser using technologies like
              localStorage, sessionStorage, and cookies. We don't maintain user accounts or
              store personal information on our servers.
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg my-5 border-l-4 border-blue-500">
            <h3 className="mt-0 text-[#333]">What about analytics data?</h3>
            <p className="leading-[1.8] text-[#444] my-4">
              We use Google Analytics to understand how visitors use our site. This data is
              anonymized and aggregated. If you want to opt-out of analytics, you can use
              our <Link href="/cookies">Cookie Preferences</Link> or install the{' '}
              <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
                Google Analytics Opt-out Browser Add-on
              </a>.
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg my-5 border-l-4 border-blue-500">
            <h3 className="mt-0 text-[#333]">How do I make a formal privacy request?</h3>
            <p className="leading-[1.8] text-[#444] my-4">
              For formal privacy requests or if you need assistance, please email us at{' '}
              <a href="mailto:legal@theshadium.com?subject=Privacy Rights Request">
                legal@theshadium.com
              </a>{' '}
              with "Privacy Rights Request" in the subject line.
            </p>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg my-5 border-l-4 border-blue-500">
            <h3 className="mt-0 text-[#333]">What are my rights under GDPR/CCPA?</h3>
            <p className="leading-[1.8] text-[#444] my-4">
              You have the right to:
            </p>
            <ul className="my-2.5 pl-5">
              <li className="leading-[1.8] text-[#444] my-2">Access your personal data (export)</li>
              <li className="leading-[1.8] text-[#444] my-2">Correct inaccurate data</li>
              <li className="leading-[1.8] text-[#444] my-2">Delete your personal data (right to be forgotten)</li>
              <li className="leading-[1.8] text-[#444] my-2">Restrict processing of your data</li>
              <li className="leading-[1.8] text-[#444] my-2">Data portability (export in machine-readable format)</li>
              <li className="leading-[1.8] text-[#444] my-2">Object to data processing</li>
              <li className="leading-[1.8] text-[#444] my-2">Not be subject to automated decision-making</li>
            </ul>
          </div>
        </section>

        {/* Legal Links */}
        <section className="my-10 pt-5">
          <h2 className="text-[1.8rem] text-[#1a1a1a] mb-5 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-blue-500">Related Documents</h2>
          <ul className="my-4 pl-6">
            <li className="leading-[1.8] text-[#444] my-2">
              <Link href="/privacy">Privacy Policy</Link>
            </li>
            <li className="leading-[1.8] text-[#444] my-2">
              <Link href="/cookies">Cookie Policy</Link>
            </li>
            <li className="leading-[1.8] text-[#444] my-2">
              <Link href="/do-not-sell">Do Not Sell My Personal Information</Link>
            </li>
            <li className="leading-[1.8] text-[#444] my-2">
              <Link href="/terms">Terms of Service</Link>
            </li>
          </ul>
        </section>

        {/* Contact Information */}
        <section className="my-10 pt-5">
          <h2 className="text-[1.8rem] text-[#1a1a1a] mb-5 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-blue-500">Contact Us</h2>
          <div className="bg-gray-50 border-l-4 border-blue-500 p-5 my-5 rounded">
            <p className="my-2 text-[#333]"><strong>The Shadium Legal Team</strong></p>
            <p className="my-2 text-[#333]">Email: legal@theshadium.com</p>
            <p className="my-2 text-[#333]">Subject: Privacy Rights Request</p>
          </div>
        </section>

        <div className="bg-[#e3f2fd] border-2 border-blue-500 rounded-lg p-5 my-10 text-center">
          <p className="m-0 text-[#1565c0] font-medium">
            <strong>The Shadium is committed to protecting your privacy and giving you
            control over your personal data.</strong>
          </p>
        </div>
      </div>
    </div>
  );
}