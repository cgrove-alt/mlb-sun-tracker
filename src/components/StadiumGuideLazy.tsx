'use client';

import dynamic from 'next/dynamic';
import { LoadingSpinner } from './LoadingSpinner';

const ResponsiveStadiumGuide = dynamic(() => import('./ResponsiveStadiumGuide'), {
  loading: () => <LoadingSpinner size="large" message="Loading stadium guide..." />,
  ssr: true
});

export default ResponsiveStadiumGuide;