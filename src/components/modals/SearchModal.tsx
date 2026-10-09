/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Building2, Database, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { OrgEntity, ESGMetricEntry, DocumentEntry } from '../../types/esg';
import { NavRoute } from '../layout/Sidebar';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  entities: OrgEntity[];
  metrics: ESGMetricEntry[];
  documents: DocumentEntry[];
  onNavigate: (route: NavRoute, filterParam?: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  entities,
  metrics,
  documents,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Cmd+K / Ctrl+K / Escape)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // If already open, toggle or focus
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) {
      return {
        entities: entities.slice(0, 3),
        metrics: metrics.slice(0, 4),
        documents: documents.slice(0, 3),
      };
    }

    const q = query.toLowerCase();

    return {
      entities: entities.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.sector?.toLowerCase().includes(q) ||
          e.level.toLowerCase().includes(q)
      ),
      metrics: metrics.filter(
        (m) =>
          m.metricName.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          m.pillar.toLowerCase().includes(q) ||
          m.entityName.toLowerCase().includes(q)
      ),
      documents: documents.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          d.entityName.toLowerCase().includes(q)
      ),
    };
  }, [query, entities, metrics, documents]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-10">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-100">
          <Search size={18} className="text-slate-400 shrink-0 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search metrics, projects, subsidiaries, policies..."
            className="w-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          )}
          <kbd className="hidden sm:inline text-[10px] font-mono text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 ml-2 bg-slate-50">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Entities Section */}
          {results.entities.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 size={12} />
                <span>Organizations &amp; Projects</span>
              </div>
              <div className="space-y-1">
                {results.entities.map((ent) => (
                  <div
                    key={ent.id}
                    onClick={() => {
                      onNavigate(ent.level === 'project' ? 'projects' : 'organization');
                      onClose();
                    }}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 cursor-pointer text-xs group transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-slate-800 group-hover:text-emerald-900">
                        {ent.name}
                      </span>
                      <span className="text-slate-400 ml-2 text-[11px]">
                        {ent.level.toUpperCase()} · {ent.headquarters || ent.sector}
                      </span>
                    </div>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-emerald-700" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metrics Section */}
          {results.metrics.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Database size={12} />
                <span>ESG Indicators &amp; Data Points</span>
              </div>
              <div className="space-y-1">
                {results.metrics.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      onNavigate('esg-data', m.pillar);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 cursor-pointer text-xs group transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-slate-800 group-hover:text-emerald-900">
                        {m.metricName}
                      </span>
                      <span className="text-slate-400 ml-2 text-[11px]">
                        {m.pillar.toUpperCase()} · {m.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono tabular-nums text-slate-600 font-medium">
                        {m.value !== null ? `${m.value.toLocaleString()} ${m.unit}` : '--'}
                      </span>
                      <ArrowRight size={14} className="text-slate-300 group-hover:text-emerald-700" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents Section */}
          {results.documents.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={12} />
                <span>Evidence &amp; Documents</span>
              </div>
              <div className="space-y-1">
                {results.documents.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      onNavigate('documents');
                      onClose();
                    }}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 cursor-pointer text-xs group transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-slate-800 group-hover:text-emerald-900">
                        {doc.name}
                      </span>
                      <span className="text-slate-400 ml-2 text-[11px]">
                        {doc.category} · {doc.entityName}
                      </span>
                    </div>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-emerald-700" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Search MEIL ESG metrics, projects &amp; compliance evidence</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
