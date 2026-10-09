/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-6 px-6 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">MEIL ESG &amp; BRSR REPORTING PORTAL</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-600 font-medium">Megha Engineering &amp; Infrastructures Limited (MEIL)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            ESG Data Management • Reporting • Analytics
          </p>
        </div>

        <div className="max-w-xl text-[11px] leading-relaxed text-slate-400 md:text-right">
          Disclaimer: This portal is a reporting and analytics workspace. BRSR-ready outputs
          should be reviewed and validated against applicable reporting requirements before
          formal submission.
        </div>
      </div>
    </footer>
  );
};
