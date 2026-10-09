/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings, Shield, RefreshCw, CheckCircle2, Building2 } from 'lucide-react';
import { ReportingPeriod } from '../types/esg';
import { esgStore } from '../data/esgStore';

interface SettingsPageProps {
  currentPeriod: ReportingPeriod;
  onPeriodChange: (p: ReportingPeriod) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  currentPeriod,
  onPeriodChange,
}) => {
  const [boundaryScope, setBoundaryScope] = useState('Operational Control (100% MEIL Equity & JVs)');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Reset all ESG data to default baseline? This will clear custom added entities and metrics.'
      )
    ) {
      esgStore.resetToDefault();
      alert('Workspace reset to clean default baseline state.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-emerald-800 text-white flex items-center justify-center">
              <Settings size={16} />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Portal &amp; Reporting Settings</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure ESG organizational boundary, verification thresholds, and reporting cycles.
          </p>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-700" />
          <span>Settings saved successfully.</span>
        </div>
      )}

      {/* Settings Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6 text-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            1. Reporting Period &amp; Financial Year
          </h2>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Active Default Reporting Period
              </label>
              <select
                value={currentPeriod}
                onChange={(e) => onPeriodChange(e.target.value as ReportingPeriod)}
                className="w-full px-3 py-2 border border-slate-200 rounded-md bg-white font-medium text-slate-800"
              >
                <option value="FY 2025–26">FY 2025–26 (Active Cycle)</option>
                <option value="FY 2024–25">FY 2024–25 (Audited Prior Year)</option>
                <option value="FY 2023–24">FY 2023–24 (Historical Baseline)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                GHG Protocol Accounting Standard
              </label>
              <input
                type="text"
                disabled
                value="GHG Protocol Corporate Standard & CEA Ver 19"
                className="w-full px-3 py-2 border border-slate-200 rounded-md bg-slate-50 text-slate-600 font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            2. Consolidation Boundary Definition
          </h2>
          <div className="mt-3 space-y-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Organizational Boundary Approach
              </label>
              <select
                value={boundaryScope}
                onChange={(e) => setBoundaryScope(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-md bg-white font-medium text-slate-800"
              >
                <option value="Operational Control (100% MEIL Equity & JVs)">
                  Operational Control (100% MEIL Equity &amp; Operating JVs)
                </option>
                <option value="Financial Control">Financial Control</option>
                <option value="Equity Share">Equity Share Basis</option>
              </select>
            </div>
            <p className="text-[11px] text-slate-500">
              Under Operational Control, MEIL consolidates 100% of emissions and social parameters
              from sites where MEIL or its subsidiaries exercise operational execution rights.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            3. Data Integrity &amp; Reset
          </h2>
          <div className="mt-3 flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-md">
            <div>
              <span className="font-bold text-slate-800">Restore Baseline Clean State</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Reverts to verified MEIL initial baseline state.
              </p>
            </div>
            <button
              onClick={handleResetData}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={13} />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-md font-semibold text-xs transition-colors cursor-pointer"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
