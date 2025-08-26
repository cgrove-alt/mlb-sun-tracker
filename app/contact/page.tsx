import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - The Shadium',
  description: 'Get in touch with The Shadium team',
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 stack">
      <h1 className="h1 break-words md:break-normal">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        <div className="rounded-xl border bg-white p-4 md:p-5 shadow-sm stack">
          <h2 className="h2">Get in Touch</h2>
          <p className="text-gray-600 max-w-prose">
            Have questions, suggestions, or feedback? We'd love to hear from you! 
            Our team is dedicated to helping fans find the perfect shaded seats.
          </p>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">General Inquiries</h3>
              <p className="text-gray-600">info@theshadium.com</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Technical Support</h3>
              <p className="text-gray-600">support@theshadium.com</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Partnership Opportunities</h3>
              <p className="text-gray-600">partnerships@theshadium.com</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl border bg-white p-4 md:p-5 shadow-sm stack">
          <h2 className="h2">Send us a Message</h2>
          <form className="stack">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
      
      <div className="rounded-xl border bg-blue-50 p-4 md:p-5 shadow-sm stack">
        <h3 className="text-lg font-semibold">Quick Tip</h3>
        <p className="text-gray-700 max-w-prose">
          Before contacting support, check our FAQs page for answers to common questions about 
          using The Shadium to find shaded seats at your favorite ballpark.
        </p>
      </div>
    </div>
  );
}