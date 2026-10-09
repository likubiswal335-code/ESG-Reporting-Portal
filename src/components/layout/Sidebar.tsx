/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Leaf,
  Users,
  ShieldCheck,
  Database,
  CheckCircle,
  FileText,
  FileSpreadsheet,
  Network,
  Briefcase,
  History,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Building2,
  X,
} from 'lucide-react';

export type NavRoute =
  | 'overview'
  | 'dashboard'
  | 'environmental'
  | 'social'
  | 'governance'
  | 'esg-data'
  | 'data-quality'
  | 'documents'
  | 'brsr'
  | 'reports'
  | 'organization'
  | 'projects'
  | 'audit-log'
  | 'settings';

interface SidebarProps {
  currentRoute: NavRoute;
  onNavigate: (route: NavRoute) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenAssistant: () => void;
}

interface NavSection {
  title: string;
  items: {
    id: NavRoute;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    badge?: string;
  }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'OVERVIEW',
    items: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'dashboard', label: 'ESG Dashboard', icon: BarChart3 },
    ],
  },
  {
    title: 'ESG PERFORMANCE',
    items: [
      { id: 'environmental', label: 'Environmental', icon: Leaf },
      { id: 'social', label: 'Social', icon: Users },
      { id: 'governance', label: 'Governance', icon: ShieldCheck },
    ],
  },
  {
    title: 'DATA MANAGEMENT',
    items: [
      { id: 'esg-data', label: 'ESG Data', icon: Database },
      { id: 'data-quality', label: 'Data Quality', icon: CheckCircle },
      { id: 'documents', label: 'Documents', icon: FileText },
    ],
  },
  {
    title: 'REPORTING',
    items: [
      { id: 'brsr', label: 'BRSR Reporting', icon: FileSpreadsheet },
      { id: 'reports', label: 'Reports & Exports', icon: FileText },
    ],
  },
  {
    title: 'ORGANIZATION',
    items: [
      { id: 'organization', label: 'Organizational Structure', icon: Network },
      { id: 'projects', label: 'Projects', icon: Briefcase },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { id: 'audit-log', label: 'Audit Log', icon: History },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  onOpenAssistant,
}) => {
  const handleItemClick = (route: NavRoute) => {
    onNavigate(route);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0a291f] text-slate-200 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-emerald-900/60 shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded bg-emerald-700/80 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Building2 size={18} className="text-emerald-100" />
          </div>
          {!collapsed && (
            <div className="truncate">
              <span className="text-xs font-bold tracking-wider text-white uppercase block leading-none">
                MEIL ESG
              </span>
              <span className="text-[11px] font-medium text-emerald-300/80 tracking-tight block mt-1">
                MEIL GROUP
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded hover:bg-emerald-900/60 text-slate-300 hover:text-white"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 rounded hover:bg-emerald-900/60 text-emerald-300/70 hover:text-white transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </div>

      {/* Navigation Body */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-5 scrollbar-thin">
        {NAV_SECTIONS.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {!collapsed && (
              <div className="px-2.5 pb-1 text-[10px] font-semibold tracking-wider text-emerald-400/70 uppercase">
                {section.title}
              </div>
            )}
            {section.items.map((item) => {
              const isActive = currentRoute === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-xs font-medium transition-colors text-left group relative ${
                    isActive
                      ? 'bg-emerald-800/80 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-emerald-900/40 hover:text-emerald-100'
                  }`}
                >
                  {/* Subtle active indicator stripe */}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-emerald-400 rounded-r" />
                  )}
                  <Icon
                    size={16}
                    className={`shrink-0 transition-colors ${
                      isActive ? 'text-emerald-300' : 'text-slate-400 group-hover:text-emerald-200'
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* MEIL ESG Assistant Quick Trigger */}
      <div className="p-2 border-t border-emerald-900/60 shrink-0">
        <button
          onClick={onOpenAssistant}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/40 text-emerald-200 transition-colors text-xs font-medium"
          title="Open MEIL ESG Assistant"
        >
          <Sparkles size={16} className="text-emerald-400 shrink-0" />
          {!collapsed && (
            <div className="text-left truncate">
              <span className="block text-white font-medium text-xs">MEIL ESG Assistant</span>
              <span className="block text-[10px] text-emerald-400/80">BRSR Guidance & Audit</span>
            </div>
          )}
        </button>
      </div>

      {/* Footer Info */}
      {!collapsed && (
        <div className="px-3.5 py-2.5 border-t border-emerald-900/50 bg-[#071f17] text-[10px] text-emerald-300/60 shrink-0">
          <p className="truncate font-sans font-medium text-slate-300">Megha Engineering &amp; Infrastructures</p>
          <p className="font-mono text-[9px] text-emerald-400/60 mt-0.5">Enterprise Portal v3.2</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:block shrink-0 transition-all duration-200 ease-in-out border-r border-emerald-950 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="h-screen sticky top-0">{sidebarContent}</div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-xl z-10">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
