import React from 'react';
import Link from 'next/link';
import styles from '../styles/Footer.module.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>The Shadium</h3>
          <p className={styles.footerDescription}>
            Find seats in the shade at any MLB stadium. Real-time sun tracking 
            and shade calculations for all 30 ballparks.
          </p>
          <div className={styles.copyright}>
            <p>© {currentYear} The Shadium™. All rights reserved.</p>
            <p className={styles.trademark}>
              The Shadium™ and Shadium™ are trademarks of The Shadium.
            </p>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>Legal</h4>
          <ul className={styles.footerLinks}>
            <li>
              <Link href="/terms">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/cookies">
                Cookie Policy
              </Link>
            </li>
            <li>
              <Link href="/disclaimer">
                Disclaimers
              </Link>
            </li>
            <li>
              <Link href="/dmca">
                DMCA Policy
              </Link>
            </li>
            <li>
              <Link href="/accessibility">
                Accessibility
              </Link>
            </li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>Resources</h4>
          <ul className={styles.footerLinks}>
            <li>
              <Link href="/guide">
                Shade Guide
              </Link>
            </li>
            <li>
              <Link href="/stadiums">
                All Stadiums
              </Link>
            </li>
            <li>
              <Link href="/faq">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/blog">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/contact">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.sectionTitle}>Privacy</h4>
          <ul className={styles.footerLinks}>
            <li>
              <Link href="/privacy#california">
                California Privacy Rights
              </Link>
            </li>
            <li>
              <Link href="/privacy#gdpr">
                EU Privacy Rights
              </Link>
            </li>
            <li>
              <button 
                className={styles.linkButton}
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
            <li>
              <Link href="/do-not-sell">
                Do Not Sell My Info
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.disclaimer}>
          <p>
            <strong>Disclaimer:</strong> The Shadium is not affiliated with, endorsed by, or 
            sponsored by Major League Baseball or any MLB team. All team names and venues are 
            trademarks of their respective owners. Shade calculations are estimates only. 
            Actual conditions may vary.
          </p>
        </div>
        
        <div className={styles.legalNotice}>
          <p>
            Use of this site constitutes acceptance of our{' '}
            <Link href="/terms">Terms of Service</Link> and{' '}
            <Link href="/privacy">Privacy Policy</Link>.
          </p>
          <p className={styles.dataProtection}>
            Protected by copyright and other intellectual property laws. 
            Unauthorized use is prohibited.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;