/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Building2, Save } from 'lucide-react';
import { OrganizationLevel, OrgEntity } from '../../types/esg';

interface AddEntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entity: Omit<OrgEntity, 'id'>) => void;
  parentEntities: OrgEntity[];
}

export const AddEntityModal: React.FC<AddEntityModalProps> = ({
  isOpen,
  onClose,
  onSave,
  parentEntities,
}) => {
  const [level, setLevel] = useState<OrganizationLevel>('subsidiary');
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState(parentEntities[0]?.id || 'meil-group');
  const [code, setCode] = useState('');
  const [headquarters, setHeadquarters] = useState('');
  const [lead, setLead] = useState('');
  const [sector, setSector] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Entity name is required.');
      return;
    }

    onSave({
      name: name.trim(),
      level,
      parentId,
      code: code.trim() || undefined,
      headquarters: headquarters.trim() || 'Hyderabad, India',
      lead: lead.trim() || 'Project Executive',
      sector: sector.trim() || 'Infrastructure',
      description: description.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-10">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-emerald-800" />
            <h2 className="text-sm font-bold text-slate-900">Add Organizational Unit</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {error && <p className="text-rose-600 bg-rose-50 p-2 rounded">{error}</p>}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Hierarchy Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as OrganizationLevel)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="subsidiary">Subsidiary</option>
                <option value="business_unit">Business Unit</option>
                <option value="project">Project</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Parent Hierarchy Entity</label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 truncate"
              >
                {parentEntities.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.level.toUpperCase()}] {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Entity Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. MEIL Solar Clean Energy Park, Eastern Corridor BU"
              className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Internal Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. MEIL-SOL-09"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Location / HQ</label>
              <input
                type="text"
                value={headquarters}
                onChange={(e) => setHeadquarters(e.target.value)}
                placeholder="e.g. Hyderabad / Andhra Pradesh"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Operational Sector</label>
              <input
                type="text"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                placeholder="e.g. Renewables, Civil Works"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Lead / Project Officer</label>
              <input
                type="text"
                value={lead}
                onChange={(e) => setLead(e.target.value)}
                placeholder="e.g. Chief Project Engineer"
                className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Description &amp; Operational Scope</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Scope of work, project milestones, ESG boundaries..."
              className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600 resize-none"
            />
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
              <span>Save Entity</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
