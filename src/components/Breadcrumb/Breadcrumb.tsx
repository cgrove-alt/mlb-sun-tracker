import React from 'react';
import Link from 'next/link';
import styles from './Breadcrumb.module.css';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav className={`${styles.nav} ${className}`.trim()} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <React.Fragment key={index}>
            {item.href && !isLast ? (
              <Link href={item.href} className={styles.link}>
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? styles.current : ''} aria-current={isLast ? 'page' : undefined}>
                {item.label}
              </span>
            )}
            {!isLast && <span className={styles.sep} aria-hidden="true">/</span>}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export function SimpleBreadcrumb({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <nav className={`${styles.nav} ${className}`.trim()} aria-label="Breadcrumb">
      {children}
    </nav>
  );
}