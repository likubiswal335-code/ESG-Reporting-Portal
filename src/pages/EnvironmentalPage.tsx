/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Leaf, Plus, Zap, CloudFog, Droplets, Trash2, FileText, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { ESGMetricEntry, ReportingPeriod, OrgEntity } from '../types/esg';
import { MetricValueDisplay } from '../components/common/MetricValueDisplay';
import { StatusIndicator } from '../components/common/StatusIndicator';

interface EnvironmentalPageProps {
  metrics: ESGMetricEntry[];
  currentPeriod: ReportingPeriod;
  selectedEntityId: string;
  entities: OrgEntity[];
  onOpenDataEntry: (initialData?: ESGMetricEntry) => void;
  onNavigateDocuments: () => void;
}

export const EnvironmentalPage: React.FC<EnvironmentalPageProps> = ({
  metrics,
  currentPeriod,
  selectedEntityId,
  entities,
  onOpenDataEntry,
  onNavigateDocuments,
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Energy' | 'Emissions' | 'Water' | 'Waste'>('All');

  const envMetrics = useMemo(() => {
    return metrics.filter((m) => m.pillar === 'environmental');
  }, [metrics]);

  const filteredMetrics = useMemo(() => {
    if (activeTab === 'All') return envMetrics;
    return envMetrics.filter((m) => m.category === activeTab);
  }, [envMetrics, activeTab]);

  // Aggregate stats
  const totalEnergy = envMetrics.find((m) => m.category === 'Energy' && m.metricName.includes('Total Energy'));
  const scope1 = envMetrics.find((m) => m.category === 'Emissions' && m.metricName.includes('Scope 1'));
  const waterWithdrawal = envMetrics.find((m) => m.category === 'Water' && m.metricName.includes('Withdrawal'));
  const nonHazWaste = envMetrics.find((m) => m.category === 'Waste' && m.metricName.includes('Non-Hazardous'));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Leaf size={16} />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Environmental Performance Module</h1>
            <span className="text-xs font-mono font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
              {currentPeriod}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Energy consumption, greenhouse gas inventory, water stewardship, and circular waste metrics across MEIL sites.
          </p>
        </div>

        <button
          onClick={() => onOpenDataEntry()}
          className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus size={14} />
          <span>Add Environmental Metric</span>
        </button>
      </div>

      {/* 4 Category Quick Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Energy */}
        <div
          onClick={() => setActiveTab('Energy')}
          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
            activeTab === 'Energy'
              ? 'bg-emerald-50/50 border-emerald-600'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">ENERGY</span>
            <Zap size={14} className="text-emerald-700" />
          </div>
          <div className="mt-1">
            <MetricValueDisplay value={totalEnergy?.value} unit="GJ" />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Total operational consumption</p>
        </div>

        {/* Emissions */}
        <div
          onClick={() => setActiveTab('Emissions')}
          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
            activeTab === 'Emissions'
              ? 'bg-emerald-50/50 border-emerald-600'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">EMISSIONS</span>
            <CloudFog size={14} className="text-teal-700" />
          </div>
          <div className="mt-1">
            <MetricValueDisplay value={scope1?.value} unit="tCO2e" />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Scope 1 direct GHG</p>
        </div>

        {/* Water */}
        <div
          onClick={() => setActiveTab('Water')}
          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
            activeTab === 'Water'
              ? 'bg-emerald-50/50 border-emerald-600'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">WATER</span>
            <Droplets size={14} className="text-sky-700" />
          </div>
          <div className="mt-1">
            <MetricValueDisplay value={waterWithdrawal?.value} unit="kL" />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Total water abstraction</p>
        </div>

        {/* Waste */}
        <div
          onClick={() => setActiveTab('Waste')}
          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
            activeTab === 'Waste'
              ? 'bg-emerald-50/50 border-emerald-600'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">WASTE</span>
            <Trash2 size={14} className="text-slate-600" />
          </div>
          <div className="mt-1">
            <MetricValueDisplay value={nonHazWaste?.value} unit="MT" />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Muck &amp; civil waste diverted</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 pb-2 text-xs font-medium">
        {(['All', 'Energy', 'Emissions', 'Water', 'Waste'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === tab
                ? 'bg-emerald-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab === 'All' ? 'All Environmental Metrics' : tab}
          </button>
        ))}
      </div>

      {/* Comprehensive Metric Grid Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {activeTab} Parameters · {filteredMetrics.length} Indicators
          </span>
          <span className="text-[11px] text-slate-400">BRSR Principle 6 Ground Truth</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/50">
                <th className="py-3 px-3">Metric Name</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Entity</th>
                <th className="py-3 px-3 text-right">Reported Value</th>
                <th className="py-3 px-3">Primary Source</th>
                <th className="py-3 px-3">Verification</th>
                <th className="py-3 px-3">Supporting Doc</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMetrics.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No environmental records found for this category and filter.
                  </td>
                </tr>
              ) : (
                filteredMetrics.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      <div>{m.metricName}</div>
                      {m.remarks && <div className="text-[11px] text-slate-400 font-normal mt-0.5">{m.remarks}</div>}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600">{m.category}</td>
                    <td className="py-3 px-3 text-slate-600">{m.entityName}</td>
                    <td className="py-3 px-3 text-right">
                      <MetricValueDisplay value={m.value} unit={m.unit} />
                    </td>
                    <td className="py-3 px-3 text-slate-500 max-w-xs truncate">{m.source}</td>
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
                          <span className="truncate max-w-[140px]">{m.supportingDocName}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">--</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onOpenDataEntry(m)}
                        className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-medium text-slate-700 transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
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
