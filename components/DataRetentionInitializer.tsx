'use client';

import { useEffect } from 'react';
import { initializeDataRetention } from '../utils/dataRetention';

export default function DataRetentionInitializer() {
  useEffect(() => {
    // Initialize data retention policies on app load
    initializeDataRetention();
  }, []);

  // This component doesn't render anything
  return null;
}