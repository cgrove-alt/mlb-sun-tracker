'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../../styles/Legal.module.css';
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
    <div className={styles.legalContainer}>
      <div className={styles.legalContent}>
        <h1>Privacy Rights Center</h1>
        <p className={styles.lastUpdated}>Exercise Your Privacy Rights</p>
        <p className={styles.effectiveDate}>Your Data, Your Control</p>

        <div className={styles.infoBox}>
          <p>
            <strong>Welcome to your Privacy Rights Center.</strong> Here you can view, export, 
            or delete all personal data we have stored about you. These tools help you exercise 
            your rights under GDPR, CCPA, and other privacy regulations.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabContainer}>
          <button
            className={`${styles.tabButton} ${activeTab === 'inventory' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            📊 Data Inventory
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'export' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('export')}
          >
            💾 Export Data
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'delete' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('delete')}
          >
            🗑️ Delete Data
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'analytics' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics Settings
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'retention' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('retention')}
          >
            ⏱️ Retention Policies
          </button>
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === 'inventory' && (
            <section className={styles.section}>
              <h2>Your Data Inventory</h2>
              <p>
                This shows all the data we currently have stored about you in your browser. 
                The Shadium stores data locally on your device - we don't maintain user accounts 
                or store personal data on our servers.
              </p>
              
              {loading ? (
                <div className={styles.loading}>Loading your data inventory...</div>
              ) : (
                <DataInventory 
                  dataReport={dataReport} 
                  onRefresh={loadDataInventory}
                />
              )}
            </section>
          )}

          {activeTab === 'export' && (
            <section className={styles.section}>
              <h2>Export Your Data</h2>
              <p>
                Download a complete copy of all data we have stored about you. You can export 
                your data in multiple formats for your records or to transfer to another service.
              </p>

              <div className={styles.exportOptions}>
                <h3>Available Export Formats:</h3>
                <ul>
                  <li>
                    <strong>JSON Format:</strong> Machine-readable format for data portability
                  </li>
                  <li>
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

              <div className={styles.infoBox} style={{ marginTop: '20px' }}>
                <p>
                  <strong>Note:</strong> Your exported data includes all preferences, settings, 
                  and usage data stored locally in your browser. This export does not include 
                  any server-side analytics data, as that is anonymized and not linked to 
                  individual users.
                </p>
              </div>
            </section>
          )}

          {activeTab === 'delete' && (
            <section className={styles.section}>
              <h2>Delete Your Data</h2>
              
              <div className={styles.warningBox}>
                <h3>⚠️ Warning: This Action Cannot Be Undone</h3>
                <p>
                  Deleting your data will permanently remove all stored preferences, settings, 
                  and usage data from your browser. This includes:
                </p>
                <ul>
                  <li>Your stadium preferences and favorites</li>
                  <li>Cookie consent preferences</li>
                  <li>Custom settings and filters</li>
                  <li>Recent searches and viewing history</li>
                  <li>All locally stored data</li>
                </ul>
              </div>

              <DataDeletionButton 
                onDeleteComplete={() => {
                  alert('All your data has been permanently deleted.');
                  loadDataInventory(); // Refresh to show empty state
                }}
              />

              <div className={styles.section}>
                <h3>What happens after deletion?</h3>
                <ul>
                  <li>All your preferences will be reset to defaults</li>
                  <li>You'll need to re-accept cookies if you want to use optional features</li>
                  <li>The site will treat you as a new visitor</li>
                  <li>No personal data will remain in your browser from our site</li>
                </ul>
              </div>
            </section>
          )}

          {activeTab === 'analytics' && (
            <section className={styles.section}>
              <h2>Analytics & Tracking Settings</h2>
              <p>
                Control how we collect anonymous usage data to improve our service. 
                These settings allow you to opt-out of Google Analytics tracking at any time.
              </p>
              
              <GoogleAnalyticsOptOut />
              
              <div className={styles.infoBox} style={{ marginTop: '20px' }}>
                <h3>About Google Analytics</h3>
                <p>
                  Google Analytics helps us understand how visitors use our website through 
                  anonymous data collection. This includes:
                </p>
                <ul>
                  <li>Pages visited and time spent on each page</li>
                  <li>General geographic location (country/region level)</li>
                  <li>Device and browser type</li>
                  <li>How you arrived at our site</li>
                </ul>
                <p>
                  <strong>We do NOT collect:</strong> Personal information, IP addresses, 
                  or any data that could identify you individually.
                </p>
              </div>
              
              <div className={styles.infoBox} style={{ marginTop: '20px', borderColor: '#4caf50', backgroundColor: '#e8f5e9' }}>
                <h3>Your Privacy is Protected</h3>
                <p>
                  • Your opt-out preference is stored permanently in a cookie<br/>
                  • The opt-out applies immediately and stops all tracking<br/>
                  • You can change this preference at any time<br/>
                  • We honor Global Privacy Control (GPC) signals automatically
                </p>
              </div>
            </section>
          )}

          {activeTab === 'retention' && (
            <section className={styles.section}>
              <h2>Data Retention Policies</h2>
              <p>
                We automatically delete your data after specific retention periods to protect your privacy. 
                Data that hasn't been accessed within these timeframes is permanently removed.
              </p>
              
              <DataRetentionInfo />
              
              <div className={styles.infoBox} style={{ marginTop: '20px' }}>
                <h3>How Retention Works</h3>
                <p>
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
        <section className={styles.section}>
          <h2>Frequently Asked Questions</h2>
          
          <div className={styles.faqItem}>
            <h3>Where is my data stored?</h3>
            <p>
              All personal data is stored locally in your browser using technologies like 
              localStorage, sessionStorage, and cookies. We don't maintain user accounts or 
              store personal information on our servers.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3>What about analytics data?</h3>
            <p>
              We use Google Analytics to understand how visitors use our site. This data is 
              anonymized and aggregated. If you want to opt-out of analytics, you can use 
              our <Link href="/cookies">Cookie Preferences</Link> or install the{' '}
              <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
                Google Analytics Opt-out Browser Add-on
              </a>.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3>How do I make a formal privacy request?</h3>
            <p>
              For formal privacy requests or if you need assistance, please email us at{' '}
              <a href="mailto:legal@theshadium.com?subject=Privacy Rights Request">
                legal@theshadium.com
              </a>{' '}
              with "Privacy Rights Request" in the subject line.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3>What are my rights under GDPR/CCPA?</h3>
            <p>
              You have the right to:
            </p>
            <ul>
              <li>Access your personal data (export)</li>
              <li>Correct inaccurate data</li>
              <li>Delete your personal data (right to be forgotten)</li>
              <li>Restrict processing of your data</li>
              <li>Data portability (export in machine-readable format)</li>
              <li>Object to data processing</li>
              <li>Not be subject to automated decision-making</li>
            </ul>
          </div>
        </section>

        {/* Legal Links */}
        <section className={styles.section}>
          <h2>Related Documents</h2>
          <ul>
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/cookies">Cookie Policy</Link>
            </li>
            <li>
              <Link href="/do-not-sell">Do Not Sell My Personal Information</Link>
            </li>
            <li>
              <Link href="/terms">Terms of Service</Link>
            </li>
          </ul>
        </section>

        {/* Contact Information */}
        <section className={styles.section}>
          <h2>Contact Us</h2>
          <div className={styles.contactInfo}>
            <p><strong>The Shadium Legal Team</strong></p>
            <p>Email: legal@theshadium.com</p>
            <p>Subject: Privacy Rights Request</p>
          </div>
        </section>

        <div className={styles.acceptanceNotice}>
          <p>
            <strong>The Shadium is committed to protecting your privacy and giving you 
            control over your personal data.</strong>
          </p>
        </div>
      </div>
    </div>
  );
}