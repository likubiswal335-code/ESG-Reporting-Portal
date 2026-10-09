/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Network,
  Plus,
  Building2,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Leaf,
  Users,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { OrgEntity, ESGMetricEntry, ReportingPeriod } from '../types/esg';
import { NavRoute } from '../components/layout/Sidebar';

interface OrganizationPageProps {
  entities: OrgEntity[];
  metrics: ESGMetricEntry[];
  currentPeriod: ReportingPeriod;
  selectedEntityId: string;
  onEntityChange: (eId: string) => void;
  onOpenAddEntity: () => void;
  onNavigate: (route: NavRoute) => void;
}

export const OrganizationPage: React.FC<OrganizationPageProps> = ({
  entities,
  metrics,
  currentPeriod,
  selectedEntityId,
  onEntityChange,
  onOpenAddEntity,
  onNavigate,
}) => {
  const [activeSelectedEntity, setActiveSelectedEntity] = useState<string>(selectedEntityId);

  const selectedEntity = entities.find((e) => e.id === activeSelectedEntity) || entities[0];

  const entityMetrics = metrics.filter((m) =>
    selectedEntity.level === 'group' ? true : m.entityId === selectedEntity.id
  );

  const envCount = entityMetrics.filter((m) => m.pillar === 'environmental').length;
  const socCount = entityMetrics.filter((m) => m.pillar === 'social').length;
  const govCount = entityMetrics.filter((m) => m.pillar === 'governance').length;

  const validCount = entityMetrics.filter((m) => m.value !== null && m.status === 'reported').length;
  const completenessPct =
    entityMetrics.length > 0 ? Math.round((validCount / entityMetrics.length) * 100) : null;

  const subsidiaries = entities.filter((e) => e.level === 'subsidiary');
  const businessUnits = entities.filter((e) => e.level === 'business_unit');
  const projects = entities.filter((e) => e.level === 'project');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-emerald-800 text-white flex items-center justify-center">
              <Network size={16} />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Organizational Architecture</h1>
            <span className="text-xs font-mono font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
              {currentPeriod}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            MEIL Group structural ESG boundaries: Group Apex → Subsidiaries → Business Units → Site Projects.
          </p>
        </div>

        <button
          onClick={onOpenAddEntity}
          className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus size={14} />
          <span>Add Organizational Unit</span>
        </button>
      </div>

      {/* Main Grid: Left Tree, Right Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Tree (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Consolidation Hierarchy Tree
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">
              {entities.length} Total Units
            </span>
          </div>

          <div className="space-y-3 font-sans text-xs">
            {/* Level 1: Group Root */}
            <div
              onClick={() => {
                setActiveSelectedEntity('meil-group');
                onEntityChange('meil-group');
              }}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                activeSelectedEntity === 'meil-group'
                  ? 'bg-emerald-900 text-white border-emerald-950 shadow-xs'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 size={16} className={activeSelectedEntity === 'meil-group' ? 'text-emerald-300' : 'text-emerald-800'} />
                  <span className="font-bold text-sm">MEIL GROUP (Parent Holding)</span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  activeSelectedEntity === 'meil-group' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-700'
                }`}>
                  APEX LEVEL
                </span>
              </div>
              <p className={`text-[11px] mt-1 ${activeSelectedEntity === 'meil-group' ? 'text-emerald-200' : 'text-slate-500'}`}>
                Consolidated parent boundary for Megha Engineering &amp; Infrastructures Limited
              </p>
            </div>

            {/* Level 2: Subsidiaries */}
            <div className="pl-4 sm:pl-6 space-y-2 border-l-2 border-emerald-800/40 ml-4">
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-800 tracking-wider block">
                Subsidiaries ({subsidiaries.length})
              </span>

              {subsidiaries.map((sub) => {
                const isSelected = activeSelectedEntity === sub.id;
                const childBUs = businessUnits.filter((b) => b.parentId === sub.id);

                return (
                  <div key={sub.id} className="space-y-2">
                    <div
                      onClick={() => {
                        setActiveSelectedEntity(sub.id);
                        onEntityChange(sub.id);
                      }}
                      className={`p-2.5 rounded-md border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-teal-900 text-white border-teal-950'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-teal-800 text-teal-100' : 'bg-teal-50 text-teal-800'
                          }`}>
                            SUB
                          </span>
                          <span className="font-bold text-xs">{sub.name}</span>
                        </div>
                        <span className={`text-[11px] font-mono ${isSelected ? 'text-teal-200' : 'text-slate-400'}`}>
                          {sub.code || 'MEIL-SUB'}
                        </span>
                      </div>
                      <div className={`mt-1 text-[11px] flex items-center justify-between ${
                        isSelected ? 'text-teal-200' : 'text-slate-500'
                      }`}>
                        <span>{sub.sector}</span>
                        <span>{sub.headquarters}</span>
                      </div>
                    </div>

                    {/* Child Business Units */}
                    {childBUs.length > 0 && (
                      <div className="pl-5 space-y-1.5 border-l border-slate-200 ml-3">
                        {childBUs.map((bu) => {
                          const isBuSelected = activeSelectedEntity === bu.id;
                          const childProjects = projects.filter((p) => p.parentId === bu.id);

                          return (
                            <div key={bu.id} className="space-y-1">
                              <div
                                onClick={() => {
                                  setActiveSelectedEntity(bu.id);
                                  onEntityChange(bu.id);
                                }}
                                className={`p-2 rounded border cursor-pointer text-[11px] ${
                                  isBuSelected
                                    ? 'bg-slate-800 text-white border-slate-900'
                                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold">{bu.name}</span>
                                  <span className="text-[10px] opacity-70 font-mono">BU</span>
                                </div>
                              </div>

                              {/* Child Projects */}
                              {childProjects.map((prj) => (
                                <div
                                  key={prj.id}
                                  onClick={() => {
                                    setActiveSelectedEntity(prj.id);
                                    onEntityChange(prj.id);
                                  }}
                                  className={`ml-4 p-1.5 rounded border cursor-pointer text-[11px] ${
                                    activeSelectedEntity === prj.id
                                      ? 'bg-emerald-800 text-white border-emerald-900'
                                      : 'bg-white border-slate-200 hover:border-slate-300'
                                  }`}
                                >
                                  <span className="font-medium">{prj.name}</span>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Selected Entity Dynamic Inspector (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-emerald-800">
                  {selectedEntity.level} DETAILS
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedEntity.name}</h3>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Sector</span>
                <span className="font-medium text-slate-800">{selectedEntity.sector || 'Infrastructure'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Location / HQ</span>
                <span className="font-medium text-slate-800">{selectedEntity.headquarters || 'Hyderabad'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Leadership</span>
                <span className="font-medium text-slate-800">{selectedEntity.lead || 'Executive Council'}</span>
              </div>
              <div className="py-1">
                <span className="text-slate-500 block mb-1">Operational Description</span>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  {selectedEntity.description || 'Active operating subsidiary under MEIL Group reporting boundary.'}
                </p>
              </div>
            </div>

            {/* Performance Stats for Selected Entity */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
              <span className="font-semibold text-slate-800 block">ESG Metric Completeness</span>
              <div className="flex items-baseline justify-between">
                <span className="text-slate-500">Tracked Indicators</span>
                <span className="font-mono tabular-nums font-bold text-slate-800">
                  {validCount} / {entityMetrics.length}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-sm overflow-hidden">
                <div
                  className="bg-emerald-800 h-full"
                  style={{ width: `${completenessPct ?? 0}%` }}
                />
              </div>
              <div className="pt-2 grid grid-cols-3 gap-2 text-center text-[11px] border-t border-slate-200">
                <div>
                  <span className="text-slate-400 block">ENV</span>
                  <span className="font-mono font-semibold text-emerald-800">{envCount}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">SOC</span>
                  <span className="font-mono font-semibold text-teal-700">{socCount}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">GOV</span>
                  <span className="font-mono font-semibold text-slate-700">{govCount}</span>
                </div>
              </div>
            </div>

            {/* Action to Jump to Data */}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => onNavigate('esg-data')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View Entity Data in Inventory</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
