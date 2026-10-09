/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  Menu,
  ChevronDown,
  Building,
  Calendar,
  User,
  Shield,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  KeyRound,
} from 'lucide-react';
import { ReportingPeriod, OrgEntity } from '../../types/esg';
import { NavRoute } from './Sidebar';
import { AuthUser } from '../../services/api';

interface TopbarProps {
  currentRoute: NavRoute;
  selectedPeriod: ReportingPeriod;
  onPeriodChange: (p: ReportingPeriod) => void;
  selectedEntityId: string;
  onEntityChange: (eId: string) => void;
  entities: OrgEntity[];
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  onOpenAssistant: () => void;
  openDataIssuesCount?: number;
  user: AuthUser | null;
  onLogout: () => void;
  onOpenChangePassword: () => void;
}

const ROUTE_LABELS: Record<NavRoute, { parent: string; current: string }> = {
  overview: { parent: 'MEIL Group', current: 'ESG Overview' },
  dashboard: { parent: 'MEIL Group', current: 'ESG Dashboard' },
  environmental: { parent: 'ESG Performance', current: 'Environmental Module' },
  social: { parent: 'ESG Performance', current: 'Social Module' },
  governance: { parent: 'ESG Performance', current: 'Governance Module' },
  'esg-data': { parent: 'Data Management', current: 'ESG Data Entry & Inventory' },
  'data-quality': { parent: 'Data Management', current: 'Data Quality & Validation' },
  documents: { parent: 'Data Management', current: 'Evidence & Documents' },
  brsr: { parent: 'Reporting', current: 'BRSR Reporting Workspace' },
  reports: { parent: 'Reporting', current: 'Reports & Exports Builder' },
  organization: { parent: 'Organization', current: 'Organizational Architecture' },
  projects: { parent: 'Organization', current: 'Project ESG Management' },
  'audit-log': { parent: 'System', current: 'Audit Trail' },
  settings: { parent: 'System', current: 'System Settings' },
};

export const Topbar: React.FC<TopbarProps> = ({
  currentRoute,
  selectedPeriod,
  onPeriodChange,
  selectedEntityId,
  onEntityChange,
  entities,
  onOpenMobileMenu,
  onOpenSearch,
  onOpenAssistant,
  openDataIssuesCount = 3,
  user,
  onLogout,
  onOpenChangePassword,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const routeInfo = ROUTE_LABELS[currentRoute] || { parent: 'MEIL Group', current: 'Portal' };

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 sticky top-0 z-30">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Open navigation menu"
        >
          <Menu size={18} />
        </button>

        {/* Clean Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
          <span className="font-medium text-slate-700 hover:text-slate-900 transition-colors">
            {routeInfo.parent}
          </span>
          <span className="text-slate-300 font-mono">/</span>
          <span className="text-emerald-900 font-semibold truncate">{routeInfo.current}</span>
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Organization Selector */}
        <div className="relative hidden lg:flex items-center">
          <Building size={14} className="absolute left-2.5 text-slate-400 pointer-events-none" />
          <select
            value={selectedEntityId}
            onChange={(e) => onEntityChange(e.target.value)}
            className="pl-7 pr-7 py-1.5 bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 rounded-md hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer appearance-none max-w-[200px] truncate"
            title="Select Organizational Entity"
          >
            {entities.map((ent) => (
              <option key={ent.id} value={ent.id}>
                {ent.level === 'group'
                  ? 'MEIL Group (Consolidated)'
                  : ent.level === 'subsidiary'
                  ? `[Sub] ${ent.name}`
                  : ent.level === 'business_unit'
                  ? `[BU] ${ent.name}`
                  : `[Project] ${ent.name}`}
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 text-slate-400 pointer-events-none" />
        </div>

        {/* Reporting Period Selector */}
        <div className="relative flex items-center">
          <Calendar size={14} className="absolute left-2.5 text-slate-400 pointer-events-none hidden sm:block" />
          <select
            value={selectedPeriod}
            onChange={(e) => onPeriodChange(e.target.value as ReportingPeriod)}
            className="sm:pl-7 pr-7 py-1.5 bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 rounded-md hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer appearance-none"
            title="Reporting Period"
          >
            <option value="FY 2025–26">FY 2025–26</option>
            <option value="FY 2024–25">FY 2024–25</option>
            <option value="FY 2023–24">FY 2023–24</option>
          </select>
          <ChevronDown size={12} className="absolute right-2 text-slate-400 pointer-events-none" />
        </div>

        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
          title="Search metrics, entities, or documents (Ctrl+K)"
        >
          <Search size={14} className="text-slate-500" />
          <span className="hidden xl:inline text-slate-500">Search ESG Data...</span>
          <kbd className="hidden xl:inline text-[10px] font-mono text-slate-400 border border-slate-200 rounded px-1 ml-1 bg-white">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md relative transition-colors"
            title="Notifications & Data Alerts"
            aria-label="View notifications"
          >
            <Bell size={16} />
            {openDataIssuesCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-50 text-xs">
              <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-slate-900">Data Quality Alerts</span>
                <span className="text-[11px] font-mono text-slate-500">{openDataIssuesCount} pending</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                <div className="p-3 hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-800">Scope 3 Emission Data Missing</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Tier 1 supplier steel and cement reports pending for FY 2025–26.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-3 hover:bg-slate-50 cursor-pointer">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-800">Energy Consumption Verified</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Auditor sign-off received for MEIL Group consolidated power logs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-3 pt-2 border-t border-slate-100 text-center">
                <span className="text-[11px] text-emerald-800 font-medium hover:underline cursor-pointer">
                  Review All Data Issues
                </span>
              </div>
            </div>
          )}
        </div>

        {/* AI Assistant Quick Trigger */}
        <button
          onClick={onOpenAssistant}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80 rounded-md text-xs font-medium transition-colors"
          title="MEIL ESG Assistant"
        >
          <Sparkles size={14} className="text-emerald-700" />
          <span className="font-medium">ESG Assistant</span>
        </button>

        {/* Authenticated-User Indicator from Prompt Specification */}
        <div className="hidden md:flex flex-col text-right leading-none border-l border-slate-200 pl-3 py-0.5">
          <span className="text-[11px] font-bold text-slate-800">Management Admin</span>
          <span className="text-[10px] font-medium text-emerald-600 flex items-center justify-end gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Authenticated</span>
          </span>
        </div>

        {/* User / Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-md hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors"
            aria-label="User Profile"
          >
            <div className="w-7 h-7 rounded-full bg-[#0a2342] text-white flex items-center justify-center font-bold text-xs">
              MA
            </div>
            <div className="hidden xl:block text-left text-xs leading-tight">
              <span className="font-semibold text-slate-800 block">
                {user?.userId || 'MEIL-MGMT-ADM01'}
              </span>
              <span className="text-[10px] text-slate-500 block">Executive Access</span>
            </div>
            <ChevronDown size={12} className="text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="font-semibold text-slate-900">Megha Engineering &amp; Infrastructures Ltd</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  User ID: <strong className="text-slate-700">{user?.userId || 'MEIL-MGMT-ADM01'}</strong>
                </p>
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                  <Shield size={12} />
                  <span>Role: MANAGEMENT_ADMIN</span>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenChangePassword();
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <KeyRound size={13} className="text-slate-500" />
                  <span>Rotate Password</span>
                </button>
              </div>

              <div className="px-3 py-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="w-full py-1.5 px-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <LogOut size={13} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Standalone Logout Button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-red-700 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-md transition-colors"
          title="Terminate Management Session"
        >
          <LogOut size={13} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
