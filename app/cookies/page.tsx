import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy | The Shadium',
  description: 'Learn how The Shadium uses cookies and similar technologies to enhance your experience. Manage your cookie preferences.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function CookiePolicy() {
  return (
    <div className="page-container prose prose-slate max-w-prose mx-auto px-4 py-8 stack">
      <h1 className="h1 break-words md:break-normal">Cookie Policy</h1>
      <p className="text-sm text-gray-600">Last Updated: January 2025</p>
      <p className="text-sm text-gray-600">Effective Date: January 1, 2025</p>

      <nav className="bg-gray-50 p-4 rounded-lg">
        <h2 className="h3 mb-2">Quick Navigation</h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><a href="#what-are-cookies" className="text-blue-600 hover:underline">What Are Cookies?</a></li>
          <li><a href="#how-we-use" className="text-blue-600 hover:underline">How We Use Cookies</a></li>
          <li><a href="#types" className="text-blue-600 hover:underline">Types of Cookies</a></li>
          <li><a href="#third-party" className="text-blue-600 hover:underline">Third-Party Cookies</a></li>
          <li><a href="#manage" className="text-blue-600 hover:underline">Managing Cookies</a></li>
          <li><a href="#consent" className="text-blue-600 hover:underline">Cookie Consent</a></li>
          <li><a href="#updates" className="text-blue-600 hover:underline">Policy Updates</a></li>
        </ul>
      </nav>

      <section id="what-are-cookies" className="stack">
        <h2 className="h2">1. What Are Cookies?</h2>
        <p>
          Cookies are small text files that are placed on your device when you visit 
          a website. They help websites remember information about your visit, which 
          can make your next visit easier and the site more useful to you.
        </p>
        
        <h3 className="h3">Similar Technologies</h3>
        <p>In addition to cookies, we may use similar technologies including:</p>
        <ul>
          <li><strong>Web Beacons:</strong> Small graphics that track page views</li>
          <li><strong>Local Storage:</strong> Browser storage for larger amounts of data</li>
          <li><strong>Session Storage:</strong> Temporary browser storage cleared when tab closes</li>
          <li><strong>Device Fingerprinting:</strong> Technical information about your device</li>
        </ul>
      </section>

      <section id="how-we-use" className="stack">
        <h2 className="h2">2. How We Use Cookies</h2>
        <p>The Shadium uses cookies and similar technologies for the following purposes:</p>
        
        <h3 className="h3">Essential Functions</h3>
        <ul>
          <li>Maintain your session while using our service</li>
          <li>Remember your preferences and settings</li>
          <li>Ensure website security and prevent fraud</li>
          <li>Load balancing and performance optimization</li>
        </ul>
        
        <h3 className="h3">Analytics and Performance</h3>
        <ul>
          <li>Understand how visitors use our website</li>
          <li>Measure and improve website performance</li>
          <li>Track error rates and page load times</li>
          <li>Analyze user interaction patterns</li>
        </ul>
        
        <h3 className="h3">Functionality</h3>
        <ul>
          <li>Remember your selected stadium preferences</li>
          <li>Store your recent searches and viewed stadiums</li>
          <li>Customize content based on your location</li>
          <li>Remember your cookie consent choices</li>
        </ul>
      </section>

      <section id="types" className="stack">
        <h2 className="h2">3. Types of Cookies We Use</h2>
        
        <h3 className="h3">Strictly Necessary Cookies</h3>
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p><strong>Always Active</strong></p>
          <p>
            These cookies are essential for the website to function and cannot be 
            disabled. They are usually set in response to actions you take, such as 
            setting privacy preferences or filling in forms.
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cookie Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">shadium_session</td>
                <td className="px-6 py-4 text-sm text-gray-500">Maintains user session</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Session</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">cookie_consent</td>
                <td className="px-6 py-4 text-sm text-gray-500">Stores cookie consent preferences</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 year</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h3 className="h3">Performance Cookies</h3>
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p><strong>Optional</strong></p>
          <p>
            These cookies help us understand how visitors interact with our website 
            by collecting anonymous information.
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cookie Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">_ga</td>
                <td className="px-6 py-4 text-sm text-gray-500">Google Analytics - distinguishes users</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 years</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">_gid</td>
                <td className="px-6 py-4 text-sm text-gray-500">Google Analytics - distinguishes users</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">24 hours</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="third-party" className="stack">
        <h2 className="h2">4. Third-Party Cookies</h2>
        <p>
          Some cookies on our site are placed by third-party services that appear 
          on our pages. We do not control these cookies and encourage you to check 
          the third-party websites for more information about their cookies.
        </p>
        
        <h3 className="h3">Third-Party Services We Use:</h3>
        <ul>
          <li>
            <strong>Google Analytics:</strong> For website analytics
            <br />
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Google Privacy Policy
            </a>
          </li>
          <li>
            <strong>Weather APIs:</strong> For real-time weather data
            <br />
            May set cookies for API rate limiting
          </li>
        </ul>
      </section>

      <section id="manage" className="stack">
        <h2 className="h2">5. Managing Your Cookie Preferences</h2>
        
        <h3 className="h3">Cookie Consent Tool</h3>
        <p>
          You can manage your cookie preferences at any time using our cookie 
          consent tool. Click the "Cookie Preferences" link in the footer or 
          the cookie icon that appears on our pages.
        </p>
        
        <h3 className="h3">Browser Settings</h3>
        <p>Most web browsers allow you to control cookies through their settings:</p>
        <ul>
          <li>
            <strong>Chrome:</strong>{' '}
            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Manage cookies in Chrome
            </a>
          </li>
          <li>
            <strong>Firefox:</strong>{' '}
            <a href="https://support.mozilla.org/en-US/kb/cookies-information" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Manage cookies in Firefox
            </a>
          </li>
          <li>
            <strong>Safari:</strong>{' '}
            <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Manage cookies in Safari
            </a>
          </li>
        </ul>
        
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <h3 className="h4 text-red-800">⚠️ Important Note</h3>
          <p className="text-red-700">
            Disabling cookies may affect the functionality of our website. Some 
            features may not work properly without cookies enabled.
          </p>
        </div>
      </section>

      <section id="consent" className="stack">
        <h2 className="h2">6. Cookie Consent</h2>
        
        <h3 className="h3">Legal Basis</h3>
        <p>We rely on the following legal bases for using cookies:</p>
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
        
        <h3 className="h3">Withdrawing Consent</h3>
        <p>
          You can withdraw your consent for optional cookies at any time through 
          our cookie preferences tool or by contacting us at privacy@theshadium.com.
        </p>
      </section>

      <section id="updates" className="stack">
        <h2 className="h2">7. Updates to This Policy</h2>
        <p>
          We may update this Cookie Policy from time to time to reflect changes 
          in our practices or for legal, operational, or regulatory reasons.
        </p>
        
        <p>When we make material changes, we will:</p>
        <ul>
          <li>Update the "Last Updated" date at the top of this policy</li>
          <li>Notify you through a prominent notice on our website</li>
          <li>Request new consent if required by law</li>
        </ul>
      </section>

      <section className="stack">
        <h2 className="h2">8. Contact Us</h2>
        <p>
          If you have questions about our use of cookies or this Cookie Policy, 
          please contact us:
        </p>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p><strong>The Shadium Privacy Team</strong></p>
          <p>Email: privacy@theshadium.com</p>
          <p>Subject Line: Cookie Policy Inquiry</p>
        </div>
        
        <p>
          For general inquiries, visit our <Link href="/contact" className="text-blue-600 hover:underline">Contact page</Link>.
        </p>
      </section>

      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
        <p>
          <strong>This Cookie Policy is part of our Privacy Policy and Terms of 
          Service. By using The Shadium, you agree to our use of cookies as 
          described in this policy.</strong>
        </p>
      </div>
    </div>
  );
}