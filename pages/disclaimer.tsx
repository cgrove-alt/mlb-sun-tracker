import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Legal.module.css';

const Disclaimer: React.FC = () => {
  return (
    <>
      <Head>
        <title>Disclaimers | The Shadium</title>
        <meta name="description" content="Important disclaimers for The Shadium MLB stadium shade finder. Understand the limitations and proper use of our shade calculations." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://theshadium.com/disclaimer" />
      </Head>

      <div className={styles.legalContainer}>
        <div className={styles.legalContent}>
          <h1>Legal Disclaimers</h1>
          <p className={styles.lastUpdated}>Last Updated: January 2025</p>

          <div className={styles.tableOfContents}>
            <h2>Important Disclaimers</h2>
            <ul>
              <li><a href="#accuracy">Accuracy Disclaimer</a></li>
              <li><a href="#medical">Medical & Health Disclaimer</a></li>
              <li><a href="#affiliation">No Affiliation Disclaimer</a></li>
              <li><a href="#financial">Financial Disclaimer</a></li>
              <li><a href="#warranty">Warranty Disclaimer</a></li>
              <li><a href="#liability">Limitation of Liability</a></li>
              <li><a href="#third-party">Third-Party Disclaimer</a></li>
              <li><a href="#endorsement">No Endorsement</a></li>
            </ul>
          </div>

          <section id="accuracy" className={styles.section}>
            <h2>1. Accuracy Disclaimer</h2>
            <div className={styles.doNotSell}>
              <h3>⚠️ IMPORTANT NOTICE</h3>
              <p>
                <strong>All shade calculations provided by The Shadium are ESTIMATES ONLY and 
                should not be solely relied upon for ticket purchasing decisions.</strong>
              </p>
            </div>
            
            <p>
              While we strive to provide accurate sun and shade calculations, actual conditions 
              at stadiums may vary significantly from our predictions due to numerous factors:
            </p>
            
            <h3>Factors Affecting Accuracy:</h3>
            <ul>
              <li><strong>Weather Conditions:</strong> Cloud cover, storms, and atmospheric conditions can dramatically alter sun exposure</li>
              <li><strong>Stadium Modifications:</strong> Renovations, new structures, or temporary installations may affect shade patterns</li>
              <li><strong>Seasonal Variations:</strong> Sun angles change throughout the year</li>
              <li><strong>Time Variations:</strong> Daylight saving time and game delays affect sun position</li>
              <li><strong>Seat-Specific Factors:</strong> Individual seats may have unique obstructions not captured in our model</li>
              <li><strong>Data Limitations:</strong> Our calculations are based on available stadium geometry data which may be incomplete</li>
              <li><strong>Calculation Errors:</strong> Despite our best efforts, computational errors may occur</li>
              <li><strong>Row and Seat Variations:</strong> Shade can vary significantly even within the same section</li>
            </ul>
            
            <p>
              <strong>Users acknowledge and accept that The Shadium cannot guarantee the accuracy 
              of shade predictions and should use this information as one of many factors when 
              making seating decisions.</strong>
            </p>
          </section>

          <section id="medical" className={styles.section}>
            <h2>2. Medical & Health Disclaimer</h2>
            <div className={styles.doNotSell}>
              <h3>☀️ SUN EXPOSURE WARNING</h3>
              <p>
                <strong>Prolonged sun exposure can cause serious health issues including skin 
                cancer, heat stroke, dehydration, and sun burns.</strong>
              </p>
            </div>
            
            <p>
              The Shadium provides shade calculations for comfort and convenience purposes only. 
              We are NOT providing medical or health advice.
            </p>
            
            <h3>Health Recommendations:</h3>
            <ul>
              <li>Always use appropriate sun protection regardless of predicted shade</li>
              <li>Wear sunscreen with appropriate SPF rating</li>
              <li>Bring and wear protective clothing, hats, and sunglasses</li>
              <li>Stay hydrated, especially during hot weather</li>
              <li>Seek medical attention if you experience heat-related illness</li>
              <li>Consult with healthcare providers about sun exposure risks</li>
              <li>Be aware of UV index and heat warnings</li>
            </ul>
            
            <p>
              <strong>Individuals with sun sensitivity, medical conditions affected by sun exposure, 
              or taking medications that increase sun sensitivity should take extra precautions 
              regardless of our shade predictions.</strong>
            </p>
            
            <p>
              The Shadium is not responsible for any health issues, injuries, or medical conditions 
              resulting from sun exposure at sporting events.
            </p>
          </section>

          <section id="affiliation" className={styles.section}>
            <h2>3. No Affiliation Disclaimer</h2>
            <p>
              <strong>The Shadium is an independent service and is NOT affiliated with, endorsed by, 
              sponsored by, or officially connected with:</strong>
            </p>
            <ul>
              <li>Major League Baseball (MLB)</li>
              <li>Any MLB team or franchise</li>
              <li>Minor League Baseball (MiLB)</li>
              <li>National Football League (NFL)</li>
              <li>Any professional sports team or league</li>
              <li>Any stadium or venue operator</li>
              <li>Any ticket vendor or reseller</li>
            </ul>
            
            <p>
              All team names, logos, stadiums, and other trademarked content referenced on this 
              site are the property of their respective owners and are used for informational 
              purposes only under fair use doctrine.
            </p>
            
            <p>
              Our use of team and stadium names does not imply any affiliation with or endorsement 
              by these entities.
            </p>
          </section>

          <section id="financial" className={styles.section}>
            <h2>4. Financial Disclaimer</h2>
            <p>
              <strong>The Shadium does not provide financial, investment, or purchasing advice.</strong>
            </p>
            
            <p>
              Any decisions to purchase tickets based on our shade calculations are made at your 
              own risk. We are not responsible for:
            </p>
            <ul>
              <li>Ticket purchase decisions or costs</li>
              <li>Changes in ticket value or resale prices</li>
              <li>Refunds or exchanges related to sun/shade conditions</li>
              <li>Travel or accommodation expenses</li>
              <li>Any financial losses related to use of our service</li>
            </ul>
            
            <p>
              We do not guarantee that shaded seats will be available, affordable, or provide 
              the expected comfort level.
            </p>
          </section>

          <section id="warranty" className={styles.section}>
            <h2>5. Warranty Disclaimer</h2>
            <p>
              THE SHADIUM SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES 
              OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul>
              <li>IMPLIED WARRANTIES OF MERCHANTABILITY</li>
              <li>FITNESS FOR A PARTICULAR PURPOSE</li>
              <li>NON-INFRINGEMENT</li>
              <li>ACCURACY OR RELIABILITY OF INFORMATION</li>
              <li>UNINTERRUPTED OR ERROR-FREE SERVICE</li>
              <li>SECURITY OF THE SERVICE</li>
            </ul>
            
            <p>
              We do not warrant that:
            </p>
            <ul>
              <li>The Service will meet your requirements or expectations</li>
              <li>The Service will be available at any particular time or location</li>
              <li>Any defects or errors will be corrected</li>
              <li>The Service is free of viruses or harmful components</li>
              <li>The results obtained from using the Service will be accurate or reliable</li>
            </ul>
          </section>

          <section id="liability" className={styles.section}>
            <h2>6. Limitation of Liability</h2>
            <p>
              TO THE FULLEST EXTENT PERMITTED BY LAW, THE SHADIUM SHALL NOT BE LIABLE FOR ANY:
            </p>
            <ul>
              <li>DIRECT, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES</li>
              <li>LOST PROFITS OR REVENUE</li>
              <li>LOSS OF DATA OR USE</li>
              <li>COSTS OF SUBSTITUTE SERVICES</li>
              <li>PERSONAL INJURY OR PROPERTY DAMAGE</li>
              <li>EMOTIONAL DISTRESS</li>
            </ul>
            
            <p>
              This limitation applies whether the alleged liability is based on contract, tort, 
              negligence, strict liability, or any other basis, even if The Shadium has been 
              advised of the possibility of such damage.
            </p>
            
            <p>
              <strong>IN NO EVENT SHALL OUR CUMULATIVE LIABILITY EXCEED ONE HUNDRED DOLLARS ($100).</strong>
            </p>
          </section>

          <section id="third-party" className={styles.section}>
            <h2>7. Third-Party Content Disclaimer</h2>
            <p>
              The Shadium may contain links to third-party websites, advertisements, services, 
              or content. We do not:
            </p>
            <ul>
              <li>Control or endorse third-party content</li>
              <li>Guarantee the accuracy of third-party information</li>
              <li>Take responsibility for third-party practices or policies</li>
              <li>Warrant the safety or reliability of third-party sites</li>
            </ul>
            
            <p>
              Your interactions with third-party sites and services are solely between you and 
              the third party. We encourage you to review their terms and privacy policies.
            </p>
          </section>

          <section id="endorsement" className={styles.section}>
            <h2>8. No Endorsement Disclaimer</h2>
            <p>
              Reference to any products, services, processes, or other information by trade name, 
              trademark, manufacturer, supplier, or otherwise does not constitute or imply:
            </p>
            <ul>
              <li>Endorsement or recommendation by The Shadium</li>
              <li>Sponsorship or affiliation</li>
              <li>Warranty or guarantee of quality</li>
            </ul>
            
            <p>
              The views and opinions expressed on The Shadium are solely those of the service 
              and do not reflect the views of any sports league, team, or venue.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Changes to Disclaimers</h2>
            <p>
              We reserve the right to update these disclaimers at any time. Changes will be 
              effective immediately upon posting. Your continued use of The Shadium after any 
              changes indicates acceptance of the updated disclaimers.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Contact Information</h2>
            <p>
              If you have questions about these disclaimers, please contact:
            </p>
            <div className={styles.contactInfo}>
              <p>The Shadium Legal Department</p>
              <p>Email: legal@theshadium.com</p>
              <p>Website: https://theshadium.com</p>
            </div>
          </section>

          <div className={styles.acceptanceNotice}>
            <p>
              <strong>BY USING THE SHADIUM, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, 
              AND AGREE TO ALL DISCLAIMERS STATED ABOVE.</strong>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Disclaimer;