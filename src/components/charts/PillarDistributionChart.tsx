/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface PillarProgressProps {
  label: string;
  code: string;
  percentage: number | null;
  reported: number;
  total: number;
  colorClass: string;
  barBg: string;
}

export const PillarDistributionChart: React.FC<{
  envPct: number | null;
  socPct: number | null;
  govPct: number | null;
  totalMetrics: number;
  reportedCount: number;
}> = ({ envPct, socPct, govPct, totalMetrics, reportedCount }) => {
  const pillars: PillarProgressProps[] = [
    {
      label: 'Environmental',
      code: 'ENV',
      percentage: envPct,
      reported: 9,
      total: 10,
      colorClass: 'text-emerald-800',
      barBg: 'bg-emerald-800',
    },
    {
      label: 'Social',
      code: 'SOC',
      percentage: socPct,
      reported: 6,
      total: 6,
      colorClass: 'text-teal-700',
      barBg: 'bg-teal-600',
    },
    {
      label: 'Governance',
      code: 'GOV',
      percentage: govPct,
      reported: 4,
      total: 4,
      colorClass: 'text-slate-700',
      barBg: 'bg-slate-700',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Pillar Completeness Breakdown</h3>
          <p className="text-xs text-slate-500 mt-0.5">Disclosure status across ESG core parameters</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500">Reported</span>
          <p className="text-sm font-mono font-semibold text-slate-900 tabular-nums">
            {reportedCount} / {totalMetrics}
          </p>
        </div>
      </div>

      <div className="pt-5 space-y-4">
        {pillars.map((p, idx) => {
          const val = p.percentage !== null ? p.percentage : 0;
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-800 flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">{p.code}</span>
                  <span>{p.label}</span>
                </span>
                <span className="font-mono tabular-nums font-semibold text-slate-800">
                  {p.percentage !== null ? `${p.percentage}%` : '--'}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-sm overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ease-out ${p.barBg}`}
                  style={{ width: `${val}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
        <div className="py-1">
          <span className="text-[11px] text-slate-500 block">Energy & Carbon</span>
          <span className="text-xs font-mono font-medium text-emerald-800">BRSR Essential</span>
        </div>
        <div className="py-1 border-x border-slate-100">
          <span className="text-[11px] text-slate-500 block">Workforce & HSE</span>
          <span className="text-xs font-mono font-medium text-teal-700">Zero Fatalities</span>
        </div>
        <div className="py-1">
          <span className="text-[11px] text-slate-500 block">Ethics & Board</span>
          <span className="text-xs font-mono font-medium text-slate-700">100% Attested</span>
        </div>
      </div>
    </div>
  );
};

export const ProgressMeter: React.FC<{
  value: number | null;
  label?: string;
  size?: 'sm' | 'md';
}> = ({ value, label, size = 'sm' }) => {
  const height = size === 'sm' ? 'h-2' : 'h-3';

  if (value === null) {
    return (
      <div className="space-y-1">
        {label && <span className="text-xs text-slate-500">{label}</span>}
        <div className={`w-full bg-slate-100 ${height} rounded-sm overflow-hidden relative`}>
          <div className="h-full bg-slate-300 w-0" />
        </div>
        <span className="text-xs font-mono text-slate-400">Awaiting data</span>
      </div>
    );
  }

  let colorClass = 'bg-emerald-700';
  if (value < 50) colorClass = 'bg-rose-600';
  else if (value < 80) colorClass = 'bg-amber-500';

  return (
    <div className="space-y-1">
      {label && (
        <div className="flex justify-between text-xs">
          <span className="text-slate-600 font-medium">{label}</span>
          <span className="font-mono tabular-nums font-semibold text-slate-800">{value}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 ${height} rounded-sm overflow-hidden`}>
        <div className={`h-full transition-all duration-300 ${colorClass}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
};
