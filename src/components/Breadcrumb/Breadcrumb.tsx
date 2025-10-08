import React from 'react';
import Link from 'next/link';

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
    <nav className={`flex flex-wrap items-center gap-3 text-sm text-ink-700 ${className}`.trim()} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {item.href && !isLast ? (
              <Link href={item.href} className="text-ink-700 no-underline transition-colors duration-200 hover:text-primary-700 hover:underline focus:outline focus:outline-2 focus:outline-primary-700 focus:outline-offset-2 focus:rounded-sm">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-ink-900 font-medium' : ''} aria-current={isLast ? 'page' : undefined}>
                {item.label}
              </span>
            )}
            {!isLast && <span className="opacity-60 select-none" aria-hidden="true">/</span>}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export function SimpleBreadcrumb({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <nav className={`flex flex-wrap items-center gap-3 text-sm text-ink-700 ${className}`.trim()} aria-label="Breadcrumb">
      {children}
    </nav>
  );
}