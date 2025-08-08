'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function NotFound() {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <div className="not-found-page" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        padding: '3rem',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
        width: '100%',
      }}>
        <h1 style={{ 
          fontSize: '6rem', 
          margin: '0 0 1rem 0',
          fontWeight: '700',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
        }}>
          404
        </h1>
        <h2 style={{ 
          fontSize: '1.8rem', 
          margin: '0 0 1.5rem 0',
          fontWeight: '500',
        }}>
          Oops! Page Not Found
        </h2>
        <p style={{ 
          fontSize: '1.1rem', 
          margin: '0 0 2rem 0',
          opacity: '0.9',
          lineHeight: '1.6',
        }}>
          Looks like this page is out in the sun without any shade. 
          Let's get you back to finding those perfect shaded seats!
        </p>
        
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <Link 
            href="/"
            style={{
              backgroundColor: 'white',
              color: '#764ba2',
              padding: '12px 28px',
              borderRadius: '50px',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'transform 0.2s, box-shadow 0.2s',
              display: 'inline-block',
              transform: hoveredButton === 'home' ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: hoveredButton === 'home' ? '0 4px 12px rgba(0, 0, 0, 0.2)' : 'none',
            }}
            onMouseEnter={() => setHoveredButton('home')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            Go to Homepage
          </Link>
          
          <Link 
            href="/stadiums"
            style={{
              backgroundColor: hoveredButton === 'stadiums' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: 'white',
              padding: '12px 28px',
              borderRadius: '50px',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              border: '2px solid white',
              transition: 'background-color 0.2s, transform 0.2s',
              display: 'inline-block',
              transform: hoveredButton === 'stadiums' ? 'translateY(-2px)' : 'translateY(0)',
            }}
            onMouseEnter={() => setHoveredButton('stadiums')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            Browse Stadiums
          </Link>
        </div>
      </div>
      
      <div style={{
        marginTop: '2rem',
        fontSize: '0.9rem',
        opacity: '0.7',
      }}>
        <p>Popular destinations:</p>
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginTop: '0.5rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          <Link href="/guide" style={{ color: 'white', textDecoration: 'underline' }}>
            Guides
          </Link>
          <span>•</span>
          <Link href="/faq" style={{ color: 'white', textDecoration: 'underline' }}>
            FAQs
          </Link>
          <span>•</span>
          <Link href="/contact" style={{ color: 'white', textDecoration: 'underline' }}>
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}