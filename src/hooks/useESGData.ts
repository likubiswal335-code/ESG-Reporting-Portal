/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useSyncExternalStore } from 'react';
import { esgStore } from '../data/esgStore';
import { ReportingPeriod } from '../types/esg';

export function useESGData(period: ReportingPeriod = 'FY 2025–26', entityId: string = 'meil-group') {
  const subscribe = (listener: () => void) => esgStore.subscribe(listener);

  // Subscribe to store updates
  const [, setTick] = useState(0);
  useEffect(() => {
    return esgStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  const entities = esgStore.getEntities();
  const metrics = esgStore.getMetrics(period, entityId);
  const allMetrics = esgStore.getMetrics(period);
  const issues = esgStore.getIssues(period);
  const documents = esgStore.getDocuments(period);
  const projects = esgStore.getProjects(period);
  const auditLogs = esgStore.getAuditLogs();
  const stats = esgStore.getCompletenessStats(period, entityId);

  return {
    entities,
    metrics,
    allMetrics,
    issues,
    documents,
    projects,
    auditLogs,
    stats,
    store: esgStore,
  };
}
