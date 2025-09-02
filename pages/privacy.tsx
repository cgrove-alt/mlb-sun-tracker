import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Legal.module.css';

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy | The Shadium</title>
        <meta name="description" content="Privacy Policy for The Shadium. Learn how we protect your data and respect your privacy while providing MLB stadium shade calculations." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://theshadium.com/privacy" />
      </Head>

      <div className={styles.legalContainer}>
        <div className={styles.legalContent}>
          <h1>Privacy Policy</h1>
          <p className={styles.lastUpdated}>Last Updated: January 2025</p>
          <p className={styles.effectiveDate}>Effective Date: January 1, 2025</p>

          <div className={styles.tableOfContents}>
            <h2>Table of Contents</h2>
            <ul>
              <li><a href="#overview">Overview</a></li>
              <li><a href="#information-we-collect">Information We Collect</a></li>
              <li><a href="#how-we-use">How We Use Your Information</a></li>
              <li><a href="#data-sharing">Data Sharing and Disclosure</a></li>
              <li><a href="#data-retention">Data Retention</a></li>
              <li><a href="#your-rights">Your Privacy Rights</a></li>
              <li><a href="#california">California Privacy Rights (CCPA)</a></li>
              <li><a href="#gdpr">European Privacy Rights (GDPR)</a></li>
              <li><a href="#cookies">Cookies and Tracking</a></li>
              <li><a href="#security">Data Security</a></li>
              <li><a href="#children">Children's Privacy</a></li>
              <li><a href="#changes">Changes to This Policy</a></li>
              <li><a href="#contact">Contact Information</a></li>
            </ul>
          </div>

          <section id="overview" className={styles.section}>
            <h2>1. Overview</h2>
            <p>
              The Shadium ("we," "our," or "us") is committed to protecting your privacy. This 
              Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you use our website and services at theshadium.com (the "Service").
            </p>
            <p>
              By using our Service, you consent to the data practices described in this policy. 
              If you do not agree with this policy, please do not use our Service.
            </p>
          </section>

          <section id="information-we-collect" className={styles.section}>
            <h2>2. Information We Collect</h2>
            
            <h3>2.1 Information You Provide</h3>
            <ul>
              <li><strong>Contact Information:</strong> Email address when you contact us</li>
              <li><strong>Preferences:</strong> Stadium selections, date/time preferences, shade preferences</li>
              <li><strong>Feedback:</strong> Comments, suggestions, or reports you submit</li>
            </ul>

            <h3>2.2 Information Automatically Collected</h3>
            <ul>
              <li><strong>Device Information:</strong> Browser type, operating system, device type, screen resolution</li>
              <li><strong>Usage Data:</strong> Pages visited, features used, click patterns, time spent on pages</li>
              <li><strong>Location Data:</strong> Approximate location based on IP address (city/state level)</li>
              <li><strong>Log Data:</strong> IP address, access times, referring URLs</li>
            </ul>

            <h3>2.3 Cookies and Similar Technologies</h3>
            <p>
              We use cookies and similar tracking technologies to enhance your experience. 
              For details, see our <Link href="/cookies">Cookie Policy</Link>.
            </p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand usage patterns (Google Analytics)</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and choices</li>
              <li><strong>Performance Cookies:</strong> Monitor site performance and load times</li>
            </ul>
          </section>

          <section id="how-we-use" className={styles.section}>
            <h2>3. How We Use Your Information</h2>
            <p>We use collected information for the following purposes:</p>
            <ul>
              <li>Provide and maintain our Service</li>
              <li>Calculate sun positions and shade recommendations</li>
              <li>Remember your preferences for future visits</li>
              <li>Improve and optimize our Service</li>
              <li>Analyze usage patterns and trends</li>
              <li>Respond to your inquiries and support requests</li>
              <li>Send service-related announcements</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section id="data-sharing" className={styles.section}>
            <h2>4. Data Sharing and Disclosure</h2>
            <p>
              We do not sell, trade, or rent your personal information. We may share information 
              in the following circumstances:
            </p>
            
            <h3>4.1 Service Providers</h3>
            <ul>
              <li><strong>Google Analytics:</strong> For usage analytics (anonymized data)</li>
              <li><strong>Weather APIs:</strong> Location data for weather information</li>
              <li><strong>Hosting Providers:</strong> For website infrastructure</li>
            </ul>

            <h3>4.2 Legal Requirements</h3>
            <p>We may disclose information if required by law or in response to:</p>
            <ul>
              <li>Court orders or subpoenas</li>
              <li>Government requests</li>
              <li>Legal proceedings</li>
              <li>Protection of our rights or safety</li>
            </ul>

            <h3>4.3 Business Transfers</h3>
            <p>
              In the event of a merger, acquisition, or sale of assets, your information may 
              be transferred to the acquiring entity.
            </p>
          </section>

          <section id="data-retention" className={styles.section}>
            <h2>5. Data Retention</h2>
            <p>We retain information for different periods depending on the type:</p>
            <ul>
              <li><strong>Usage Analytics:</strong> 26 months (Google Analytics default)</li>
              <li><strong>Local Storage Preferences:</strong> Until cleared by user</li>
              <li><strong>Server Logs:</strong> 90 days</li>
              <li><strong>Contact Communications:</strong> 3 years or as required by law</li>
            </ul>
          </section>

          <section id="your-rights" className={styles.section}>
            <h2>6. Your Privacy Rights</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your information</li>
              <li><strong>Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Opt-out:</strong> Opt-out of certain data collection</li>
              <li><strong>Non-discrimination:</strong> Not be discriminated against for exercising rights</li>
            </ul>
            <p>
              To exercise these rights, contact us at privacy@theshadium.com
            </p>
          </section>

          <section id="california" className={styles.section}>
            <h2>7. California Privacy Rights (CCPA)</h2>
            <p>
              If you are a California resident, you have additional rights under the California 
              Consumer Privacy Act (CCPA):
            </p>
            
            <h3>7.1 Right to Know</h3>
            <p>You can request information about:</p>
            <ul>
              <li>Categories of personal information collected</li>
              <li>Sources of information</li>
              <li>Business purposes for collection</li>
              <li>Categories of third parties with whom we share information</li>
            </ul>

            <h3>7.2 Right to Delete</h3>
            <p>
              You can request deletion of your personal information, subject to certain exceptions.
            </p>

            <h3>7.3 Right to Opt-Out</h3>
            <p>
              We do not sell personal information. However, you can opt-out of analytics by 
              using browser settings or opt-out tools.
            </p>

            <h3>7.4 Non-Discrimination</h3>
            <p>
              We will not discriminate against you for exercising your CCPA rights.
            </p>

            <h3>7.5 Authorized Agent</h3>
            <p>
              You may designate an authorized agent to make requests on your behalf.
            </p>

            <div className={styles.doNotSell}>
              <h3>Do Not Sell My Personal Information</h3>
              <p>
                We do not sell personal information. California residents can confirm this by 
                contacting privacy@theshadium.com
              </p>
            </div>
          </section>

          <section id="gdpr" className={styles.section}>
            <h2>8. European Privacy Rights (GDPR)</h2>
            <p>
              If you are in the European Economic Area (EEA), you have rights under the 
              General Data Protection Regulation (GDPR):
            </p>

            <h3>8.1 Legal Basis for Processing</h3>
            <p>We process personal data based on:</p>
            <ul>
              <li><strong>Consent:</strong> You have consented to processing</li>
              <li><strong>Legitimate Interests:</strong> Processing is necessary for our legitimate interests</li>
              <li><strong>Legal Obligation:</strong> Processing is required by law</li>
            </ul>

            <h3>8.2 Your GDPR Rights</h3>
            <ul>
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Right to withdraw consent</li>
            </ul>

            <h3>8.3 Data Protection Officer</h3>
            <p>
              For GDPR inquiries, contact our Data Protection Officer at dpo@theshadium.com
            </p>

            <h3>8.4 Supervisory Authority</h3>
            <p>
              You have the right to lodge a complaint with your local data protection authority.
            </p>
          </section>

          <section id="cookies" className={styles.section}>
            <h2>9. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar technologies to enhance your experience. 
              For detailed information, please see our <Link href="/cookies">Cookie Policy</Link>.
            </p>
            
            <h3>9.1 Managing Cookies</h3>
            <p>You can control cookies through:</p>
            <ul>
              <li>Browser settings</li>
              <li>Our cookie consent banner</li>
              <li>Google Analytics opt-out browser add-on</li>
            </ul>
          </section>

          <section id="security" className={styles.section}>
            <h2>10. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your 
              information, including:
            </p>
            <ul>
              <li>HTTPS encryption for data transmission</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
              <li>Regular software updates and patches</li>
            </ul>
            <p>
              However, no method of transmission or storage is 100% secure. While we strive 
              to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section id="children" className={styles.section}>
            <h2>11. Children's Privacy</h2>
            <p>
              Our Service is not directed to children under 13. We do not knowingly collect 
              personal information from children under 13. If you are a parent or guardian 
              and believe we have collected information from your child, please contact us 
              immediately at privacy@theshadium.com
            </p>
          </section>

          <section id="international" className={styles.section}>
            <h2>12. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in the United States. 
              By using our Service, you consent to the transfer of information to countries 
              outside your country of residence, which may have different data protection rules.
            </p>
          </section>

          <section id="changes" className={styles.section}>
            <h2>13. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of 
              material changes by:
            </p>
            <ul>
              <li>Updating the "Last Updated" date</li>
              <li>Posting a notice on our website</li>
              <li>Sending an email (if we have your address)</li>
            </ul>
            <p>
              Your continued use of the Service after changes constitutes acceptance of the 
              updated policy.
            </p>
          </section>

          <section id="contact" className={styles.section}>
            <h2>14. Contact Information</h2>
            <p>
              For questions, concerns, or to exercise your privacy rights, contact us at:
            </p>
            <div className={styles.contactInfo}>
              <p><strong>The Shadium</strong></p>
              <p>Email: privacy@theshadium.com</p>
              <p>Data Protection Officer: dpo@theshadium.com</p>
              <p>Website: https://theshadium.com</p>
              <p>Response Time: Within 30 days</p>
            </div>

            <h3>Privacy Rights Requests</h3>
            <p>
              To submit a privacy rights request, email privacy@theshadium.com with:
            </p>
            <ul>
              <li>Your name and email address</li>
              <li>The specific right you wish to exercise</li>
              <li>Any relevant details about your request</li>
            </ul>
          </section>

          <div className={styles.acceptanceNotice}>
            <p>
              <strong>By using The Shadium, you acknowledge that you have read and understood 
              this Privacy Policy and agree to our data practices.</strong>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;