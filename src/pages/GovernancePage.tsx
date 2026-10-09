/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ShieldCheck, Plus, Scale, AlertOctagon, HelpCircle, Network, FileText } from 'lucide-react';
import { ESGMetricEntry, ReportingPeriod, OrgEntity } from '../types/esg';
import { MetricValueDisplay } from '../components/common/MetricValueDisplay';
import { StatusIndicator } from '../components/common/StatusIndicator';

interface GovernancePageProps {
  metrics: ESGMetricEntry[];
  currentPeriod: ReportingPeriod;
  selectedEntityId: string;
  entities: OrgEntity[];
  onOpenDataEntry: (initialData?: ESGMetricEntry) => void;
  onNavigateDocuments: () => void;
}

export const GovernancePage: React.FC<GovernancePageProps> = ({
  metrics,
  currentPeriod,
  selectedEntityId,
  entities,
  onOpenDataEntry,
  onNavigateDocuments,
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Corporate Governance' | 'Ethics & Compliance' | 'Whistleblower' | 'Supply Chain'>('All');

  const govMetrics = useMemo(() => {
    return metrics.filter((m) => m.pillar === 'governance');
  }, [metrics]);

  const filteredMetrics = useMemo(() => {
    if (activeTab === 'All') return govMetrics;
    return govMetrics.filter((m) => m.category === activeTab);
  }, [govMetrics, activeTab]);

  const boardIndep = govMetrics.find((m) => m.metricName.includes('Board Independent'));
  const codeConduct = govMetrics.find((m) => m.metricName.includes('Anti-Bribery'));
  const whistleblower = govMetrics.find((m) => m.metricName.includes('Whistleblower'));
  const supplierScreen = govMetrics.find((m) => m.metricName.includes('Suppliers Screened'));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-slate-100 text-slate-800 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Governance &amp; Oversight Module</h1>
            <span className="text-xs font-mono font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60">
              {currentPeriod}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Board independence, Anti-Bribery Code of Conduct, Vigil Mechanism resolution, and Tier 1 vendor ESG audits.
          </p>
        </div>

        <button
          onClick={() => onOpenDataEntry()}
          className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus size={14} />
          <span>Add Governance Metric</span>
        </button>
      </div>

      {/* KPI Blocks */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('Corporate Governance')}
          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
            activeTab === 'Corporate Governance' ? 'bg-slate-50 border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">BOARD INDEPENDENCE</span>
            <Scale size={14} className="text-slate-700" />
          </div>
          <div className="mt-1">
            <MetricValueDisplay value={boardIndep?.value} format="percent" />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Companies Act / SEBI compliant</p>
        </div>

        <div
          onClick={() => setActiveTab('Ethics & Compliance')}
          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
            activeTab === 'Ethics & Compliance' ? 'bg-slate-50 border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">CODE OF CONDUCT</span>
            <ShieldCheck size={14} className="text-emerald-700" />
          </div>
          <div className="mt-1">
            <MetricValueDisplay value={codeConduct?.value} format="percent" />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Anti-bribery annual attestation</p>
        </div>

        <div
          onClick={() => setActiveTab('Whistleblower')}
          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
            activeTab === 'Whistleblower' ? 'bg-slate-50 border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">VIGIL RESOLUTION</span>
            <AlertOctagon size={14} className="text-emerald-700" />
          </div>
          <div className="mt-1">
            <MetricValueDisplay value={whistleblower?.value} format="percent" />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">All complaints resolved &lt;30 days</p>
        </div>

        <div
          onClick={() => setActiveTab('Supply Chain')}
          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
            activeTab === 'Supply Chain' ? 'bg-slate-50 border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">SUPPLIER ESG AUDIT</span>
            <Network size={14} className="text-amber-700" />
          </div>
          <div className="mt-1">
            <MetricValueDisplay value={supplierScreen?.value} format="percent" />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Tier 1 critical vendor assessments</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 pb-2 text-xs font-medium">
        {(['All', 'Corporate Governance', 'Ethics & Compliance', 'Whistleblower', 'Supply Chain'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === tab
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab === 'All' ? 'All Governance Indicators' : tab}
          </button>
        ))}
      </div>

      {/* Governance Metrics Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {activeTab} Parameters · {filteredMetrics.length} Indicators
          </span>
          <span className="text-[11px] text-slate-400">BRSR Principles 1 &amp; 7 Disclosures</span>
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
