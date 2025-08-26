/**
 * SectionLabel Usage Examples
 * 
 * This component is designed for maximum readability on any background.
 * It's particularly useful for stadium maps, seating charts, and overlays on photos.
 */

import React from 'react';
import { SectionLabel, SvgSectionLabel } from './SectionLabel';

export const SectionLabelExamples = () => {
  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Example 1: On a photo/map background */}
      <div style={{ 
        backgroundImage: 'url("/stadium-photo.jpg")', 
        backgroundSize: 'cover',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <h3 style={{ color: 'white', marginBottom: '10px' }}>On Photo/Map Backgrounds</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <SectionLabel>Section 112</SectionLabel>
          <SectionLabel>Field Box 23</SectionLabel>
          <SectionLabel>Upper Deck 301</SectionLabel>
        </div>
      </div>

      {/* Example 2: On solid dark background */}
      <div style={{ 
        background: '#0F172A',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <h3 style={{ color: 'white', marginBottom: '10px' }}>On Solid Dark Background</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <SectionLabel variant="solid">Section 112</SectionLabel>
          <SectionLabel variant="solid">Field Box 23</SectionLabel>
          <SectionLabel variant="solid">Upper Deck 301</SectionLabel>
        </div>
      </div>

      {/* Example 3: Different sizes */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <h3 style={{ color: 'white', marginBottom: '10px' }}>Size Variants</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <SectionLabel size="small">Small Label</SectionLabel>
          <SectionLabel>Default Label</SectionLabel>
          <SectionLabel size="large">Large Label</SectionLabel>
        </div>
      </div>

      {/* Example 4: Status indicators */}
      <div style={{ 
        background: '#f3f4f6',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <h3 style={{ marginBottom: '10px' }}>Shade Status Indicators</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <SectionLabel variant="light" status="shaded">Shaded Section</SectionLabel>
          <SectionLabel variant="light" status="sunny">Sunny Section</SectionLabel>
          <SectionLabel variant="light" status="partial">Partial Shade</SectionLabel>
        </div>
      </div>

      {/* Example 5: Interactive labels */}
      <div style={{ 
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ marginBottom: '10px' }}>Interactive Labels</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <SectionLabel 
            variant="light"
            onClick={() => alert('Section 112 clicked!')}
            tabIndex={0}
          >
            Click Me - Section 112
          </SectionLabel>
          <SectionLabel 
            variant="light"
            status="shaded"
            onClick={() => alert('Shaded section selected!')}
            tabIndex={0}
          >
            Interactive Shaded Area
          </SectionLabel>
        </div>
      </div>

      {/* Example 6: SVG usage */}
      <div style={{ 
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ marginBottom: '10px' }}>SVG Stadium Map Example</h3>
        <svg width="400" height="200" style={{ background: '#f0f0f0', borderRadius: '8px' }}>
          {/* Stadium outline */}
          <rect x="50" y="30" width="300" height="140" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" rx="8" />
          
          {/* Field */}
          <ellipse cx="200" cy="100" rx="100" ry="50" fill="#4ade80" />
          
          {/* Section labels */}
          <SvgSectionLabel x="100" y="50">Section 101</SvgSectionLabel>
          <SvgSectionLabel x="200" y="50">Section 102</SvgSectionLabel>
          <SvgSectionLabel x="300" y="50">Section 103</SvgSectionLabel>
          <SvgSectionLabel x="100" y="150">Section 201</SvgSectionLabel>
          <SvgSectionLabel x="300" y="150">Section 203</SvgSectionLabel>
        </svg>
      </div>

      {/* Example 7: With icons */}
      <div style={{ 
        background: 'linear-gradient(to right, #f093fb 0%, #f5576c 100%)',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <h3 style={{ color: 'white', marginBottom: '10px' }}>With Icons</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <SectionLabel icon="☀️">Sunny Side</SectionLabel>
          <SectionLabel icon="🌤️">Partial Shade</SectionLabel>
          <SectionLabel icon="🌳">Full Shade</SectionLabel>
          <SectionLabel icon="⭐">Premium</SectionLabel>
        </div>
      </div>
    </div>
  );
};

export default SectionLabelExamples;