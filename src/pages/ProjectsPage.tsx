/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Briefcase, Plus, MapPin, CheckCircle2, FileText, ArrowRight, Layers } from 'lucide-react';
import { ProjectESGRecord, ReportingPeriod, OrgEntity } from '../types/esg';
import { ProgressMeter } from '../components/charts/PillarDistributionChart';
import { StatusIndicator } from '../components/common/StatusIndicator';
import { NavRoute } from '../components/layout/Sidebar';

interface ProjectsPageProps {
  projects: ProjectESGRecord[];
  currentPeriod: ReportingPeriod;
  entities: OrgEntity[];
  onOpenAddEntity: () => void;
  onNavigate: (route: NavRoute) => void;
  onSelectProject: (projectId: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  currentPeriod,
  entities,
  onOpenAddEntity,
  onNavigate,
  onSelectProject,
}) => {
  const [selectedProject, setSelectedProject] = useState<ProjectESGRecord | null>(projects[0] || null);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-emerald-800 text-white flex items-center justify-center">
              <Briefcase size={16} />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Project ESG Management</h1>
            <span className="text-xs font-mono font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
              {currentPeriod}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Site-level monitoring for major MEIL engineering packages: Tunnelling, Lift Irrigation, and Clean Mobility.
          </p>
        </div>

        <button
          onClick={onOpenAddEntity}
          className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus size={14} />
          <span>Add Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-xs">
          <Briefcase size={36} className="mx-auto text-slate-400 mb-3" />
          <h2 className="text-sm font-bold text-slate-800">NO PROJECTS CONFIGURED</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Add a project to begin project-level ESG reporting and site-level indicator tracking.
          </p>
          <button
            onClick={onOpenAddEntity}
            className="mt-4 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
          >
            Add Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Projects Table List (8 Cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Configured Projects · {projects.length} Sites
              </span>
              <span className="text-[11px] text-slate-400">Site-level ESG completeness</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/70">
                    <th className="py-3 px-3">Project</th>
                    <th className="py-3 px-3">Business Unit</th>
                    <th className="py-3 px-3">Period</th>
                    <th className="py-3 px-3">ESG Completeness</th>
                    <th className="py-3 px-3">Reporting Status</th>
                    <th className="py-3 px-3">Last Updated</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.map((prj) => {
                    const isSelected = selectedProject?.id === prj.id;
                    return (
                      <tr
                        key={prj.id}
                        onClick={() => setSelectedProject(prj)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-emerald-50/40' : 'hover:bg-slate-50/70'
                        }`}
                      >
                        <td className="py-3 px-3 font-semibold text-slate-800">
                          <div>{prj.name}</div>
                          <div className="text-[11px] text-slate-400 font-normal flex items-center gap-1 mt-0.5">
                            <MapPin size={11} />
                            <span>{prj.location}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-600">{prj.businessUnitName}</td>
                        <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">{prj.period}</td>
                        <td className="py-3 px-3 w-32">
                          <ProgressMeter value={prj.completeness} />
                        </td>
                        <td className="py-3 px-3">
                          <StatusIndicator status={prj.status} />
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                          {prj.lastUpdated}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectProject(prj.id);
                              onNavigate('esg-data');
                            }}
                            className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-medium text-slate-700 transition-colors"
                          >
                            View Data
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Project Details Panel (4 Cols) */}
          <div className="lg:col-span-4">
            {selectedProject ? (
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <span className="text-[10px] font-mono uppercase font-semibold text-emerald-800">
                    PROJECT PROFILE
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">{selectedProject.name}</h3>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                    <MapPin size={12} className="text-slate-400" />
                    <span>{selectedProject.location}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Business Unit</span>
                    <span className="font-semibold text-slate-800">{selectedProject.businessUnitName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Cycle</span>
                    <span className="font-mono text-slate-800">{selectedProject.period}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Status</span>
                    <StatusIndicator status={selectedProject.status} />
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Documents Attached</span>
                    <span className="font-mono font-medium text-slate-800">
                      {selectedProject.documentsCount} files
                    </span>
                  </div>
                </div>

                {/* Score breakdown */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5 text-xs">
                  <span className="font-semibold text-slate-800 block">Pillar Completeness Index</span>
                  <div>
                    <ProgressMeter value={selectedProject.environmentalScore ?? 85} label="Environmental" />
                  </div>
                  <div>
                    <ProgressMeter value={selectedProject.socialScore ?? 80} label="Social & HSE" />
                  </div>
                  <div>
                    <ProgressMeter value={selectedProject.governanceScore ?? 82} label="Governance & Integrity" />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      onSelectProject(selectedProject.id);
                      onNavigate('esg-data');
                    }}
                    className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Inspect Site Metrics</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-slate-400 text-xs">
                Select a project row to inspect site-level parameters.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
