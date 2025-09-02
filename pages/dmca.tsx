import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Legal.module.css';

const DMCAPolicy: React.FC = () => {
  return (
    <>
      <Head>
        <title>DMCA Policy | The Shadium</title>
        <meta name="description" content="DMCA Policy and copyright infringement procedures for The Shadium. Learn how to report copyright violations." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://theshadium.com/dmca" />
      </Head>

      <div className={styles.legalContainer}>
        <div className={styles.legalContent}>
          <h1>DMCA Policy</h1>
          <p className={styles.lastUpdated}>Last Updated: January 2025</p>
          <p className={styles.effectiveDate}>Digital Millennium Copyright Act Compliance</p>

          <section className={styles.section}>
            <h2>1. Copyright Policy</h2>
            <p>
              The Shadium respects the intellectual property rights of others and expects users 
              of our Service to do the same. In accordance with the Digital Millennium Copyright 
              Act of 1998 ("DMCA"), we will respond expeditiously to claims of copyright 
              infringement committed using our Service.
            </p>
            <p>
              If you believe that your copyrighted work has been copied in a way that constitutes 
              copyright infringement and is accessible on our Service, please notify our copyright 
              agent as set forth below.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. DMCA Takedown Notice</h2>
            <p>
              To file a DMCA takedown notice, please provide our Designated Copyright Agent with 
              the following information in writing:
            </p>
            
            <h3>Required Information:</h3>
            <ol>
              <li>
                <strong>Identification of the copyrighted work</strong> claimed to have been 
                infringed, or, if multiple copyrighted works are covered by a single notification, 
                a representative list of such works.
              </li>
              <li>
                <strong>Identification of the material</strong> that is claimed to be infringing 
                or to be the subject of infringing activity and that is to be removed or access 
                to which is to be disabled, and information reasonably sufficient to permit us 
                to locate the material (including specific URLs).
              </li>
              <li>
                <strong>Contact information</strong> for the complaining party, including name, 
                address, telephone number, and email address.
              </li>
              <li>
                <strong>A statement</strong> that the complaining party has a good faith belief 
                that use of the material in the manner complained of is not authorized by the 
                copyright owner, its agent, or the law.
              </li>
              <li>
                <strong>A statement</strong> that the information in the notification is accurate, 
                and under penalty of perjury, that the complaining party is authorized to act on 
                behalf of the owner of an exclusive right that is allegedly infringed.
              </li>
              <li>
                <strong>Physical or electronic signature</strong> of a person authorized to act 
                on behalf of the owner of an exclusive right that is allegedly infringed.
              </li>
            </ol>
          </section>

          <section className={styles.section}>
            <h2>3. Designated Copyright Agent</h2>
            <div className={styles.contactInfo}>
              <p><strong>The Shadium DMCA Agent</strong></p>
              <p>Email: dmca@theshadium.com</p>
              <p>
                Mailing Address:<br />
                The Shadium<br />
                Attn: DMCA Agent<br />
                [Physical Address]<br />
                [City, State ZIP]
              </p>
            </div>
            
            <p>
              <strong>Note:</strong> This contact information is only for copyright infringement 
              notices. For other inquiries, please use the appropriate contact methods listed on 
              our <Link href="/contact">Contact page</Link>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. Counter-Notification</h2>
            <p>
              If you believe that your content was removed or access to it was disabled by mistake 
              or misidentification, you may file a counter-notification with our Copyright Agent.
            </p>
            
            <h3>Counter-Notification Must Include:</h3>
            <ol>
              <li>
                <strong>Your physical or electronic signature</strong>
              </li>
              <li>
                <strong>Identification of the material</strong> that has been removed or to which 
                access has been disabled and the location at which the material appeared before 
                it was removed or access was disabled
              </li>
              <li>
                <strong>A statement under penalty of perjury</strong> that you have a good faith 
                belief that the material was removed or disabled as a result of mistake or 
                misidentification
              </li>
              <li>
                <strong>Your name, address, and telephone number</strong>, and a statement that 
                you consent to the jurisdiction of the Federal District Court for the judicial 
                district in which your address is located (or Los Angeles County, California if 
                your address is outside of the United States), and that you will accept service 
                of process from the person who provided the original DMCA notification or an 
                agent of such person
              </li>
            </ol>
            
            <p>
              Upon receipt of a valid counter-notification, we will forward it to the original 
              complaining party. If we do not receive notice within 10 business days that the 
              complaining party has filed an action seeking a court order to restrain you from 
              engaging in the allegedly infringing activity, we may restore the removed content.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Repeat Infringers</h2>
            <p>
              In accordance with the DMCA and other applicable law, The Shadium has adopted a 
              policy of terminating, in appropriate circumstances and at our sole discretion, 
              users who are deemed to be repeat infringers. We may also, at our sole discretion, 
              limit access to the Service and/or terminate the accounts of any users who infringe 
              any intellectual property rights of others, whether or not there is any repeat 
              infringement.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. False Claims</h2>
            <div className={styles.doNotSell}>
              <h3>⚠️ WARNING</h3>
              <p>
                <strong>Under Section 512(f) of the DMCA, any person who knowingly materially 
                misrepresents that material or activity is infringing may be subject to 
                liability for damages.</strong>
              </p>
            </div>
            <p>
              Before filing a DMCA notification, please carefully consider whether the use of 
              the material at issue is protected by the fair use doctrine. If you are unsure 
              whether material infringes your copyright, you should first contact an attorney.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Fair Use</h2>
            <p>
              The Shadium recognizes that the fair use doctrine permits limited use of copyrighted 
              material for purposes such as criticism, comment, news reporting, teaching, scholarship, 
              or research. We consider fair use factors when evaluating takedown notices, including:
            </p>
            <ul>
              <li>The purpose and character of the use</li>
              <li>The nature of the copyrighted work</li>
              <li>The amount and substantiality of the portion used</li>
              <li>The effect of the use upon the potential market for the copyrighted work</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>8. Our Intellectual Property</h2>
            <p>
              The Shadium owns and retains all rights to our original content, including but not 
              limited to:
            </p>
            <ul>
              <li>Shade calculation algorithms and methodologies</li>
              <li>Website design and layout</li>
              <li>Original text, graphics, and images</li>
              <li>The Shadium™ and Shadium™ trademarks</li>
              <li>Proprietary data compilations</li>
            </ul>
            <p>
              Unauthorized use of our intellectual property is prohibited and may result in legal 
              action. For licensing inquiries, please contact legal@theshadium.com
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Third-Party Content</h2>
            <p>
              The Shadium uses certain third-party content under fair use doctrine, including:
            </p>
            <ul>
              <li>Stadium names and team names for informational purposes</li>
              <li>Publicly available stadium geometry data</li>
              <li>Weather data from authorized APIs</li>
            </ul>
            <p>
              All third-party trademarks and content remain the property of their respective owners.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Questions</h2>
            <p>
              If you have questions about this DMCA Policy, please contact us at:
            </p>
            <div className={styles.contactInfo}>
              <p>Email: legal@theshadium.com</p>
              <p>Subject Line: DMCA Policy Question</p>
            </div>
          </section>

          <div className={styles.acceptanceNotice}>
            <p>
              <strong>This DMCA Policy is part of our Terms of Service. By using The Shadium, 
              you agree to comply with this policy.</strong>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default DMCAPolicy;