import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | The Shadium',
  description: 'Terms of service for The Shadium. Read our terms for using our MLB stadium shade finder.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="page-container prose prose-slate max-w-prose mx-auto px-4 py-8 stack">
      <h1 className="h1 break-words md:break-normal">Terms of Service</h1>
      <p className="text-sm text-gray-600">Last Updated: January 2025</p>
      <p className="text-sm text-gray-600">Effective Date: January 1, 2025</p>
      
      <nav className="bg-gray-50 p-4 rounded-lg">
        <h2 className="h3 mb-2">Table of Contents</h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><a href="#acceptance" className="text-blue-600 hover:underline">Acceptance of Terms</a></li>
          <li><a href="#service-description" className="text-blue-600 hover:underline">Service Description</a></li>
          <li><a href="#eligibility" className="text-blue-600 hover:underline">Eligibility</a></li>
          <li><a href="#acceptable-use" className="text-blue-600 hover:underline">Acceptable Use</a></li>
          <li><a href="#intellectual-property" className="text-blue-600 hover:underline">Intellectual Property</a></li>
          <li><a href="#disclaimers" className="text-blue-600 hover:underline">Disclaimers</a></li>
          <li><a href="#limitation-liability" className="text-blue-600 hover:underline">Limitation of Liability</a></li>
          <li><a href="#indemnification" className="text-blue-600 hover:underline">Indemnification</a></li>
          <li><a href="#termination" className="text-blue-600 hover:underline">Termination</a></li>
          <li><a href="#governing-law" className="text-blue-600 hover:underline">Governing Law</a></li>
          <li><a href="#changes" className="text-blue-600 hover:underline">Changes to Terms</a></li>
        </ul>
      </nav>

      <section id="acceptance" className="stack">
        <h2 className="h2">1. Acceptance of Terms</h2>
        <p>
          By accessing or using The Shadium website and services ("Service"), you ("User" or "you") 
          agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, 
          you may not access or use our Service.
        </p>
        <p>
          These Terms constitute a legally binding agreement between you and The Shadium. By using 
          our Service, you represent that you have the legal authority to enter into these Terms.
        </p>
      </section>
      
      <section id="service-description" className="stack">
        <h2 className="h2">2. Service Description</h2>
        <p>
          The Shadium provides sun exposure calculations and shade recommendations for sports venues, 
          primarily Major League Baseball (MLB) stadiums. Our Service includes:
        </p>
        
        <ul>
          <li><strong>Shade Calculations:</strong> Estimates of sun exposure based on time, date, and venue</li>
          <li><strong>Seating Recommendations:</strong> Suggestions for optimal seating based on shade preferences</li>
          <li><strong>Weather Integration:</strong> Real-time weather data to enhance accuracy</li>
          <li><strong>Venue Information:</strong> Details about stadium layouts and seating arrangements</li>
          <li><strong>Educational Content:</strong> Guides and tips for optimal game-day experiences</li>
        </ul>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p>
            <strong>Important:</strong> All calculations are estimates based on algorithms and available data. 
            Actual conditions may vary significantly due to weather, stadium modifications, and other factors.
          </p>
        </div>
      </section>

      <section id="eligibility" className="stack">
        <h2 className="h2">3. Eligibility</h2>
        <p>You must be at least 13 years old to use our Service. By using our Service, you represent that:</p>
        
        <ul>
          <li>You are at least 13 years of age</li>
          <li>You have the legal capacity to enter into these Terms</li>
          <li>Your use of the Service complies with all applicable laws</li>
          <li>All information you provide is accurate and truthful</li>
        </ul>

        <p>
          If you are between 13 and 18 years old, you confirm that you have reviewed these Terms 
          with a parent or guardian and that they agree to these Terms on your behalf.
        </p>
      </section>

      <section id="acceptable-use" className="stack">
        <h2 className="h2">4. Acceptable Use</h2>
        
        <h3 className="h3">Permitted Uses</h3>
        <p>You may use our Service for:</p>
        <ul>
          <li>Personal, non-commercial purposes related to attending sporting events</li>
          <li>Educational purposes and research</li>
          <li>Sharing information with friends and family for event planning</li>
        </ul>

        <h3 className="h3">Prohibited Uses</h3>
        <p>You may NOT:</p>
        <ul>
          <li><strong>Commercial Use:</strong> Use our Service for commercial purposes without written permission</li>
          <li><strong>Data Scraping:</strong> Extract, harvest, or scrape data using automated tools</li>
          <li><strong>Reverse Engineering:</strong> Attempt to reverse engineer or copy our algorithms</li>
          <li><strong>Harmful Activities:</strong> Use the Service to harm, harass, or deceive others</li>
          <li><strong>Security Violations:</strong> Attempt to breach our security measures</li>
          <li><strong>Illegal Activities:</strong> Use the Service for any illegal or unauthorized purposes</li>
          <li><strong>System Interference:</strong> Disrupt or interfere with the Service's functionality</li>
        </ul>

        <h3 className="h3">Content Guidelines</h3>
        <p>Any content you submit (feedback, comments, etc.) must:</p>
        <ul>
          <li>Be accurate and not misleading</li>
          <li>Not infringe on others' intellectual property rights</li>
          <li>Not contain harmful, offensive, or inappropriate material</li>
          <li>Comply with all applicable laws and regulations</li>
        </ul>
      </section>
      
      <section id="intellectual-property" className="stack">
        <h2 className="h2">5. Intellectual Property Rights</h2>
        
        <h3 className="h3">Our Content</h3>
        <p>
          All content, features, and functionality of our Service are owned by The Shadium and are 
          protected by copyright, trademark, and other intellectual property laws. This includes:
        </p>
        <ul>
          <li>Software code and algorithms</li>
          <li>Website design and user interface</li>
          <li>Logos, trademarks, and branding</li>
          <li>Written content and guides</li>
          <li>Data compilations and analyses</li>
        </ul>

        <h3 className="h3">Third-Party Content</h3>
        <p>
          Some content on our Service may be owned by third parties (team names, stadium names, etc.). 
          We use such content under fair use provisions or with appropriate permissions for informational purposes only.
        </p>

        <h3 className="h3">User License</h3>
        <p>
          We grant you a limited, non-exclusive, non-transferable license to access and use our Service 
          for personal, non-commercial purposes in accordance with these Terms.
        </p>

        <h3 className="h3">User-Generated Content</h3>
        <p>
          By submitting content to our Service (feedback, comments, etc.), you grant us a worldwide, 
          royalty-free, perpetual license to use, modify, and display such content in connection with our Service.
        </p>
      </section>
      
      <section id="disclaimers" className="stack">
        <h2 className="h2">6. Disclaimers</h2>
        
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
          <h3 className="h4 text-red-800">⚠️ IMPORTANT DISCLAIMERS</h3>
          <p className="text-red-700">
            <strong>OUR SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND.</strong>
          </p>
        </div>

        <h3 className="h3">Accuracy Disclaimer</h3>
        <p>
          While we strive for accuracy, our shade calculations are estimates that may vary based on:
        </p>
        <ul>
          <li>Weather conditions (cloud cover, haze, atmospheric conditions)</li>
          <li>Stadium modifications or construction not reflected in our data</li>
          <li>Seasonal variations in sun positioning</li>
          <li>Game delays, schedule changes, or timing variations</li>
          <li>Individual seating variations and personal factors</li>
          <li>Data currency and accuracy limitations</li>
        </ul>

        <h3 className="h3">No Warranties</h3>
        <p>We disclaim all warranties, including:</p>
        <ul>
          <li><strong>Merchantability:</strong> No warranty that the Service is suitable for commercial use</li>
          <li><strong>Fitness for Purpose:</strong> No warranty that the Service meets your specific needs</li>
          <li><strong>Non-Infringement:</strong> No warranty against third-party intellectual property claims</li>
          <li><strong>Availability:</strong> No warranty of uninterrupted or error-free service</li>
          <li><strong>Security:</strong> No warranty against security breaches or data loss</li>
        </ul>

        <h3 className="h3">Third-Party Disclaimer</h3>
        <p>
          We are not affiliated with MLB, any sports teams, venues, or ticket vendors. Our use of team/venue 
          names is for informational purposes only and does not imply endorsement or partnership.
        </p>
      </section>
      
      <section id="limitation-liability" className="stack">
        <h2 className="h2">7. Limitation of Liability</h2>
        
        <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
          <p>
            <strong>TO THE FULLEST EXTENT PERMITTED BY LAW, THE SHADIUM SHALL NOT BE LIABLE FOR ANY 
            DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.</strong>
          </p>
        </div>

        <h3 className="h3">Excluded Damages</h3>
        <p>We are not liable for damages resulting from:</p>
        <ul>
          <li>Reliance on our shade calculations or recommendations</li>
          <li>Ticket purchases or travel decisions based on our information</li>
          <li>Sunburn, heat-related illness, or other health issues</li>
          <li>Missed games, events, or experiences</li>
          <li>Service interruptions, errors, or data loss</li>
          <li>Third-party actions or content</li>
          <li>Security breaches or unauthorized access</li>
        </ul>

        <h3 className="h3">Damage Cap</h3>
        <p>
          If we are found liable for any damages, our total liability shall not exceed $100 or 
          the amount you paid for any premium services (if any), whichever is greater.
        </p>

        <h3 className="h3">Essential Terms</h3>
        <p>
          These limitations are essential elements of our agreement. Without these limitations, 
          we would not be able to provide our Service.
        </p>
      </section>

      <section id="indemnification" className="stack">
        <h2 className="h2">8. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless The Shadium and its officers, directors, 
          employees, and agents from any claims, damages, losses, or expenses (including attorney fees) 
          arising from:
        </p>
        
        <ul>
          <li>Your use of our Service</li>
          <li>Your violation of these Terms</li>
          <li>Your violation of any law or third-party rights</li>
          <li>Any content you submit or transmit through our Service</li>
          <li>Your negligent or wrongful conduct</li>
        </ul>
      </section>

      <section id="termination" className="stack">
        <h2 className="h2">9. Termination</h2>
        
        <h3 className="h3">By You</h3>
        <p>You may stop using our Service at any time. You may also request deletion of any account data by contacting us.</p>

        <h3 className="h3">By Us</h3>
        <p>We may terminate or suspend your access to our Service at any time, with or without cause, including for:</p>
        <ul>
          <li>Violation of these Terms</li>
          <li>Suspected fraudulent or illegal activity</li>
          <li>Extended periods of inactivity</li>
          <li>Business reasons or Service discontinuation</li>
        </ul>

        <h3 className="h3">Effect of Termination</h3>
        <p>Upon termination:</p>
        <ul>
          <li>Your right to use our Service immediately ceases</li>
          <li>We may delete your data (subject to legal requirements)</li>
          <li>Provisions regarding disclaimers, liability, and indemnification survive</li>
        </ul>
      </section>

      <section id="governing-law" className="stack">
        <h2 className="h2">10. Governing Law and Disputes</h2>
        
        <h3 className="h3">Governing Law</h3>
        <p>
          These Terms are governed by the laws of the United States and the state where The Shadium 
          is headquartered, without regard to conflict of law principles.
        </p>

        <h3 className="h3">Dispute Resolution</h3>
        <p>
          Any disputes arising from these Terms or your use of our Service shall be resolved through 
          binding arbitration, except for small claims court matters or intellectual property disputes.
        </p>

        <h3 className="h3">Class Action Waiver</h3>
        <p>
          You waive any right to participate in class action lawsuits or class-wide arbitration 
          against The Shadium.
        </p>
      </section>
      
      <section id="changes" className="stack">
        <h2 className="h2">11. Changes to Terms</h2>
        <p>
          We may update these Terms from time to time to reflect changes in our Service, 
          legal requirements, or business practices.
        </p>
        
        <h3 className="h3">Notification of Changes</h3>
        <p>When we make material changes, we will:</p>
        <ul>
          <li>Update the "Last Updated" date at the top of these Terms</li>
          <li>Display a prominent notice on our website</li>
          <li>Send email notifications for significant changes (if we have your email)</li>
        </ul>
        
        <h3 className="h3">Acceptance of Changes</h3>
        <p>
          Continued use of our Service after any modifications constitutes acceptance of the updated Terms. 
          If you do not agree to the modified Terms, you must stop using our Service.
        </p>
      </section>

      <section className="stack">
        <h2 className="h2">12. Miscellaneous</h2>
        
        <h3 className="h3">Entire Agreement</h3>
        <p>
          These Terms, together with our Privacy Policy and Cookie Policy, constitute the entire 
          agreement between you and The Shadium regarding your use of our Service.
        </p>

        <h3 className="h3">Severability</h3>
        <p>
          If any provision of these Terms is found to be invalid or unenforceable, the remaining 
          provisions shall remain in full force and effect.
        </p>

        <h3 className="h3">No Waiver</h3>
        <p>
          Our failure to enforce any provision of these Terms does not constitute a waiver of our 
          right to enforce such provision in the future.
        </p>

        <h3 className="h3">Assignment</h3>
        <p>
          You may not assign or transfer your rights under these Terms without our written consent. 
          We may assign these Terms without restriction.
        </p>
      </section>
      
      <section className="stack">
        <h2 className="h2">13. Contact Information</h2>
        <p>
          For questions about these Terms of Service, please contact us:
        </p>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p><strong>The Shadium Legal Team</strong></p>
          <p>Email: legal@theshadium.com</p>
          <p>Subject Line: Terms of Service Inquiry</p>
        </div>
        
        <p>
          For general inquiries, visit our <Link href="/contact" className="text-blue-600 hover:underline">Contact page</Link>.
        </p>
      </section>

      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
        <p>
          <strong>By using The Shadium, you acknowledge that you have read, understood, and agree 
          to be bound by these Terms of Service.</strong>
        </p>
      </div>
    </div>
  );
}