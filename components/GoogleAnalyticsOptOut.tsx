'use client';

import React, { useState, useEffect } from 'react';
import { googleAnalytics, cookieConsent } from '../utils/cookies';

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
    <div className="my-5">
      <div className="bg-white border border-gray-300 rounded-lg p-5 mb-5 shadow-sm">
        <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
          <h3>Google Analytics Status</h3>
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wide">
            {gaStatus.optedOut ? 'Opted Out' : 'Active'}
          </span>
        </div>

        <div className="text-gray-600 text-[0.95rem] leading-relaxed mb-4">
          <p>
            Google Analytics helps us understand how visitors use our website.
            This data is anonymous and used solely to improve our services.
          </p>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="px-4 py-3 font-mono text-sm text-gray-900 align-top bg-gray-50 font-medium">Tracking Status:</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-700">
                  {gaStatus.optedOut ? (
                    <span className="text-green-600">✓ Opted Out</span>
                  ) : (
                    <span className="text-orange-500">Active</span>
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-4 py-3 font-mono text-sm text-gray-900 align-top bg-gray-50 font-medium">Performance Cookies:</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-700">
                  {gaStatus.consentGiven ? 'Allowed' : 'Blocked'}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-sm text-gray-900 align-top bg-gray-50 font-medium">GA Cookies Present:</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-700">
                  {gaStatus.hasGACookies ? 'Yes' : 'No'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex gap-3">
          {gaStatus.optedOut ? (
            <button
              onClick={handleOptIn}
              disabled={loading}
              className="w-full px-6 py-3.5 bg-[linear-gradient(135deg,#4caf50_0%,#45a049_100%)] text-white border-0 rounded-lg text-lg font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:bg-[linear-gradient(135deg,#45a049_0%,#3d8b40_100%)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(76,175,80,0.3)]"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Processing...
                </>
              ) : (
                '✓ Opt In to Google Analytics'
              )}
            </button>
          ) : (
            <button
              onClick={handleOptOut}
              disabled={loading}
              className="w-full px-6 py-3.5 bg-[linear-gradient(135deg,#dc3545_0%,#c82333_100%)] text-white border-0 rounded-lg text-lg font-semibold cursor-pointer transition-all flex items-center justify-center gap-2 hover:bg-[linear-gradient(135deg,#c82333_0%,#b21f2d_100%)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(220,53,69,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Processing...
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
              className="px-6 py-2.5 bg-gray-500 text-white border-0 rounded-md text-base font-medium cursor-pointer transition-colors hover:bg-gray-600"
            >
              Clear GA Cookies
            </button>
          )}
        </div>

        <div className="mt-5 p-4 bg-blue-50 border-l-4 border-blue-500 rounded text-[0.9rem] text-blue-900">
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