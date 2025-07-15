'use client';

console.log('TEST: TestComponent module loading...');

import React from 'react';

export default function TestComponent() {
  console.log('TEST: TestComponent function called');
  console.log('TEST: TestComponent rendering');
  
  // Try to write debug info to DOM
  const [debugInfo, setDebugInfo] = React.useState('');
  
  React.useEffect(() => {
    setDebugInfo('TestComponent useEffect executed at ' + new Date().toLocaleTimeString());
  }, []);
  
  return (
    <div style={{ padding: '20px', background: '#ffeb3b', margin: '20px 0' }}>
      <p>TEST: Simple test component is working!</p>
      <p>TEST: If you see this, React is rendering but console.log might be blocked</p>
      <p style={{ color: 'red', fontWeight: 'bold' }}>DEBUG: {debugInfo}</p>
    </div>
  );
}