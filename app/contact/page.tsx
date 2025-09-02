'use client';

import { useState, FormEvent } from 'react';
import { Metadata } from 'next';

// Note: Metadata must be exported from a server component
// We'll create a layout.tsx for the metadata

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string; // Honeypot field
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you for your message! We\'ll get back to you soon.'
        });
        // Clear form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Failed to send message. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: 'error',
        message: 'An error occurred. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 stack">
      <h1 className="h1 break-words md:break-normal">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        <div className="rounded-xl border bg-white p-4 md:p-5 shadow-sm stack">
          <h2 className="h2">Get in Touch</h2>
          <p className="text-ink-700 max-w-prose">
            Have questions, suggestions, or feedback? We'd love to hear from you! 
            Our team is dedicated to helping fans find the perfect shaded seats.
          </p>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">General Inquiries</h3>
              <p className="text-ink-700">info@theshadium.com</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Technical Support</h3>
              <p className="text-ink-700">support@theshadium.com</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Partnership Opportunities</h3>
              <p className="text-ink-700">partnerships@theshadium.com</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Legal Inquiries</h3>
              <p className="text-ink-700">legal@theshadium.com</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Privacy Rights Requests</h3>
              <p className="text-ink-700 mb-2">legal@theshadium.com</p>
              <a href="/privacy-rights" className="inline-block text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition-colors">
                Visit Privacy Rights Center →
              </a>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl border bg-white p-4 md:p-5 shadow-sm stack">
          <h2 className="h2">Send us a Message</h2>
          
          {submitStatus.type && (
            <div className={`p-4 rounded-lg ${
              submitStatus.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {submitStatus.message}
            </div>
          )}
          
          <form className="stack" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-ink-900 mb-1">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink-900 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-ink-900 mb-1">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-ink-900 mb-1">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
                disabled={isSubmitting}
              ></textarea>
            </div>
            
            {/* Honeypot field for spam prevention */}
            <input 
              type="text" 
              name="website" 
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-200 ${
                isSubmitting 
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>
      </div>
      
      <div className="rounded-xl border bg-blue-50 p-4 md:p-5 shadow-sm stack">
        <h3 className="text-lg font-semibold">Quick Tip</h3>
        <p className="text-ink-700 max-w-prose">
          Before contacting support, check our FAQs page for answers to common questions about 
          using The Shadium to find shaded seats at your favorite ballpark.
        </p>
      </div>
    </div>
  );
}