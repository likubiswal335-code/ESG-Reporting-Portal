/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Sparkles, Send, HelpCircle, AlertTriangle, ShieldCheck, Database } from 'lucide-react';
import { ESGMetricEntry, ReportingPeriod, OrgEntity } from '../../types/esg';

interface EsgAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: ESGMetricEntry[];
  entities: OrgEntity[];
  currentPeriod: ReportingPeriod;
  completeness: {
    overall: number | null;
    environmental: number | null;
    social: number | null;
    governance: number | null;
    readiness: number | null;
    totalMetrics: number;
    reportedCount: number;
    verifiedCount: number;
  };
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  type?: 'explanation' | 'gap_analysis' | 'summary' | 'warning';
  timestamp: string;
}

export const EsgAssistantDrawer: React.FC<EsgAssistantDrawerProps> = ({
  isOpen,
  onClose,
  metrics,
  entities,
  currentPeriod,
  completeness,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Welcome to the MEIL ESG Assistant. I provide context-grounded analysis of your entered ESG records, explain BRSR principles, and identify data gaps. I only reference data entered in the current workspace and never invent MEIL figures.`,
      type: 'explanation',
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (userQuery: string) => {
    if (!userQuery.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userQuery,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      const q = userQuery.toLowerCase();
      let responseText = '';
      let msgType: ChatMessage['type'] = 'explanation';

      if (q.includes('missing') || q.includes('gap')) {
        const missingList = metrics.filter((m) => m.value === null || m.status === 'unreported');
        const unverifiedList = metrics.filter((m) => m.verificationStatus === 'needs_review');

        if (missingList.length === 0 && unverifiedList.length === 0) {
          responseText = `Gaps Analysis for ${currentPeriod}:\nNo missing or unverified metrics detected in the active workspace.`;
        } else {
          msgType = 'gap_analysis';
          responseText = `Data Gaps Identified for ${currentPeriod} (${completeness.overall}% complete):\n\n` +
            `• Unreported / Awaiting Data:\n` +
            missingList.map((m) => `  - ${m.metricName} [${m.pillar.toUpperCase()}] (${m.entityName})`).join('\n') +
            `\n\n• Requires Auditor Review:\n` +
            unverifiedList.map((m) => `  - ${m.metricName} [${m.pillar.toUpperCase()}] (Status: ${m.verificationStatus})`).join('\n') +
            `\n\nRecommendation: Upload supporting supplier manifests and auditor assurance reports to bridge readiness to 100%.`;
        }
      } else if (q.includes('summary') || q.includes('status') || q.includes('overview')) {
        msgType = 'summary';
        const energyMetric = metrics.find((m) => m.category === 'Energy' && m.value !== null);
        const emissionsMetric = metrics.find((m) => m.category === 'Emissions' && m.value !== null);
        const ltifrMetric = metrics.find((m) => m.metricName.includes('LTIFR') && m.value !== null);

        responseText = `MEIL Group Consolidated ESG Summary [${currentPeriod}]:\n\n` +
          `[Calculated Values]\n` +
          `• Overall Data Completeness: ${completeness.overall !== null ? `${completeness.overall}%` : 'Data insufficient'}\n` +
          `• BRSR Reporting Readiness: ${completeness.readiness !== null ? `${completeness.readiness}%` : 'Data insufficient'}\n` +
          `• Pillar Progress: ENV ${completeness.environmental ?? '--'}% | SOC ${completeness.social ?? '--'}% | GOV ${completeness.governance ?? '--'}%\n\n` +
          `[Entered Workspace Data]\n` +
          `• Energy: ${energyMetric ? `${energyMetric.value?.toLocaleString()} ${energyMetric.unit}` : 'Data is not available in the current workspace.'}\n` +
          `• Direct Scope 1: ${emissionsMetric ? `${emissionsMetric.value?.toLocaleString()} ${emissionsMetric.unit}` : 'Data is not available in the current workspace.'}\n` +
          `• Safety LTIFR: ${ltifrMetric ? `${ltifrMetric.value} (${ltifrMetric.unit})` : 'Data is not available in the current workspace.'}\n` +
          `• Active Entities: ${entities.length} (MEIL Group, Subsidiaries, BUs, Projects)`;
      } else if (q.includes('brsr') || q.includes('principle') || q.includes('sebi')) {
        responseText = `BRSR Reporting Architecture Guidelines:\n\n` +
          `The Business Responsibility and Sustainability Report (BRSR) consists of:\n` +
          `1. Section A: General Disclosures (Listed entity details, products/services, operations, employees, holding/subsidiaries/JVs, CSR details).\n` +
          `2. Section B: Management and Process Disclosures (Policies on NGRBC 9 principles, governance oversight, stakeholder review).\n` +
          `3. Section C: Principle-wise Performance Indicators (Essential indicators mandatory, leadership indicators voluntary).\n\n` +
          `Note: All outputs generated in this portal are BRSR-ready and aligned with MCA/SEBI reporting parameters. Final reports should be vetted by company secretarial teams prior to submission.`;
      } else if (q.includes('scope 3') || q.includes('emissions')) {
        const s3 = metrics.find((m) => m.metricName.includes('Scope 3'));
        responseText = `Scope 3 GHG Emissions Parameter:\n` +
          `• Current Workspace Status: ${s3?.value !== null ? `${s3?.value} ${s3?.unit}` : 'Data is not available in the current workspace (marked in-progress).'}\n` +
          `• Requirement: Under BRSR Essential Indicator 6 (Environment), companies quantify upstream transport, capital goods, and major input materials (structural steel, cement).\n` +
          `• Action: Request Tier 1 EPC supplier carbon footprint certificates via the Data Quality module.`;
      } else {
        responseText = `Query received regarding "${userQuery}".\n\n` +
          `Workspace Analysis:\n` +
          `Total metrics tracked: ${metrics.length} (${completeness.reportedCount} reported, ${completeness.verifiedCount} verified).\n\n` +
          `If you need metric-specific verification details or gap remediation steps, please specify the pillar or parameter (e.g. "Identify missing data", "Summarize entered data", or "Explain BRSR principles"). Data is not available in the current workspace for unrecorded metrics.`;
      }

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        type: msgType,
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsThinking(false);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-[#0a291f] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-emerald-800 flex items-center justify-center text-emerald-200">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">MEIL ESG Assistant</h2>
              <p className="text-[11px] text-emerald-300/80">
                Ground-Truth Reporting &amp; BRSR Guidance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-emerald-900/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Workspace Context Badge */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
          <span>
            Active Boundary: <strong className="text-slate-800">MEIL Group · {currentPeriod}</strong>
          </span>
          <span className="font-mono text-emerald-800 font-semibold">
            {completeness.overall !== null ? `${completeness.overall}% Ready` : 'Awaiting Data'}
          </span>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] p-3 rounded-lg leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-emerald-900 text-white font-medium'
                    : 'bg-slate-100 text-slate-800 border border-slate-200/80'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic p-2">
              <Sparkles size={14} className="animate-spin text-emerald-700" />
              <span>Analyzing entered workspace data...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="p-2 border-t border-slate-100 bg-slate-50/50 flex flex-wrap gap-1.5 text-[11px]">
          <button
            onClick={() => handleSend('Identify missing data')}
            className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium transition-colors"
          >
            Identify missing data
          </button>
          <button
            onClick={() => handleSend('Summarize entered data')}
            className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium transition-colors"
          >
            Summarize entered data
          </button>
          <button
            onClick={() => handleSend('Explain BRSR principles')}
            className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium transition-colors"
          >
            Explain BRSR principles
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about ESG metrics or data gaps..."
              className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 text-white rounded-md transition-colors"
              title="Send question"
            >
              <Send size={14} />
            </button>
          </form>
          <p className="text-[10px] text-slate-400 mt-1.5 text-center">
            Adheres to MEIL data boundary: never hallucinates unrecorded numbers.
          </p>
        </div>
      </div>
    </div>
  );
};
