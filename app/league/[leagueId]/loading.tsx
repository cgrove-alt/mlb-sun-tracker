import { StadiumSelectorSkeleton } from '../../../src/components/SkeletonScreens';

export default function Loading() {
  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px',
      background: 'var(--color-paper, #FFFFFF)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <div className="loading-text" style={{ color: 'var(--color-text-secondary, #666)' }}>
            Loading league venues...
          </div>
        </div>
        <StadiumSelectorSkeleton />
      </div>
    </div>
  );
}
