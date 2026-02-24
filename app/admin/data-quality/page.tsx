import { Metadata } from 'next';
import DataQualityDashboard from './DataQualityDashboard';

export const metadata: Metadata = {
  title: 'Data Quality Dashboard | Admin | TheShadium',
  description: 'Monitor stadium data quality, freshness, and user-reported issues',
  robots: 'noindex, nofollow', // Don't index admin pages
};

export default function DataQualityPage() {
  return <DataQualityDashboard />;
}
