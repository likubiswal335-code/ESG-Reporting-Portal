/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EntityType =
  | 'Group'
  | 'Parent Company'
  | 'Subsidiary / Group Company'
  | 'Business Unit / Operational Vertical'
  | 'Manufacturing / Operational Unit'
  | 'Project / Site';

export type OrganizationLevel = 'group' | 'parent' | 'subsidiary' | 'business_unit' | 'project';

export type ESGPillar = 'environmental' | 'social' | 'governance';

export type ReportingPeriod = 'FY 2025–26' | 'FY 2024–25' | 'FY 2023–24' | string;

export type ApprovalStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER REVIEW'
  | 'CHANGES REQUESTED'
  | 'APPROVED'
  | 'LOCKED';

export type VerificationStatus = 'unverified' | 'needs_review' | 'verified' | 'audited';

export type MetricStatus = 'reported' | 'in_progress' | 'unreported';

export type IssuePriority = 'HIGH' | 'MEDIUM' | 'LOW';

export type IssueStatus = 'open' | 'under_review' | 'resolved';

export type ProjectStatus = 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'ON HOLD' | 'CLOSED';

export type UserRole =
  | 'SYSTEM ADMIN'
  | 'GROUP ESG ADMIN'
  | 'SUBSIDIARY ESG MANAGER'
  | 'BUSINESS UNIT ESG MANAGER'
  | 'PROJECT ESG MANAGER'
  | 'REVIEWER'
  | 'VIEWER';

export interface OrgEntity {
  id: string;
  name: string;
  type?: EntityType;
  level: OrganizationLevel;
  parentId?: string;
  code?: string;
  description?: string;
  location?: string;
  state?: string;
  country?: string;
  responsibleManager?: string;
  esgOwner?: string;
  reportingBoundary?: string;
  financialYear?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  headquarters?: string;
  lead?: string;
  sector?: string;
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
}

export interface ProjectESGRecord {
  id: string;
  projectId?: string;
  name: string;
  projectType?: string;
  parentCompanyId?: string;
  parentCompanyName?: string;
  businessUnitId: string;
  businessUnitName: string;
  location: string;
  state?: string;
  country?: string;
  startDate?: string;
  expectedCompletion?: string;
  projectManager?: string;
  esgManager?: string;
  reportingBoundary?: string;
  financialYear?: string;
  period: ReportingPeriod;
  completeness: number; // 0-100
  status: 'Reported' | 'In Progress' | 'Awaiting Data' | ProjectStatus;
  projectStatus?: ProjectStatus;
  lastUpdated: string;
  environmentalScore?: number;
  socialScore?: number;
  governanceScore?: number;
  documentsCount: number;
}

export interface ESGMetricEntry {
  id: string;
  recordId?: string;
  metricName: string;
  category: string; // Energy, Emissions, Water, Waste, Workforce, Safety, Ethics, etc.
  pillar: ESGPillar;
  value: number | null;
  reportedValue?: number | null;
  unit: string;
  previousYearValue?: number | null;
  reportingPeriod: ReportingPeriod;
  financialYear?: string;
  entityId: string;
  entityName: string;
  parentEntityId?: string;
  entityLevel: OrganizationLevel;
  entityType?: EntityType;
  source: string;
  dataSource?: string;
  status: 'reported' | 'in_progress' | 'unreported';
  approvalStatus?: ApprovalStatus;
  verificationStatus: VerificationStatus;
  evidenceDocument?: string;
  responsiblePerson?: string;
  submittedBy?: string;
  reviewedBy?: string;
  remarks?: string;
  comments?: string;
  supportingDocName?: string;
  isDemoData?: boolean;
  lastUpdated: string;
  updatedBy: string;
  createdDate?: string;
}

export interface DataQualityIssue {
  id: string;
  metricName: string;
  entityName: string;
  reportingPeriod: ReportingPeriod;
  issueType: 'missing' | 'incomplete' | 'unverified';
  priority: IssuePriority;
  owner: string;
  status: IssueStatus;
  description: string;
  createdAt: string;
}

export interface DocumentEntry {
  id: string;
  name: string;
  category:
    | 'Policy'
    | 'Certificate'
    | 'Audit'
    | 'Report'
    | 'Invoice'
    | 'Environmental Evidence'
    | 'Safety Evidence'
    | 'Governance Evidence'
    | 'Other';
  reportingPeriod: ReportingPeriod;
  entityName: string;
  entityId?: string;
  relatedMetricId?: string;
  relatedMetricName?: string;
  pillar: ESGPillar;
  uploadDate: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  fileSize: string;
  fileFormat: string;
  uploadedBy?: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  user: string;
  userId?: string;
  role?: string;
  module?: string;
  entity: string;
  recordId?: string;
  previousValue?: any;
  newValue?: any;
  date: string;
  time: string;
  timestamp?: string;
  status: 'Completed' | 'Pending Review' | 'Flagged';
  details?: string;
  reason?: string;
}

export interface BRSRSection {
  id: string;
  title: string;
  description: string;
  readinessPercentage: number;
  indicatorsCount: number;
  completedIndicators: number;
  principlesCovered?: string[];
}

export interface ConsolidationLineage {
  metricId: string;
  metricName: string;
  category: string;
  pillar: ESGPillar;
  unit: string;
  financialYear: string;
  consolidatedValue: number;
  contributingApprovedRecordsCount: number;
  breakdown: {
    companyId: string;
    companyName: string;
    value: number;
    businessUnits: {
      buId: string;
      buName: string;
      value: number;
      projects: {
        projectId: string;
        projectName: string;
        value: number;
        recordId: string;
        approvalStatus: ApprovalStatus;
        evidence?: string;
      }[];
    }[];
  }[];
}
