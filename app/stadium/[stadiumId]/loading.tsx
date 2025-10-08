import { VenueChangeSkeleton } from '../../../src/components/SkeletonScreens';

export default function Loading() {
  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px',
      background: 'var(--color-paper, #FFFFFF)'
    }}>
      <VenueChangeSkeleton venueName="stadium" />
    </div>
  );
}