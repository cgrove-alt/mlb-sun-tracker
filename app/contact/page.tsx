import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - The Shadium',
  description: 'Get in touch with The Shadium team',
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 stack">
      <h1 className="h1 break-words md:break-normal">Contact Us</h1>
      
      <div className="rounded-xl border bg-white p-4 md:p-6 shadow-sm stack">
        <h2 className="h2">Get in Touch</h2>
        <p className="text-ink-700 max-w-prose">
          Have questions, suggestions, or feedback? We'd love to hear from you! 
          Our team is dedicated to helping fans find the perfect shaded seats.
        </p>
        
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">General Inquiries</h3>
              <p className="text-ink-700">
                <a href="mailto:info@theshadium.com" className="text-blue-600 hover:underline">
                  info@theshadium.com
                </a>
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Technical Support</h3>
              <p className="text-ink-700">
                <a href="mailto:support@theshadium.com" className="text-blue-600 hover:underline">
                  support@theshadium.com
                </a>
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Privacy Rights Requests</h3>
              <p className="text-ink-700 mb-2">
                <a href="mailto:legal@theshadium.com" className="text-blue-600 hover:underline">
                  legal@theshadium.com
                </a>
              </p>
              <a href="/privacy-rights" className="inline-block text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition-colors">
                Visit Privacy Rights Center →
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Partnership Opportunities</h3>
              <p className="text-ink-700">
                <a href="mailto:partnerships@theshadium.com" className="text-blue-600 hover:underline">
                  partnerships@theshadium.com
                </a>
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Legal Inquiries</h3>
              <p className="text-ink-700">
                <a href="mailto:legal@theshadium.com" className="text-blue-600 hover:underline">
                  legal@theshadium.com
                </a>
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Media & Press</h3>
              <p className="text-ink-700">
                <a href="mailto:media@theshadium.com" className="text-blue-600 hover:underline">
                  media@theshadium.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="rounded-xl border bg-blue-50 p-4 md:p-5 shadow-sm stack">
        <h3 className="text-lg font-semibold">Response Times</h3>
        <p className="text-ink-700 max-w-prose">
          We typically respond to inquiries within 1-2 business days. For urgent technical issues, 
          please include "URGENT" in your subject line.
        </p>
      </div>
      
      <div className="rounded-xl border bg-green-50 p-4 md:p-5 shadow-sm stack">
        <h3 className="text-lg font-semibold">Quick Tip</h3>
        <p className="text-ink-700 max-w-prose">
          Before contacting support, check our <a href="/faq" className="text-blue-600 hover:underline">FAQs page</a> for 
          answers to common questions about using The Shadium to find shaded seats at your favorite ballpark.
        </p>
      </div>
    </div>
  );
}