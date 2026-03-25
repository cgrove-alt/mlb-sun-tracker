'use client';
import React, { useState } from 'react';
import type { ShadeSectionRow } from './types';
import { shadeScoreColor, shadeScoreBarColor, statusLabel, statusDot } from './shadeColors';
import { SparkBar } from './SparkBar';

interface SectionRowProps {
  section: ShadeSectionRow;
  offsetMinutes?: number;
}

export function SectionRow({ section, offsetMinutes = 0 }: SectionRowProps) {
  const [expanded, setExpanded] = useState(false);

  // Get exposure at current time offset
  const atOffset = section.timeline.find(t => t.offsetMinutes === offsetMinutes)
    ?? section.timeline[0]
    ?? { sunExposurePct: section.atFirstPitch };
  const currentExposure = atOffset.sunExposurePct;
  const currentScore = Math.round(10 - (currentExposure / 100) * 9);

  return (
    <>
      {/* Desktop row */}
      <tr
        className="hidden md:table-row border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <td className="px-4 py-3 font-medium text-gray-900">{section.name}</td>
        <td className="px-4 py-3 capitalize text-gray-600">{section.level}</td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-semibold ${shadeScoreColor(currentScore)}`}>
              {currentScore}/10
            </span>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${shadeScoreBarColor(currentScore)}`}
                style={{ width: `${(currentScore / 10) * 100}%` }}
              />
            </div>
          </div>
        </td>
        <td className="px-4 py-3 text-sm text-gray-600">{currentExposure}% sun</td>
        <td className="px-4 py-3">
          <SparkBar timeline={section.timeline} />
        </td>
        <td className="px-4 py-3">
          {section.covered ? (
            <span className="inline-flex items-center gap-1 text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
              <span aria-hidden="true">☂</span> Covered
            </span>
          ) : (
            <span className="text-gray-400 text-xs">Open</span>
          )}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${statusDot(section.overallStatus)}`} aria-hidden="true" />
            <span className="text-sm text-gray-600">{statusLabel(section.overallStatus)}</span>
          </div>
        </td>
      </tr>

      {/* Mobile card */}
      <tr className="md:hidden border-b border-gray-100">
        <td colSpan={7} className="px-4 py-3">
          <button
            className="w-full text-left"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-gray-900">{section.name}</div>
                <div className="text-sm text-gray-500 capitalize">{section.level} • {section.covered ? 'Covered' : 'Open'}</div>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-bold ${shadeScoreColor(currentScore)}`}>
                {currentScore}/10
              </span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full ${shadeScoreBarColor(currentScore)}`} style={{ width: `${(currentScore / 10) * 100}%` }} />
              </div>
              <SparkBar timeline={section.timeline} />
            </div>
          </button>
        </td>
      </tr>

      {/* Expanded detail row */}
      {expanded && (
        <tr className="bg-blue-50 border-b border-blue-100">
          <td colSpan={7} className="px-4 py-3">
            <div className="text-sm space-y-1">
              <div className="font-medium text-gray-700">Sun exposure over game time</div>
              <div className="flex gap-4 flex-wrap">
                {section.timeline
                  .filter(t => t.offsetMinutes % 60 === 0)
                  .map(t => (
                    <div key={t.offsetMinutes} className="text-gray-600">
                      <span className="font-medium">
                        {t.offsetMinutes === 0 ? '1st pitch' : `+${t.offsetMinutes / 60}h`}
                      </span>
                      {': '}
                      <span className={t.sunExposurePct < 20 ? 'text-green-700' : t.sunExposurePct < 70 ? 'text-yellow-700' : 'text-red-700'}>
                        {t.sunExposurePct}% sun
                      </span>
                    </div>
                  ))
                }
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
