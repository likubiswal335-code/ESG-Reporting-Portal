/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface BarDataPoint {
  label: string;
  category: string;
  value: number;
  unit: string;
  color: string;
}

interface EnergyEmissionsBarChartProps {
  title?: string;
  subtitle?: string;
  data: BarDataPoint[];
}

export const EnergyEmissionsBarChart: React.FC<EnergyEmissionsBarChartProps> = ({
  title = 'Energy & Emission Breakdown',
  subtitle = 'Consolidated operational scope data for MEIL Group',
  data,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center border border-slate-200 rounded-lg bg-white">
        <p className="text-sm text-slate-500">No chart data available for selected reporting boundary.</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-800" />
            <span>Energy (GJ)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-teal-600" />
            <span>Emissions (tCO2e)</span>
          </span>
        </div>
      </div>

      <div className="pt-6 space-y-4">
        {data.map((item, idx) => {
          const percentage = Math.min(100, Math.max(4, Math.round((item.value / maxValue) * 100)));
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={idx}
              className="group cursor-default"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex items-baseline justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-800 group-hover:text-emerald-900 transition-colors">
                  {item.label}
                </span>
                <span className="font-mono tabular-nums text-slate-700 font-medium">
                  {item.value.toLocaleString('en-IN')}{' '}
                  <span className="text-[11px] text-slate-400 font-sans font-normal ml-0.5">{item.unit}</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-sm overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ease-out ${item.color} ${isHovered ? 'brightness-110' : ''}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Verified through operational utility invoices & meter readings</span>
        <span className="font-mono">Relative scale: Max 100% normalized</span>
      </div>
    </div>
  );
};
