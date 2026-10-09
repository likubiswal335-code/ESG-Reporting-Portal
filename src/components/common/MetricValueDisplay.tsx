/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface MetricValueDisplayProps {
  value: number | null | undefined;
  unit?: string;
  status?: string;
  format?: 'number' | 'percent' | 'currency' | 'decimal';
  emptyPlaceholder?: string;
  className?: string;
}

export const MetricValueDisplay: React.FC<MetricValueDisplayProps> = ({
  value,
  unit,
  format = 'number',
  emptyPlaceholder = '--',
  className = '',
}) => {
  if (value === null || value === undefined || isNaN(value)) {
    return (
      <span className={`inline-flex items-baseline gap-1 text-slate-400 font-mono text-sm tracking-tight ${className}`}>
        <span>{emptyPlaceholder}</span>
        {unit && <span className="text-xs text-slate-400 font-sans font-normal">({unit})</span>}
      </span>
    );
  }

  let formattedValue = '';
  if (format === 'percent') {
    formattedValue = `${value.toFixed(1)}%`;
  } else if (format === 'currency') {
    formattedValue = `₹ ${value.toLocaleString('en-IN')}`;
  } else if (format === 'decimal') {
    formattedValue = value.toFixed(2);
  } else {
    formattedValue = value.toLocaleString('en-IN');
  }

  return (
    <span className={`inline-flex items-baseline gap-1 font-mono tabular-nums text-slate-900 font-semibold ${className}`}>
      <span>{formattedValue}</span>
      {unit && <span className="text-xs text-slate-500 font-sans font-normal ml-0.5">{unit}</span>}
    </span>
  );
};
