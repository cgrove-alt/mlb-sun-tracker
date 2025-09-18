'use client';

import { useEffect, useState } from 'react';

export default function TestCookiesPage() {
  const [cookieStatus, setCookieStatus] = useState<any>(null);
  const [localStorageStatus, setLocalStorageStatus] = useState<any>(null);

  useEffect(() => {
    // Check cookies
    const cookies = document.cookie;
    setCookieStatus(cookies || 'No cookies set');

    // Check localStorage
    const consent = localStorage.getItem('cookie_consent');
    const consentDate = localStorage.getItem('cookie_consent_date');
    const gpcApplied = localStorage.getItem('gpc_auto_applied');
    
    setLocalStorageStatus({
      consent: consent ? JSON.parse(consent) : null,
      consentDate,
      gpcApplied
    });
  }, []);

  const clearConsent = () => {
    // Clear cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    // Clear localStorage
    localStorage.removeItem('cookie_consent');
    localStorage.removeItem('cookie_consent_date');
    localStorage.removeItem('gpc_auto_applied');
    
    // Reload page
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Cookie Consent Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Cookie Status</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
            {cookieStatus}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">LocalStorage Status</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
            {JSON.stringify(localStorageStatus, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-x-4">
            <button
              onClick={clearConsent}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Clear All Consent Data
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Reload Page
            </button>
            <button
              onClick={() => (window as any).showCookiePreferences?.()}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Show Cookie Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}