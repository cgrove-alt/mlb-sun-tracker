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
  // Props are validated via TypeScript types

  // Ensure clean string values
  const cleanName = String(name || '').trim();

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