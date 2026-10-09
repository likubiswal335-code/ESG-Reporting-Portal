/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Database, Plus, Search, Filter, Trash2, Edit3, CheckCircle2, FileText, ArrowUpDown } from 'lucide-react';
import { ESGMetricEntry, ESGPillar, ReportingPeriod, OrgEntity, VerificationStatus } from '../types/esg';
import { MetricValueDisplay } from '../components/common/MetricValueDisplay';
import { StatusIndicator } from '../components/common/StatusIndicator';

interface EsgDataPageProps {
  metrics: ESGMetricEntry[];
  entities: OrgEntity[];
  currentPeriod: ReportingPeriod;
  onOpenDataEntry: (initialData?: ESGMetricEntry) => void;
  onDeleteMetric: (id: string) => void;
  initialPillarFilter?: string;
  onNavigateDocuments: () => void;
}

export const EsgDataPage: React.FC<EsgDataPageProps> = ({
  metrics,
  entities,
  currentPeriod,
  onOpenDataEntry,
  onDeleteMetric,
  initialPillarFilter,
  onNavigateDocuments,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPillar, setSelectedPillar] = useState<string>(initialPillarFilter || 'ALL');
  const [selectedVerification, setSelectedVerification] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'metricName' | 'category' | 'value' | 'lastUpdated'>('lastUpdated');
  const [sortAsc, setSortAsc] = useState(false);

  const filteredMetrics = useMemo(() => {
    return metrics
      .filter((m) => {
        if (selectedPillar !== 'ALL' && m.pillar !== selectedPillar) return false;
        if (selectedVerification !== 'ALL' && m.verificationStatus !== selectedVerification) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            m.metricName.toLowerCase().includes(q) ||
            m.category.toLowerCase().includes(q) ||
            m.entityName.toLowerCase().includes(q) ||
            m.source.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === 'metricName') cmp = a.metricName.localeCompare(b.metricName);
        else if (sortField === 'category') cmp = a.category.localeCompare(b.category);
        else if (sortField === 'value') cmp = (a.value ?? -1) - (b.value ?? -1);
        else cmp = a.lastUpdated.localeCompare(b.lastUpdated);
        return sortAsc ? cmp : -cmp;
      });
  }, [metrics, selectedPillar, selectedVerification, searchQuery, sortField, sortAsc]);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-emerald-800 text-white flex items-center justify-center">
              <Database size={16} />
            </div>
            <h1 className="text-xl font-bold text-slate-900">ESG Data Inventory &amp; Records</h1>
            <span className="text-xs font-mono font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
              {currentPeriod}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Central repository of all operational, engineering, safety, and compliance parameters for MEIL Group.
          </p>
        </div>

        <button
          onClick={() => onOpenDataEntry()}
          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-md text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus size={14} />
          <span>Add New ESG Metric</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[180px] max-w-md">
            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by metric, category, source..."
              className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
          </div>

          {/* Pillar Filter */}
          <select
            value={selectedPillar}
            onChange={(e) => setSelectedPillar(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Pillars</option>
            <option value="environmental">Environmental</option>
            <option value="social">Social</option>
            <option value="governance">Governance</option>
          </select>

          {/* Verification Status Filter */}
          <select
            value={selectedVerification}
            onChange={(e) => setSelectedVerification(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Verification States</option>
            <option value="verified">Verified Only</option>
            <option value="needs_review">Needs Review</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>

        <div className="text-slate-500 font-mono text-[11px]">
          Showing {filteredMetrics.length} of {metrics.length} records
        </div>
      </div>

      {/* Full Enterprise Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/70">
                <th
                  onClick={() => toggleSort('metricName')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-800"
                >
                  <div className="flex items-center gap-1">
                    <span>Metric Name</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('category')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-800"
                >
                  <div className="flex items-center gap-1">
                    <span>Pillar &amp; Category</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="py-3 px-3">Entity Level &amp; Name</th>
                <th
                  onClick={() => toggleSort('value')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-slate-800"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Reported Value</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="py-3 px-3">Data Source</th>
                <th className="py-3 px-3">Verification</th>
                <th className="py-3 px-3">Evidence Doc</th>
                <th
                  onClick={() => toggleSort('lastUpdated')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-800"
                >
                  <div className="flex items-center gap-1">
                    <span>Updated</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMetrics.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-slate-600">NO ESG DATA MATCHING CRITERIA</p>
                    <p className="text-xs text-slate-400 mt-1">Adjust filters or click "Add New ESG Metric" to log data.</p>
                  </td>
                </tr>
              ) : (
                filteredMetrics.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      <div>{m.metricName}</div>
                      {m.remarks && <div className="text-[11px] text-slate-400 font-normal mt-0.5">{m.remarks}</div>}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-[10px] uppercase font-semibold text-emerald-800 block">
                        {m.pillar}
                      </span>
                      <span className="text-slate-600 text-[11px]">{m.category}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-slate-800 font-medium block">{m.entityName}</span>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        [{m.entityLevel}]
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <MetricValueDisplay value={m.value} unit={m.unit} />
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate" title={m.source}>
                      {m.source}
                    </td>
                    <td className="py-3 px-3">
                      <StatusIndicator status={m.verificationStatus} />
                    </td>
                    <td className="py-3 px-3">
                      {m.supportingDocName ? (
                        <span
                          onClick={onNavigateDocuments}
                          className="inline-flex items-center gap-1 text-[11px] text-emerald-800 hover:underline cursor-pointer"
                        >
                          <FileText size={12} />
                          <span className="truncate max-w-[120px]">{m.supportingDocName}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">--</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                      {m.lastUpdated}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenDataEntry(m)}
                          className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                          title="Edit Metric"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete metric "${m.metricName}"?`)) {
                              onDeleteMetric(m.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Delete Metric"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
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
