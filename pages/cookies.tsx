import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Legal.module.css';

const CookiePolicy: React.FC = () => {
  return (
    <>
      <Head>
        <title>Cookie Policy | The Shadium</title>
        <meta name="description" content="Learn how The Shadium uses cookies and similar technologies to enhance your experience. Manage your cookie preferences." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://theshadium.com/cookies" />
      </Head>

      <div className={styles.legalContainer}>
        <div className={styles.legalContent}>
          <h1>Cookie Policy</h1>
          <p className={styles.lastUpdated}>Last Updated: January 2025</p>
          <p className={styles.effectiveDate}>Effective Date: January 1, 2025</p>

          <div className={styles.tableOfContents}>
            <h2>Quick Navigation</h2>
            <ul>
              <li><a href="#what-are-cookies">What Are Cookies?</a></li>
              <li><a href="#how-we-use">How We Use Cookies</a></li>
              <li><a href="#types">Types of Cookies</a></li>
              <li><a href="#third-party">Third-Party Cookies</a></li>
              <li><a href="#manage">Managing Cookies</a></li>
              <li><a href="#consent">Cookie Consent</a></li>
              <li><a href="#updates">Policy Updates</a></li>
            </ul>
          </div>

          <section id="what-are-cookies" className={styles.section}>
            <h2>1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your device when you visit 
              a website. They help websites remember information about your visit, which 
              can make your next visit easier and the site more useful to you.
            </p>
            
            <h3>Similar Technologies</h3>
            <p>
              In addition to cookies, we may use similar technologies including:
            </p>
            <ul>
              <li><strong>Web Beacons:</strong> Small graphics that track page views</li>
              <li><strong>Local Storage:</strong> Browser storage for larger amounts of data</li>
              <li><strong>Session Storage:</strong> Temporary browser storage cleared when tab closes</li>
              <li><strong>Device Fingerprinting:</strong> Technical information about your device</li>
            </ul>
          </section>

          <section id="how-we-use" className={styles.section}>
            <h2>2. How We Use Cookies</h2>
            <p>
              The Shadium uses cookies and similar technologies for the following purposes:
            </p>
            
            <h3>Essential Functions</h3>
            <ul>
              <li>Maintain your session while using our service</li>
              <li>Remember your preferences and settings</li>
              <li>Ensure website security and prevent fraud</li>
              <li>Load balancing and performance optimization</li>
            </ul>
            
            <h3>Analytics and Performance</h3>
            <ul>
              <li>Understand how visitors use our website</li>
              <li>Measure and improve website performance</li>
              <li>Track error rates and page load times</li>
              <li>Analyze user interaction patterns</li>
            </ul>
            
            <h3>Functionality</h3>
            <ul>
              <li>Remember your selected stadium preferences</li>
              <li>Store your recent searches and viewed stadiums</li>
              <li>Customize content based on your location</li>
              <li>Remember your cookie consent choices</li>
            </ul>
          </section>

          <section id="types" className={styles.section}>
            <h2>3. Types of Cookies We Use</h2>
            
            <h3>Strictly Necessary Cookies</h3>
            <div className={styles.infoBox}>
              <p><strong>Always Active</strong></p>
              <p>
                These cookies are essential for the website to function and cannot be 
                disabled. They are usually set in response to actions you take, such as 
                setting privacy preferences or filling in forms.
              </p>
            </div>
            
            <table className={styles.cookieTable}>
              <thead>
                <tr>
                  <th>Cookie Name</th>
                  <th>Purpose</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>shadium_session</td>
                  <td>Maintains user session</td>
                  <td>Session</td>
                </tr>
                <tr>
                  <td>cookie_consent</td>
                  <td>Stores cookie consent preferences</td>
                  <td>1 year</td>
                </tr>
                <tr>
                  <td>security_token</td>
                  <td>CSRF protection</td>
                  <td>Session</td>
                </tr>
              </tbody>
            </table>
            
            <h3>Performance Cookies</h3>
            <div className={styles.infoBox}>
              <p><strong>Optional</strong></p>
              <p>
                These cookies help us understand how visitors interact with our website 
                by collecting anonymous information.
              </p>
            </div>
            
            <table className={styles.cookieTable}>
              <thead>
                <tr>
                  <th>Cookie Name</th>
                  <th>Purpose</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>_ga</td>
                  <td>Google Analytics - distinguishes users</td>
                  <td>2 years</td>
                </tr>
                <tr>
                  <td>_gid</td>
                  <td>Google Analytics - distinguishes users</td>
                  <td>24 hours</td>
                </tr>
                <tr>
                  <td>performance_metrics</td>
                  <td>Page load performance tracking</td>
                  <td>30 days</td>
                </tr>
              </tbody>
            </table>
            
            <h3>Functional Cookies</h3>
            <div className={styles.infoBox}>
              <p><strong>Optional</strong></p>
              <p>
                These cookies enable enhanced functionality and personalization.
              </p>
            </div>
            
            <table className={styles.cookieTable}>
              <thead>
                <tr>
                  <th>Cookie Name</th>
                  <th>Purpose</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>stadium_preferences</td>
                  <td>Remembers favorite stadiums</td>
                  <td>1 year</td>
                </tr>
                <tr>
                  <td>user_location</td>
                  <td>Stores approximate location for relevance</td>
                  <td>30 days</td>
                </tr>
                <tr>
                  <td>recent_searches</td>
                  <td>Stores recent search history</td>
                  <td>30 days</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section id="third-party" className={styles.section}>
            <h2>4. Third-Party Cookies</h2>
            <p>
              Some cookies on our site are placed by third-party services that appear 
              on our pages. We do not control these cookies and encourage you to check 
              the third-party websites for more information about their cookies.
            </p>
            
            <h3>Third-Party Services We Use:</h3>
            <ul>
              <li>
                <strong>Google Analytics:</strong> For website analytics
                <br />
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                  Google Privacy Policy
                </a>
              </li>
              <li>
                <strong>Cloudflare:</strong> For security and performance
                <br />
                <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">
                  Cloudflare Privacy Policy
                </a>
              </li>
              <li>
                <strong>Weather APIs:</strong> For real-time weather data
                <br />
                May set cookies for API rate limiting
              </li>
            </ul>
          </section>

          <section id="manage" className={styles.section}>
            <h2>5. Managing Your Cookie Preferences</h2>
            
            <h3>Cookie Consent Tool</h3>
            <p>
              You can manage your cookie preferences at any time using our cookie 
              consent tool. Click the "Cookie Preferences" link in the footer or 
              the cookie icon that appears on our pages.
            </p>
            
            <h3>Browser Settings</h3>
            <p>
              Most web browsers allow you to control cookies through their settings:
            </p>
            <ul>
              <li>
                <strong>Chrome:</strong>{' '}
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
                  Manage cookies in Chrome
                </a>
              </li>
              <li>
                <strong>Firefox:</strong>{' '}
                <a href="https://support.mozilla.org/en-US/kb/cookies-information" target="_blank" rel="noopener noreferrer">
                  Manage cookies in Firefox
                </a>
              </li>
              <li>
                <strong>Safari:</strong>{' '}
                <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer">
                  Manage cookies in Safari
                </a>
              </li>
              <li>
                <strong>Edge:</strong>{' '}
                <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies" target="_blank" rel="noopener noreferrer">
                  Manage cookies in Edge
                </a>
              </li>
            </ul>
            
            <div className={styles.doNotSell}>
              <h3>⚠️ Important Note</h3>
              <p>
                Disabling cookies may affect the functionality of our website. Some 
                features may not work properly without cookies enabled.
              </p>
            </div>
            
            <h3>Opt-Out Links</h3>
            <ul>
              <li>
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
                  Google Analytics Opt-Out
                </a>
              </li>
              <li>
                <a href="https://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer">
                  NAI Opt-Out Tool
                </a>
              </li>
              <li>
                <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer">
                  DAA Opt-Out Tool
                </a>
              </li>
            </ul>
          </section>

          <section id="consent" className={styles.section}>
            <h2>6. Cookie Consent</h2>
            
            <h3>Legal Basis</h3>
            <p>
              We rely on the following legal bases for using cookies:
            </p>
            <ul>
              <li>
                <strong>Consent:</strong> For optional cookies, we obtain your consent 
                before placing them on your device
              </li>
              <li>
                <strong>Legitimate Interests:</strong> For necessary cookies required 
                for security and basic functionality
              </li>
              <li>
                <strong>Legal Compliance:</strong> When required by law or to protect 
                our legal rights
              </li>
            </ul>
            
            <h3>Withdrawing Consent</h3>
            <p>
              You can withdraw your consent for optional cookies at any time through 
              our cookie preferences tool or by contacting us at privacy@theshadium.com.
            </p>
            
            <h3>Geographic Considerations</h3>
            <p>
              Depending on your location, different cookie rules may apply:
            </p>
            <ul>
              <li>
                <strong>European Union:</strong> GDPR cookie consent requirements
              </li>
              <li>
                <strong>California:</strong> CCPA disclosure and opt-out rights
              </li>
              <li>
                <strong>Other Regions:</strong> Local privacy laws may provide 
                additional rights
              </li>
            </ul>
          </section>

          <section id="updates" className={styles.section}>
            <h2>7. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes 
              in our practices or for legal, operational, or regulatory reasons.
            </p>
            
            <p>
              When we make material changes, we will:
            </p>
            <ul>
              <li>Update the "Last Updated" date at the top of this policy</li>
              <li>Notify you through a prominent notice on our website</li>
              <li>Request new consent if required by law</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>8. Contact Us</h2>
            <p>
              If you have questions about our use of cookies or this Cookie Policy, 
              please contact us:
            </p>
            
            <div className={styles.contactInfo}>
              <p><strong>The Shadium Privacy Team</strong></p>
              <p>Email: privacy@theshadium.com</p>
              <p>Subject Line: Cookie Policy Inquiry</p>
            </div>
            
            <p>
              For general inquiries, visit our <Link href="/contact">Contact page</Link>.
            </p>
          </section>

          <div className={styles.acceptanceNotice}>
            <p>
              <strong>This Cookie Policy is part of our Privacy Policy and Terms of 
              Service. By using The Shadium, you agree to our use of cookies as 
              described in this policy.</strong>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookiePolicy;