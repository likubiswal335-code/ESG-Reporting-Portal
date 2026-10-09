/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { History, Search, Filter, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';
import { AuditLogEntry, ReportingPeriod } from '../types/esg';
import { api } from '../services/api';

interface AuditLogPageProps {
  auditLogs: AuditLogEntry[];
  currentPeriod: ReportingPeriod;
}

export const AuditLogPage: React.FC<AuditLogPageProps> = ({ auditLogs: storeLogs, currentPeriod }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [serverLogs, setServerLogs] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchServerLogs = async () => {
    setIsRefreshing(true);
    try {
      const res = await api.getAuditLogs();
      if (res.auditLogs) {
        setServerLogs(res.auditLogs);
      }
    } catch (err) {
      console.warn('Could not fetch server audit logs:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchServerLogs();
  }, []);

  // Merge server and store logs
  const combinedLogs = [...serverLogs];
  storeLogs.forEach((sl) => {
    if (!combinedLogs.some((cl) => cl.id === sl.id)) {
      combinedLogs.push({
        ...sl,
        module: 'ESG Data Management',
        userId: sl.user,
        role: 'MANAGEMENT_ADMIN',
      });
    }
  });

  const filteredLogs = combinedLogs.filter((log) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (log.action && log.action.toLowerCase().includes(q)) ||
      (log.userId && log.userId.toLowerCase().includes(q)) ||
      (log.user && log.user.toLowerCase().includes(q)) ||
      (log.entity && log.entity.toLowerCase().includes(q)) ||
      (log.module && log.module.toLowerCase().includes(q)) ||
      (log.details && log.details.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-emerald-800 text-white flex items-center justify-center">
              <History size={16} />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Audit Trail &amp; Management Activity Log</h1>
            <span className="text-xs font-mono font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
              Immutable Server Ledger
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete traceability of all Management modifications, authentication events, metric updates, and BRSR generation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchServerLogs}
            disabled={isRefreshing}
            className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Refresh Audit Ledger"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Logged Events</span>
            <span className="text-lg font-mono font-bold text-slate-800">{combinedLogs.length} Entries</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs flex items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search action, officer, entity, module or change notes..."
            className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
          />
        </div>

        <span className="text-slate-400 font-mono text-[11px]">
          Showing {filteredLogs.length} events
        </span>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/70">
                <th className="py-3 px-3">Action Performed</th>
                <th className="py-3 px-3">Management User ID</th>
                <th className="py-3 px-3">Module / Scope</th>
                <th className="py-3 px-3">Entity Boundary</th>
                <th className="py-3 px-3">Audit Details &amp; Change Notes</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Time</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-800">{log.action}</td>
                  <td className="py-3 px-3 font-mono text-slate-700">
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px] font-semibold text-slate-800">
                      {log.userId || log.user || 'MEIL-MGMT-ADM01'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{log.module || 'ESG Performance'}</td>
                  <td className="py-3 px-3 text-slate-700 font-medium">{log.entity || 'MEIL Group'}</td>
                  <td className="py-3 px-3 text-slate-500 max-w-sm truncate" title={log.details || ''}>
                    {log.details || '--'}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                    {log.date}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                    {log.time}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-[11px] font-medium text-emerald-700 inline-flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      <span>{log.status || 'Completed'}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
