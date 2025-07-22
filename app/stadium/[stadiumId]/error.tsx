'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center',
      background: '#f8f9fa'
    }}>
      <h2 style={{ fontSize: '1.5rem', color: '#dc3545', marginBottom: '1rem' }}>
        Something went wrong!
      </h2>
      <p style={{ color: '#6c757d', marginBottom: '2rem' }}>
        {error.message || 'The stadium guide failed to load.'}
      </p>
      <button
        onClick={() => reset()}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          color: 'white',
          background: '#2196f3',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer'
        }}
      >
        Try again
      </button>
    </div>
  );
}