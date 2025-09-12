import React from 'react';
import Link from 'next/link';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import styles from './StadiumHeader.module.css';
import { MapPinIcon } from '../Icons';

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

      {/* Team subtitle - completely separate element */}
      {cleanTeam && (
        <p 
          className={styles.subtitle} 
          aria-label={`Home of ${cleanTeam}`}
          key="team"
        >
          {cleanTeam}
        </p>
      )}

      {/* Stadium metadata - completely separate container */}
      {(cleanNeighborhood || capacity || cleanOpened) && (
        <div 
          className={styles.stadiumMeta} 
          role="list" 
          aria-label="Stadium information"
          key="metadata"
        >
          {cleanNeighborhood && (
            <span 
              className={styles.metaItem} 
              role="listitem" 
              aria-label={`Location: ${cleanNeighborhood}`}
              key="location"
            >
              <MapPinIcon size={16} aria-hidden="true" />
              <span>{cleanNeighborhood}</span>
            </span>
          )}
          {capacity && (
            <span 
              className={styles.metaItem} 
              role="listitem" 
              aria-label={`Capacity: ${capacity.toLocaleString()}`}
              key="capacity"
            >
              <span>Capacity: {capacity.toLocaleString()}</span>
            </span>
          )}
          {cleanOpened && (
            <span 
              className={styles.metaItem} 
              role="listitem" 
              aria-label={`Opened in ${cleanOpened}`}
              key="opened"
            >
              <span>Opened: {cleanOpened}</span>
            </span>
          )}
        </div>
      )}

      <div className={styles.headerSpacer} aria-hidden="true" key="spacer" />
    </header>
  );
};

export default StadiumHeader;