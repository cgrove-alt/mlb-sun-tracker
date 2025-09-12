import React from 'react';
import Link from 'next/link';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import styles from './StadiumHeader.module.css';

interface StadiumHeaderProps {
  name: string;
  team?: string;
  capacity?: number;
  opened?: number | string;
  neighborhood?: string;
  showBreadcrumb?: boolean;
}

const StadiumHeader: React.FC<StadiumHeaderProps> = ({ 
  name, 
  team, 
  capacity, 
  opened, 
  neighborhood,
  showBreadcrumb = true 
}) => {
  // Debug logging to verify props
  if (typeof window !== 'undefined') {
    console.log('StadiumHeader props:', { name, team, capacity, opened, neighborhood });
  }

  // Ensure clean string values
  const cleanName = String(name || '').trim();
  const cleanTeam = team ? String(team).trim() : undefined;
  const cleanNeighborhood = neighborhood ? String(neighborhood).trim() : undefined;
  const cleanOpened = opened ? String(opened).trim() : undefined;

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Stadiums', href: '/stadiums' },
    { label: cleanName }
  ];

  return (
    <header className={styles.headerWrap} data-stadium-header="true">
      {showBreadcrumb && (
        <Breadcrumb items={breadcrumbItems} className="breadcrumb-nav" />
      )}
    </header>
  );
};

export default StadiumHeader;