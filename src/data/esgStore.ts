/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  OrgEntity,
  ESGMetricEntry,
  DataQualityIssue,
  DocumentEntry,
  ProjectESGRecord,
  AuditLogEntry,
  ReportingPeriod,
} from '../types/esg';
import { api } from '../services/api';

const STORAGE_KEYS = {
  ENTITIES: 'meil_esg_entities_v1',
  METRICS: 'meil_esg_metrics_v1',
  DOCUMENTS: 'meil_esg_documents_v1',
  ISSUES: 'meil_esg_issues_v1',
  PROJECTS: 'meil_esg_projects_v1',
  AUDIT_LOGS: 'meil_esg_audit_logs_v1',
};

// Initial Realistic Entities for Megha Engineering & Infrastructures Limited (MEIL)
const INITIAL_ENTITIES: OrgEntity[] = [
  {
    id: 'meil-group',
    name: 'MEIL Group',
    level: 'group',
    headquarters: 'Hyderabad, Telangana, India',
    lead: 'Executive ESG Committee',
    sector: 'Infrastructure & Engineering Conglomerate',
    description: 'Megha Engineering & Infrastructures Limited consolidated parent organization.',
  },
  {
    id: 'sub-olectra',
    name: 'Olectra Greentech Limited',
    level: 'subsidiary',
    parentId: 'meil-group',
    code: 'MEIL-SUB-01',
    headquarters: 'Hyderabad, Telangana',
    lead: 'Chief Sustainability Officer',
    sector: 'Electric Mobility & Polymer Insulators',
    description: 'Pioneering electric bus manufacturing and clean transport solutions.',
  },
  {
    id: 'sub-hydro',
    name: 'MEIL Hydro Private Limited',
    level: 'subsidiary',
    parentId: 'meil-group',
    code: 'MEIL-SUB-02',
    headquarters: 'Hyderabad, Telangana',
    lead: 'Head of Hydro Projects',
    sector: 'Hydroelectric & Water Resources',
    description: 'Hydro-electric power generation and mega pumping systems.',
  },
  {
    id: 'sub-energy',
    name: 'MEIL Energy & Power',
    level: 'subsidiary',
    parentId: 'meil-group',
    code: 'MEIL-SUB-03',
    headquarters: 'Hyderabad, Telangana',
    lead: 'Director of Renewable Operations',
    sector: 'Solar, Wind & Clean Energy',
    description: 'Renewable and thermal energy development projects.',
  },
  {
    id: 'bu-irrigation',
    name: 'Water & Lift Irrigation Division',
    level: 'business_unit',
    parentId: 'sub-hydro',
    code: 'BU-HYD-WTR',
    headquarters: 'Telangana & Andhra Pradesh',
    lead: 'Vice President, Water Resources',
    sector: 'Lift Irrigation & Water Supply',
    description: 'Mega lift irrigation schemes, pumping stations, and bulk water transmission lines.',
  },
  {
    id: 'bu-transport',
    name: 'Highways & Underground Tunnelling',
    level: 'business_unit',
    parentId: 'meil-group',
    code: 'BU-GRP-INFRA',
    headquarters: 'New Delhi & Jammu & Kashmir',
    lead: 'Chief Project Officer',
    sector: 'Transport Infrastructure',
    description: 'High-altitude strategic tunnels, expressways, and elevated corridors.',
  },
  {
    id: 'bu-hydrocarbon',
    name: 'Hydrocarbon & Industrial EPC',
    level: 'business_unit',
    parentId: 'meil-group',
    code: 'BU-GRP-HC',
    headquarters: 'Gujarat & Assam',
    lead: 'General Manager, Oil & Gas EPC',
    sector: 'Hydrocarbons',
    description: 'Drilling rigs, refinery modernization, and natural gas pipeline grids.',
  },
  {
    id: 'bu-ev-mobility',
    name: 'Clean Mobility Systems',
    level: 'business_unit',
    parentId: 'sub-olectra',
    code: 'BU-OLE-EV',
    headquarters: 'Dindigul, Hyderabad',
    lead: 'Head of EV Operations',
    sector: 'Clean Transportation',
    description: 'Zero-emission electric buses and green transit fleet infrastructure.',
  },
  {
    id: 'proj-zojila',
    name: 'Zojila Pass All-Weather Tunnel Project',
    level: 'project',
    parentId: 'bu-transport',
    code: 'PRJ-ZOJ-01',
    headquarters: 'Baltal - Minamarg, UT of Ladakh & J&K',
    lead: 'Project Director',
    sector: 'Strategic Tunnelling',
    description: '14.15 km strategic tunnel cutting travel time between Srinagar and Leh.',
  },
  {
    id: 'proj-polavaram',
    name: 'Polavaram Major Irrigation Project Complex',
    level: 'project',
    parentId: 'bu-irrigation',
    code: 'PRJ-POL-02',
    headquarters: 'Godavari Basin, Andhra Pradesh',
    lead: 'Chief Engineer (MEIL Site)',
    sector: 'Irrigation & Spillway',
    description: 'National irrigation project featuring 48 spillway radial gates and lift tunnels.',
  },
  {
    id: 'proj-kaleshwaram',
    name: 'Kaleshwaram Lift Irrigation Pumping Package',
    level: 'project',
    parentId: 'bu-irrigation',
    code: 'PRJ-KAL-03',
    headquarters: 'Telangana',
    lead: 'Executive Engineer',
    sector: 'Underground Pump House',
    description: 'Worlds largest multi-stage lift irrigation system with massive submersible pumps.',
  },
  {
    id: 'proj-ev-bus',
    name: 'Electric Bus Fleet Delivery Program',
    level: 'project',
    parentId: 'bu-ev-mobility',
    code: 'PRJ-EV-04',
    headquarters: 'Hyderabad Manufacturing Hub',
    lead: 'Plant Operations Head',
    sector: 'EV Manufacturing',
    description: 'Mass deployment of zero-emission electric public transport buses.',
  },
];

// Initial Verified & Realistic ESG Metric Entries for MEIL
const INITIAL_METRICS: ESGMetricEntry[] = [
  // Environmental: Energy
  {
    id: 'm-01',
    metricName: 'Total Energy Consumption',
    category: 'Energy',
    pillar: 'environmental',
    value: 482500,
    unit: 'GJ',
    reportingPeriod: 'FY 2025–26',
    entityId: 'meil-group',
    entityName: 'MEIL Group',
    entityLevel: 'group',
    source: 'Consolidated Utility Bills & Fuel Logs',
    status: 'reported',
    verificationStatus: 'verified',
    remarks: 'Includes direct diesel fuel on heavy machinery and purchased electricity.',
    supportingDocName: 'MEIL_Energy_Audit_Summary_FY2526.pdf',
    lastUpdated: '2026-09-15',
    updatedBy: 'S. K. Rao (ESG Lead)',
  },
  {
    id: 'm-02',
    metricName: 'Renewable Electricity Generated / Consumed',
    category: 'Energy',
    pillar: 'environmental',
    value: 124300,
    unit: 'GJ',
    reportingPeriod: 'FY 2025–26',
    entityId: 'meil-group',
    entityName: 'MEIL Group',
    entityLevel: 'group',
    source: 'Solar Power Inverter Meter Readings',
    status: 'reported',
    verificationStatus: 'verified',
    remarks: 'From captive rooftop solar at Olectra plant and onsite solar arrays at regional yards.',
    supportingDocName: 'Captive_Solar_Generation_Certificates.pdf',
    lastUpdated: '2026-09-12',
    updatedBy: 'R. Sharma (Energy Officer)',
  },
  {
    id: 'm-03',
    metricName: 'Energy Intensity per Operating Turnover',
    category: 'Energy',
    pillar: 'environmental',
    value: 18.4,
    unit: 'GJ / ₹ Cr Revenue',
    reportingPeriod: 'FY 2025–26',
    entityId: 'meil-group',
    entityName: 'MEIL Group',
    entityLevel: 'group',
    source: 'Corporate Finance & Sustainability Office',
    status: 'reported',
    verificationStatus: 'verified',
    remarks: 'Consistent reduction achieved through electrification of tunnel muck hauling equipment.',
    lastUpdated: '2026-09-14',
    updatedBy: 'S. K. Rao (ESG Lead)',
  },
  // Environmental: Emissions
  {
    id: 'm-04',
    metricName: 'Scope 1 Direct GHG Emissions',
    category: 'Emissions',
    pillar: 'environmental',
    value: 32410,
    unit: 'tCO2e',
    reportingPeriod: 'FY 2025–26',
    entityId: 'meil-group',
    entityName: 'MEIL Group',
    entityLevel: 'group',
    source: 'DEFRA emission factors applied to fuel consumption logs',
    status: 'reported',
    verificationStatus: 'verified',
    remarks: 'Stationary diesel generators and heavy earthmoving machinery fleet.',
    supportingDocName: 'Scope1_GHG_Inventory_Assessment.pdf',
    lastUpdated: '2026-09-10',
    updatedBy: 'K. V. Reddy (Environment Manager)',
  },
  {
    id: 'm-05',
    metricName: 'Scope 2 Indirect GHG Emissions (Location-based)',
    category: 'Emissions',
    pillar: 'environmental',
    value: 24890,
    unit: 'tCO2e',
    reportingPeriod: 'FY 2025–26',
    entityId: 'meil-group',
    entityName: 'MEIL Group',
    entityLevel: 'group',
    source: 'CEA CO2 Baseline Database Ver 19.0',
    status: 'reported',
    verificationStatus: 'verified',
    remarks: 'Purchased grid electricity across all operational sites and offices.',
    supportingDocName: 'CEA_Grid_Emission_Factor_Calculations.pdf',
    lastUpdated: '2026-09-08',
    updatedBy: 'K. V. Reddy (Environment Manager)',
  },
  {
    id: 'm-06',
    metricName: 'Scope 3 Supply Chain & Transport Emissions',
    category: 'Emissions',
    pillar: 'environmental',
    value: null, // deliberately awaiting data for data quality demo
    unit: 'tCO2e',
    reportingPeriod: 'FY 2025–26',
    entityId: 'meil-group',
    entityName: 'MEIL Group',
    entityLevel: 'group',
    source: 'Tier 1 Steel and Cement supplier submissions',
    status: 'in_progress',
    verificationStatus: 'needs_review',
    remarks: 'Vendor emissions questionnaires currently being compiled across major steel/cement suppliers.',
    lastUpdated: '2026-09-01',
    updatedBy: 'P. Nair (Procurement ESG)',
  },
  // Environmental: Water
  {
    id: 'm-07',
    metricName: 'Total Water Withdrawal',
    category: 'Water',
    pillar: 'environmental',
    value: 628400,
    unit: 'kL',
    reportingPeriod: 'FY 2025–26',
    entityId: 'meil-group',
    entityName: 'MEIL Group',
    entityLevel: 'group',
    source: 'Site Flowmeters & Municipal Water Invoices',
    status: 'reported',
    verificationStatus: 'verified',
    remarks: 'Concrete batching, dust suppression, camp facilities, and testing operations.',
    supportingDocName: 'Water_Abstraction_Permits_Consolidated.pdf',
    lastUpdated: '2026-09-11',
    updatedBy: 'A. Joshi (Hydrology Head)',
  },
  {
    id: 'm-08',
    metricName: 'Water Recycled and Reused on Site',
    category: 'Water',
    pillar: 'environmental',
    value: 188520,
    unit: 'kL',
    reportingPeriod: 'FY 2025–26',
    entityId: 'meil-group',
    entityName: 'MEIL Group',
    entityLevel: 'group',
    source: 'Effluent Treatment Plant (ETP) & Settling Pond Logs',
    status: 'reported',
    verificationStatus: 'verified',
    remarks: '30% recycling rate achieved for batching washouts and tunnel drainage water treatment.',
    lastUpdated: '2026-09-11',
    updatedBy: 'A. Joshi (Hydrology Head)',
  },
  // Environmental: Waste
  {
    id: 'm-09',
    metricName: 'Non-Hazardous Construction Waste Generated',
    category: 'Waste',
    pillar: 'environmental',
    value: 48920,
    unit: 'Metric Tonnes',
    reportingPeriod: 'FY 2025–26',
    entityId: 'meil-group',
    entityName: 'MEIL Group',
    entityLevel: 'group',
    source: 'Weighbridge Slips & Site Waste Registers',
    status: 'reported',
    verificationStatus: 'verified',
    remarks: 'Includes excavated muck utilized for embankment filling and road base.',
    supportingDocName: 'Muck_Utilization_Compliance_Report.pdf',
    lastUpdated: '2026-09-05',
    updatedBy: 'M. Saxena (Waste Officer)',
  },
  {
    id: 'm-10',
    metricName: 'Hazardous Waste Safely Disposed via SPCB Authorized Recyclers',
    category: 'Waste',
    pillar: 'environmental',
    value: 412,
    unit: 'Metric Tonnes',
    reportingPeriod: 'FY 2025–26',
    entityId: 'meil-group',
    entityName: 'MEIL Group',
    entityLevel: 'group',
    source: 'SPCB Manifest Form 10 filings',
    status: 'reported',
    verificationStatus: 'verified',
    remarks: 'Spent lubrication oils, used lead batteries, and contaminated rags.',
    supportingDocName: 'SPCB_Form10_Hazardous_Waste_Manifests.pdf',
    lastUpdated: '2026-09-04',
    updatedBy: 'M. Saxena (Waste Officer)',
  },
  // Social: Workforce
  {
    id: 'm-11',
    metricName: 'Total Workforce (Employees and Workers)',
    category: 'Workforce',
    pillar: 'social',
    value: 28450,
    unit: 'Persons',
    reportingPeriod: 'FY 2025–26',
    entityId: 'meil-group',
    entityName: 'MEIL Group',
    entityLevel: 'group',
    source: 'HR Central ERP (SAP SuccessFactors)',
    status: 'reported',
    verificationStatus: 'verified',
    remarks: 'Includes permanent engineering staff, technicians, and contracted skilled project labor.',
    supportingDocName: 'HR_Headcount_Audit_FY26.pdf',
    lastUpdated: '2026-09-18',
    updatedBy: 'B. Narayan (VP Human Resources)',
  },
  {
    id: 'm-12',
    metricName: 'Permanent Employees Count',
    category: 'Workforce',
    pillar: 'social',
    value: 8640,
    unit: 'Persons',
    reportingPeriod: 'FY 2025–26',
    entityId: 'meil-group',
    entityName: 'MEIL Group',
    entityLevel: 'group',
    source: 'HR Central ERP',
    status: 'reported',
    verificationStatus: 'verified',
    remarks: 'Corporate, design center, site management, and specialized technical teams.',
    lastUpdated: '2026-09-18',
    updatedBy: 'B. Narayan (VP Human Resources)',
  },
  // Social: Health & Safety
  {
    id: 'm-13',
    metricName: 'Lost Time Injury Frequency Rate (LTIFR)',
    category: 'Health & Safety',
    pillar: 'social',
    value: 0.18,
    unit: 'Per 1,000,000 Person-Hours',
    reportingPeriod: 'FY 2025–26',
    entityId: 'meil-group',
    entityName: 'MEIL Group',
    entityLevel: 'group',
    source: 'Corporate HSE Incident Management System',
    status: 'reported',
    verificationStatus: 'verified',
    remarks: 'Zero reportable fatalities across all active tunnel and lift irrigation packages.',
    supportingDocName: 'Corporate_HSE_Performance_Audit_Q2.pdf',
    lastUpdated: '2026-09-17',
    updatedBy: 'Col. R. Menon (Chief HSE Officer)',
  },
  {
    id: 'm-14',
    metricName: 'Total Safety Training Delivered',
    category: 'Health & Safety',
    pillar: 'social',
    value: 142800,
    unit: 'Person-Hours',
    reportingPeriod: 'FY 2025–26',
    entityId: 'meil-group',
    entityName: 'MEIL Group',
    entityLevel: 'group',
    source: 'Site Safety Induction & Tool-box Talk Registers',
    status: 'reported',
    verificationStatus: 'verified',
    remarks: 'Mandatory defensive driving, confined space entry, and working at heights certifications.',
    lastUpdated: '2026-09-17',
    updatedBy: 'Col. R. Menon (Chief HSE Officer)',
  },
  // Social: Training & Skill Development
  {
    id: 'm-15',
    metricName: 'Average Training Hours per Employee',
    category: 'Training',
    pillar: 'social',
    value: 28.5,
    unit: 'Hours / Person / Year',
    reportingPeriod: 'FY 2025–26',
    entityId: 'meil-group',
    entityName: 'MEIL Group',
    entityLevel: 'group',
    source: 'MEIL Learning Academy Portal',
    status: 'reported',
    verificationStatus: 'verified',
    remarks: 'Technical CAD/BIM courses, project management, and compliance programs.',
    lastUpdated: '2026-09-16',
    updatedBy: 'T. Krishnan (Learning & Development)',
  },
  // Social: Community & CSR
  {
    id: 'm-16',
    metricName: 'Corporate Social Responsibility (CSR) Investment',
    category: 'Community / CSR',
    pillar: 'social',
    value: 46.8,
    unit: '₹ Crores',
    reportingPeriod: 'FY 2025–26',
    entityId: 'meil-group',
    entityName: 'MEIL Group',
    entityLevel: 'group',
    source: 'MEIL Foundation Audited Financial Statements',
    status: 'reported',
    verificationStatus: 'verified',
    remarks: 'Focus on drinking water purification plants, rural healthcare, and local youth skill institutes.',
    supportingDocName: 'MEIL_Foundation_CSR_Report_2026.pdf',
    lastUpdated: '2026-09-14',
    updatedBy: 'G. V. Subbarao (CSR Director)',
  },
  // Governance: Corporate Governance
  {
    id: 'm-17',
    metricName: 'Board Independent Directors Ratio',
    category: 'Corporate Governance',
    pillar: 'governance',
    value: 50.0,
    unit: '%',
    reportingPeriod: 'FY 2025–26',
    entityId: 'meil-group',
    entityName: 'MEIL Group',
    entityLevel: 'group',
    source: 'Company Secretarial Filings & MCA MCA21 Disclosures',
    status: 'reported',
    verificationStatus: 'verified',
    remarks: 'Balanced board structure compliant with Companies Act and SEBI LODR norms.',
    supportingDocName: 'Board_Composition_and_Charter_2026.pdf',
    lastUpdated: '2026-09-02',
    updatedBy: 'Adv. S. K. Verma (Company Secretary)',
  },
  // Governance: Ethics & Compliance
  {
    id: 'm-18',
    metricName: 'Employees Covered by Anti-Bribery & Code of Conduct Certification',
    category: 'Ethics & Compliance',
    pillar: 'governance',
    value: 98.4,
    unit: '%',
    reportingPeriod: 'FY 2025–26',
    entityId: 'meil-group',
    entityName: 'MEIL Group',
    entityLevel: 'group',
    source: 'Annual Compliance Attestation Registry',
    status: 'reported',
    verificationStatus: 'verified',
    remarks: 'Mandatory annual sign-off on MEIL Code of Business Conduct and Ethics.',
    supportingDocName: 'Code_of_Business_Conduct_Signoff_Summary.pdf',
    lastUpdated: '2026-09-06',
    updatedBy: 'V. Raman (Chief Compliance Officer)',
  },
  // Governance: Whistleblower
  {
    id: 'm-19',
    metricName: 'Vigil Mechanism / Whistleblower Grievance Resolution Rate',
    category: 'Whistleblower',
    pillar: 'governance',
    value: 100.0,
    unit: '%',
    reportingPeriod: 'FY 2025–26',
    entityId: 'meil-group',
    entityName: 'MEIL Group',
    entityLevel: 'group',
    source: 'Audit Committee Quarterly Minutes',
    status: 'reported',
    verificationStatus: 'verified',
    remarks: 'All 7 received grievances investigated independently and resolved within 30 days.',
    lastUpdated: '2026-09-07',
    updatedBy: 'V. Raman (Chief Compliance Officer)',
  },
  // Governance: Supply Chain ESG
  {
    id: 'm-20',
    metricName: 'Tier 1 Critical Suppliers Screened on ESG & Safety Criteria',
    category: 'Supply Chain',
    pillar: 'governance',
    value: 78.5,
    unit: '%',
    reportingPeriod: 'FY 2025–26',
    entityId: 'meil-group',
    entityName: 'MEIL Group',
    entityLevel: 'group',
    source: 'Vendor Management Portal ESG Onboarding Module',
    status: 'reported',
    verificationStatus: 'needs_review',
    remarks: 'Target is 85% by end of Q4. Ongoing on-site audits for structural steel fabricators.',
    supportingDocName: 'Supplier_ESG_Due_Diligence_Tracker.pdf',
    lastUpdated: '2026-09-12',
    updatedBy: 'P. Nair (Procurement ESG)',
  },

  // Project Level Specific Metrics: Zojila Pass Tunnel
  {
    id: 'm-21',
    metricName: 'Tunnelling Excavation Muck Reutilization',
    category: 'Waste',
    pillar: 'environmental',
    value: 92.4,
    unit: '%',
    reportingPeriod: 'FY 2025–26',
    entityId: 'proj-zojila',
    entityName: 'Zojila Pass All-Weather Tunnel Project',
    entityLevel: 'project',
    source: 'Site Geotechnical Engineering Logs',
    status: 'reported',
    verificationStatus: 'verified',
    remarks: 'Excavated rock crushed and utilized for shotcrete aggregate and sub-base grading.',
    supportingDocName: 'Zojila_Muck_Crushing_Utilization_Audit.pdf',
    lastUpdated: '2026-09-14',
    updatedBy: 'H. C. Sharma (Site Engineer)',
  },
  {
    id: 'm-22',
    metricName: 'Cold-Weather Safety Drill Compliance Rate',
    category: 'Health & Safety',
    pillar: 'social',
    value: 100.0,
    unit: '%',
    reportingPeriod: 'FY 2025–26',
    entityId: 'proj-zojila',
    entityName: 'Zojila Pass All-Weather Tunnel Project',
    entityLevel: 'project',
    source: 'High-Altitude Rescue Team Drill Sheets',
    status: 'reported',
    verificationStatus: 'verified',
    remarks: 'Avalanche response and tunnel ventilation emergency procedures verified monthly.',
    lastUpdated: '2026-09-10',
    updatedBy: 'Col. R. Menon (Chief HSE Officer)',
  },

  // Project Level Specific Metrics: Polavaram Project
  {
    id: 'm-23',
    metricName: 'River Water Quality Index (Downstream Dissolved Oxygen)',
    category: 'Water',
    pillar: 'environmental',
    value: 7.4,
    unit: 'mg/L',
    reportingPeriod: 'FY 2025–26',
    entityId: 'proj-polavaram',
    entityName: 'Polavaram Major Irrigation Project Complex',
    entityLevel: 'project',
    source: 'National Green Tribunal Monitoring Station',
    status: 'reported',
    verificationStatus: 'verified',
    remarks: 'Healthy aquatic conditions maintained through silt filtration curtains.',
    lastUpdated: '2026-09-09',
    updatedBy: 'A. Joshi (Hydrology Head)',
  },

  // Project Level Specific Metrics: Electric Bus Fleet (Olectra)
  {
    id: 'm-24',
    metricName: 'Zero-Emission Electric Bus Fleet Deployed',
    category: 'Energy',
    pillar: 'environmental',
    value: 1650,
    unit: 'Commercial Buses',
    reportingPeriod: 'FY 2025–26',
    entityId: 'proj-ev-bus',
    entityName: 'Electric Bus Fleet Delivery Program',
    entityLevel: 'project',
    source: 'Olectra Dispatch & State Road Transport Delivery Receipts',
    status: 'reported',
    verificationStatus: 'verified',
    remarks: 'Cumulative operational mileage over 180 million kilometers, displacing fossil diesel.',
    supportingDocName: 'Olectra_Fleet_Dispatch_Certificates.pdf',
    lastUpdated: '2026-09-18',
    updatedBy: 'N. Anand (Operations Lead)',
  },
];

// Initial Real Documents for Evidence & BRSR Verification
const INITIAL_DOCUMENTS: DocumentEntry[] = [
  {
    id: 'doc-01',
    name: 'MEIL_Group_Environmental_Policy_2026.pdf',
    category: 'Policy',
    reportingPeriod: 'FY 2025–26',
    entityName: 'MEIL Group',
    pillar: 'environmental',
    uploadDate: '2026-08-10',
    verificationStatus: 'verified',
    fileSize: '2.4 MB',
    fileFormat: 'PDF',
  },
  {
    id: 'doc-02',
    name: 'ISO_14001_Environmental_Management_Certification.pdf',
    category: 'Certificate',
    reportingPeriod: 'FY 2025–26',
    entityName: 'MEIL Group',
    pillar: 'environmental',
    uploadDate: '2026-07-22',
    verificationStatus: 'verified',
    fileSize: '1.8 MB',
    fileFormat: 'PDF',
  },
  {
    id: 'doc-03',
    name: 'ISO_45001_Occupational_Health_Safety_Audit.pdf',
    category: 'Audit',
    reportingPeriod: 'FY 2025–26',
    entityName: 'MEIL Group',
    pillar: 'social',
    uploadDate: '2026-08-14',
    verificationStatus: 'verified',
    fileSize: '3.6 MB',
    fileFormat: 'PDF',
  },
  {
    id: 'doc-04',
    name: 'MEIL_Foundation_CSR_Annual_Assurance_Report.pdf',
    category: 'Report',
    reportingPeriod: 'FY 2025–26',
    entityName: 'MEIL Group',
    pillar: 'social',
    uploadDate: '2026-09-02',
    verificationStatus: 'verified',
    fileSize: '4.1 MB',
    fileFormat: 'PDF',
  },
  {
    id: 'doc-05',
    name: 'SPCB_Form10_Hazardous_Waste_Manifests.pdf',
    category: 'Environmental Evidence',
    reportingPeriod: 'FY 2025–26',
    entityName: 'MEIL Group',
    pillar: 'environmental',
    uploadDate: '2026-09-04',
    verificationStatus: 'verified',
    fileSize: '1.2 MB',
    fileFormat: 'PDF',
  },
  {
    id: 'doc-06',
    name: 'Corporate_Governance_and_Board_Charter_2026.pdf',
    category: 'Policy',
    reportingPeriod: 'FY 2025–26',
    entityName: 'MEIL Group',
    pillar: 'governance',
    uploadDate: '2026-08-01',
    verificationStatus: 'verified',
    fileSize: '1.5 MB',
    fileFormat: 'PDF',
  },
  {
    id: 'doc-07',
    name: 'Supplier_ESG_Due_Diligence_Tracker.pdf',
    category: 'Governance Evidence',
    reportingPeriod: 'FY 2025–26',
    entityName: 'MEIL Group',
    pillar: 'governance',
    uploadDate: '2026-09-12',
    verificationStatus: 'pending',
    fileSize: '2.8 MB',
    fileFormat: 'PDF',
  },
  {
    id: 'doc-08',
    name: 'Zojila_Muck_Crushing_Utilization_Audit.pdf',
    category: 'Environmental Evidence',
    reportingPeriod: 'FY 2025–26',
    entityName: 'Zojila Pass All-Weather Tunnel Project',
    pillar: 'environmental',
    uploadDate: '2026-09-14',
    verificationStatus: 'verified',
    fileSize: '3.1 MB',
    fileFormat: 'PDF',
  },
];

// Initial Data Quality Issues Generated Dynamically from Incomplete / Unverified Data
const INITIAL_ISSUES: DataQualityIssue[] = [
  {
    id: 'iss-01',
    metricName: 'Scope 3 Supply Chain & Transport Emissions',
    entityName: 'MEIL Group',
    reportingPeriod: 'FY 2025–26',
    issueType: 'missing',
    priority: 'HIGH',
    owner: 'P. Nair (Procurement ESG)',
    status: 'open',
    description: 'Tier 1 structural steel and cement supplier emissions reports are still pending receipt.',
    createdAt: '2026-09-15',
  },
  {
    id: 'iss-02',
    metricName: 'Tier 1 Critical Suppliers Screened on ESG',
    entityName: 'MEIL Group',
    reportingPeriod: 'FY 2025–26',
    issueType: 'unverified',
    priority: 'MEDIUM',
    owner: 'P. Nair (Procurement ESG)',
    status: 'under_review',
    description: 'Auditor third-party sampling certificates required before marking verified.',
    createdAt: '2026-09-16',
  },
  {
    id: 'iss-03',
    metricName: 'Q3 Water Withdrawal Meter Logs',
    entityName: 'Polavaram Major Irrigation Project Complex',
    reportingPeriod: 'FY 2025–26',
    issueType: 'incomplete',
    priority: 'LOW',
    owner: 'A. Joshi (Hydrology Head)',
    status: 'open',
    description: 'Sub-meter calibration certificates for auxiliary pumping unit 4 need attachment.',
    createdAt: '2026-09-18',
  },
];

// Project ESG Records
const INITIAL_PROJECTS: ProjectESGRecord[] = [
  {
    id: 'proj-zojila',
    name: 'Zojila Pass All-Weather Tunnel Project',
    businessUnitId: 'bu-transport',
    businessUnitName: 'Highways & Underground Tunnelling',
    location: 'Ladakh & Jammu & Kashmir, India',
    period: 'FY 2025–26',
    completeness: 88,
    status: 'Reported',
    lastUpdated: '2026-09-14',
    environmentalScore: 92,
    socialScore: 86,
    governanceScore: 85,
    documentsCount: 4,
  },
  {
    id: 'proj-polavaram',
    name: 'Polavaram Major Irrigation Project Complex',
    businessUnitId: 'bu-irrigation',
    businessUnitName: 'Water & Lift Irrigation Division',
    location: 'Godavari Basin, Andhra Pradesh, India',
    period: 'FY 2025–26',
    completeness: 82,
    status: 'Reported',
    lastUpdated: '2026-09-11',
    environmentalScore: 84,
    socialScore: 80,
    governanceScore: 82,
    documentsCount: 5,
  },
  {
    id: 'proj-kaleshwaram',
    name: 'Kaleshwaram Lift Irrigation Pumping Package',
    businessUnitId: 'bu-irrigation',
    businessUnitName: 'Water & Lift Irrigation Division',
    location: 'Telangana, India',
    period: 'FY 2025–26',
    completeness: 75,
    status: 'In Progress',
    lastUpdated: '2026-09-08',
    environmentalScore: 78,
    socialScore: 75,
    governanceScore: 72,
    documentsCount: 3,
  },
  {
    id: 'proj-ev-bus',
    name: 'Electric Bus Fleet Delivery Program',
    businessUnitId: 'bu-ev-mobility',
    businessUnitName: 'Clean Mobility Systems',
    location: 'Hyderabad Plant & Pan-India Fleets',
    period: 'FY 2025–26',
    completeness: 94,
    status: 'Reported',
    lastUpdated: '2026-09-18',
    environmentalScore: 98,
    socialScore: 90,
    governanceScore: 94,
    documentsCount: 6,
  },
];

// Audit Logs
const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-01',
    action: 'ESG Metric Submitted',
    user: 'S. K. Rao (ESG Lead)',
    entity: 'MEIL Group',
    date: '2026-09-15',
    time: '14:32 IST',
    status: 'Completed',
    details: 'Updated Total Energy Consumption (482,500 GJ) with verified utility bills.',
  },
  {
    id: 'log-02',
    action: 'Verification Status Changed',
    user: 'K. V. Reddy (Environment Manager)',
    entity: 'MEIL Group',
    date: '2026-09-10',
    time: '11:15 IST',
    status: 'Completed',
    details: 'Scope 1 direct emissions verified under DEFRA protocol standards.',
  },
  {
    id: 'log-03',
    action: 'Data Quality Issue Flagged',
    user: 'System Automated Quality Audit',
    entity: 'MEIL Group',
    date: '2026-09-15',
    time: '09:00 IST',
    status: 'Completed',
    details: 'Missing Scope 3 supply chain emission data flagged as HIGH priority.',
  },
  {
    id: 'log-04',
    action: 'Document Uploaded',
    user: 'Adv. S. K. Verma (Company Secretary)',
    entity: 'MEIL Group',
    date: '2026-08-01',
    time: '16:45 IST',
    status: 'Completed',
    details: 'Board Charter and Composition Governance 2026 uploaded.',
  },
  {
    id: 'log-05',
    action: 'BRSR Report Draft Generated',
    user: 'Executive ESG Secretariat',
    entity: 'MEIL Group',
    date: '2026-09-18',
    time: '17:20 IST',
    status: 'Completed',
    details: 'Comprehensive BRSR Draft for FY 2025–26 compiled across all 9 Principles.',
  },
];

// Helper to safely read from localStorage
function readFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Failed to read ${key} from storage:`, err);
    return fallback;
  }
}

function writeToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Failed to write ${key} to storage:`, err);
  }
}

// ESG Store Class
export class ESGStore {
  private static instance: ESGStore;
  private listeners: Set<() => void> = new Set();

  private entities: OrgEntity[];
  private metrics: ESGMetricEntry[];
  private documents: DocumentEntry[];
  private issues: DataQualityIssue[];
  private projects: ProjectESGRecord[];
  private auditLogs: AuditLogEntry[];

  private constructor() {
    this.entities = readFromStorage(STORAGE_KEYS.ENTITIES, INITIAL_ENTITIES);
    this.metrics = readFromStorage(STORAGE_KEYS.METRICS, INITIAL_METRICS);
    this.documents = readFromStorage(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
    this.issues = readFromStorage(STORAGE_KEYS.ISSUES, INITIAL_ISSUES);
    this.projects = readFromStorage(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    this.auditLogs = readFromStorage(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }

  public static getInstance(): ESGStore {
    if (!ESGStore.instance) {
      ESGStore.instance = new ESGStore();
    }
    return ESGStore.instance;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }

  // Entities
  public getEntities(): OrgEntity[] {
    return [...this.entities];
  }

  public addEntity(entity: Omit<OrgEntity, 'id'>): OrgEntity {
    const newEntity: OrgEntity = {
      ...entity,
      id: `ent-${Date.now()}`,
    };
    this.entities.push(newEntity);
    writeToStorage(STORAGE_KEYS.ENTITIES, this.entities);
    this.addAuditLog('Added Organizational Entity', 'Admin', newEntity.name, `New ${newEntity.level} added: ${newEntity.name}`);
    this.notify();
    return newEntity;
  }

  // Metrics
  public getMetrics(period?: ReportingPeriod, entityId?: string): ESGMetricEntry[] {
    let result = [...this.metrics];
    if (period) {
      result = result.filter((m) => m.reportingPeriod === period);
    }
    if (entityId && entityId !== 'meil-group') {
      result = result.filter((m) => m.entityId === entityId);
    }
    return result;
  }

  public addMetric(metric: Omit<ESGMetricEntry, 'id' | 'lastUpdated'>): ESGMetricEntry {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const newMetric: ESGMetricEntry = {
      ...metric,
      id: `m-${Date.now()}`,
      lastUpdated: dateStr,
    };
    this.metrics.push(newMetric);
    writeToStorage(STORAGE_KEYS.METRICS, this.metrics);
    this.addAuditLog('Added ESG Metric', metric.updatedBy || 'MEIL-MGMT-ADM01', metric.entityName, `Added metric: ${metric.metricName} (${metric.value} ${metric.unit})`);
    
    // Server-side audit log persistence
    api.logAudit({
      action: `Created ${metric.metricName}`,
      module: `${metric.pillar} / ${metric.category}`,
      entity: metric.entityName,
      recordId: newMetric.id,
      previousValue: null,
      newValue: `${metric.value} ${metric.unit}`,
      details: `${metric.updatedBy || 'MEIL-MGMT-ADM01'} created ${metric.metricName} for ${metric.entityName}.`,
    });

    this.syncIssues();
    this.notify();
    return newMetric;
  }

  public updateMetric(id: string, updates: Partial<ESGMetricEntry>): ESGMetricEntry | null {
    const idx = this.metrics.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    const previous = { ...this.metrics[idx] };
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    this.metrics[idx] = {
      ...this.metrics[idx],
      ...updates,
      lastUpdated: dateStr,
    };
    writeToStorage(STORAGE_KEYS.METRICS, this.metrics);
    this.addAuditLog('Updated ESG Metric', this.metrics[idx].updatedBy || 'MEIL-MGMT-ADM01', this.metrics[idx].entityName, `Updated metric: ${this.metrics[idx].metricName}`);

    // Server-side audit log persistence
    api.logAudit({
      action: `Edited ${this.metrics[idx].metricName}`,
      module: `${this.metrics[idx].pillar} / ${this.metrics[idx].category}`,
      entity: this.metrics[idx].entityName,
      recordId: id,
      previousValue: `${previous.value} ${previous.unit}`,
      newValue: `${this.metrics[idx].value} ${this.metrics[idx].unit}`,
      details: `${this.metrics[idx].updatedBy || 'MEIL-MGMT-ADM01'} edited ${this.metrics[idx].metricName} (${previous.value} -> ${this.metrics[idx].value} ${this.metrics[idx].unit}).`,
    });

    this.syncIssues();
    this.notify();
    return this.metrics[idx];
  }

  public deleteMetric(id: string): boolean {
    const target = this.metrics.find((m) => m.id === id);
    if (!target) return false;
    this.metrics = this.metrics.filter((m) => m.id !== id);
    writeToStorage(STORAGE_KEYS.METRICS, this.metrics);
    this.addAuditLog('Deleted ESG Metric', 'MEIL-MGMT-ADM01', target.entityName, `Removed metric: ${target.metricName}`);

    // Server-side audit log persistence
    api.logAudit({
      action: `Deleted ${target.metricName}`,
      module: `${target.pillar} / ${target.category}`,
      entity: target.entityName,
      recordId: id,
      previousValue: `${target.value} ${target.unit}`,
      newValue: null,
      details: `MEIL-MGMT-ADM01 deleted metric ${target.metricName} from ${target.entityName}.`,
    });

    this.syncIssues();
    this.notify();
    return true;
  }

  // Data Quality & Issues
  public getIssues(period?: ReportingPeriod): DataQualityIssue[] {
    let result = [...this.issues];
    if (period) {
      result = result.filter((i) => i.reportingPeriod === period);
    }
    return result;
  }

  public resolveIssue(id: string): void {
    const idx = this.issues.findIndex((i) => i.id === id);
    if (idx !== -1) {
      this.issues[idx].status = 'resolved';
      writeToStorage(STORAGE_KEYS.ISSUES, this.issues);
      this.addAuditLog('Resolved Quality Issue', 'Data Quality Officer', this.issues[idx].entityName, `Resolved issue: ${this.issues[idx].metricName}`);
      this.notify();
    }
  }

  private syncIssues(): void {
    // Generate fresh issues from current metrics
    const openIssues = this.metrics
      .filter((m) => m.value === null || m.status === 'unreported' || m.verificationStatus === 'needs_review')
      .map((m) => {
        const isMissing = m.value === null || m.status === 'unreported';
        return {
          id: `iss-auto-${m.id}`,
          metricName: m.metricName,
          entityName: m.entityName,
          reportingPeriod: m.reportingPeriod,
          issueType: (isMissing ? 'missing' : 'unverified') as 'missing' | 'incomplete' | 'unverified',
          priority: (isMissing ? 'HIGH' : 'MEDIUM') as 'HIGH' | 'MEDIUM' | 'LOW',
          owner: m.updatedBy || 'ESG Reporting Team',
          status: 'open' as const,
          description: isMissing
            ? `Metric ${m.metricName} is currently unreported or awaiting data.`
            : `Metric ${m.metricName} has unverified status and requires auditor review.`,
          createdAt: m.lastUpdated,
        };
      });

    // Merge keeping manual issues
    const manualIssues = this.issues.filter((i) => !i.id.startsWith('iss-auto-'));
    this.issues = [...manualIssues, ...openIssues];
    writeToStorage(STORAGE_KEYS.ISSUES, this.issues);
  }

  // Documents
  public getDocuments(period?: ReportingPeriod): DocumentEntry[] {
    let result = [...this.documents];
    if (period) {
      result = result.filter((d) => d.reportingPeriod === period);
    }
    return result;
  }

  public addDocument(doc: Omit<DocumentEntry, 'id' | 'uploadDate'>): DocumentEntry {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const newDoc: DocumentEntry = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadDate: dateStr,
    };
    this.documents.push(newDoc);
    writeToStorage(STORAGE_KEYS.DOCUMENTS, this.documents);
    this.addAuditLog('Document Uploaded', 'Document Officer', doc.entityName, `Uploaded ${doc.category}: ${doc.name}`);
    this.notify();
    return newDoc;
  }

  // Projects
  public getProjects(period?: ReportingPeriod): ProjectESGRecord[] {
    let result = [...this.projects];
    if (period) {
      result = result.filter((p) => p.period === period);
    }
    return result;
  }

  public addProject(proj: Omit<ProjectESGRecord, 'id' | 'lastUpdated'>): ProjectESGRecord {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const newProj: ProjectESGRecord = {
      ...proj,
      id: `proj-${Date.now()}`,
      lastUpdated: dateStr,
    };
    this.projects.push(newProj);
    writeToStorage(STORAGE_KEYS.PROJECTS, this.projects);
    // Also create matching OrgEntity
    this.addEntity({
      name: newProj.name,
      level: 'project',
      parentId: newProj.businessUnitId,
      headquarters: newProj.location,
      sector: 'Infrastructure Project',
      description: `Project under ${newProj.businessUnitName}`,
    });
    this.notify();
    return newProj;
  }

  // Audit Logs
  public getAuditLogs(): AuditLogEntry[] {
    return [...this.auditLogs];
  }

  public addAuditLog(action: string, user: string, entity: string, details?: string, status: 'Completed' | 'Pending Review' | 'Flagged' = 'Completed'): void {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} IST`;
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      action,
      user,
      entity,
      date: dateStr,
      time: timeStr,
      status,
      details,
    };
    this.auditLogs.unshift(newLog);
    // keep max 50
    if (this.auditLogs.length > 50) {
      this.auditLogs.pop();
    }
    writeToStorage(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
    this.notify();
  }

  // Dynamic Calculated Completeness & Readiness
  public getCompletenessStats(period: ReportingPeriod, entityId?: string) {
    const metrics = this.getMetrics(period, entityId);
    if (metrics.length === 0) {
      return {
        overall: null,
        environmental: null,
        social: null,
        governance: null,
        readiness: null,
        totalMetrics: 0,
        reportedCount: 0,
        verifiedCount: 0,
      };
    }

    const envMetrics = metrics.filter((m) => m.pillar === 'environmental');
    const socMetrics = metrics.filter((m) => m.pillar === 'social');
    const govMetrics = metrics.filter((m) => m.pillar === 'governance');

    const calcPillar = (list: ESGMetricEntry[]) => {
      if (list.length === 0) return null;
      const valid = list.filter((m) => m.value !== null && m.status === 'reported');
      return Math.round((valid.length / list.length) * 100);
    };

    const envPct = calcPillar(envMetrics);
    const socPct = calcPillar(socMetrics);
    const govPct = calcPillar(govMetrics);

    const validAll = metrics.filter((m) => m.value !== null && m.status === 'reported');
    const overallPct = Math.round((validAll.length / metrics.length) * 100);

    const verifiedAll = metrics.filter((m) => m.verificationStatus === 'verified' && m.value !== null);
    // Readiness is composite of completeness (60%) and verification (40%)
    const verificationPct = Math.round((verifiedAll.length / metrics.length) * 100);
    const readiness = Math.round(overallPct * 0.6 + verificationPct * 0.4);

    return {
      overall: overallPct,
      environmental: envPct,
      social: socPct,
      governance: govPct,
      readiness,
      totalMetrics: metrics.length,
      reportedCount: validAll.length,
      verifiedCount: verifiedAll.length,
    };
  }

  // Reset to initial clean state
  public resetToDefault(): void {
    this.entities = INITIAL_ENTITIES;
    this.metrics = INITIAL_METRICS;
    this.documents = INITIAL_DOCUMENTS;
    this.issues = INITIAL_ISSUES;
    this.projects = INITIAL_PROJECTS;
    this.auditLogs = INITIAL_AUDIT_LOGS;
    writeToStorage(STORAGE_KEYS.ENTITIES, this.entities);
    writeToStorage(STORAGE_KEYS.METRICS, this.metrics);
    writeToStorage(STORAGE_KEYS.DOCUMENTS, this.documents);
    writeToStorage(STORAGE_KEYS.ISSUES, this.issues);
    writeToStorage(STORAGE_KEYS.PROJECTS, this.projects);
    writeToStorage(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
    this.notify();
  }
}

export const esgStore = ESGStore.getInstance();
