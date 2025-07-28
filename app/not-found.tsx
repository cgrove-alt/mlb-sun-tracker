import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      padding: '20px',
    }}>
      <h1 style={{ fontSize: '4rem', margin: '0 0 1rem 0' }}>404</h1>
      <h2 style={{ fontSize: '2rem', margin: '0 0 2rem 0' }}>Page Not Found</h2>
      <p style={{ fontSize: '1.2rem', margin: '0 0 2rem 0', maxWidth: '600px' }}>
        Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      <Link 
        href="/"
        style={{
          backgroundColor: '#2196f3',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '1.1rem',
          fontWeight: '500',
        }}
      >
        Return to Homepage
      </Link>
    </div>
  );
}