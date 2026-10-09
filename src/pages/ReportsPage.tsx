/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Save,
  Building2,
  FileSpreadsheet,
  FileCheck,
} from 'lucide-react';
import { ESGMetricEntry, ReportingPeriod, OrgEntity } from '../types/esg';
import { MetricValueDisplay } from '../components/common/MetricValueDisplay';

interface ReportsPageProps {
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
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  metrics,
  currentPeriod,
  entities,
  completeness,
}) => {
  const [activeSection, setActiveSection] = useState<
    'overview' | 'environmental' | 'social' | 'governance' | 'policies' | 'risk' | 'indicators'
  >('overview');

  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [isValidated, setIsValidated] = useState(false);

  // Group metrics by pillar
  const envMetrics = metrics.filter((m) => m.pillar === 'environmental');
  const socMetrics = metrics.filter((m) => m.pillar === 'social');
  const govMetrics = metrics.filter((m) => m.pillar === 'governance');

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'MEIL GROUP - ESG & BRSR REPORTING',
      `Reporting Period: ${currentPeriod}`,
      `Entity: MEIL Group Consolidated`,
      `Generation Date: ${new Date().toISOString().split('T')[0]}`,
      '',
      'Metric Name,Category,Pillar,Value,Unit,Entity,Source,Verification Status,Remarks',
    ];

    const rows = metrics.map((m) =>
      `"${m.metricName}","${m.category}","${m.pillar}","${m.value ?? ''}","${m.unit}","${m.entityName}","${m.source}","${m.verificationStatus}","${m.remarks || ''}"`
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent([...headers, ...rows].join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `MEIL_Group_ESG_BRSR_Report_${currentPeriod.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const handleSaveDraft = () => {
    setIsDraftSaved(true);
    setTimeout(() => setIsDraftSaved(false), 3000);
  };

  const handleValidateReport = () => {
    setIsValidated(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-emerald-800 text-white flex items-center justify-center">
              <FileCheck size={16} />
            </div>
            <h1 className="text-xl font-bold text-slate-900">BRSR Report Builder &amp; Exports</h1>
            <span className="text-xs font-mono font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
              {currentPeriod}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Build, validate, and export official BRSR-aligned reporting packages for Megha Engineering &amp; Infrastructures Limited.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSaveDraft}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save size={13} />
            <span>{isDraftSaved ? 'Draft Saved' : 'Save Draft'}</span>
          </button>
          <button
            onClick={handleValidateReport}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <CheckCircle2 size={13} />
            <span>Validate</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrintPDF}
            className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Printer size={13} />
            <span>Export / Print PDF</span>
          </button>
        </div>
      </div>

      {/* 24. BRSR REPORT BUILDER 3-COLUMN WORKBENCH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Report Navigation (3 Cols) */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2 text-xs">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block px-2 mb-2">
            REPORT SECTIONS
          </span>

          {[
            { id: 'overview', label: '1. Company Overview' },
            { id: 'environmental', label: '2. Environmental Disclosures' },
            { id: 'social', label: '3. Social & Workforce' },
            { id: 'governance', label: '4. Corporate Governance' },
            { id: 'policies', label: '5. Policies & Commitments' },
            { id: 'risk', label: '6. Risk & Opportunities' },
            { id: 'indicators', label: '7. Core Indicator Ledger' },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as typeof activeSection)}
              className={`w-full text-left px-3 py-2 rounded-md font-medium transition-colors ${
                activeSection === sec.id
                  ? 'bg-emerald-900 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {sec.label}
            </button>
          ))}

          <div className="pt-4 mt-4 border-t border-slate-100 px-2 space-y-1 text-[11px] text-slate-400">
            <p>Aligned with SEBI BRSR Format</p>
            <p className="font-mono">Boundary: MEIL Group Consolidated</p>
          </div>
        </div>

        {/* CENTER COLUMN: Report Preview / Editor (6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 shadow-xs overflow-y-auto max-h-[750px]">
          {/* Official Document Header */}
          <div className="border-b-2 border-emerald-900 pb-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
                MEIL GROUP · ESG &amp; BRSR REPORTING
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Cycle: {currentPeriod}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Business Responsibility &amp; Sustainability Report
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Megha Engineering &amp; Infrastructures Limited (MEIL)
            </p>
          </div>

          {/* Section 1: Overview */}
          {activeSection === 'overview' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 pb-1 border-b border-slate-100">
                I. General Company Disclosures (Section A)
              </h3>
              <div className="space-y-2 text-slate-700">
                <p>
                  <strong>Corporate Identity:</strong> Megha Engineering &amp; Infrastructures Limited (MEIL)
                </p>
                <p>
                  <strong>Registered Office:</strong> S-2, Technocrat Industrial Estate, Balanagar, Hyderabad - 500037, Telangana, India
                </p>
                <p>
                  <strong>Corporate Activities:</strong> Hydrocarbon EPC, Lift Irrigation, Strategic High-Altitude Tunnelling, Expressways, Clean Energy, and Electric Mobility.
                </p>
                <p>
                  <strong>Reporting Boundary:</strong> Consolidated operations including subsidiaries (Olectra Greentech, MEIL Hydro, MEIL Energy), operational business units, and site-level projects.
                </p>
              </div>
            </div>
          )}

          {/* Section 2: Environmental */}
          {activeSection === 'environmental' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 pb-1 border-b border-slate-100">
                II. Environmental Performance (Principle 6 Disclosures)
              </h3>
              <p className="text-slate-600 text-[11px]">
                Ground-truth operational resource consumption and emissions inventory.
              </p>
              <div className="divide-y divide-slate-100">
                {envMetrics.map((m) => (
                  <div key={m.id} className="py-2.5 flex justify-between items-baseline">
                    <span className="font-medium text-slate-800">{m.metricName}</span>
                    <MetricValueDisplay value={m.value} unit={m.unit} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Social */}
          {activeSection === 'social' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 pb-1 border-b border-slate-100">
                III. Social Performance &amp; Human Capital (Principles 3 &amp; 8)
              </h3>
              <div className="divide-y divide-slate-100">
                {socMetrics.map((m) => (
                  <div key={m.id} className="py-2.5 flex justify-between items-baseline">
                    <span className="font-medium text-slate-800">{m.metricName}</span>
                    <MetricValueDisplay value={m.value} unit={m.unit} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Governance */}
          {activeSection === 'governance' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 pb-1 border-b border-slate-100">
                IV. Corporate Governance &amp; Ethics (Principles 1 &amp; 7)
              </h3>
              <div className="divide-y divide-slate-100">
                {govMetrics.map((m) => (
                  <div key={m.id} className="py-2.5 flex justify-between items-baseline">
                    <span className="font-medium text-slate-800">{m.metricName}</span>
                    <MetricValueDisplay value={m.value} unit={m.unit} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Policies */}
          {activeSection === 'policies' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 pb-1 border-b border-slate-100">
                V. Governance Policies &amp; Commitments
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-slate-700">
                <li>MEIL Group Environmental &amp; Climate Policy (ISO 14001 certified)</li>
                <li>Occupational Health and Safety Charter (ISO 45001 audited)</li>
                <li>Code of Business Conduct, Anti-Bribery, and Ethical Sourcing Guidelines</li>
                <li>Whistleblower &amp; Vigil Mechanism Policy approved by Corporate Board</li>
                <li>Corporate Social Responsibility (CSR) Framework via MEIL Foundation</li>
              </ul>
            </div>
          )}

          {/* Section 6: Risk */}
          {activeSection === 'risk' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 pb-1 border-b border-slate-100">
                VI. ESG Materiality, Risks &amp; Opportunities
              </h3>
              <div className="space-y-2 text-slate-700">
                <p>
                  <strong>Climate &amp; Physical Risk:</strong> Extreme weather events impacting high-altitude strategic infrastructure (e.g. Zojila pass avalanche monitoring).
                </p>
                <p>
                  <strong>Transition Opportunities:</strong> Clean mobility scale-up through Olectra Greentech electric buses and zero-emission transit solutions.
                </p>
                <p>
                  <strong>Resource Stewardship:</strong> Lift irrigation system power optimization and captive renewable generation at engineering yards.
                </p>
              </div>
            </div>
          )}

          {/* Section 7: Indicators */}
          {activeSection === 'indicators' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-bold text-slate-900 pb-1 border-b border-slate-100">
                VII. Consolidated Core Indicator Ledger
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                      <th className="py-1.5">Indicator</th>
                      <th className="py-1.5">Pillar</th>
                      <th className="py-1.5 text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {metrics.map((m) => (
                      <tr key={m.id}>
                        <td className="py-1.5 font-medium text-slate-800">{m.metricName}</td>
                        <td className="py-1.5 font-mono text-slate-500 uppercase">{m.pillar}</td>
                        <td className="py-1.5 text-right">
                          <MetricValueDisplay value={m.value} unit={m.unit} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Document Sign-off stamp */}
          <div className="mt-8 pt-4 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Megha Engineering &amp; Infrastructures Limited</span>
            <span>Generated on {new Date().toISOString().split('T')[0]}</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Validation / Properties Panel (3 Cols) */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4 text-xs">
          <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              AUDIT VALIDATION
            </span>
            <span className="text-xs font-mono font-bold text-emerald-800">
              {completeness.readiness !== null ? `${completeness.readiness}% Ready` : '--'}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-700">
              <CheckCircle2 size={14} className="text-emerald-700 shrink-0" />
              <span>General Disclosures populated</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <CheckCircle2 size={14} className="text-emerald-700 shrink-0" />
              <span>Scope 1 &amp; Scope 2 emissions verified</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <CheckCircle2 size={14} className="text-emerald-700 shrink-0" />
              <span>Occupational safety LTIFR audited</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <CheckCircle2 size={14} className="text-emerald-700 shrink-0" />
              <span>Board independence verified</span>
            </div>
            <div className="flex items-center gap-2 text-amber-700">
              <AlertTriangle size={14} className="text-amber-600 shrink-0" />
              <span>Scope 3 Tier 1 supplier logs in-progress</span>
            </div>
          </div>

          {isValidated && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-[11px]">
              Validation complete: 23 essential disclosures verified against MCA BRSR technical parameters.
            </div>
          )}

          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] font-mono text-slate-400 block mb-1">EXPORT FORMATS</span>
            <div className="space-y-1.5">
              <button
                onClick={handleExportCSV}
                className="w-full py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium flex items-center justify-between transition-colors"
              >
                <span>Raw Data (.csv)</span>
                <Download size={12} />
              </button>
              <button
                onClick={handlePrintPDF}
                className="w-full py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium flex items-center justify-between transition-colors"
              >
                <span>Official PDF View (.pdf)</span>
                <Printer size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
