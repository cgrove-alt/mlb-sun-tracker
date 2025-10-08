import React from 'react';
import Link from 'next/link';
import Breadcrumb from '../Breadcrumb/Breadcrumb';

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
    <header
      className="!relative !flex !flex-col !gap-3 !p-5 !mb-6 !w-full !overflow-visible !box-border sm:!p-4 sm:!gap-2 sm:!mb-5 [&>*]:!relative [&>*]:!block [&>*]:!clear-both [&>*+*]:!mt-2 [&_*]:!relative [&>h1]:!relative [&>h1]:!overflow-visible [&>p]:!relative [&>p]:!overflow-visible [&>div]:!relative [&>div]:!overflow-visible [&>nav]:!relative [&>nav]:!overflow-visible"
      data-stadium-header="true"
    >
      {showBreadcrumb && (
        <Breadcrumb items={breadcrumbItems} className="breadcrumb-nav" />
      )}
    </header>
  );
};

export default StadiumHeader;