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
    <header className={styles.headerWrap} data-stadium-header="true">
      {showBreadcrumb && (
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/stadiums">Stadiums</Link>
          <span aria-hidden="true">›</span>
          <span>{name}</span>
        </nav>
      )}

      <h1 className={styles.title} data-test="stadium-h1" aria-label={`${name} stadium`}>
        {name}
      </h1>

      {team && (
        <p className={styles.subtitle} aria-label={`Home of ${team}`}>
          {team}
        </p>
      )}

      {(neighborhood || capacity || opened) && (
        <div className={styles.stadiumMeta} role="list" aria-label="Stadium information">
          {neighborhood && (
            <span className={styles.metaItem} role="listitem" aria-label={`Location: ${neighborhood}`}>
              <MapPinIcon size={16} aria-hidden="true" />
              {neighborhood}
            </span>
          )}
          {capacity && (
            <span className={styles.metaItem} role="listitem" aria-label={`Capacity: ${capacity.toLocaleString()}`}>
              Capacity: {capacity.toLocaleString()}
            </span>
          )}
          {opened && (
            <span className={styles.metaItem} role="listitem" aria-label={`Opened in ${opened}`}>
              Opened: {opened}
            </span>
          )}
        </div>
      )}

      <div className={styles.headerSpacer} aria-hidden="true" />
    </header>
  );
};

export default StadiumHeader;