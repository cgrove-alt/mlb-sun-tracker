'use client';

import React from 'react';
import Link from 'next/link';

const FooterModern: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="relative mt-auto border-t border-ink-200 bg-gradient-to-b from-white to-ink-50" role="contentinfo">
      {/* Glass morphism overlay for depth */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-xl font-bold text-ink-900 mb-3">The Shadium</h3>
            <p className="text-sm text-ink-600 mb-4">
              Find seats in the shade at any MLB, MiLB, or NFL stadium. Real-time sun tracking 
              and shade calculations for 250+ sports venues.
            </p>
            <div className="space-y-1">
              <p className="text-sm text-ink-500">© {currentYear} The Shadium™. All rights reserved.</p>
              <p className="text-xs text-ink-400">
                The Shadium™ and Shadium™ are trademarks of The Shadium.
              </p>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-ink-900 mb-4">Legal</h4>
            <ul className="space-y-2">
              {[
                { href: '/terms', label: 'Terms of Service' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/cookies', label: 'Cookie Policy' },
                { href: '/disclaimer', label: 'Disclaimers' },
                { href: '/dmca', label: 'DMCA Policy' },
                { href: '/accessibility', label: 'Accessibility' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-ink-600 hover:text-primary-500 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold text-ink-900 mb-4">Resources</h4>
            <ul className="space-y-2">
              {[
                { href: '/guide', label: 'Shade Guide' },
                { href: '/stadiums', label: 'All Stadiums' },
                { href: '/faq', label: 'FAQ' },
                { href: '/blog', label: 'Blog' },
                { href: '/contact', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-ink-600 hover:text-primary-500 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Privacy Links */}
          <div>
            <h4 className="font-semibold text-ink-900 mb-4">Privacy</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/privacy#california"
                  className="text-sm text-ink-600 hover:text-primary-500 transition-colors duration-200"
                >
                  California Privacy Rights
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy#gdpr"
                  className="text-sm text-ink-600 hover:text-primary-500 transition-colors duration-200"
                >
                  EU Privacy Rights
                </Link>
              </li>
              <li>
                <button 
                  className="text-sm text-ink-600 hover:text-primary-500 transition-colors duration-200 text-left"
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
                <Link 
                  href="/do-not-sell"
                  className="text-sm text-ink-600 hover:text-primary-500 transition-colors duration-200"
                >
                  Do Not Sell My Info
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-ink-200">
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-xs text-ink-600">
                <span className="font-semibold">Disclaimer:</span> The Shadium is not affiliated with, endorsed by, or 
                sponsored by Major League Baseball, Minor League Baseball, the National Football League, 
                or any team. All team names and venues are trademarks of their respective owners. 
                Shade calculations are estimates only. Actual conditions may vary.
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-ink-500">
                Use of this site constitutes acceptance of our{' '}
                <Link href="/terms" className="text-primary-500 hover:text-primary-600 underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary-500 hover:text-primary-600 underline">
                  Privacy Policy
                </Link>.
              </p>
              <p className="text-xs text-ink-400 mt-2">
                Protected by copyright and other intellectual property laws. 
                Unauthorized use is prohibited.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterModern;