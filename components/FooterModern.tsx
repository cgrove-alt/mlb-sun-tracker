'use client';

import React from 'react';
import Link from 'next/link';

const FooterModern: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="mt-auto border-t border-ink-200 bg-white" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Brand Section */}
          <div>
            <h3 className="text-lg font-bold text-ink-900 mb-2">The Shadium</h3>
            <p className="text-xs text-ink-600 mb-2">
              Find seats in the shade at any MLB, MiLB, or NFL stadium. Real-time sun tracking 
              for 250+ venues.
            </p>
            <p className="text-xs text-ink-500">
              © {currentYear} The Shadium™. All rights reserved.
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h4 className="font-semibold text-ink-900 mb-2 text-sm">Quick Links</h4>
            <div className="grid grid-cols-2 gap-x-4">
              <ul className="space-y-1">
                <li><Link href="/guide" className="text-xs text-ink-600 hover:text-primary-500">Shade Guide</Link></li>
                <li><Link href="/stadiums" className="text-xs text-ink-600 hover:text-primary-500">All Stadiums</Link></li>
                <li><Link href="/faq" className="text-xs text-ink-600 hover:text-primary-500">FAQ</Link></li>
                <li><Link href="/contact" className="text-xs text-ink-600 hover:text-primary-500">Contact</Link></li>
              </ul>
              <ul className="space-y-1">
                <li><Link href="/terms" className="text-xs text-ink-600 hover:text-primary-500">Terms</Link></li>
                <li><Link href="/privacy" className="text-xs text-ink-600 hover:text-primary-500">Privacy</Link></li>
                <li><Link href="/cookies" className="text-xs text-ink-600 hover:text-primary-500">Cookies</Link></li>
                <li><Link href="/accessibility" className="text-xs text-ink-600 hover:text-primary-500">Accessibility</Link></li>
              </ul>
            </div>
          </div>

          {/* Privacy Section */}
          <div>
            <h4 className="font-semibold text-ink-900 mb-2 text-sm">Privacy Options</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/privacy#california" className="text-xs text-ink-600 hover:text-primary-500">
                  California Privacy Rights
                </Link>
              </li>
              <li>
                <Link href="/privacy#gdpr" className="text-xs text-ink-600 hover:text-primary-500">
                  EU Privacy Rights
                </Link>
              </li>
              <li>
                <button 
                  className="text-xs text-ink-600 hover:text-primary-500 text-left"
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).showCookiePreferences) {
                      (window as any).showCookiePreferences();
                    }
                  }}
                >
                  Cookie Preferences
                </button>
              </li>
              <li>
                <Link href="/do-not-sell" className="text-xs text-ink-600 hover:text-primary-500">
                  Do Not Sell My Info
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section - Simplified */}
        <div className="mt-4 pt-4 border-t border-ink-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-xs text-ink-400">
              ⚾ MLB data: MLB Advanced Media • 🌤️ Weather: Open-Meteo • ☀️ Sun: NREL SPA
            </p>
            <p className="text-xs text-ink-400">
              Not affiliated with MLB, MiLB, or NFL. Calculations are estimates.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterModern;