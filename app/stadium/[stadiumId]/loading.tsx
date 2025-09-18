import { LoadingSpinner } from '../../../src/components/LoadingSpinner';

export default function Loading() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '200px',
      padding: '40px 0',
      background: '#f8f9fa'
    }}>
      <LoadingSpinner size="large" message="Loading stadium guide..." />
    </div>
  );
}