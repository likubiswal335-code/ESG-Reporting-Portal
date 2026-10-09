/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Layers,
  FileCheck2,
  CheckCircle2,
  Building2,
  Leaf,
  Users,
  Compass,
} from 'lucide-react';
import { NavRoute } from '../components/layout/Sidebar';
import { OrgEntity, ESGMetricEntry, ReportingPeriod } from '../types/esg';

interface OverviewPageProps {
  onNavigate: (route: NavRoute) => void;
  entities: OrgEntity[];
  metrics: ESGMetricEntry[];
  currentPeriod: ReportingPeriod;
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
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onNavigate,
  entities,
  metrics,
  currentPeriod,
  completeness,
}) => {
  const subsidiaries = entities.filter((e) => e.level === 'subsidiary');
  const businessUnits = entities.filter((e) => e.level === 'business_unit');
  const projects = entities.filter((e) => e.level === 'project');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 2. HERO SECTION - Restrained, Premium Enterprise Hero */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 lg:p-10 shadow-xs relative overflow-hidden">
        {/* Subtle accent border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900" />

        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-3">
            <Building2 size={14} className="text-emerald-700" />
            <span>MEIL ESG &amp; BRSR REPORTING PORTAL</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 text-balance">
            MEIL ESG &amp; BRSR REPORTING PORTAL
          </h1>

          {/* Supporting Statement */}
          <p className="text-base sm:text-lg font-medium text-emerald-950 mt-2">
            Centralize ESG data. Identify gaps. Build BRSR-ready reports.
          </p>

          {/* Supporting Description */}
          <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
            A centralized ESG reporting workspace for managing Environmental, Social and Governance
            data across MEIL Group, subsidiaries, business units and projects.
          </p>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Open ESG Dashboard</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => onNavigate('organization')}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Layers size={14} className="text-slate-500" />
              <span>Explore Reporting Structure</span>
            </button>
          </div>
        </div>

        {/* Quick Enterprise Metadata Strip */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[11px] text-slate-400 block">Organization</span>
            <span className="font-semibold text-slate-800 mt-0.5 block truncate">MEIL Group (Parent)</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Active Period</span>
            <span className="font-mono font-semibold text-slate-800 mt-0.5 block">{currentPeriod}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Data Completeness</span>
            <span className="font-mono font-semibold text-emerald-800 mt-0.5 block">
              {completeness.overall !== null ? `${completeness.overall}% Completed` : '--'}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">Reporting Readiness</span>
            <span className="font-mono font-semibold text-slate-800 mt-0.5 block">
              {completeness.readiness !== null ? `${completeness.readiness}% BRSR Aligned` : '--'}
            </span>
          </div>
        </div>
      </section>

      {/* Organizational Workflow Chain */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900">MEIL Consolidated Reporting Architecture</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-tiered ESG aggregation model from site-level project data up to corporate BRSR disclosure
            </p>
          </div>
          <button
            onClick={() => onNavigate('organization')}
            className="text-xs font-medium text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            <span>View Full Architecture</span>
            <ArrowRight size={12} />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 border border-slate-200 rounded-lg bg-slate-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-semibold text-emerald-800 uppercase tracking-wider">
                Level 1
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">MEIL Group</h3>
            <p className="text-[11px] text-slate-500 mt-1">
              Apex corporate governing council for consolidated policy, audit sign-off, and BRSR disclosure.
            </p>
            <div className="mt-3 text-[11px] font-mono text-slate-600">
              1 Consolidated Entity
            </div>
          </div>

          <div className="p-4 border border-slate-200 rounded-lg bg-slate-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-semibold text-teal-700 uppercase tracking-wider">
                Level 2
              </span>
              <span className="w-2 h-2 rounded-full bg-teal-600" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Subsidiaries</h3>
            <p className="text-[11px] text-slate-500 mt-1">
              Autonomous corporate entities including Olectra Greentech, MEIL Hydro, and MEIL Energy.
            </p>
            <div className="mt-3 text-[11px] font-mono text-slate-600">
              {subsidiaries.length} Configured Subsidiaries
            </div>
          </div>

          <div className="p-4 border border-slate-200 rounded-lg bg-slate-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-semibold text-slate-600 uppercase tracking-wider">
                Level 3
              </span>
              <span className="w-2 h-2 rounded-full bg-slate-500" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Business Units</h3>
            <p className="text-[11px] text-slate-500 mt-1">
              Sectoral divisions: Water &amp; Lift Irrigation, Transportation &amp; Tunnelling, Hydrocarbons, EV.
            </p>
            <div className="mt-3 text-[11px] font-mono text-slate-600">
              {businessUnits.length} Operational Units
            </div>
          </div>

          <div className="p-4 border border-slate-200 rounded-lg bg-slate-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-semibold text-slate-600 uppercase tracking-wider">
                Level 4
              </span>
              <span className="w-2 h-2 rounded-full bg-slate-500" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Projects</h3>
            <p className="text-[11px] text-slate-500 mt-1">
              Direct site-level monitoring: Polavaram, Zojila Tunnel, Kaleshwaram, EV Fleet Program.
            </p>
            <div className="mt-3 text-[11px] font-mono text-slate-600">
              {projects.length} Field Sites Tracked
            </div>
          </div>
        </div>
      </section>

      {/* Core ESG Pillars Overview */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Environmental */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <Leaf size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Environmental</h3>
                  <span className="text-[11px] text-slate-500">Energy · Emissions · Water · Waste</span>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-800">
                {completeness.environmental !== null ? `${completeness.environmental}%` : '--'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              Tracking Scope 1 &amp; 2 emissions, captive renewable generation at manufacturing yards,
              muck reutilization at tunnelling packages, and construction water recycling.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Essential Disclosures</span>
            <button
              onClick={() => onNavigate('environmental')}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
            >
              <span>Explore Module</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* Social */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-teal-50 text-teal-800 flex items-center justify-center">
                  <Users size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Social</h3>
                  <span className="text-[11px] text-slate-500">Workforce · Safety · CSR</span>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-teal-800">
                {completeness.social !== null ? `${completeness.social}%` : '--'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              Monitoring 28,000+ employees and workers, zero-fatality HSE protocols, LTIFR tracking,
              high-altitude safety training, and MEIL Foundation community drinking water initiatives.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Zero Fatality Goal</span>
            <button
              onClick={() => onNavigate('social')}
              className="text-xs font-semibold text-teal-800 hover:text-teal-950 flex items-center gap-1"
            >
              <span>Explore Module</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* Governance */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-slate-100 text-slate-800 flex items-center justify-center">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Governance</h3>
                  <span className="text-[11px] text-slate-500">Board · Ethics · Supply Chain</span>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-slate-800">
                {completeness.governance !== null ? `${completeness.governance}%` : '--'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              Oversight on Board independence, Code of Business Conduct compliance, Vigil Mechanism
              whistleblower grievances, anti-corruption safeguards, and supplier ESG assessments.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">100% Attestation</span>
            <button
              onClick={() => onNavigate('governance')}
              className="text-xs font-semibold text-slate-800 hover:text-slate-950 flex items-center gap-1"
            >
              <span>Explore Module</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </section>

      {/* Quick Launch & Readiness Strip */}
      <section className="bg-slate-900 text-white rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-semibold text-emerald-400 uppercase tracking-widest block">
            REPORTING DISCIPLINE
          </span>
          <h3 className="text-base font-bold text-white mt-1">
            Build BRSR-Aligned Disclosures for MEIL Group
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Compile verified Section A, B, and C disclosures across all 9 National Voluntary Guidelines
            (NVGs / NGRBC) principles using entered ground-truth records.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('brsr')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-md transition-colors"
          >
            Open BRSR Workspace
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-md transition-colors"
          >
            Export Reports
          </button>
        </div>
      </section>
    </div>
  );
};
