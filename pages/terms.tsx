import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Legal.module.css';

const TermsOfService: React.FC = () => {
  return (
    <>
      <Head>
        <title>Terms of Service | The Shadium</title>
        <meta name="description" content="Terms of Service for The Shadium - MLB stadium shade finder. Read our terms for using our sun tracking and shade calculation service." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://theshadium.com/terms" />
      </Head>

      <div className={styles.legalContainer}>
        <div className={styles.legalContent}>
          <h1>Terms of Service</h1>
          <p className={styles.lastUpdated}>Last Updated: January 2025</p>
          <p className={styles.effectiveDate}>Effective Date: January 1, 2025</p>

          <section className={styles.section}>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using The Shadium website and services (collectively, the "Service"), 
              you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these 
              Terms, do not use the Service. We may update these Terms at any time, and your continued 
              use of the Service constitutes acceptance of any changes.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Description of Service</h2>
            <p>
              The Shadium provides sun exposure calculations and shade recommendations for Major League 
              Baseball (MLB) stadiums. Our Service includes:
            </p>
            <ul>
              <li>Real-time sun position calculations</li>
              <li>Section-by-section shade analysis</li>
              <li>Weather-adjusted shade predictions</li>
              <li>Stadium seating recommendations</li>
            </ul>
            <p>
              <strong>Important:</strong> Our calculations are estimates based on astronomical algorithms, 
              stadium geometry data, and weather conditions. Actual shade conditions may vary.
            </p>
          </section>

          <section className={styles.section}>
            <h2>3. Disclaimer of Accuracy</h2>
            <p>
              While we strive for accuracy, The Shadium provides shade calculations as estimates only. 
              Actual shade conditions may differ due to:
            </p>
            <ul>
              <li>Weather variations and cloud cover</li>
              <li>Stadium modifications or renovations</li>
              <li>Seasonal variations in sun angle</li>
              <li>Seat-specific obstructions</li>
              <li>Time zone and daylight saving time changes</li>
              <li>Data inaccuracies or calculation errors</li>
            </ul>
            <p>
              <strong>You acknowledge that shade calculations are approximations and should not be 
              solely relied upon for ticket purchasing decisions.</strong>
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. Use License and Restrictions</h2>
            <h3>4.1 Permitted Use</h3>
            <p>
              You may use The Shadium for personal, non-commercial purposes only. This includes 
              planning your stadium visits and sharing information with friends and family.
            </p>
            
            <h3>4.2 Prohibited Uses</h3>
            <p>You may not:</p>
            <ul>
              <li>Use the Service for any commercial purpose without written permission</li>
              <li>Scrape, data mine, or use automated systems to access the Service</li>
              <li>Reproduce, distribute, or create derivative works from our content</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Use the Service to violate any laws or regulations</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Circumvent any access restrictions or security measures</li>
              <li>Impersonate any person or entity</li>
              <li>Resell or redistribute our data or calculations</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. Intellectual Property Rights</h2>
            <p>
              All content, features, and functionality of The Shadium, including but not limited to 
              text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, 
              and software, are the exclusive property of The Shadium or its licensors and are 
              protected by United States and international copyright, trademark, patent, trade secret, 
              and other intellectual property laws.
            </p>
            <p>
              The Shadium™ and Shadium™ are trademarks of The Shadium. You may not use these marks 
              without our prior written permission.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Third-Party Content and Services</h2>
            <p>
              The Service may contain links to third-party websites or services, including MLB team 
              sites, ticket vendors, and weather services. We do not control, endorse, or assume 
              responsibility for any third-party content or services.
            </p>
            <p>
              <strong>MLB Disclaimer:</strong> The Shadium is not affiliated with, endorsed by, or 
              sponsored by Major League Baseball or any MLB team. All team names, logos, and venues 
              are trademarks of their respective owners and are used for informational purposes only.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Privacy and Data Collection</h2>
            <p>
              Your use of the Service is also governed by our{' '}
              <Link href="/privacy">Privacy Policy</Link>, which is incorporated into these Terms 
              by reference. By using the Service, you consent to our data practices as described 
              in the Privacy Policy.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE SHADIUM AND ITS OFFICERS, DIRECTORS, 
              EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
              CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER 
              INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER 
              INTANGIBLE LOSSES, RESULTING FROM:
            </p>
            <ul>
              <li>Your use or inability to use the Service</li>
              <li>Any unauthorized access to or use of our servers</li>
              <li>Any interruption or cessation of transmission to or from the Service</li>
              <li>Any bugs, viruses, or the like transmitted through the Service</li>
              <li>Any errors or omissions in any content</li>
              <li>Any ticket purchases or stadium visits based on our calculations</li>
            </ul>
            <p>
              IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE AMOUNT OF ONE HUNDRED DOLLARS ($100).
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless The Shadium and its officers, 
              directors, employees, and agents from and against any claims, liabilities, damages, 
              judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' 
              fees) arising out of or relating to your violation of these Terms or your use of 
              the Service.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Warranty Disclaimer</h2>
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
              WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF 
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR COURSE OF 
              PERFORMANCE. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, 
              OR SECURE.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. Governing Law and Jurisdiction</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the 
              State of California, without regard to its conflict of law provisions. You agree 
              to submit to the personal and exclusive jurisdiction of the courts located in 
              Los Angeles County, California.
            </p>
          </section>

          <section className={styles.section}>
            <h2>12. Dispute Resolution</h2>
            <p>
              Any dispute arising out of or relating to these Terms or the Service shall be 
              resolved through binding arbitration in accordance with the rules of the American 
              Arbitration Association. The arbitration shall be conducted in Los Angeles, California, 
              and judgment on the award may be entered in any court having jurisdiction.
            </p>
            <p>
              <strong>Class Action Waiver:</strong> You agree that any dispute resolution proceedings 
              will be conducted only on an individual basis and not in a class, consolidated, or 
              representative action.
            </p>
          </section>

          <section className={styles.section}>
            <h2>13. DMCA Policy</h2>
            <p>
              We respect intellectual property rights. If you believe that any content on our 
              Service infringes your copyright, please see our{' '}
              <Link href="/dmca">DMCA Policy</Link> for information on how to report infringement.
            </p>
          </section>

          <section className={styles.section}>
            <h2>14. Termination</h2>
            <p>
              We may terminate or suspend your access to the Service immediately, without prior 
              notice or liability, for any reason, including breach of these Terms. Upon termination, 
              your right to use the Service will immediately cease.
            </p>
          </section>

          <section className={styles.section}>
            <h2>15. Severability</h2>
            <p>
              If any provision of these Terms is held to be invalid or unenforceable, the remaining 
              provisions shall continue in full force and effect.
            </p>
          </section>

          <section className={styles.section}>
            <h2>16. Entire Agreement</h2>
            <p>
              These Terms, together with our Privacy Policy and any other legal notices published 
              on the Service, constitute the entire agreement between you and The Shadium regarding 
              the use of the Service.
            </p>
          </section>

          <section className={styles.section}>
            <h2>17. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className={styles.contactInfo}>
              <p>The Shadium</p>
              <p>Email: legal@theshadium.com</p>
              <p>Website: https://theshadium.com</p>
            </div>
          </section>

          <section className={styles.section}>
            <h2>18. California Residents</h2>
            <p>
              If you are a California resident, you may have additional rights under California law. 
              Please see our <Link href="/privacy#california">California Privacy Rights</Link> section 
              for more information.
            </p>
          </section>

          <div className={styles.acceptanceNotice}>
            <p>
              <strong>By using The Shadium, you acknowledge that you have read, understood, and 
              agree to be bound by these Terms of Service.</strong>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsOfService;