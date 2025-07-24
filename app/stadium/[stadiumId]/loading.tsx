import { LoadingSpinner } from '../../../src/components/LoadingSpinner';

export default function Loading() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: '#f8f9fa'
    }}>
      <LoadingSpinner size="large" message="Loading stadium guide..." />
    </div>
  );
}