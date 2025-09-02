import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | The Shadium',
  description: 'Privacy policy for The Shadium. Learn how we protect your data while helping you find shaded seats at MLB stadiums.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="page-container prose prose-slate max-w-prose mx-auto px-4 py-8 stack">
      <h1 className="h1 break-words md:break-normal">Privacy Policy</h1>
      <p className="text-sm text-gray-600">Last Updated: January 2025</p>
      <p className="text-sm text-gray-600">Effective Date: January 1, 2025</p>
      
      <nav className="bg-gray-50 p-4 rounded-lg">
        <h2 className="h3 mb-2">Table of Contents</h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><a href="#overview" className="text-blue-600 hover:underline">Overview</a></li>
          <li><a href="#information-we-collect" className="text-blue-600 hover:underline">Information We Collect</a></li>
          <li><a href="#how-we-use" className="text-blue-600 hover:underline">How We Use Information</a></li>
          <li><a href="#data-storage" className="text-blue-600 hover:underline">Data Storage & Security</a></li>
          <li><a href="#sharing" className="text-blue-600 hover:underline">Information Sharing</a></li>
          <li><a href="#your-rights" className="text-blue-600 hover:underline">Your Rights</a></li>
          <li><a href="#cookies" className="text-blue-600 hover:underline">Cookies & Tracking</a></li>
          <li><a href="#third-party" className="text-blue-600 hover:underline">Third-Party Services</a></li>
          <li><a href="#children" className="text-blue-600 hover:underline">Children's Privacy</a></li>
          <li><a href="#changes" className="text-blue-600 hover:underline">Policy Changes</a></li>
        </ul>
      </nav>

      <section id="overview" className="stack">
        <h2 className="h2">1. Overview</h2>
        <p>
          The Shadium ("we," "our," "us") is committed to protecting your privacy. This Privacy Policy 
          explains how we collect, use, disclose, and safeguard your information when you visit our 
          website and use our services.
        </p>
        <p>
          By using The Shadium, you consent to the data practices described in this policy. If you 
          do not agree with the practices described in this policy, please do not use our services.
        </p>
      </section>
      
      <section id="information-we-collect" className="stack">
        <h2 className="h2">2. Information We Collect</h2>
        
        <h3 className="h3">Information You Provide</h3>
        <ul>
          <li><strong>Stadium Preferences:</strong> Your selected favorite stadiums and seating preferences</li>
          <li><strong>Search History:</strong> Stadiums you've searched for and viewed</li>
          <li><strong>Contact Information:</strong> Email address if you contact us for support</li>
          <li><strong>Feedback:</strong> Comments, suggestions, or feedback you provide</li>
        </ul>

        <h3 className="h3">Information Collected Automatically</h3>
        <ul>
          <li><strong>Usage Data:</strong> Pages visited, time spent, click patterns</li>
          <li><strong>Device Information:</strong> Browser type, operating system, screen resolution</li>
          <li><strong>Location Data:</strong> Approximate location based on IP address (for weather data)</li>
          <li><strong>Performance Data:</strong> Page load times, error reports, technical metrics</li>
        </ul>

        <h3 className="h3">Information from Third Parties</h3>
        <ul>
          <li><strong>Weather APIs:</strong> Location-based weather data for shade calculations</li>
          <li><strong>Sports APIs:</strong> Game schedules and venue information</li>
          <li><strong>Analytics Services:</strong> Aggregated usage statistics</li>
        </ul>
      </section>
      
      <section id="how-we-use" className="stack">
        <h2 className="h2">3. How We Use Your Information</h2>
        
        <h3 className="h3">Primary Uses</h3>
        <ul>
          <li><strong>Service Provision:</strong> Calculate sun exposure and shade recommendations</li>
          <li><strong>Personalization:</strong> Remember your preferences and improve user experience</li>
          <li><strong>Performance:</strong> Optimize website speed and functionality</li>
          <li><strong>Support:</strong> Respond to inquiries and provide customer service</li>
        </ul>

        <h3 className="h3">Secondary Uses</h3>
        <ul>
          <li><strong>Analytics:</strong> Understand user behavior and improve our service</li>
          <li><strong>Security:</strong> Detect and prevent fraudulent or malicious activity</li>
          <li><strong>Legal Compliance:</strong> Meet legal obligations and protect our rights</li>
          <li><strong>Business Operations:</strong> Internal administration and business development</li>
        </ul>
      </section>
      
      <section id="data-storage" className="stack">
        <h2 className="h2">4. Data Storage & Security</h2>
        
        <h3 className="h3">Storage Methods</h3>
        <ul>
          <li><strong>Local Storage:</strong> Preferences stored in your browser</li>
          <li><strong>Session Data:</strong> Temporary data for active sessions</li>
          <li><strong>Server Logs:</strong> Technical logs for performance and security</li>
          <li><strong>Analytics Data:</strong> Aggregated, anonymized usage statistics</li>
        </ul>

        <h3 className="h3">Security Measures</h3>
        <ul>
          <li>SSL/HTTPS encryption for data transmission</li>
          <li>Regular security audits and updates</li>
          <li>Access controls and authentication requirements</li>
          <li>Data minimization and automatic retention policies</li>
        </ul>
        
        <h3 className="h3">Data Retention Periods</h3>
        <ul>
          <li><strong>Essential Preferences:</strong> 1 year (consent, language, theme)</li>
          <li><strong>Stadium Favorites:</strong> 1 year</li>
          <li><strong>Recent Activity:</strong> 90 days (searches, viewed stadiums)</li>
          <li><strong>Session Data:</strong> 30 days (temporary browsing data)</li>
          <li><strong>Analytics Data:</strong> 90 days (if enabled)</li>
        </ul>
        <p className="text-sm text-gray-600 mt-2">
          Data is automatically deleted after these periods unless you actively use the feature.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p>
            <strong>Note:</strong> No method of transmission or storage is 100% secure. While we implement 
            reasonable security measures, we cannot guarantee absolute security.
          </p>
        </div>
      </section>

      <section id="sharing" className="stack">
        <h2 className="h2">5. Information Sharing</h2>
        
        <p>We do not sell, trade, or rent your personal information to third parties. We may share information in these limited circumstances:</p>
        
        <h3 className="h3">With Your Consent</h3>
        <ul>
          <li>When you explicitly authorize us to share specific information</li>
          <li>When you use social sharing features (if implemented)</li>
        </ul>

        <h3 className="h3">Service Providers</h3>
        <ul>
          <li><strong>Hosting Services:</strong> Website hosting and content delivery</li>
          <li><strong>Analytics Services:</strong> Google Analytics for usage analysis</li>
          <li><strong>Weather Services:</strong> Third-party weather data providers</li>
        </ul>

        <h3 className="h3">Legal Requirements</h3>
        <ul>
          <li>To comply with applicable laws, regulations, or court orders</li>
          <li>To protect the rights, property, or safety of The Shadium or others</li>
          <li>To investigate or prevent potentially illegal activities</li>
        </ul>
      </section>

      <section id="your-rights" className="stack">
        <h2 className="h2">6. Your Privacy Rights</h2>
        
        <h3 className="h3">Access and Control</h3>
        <ul>
          <li><strong>Access:</strong> Request information about data we have collected</li>
          <li><strong>Correction:</strong> Update or correct inaccurate information</li>
          <li><strong>Deletion:</strong> Request deletion of your personal information</li>
          <li><strong>Portability:</strong> Receive your data in a portable format</li>
        </ul>
        
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg mt-4">
          <p className="font-semibold text-green-800 mb-2">✅ Exercise Your Rights Now</p>
          <p className="text-green-700 mb-3">
            Use our Privacy Rights Center to instantly view, export, or delete your data:
          </p>
          <Link href="/privacy-rights" className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Go to Privacy Rights Center →
          </Link>
        </div>

        <h3 className="h3">Opt-Out Options</h3>
        <ul>
          <li>Disable cookies through your browser settings</li>
          <li>Opt out of Google Analytics tracking</li>
          <li>Clear local storage data in your browser</li>
          <li>Contact us to request account deletion</li>
        </ul>

        <h3 className="h3">Regional Rights</h3>
        <ul>
          <li><strong>GDPR (EU):</strong> Right to access, rectification, erasure, and data portability</li>
          <li><strong>CCPA (California):</strong> Right to know, delete, and opt-out of sale</li>
          <li><strong>Other Jurisdictions:</strong> Rights as provided by applicable local laws</li>
        </ul>
      </section>

      <section id="cookies" className="stack">
        <h2 className="h2">7. Cookies & Tracking Technologies</h2>
        
        <p>
          We use cookies and similar technologies to improve your experience. For detailed information 
          about our cookie practices, please see our <Link href="/cookies" className="text-blue-600 hover:underline">Cookie Policy</Link>.
        </p>
        
        <h3 className="h3">Types of Cookies We Use</h3>
        <ul>
          <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
          <li><strong>Performance Cookies:</strong> Help us understand how visitors use our site</li>
          <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
        </ul>
      </section>
      
      <section id="third-party" className="stack">
        <h2 className="h2">8. Third-Party Services</h2>
        
        <h3 className="h3">Analytics</h3>
        <p>
          We use Google Analytics to understand how users interact with our site. Google Analytics 
          collects information anonymously and reports website trends without identifying individual visitors.
        </p>
        
        <h3 className="h3">Weather Data</h3>
        <p>
          We integrate with weather services to provide accurate sun and weather conditions for our 
          shade calculations. These services may collect location data as needed for their functionality.
        </p>

        <h3 className="h3">Sports Data</h3>
        <p>
          We use various sports APIs to provide up-to-date game schedules and venue information. 
          These services operate under their own privacy policies.
        </p>
      </section>

      <section id="children" className="stack">
        <h2 className="h2">9. Children's Privacy</h2>
        
        <p>
          Our service is not intended for children under 13 years of age. We do not knowingly collect 
          personally identifiable information from children under 13. If we become aware that we have 
          collected personal information from a child under 13, we will take steps to delete such information.
        </p>
        
        <p>
          Parents and guardians who believe their child has provided us with personal information 
          should contact us at legal@theshadium.com.
        </p>
      </section>

      <section id="changes" className="stack">
        <h2 className="h2">10. Changes to This Policy</h2>
        
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices, 
          technology, legal requirements, or other factors.
        </p>
        
        <h3 className="h3">How We Notify You</h3>
        <ul>
          <li>Update the "Last Updated" date at the top of this policy</li>
          <li>Display a prominent notice on our website for material changes</li>
          <li>Send email notifications for significant changes (if we have your email)</li>
        </ul>
        
        <p>
          Continued use of our service after any modifications indicates your acknowledgment of the 
          modified Privacy Policy.
        </p>
      </section>
      
      <section className="stack">
        <h2 className="h2">11. Contact Us</h2>
        
        <p>
          If you have questions about this Privacy Policy or our privacy practices, please contact us:
        </p>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p><strong>The Shadium Legal Team</strong></p>
          <p>Email: legal@theshadium.com</p>
          <p>Subject Line: Privacy Policy Inquiry</p>
        </div>
        
        <p>
          For general inquiries, visit our <Link href="/contact" className="text-blue-600 hover:underline">Contact page</Link>.
        </p>
        
        <p className="text-sm text-gray-600 mt-4">
          We will respond to privacy-related inquiries within 30 days of receipt.
        </p>
      </section>

      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
        <p>
          <strong>By using The Shadium, you acknowledge that you have read and understood this Privacy Policy 
          and agree to our collection, use, and disclosure of your information as described herein.</strong>
        </p>
      </div>
    </div>
  );
}