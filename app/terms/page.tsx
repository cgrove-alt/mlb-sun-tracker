import { Metadata } from 'next';

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
      <p>Last updated: January 2025</p>
      
      <section className="stack">
        <h2 className="h2">Acceptance of Terms</h2>
        <p>By using The Shadium, you agree to these terms of service.</p>
      </section>
      
      <section className="stack">
        <h2 className="h2">Service Description</h2>
        <p>The Shadium provides sun exposure calculations and shade recommendations for MLB stadiums. Our calculations are estimates based on sun position algorithms and stadium geometry.</p>
      </section>
      
      <section className="stack">
        <h2 className="h2">Disclaimer</h2>
        <p>While we strive for accuracy, shade calculations are estimates and may vary based on:</p>
        <ul>
          <li>Weather conditions</li>
          <li>Stadium modifications</li>
          <li>Time of year</li>
          <li>Seat-specific factors</li>
        </ul>
      </section>
      
      <section className="stack">
        <h2 className="h2">Use of Service</h2>
        <p>You may use The Shadium for personal, non-commercial purposes. Commercial use requires written permission.</p>
      </section>
      
      <section className="stack">
        <h2 className="h2">Intellectual Property</h2>
        <p>All content, features, and functionality are owned by The Shadium and are protected by copyright laws.</p>
      </section>
      
      <section className="stack">
        <h2 className="h2">Limitation of Liability</h2>
        <p>The Shadium is provided "as is" without warranties. We are not responsible for any decisions made based on our shade calculations.</p>
      </section>
      
      <section className="stack">
        <h2 className="h2">Changes to Terms</h2>
        <p>We may update these terms at any time. Continued use of the service constitutes acceptance of updated terms.</p>
      </section>
      
      <section className="stack">
        <h2 className="h2">Contact</h2>
        <p>For questions about these terms, contact us at legal@theshadium.com</p>
      </section>
    </div>
  );
}