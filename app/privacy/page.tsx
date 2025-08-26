import { Metadata } from 'next';

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
      <p>Last updated: January 2025</p>
      
      <section className="stack">
        <h2 className="h2">Overview</h2>
        <p>The Shadium is committed to protecting your privacy. This policy explains how we handle your information.</p>
      </section>
      
      <section className="stack">
        <h2 className="h2">Information We Collect</h2>
        <ul>
          <li>Stadium selection preferences</li>
          <li>Game date and time selections</li>
          <li>Shade preference settings</li>
          <li>Anonymous usage analytics</li>
        </ul>
      </section>
      
      <section className="stack">
        <h2 className="h2">How We Use Information</h2>
        <p>We use collected information to:</p>
        <ul>
          <li>Provide accurate shade calculations</li>
          <li>Improve our service</li>
          <li>Remember your preferences</li>
          <li>Analyze usage patterns</li>
        </ul>
      </section>
      
      <section className="stack">
        <h2 className="h2">Data Storage</h2>
        <p>All preferences are stored locally in your browser. We do not store personal information on our servers.</p>
      </section>
      
      <section className="stack">
        <h2 className="h2">Third-Party Services</h2>
        <p>We use Google Analytics to understand how users interact with our site. This data is anonymous and aggregated.</p>
      </section>
      
      <section className="stack">
        <h2 className="h2">Contact Us</h2>
        <p>If you have questions about this privacy policy, please contact us at privacy@theshadium.com</p>
      </section>
    </div>
  );
}