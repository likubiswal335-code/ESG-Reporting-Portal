/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { CheckCircle, AlertTriangle, AlertCircle, HelpCircle, Search, Filter, ShieldCheck, Check } from 'lucide-react';
import { DataQualityIssue, ESGMetricEntry, ReportingPeriod, IssuePriority } from '../types/esg';
import { StatusIndicator } from '../components/common/StatusIndicator';

interface DataQualityPageProps {
  issues: DataQualityIssue[];
  metrics: ESGMetricEntry[];
  currentPeriod: ReportingPeriod;
  onResolveIssue: (id: string) => void;
  onOpenDataEntry: (initialData?: ESGMetricEntry) => void;
}

export const DataQualityPage: React.FC<DataQualityPageProps> = ({
  issues,
  metrics,
  currentPeriod,
  onResolveIssue,
  onOpenDataEntry,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Counters calculated dynamically
  const missingCount = metrics.filter((m) => m.value === null || m.status === 'unreported').length;
  const incompleteCount = issues.filter((i) => i.issueType === 'incomplete').length;
  const unverifiedCount = metrics.filter((m) => m.verificationStatus === 'needs_review').length;
  const validatedCount = metrics.filter((m) => m.verificationStatus === 'verified' && m.value !== null).length;

  const filteredIssues = useMemo(() => {
    return issues.filter((iss) => {
      if (filterType !== 'ALL' && iss.issueType !== filterType) return false;
      if (filterPriority !== 'ALL' && iss.priority !== filterPriority) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          iss.metricName.toLowerCase().includes(q) ||
          iss.entityName.toLowerCase().includes(q) ||
          iss.description.toLowerCase().includes(q) ||
          iss.owner.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [issues, filterType, filterPriority, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-amber-50 text-amber-700 flex items-center justify-center">
              <CheckCircle size={16} />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Data Quality &amp; Gap Identification</h1>
            <span className="text-xs font-mono font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              {currentPeriod}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated verification audits detecting unreported parameters, unverified estimations, and missing evidence files.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 block">Overall Integrity Score</span>
          <span className="text-xl font-mono font-bold text-emerald-800 tabular-nums">
            {validatedCount + unverifiedCount > 0
              ? `${Math.round((validatedCount / (validatedCount + unverifiedCount + missingCount)) * 100)}%`
              : '--'}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setFilterType('missing')}
          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
            filterType === 'missing' ? 'bg-slate-100 border-slate-600' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">MISSING DATA</span>
            <HelpCircle size={14} className="text-slate-500" />
          </div>
          <span className="text-2xl font-mono font-bold text-slate-900 tabular-nums">{missingCount}</span>
          <p className="text-[11px] text-slate-500 mt-1">Metrics without values</p>
        </div>

        <div
          onClick={() => setFilterType('incomplete')}
          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
            filterType === 'incomplete' ? 'bg-amber-50/50 border-amber-600' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">INCOMPLETE DATA</span>
            <AlertTriangle size={14} className="text-amber-600" />
          </div>
          <span className="text-2xl font-mono font-bold text-amber-700 tabular-nums">{incompleteCount}</span>
          <p className="text-[11px] text-slate-500 mt-1">Missing documentation or sub-meters</p>
        </div>

        <div
          onClick={() => setFilterType('unverified')}
          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
            filterType === 'unverified' ? 'bg-slate-100 border-slate-600' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">UNVERIFIED DATA</span>
            <AlertCircle size={14} className="text-slate-600" />
          </div>
          <span className="text-2xl font-mono font-bold text-slate-700 tabular-nums">{unverifiedCount}</span>
          <p className="text-[11px] text-slate-500 mt-1">Pending external audit sign-off</p>
        </div>

        <div
          onClick={() => setFilterType('ALL')}
          className="p-4 rounded-lg border bg-white border-slate-200 hover:border-slate-300 cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">VALIDATED DATA</span>
            <ShieldCheck size={14} className="text-emerald-700" />
          </div>
          <span className="text-2xl font-mono font-bold text-emerald-700 tabular-nums">{validatedCount}</span>
          <p className="text-[11px] text-slate-500 mt-1">Fully audited and BRSR ready</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[180px] max-w-md">
            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search issues, metrics, entity, owner..."
              className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Issue Types</option>
            <option value="missing">Missing Only</option>
            <option value="incomplete">Incomplete Only</option>
            <option value="unverified">Unverified Only</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>

        <div className="text-slate-500 font-mono text-[11px]">
          Showing {filteredIssues.length} active issue records
        </div>
      </div>

      {/* Issues Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/70">
                <th className="py-3 px-3">Metric Name</th>
                <th className="py-3 px-3">Target Entity</th>
                <th className="py-3 px-3">Period</th>
                <th className="py-3 px-3">Issue Details</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Assigned Owner</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-slate-600">NO DATA QUALITY ISSUES</p>
                    <p className="text-xs text-slate-400 mt-1">All monitored metrics satisfy current audit rules.</p>
                  </td>
                </tr>
              ) : (
                filteredIssues.map((iss) => (
                  <tr key={iss.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-800">{iss.metricName}</td>
                    <td className="py-3 px-3 text-slate-600">{iss.entityName}</td>
                    <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">{iss.reportingPeriod}</td>
                    <td className="py-3 px-3 text-slate-600 max-w-sm">{iss.description}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[11px] font-semibold ${
                          iss.priority === 'HIGH'
                            ? 'text-rose-700'
                            : iss.priority === 'MEDIUM'
                            ? 'text-amber-700'
                            : 'text-slate-600'
                        }`}
                      >
                        {iss.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{iss.owner}</td>
                    <td className="py-3 px-3">
                      <StatusIndicator status={iss.status} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      {iss.status !== 'resolved' ? (
                        <button
                          onClick={() => onResolveIssue(iss.id)}
                          className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded text-[11px] font-semibold transition-colors flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <Check size={12} />
                          <span>Resolve</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-medium">Resolved</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
