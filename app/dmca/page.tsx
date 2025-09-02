import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'DMCA Policy | The Shadium',
  description: 'DMCA Policy and copyright infringement procedures for The Shadium. Learn how to report copyright violations.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function DMCAPolicy() {
  return (
    <div className="page-container prose prose-slate max-w-prose mx-auto px-4 py-8 stack">
      <h1 className="h1 break-words md:break-normal">DMCA Policy</h1>
      <p className="text-sm text-gray-600">Last Updated: January 2025</p>
      <p className="text-sm text-gray-600">Digital Millennium Copyright Act Compliance</p>

      <section className="stack">
        <h2 className="h2">1. Copyright Policy</h2>
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

      <section className="stack">
        <h2 className="h2">2. DMCA Takedown Notice</h2>
        <p>
          To file a DMCA takedown notice, please provide our Designated Copyright Agent with 
          the following information in writing:
        </p>
        
        <h3 className="h3">Required Information:</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            <strong>Identification of the copyrighted work</strong> claimed to have been 
            infringed, or, if multiple copyrighted works are covered by a single notification, 
            a representative list of such works.
          </li>
          <li>
            <strong>Identification of the material</strong> that is claimed to be infringing 
            or to be the subject of infringing activity and that is to be removed or access 
            to which is to be disabled, and information reasonably sufficient to permit us 
            to locate the material.
          </li>
          <li>
            <strong>Information reasonably sufficient</strong> to permit us to contact the 
            complaining party, such as an address, telephone number, and, if available, 
            an electronic mail address.
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
            <strong>A physical or electronic signature</strong> of a person authorized to act 
            on behalf of the owner of an exclusive right that is allegedly infringed.
          </li>
        </ol>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <h3 className="h4 text-yellow-800">⚠️ Important</h3>
          <p className="text-yellow-700">
            Please note that under Section 512(f) of the DMCA, any person who knowingly 
            materially misrepresents that material is infringing may be subject to liability.
          </p>
        </div>
      </section>

      <section className="stack">
        <h2 className="h2">3. Designated Copyright Agent</h2>
        <p>
          Please send DMCA takedown notices to our Designated Copyright Agent:
        </p>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <p><strong>DMCA Agent</strong><br />
          The Shadium<br />
          Email: legal@theshadium.com<br />
          Subject Line: DMCA Takedown Notice</p>
          
          <p className="mt-4 text-sm text-gray-600">
            <strong>Physical Mail Address:</strong><br />
            Available upon request for formal legal proceedings
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p>
            <strong>Note:</strong> The DMCA Agent is designated solely for receiving 
            notifications of claimed infringement. Other inquiries should be directed 
            to our general contact information.
          </p>
        </div>
      </section>

      <section className="stack">
        <h2 className="h2">4. Counter-Notification</h2>
        <p>
          If you believe that material you posted was removed or disabled by mistake or 
          misidentification, you may file a counter-notification with us by providing our 
          Designated Copyright Agent with the following information:
        </p>
        
        <h3 className="h3">Counter-Notice Requirements:</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            <strong>Your physical or electronic signature</strong>
          </li>
          <li>
            <strong>Identification of the material</strong> that has been removed or to which 
            access has been disabled and the location at which the material appeared before 
            it was removed or disabled
          </li>
          <li>
            <strong>A statement</strong> under penalty of perjury that you have a good faith 
            belief that the material was removed or disabled as a result of mistake or 
            misidentification
          </li>
          <li>
            <strong>Your name, address, and telephone number</strong>, and a statement that 
            you consent to the jurisdiction of Federal District Court for the judicial district 
            in which the address is located, or if your address is outside of the United States, 
            for any judicial district in which we may be found, and that you will accept 
            service of process from the person who provided the original notification or an 
            agent of such person
          </li>
        </ol>

        <p>
          Upon receipt of a valid counter-notification, we will forward it to the party who 
          submitted the original takedown notice. The original complainant will then have 10 
          business days to file a court action to restrain the allegedly infringing activity.
        </p>
      </section>

      <section className="stack">
        <h2 className="h2">5. Repeat Infringer Policy</h2>
        <p>
          In accordance with the DMCA and other applicable law, The Shadium has adopted a 
          policy of terminating, in appropriate circumstances and at our sole discretion, 
          users who are deemed to be repeat infringers.
        </p>
        
        <h3 className="h3">Policy Implementation:</h3>
        <ul>
          <li>We maintain a record of DMCA notices received</li>
          <li>Accounts with multiple valid infringement claims may be suspended or terminated</li>
          <li>We reserve the right to terminate accounts at our discretion</li>
          <li>Terminated users may appeal through our standard appeals process</li>
        </ul>
      </section>

      <section className="stack">
        <h2 className="h2">6. Fair Use Considerations</h2>
        <p>
          Before filing a DMCA takedown notice, please consider whether the use of copyrighted 
          material may constitute fair use under U.S. copyright law.
        </p>
        
        <h3 className="h3">Fair Use Factors:</h3>
        <ul>
          <li>The purpose and character of the use (commercial vs. educational)</li>
          <li>The nature of the copyrighted work</li>
          <li>The amount and substantiality of the portion used</li>
          <li>The effect of the use on the market for the copyrighted work</li>
        </ul>

        <p>
          The Shadium primarily uses copyrighted materials for informational purposes in 
          connection with stadium and sports-related data presentation, which may constitute 
          fair use in many circumstances.
        </p>
      </section>

      <section className="stack">
        <h2 className="h2">7. Non-U.S. Copyright Issues</h2>
        <p>
          While this policy focuses on the U.S. DMCA, we respect international copyright 
          laws and will consider valid copyright complaints from other jurisdictions.
        </p>
        
        <p>
          If you are filing a complaint based on non-U.S. copyright law, please:
        </p>
        <ul>
          <li>Clearly identify the applicable law and jurisdiction</li>
          <li>Provide equivalent information to that required for DMCA notices</li>
          <li>Include any relevant documentation of your copyright ownership</li>
        </ul>
      </section>

      <section className="stack">
        <h2 className="h2">8. Response Time and Process</h2>
        <p>
          We are committed to responding to valid DMCA notices promptly:
        </p>
        
        <h3 className="h3">Our Process:</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            <strong>Acknowledgment:</strong> We will acknowledge receipt of your notice within 
            48 hours
          </li>
          <li>
            <strong>Review:</strong> We will review the notice for completeness and validity
          </li>
          <li>
            <strong>Action:</strong> If valid, we will remove or disable access to the 
            allegedly infringing material
          </li>
          <li>
            <strong>Notification:</strong> We will notify the user who posted the material 
            of the takedown
          </li>
          <li>
            <strong>Counter-Notice:</strong> Users may file counter-notifications if they 
            believe the takedown was in error
          </li>
        </ol>

        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <p>
            <strong>Expedited Processing:</strong> Valid and complete DMCA notices are 
            typically processed within 24-72 hours of receipt.
          </p>
        </div>
      </section>

      <section className="stack">
        <h2 className="h2">9. Contact Information</h2>
        <p>
          For copyright-related inquiries and DMCA notices:
        </p>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p><strong>DMCA Agent</strong></p>
          <p>Email: legal@theshadium.com</p>
          <p>Subject Line: DMCA Notice</p>
        </div>
        
        <p>
          For other legal matters, contact: legal@theshadium.com
        </p>
        
        <p>
          For general inquiries, visit our <Link href="/contact" className="text-blue-600 hover:underline">Contact page</Link>.
        </p>
      </section>

      <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
        <h3 className="h4 text-red-800">⚠️ Legal Notice</h3>
        <p className="text-red-700">
          <strong>This DMCA Policy is a legal document. Misrepresentation in DMCA notices 
          may result in legal liability. If you are unsure about whether material infringes 
          your copyright, please consult with an attorney before filing a notice.</strong>
        </p>
      </div>
    </div>
  );
}