'use client';

import React from 'react';
import Link from 'next/link';
import { AttributionNotice } from '../src/components/AttributionNotice';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="relative bg-[linear-gradient(135deg,#1a1a1a_0%,#2d2d2d_100%)] text-[#e0e0e0] pt-[60px] px-5 pb-5 mt-20 before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-[linear-gradient(90deg,#2196f3,#21cbf3)] sm:pt-10 sm:px-[15px] sm:pb-[15px] sm:mt-[60px] print:bg-white print:text-black print:border-t-2 print:border-black" role="contentinfo">
      <div className="max-w-[1200px] mx-auto grid grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-10 lg:grid-cols-2 lg:gap-[30px] sm:grid-cols-1 sm:gap-[25px]">
        <div className="min-w-0 lg:col-span-2">
          <h3 className="text-[1.8rem] font-bold mb-[15px] bg-[linear-gradient(135deg,#2196f3,#21cbf3)] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] sm:text-2xl">The Shadium</h3>
          <p className="leading-[1.6] text-[#b0b0b0] mb-5">
            Find seats in the shade at any MLB, MiLB, or NFL stadium. Real-time sun tracking
            and shade calculations for 250+ sports venues.
          </p>
          <div className="mt-5 pt-5 border-t border-[#3a3a3a]">
            <p className="my-1.5 text-[#90caf9] font-medium">© {currentYear} The Shadium™. All rights reserved.</p>
            <p className="my-1.5 text-[#90caf9] font-medium text-[0.85rem] text-[#808080] font-normal">
              The Shadium™ and Shadium™ are trademarks of The Shadium.
            </p>
          </div>
        </div>

        <div className="min-w-0">
          <h4 className="text-[1.1rem] font-semibold mb-[15px] text-white sm:text-base">Legal</h4>
          <ul className="list-none p-0 m-0 sm:text-[0.95rem]">
            <li className="mb-2.5">
              <Link href="/terms" className="text-[#b0b0b0] no-underline transition-[color,transform] inline-block hover:text-[#2196f3] hover:translate-x-[3px] print:text-black">
                Terms of Service
              </Link>
            </li>
            <li className="mb-2.5">
              <Link href="/privacy" className="text-[#b0b0b0] no-underline transition-[color,transform] inline-block hover:text-[#2196f3] hover:translate-x-[3px] print:text-black">
                Privacy Policy
              </Link>
            </li>
            <li className="mb-2.5">
              <Link href="/cookies" className="text-[#b0b0b0] no-underline transition-[color,transform] inline-block hover:text-[#2196f3] hover:translate-x-[3px] print:text-black">
                Cookie Policy
              </Link>
            </li>
            <li className="mb-2.5">
              <Link href="/disclaimer" className="text-[#b0b0b0] no-underline transition-[color,transform] inline-block hover:text-[#2196f3] hover:translate-x-[3px] print:text-black">
                Disclaimers
              </Link>
            </li>
            <li className="mb-2.5">
              <Link href="/dmca" className="text-[#b0b0b0] no-underline transition-[color,transform] inline-block hover:text-[#2196f3] hover:translate-x-[3px] print:text-black">
                DMCA Policy
              </Link>
            </li>
            <li className="mb-2.5">
              <Link href="/accessibility" className="text-[#b0b0b0] no-underline transition-[color,transform] inline-block hover:text-[#2196f3] hover:translate-x-[3px] print:text-black">
                Accessibility
              </Link>
            </li>
          </ul>
        </div>

        <div className="min-w-0">
          <h4 className="text-[1.1rem] font-semibold mb-[15px] text-white sm:text-base">Resources</h4>
          <ul className="list-none p-0 m-0 sm:text-[0.95rem]">
            <li className="mb-2.5">
              <Link href="/guide" className="text-[#b0b0b0] no-underline transition-[color,transform] inline-block hover:text-[#2196f3] hover:translate-x-[3px] print:text-black">
                Shade Guide
              </Link>
            </li>
            <li className="mb-2.5">
              <Link href="/stadiums" className="text-[#b0b0b0] no-underline transition-[color,transform] inline-block hover:text-[#2196f3] hover:translate-x-[3px] print:text-black">
                All Stadiums
              </Link>
            </li>
            <li className="mb-2.5">
              <Link href="/faq" className="text-[#b0b0b0] no-underline transition-[color,transform] inline-block hover:text-[#2196f3] hover:translate-x-[3px] print:text-black">
                FAQ
              </Link>
            </li>
            <li className="mb-2.5">
              <Link href="/blog" className="text-[#b0b0b0] no-underline transition-[color,transform] inline-block hover:text-[#2196f3] hover:translate-x-[3px] print:text-black">
                Blog
              </Link>
            </li>
            <li className="mb-2.5">
              <Link href="/attributions" className="text-[#b0b0b0] no-underline transition-[color,transform] inline-block hover:text-[#2196f3] hover:translate-x-[3px] print:text-black">
                Technology
              </Link>
            </li>
            <li className="mb-2.5">
              <Link href="/contact" className="text-[#b0b0b0] no-underline transition-[color,transform] inline-block hover:text-[#2196f3] hover:translate-x-[3px] print:text-black">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div className="min-w-0">
          <h4 className="text-[1.1rem] font-semibold mb-[15px] text-white sm:text-base">Privacy</h4>
          <ul className="list-none p-0 m-0 sm:text-[0.95rem]">
            <li className="mb-2.5">
              <Link href="/privacy#california" className="text-[#b0b0b0] no-underline transition-[color,transform] inline-block hover:text-[#2196f3] hover:translate-x-[3px] print:text-black">
                California Privacy Rights
              </Link>
            </li>
            <li className="mb-2.5">
              <Link href="/privacy#gdpr" className="text-[#b0b0b0] no-underline transition-[color,transform] inline-block hover:text-[#2196f3] hover:translate-x-[3px] print:text-black">
                EU Privacy Rights
              </Link>
            </li>
            <li className="mb-2.5">
              <button
                className="bg-none border-none text-[#b0b0b0] p-0 font-inherit cursor-pointer text-left transition-[color,transform] inline-block hover:text-[#2196f3] hover:translate-x-[3px] print:text-black"
                onClick={() => {
                  // Implement cookie preferences modal
                  if (typeof window !== 'undefined' && (window as any).showCookiePreferences) {
                    (window as any).showCookiePreferences();
                  }
                }}
              >
                Cookie Preferences
              </button>
            </li>
            <li className="mb-2.5">
              <Link href="/do-not-sell" className="text-[#b0b0b0] no-underline transition-[color,transform] inline-block hover:text-[#2196f3] hover:translate-x-[3px] print:text-black">
                Do Not Sell My Info
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto pt-[30px] border-t border-[#3a3a3a]">
        <div className="attributionSection">
          <h4 className="text-[1.1rem] font-semibold mb-[15px] text-white sm:text-base">Data Sources & Attribution</h4>
          <AttributionNotice type="all" className="attribution" />
        </div>

        <div className="mb-5 p-[15px] bg-[rgba(255,152,0,0.1)] border-l-[3px] border-[#ff9800] rounded sm:p-[15px] print:bg-[#f0f0f0] print:border-l-black">
          <p className="m-0 text-[#ffa726] text-[0.9rem] leading-[1.6] sm:text-[0.85rem] print:text-black">
            <strong className="text-[#ffb74d]">Disclaimer:</strong> The Shadium is not affiliated with, endorsed by, or
            sponsored by Major League Baseball, Minor League Baseball, the National Football League,
            or any team. All team names and venues are trademarks of their respective owners.
            Shade calculations are estimates only. Actual conditions may vary.
          </p>
        </div>

        <div className="text-center py-5 sm:p-[15px]">
          <p className="my-2.5 text-[#808080] text-[0.9rem] sm:text-[0.85rem]">
            Use of this site constitutes acceptance of our{' '}
            <Link href="/terms" className="text-[#2196f3] no-underline transition-colors hover:text-[#21cbf3] hover:underline">Terms of Service</Link> and{' '}
            <Link href="/privacy" className="text-[#2196f3] no-underline transition-colors hover:text-[#21cbf3] hover:underline">Privacy Policy</Link>.
          </p>
          <p className="my-2.5 text-[#808080] text-[0.9rem] text-[0.85rem] text-[#666666] mt-[15px]">
            Protected by copyright and other intellectual property laws.
            Unauthorized use is prohibited.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;