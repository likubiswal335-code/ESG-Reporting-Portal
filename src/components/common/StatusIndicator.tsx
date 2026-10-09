/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';

interface StatusIndicatorProps {
  status: 'verified' | 'unverified' | 'needs_review' | 'reported' | 'in_progress' | 'unreported' | 'HIGH' | 'MEDIUM' | 'LOW' | 'open' | 'resolved' | string;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  showIcon = true,
  size = 'sm',
}) => {
  const normalized = status.toLowerCase();

  let colorClass = 'text-slate-500';
  let dotBg = 'bg-slate-400';
  let label = status;
  let IconComponent = HelpCircle;

  if (normalized === 'verified' || normalized === 'reported' || normalized === 'resolved' || normalized === 'low') {
    colorClass = 'text-emerald-700';
    dotBg = 'bg-emerald-600';
    IconComponent = CheckCircle2;
    if (normalized === 'verified') label = 'Verified';
    if (normalized === 'reported') label = 'Reported';
    if (normalized === 'resolved') label = 'Resolved';
    if (normalized === 'low') label = 'Low Priority';
  } else if (normalized === 'needs_review' || normalized === 'in_progress' || normalized === 'under_review' || normalized === 'medium' || normalized === 'pending') {
    colorClass = 'text-amber-700';
    dotBg = 'bg-amber-500';
    IconComponent = AlertTriangle;
    if (normalized === 'needs_review') label = 'Needs Review';
    if (normalized === 'in_progress') label = 'In Progress';
    if (normalized === 'under_review') label = 'Under Review';
    if (normalized === 'medium') label = 'Medium Priority';
    if (normalized === 'pending') label = 'Pending';
  } else if (normalized === 'high' || normalized === 'critical' || normalized === 'rejected' || normalized === 'flagged') {
    colorClass = 'text-rose-700';
    dotBg = 'bg-rose-600';
    IconComponent = AlertCircle;
    if (normalized === 'high') label = 'High Priority';
    if (normalized === 'critical') label = 'Critical';
    if (normalized === 'rejected') label = 'Rejected';
    if (normalized === 'flagged') label = 'Flagged';
  } else if (normalized === 'unverified' || normalized === 'unreported' || normalized === 'missing') {
    colorClass = 'text-slate-600';
    dotBg = 'bg-slate-400';
    IconComponent = HelpCircle;
    if (normalized === 'unverified') label = 'Unverified';
    if (normalized === 'unreported') label = 'Not Reported';
    if (normalized === 'missing') label = 'Missing Data';
  }

  const iconSize = size === 'sm' ? 13 : 15;

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${colorClass}`}>
      {showIcon ? (
        <IconComponent size={iconSize} className="shrink-0" />
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full ${dotBg} shrink-0`} />
      )}
      <span>{label}</span>
    </span>
  );
};
