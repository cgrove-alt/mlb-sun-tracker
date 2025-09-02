'use client';

import React, { useState, useEffect } from 'react';
import { googleAnalytics, cookieConsent } from '../utils/cookies';
import styles from '../styles/PrivacyComponents.module.css';

export default function GoogleAnalyticsOptOut() {
  const [gaStatus, setGAStatus] = useState({
    optedOut: false,
    hasGACookies: false,
    consentGiven: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check initial status
    updateStatus();
    
    // Listen for consent changes
    const handleConsentChange = () => {
      updateStatus();
    };
    
    window.addEventListener('cookieConsentChanged', handleConsentChange);
    
    return () => {
      window.removeEventListener('cookieConsentChanged', handleConsentChange);
    };
  }, []);

  const updateStatus = () => {
    const status = googleAnalytics.getStatus();
    setGAStatus(status);
  };

  const handleOptOut = async () => {
    setLoading(true);
    
    try {
      // Set GA opt-out
      googleAnalytics.setOptOut(true);
      
      // Update cookie consent to reflect this
      const consent = cookieConsent.getConsent();
      if (consent && consent.performance) {
        const updatedConsent = {
          ...consent,
          performance: false,
          timestamp: Date.now()
        };
        cookieConsent.setConsent(updatedConsent);
        
        // Emit event for other components
        window.dispatchEvent(new CustomEvent('cookieConsentChanged', { 
          detail: updatedConsent 
        }));
      }
      
      // Update status
      updateStatus();
      
      // Show success message
      alert('You have successfully opted out of Google Analytics tracking.');
    } catch (error) {
      console.error('Error opting out of GA:', error);
      alert('There was an error processing your opt-out request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptIn = async () => {
    setLoading(true);
    
    try {
      // Remove GA opt-out
      googleAnalytics.setOptOut(false);
      
      // Update cookie consent to reflect this
      const consent = cookieConsent.getConsent() || {
        necessary: true,
        performance: true,
        functional: false,
        timestamp: Date.now()
      };
      
      if (!consent.performance) {
        const updatedConsent = {
          ...consent,
          performance: true,
          timestamp: Date.now()
        };
        cookieConsent.setConsent(updatedConsent);
        
        // Emit event for other components
        window.dispatchEvent(new CustomEvent('cookieConsentChanged', { 
          detail: updatedConsent 
        }));
      }
      
      // Update status
      updateStatus();
      
      // Show success message
      alert('You have successfully opted in to Google Analytics tracking.');
    } catch (error) {
      console.error('Error opting in to GA:', error);
      alert('There was an error processing your opt-in request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.inventoryContainer}>
      <div className={styles.categoryCard}>
        <div className={styles.categoryHeader}>
          <h3>Google Analytics Status</h3>
          <span className={styles.categoryBadge}>
            {gaStatus.optedOut ? 'Opted Out' : 'Active'}
          </span>
        </div>
        
        <div className={styles.categoryDescription}>
          <p>
            Google Analytics helps us understand how visitors use our website. 
            This data is anonymous and used solely to improve our services.
          </p>
        </div>
        
        <div className={styles.dataTable}>
          <table>
            <tbody>
              <tr>
                <td className={styles.dataKey}>Tracking Status:</td>
                <td className={styles.dataValue}>
                  {gaStatus.optedOut ? (
                    <span style={{ color: '#4caf50' }}>✓ Opted Out</span>
                  ) : (
                    <span style={{ color: '#ff9800' }}>Active</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className={styles.dataKey}>Performance Cookies:</td>
                <td className={styles.dataValue}>
                  {gaStatus.consentGiven ? 'Allowed' : 'Blocked'}
                </td>
              </tr>
              <tr>
                <td className={styles.dataKey}>GA Cookies Present:</td>
                <td className={styles.dataValue}>
                  {gaStatus.hasGACookies ? 'Yes' : 'No'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
          {gaStatus.optedOut ? (
            <button
              onClick={handleOptIn}
              disabled={loading}
              className={styles.exportButton}
              style={{ background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)' }}
            >
              {loading ? (
                <>
                  <span className={styles.spinner}></span> Processing...
                </>
              ) : (
                '✓ Opt In to Google Analytics'
              )}
            </button>
          ) : (
            <button
              onClick={handleOptOut}
              disabled={loading}
              className={styles.deleteButton}
            >
              {loading ? (
                <>
                  <span className={styles.spinner}></span> Processing...
                </>
              ) : (
                '✕ Opt Out of Google Analytics'
              )}
            </button>
          )}
          
          {gaStatus.hasGACookies && (
            <button
              onClick={() => {
                googleAnalytics.clearCookies();
                updateStatus();
                alert('Google Analytics cookies have been cleared.');
              }}
              className={styles.cancelButton}
            >
              Clear GA Cookies
            </button>
          )}
        </div>
        
        <div className={styles.privacyNotice} style={{ marginTop: '20px' }}>
          <p>
            <strong>Note:</strong> Opting out will prevent Google Analytics from collecting 
            data about your visits. This setting will persist across browser sessions. 
            You can change this preference at any time.
          </p>
        </div>
      </div>
    </div>
  );
}