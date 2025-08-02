import React from 'react';
import './App.css';

function AppMinimal() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>MLB Sun Tracker</h1>
        <p>Loading...</p>
      </header>
      <main className="App-main">
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2>Welcome to MLB Sun Tracker</h2>
          <p>The app is currently being optimized to fix performance issues.</p>
          <p>Please check back in a few minutes.</p>
        </div>
      </main>
    </div>
  );
}

export default AppMinimal;