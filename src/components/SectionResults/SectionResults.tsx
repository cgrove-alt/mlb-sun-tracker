import React from 'react';

export interface SectionResultsProps {
  title: string;
  timeLabel?: string;
  sections: string[];
  ctaText?: string;
  ctaHref?: string;
  className?: string;
}

export default function SectionResults({
  title,
  timeLabel,
  sections,
  ctaText,
  ctaHref,
  className = '',
}: SectionResultsProps) {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-5 ${className}`.trim()}>
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-ink-800 font-semibold text-lg m-0">{title}</h3>
        {timeLabel && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold text-white bg-black/55 backdrop-blur-sm backdrop-saturate-115 [-webkit-backdrop-filter:saturate(115%)_blur(2px)] [-webkit-text-stroke:0.35px_rgba(0,0,0,0.65)]">
            {timeLabel}
          </span>
        )}
      </div>
      {sections.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-2.5 sm:grid-cols-2 [&>*:only-child]:grid-cols-1">
          {sections.map((section, index) => (
            <span key={index} className="bg-gray-50 rounded-lg px-2.5 py-1.5 text-ink-900 text-center text-sm font-medium">
              {section}
            </span>
          ))}
        </div>
      )}
      {ctaText && ctaHref && (
        <a className="inline-flex mt-3.5 text-primary-700 font-medium no-underline items-center gap-1 hover:underline focus:outline focus:outline-2 focus:outline-primary-700 focus:outline-offset-2 focus:rounded" href={ctaHref}>
          {ctaText} →
        </a>
      )}
    </div>
  );
}

export function SectionResultsSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="h-6 w-45 bg-gray-200 rounded"></div>
        <div className="h-7 w-25 bg-gray-200 rounded-2xl"></div>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-2.5 sm:grid-cols-2 [&>*:only-child]:grid-cols-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
}