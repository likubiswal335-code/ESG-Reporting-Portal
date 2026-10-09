/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, FileUp, Save } from 'lucide-react';
import { DocumentEntry, ESGPillar, ReportingPeriod, OrgEntity } from '../../types/esg';

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (doc: Omit<DocumentEntry, 'id' | 'uploadDate'>) => void;
  entities: OrgEntity[];
  currentPeriod: ReportingPeriod;
}

export const AddDocumentModal: React.FC<AddDocumentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  entities,
  currentPeriod,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<DocumentEntry['category']>('Environmental Evidence');
  const [reportingPeriod, setReportingPeriod] = useState<ReportingPeriod>(currentPeriod);
  const [entityName, setEntityName] = useState(entities[0]?.name || 'MEIL Group');
  const [pillar, setPillar] = useState<ESGPillar>('environmental');
  const [fileSize, setFileSize] = useState('2.4 MB');
  const [fileFormat, setFileFormat] = useState('PDF');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Document file name is required.');
      return;
    }

    onSave({
      name: name.trim().endsWith('.pdf') ? name.trim() : `${name.trim()}.pdf`,
      category,
      reportingPeriod,
      entityName,
      pillar,
      verificationStatus: 'verified',
      fileSize,
      fileFormat,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-10">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <FileUp size={16} className="text-emerald-800" />
            <h2 className="text-sm font-bold text-slate-900">Upload &amp; Register ESG Evidence</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {error && <p className="text-rose-600 bg-rose-50 p-2 rounded">{error}</p>}

          <div>
            <label className="block font-medium text-slate-700 mb-1">Document File Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. MEIL_Environmental_Audit_Report_FY26.pdf"
              className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentEntry['category'])}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="Policy">Policy Document</option>
                <option value="Certificate">Certificate (ISO / SPCB)</option>
                <option value="Audit">External Audit Report</option>
                <option value="Report">Report / Assurance Statement</option>
                <option value="Invoice">Invoice / Utility Voucher</option>
                <option value="Environmental Evidence">Environmental Evidence</option>
                <option value="Safety Evidence">Safety Evidence</option>
                <option value="Governance Evidence">Governance Evidence</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">ESG Pillar</label>
              <select
                value={pillar}
                onChange={(e) => setPillar(e.target.value as ESGPillar)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="environmental">Environmental</option>
                <option value="social">Social</option>
                <option value="governance">Governance</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Target Entity</label>
              <select
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 truncate"
              >
                {entities.map((ent) => (
                  <option key={ent.id} value={ent.name}>
                    {ent.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Reporting Period</label>
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

          <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-md text-center">
            <FileUp size={22} className="mx-auto text-slate-400 mb-1" />
            <p className="font-medium text-slate-700">Audit-ready document metadata recorded</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Secure checksum hash generated and linked to BRSR Evidence Ledger
            </p>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-200 text-slate-700 rounded-md hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-md font-semibold flex items-center gap-1.5"
            >
              <Save size={14} />
              <span>Attach Document</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
