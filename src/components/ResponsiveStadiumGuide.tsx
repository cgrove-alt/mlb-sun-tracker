'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Stadium } from '../data/stadiums';
import { StadiumSection } from '../data/stadiumSections';
import { StadiumAmenities } from '../data/stadiumAmenities';
import { LoadingSpinner } from './LoadingSpinner';

// Dynamic imports for better code splitting
const StadiumGuide = dynamic(() => import('./StadiumGuide'), {
  loading: () => <LoadingSpinner size="large" message="Loading stadium guide..." />,
  ssr: true
});

const MobileStadiumGuide = dynamic(() => import('./MobileStadiumGuide'), {
  loading: () => <LoadingSpinner size="large" message="Loading stadium guide..." />,
  ssr: true
});

interface ResponsiveStadiumGuideProps {
  stadium: Stadium;
  sections: StadiumSection[];
  amenities: StadiumAmenities | null;
}

const ResponsiveStadiumGuide: React.FC<ResponsiveStadiumGuideProps> = (props) => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if mobile on client side
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show loading spinner while determining device type
  if (isMobile === null) {
    return <LoadingSpinner size="large" message="Loading stadium guide..." />;
  }

  // Render appropriate component based on device type
  return isMobile ? (
    <MobileStadiumGuide {...props} />
  ) : (
    <StadiumGuide {...props} />
  );
};

export default ResponsiveStadiumGuide;