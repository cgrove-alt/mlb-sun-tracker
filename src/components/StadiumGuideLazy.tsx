'use client';

import dynamic from 'next/dynamic';
import { LoadingSpinner } from './LoadingSpinner';

const StadiumGuide = dynamic(() => import('./StadiumGuide'), {
  loading: () => <LoadingSpinner size="large" message="Loading stadium guide..." />,
  ssr: true
});

export default StadiumGuide;