'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import GPCStatusIndicator from '../../components/GPCStatusIndicator';
import { useGlobalPrivacyControl } from '../../hooks/useGlobalPrivacyControl';

export default function DoNotSellPage() {
  const { isGPCEnabled, isGPCSupported } = useGlobalPrivacyControl();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    state: 'CA',
    confirmResident: false,
    confirmIdentity: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would submit to a backend service
    console.log('CCPA Opt-Out Request:', formData);
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-5 bg-[linear-gradient(135deg,#f5f7fa_0%,#c3cfe2_100%)]">
      <div className="max-w-[900px] mx-auto bg-white rounded-xl p-10 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
        <h1 className="text-[2.5rem] text-[#1a1a1a] mb-2.5 border-b-[3px] border-blue-500 pb-4">Do Not Sell or Share My Personal Information</h1>
        <p className="text-gray-600 text-[0.95rem] my-1">California Consumer Privacy Act (CCPA) Rights</p>
        <p className="text-gray-600 text-[0.95rem] my-1">Your Privacy, Your Choice</p>

        <div className="bg-gray-50 rounded-lg p-5 my-8">
          <h2 className="text-[1.3rem] text-[#333] mb-4">Quick Links</h2>
          <ul className="list-none p-0">
            <li className="my-2"><a href="#rights" className="text-blue-500 no-underline transition-colors hover:text-[#1976d2] hover:underline">Your Rights</a></li>
            <li className="my-2"><a href="#what-we-collect" className="text-blue-500 no-underline transition-colors hover:text-[#1976d2] hover:underline">Information We Collect</a></li>
            <li className="my-2"><a href="#opt-out-form" className="text-blue-500 no-underline transition-colors hover:text-[#1976d2] hover:underline">Opt-Out Request Form</a></li>
            <li className="my-2"><a href="#verification" className="text-blue-500 no-underline transition-colors hover:text-[#1976d2] hover:underline">Verification Process</a></li>
            <li className="my-2"><a href="#contact" className="text-blue-500 no-underline transition-colors hover:text-[#1976d2] hover:underline">Contact Information</a></li>
          </ul>
        </div>

        <section id="rights" className="my-10 pt-5">
          <h2 className="text-[1.8rem] text-[#1a1a1a] mb-5 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-blue-500">Your California Privacy Rights</h2>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-5 rounded">
            <p className="my-2 text-[#1565c0]">
              <strong>Under the California Consumer Privacy Act (CCPA), California residents
              have the right to opt-out of the sale or sharing of their personal information.</strong>
            </p>
          </div>


          <p className="leading-[1.8] text-[#444] my-4">
            The Shadium respects your privacy rights. While we do not sell personal information
            in the traditional sense, we want to provide you with maximum control over your data.
          </p>

          <h3 className="text-[1.3rem] text-[#333] my-6">Your Rights Include:</h3>
          <ul className="my-4 pl-6">
            <li className="leading-[1.8] text-[#444] my-2"><strong>Right to Opt-Out:</strong> You can direct us not to sell or share your personal information</li>
            <li className="leading-[1.8] text-[#444] my-2"><strong>Right to Know:</strong> You can request information about data collection and sharing practices</li>
            <li className="leading-[1.8] text-[#444] my-2"><strong>Right to Delete:</strong> You can request deletion of your personal information</li>
            <li className="leading-[1.8] text-[#444] my-2"><strong>Right to Non-Discrimination:</strong> We won't discriminate against you for exercising privacy rights</li>
            <li className="leading-[1.8] text-[#444] my-2"><strong>Right to Correct:</strong> You can request correction of inaccurate personal information</li>
            <li className="leading-[1.8] text-[#444] my-2"><strong>Right to Limit Use:</strong> You can limit use of sensitive personal information</li>
          </ul>
        </section>

        <section id="what-we-collect" className="my-10 pt-5">
          <h2 className="text-[1.8rem] text-[#1a1a1a] mb-5 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-blue-500">Information We May Share</h2>
          <p className="leading-[1.8] text-[#444] my-4">
            The Shadium may share certain categories of information with service providers
            for business purposes. This may include:
          </p>

          <h3 className="text-[1.3rem] text-[#333] my-6">Categories of Information:</h3>
          <ul className="my-4 pl-6">
            <li className="leading-[1.8] text-[#444] my-2">
              <strong>Analytics Data:</strong> Aggregated usage statistics shared with
              Google Analytics for website improvement
            </li>
            <li className="leading-[1.8] text-[#444] my-2">
              <strong>Technical Data:</strong> IP addresses and device information shared
              with security and performance services
            </li>
            <li className="leading-[1.8] text-[#444] my-2">
              <strong>Location Data:</strong> Approximate location for providing relevant
              stadium information (only with consent)
            </li>
          </ul>

          <h3 className="text-[1.3rem] text-[#333] my-6">We Do NOT Sell:</h3>
          <ul className="my-4 pl-6">
            <li className="leading-[1.8] text-[#444] my-2">Your name or contact information</li>
            <li className="leading-[1.8] text-[#444] my-2">Your browsing history</li>
            <li className="leading-[1.8] text-[#444] my-2">Your search queries</li>
            <li className="leading-[1.8] text-[#444] my-2">Any personally identifiable information to third parties</li>
          </ul>
        </section>

        <section id="opt-out-form" className="my-10 pt-5">
          <h2 className="text-[1.8rem] text-[#1a1a1a] mb-5 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-blue-500">Submit Your Opt-Out Request</h2>

          {isGPCEnabled ? (
            <div className="bg-[#e8f5e9] border-l-4 border-green-500 p-4 my-5 rounded">
              <h3 className="text-[1.3rem] text-[#2e7d32] my-6">✓ Opt-Out Already Active via GPC</h3>
              <p className="my-2 text-[#2e7d32]">
                Your Global Privacy Control signal is active and we're honoring your opt-out
                preference automatically. You don't need to submit a separate request.
              </p>
              <p className="my-2 text-[#2e7d32] mt-2.5">
                If you'd still like to submit a formal request for your records, you can do so below.
              </p>
            </div>
          ) : null}


          {!formSubmitted ? (
            <form onSubmit={handleSubmit} className="max-w-[600px] my-8">
              <div className="mb-5">
                <label htmlFor="firstName" className="block mb-2 font-semibold text-[#333]">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2.5 border border-gray-300 rounded-md text-base transition-[border-color] focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(33,150,243,0.1)]"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="lastName" className="block mb-2 font-semibold text-[#333]">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2.5 border border-gray-300 rounded-md text-base transition-[border-color] focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(33,150,243,0.1)]"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="email" className="block mb-2 font-semibold text-[#333]">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2.5 border border-gray-300 rounded-md text-base transition-[border-color] focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(33,150,243,0.1)]"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="state" className="block mb-2 font-semibold text-[#333]">State of Residence *</label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2.5 border border-gray-300 rounded-md text-base transition-[border-color] focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(33,150,243,0.1)]"
                >
                  <option value="CA">California</option>
                  <option value="OTHER">Other State</option>
                </select>
              </div>

              <div className="my-5">
                <label className="flex items-start cursor-pointer leading-[1.6]">
                  <input
                    type="checkbox"
                    name="confirmResident"
                    checked={formData.confirmResident}
                    onChange={handleInputChange}
                    required
                    className="mr-2.5 mt-1 cursor-pointer"
                  />
                  I confirm that I am a California resident *
                </label>
              </div>

              <div className="my-5">
                <label className="flex items-start cursor-pointer leading-[1.6]">
                  <input
                    type="checkbox"
                    name="confirmIdentity"
                    checked={formData.confirmIdentity}
                    onChange={handleInputChange}
                    required
                    className="mr-2.5 mt-1 cursor-pointer"
                  />
                  I confirm that the information provided is accurate and that I am
                  submitting this request on my own behalf *
                </label>
              </div>

              <button type="submit" className="bg-blue-500 text-white px-8 py-3 border-none rounded-md text-[1.1rem] font-semibold cursor-pointer transition-colors hover:bg-[#1976d2]">
                Submit Opt-Out Request
              </button>
            </form>
          ) : (
            <div className="bg-[#fff3e0] border-2 border-[#ff9800] rounded-lg p-5 my-5">
              <h3 className="text-[#e65100] mt-0">✓ Request Received</h3>
              <p className="leading-[1.8] text-[#444] my-4">
                Your opt-out request has been received. We will process your request
                within 15 business days. You will receive a confirmation email at the
                address provided.
              </p>
              <p className="leading-[1.8] text-[#444] my-4">
                Request Reference Number: <strong>CCPA-{Date.now()}</strong>
              </p>
            </div>
          )}
        </section>

        <section id="verification" className="my-10 pt-5">
          <h2 className="text-[1.8rem] text-[#1a1a1a] mb-5 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-blue-500">Verification Process</h2>
          <p className="leading-[1.8] text-[#444] my-4">
            To protect your privacy and security, we may need to verify your identity
            before processing your request. The verification process may include:
          </p>
          <ul className="my-4 pl-6">
            <li className="leading-[1.8] text-[#444] my-2">Confirming your email address through a verification link</li>
            <li className="leading-[1.8] text-[#444] my-2">Matching information you provide with information we have on file</li>
            <li className="leading-[1.8] text-[#444] my-2">Requesting additional information if necessary</li>
          </ul>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-5 rounded">
            <p className="my-2 text-[#1565c0]">
              <strong>Note:</strong> We will only use information provided in your request
              for verification purposes and to process your privacy rights request.
            </p>
          </div>
        </section>

        <section className="my-10 pt-5">
          <h2 className="text-[1.8rem] text-[#1a1a1a] mb-5 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-blue-500">Other Ways to Opt-Out</h2>

          <h3 className="text-[1.3rem] text-[#333] my-6">Global Privacy Control</h3>

          {/* Show dynamic GPC status */}
          <GPCStatusIndicator variant="detailed" />

          <p className="leading-[1.8] text-[#444] my-4">
            The Shadium honors the Global Privacy Control (GPC) signal. If your browser
            sends a GPC signal, we will treat it as a valid opt-out request.
          </p>

          {isGPCEnabled && (
            <div className="bg-[#e8f5e9] border-l-4 border-green-500 p-4 my-5 rounded">
              <p className="my-2 text-[#2e7d32]">
                <strong>✓ Your GPC signal is currently active.</strong> We are automatically
                honoring your opt-out preference. No additional action is needed.
              </p>
            </div>
          )}

          <h3 className="text-[1.3rem] text-[#333] my-6">Cookie Preferences</h3>
          <p className="leading-[1.8] text-[#444] my-4">
            You can also manage your privacy preferences through our{' '}
            <button
              className="bg-none border-none text-blue-500 underline cursor-pointer font-[inherit] p-0 transition-colors hover:text-[#1976d2]"
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).showCookiePreferences) {
                  (window as any).showCookiePreferences();
                }
              }}
            >
              Cookie Preferences
            </button>{' '}
            tool.
          </p>

          <h3 className="text-[1.3rem] text-[#333] my-6">Email</h3>
          <p className="leading-[1.8] text-[#444] my-4">
            Send your opt-out request to:{' '}
            <a href="mailto:legal@theshadium.com">legal@theshadium.com</a>
          </p>
        </section>

        <section className="my-10 pt-5">
          <h2 className="text-[1.8rem] text-[#1a1a1a] mb-5 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-blue-500">Authorized Agents</h2>
          <p className="leading-[1.8] text-[#444] my-4">
            You may designate an authorized agent to make a request on your behalf.
            To do so, you must:
          </p>
          <ul className="my-4 pl-6">
            <li className="leading-[1.8] text-[#444] my-2">Provide the agent with written permission to act on your behalf</li>
            <li className="leading-[1.8] text-[#444] my-2">Verify your identity directly with us</li>
            <li className="leading-[1.8] text-[#444] my-2">Provide us with a copy of the power of attorney or written permission</li>
          </ul>
          <p className="leading-[1.8] text-[#444] my-4">
            Authorized agents should contact us at legal@theshadium.com with proof
            of authorization.
          </p>
        </section>

        <section className="my-10 pt-5">
          <h2 className="text-[1.8rem] text-[#1a1a1a] mb-5 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-blue-500">Response Timeline</h2>
          <p className="leading-[1.8] text-[#444] my-4">We will respond to your request within the following timeframes:</p>
          <ul className="my-4 pl-6">
            <li className="leading-[1.8] text-[#444] my-2"><strong>Acknowledgment:</strong> Within 10 days of receiving your request</li>
            <li className="leading-[1.8] text-[#444] my-2"><strong>Completion:</strong> Within 45 days of receiving your request</li>
            <li className="leading-[1.8] text-[#444] my-2"><strong>Extension:</strong> If more time is needed (up to 90 days total), we'll notify you</li>
          </ul>
        </section>

        <section className="my-10 pt-5">
          <h2 className="text-[1.8rem] text-[#1a1a1a] mb-5 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-blue-500">For Nevada Residents</h2>
          <p className="leading-[1.8] text-[#444] my-4">
            Nevada residents have the right to opt-out of the sale of certain personal
            information under Nevada Revised Statutes Chapter 603A. To exercise this
            right, please submit a request using the form above or contact us at
            legal@theshadium.com.
          </p>
        </section>

        <section className="my-10 pt-5">
          <h2 className="text-[1.8rem] text-[#1a1a1a] mb-5 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-blue-500">For Other States</h2>
          <p className="leading-[1.8] text-[#444] my-4">
            If you are a resident of Colorado, Connecticut, Utah, or Virginia, you may
            have additional privacy rights under your state's law. Please contact us
            to exercise these rights.
          </p>
        </section>

        <section id="contact" className="my-10 pt-5">
          <h2 className="text-[1.8rem] text-[#1a1a1a] mb-5 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-blue-500">Contact Information</h2>
          <div className="bg-gray-50 border-l-4 border-blue-500 p-5 my-5 rounded">
            <p className="my-2 text-[#333]"><strong>The Shadium Legal Team</strong></p>
            <p className="my-2 text-[#333]">Email: legal@theshadium.com</p>
          </div>
        </section>

        <section className="my-10 pt-5">
          <h2 className="text-[1.8rem] text-[#1a1a1a] mb-5 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-blue-500">Additional Resources</h2>
          <p className="leading-[1.8] text-[#444] my-4">Learn more about your privacy rights:</p>
          <ul className="my-4 pl-6">
            <li className="leading-[1.8] text-[#444] my-2">
              <Link href="/privacy">Our Complete Privacy Policy</Link>
            </li>
            <li className="leading-[1.8] text-[#444] my-2">
              <Link href="/cookies">Cookie Policy</Link>
            </li>
            <li className="leading-[1.8] text-[#444] my-2">
              <a href="https://oag.ca.gov/privacy/ccpa" target="_blank" rel="noopener noreferrer">
                California Attorney General - CCPA
              </a>
            </li>
            <li className="leading-[1.8] text-[#444] my-2">
              <a href="https://globalprivacycontrol.org/" target="_blank" rel="noopener noreferrer">
                Global Privacy Control
              </a>
            </li>
          </ul>
        </section>

        <div className="bg-[#e3f2fd] border-2 border-blue-500 rounded-lg p-5 my-10 text-center">
          <p className="m-0 text-[#1565c0] font-medium">
            <strong>The Shadium respects your privacy choices. We are committed to
            protecting your personal information and honoring your opt-out preferences.</strong>
          </p>
        </div>
      </div>
    </div>
  );
}