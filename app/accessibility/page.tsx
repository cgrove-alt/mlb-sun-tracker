import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Accessibility Statement | The Shadium',
  description: 'The Shadium is committed to ensuring digital accessibility for people with disabilities. Learn about our accessibility features and how to report issues.',
  openGraph: {
    title: 'Accessibility Statement | The Shadium',
    description: 'Our commitment to digital accessibility and WCAG compliance for all users.',
  },
};

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen pt-20 pb-10 px-5 bg-[linear-gradient(135deg,#f5f7fa_0%,#c3cfe2_100%)]">
      <div className="max-w-[900px] mx-auto bg-white rounded-xl p-10 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
        <h1 className="text-[2.5rem] text-[#1a1a1a] mb-2.5 border-b-[3px] border-blue-500 pb-4">Accessibility Statement</h1>
        <p className="text-gray-600 text-[0.95rem] my-1">Last Updated: January 2025</p>
        <p className="text-gray-600 text-[0.95rem] my-1">WCAG 2.1 Level AA Compliance</p>

        <div className="bg-gray-50 rounded-lg p-5 my-8">
          <h2 className="text-[1.3rem] text-[#333] mb-4">Quick Navigation</h2>
          <ul className="list-none p-0">
            <li className="my-2"><a href="#commitment" className="text-blue-500 no-underline transition-colors hover:text-[#1976d2] hover:underline">Our Commitment</a></li>
            <li className="my-2"><a href="#standards" className="text-blue-500 no-underline transition-colors hover:text-[#1976d2] hover:underline">Accessibility Standards</a></li>
            <li className="my-2"><a href="#features" className="text-blue-500 no-underline transition-colors hover:text-[#1976d2] hover:underline">Accessibility Features</a></li>
            <li className="my-2"><a href="#compatibility" className="text-blue-500 no-underline transition-colors hover:text-[#1976d2] hover:underline">Browser Compatibility</a></li>
            <li className="my-2"><a href="#known-issues" className="text-blue-500 no-underline transition-colors hover:text-[#1976d2] hover:underline">Known Issues</a></li>
            <li className="my-2"><a href="#feedback" className="text-blue-500 no-underline transition-colors hover:text-[#1976d2] hover:underline">Feedback & Contact</a></li>
            <li className="my-2"><a href="#alternatives" className="text-blue-500 no-underline transition-colors hover:text-[#1976d2] hover:underline">Alternative Formats</a></li>
          </ul>
        </div>

        <section id="commitment" className="my-10 pt-5">
          <h2 className="text-[1.8rem] text-[#1a1a1a] mb-5 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-blue-500">1. Our Commitment to Accessibility</h2>
          <p className="leading-[1.8] text-[#444] my-4">
            The Shadium is committed to ensuring digital accessibility for people with
            disabilities. We are continually improving the user experience for everyone
            and applying the relevant accessibility standards.
          </p>
          <p className="leading-[1.8] text-[#444] my-4">
            We believe that all users, regardless of ability, should have equal access
            to information about stadium seating and sun exposure. Our goal is to provide
            an inclusive experience that allows everyone to find the perfect seats for
            their needs.
          </p>
        </section>

        <section id="standards" className="my-10 pt-5">
          <h2 className="text-[1.8rem] text-[#1a1a1a] mb-5 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-blue-500">2. Accessibility Standards</h2>
          <p className="leading-[1.8] text-[#444] my-4">
            The Shadium strives to conform to the Web Content Accessibility Guidelines
            (WCAG) 2.1 Level AA standards. These guidelines explain how to make web
            content more accessible for people with disabilities and more user-friendly
            for everyone.
          </p>

          <h3 className="text-[1.3rem] text-[#333] my-6">Conformance Status</h3>
          <p className="leading-[1.8] text-[#444] my-4">
            We aim to meet WCAG 2.1 Level AA standards, which means our website should be:
          </p>
          <ul className="my-4 pl-6">
            <li className="leading-[1.8] text-[#444] my-2"><strong className="text-[#1a1a1a] font-semibold">Perceivable:</strong> Information and UI components are presentable in ways users can perceive</li>
            <li className="leading-[1.8] text-[#444] my-2"><strong className="text-[#1a1a1a] font-semibold">Operable:</strong> UI components and navigation are operable via keyboard and other methods</li>
            <li className="leading-[1.8] text-[#444] my-2"><strong className="text-[#1a1a1a] font-semibold">Understandable:</strong> Information and UI operation are understandable</li>
            <li className="leading-[1.8] text-[#444] my-2"><strong className="text-[#1a1a1a] font-semibold">Robust:</strong> Content is robust enough for interpretation by assistive technologies</li>
          </ul>
        </section>

        <section id="features" className="my-10 pt-5">
          <h2 className="text-[1.8rem] text-[#1a1a1a] mb-5 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-6 before:bg-blue-500">3. Accessibility Features</h2>
          <p className="leading-[1.8] text-[#444] my-4">
            The Shadium includes the following accessibility features to improve your experience:
          </p>
          
          <h3>Navigation & Structure</h3>
          <ul>
            <li>Consistent navigation throughout the website</li>
            <li>Semantic HTML5 markup for proper document structure</li>
            <li>Descriptive page titles and headings</li>
            <li>Skip navigation links for keyboard users ✓</li>
            <li>Breadcrumb navigation (Partially Implemented)</li>
          </ul>
          
          <h3>Visual Design</h3>
          <ul>
            <li>Sufficient color contrast ratios (minimum 4.5:1 for normal text) ✓</li>
            <li>Text is resizable up to 200% without loss of functionality</li>
            <li>Enhanced focus indicators for keyboard navigation ✓</li>
            <li>No reliance on color alone to convey information</li>
            <li>Responsive design for various screen sizes and orientations</li>
          </ul>
          
          <h3>Interactive Elements</h3>
          <ul>
            <li>All functionality available via keyboard</li>
            <li>Form labels and instructions clearly associated with inputs</li>
            <li>Error messages that clearly identify issues</li>
            <li>Buttons and links with descriptive text</li>
            <li>ARIA labels for all interactive elements ✓</li>
          </ul>
          
          <h3>Content</h3>
          <ul>
            <li>Alternative text for informative images (In Progress)</li>
            <li>Captions and transcripts for video content (where applicable)</li>
            <li>Clear and simple language where possible</li>
            <li>Tables with proper headers and captions</li>
            <li>Lists properly marked up for screen readers</li>
          </ul>
          
          <h3>Stadium Shade Information</h3>
          <ul>
            <li>Shade percentages announced to screen readers ✓</li>
            <li>Color-blind friendly shade visualization options (Coming Soon)</li>
            <li>Text descriptions of sun exposure levels</li>
            <li>Keyboard-navigable stadium maps</li>
            <li>Alternative data table views for complex visualizations</li>
          </ul>
        </section>

        <section id="compatibility" className="my-10 pt-5">
          <h2>4. Browser and Assistive Technology Compatibility</h2>
          <p>
            The Shadium is designed to be compatible with the following assistive technologies:
          </p>
          
          <h3>Screen Readers</h3>
          <ul>
            <li>NVDA (Windows)</li>
            <li>JAWS (Windows)</li>
            <li>VoiceOver (macOS and iOS)</li>
            <li>TalkBack (Android)</li>
          </ul>
          
          <h3>Browsers</h3>
          <p>
            We support the current and previous major version of:
          </p>
          <ul>
            <li>Chrome</li>
            <li>Firefox</li>
            <li>Safari</li>
            <li>Edge</li>
          </ul>
          
          <h3>Mobile Devices</h3>
          <p>
            Our website is fully responsive and tested on:
          </p>
          <ul>
            <li>iOS devices (iPhone and iPad)</li>
            <li>Android devices (phones and tablets)</li>
          </ul>
        </section>

        <section className="my-10 pt-5">
          <h2>5. Recent Accessibility Improvements</h2>
          <p>
            We've recently implemented several accessibility enhancements:
          </p>
          <ul>
            <li><strong>Skip Navigation Links:</strong> Added skip to main content, navigation, and footer links</li>
            <li><strong>Screen Reader Support:</strong> Shade percentages now announced with descriptive context</li>
            <li><strong>Enhanced Color Contrast:</strong> All text now meets WCAG AA standards (4.5:1 ratio)</li>
            <li><strong>Improved Focus Indicators:</strong> Clear 3px outline with offset for all interactive elements</li>
            <li><strong>ARIA Labels:</strong> All buttons and navigation elements properly labeled</li>
          </ul>
        </section>

        <section id="known-issues" className="my-10 pt-5">
          <h2>6. Known Accessibility Issues & Roadmap</h2>
          <p>
            We are actively working to address the following known issues:
          </p>
          <ul>
            <li>Some third-party embedded content may not be fully accessible</li>
            <li>Complex stadium 3D visualizations require alternative text descriptions (In Progress)</li>
            <li>Site-wide breadcrumb navigation is being expanded</li>
            <li>Color-blind mode toggle is under development</li>
            <li>Alternative text for all images is being added</li>
          </ul>
          <p>
            <strong>Upcoming Features (Q1 2025):</strong>
          </p>
          <ul>
            <li>Color-blind friendly visualization modes with patterns</li>
            <li>Complete breadcrumb navigation across all pages</li>
            <li>Alternative text for all stadium visualizations</li>
            <li>Keyboard shortcuts for common actions</li>
            <li>High contrast mode toggle</li>
          </ul>
          <p>
            We are committed to resolving these issues and continuously improving 
            accessibility across our platform.
          </p>
        </section>

        <section id="feedback" className="my-10 pt-5">
          <h2>7. Feedback and Contact Information</h2>
          <p>
            We welcome your feedback on the accessibility of The Shadium. Please let us 
            know if you encounter accessibility barriers:
          </p>
          
          <div className="bg-gray-50 border-l-4 border-blue-500 p-5 my-5 rounded">
            <h3 className="text-[1.3rem] text-[#333] my-6">Accessibility Feedback</h3>
            <p className="my-2 text-[#333]">Email: support@theshadium.com</p>
            <p className="my-2 text-[#333]">Subject Line: Accessibility Feedback</p>
          </div>
          
          <p>
            We try to respond to accessibility feedback within 2 business days, and 
            to resolve identified issues within 10 business days.
          </p>
          
          <h3>When Contacting Us</h3>
          <p>
            Please provide the following information to help us address your concern:
          </p>
          <ul>
            <li>The web page URL where you experienced the issue</li>
            <li>A description of the problem you encountered</li>
            <li>The assistive technology you were using (if applicable)</li>
            <li>Your browser and operating system</li>
            <li>Your contact information if you'd like a response</li>
          </ul>
        </section>

        <section id="alternatives" className="my-10 pt-5">
          <h2>8. Alternative Formats</h2>
          <p>
            If you need information from The Shadium in an alternative format, please 
            contact us and we will make every effort to provide it to you:
          </p>
          <ul>
            <li>Large print versions of key information</li>
            <li>Audio descriptions of stadium layouts</li>
            <li>Simplified text versions of complex content</li>
            <li>Data in spreadsheet format for screen reader users</li>
          </ul>
          <p>
            Alternative format requests can be made through our accessibility email 
            or phone number listed above.
          </p>
        </section>

        <section className="my-10 pt-5">
          <h2>9. Enforcement and Legal</h2>
          <p>
            The Shadium is committed to accessibility as a matter of corporate 
            responsibility and legal compliance. We follow:
          </p>
          <ul>
            <li>Americans with Disabilities Act (ADA)</li>
            <li>Section 508 of the Rehabilitation Act</li>
            <li>California Unruh Civil Rights Act</li>
            <li>European Accessibility Act (for EU users)</li>
          </ul>
        </section>

        <section className="my-10 pt-5">
          <h2>10. Third-Party Content</h2>
          <p>
            While we strive to ensure all content on The Shadium is accessible, we 
            cannot guarantee the accessibility of third-party content including:
          </p>
          <ul>
            <li>External links to stadium or team websites</li>
            <li>Third-party ticketing platforms</li>
            <li>Embedded social media content</li>
            <li>External weather service data</li>
          </ul>
          <p>
            We encourage users to contact us if third-party content creates barriers 
            to accessing our services.
          </p>
        </section>

        <section className="my-10 pt-5">
          <h2>11. Continuous Improvement</h2>
          <p>
            Accessibility is an ongoing effort at The Shadium. We regularly:
          </p>
          <ul>
            <li>Conduct accessibility audits</li>
            <li>Train our team on accessibility best practices</li>
            <li>Test with users who have disabilities</li>
            <li>Update our technology to improve accessibility</li>
            <li>Monitor and address accessibility feedback</li>
          </ul>
        </section>

        <div className="bg-[#e3f2fd] border-2 border-blue-500 rounded-lg p-5 my-10 text-center">
          <p className="m-0 text-[#1565c0] font-medium">
            <strong>Thank you for using The Shadium. We are committed to providing
            an accessible experience for all users and appreciate your patience as
            we continue to improve.</strong>
          </p>
        </div>
      </div>
    </div>
  );
}