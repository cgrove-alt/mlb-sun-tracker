'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from '../../styles/Legal.module.css';
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
    <div className={styles.legalContainer}>
      <div className={styles.legalContent}>
        <h1>Do Not Sell or Share My Personal Information</h1>
        <p className={styles.lastUpdated}>California Consumer Privacy Act (CCPA) Rights</p>
        <p className={styles.effectiveDate}>Your Privacy, Your Choice</p>

        <div className={styles.tableOfContents}>
          <h2>Quick Links</h2>
          <ul>
            <li><a href="#rights">Your Rights</a></li>
            <li><a href="#what-we-collect">Information We Collect</a></li>
            <li><a href="#opt-out-form">Opt-Out Request Form</a></li>
            <li><a href="#verification">Verification Process</a></li>
            <li><a href="#contact">Contact Information</a></li>
          </ul>
        </div>

        <section id="rights" className={styles.section}>
          <h2>Your California Privacy Rights</h2>
          <div className={styles.infoBox}>
            <p>
              <strong>Under the California Consumer Privacy Act (CCPA), California residents 
              have the right to opt-out of the sale or sharing of their personal information.</strong>
            </p>
          </div>
          
          <p>
            The Shadium respects your privacy rights. While we do not sell personal information 
            in the traditional sense, we want to provide you with maximum control over your data.
          </p>
          
          <h3>Your Rights Include:</h3>
          <ul>
            <li><strong>Right to Opt-Out:</strong> You can direct us not to sell or share your personal information</li>
            <li><strong>Right to Know:</strong> You can request information about data collection and sharing practices</li>
            <li><strong>Right to Delete:</strong> You can request deletion of your personal information</li>
            <li><strong>Right to Non-Discrimination:</strong> We won't discriminate against you for exercising privacy rights</li>
            <li><strong>Right to Correct:</strong> You can request correction of inaccurate personal information</li>
            <li><strong>Right to Limit Use:</strong> You can limit use of sensitive personal information</li>
          </ul>
        </section>

        <section id="what-we-collect" className={styles.section}>
          <h2>Information We May Share</h2>
          <p>
            The Shadium may share certain categories of information with service providers 
            for business purposes. This may include:
          </p>
          
          <h3>Categories of Information:</h3>
          <ul>
            <li>
              <strong>Analytics Data:</strong> Aggregated usage statistics shared with 
              Google Analytics for website improvement
            </li>
            <li>
              <strong>Technical Data:</strong> IP addresses and device information shared 
              with security and performance services
            </li>
            <li>
              <strong>Location Data:</strong> Approximate location for providing relevant 
              stadium information (only with consent)
            </li>
          </ul>
          
          <h3>We Do NOT Sell:</h3>
          <ul>
            <li>Your name or contact information</li>
            <li>Your browsing history</li>
            <li>Your search queries</li>
            <li>Any personally identifiable information to third parties</li>
          </ul>
        </section>

        <section id="opt-out-form" className={styles.section}>
          <h2>Submit Your Opt-Out Request</h2>
          
          {isGPCEnabled ? (
            <div className={styles.infoBox} style={{ borderColor: '#4caf50', backgroundColor: '#e8f5e9' }}>
              <h3 style={{ color: '#2e7d32' }}>✓ Opt-Out Already Active via GPC</h3>
              <p style={{ color: '#2e7d32' }}>
                Your Global Privacy Control signal is active and we're honoring your opt-out 
                preference automatically. You don't need to submit a separate request.
              </p>
              <p style={{ color: '#2e7d32', marginTop: '10px' }}>
                If you'd still like to submit a formal request for your records, you can do so below.
              </p>
            </div>
          ) : null}
          
          {!formSubmitted ? (
            <form onSubmit={handleSubmit} className={styles.privacyForm}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="state">State of Residence *</label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                >
                  <option value="CA">California</option>
                  <option value="OTHER">Other State</option>
                </select>
              </div>
              
              <div className={styles.checkboxGroup}>
                <label>
                  <input
                    type="checkbox"
                    name="confirmResident"
                    checked={formData.confirmResident}
                    onChange={handleInputChange}
                    required
                  />
                  I confirm that I am a California resident *
                </label>
              </div>
              
              <div className={styles.checkboxGroup}>
                <label>
                  <input
                    type="checkbox"
                    name="confirmIdentity"
                    checked={formData.confirmIdentity}
                    onChange={handleInputChange}
                    required
                  />
                  I confirm that the information provided is accurate and that I am 
                  submitting this request on my own behalf *
                </label>
              </div>
              
              <button type="submit" className={styles.submitButton}>
                Submit Opt-Out Request
              </button>
            </form>
          ) : (
            <div className={styles.doNotSell}>
              <h3>✓ Request Received</h3>
              <p>
                Your opt-out request has been received. We will process your request 
                within 15 business days. You will receive a confirmation email at the 
                address provided.
              </p>
              <p>
                Request Reference Number: <strong>CCPA-{Date.now()}</strong>
              </p>
            </div>
          )}
        </section>

        <section id="verification" className={styles.section}>
          <h2>Verification Process</h2>
          <p>
            To protect your privacy and security, we may need to verify your identity 
            before processing your request. The verification process may include:
          </p>
          <ul>
            <li>Confirming your email address through a verification link</li>
            <li>Matching information you provide with information we have on file</li>
            <li>Requesting additional information if necessary</li>
          </ul>
          
          <div className={styles.infoBox}>
            <p>
              <strong>Note:</strong> We will only use information provided in your request 
              for verification purposes and to process your privacy rights request.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Other Ways to Opt-Out</h2>
          
          <h3>Global Privacy Control</h3>
          
          {/* Show dynamic GPC status */}
          <GPCStatusIndicator variant="detailed" />
          
          <p>
            The Shadium honors the Global Privacy Control (GPC) signal. If your browser 
            sends a GPC signal, we will treat it as a valid opt-out request.
          </p>
          
          {isGPCEnabled && (
            <div className={styles.infoBox} style={{ borderColor: '#4caf50', backgroundColor: '#e8f5e9' }}>
              <p style={{ color: '#2e7d32' }}>
                <strong>✓ Your GPC signal is currently active.</strong> We are automatically 
                honoring your opt-out preference. No additional action is needed.
              </p>
            </div>
          )}
          
          <h3>Cookie Preferences</h3>
          <p>
            You can also manage your privacy preferences through our{' '}
            <button 
              className={styles.linkButton}
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
          
          <h3>Email</h3>
          <p>
            Send your opt-out request to:{' '}
            <a href="mailto:legal@theshadium.com">legal@theshadium.com</a>
          </p>
        </section>

        <section className={styles.section}>
          <h2>Authorized Agents</h2>
          <p>
            You may designate an authorized agent to make a request on your behalf. 
            To do so, you must:
          </p>
          <ul>
            <li>Provide the agent with written permission to act on your behalf</li>
            <li>Verify your identity directly with us</li>
            <li>Provide us with a copy of the power of attorney or written permission</li>
          </ul>
          <p>
            Authorized agents should contact us at legal@theshadium.com with proof 
            of authorization.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Response Timeline</h2>
          <p>We will respond to your request within the following timeframes:</p>
          <ul>
            <li><strong>Acknowledgment:</strong> Within 10 days of receiving your request</li>
            <li><strong>Completion:</strong> Within 45 days of receiving your request</li>
            <li><strong>Extension:</strong> If more time is needed (up to 90 days total), we'll notify you</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>For Nevada Residents</h2>
          <p>
            Nevada residents have the right to opt-out of the sale of certain personal 
            information under Nevada Revised Statutes Chapter 603A. To exercise this 
            right, please submit a request using the form above or contact us at 
            legal@theshadium.com.
          </p>
        </section>

        <section className={styles.section}>
          <h2>For Other States</h2>
          <p>
            If you are a resident of Colorado, Connecticut, Utah, or Virginia, you may 
            have additional privacy rights under your state's law. Please contact us 
            to exercise these rights.
          </p>
        </section>

        <section id="contact" className={styles.section}>
          <h2>Contact Information</h2>
          <div className={styles.contactInfo}>
            <p><strong>The Shadium Legal Team</strong></p>
            <p>Email: legal@theshadium.com</p>
            <p>
              Mail:<br />
              The Shadium Privacy Rights<br />
              Attn: CCPA Opt-Out Request<br />
              [Physical Address]<br />
              [City, State ZIP]
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Additional Resources</h2>
          <p>Learn more about your privacy rights:</p>
          <ul>
            <li>
              <Link href="/privacy">Our Complete Privacy Policy</Link>
            </li>
            <li>
              <Link href="/cookies">Cookie Policy</Link>
            </li>
            <li>
              <a href="https://oag.ca.gov/privacy/ccpa" target="_blank" rel="noopener noreferrer">
                California Attorney General - CCPA
              </a>
            </li>
            <li>
              <a href="https://globalprivacycontrol.org/" target="_blank" rel="noopener noreferrer">
                Global Privacy Control
              </a>
            </li>
          </ul>
        </section>

        <div className={styles.acceptanceNotice}>
          <p>
            <strong>The Shadium respects your privacy choices. We are committed to 
            protecting your personal information and honoring your opt-out preferences.</strong>
          </p>
        </div>
      </div>
    </div>
  );
}