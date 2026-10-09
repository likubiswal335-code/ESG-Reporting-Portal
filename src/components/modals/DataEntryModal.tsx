/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Save, FileUp } from 'lucide-react';
import { ESGMetricEntry, ESGPillar, OrganizationLevel, ReportingPeriod, VerificationStatus, MetricStatus, OrgEntity } from '../../types/esg';

interface DataEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (metric: Omit<ESGMetricEntry, 'id' | 'lastUpdated'>) => void;
  onUpdate?: (id: string, updates: Partial<ESGMetricEntry>) => void;
  initialData?: ESGMetricEntry | null;
  entities: OrgEntity[];
  currentPeriod: ReportingPeriod;
}

export const DataEntryModal: React.FC<DataEntryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  initialData,
  entities,
  currentPeriod,
}) => {
  const [metricName, setMetricName] = useState('');
  const [pillar, setPillar] = useState<ESGPillar>('environmental');
  const [category, setCategory] = useState('Energy');
  const [valueStr, setValueStr] = useState('');
  const [unit, setUnit] = useState('GJ');
  const [reportingPeriod, setReportingPeriod] = useState<ReportingPeriod>(currentPeriod);
  const [entityId, setEntityId] = useState('meil-group');
  const [source, setSource] = useState('');
  const [status, setStatus] = useState<MetricStatus>('reported');
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('verified');
  const [remarks, setRemarks] = useState('');
  const [supportingDocName, setSupportingDocName] = useState('');
  const [updatedBy, setUpdatedBy] = useState('S. K. Rao (ESG Lead)');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidated, setIsValidated] = useState(false);

  useEffect(() => {
    if (initialData) {
      setMetricName(initialData.metricName);
      setPillar(initialData.pillar);
      setCategory(initialData.category);
      setValueStr(initialData.value !== null ? initialData.value.toString() : '');
      setUnit(initialData.unit);
      setReportingPeriod(initialData.reportingPeriod);
      setEntityId(initialData.entityId);
      setSource(initialData.source);
      setStatus(initialData.status);
      setVerificationStatus(initialData.verificationStatus);
      setRemarks(initialData.remarks || '');
      setSupportingDocName(initialData.supportingDocName || '');
      setUpdatedBy(initialData.updatedBy || 'S. K. Rao (ESG Lead)');
    } else {
      // Defaults
      setMetricName('');
      setPillar('environmental');
      setCategory('Energy');
      setValueStr('');
      setUnit('GJ');
      setReportingPeriod(currentPeriod);
      setEntityId('meil-group');
      setSource('');
      setStatus('reported');
      setVerificationStatus('verified');
      setRemarks('');
      setSupportingDocName('');
      setUpdatedBy('S. K. Rao (ESG Lead)');
    }
    setErrors({});
    setIsValidated(false);
  }, [initialData, isOpen, currentPeriod]);

  if (!isOpen) return null;

  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!metricName.trim()) {
      errs.metricName = 'Metric name is required.';
    }
    if (!unit.trim()) {
      errs.unit = 'Measurement unit is required.';
    }
    if (valueStr.trim() !== '') {
      const num = Number(valueStr);
      if (isNaN(num)) {
        errs.value = 'Value must be a valid numeric quantity.';
      }
    }
    if (!source.trim()) {
      errs.source = 'Data source / verification origin is required.';
    }

    setErrors(errs);
    setIsValidated(Object.keys(errs).length === 0);
    return Object.keys(errs).length === 0;
  };

  const handleValidateClick = () => {
    const valid = validateForm();
    if (valid) {
      setIsValidated(true);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const selectedEntity = entities.find((e) => e.id === entityId) || entities[0];
    const parsedValue = valueStr.trim() === '' ? null : Number(valueStr);

    const payload: Omit<ESGMetricEntry, 'id' | 'lastUpdated'> = {
      metricName: metricName.trim(),
      category: category.trim(),
      pillar,
      value: parsedValue,
      unit: unit.trim(),
      reportingPeriod,
      entityId: selectedEntity.id,
      entityName: selectedEntity.name,
      entityLevel: selectedEntity.level,
      source: source.trim(),
      status: parsedValue === null ? 'unreported' : status,
      verificationStatus,
      remarks: remarks.trim() || undefined,
      supportingDocName: supportingDocName.trim() || undefined,
      updatedBy: updatedBy.trim(),
    };

    if (initialData && onUpdate) {
      onUpdate(initialData.id, payload);
    } else {
      onSave(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {initialData ? 'Edit ESG Metric Entry' : 'Add New ESG Metric Entry'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Megha Engineering &amp; Infrastructures Limited (MEIL) Reporting System
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Validation Notice if any */}
          {isValidated && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md flex items-center gap-2 text-emerald-800">
              <CheckCircle size={16} className="text-emerald-700 shrink-0" />
              <span>Input format passed internal MEIL validation checks. Ready to save.</span>
            </div>
          )}

          {Object.keys(errors).length > 0 && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-md flex items-start gap-2 text-rose-800">
              <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Please fix the following validation errors:</span>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px]">
                  {Object.values(errors).map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Row 1: Pillar, Category, Reporting Period */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                ESG Pillar <span className="text-rose-500">*</span>
              </label>
              <select
                value={pillar}
                onChange={(e) => {
                  const p = e.target.value as ESGPillar;
                  setPillar(p);
                  if (p === 'environmental') setCategory('Energy');
                  else if (p === 'social') setCategory('Workforce');
                  else setCategory('Corporate Governance');
                }}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="environmental">Environmental</option>
                <option value="social">Social</option>
                <option value="governance">Governance</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                {pillar === 'environmental' && (
                  <>
                    <option value="Energy">Energy</option>
                    <option value="Emissions">Emissions (Scope 1/2/3)</option>
                    <option value="Water">Water Stewardship</option>
                    <option value="Waste">Waste &amp; Hazardous Material</option>
                  </>
                )}
                {pillar === 'social' && (
                  <>
                    <option value="Workforce">Workforce &amp; Labor</option>
                    <option value="Health & Safety">Occupational Health &amp; Safety</option>
                    <option value="Training">Training &amp; Development</option>
                    <option value="Diversity & Inclusion">Diversity &amp; Inclusion</option>
                    <option value="Human Rights">Human Rights</option>
                    <option value="Community / CSR">Community &amp; CSR</option>
                  </>
                )}
                {pillar === 'governance' && (
                  <>
                    <option value="Corporate Governance">Corporate Governance &amp; Board</option>
                    <option value="Ethics & Compliance">Ethics &amp; Anti-Corruption</option>
                    <option value="Whistleblower">Whistleblower Mechanism</option>
                    <option value="Risk Management">ESG &amp; Operational Risk</option>
                    <option value="Supply Chain">Supply Chain ESG</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Reporting Period <span className="text-rose-500">*</span>
              </label>
              <select
                value={reportingPeriod}
                onChange={(e) => setReportingPeriod(e.target.value as ReportingPeriod)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="FY 2025–26">FY 2025–26</option>
                <option value="FY 2024–25">FY 2024–25</option>
                <option value="FY 2023–24">FY 2023–24</option>
              </select>
            </div>
          </div>

          {/* Row 2: Metric Name */}
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Metric Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={metricName}
              onChange={(e) => setMetricName(e.target.value)}
              placeholder="e.g. Total Direct Fuel Consumption, LTIFR Rate, Board Independence"
              className={`w-full px-3 py-1.5 border rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 ${
                errors.metricName ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
          </div>

          {/* Row 3: Value & Unit & Entity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Numeric Value (Leave blank if unreported)
              </label>
              <input
                type="text"
                value={valueStr}
                onChange={(e) => setValueStr(e.target.value)}
                placeholder="e.g. 482500"
                className={`w-full px-3 py-1.5 border rounded-md font-mono tabular-nums text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 ${
                  errors.value ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Measurement Unit <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. GJ, tCO2e, kL, %, Persons"
                className={`w-full px-3 py-1.5 border rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 ${
                  errors.unit ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Target Entity <span className="text-rose-500">*</span>
              </label>
              <select
                value={entityId}
                onChange={(e) => setEntityId(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                {entities.map((ent) => (
                  <option key={ent.id} value={ent.id}>
                    [{ent.level.toUpperCase()}] {ent.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Source & Verification Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Data Source / Origin <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. Utility Invoices, Flowmeter Log, SAP HR, MCA21 Filing"
                className={`w-full px-3 py-1.5 border rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 ${
                  errors.source ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Verification Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value as VerificationStatus)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="verified">Verified (Auditor / Documented)</option>
                <option value="needs_review">Needs Review / Incomplete</option>
                <option value="unverified">Unverified (Self-Declared)</option>
              </select>
            </div>
          </div>

          {/* Row 5: Supporting Document Name & Auditor / Owner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Supporting Document Name
              </label>
              <div className="relative">
                <FileUp size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={supportingDocName}
                  onChange={(e) => setSupportingDocName(e.target.value)}
                  placeholder="e.g. Energy_Audit_Report_2026.pdf"
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Reporting Officer / Sign-Off
              </label>
              <input
                type="text"
                value={updatedBy}
                onChange={(e) => setUpdatedBy(e.target.value)}
                placeholder="e.g. S. K. Rao (ESG Lead)"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Row 6: Remarks & Compliance Notes */}
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Remarks &amp; Audit Methodology Notes
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Provide context on calculation standard, GHG boundary, or site conditions..."
              className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 resize-none"
            />
          </div>

          {/* Actions Bar */}
          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleValidateClick}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition-colors"
              >
                Validate Format
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-md font-semibold transition-colors flex items-center gap-1.5"
              >
                <Save size={14} />
                <span>Save Metric</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
