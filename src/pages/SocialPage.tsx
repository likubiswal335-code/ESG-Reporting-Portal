/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Users, Plus, ShieldCheck, HeartHandshake, GraduationCap, Award, FileText } from 'lucide-react';
import { ESGMetricEntry, ReportingPeriod, OrgEntity } from '../types/esg';
import { MetricValueDisplay } from '../components/common/MetricValueDisplay';
import { StatusIndicator } from '../components/common/StatusIndicator';

interface SocialPageProps {
  metrics: ESGMetricEntry[];
  currentPeriod: ReportingPeriod;
  selectedEntityId: string;
  entities: OrgEntity[];
  onOpenDataEntry: (initialData?: ESGMetricEntry) => void;
  onNavigateDocuments: () => void;
}

export const SocialPage: React.FC<SocialPageProps> = ({
  metrics,
  currentPeriod,
  selectedEntityId,
  entities,
  onOpenDataEntry,
  onNavigateDocuments,
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Workforce' | 'Health & Safety' | 'Training' | 'Community / CSR'>('All');

  const socMetrics = useMemo(() => {
    return metrics.filter((m) => m.pillar === 'social');
  }, [metrics]);

  const filteredMetrics = useMemo(() => {
    if (activeTab === 'All') return socMetrics;
    return socMetrics.filter((m) => m.category === activeTab);
  }, [socMetrics, activeTab]);

  const totalWorkforce = socMetrics.find((m) => m.metricName.includes('Total Workforce'));
  const ltifr = socMetrics.find((m) => m.metricName.includes('LTIFR'));
  const safetyTraining = socMetrics.find((m) => m.metricName.includes('Safety Training'));
  const csrSpend = socMetrics.find((m) => m.metricName.includes('CSR'));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-teal-50 text-teal-800 flex items-center justify-center">
              <Users size={16} />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Social Performance Module</h1>
            <span className="text-xs font-mono font-medium text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
              {currentPeriod}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Workforce welfare, Occupational Health &amp; Safety (HSE), skill development, and MEIL Foundation CSR initiatives.
          </p>
        </div>

        <button
          onClick={() => onOpenDataEntry()}
          className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus size={14} />
          <span>Add Social Metric</span>
        </button>
      </div>

      {/* KPI Blocks */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('Workforce')}
          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
            activeTab === 'Workforce' ? 'bg-teal-50/50 border-teal-600' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">WORKFORCE</span>
            <Users size={14} className="text-teal-700" />
          </div>
          <div className="mt-1">
            <MetricValueDisplay value={totalWorkforce?.value} unit="Persons" />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Total active on-site workforce</p>
        </div>

        <div
          onClick={() => setActiveTab('Health & Safety')}
          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
            activeTab === 'Health & Safety' ? 'bg-teal-50/50 border-teal-600' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">SAFETY LTIFR</span>
            <ShieldCheck size={14} className="text-emerald-700" />
          </div>
          <div className="mt-1">
            <MetricValueDisplay value={ltifr?.value} format="decimal" unit="Rate" />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Lost Time Injury Frequency Rate</p>
        </div>

        <div
          onClick={() => setActiveTab('Training')}
          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
            activeTab === 'Training' ? 'bg-teal-50/50 border-teal-600' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">SAFETY TRAINING</span>
            <GraduationCap size={14} className="text-teal-700" />
          </div>
          <div className="mt-1">
            <MetricValueDisplay value={safetyTraining?.value} unit="Hours" />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Mandatory HSE induction hours</p>
        </div>

        <div
          onClick={() => setActiveTab('Community / CSR')}
          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
            activeTab === 'Community / CSR' ? 'bg-teal-50/50 border-teal-600' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">CSR OUTLAY</span>
            <HeartHandshake size={14} className="text-rose-600" />
          </div>
          <div className="mt-1">
            <MetricValueDisplay value={csrSpend?.value} unit="₹ Crores" />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">MEIL Foundation rural drinking water</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 pb-2 text-xs font-medium">
        {(['All', 'Workforce', 'Health & Safety', 'Training', 'Community / CSR'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === tab
                ? 'bg-emerald-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab === 'All' ? 'All Social Disclosures' : tab}
          </button>
        ))}
      </div>

      {/* Social Indicators Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {activeTab} Indicators · {filteredMetrics.length} Tracked
          </span>
          <span className="text-[11px] text-slate-400">BRSR Principles 3 &amp; 8 Aligned</span>
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
              {filteredMetrics.map((m) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
