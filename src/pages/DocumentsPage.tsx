/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { FileText, Plus, Search, Filter, ShieldCheck, Download, ExternalLink, FileUp } from 'lucide-react';
import { DocumentEntry, ReportingPeriod, OrgEntity } from '../types/esg';
import { StatusIndicator } from '../components/common/StatusIndicator';

interface DocumentsPageProps {
  documents: DocumentEntry[];
  currentPeriod: ReportingPeriod;
  entities: OrgEntity[];
  onOpenAddDocument: () => void;
}

export const DocumentsPage: React.FC<DocumentsPageProps> = ({
  documents,
  currentPeriod,
  entities,
  onOpenAddDocument,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPillar, setSelectedPillar] = useState('ALL');

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      if (selectedCategory !== 'ALL' && doc.category !== selectedCategory) return false;
      if (selectedPillar !== 'ALL' && doc.pillar !== selectedPillar) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          doc.name.toLowerCase().includes(q) ||
          doc.entityName.toLowerCase().includes(q) ||
          doc.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [documents, selectedCategory, selectedPillar, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-emerald-800 text-white flex items-center justify-center">
              <FileText size={16} />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Documents &amp; Audit Evidence</h1>
            <span className="text-xs font-mono font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
              {currentPeriod}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Central repository for statutory certificates, third-party assurance letters, ISO audits, and site bills.
          </p>
        </div>

        <button
          onClick={onOpenAddDocument}
          className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <FileUp size={14} />
          <span>Upload Document Metadata</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[180px] max-w-md">
            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search document name, entity..."
              className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="Policy">Policy Documents</option>
            <option value="Certificate">Certificates</option>
            <option value="Audit">External Audits</option>
            <option value="Report">Reports</option>
            <option value="Environmental Evidence">Environmental Evidence</option>
            <option value="Safety Evidence">Safety Evidence</option>
            <option value="Governance Evidence">Governance Evidence</option>
          </select>

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
        </div>

        <div className="text-slate-500 font-mono text-[11px]">
          Showing {filteredDocs.length} registered files
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/70">
                <th className="py-3 px-3">Document Name</th>
                <th className="py-3 px-3">Document Type / Category</th>
                <th className="py-3 px-3">Entity</th>
                <th className="py-3 px-3">ESG Pillar</th>
                <th className="py-3 px-3">Reporting Period</th>
                <th className="py-3 px-3">Verification</th>
                <th className="py-3 px-3">File Size</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-slate-600">NO DOCUMENTS RECORDED</p>
                    <p className="text-xs text-slate-400 mt-1">Upload audit certificates or environmental manifests.</p>
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-slate-400 shrink-0" />
                        <span className="font-mono text-xs">{doc.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{doc.category}</td>
                    <td className="py-3 px-3 text-slate-700 font-medium">{doc.entityName}</td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-[10px] uppercase font-semibold text-emerald-800">
                        {doc.pillar}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                      {doc.reportingPeriod}
                    </td>
                    <td className="py-3 px-3">
                      <StatusIndicator status={doc.verificationStatus} />
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                      {doc.fileSize}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => alert(`Document metadata verified: ${doc.name}\nEntity: ${doc.entityName}\nCategory: ${doc.category}`)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-medium text-slate-700 transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <ExternalLink size={12} />
                        <span>Inspect</span>
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
