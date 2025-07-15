'use client';

console.log('TEST: TestComponent module loading...');

import React from 'react';

export default function TestComponent() {
  console.log('TEST: TestComponent function called');
  console.log('TEST: TestComponent rendering');
  
  return (
    <div style={{ padding: '20px', background: '#ffeb3b', margin: '20px 0' }}>
      <p>TEST: Simple test component is working!</p>
    </div>
  );
}