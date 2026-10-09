/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2,
  ArrowRight,
  Download,
  Printer,
  FileCheck2,
} from 'lucide-react';
import { ESGMetricEntry, ReportingPeriod, OrgEntity } from '../types/esg';
import { MetricValueDisplay } from '../components/common/MetricValueDisplay';
import { NavRoute } from '../components/layout/Sidebar';

interface BrsrReportingPageProps {
  metrics: ESGMetricEntry[];
  currentPeriod: ReportingPeriod;
  entities: OrgEntity[];
  completeness: {
    overall: number | null;
    environmental: number | null;
    social: number | null;
    governance: number | null;
    readiness: number | null;
    totalMetrics: number;
    reportedCount: number;
    verifiedCount: number;
  };
  onNavigate: (route: NavRoute) => void;
}

const BRSR_PRINCIPLES = [
  {
    id: 'P1',
    name: 'Principle 1: Ethics, Transparency & Accountability',
    desc: 'Businesses should conduct and govern themselves with integrity, in a manner that is ethical, transparent and accountable.',
    pillar: 'Governance',
    readiness: 100,
    status: 'Complete',
  },
  {
    id: 'P2',
    name: 'Principle 2: Sustainable & Safe Products / Services',
    desc: 'Businesses should provide goods and services in a manner that is sustainable and safe throughout their lifecycle.',
    pillar: 'Environmental',
    readiness: 85,
    status: 'In Progress',
  },
  {
    id: 'P3',
    name: 'Principle 3: Employee Well-being & Workplace Safety',
    desc: 'Businesses should respect and promote the well-being of all employees, including health, safety, and human capital growth.',
    pillar: 'Social',
    readiness: 95,
    status: 'Complete',
  },
  {
    id: 'P4',
    name: 'Principle 4: Stakeholder Responsiveness',
    desc: 'Businesses should respect the interests of and be responsive to all stakeholders, especially disadvantaged groups.',
    pillar: 'Social',
    readiness: 90,
    status: 'Complete',
  },
  {
    id: 'P5',
    name: 'Principle 5: Respect for Human Rights',
    desc: 'Businesses should respect and promote human rights across operational boundaries and supply chain touchpoints.',
    pillar: 'Social',
    readiness: 90,
    status: 'Complete',
  },
  {
    id: 'P6',
    name: 'Principle 6: Protection & Restoration of Environment',
    desc: 'Businesses should respect and make efforts to protect and restore the environment through resource efficiency and circularity.',
    pillar: 'Environmental',
    readiness: 88,
    status: 'In Progress',
  },
  {
    id: 'P7',
    name: 'Principle 7: Responsible Public & Regulatory Policy Advocacy',
    desc: 'Businesses, when engaging in influencing public and regulatory policy, should do so in a manner that is transparent and responsible.',
    pillar: 'Governance',
    readiness: 100,
    status: 'Complete',
  },
  {
    id: 'P8',
    name: 'Principle 8: Inclusive Growth & Equitable Social Development',
    desc: 'Businesses should promote inclusive growth and equitable development through strategic CSR and community partnerships.',
    pillar: 'Social',
    readiness: 95,
    status: 'Complete',
  },
  {
    id: 'P9',
    name: 'Principle 9: Consumer Value & Responsible Engagement',
    desc: 'Businesses should engage with and provide value to their consumers in a responsible, secure, and transparent manner.',
    pillar: 'Governance',
    readiness: 85,
    status: 'In Progress',
  },
];

export const BrsrReportingPage: React.FC<BrsrReportingPageProps> = ({
  metrics,
  currentPeriod,
  entities,
  completeness,
  onNavigate,
}) => {
  const [activeSection, setActiveSection] = useState<'A' | 'B' | 'C'>('C');

  // Core metrics for preview
  const energyMetric = metrics.find((m) => m.category === 'Energy' && m.value !== null);
  const scope1 = metrics.find((m) => m.category === 'Emissions' && m.metricName.includes('Scope 1'));
  const scope2 = metrics.find((m) => m.category === 'Emissions' && m.metricName.includes('Scope 2'));
  const water = metrics.find((m) => m.category === 'Water' && m.metricName.includes('Withdrawal'));
  const ltifr = metrics.find((m) => m.metricName.includes('LTIFR'));
  const boardIndep = metrics.find((m) => m.metricName.includes('Board Independent'));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-emerald-800 text-white flex items-center justify-center">
              <FileSpreadsheet size={16} />
            </div>
            <h1 className="text-xl font-bold text-slate-900">BRSR Reporting Workspace</h1>
            <span className="text-xs font-mono font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
              BRSR-Ready · {currentPeriod}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Business Responsibility and Sustainability Reporting structure aligned with MCA &amp; SEBI BRSR guidelines.
          </p>
        </div>

        <button
          onClick={() => onNavigate('reports')}
          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <FileCheck2 size={14} />
          <span>Launch BRSR Document Builder</span>
        </button>
      </div>

      {/* 25. REPORTING READINESS SUMMARY CARD */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 tracking-wider">
              BRSR REPORTING READINESS
            </span>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-mono font-bold tabular-nums text-white">
                {completeness.readiness !== null ? `${completeness.readiness}%` : 'Data Insufficient'}
              </span>
              <span className="text-xs text-emerald-300 font-medium">
                {completeness.readiness !== null && completeness.readiness >= 80
                  ? 'Audit Ready for Annual Filing Compilation'
                  : 'Requires Scope 3 & Tier 1 Supplier Review'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Calculated dynamically from {completeness.reportedCount} reported metrics and{' '}
              {completeness.verifiedCount} external auditor-verified evidence entries.
            </p>
          </div>

          {/* Sub-readiness scores */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Environmental</span>
              <span className="text-base font-mono font-bold text-emerald-400">
                {completeness.environmental !== null ? `${completeness.environmental}%` : '--'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Social &amp; HSE</span>
              <span className="text-base font-mono font-bold text-teal-300">
                {completeness.social !== null ? `${completeness.social}%` : '--'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Governance</span>
              <span className="text-base font-mono font-bold text-slate-200">
                {completeness.governance !== null ? `${completeness.governance}%` : '--'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Verified Evidence</span>
              <span className="text-base font-mono font-bold text-white">
                {completeness.totalMetrics > 0
                  ? `${Math.round((completeness.verifiedCount / completeness.totalMetrics) * 100)}%`
                  : '--'}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block text-[11px]">Statutory Disclaimer</span>
              <span className="text-[10px] text-slate-400 font-sans block mt-0.5">
                BRSR-aligned outputs require secretarial review prior to filing.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Switcher Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 pb-2 text-xs font-medium">
        <button
          onClick={() => setActiveSection('A')}
          className={`px-3.5 py-1.5 rounded-md transition-colors ${
            activeSection === 'A'
              ? 'bg-emerald-900 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Section A: General Disclosures
        </button>
        <button
          onClick={() => setActiveSection('B')}
          className={`px-3.5 py-1.5 rounded-md transition-colors ${
            activeSection === 'B'
              ? 'bg-emerald-900 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Section B: Management &amp; Process
        </button>
        <button
          onClick={() => setActiveSection('C')}
          className={`px-3.5 py-1.5 rounded-md transition-colors ${
            activeSection === 'C'
              ? 'bg-emerald-900 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Section C: Principle-wise Indicators (P1–P9)
        </button>
      </div>

      {/* Section Content */}
      {activeSection === 'C' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Section C: Principle-wise Performance Indicators
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Coverage across all 9 National Guidelines on Responsible Business Conduct (NGRBC)
                </p>
              </div>
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                9 Principles Mapped
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {BRSR_PRINCIPLES.map((pr) => (
                <div
                  key={pr.id}
                  className="p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {pr.id}
                      </span>
                      <h3 className="font-bold text-slate-800">{pr.name}</h3>
                      <span className="text-[10px] font-mono uppercase text-slate-500">
                        [{pr.pillar}]
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{pr.desc}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Readiness</span>
                      <span className="font-mono font-bold text-slate-800">{pr.readiness}%</span>
                    </div>
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200/60">
                      {pr.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSection === 'A' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 text-xs">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Section A: General Corporate Disclosures</h2>
            <p className="text-xs text-slate-500 mt-0.5">Entity details, operations, and workforce boundary</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Corporate Identity</span>
              <span className="font-bold text-slate-900 block mt-0.5">
                Megha Engineering &amp; Infrastructures Limited (MEIL)
              </span>
              <span className="text-slate-500 text-[11px] block mt-1">CIN: U45202TG2006PLC050271</span>
              <span className="text-slate-500 text-[11px] block">
                Registered Office: S-2, Technocrat Industrial Estate, Balanagar, Hyderabad, Telangana
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Consolidated Boundary</span>
              <span className="font-bold text-slate-900 block mt-0.5">
                MEIL Group, Subsidiaries, Business Units &amp; Projects
              </span>
              <span className="text-slate-500 text-[11px] block mt-1">
                Active Subsidiaries: Olectra Greentech, MEIL Hydro, MEIL Energy
              </span>
              <span className="text-slate-500 text-[11px] block">Total Operating Plants &amp; Sites: 120+</span>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'B' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 text-xs">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Section B: Management and Process Disclosures</h2>
            <p className="text-xs text-slate-500 mt-0.5">Governance structure, policies, and stakeholder commitments</p>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">ESG Steering Committee Charter</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Board-level committee overseeing quarterly sustainability targets and BRSR disclosures.
                </p>
              </div>
              <span className="text-emerald-700 font-semibold text-xs">100% Adopted</span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">Vigil Mechanism &amp; Whistleblower Policy</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Independent ombudsman channel for ethical grievances and anti-corruption oversight.
                </p>
              </div>
              <span className="text-emerald-700 font-semibold text-xs">Operational</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
