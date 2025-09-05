import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Disclaimers | The Shadium',
  description: 'Important disclaimers for The Shadium MLB stadium shade finder. Understand the limitations and proper use of our shade calculations.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function Disclaimer() {
  return (
    <div className="page-container prose prose-slate max-w-prose mx-auto px-4 py-8 stack">
      <h1 className="h1 break-words md:break-normal">Legal Disclaimers</h1>
      <p className="text-sm text-gray-600">Last Updated: January 2025</p>

      <nav className="bg-gray-50 p-4 rounded-lg">
        <h2 className="h3 mb-2">Important Disclaimers</h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><a href="#accuracy" className="text-blue-600 hover:underline">Accuracy Disclaimer</a></li>
          <li><a href="#medical" className="text-blue-600 hover:underline">Medical & Health Disclaimer</a></li>
          <li><a href="#affiliation" className="text-blue-600 hover:underline">No Affiliation Disclaimer</a></li>
          <li><a href="#financial" className="text-blue-600 hover:underline">Financial Disclaimer</a></li>
          <li><a href="#warranty" className="text-blue-600 hover:underline">Warranty Disclaimer</a></li>
          <li><a href="#liability" className="text-blue-600 hover:underline">Limitation of Liability</a></li>
          <li><a href="#third-party" className="text-blue-600 hover:underline">Third-Party Disclaimer</a></li>
          <li><a href="#endorsement" className="text-blue-600 hover:underline">No Endorsement</a></li>
        </ul>
      </nav>

      <section id="accuracy" className="stack">
        <h2 className="h2">1. Accuracy Disclaimer</h2>
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
          <h3 className="h4 text-red-800">⚠️ IMPORTANT NOTICE</h3>
          <p className="text-red-700">
            <strong>All shade calculations provided by The Shadium are ESTIMATES ONLY and 
            should not be solely relied upon for ticket purchasing decisions.</strong>
          </p>
        </div>
        
        <p>
          While we strive to provide accurate sun and shade calculations, actual conditions 
          at stadiums may vary significantly from our predictions due to numerous factors:
        </p>
        
        <h3 className="h3">Factors Affecting Accuracy:</h3>
        <ul>
          <li><strong>Weather Conditions:</strong> Cloud cover, haze, and atmospheric conditions can dramatically alter sun exposure</li>
          <li><strong>Stadium Modifications:</strong> Ongoing construction, renovations, or new structures may not be reflected in our data</li>
          <li><strong>Seasonal Changes:</strong> Sun angle calculations vary throughout the year</li>
          <li><strong>Time Variations:</strong> Game delays, rain delays, or schedule changes affect sun positioning</li>
          <li><strong>Seating Variations:</strong> Individual seat characteristics, row heights, and personal factors</li>
          <li><strong>Data Currency:</strong> Stadium data may not reflect the most recent changes or configurations</li>
        </ul>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p><strong>Recommendation:</strong> Always verify seating conditions in person and consider bringing sun protection regardless of our calculations.</p>
        </div>
      </section>

      <section id="medical" className="stack">
        <h2 className="h2">2. Medical & Health Disclaimer</h2>
        <p>
          The Shadium does NOT provide medical advice or health recommendations. Our shade calculations 
          are for informational purposes only and should not be considered medical guidance.
        </p>
        
        <h3 className="h3">Important Health Considerations:</h3>
        <ul>
          <li>Individuals with sun sensitivity, skin conditions, or medication-related photosensitivity should consult healthcare providers</li>
          <li>Children, elderly individuals, and those with compromised immune systems may require additional sun protection</li>
          <li>UV exposure can occur even in shaded areas through reflection and scattered light</li>
          <li>Heat-related illnesses can occur regardless of shade coverage</li>
        </ul>

        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <p className="text-red-700">
            <strong>Always consult with healthcare professionals for medical advice regarding sun exposure and heat safety.</strong>
          </p>
        </div>
      </section>

      <section id="affiliation" className="stack">
        <h2 className="h2">3. No Affiliation Disclaimer</h2>
        <p>
          The Shadium is an independent service and is NOT affiliated with, endorsed by, 
          or officially connected to:
        </p>
        
        <ul>
          <li>Major League Baseball (MLB) or any MLB teams</li>
          <li>Minor League Baseball or any MiLB teams</li>
          <li>National Football League (NFL) or any NFL teams</li>
          <li>Stadium owners, operators, or management companies</li>
          <li>Ticket vendors, resellers, or official box offices</li>
          <li>Any sports leagues, teams, or venues mentioned on our site</li>
        </ul>

        <p>
          All team names, stadium names, and related trademarks are the property of their respective owners. 
          Our use of these names is for informational purposes only and does not imply any business relationship.
        </p>
      </section>

      <section id="financial" className="stack">
        <h2 className="h2">4. Financial Disclaimer</h2>
        <p>
          The Shadium provides informational services and does not provide financial, investment, 
          or purchasing advice.
        </p>
        
        <h3 className="h3">No Financial Liability:</h3>
        <ul>
          <li>We are not responsible for financial losses related to ticket purchases</li>
          <li>Ticket prices, availability, and seating options are beyond our control</li>
          <li>We do not guarantee the accuracy of third-party pricing information</li>
          <li>Users are responsible for their own purchasing decisions and due diligence</li>
        </ul>

        <p>
          Any affiliate links or partnerships are disclosed transparently, but we do not guarantee 
          the quality, pricing, or service of third-party vendors.
        </p>
      </section>

      <section id="warranty" className="stack">
        <h2 className="h2">5. Warranty Disclaimer</h2>
        <p>
          THE SHADIUM SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES 
          OF ANY KIND, WHETHER EXPRESS OR IMPLIED.
        </p>
        
        <h3 className="h3">No Warranties Include:</h3>
        <ul>
          <li><strong>Accuracy:</strong> No guarantee of data accuracy or completeness</li>
          <li><strong>Reliability:</strong> Service may experience downtime or interruptions</li>
          <li><strong>Fitness for Purpose:</strong> No guarantee the service meets your specific needs</li>
          <li><strong>Non-Infringement:</strong> No guarantee against third-party claims</li>
          <li><strong>Merchantability:</strong> No commercial warranty of any kind</li>
        </ul>

        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <p>
            <strong>Use at Your Own Risk:</strong> Users acknowledge that they use The Shadium service 
            entirely at their own risk and discretion.
          </p>
        </div>
      </section>

      <section id="liability" className="stack">
        <h2 className="h2">6. Limitation of Liability</h2>
        <p>
          TO THE FULLEST EXTENT PERMITTED BY LAW, THE SHADIUM SHALL NOT BE LIABLE FOR ANY 
          DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
        </p>
        
        <h3 className="h3">No Liability For:</h3>
        <ul>
          <li>Financial losses from ticket purchases or travel arrangements</li>
          <li>Sunburn, heat-related illness, or other health issues</li>
          <li>Missed games, events, or experiences</li>
          <li>Data loss, service interruptions, or technical failures</li>
          <li>Third-party actions or omissions</li>
          <li>Errors, inaccuracies, or omissions in our content</li>
        </ul>

        <p>
          If any jurisdiction does not allow the exclusion or limitation of liability for 
          consequential or incidental damages, our liability shall be limited to the maximum 
          extent permitted by law.
        </p>
      </section>

      <section id="third-party" className="stack">
        <h2 className="h2">7. Third-Party Services & Attributions</h2>
        <p>
          Our service uses data from third-party providers. The Shadium does not endorse, 
          control, or assume responsibility for the accuracy or availability of third-party content.
        </p>
        
        <h3 className="h3">Data Sources & Required Attributions:</h3>
        
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
          <h4 className="font-semibold text-blue-900">MLB Stats API</h4>
          <p className="text-sm mt-2">
            Game schedules and venue data provided by MLB Advanced Media, L.P.
          </p>
          <p className="text-xs text-blue-700 mt-2">
            Use of MLB content is subject to the notice posted at{' '}
            <a 
              href="http://gdx.mlb.com/components/copyright.txt" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline"
            >
              http://gdx.mlb.com/components/copyright.txt
            </a>
          </p>
        </div>
        
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
          <h4 className="font-semibold text-green-900">Open-Meteo Weather API</h4>
          <p className="text-sm mt-2">
            Weather forecasts provided under CC BY 4.0 license.
          </p>
          <p className="text-xs text-green-700 mt-2">
            Weather data by{' '}
            <a 
              href="https://open-meteo.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline"
            >
              Open-Meteo.com
            </a>
          </p>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-4">
          <h4 className="font-semibold text-amber-900">NREL Solar Position Algorithm</h4>
          <p className="text-sm mt-2">
            Sun position calculations based on peer-reviewed research.
          </p>
          <p className="text-xs text-amber-700 mt-2">
            Reda, I.; Andreas, A. (2003). Solar Position Algorithm for Solar Radiation Applications. 
            NREL Report No. TP-560-34302.
          </p>
        </div>

        <p className="mt-4">
          For complete technology attributions, visit our{' '}
          <Link href="/attributions" className="text-blue-600 hover:underline">
            Technology & Attributions page
          </Link>.
        </p>
        
        <p>
          Users should review the terms of service and privacy policies of any third-party 
          services they choose to use through our platform.
        </p>
      </section>

      <section id="endorsement" className="stack">
        <h2 className="h2">8. No Endorsement</h2>
        <p>
          References to specific teams, stadiums, vendors, or services do not constitute 
          endorsements or recommendations by The Shadium.
        </p>
        
        <ul>
          <li>We do not endorse specific ticket vendors or sellers</li>
          <li>Stadium or team mentions are for informational purposes only</li>
          <li>User reviews and comments represent individual opinions</li>
          <li>Third-party advertisements do not imply our endorsement</li>
        </ul>
      </section>

      <section className="stack">
        <h2 className="h2">9. Updates and Changes</h2>
        <p>
          These disclaimers may be updated periodically to reflect changes in our service, 
          legal requirements, or best practices.
        </p>
        
        <p>
          Continued use of The Shadium after any modifications constitutes acceptance of 
          the updated disclaimers.
        </p>
      </section>

      <section className="stack">
        <h2 className="h2">10. Contact Information</h2>
        <p>
          For questions about these disclaimers or to report issues with our service:
        </p>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p><strong>The Shadium Legal Team</strong></p>
          <p>Email: legal@theshadium.com</p>
          <p>Subject Line: Disclaimer Inquiry</p>
        </div>
        
        <p>
          For general support, visit our <Link href="/contact" className="text-blue-600 hover:underline">Contact page</Link>.
        </p>
      </section>

      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
        <p>
          <strong>By using The Shadium, you acknowledge that you have read, understood, 
          and agree to be bound by these disclaimers and limitations.</strong>
        </p>
      </div>
    </div>
  );
}