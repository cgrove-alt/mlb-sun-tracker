import React from 'react';
import Link from 'next/link';
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
  return (
    <header className={styles.headerWrap}>
      {showBreadcrumb && (
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>›</span>
          <Link href="/stadiums">Stadiums</Link>
          <span>›</span>
          <span>{name}</span>
        </nav>
      )}

      <h1 className={styles.title} data-test="stadium-h1">{name}</h1>

      {team && <p className={styles.subtitle}>{team}</p>}

      {(neighborhood || capacity || opened) && (
        <div className={styles.stadiumMeta}>
          {neighborhood && (
            <span className="location">
              <MapPinIcon size={16} />
              {neighborhood}
            </span>
          )}
          {capacity && (
            <span className="capacity">
              Capacity: {capacity.toLocaleString()}
            </span>
          )}
          {opened && (
            <span className="opened">
              Opened: {opened}
            </span>
          )}
        </div>
      )}

      <div className={styles.headerSpacer} />
    </header>
  );
};

export default StadiumHeader;