/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'meil_database.json');

app.use(express.json());

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Security: Hash helper using PBKDF2 with salt
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

// Initial Management Admin credentials (configured securely on backend)
const INITIAL_ADMIN = {
  userId: process.env.MEIL_ADMIN_USER_ID || 'MEIL-MGMT-ADM01',
  password: process.env.MEIL_ADMIN_PASSWORD || 'M7!qV9#rL2@xP8$kN4&zT6',
  role: 'MANAGEMENT_ADMIN',
  name: 'Executive Management Administrator',
  email: 'mgmt.admin@meil.in',
  department: 'MEIL Corporate Governance & ESG Secretariat',
};

// ============================================================================
// SEED MASTER DATA DEFINED EXACTLY BY MEIL MASTER SPECIFICATION (PAGES 1-5)
// ============================================================================

function getInitialDatabase() {
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(INITIAL_ADMIN.password, salt);

  const initialEntities = [
    // 1. TOP LEVEL: MEIL GROUP
    {
      id: 'meil-group',
      name: 'MEIL Group',
      type: 'Group',
      level: 'group',
      location: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      responsibleManager: 'Executive Board',
      esgOwner: 'Group ESG Committee',
      reportingBoundary: 'Consolidated MEIL Group & Subsidiaries',
      financialYear: 'FY 2025–26',
      status: 'ACTIVE',
      headquarters: 'Hyderabad, Telangana, India',
      lead: 'Executive ESG Committee',
      sector: 'Infrastructure & Engineering Conglomerate',
      description: 'Megha Engineering & Infrastructures Limited apex holding group.',
      createdBy: 'SYSTEM',
      createdDate: '2026-04-01',
      lastModifiedBy: 'SYSTEM',
      lastModifiedDate: '2026-04-01',
    },

    // 2. MEIL – PARENT COMPANY
    {
      id: 'meil-parent',
      name: 'MEIL – Parent Company',
      type: 'Parent Company',
      level: 'parent',
      parentId: 'meil-group',
      code: 'MEIL-CORP-01',
      location: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      responsibleManager: 'Managing Director',
      esgOwner: 'Corporate Sustainability Cell',
      reportingBoundary: 'MEIL Standalone Core EPC Operations',
      financialYear: 'FY 2025–26',
      status: 'ACTIVE',
      headquarters: 'Balanagar, Hyderabad, Telangana',
      lead: 'Executive Leadership Team',
      sector: 'Diversified Infrastructure EPC',
      description: 'Megha Engineering & Infrastructures Limited standalone parent corporation.',
      createdBy: 'SYSTEM',
      createdDate: '2026-04-01',
      lastModifiedBy: 'SYSTEM',
      lastModifiedDate: '2026-04-01',
    },

    // 3. BUSINESS UNITS / OPERATIONAL VERTICALS UNDER MEIL PARENT COMPANY (EXACTLY 12 VERTICALS)
    {
      id: 'bu-transportation',
      name: 'Transportation',
      type: 'Business Unit / Operational Vertical',
      level: 'business_unit',
      parentId: 'meil-parent',
      code: 'BU-TRN-01',
      location: 'New Delhi & Hyderabad',
      state: 'Pan-India',
      country: 'India',
      responsibleManager: 'Director of Transport Infrastructure',
      esgOwner: 'S. N. Sharma',
      reportingBoundary: 'Expressways, Highways, Flyovers, Strategic Tunnels & Metros',
      financialYear: 'FY 2025–26',
      status: 'ACTIVE',
      headquarters: 'New Delhi & Jammu & Kashmir',
      lead: 'Chief Project Officer',
      sector: 'Highways & High-Altitude Tunnels',
      description: 'Underground strategic tunnelling, major expressways and elevated transit corridors.',
      createdBy: 'SYSTEM',
      createdDate: '2026-04-01',
      lastModifiedBy: 'SYSTEM',
      lastModifiedDate: '2026-04-01',
    },
    {
      id: 'bu-buildings',
      name: 'Buildings & Industrial Infrastructure',
      type: 'Business Unit / Operational Vertical',
      level: 'business_unit',
      parentId: 'meil-parent',
      code: 'BU-BLD-02',
      location: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      responsibleManager: 'Vice President, Civil Infrastructure',
      esgOwner: 'R. K. Verma',
      reportingBoundary: 'Institutional campuses, industrial hubs, commercial complexes',
      financialYear: 'FY 2025–26',
      status: 'ACTIVE',
      headquarters: 'Hyderabad',
      lead: 'Head of Building Works',
      sector: 'Urban & Industrial Civil Projects',
      description: 'Mega public buildings, industrial parks, health cities, and smart infrastructure.',
      createdBy: 'SYSTEM',
      createdDate: '2026-04-01',
      lastModifiedBy: 'SYSTEM',
      lastModifiedDate: '2026-04-01',
    },
    {
      id: 'bu-hydrocarbons',
      name: 'Hydrocarbons',
      type: 'Business Unit / Operational Vertical',
      level: 'business_unit',
      parentId: 'meil-parent',
      code: 'BU-HYD-03',
      location: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
      responsibleManager: 'President, Oil & Gas Division',
      esgOwner: 'K. Patel',
      reportingBoundary: 'Drilling rigs, refinery units, oil & gas cross-country pipelines',
      financialYear: 'FY 2025–26',
      status: 'ACTIVE',
      headquarters: 'Gujarat & Assam',
      lead: 'General Manager, Oil & Gas EPC',
      sector: 'Hydrocarbons & Energy EPC',
      description: 'High-tech drilling rigs, crude processing plants, and cross-country natural gas pipelines.',
      createdBy: 'SYSTEM',
      createdDate: '2026-04-01',
      lastModifiedBy: 'SYSTEM',
      lastModifiedDate: '2026-04-01',
    },
    {
      id: 'bu-renewables',
      name: 'Renewable Energy',
      type: 'Business Unit / Operational Vertical',
      level: 'business_unit',
      parentId: 'meil-parent',
      code: 'BU-REN-04',
      location: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      responsibleManager: 'Head of Clean Energy',
      esgOwner: 'Dr. Ananya Ray',
      reportingBoundary: 'Utility scale solar parks, wind farms, green hydrogen pilots',
      financialYear: 'FY 2025–26',
      status: 'ACTIVE',
      headquarters: 'Karnataka & Rajasthan',
      lead: 'Director of Renewable Operations',
      sector: 'Solar, Wind & Green Hydrogen',
      description: 'Large-scale solar parks, hybrid wind installations, and green hydrogen pilot facilities.',
      createdBy: 'SYSTEM',
      createdDate: '2026-04-01',
      lastModifiedBy: 'SYSTEM',
      lastModifiedDate: '2026-04-01',
    },
    {
      id: 'bu-power',
      name: 'Power',
      type: 'Business Unit / Operational Vertical',
      level: 'business_unit',
      parentId: 'meil-parent',
      code: 'BU-PWR-05',
      location: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      responsibleManager: 'General Manager, Power Systems',
      esgOwner: 'B. S. Rao',
      reportingBoundary: 'Thermal, transmission lines, mega substations, grid interconnections',
      financialYear: 'FY 2025–26',
      status: 'ACTIVE',
      headquarters: 'Hyderabad',
      lead: 'Chief Electrical Engineer',
      sector: 'Transmission & Thermal Generation',
      description: 'High voltage transmission grids, gas turbine generation, and national grid substations.',
      createdBy: 'SYSTEM',
      createdDate: '2026-04-01',
      lastModifiedBy: 'SYSTEM',
      lastModifiedDate: '2026-04-01',
    },
    {
      id: 'bu-water',
      name: 'Water',
      type: 'Business Unit / Operational Vertical',
      level: 'business_unit',
      parentId: 'meil-parent',
      code: 'BU-WTR-06',
      location: 'Vijayawada',
      state: 'Andhra Pradesh',
      country: 'India',
      responsibleManager: 'Chief Engineer, Water Supply',
      esgOwner: 'A. Joshi',
      reportingBoundary: 'Drinking water distribution grids, sewage treatment plants, desalination',
      financialYear: 'FY 2025–26',
      status: 'ACTIVE',
      headquarters: 'Andhra Pradesh',
      lead: 'Head of Water Resources',
      sector: 'Municipal & Bulk Drinking Water',
      description: 'Regional potable drinking water distribution grids, treatment plants, and smart water metering.',
      createdBy: 'SYSTEM',
      createdDate: '2026-04-01',
      lastModifiedBy: 'SYSTEM',
      lastModifiedDate: '2026-04-01',
    },
    {
      id: 'bu-irrigation',
      name: 'Irrigation',
      type: 'Business Unit / Operational Vertical',
      level: 'business_unit',
      parentId: 'meil-parent',
      code: 'BU-IRR-07',
      location: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      responsibleManager: 'Executive VP, Lift Irrigation Projects',
      esgOwner: 'M. S. Murthy',
      reportingBoundary: 'Multi-stage lift irrigation, barrage complexes, spillways & canal networks',
      financialYear: 'FY 2025–26',
      status: 'ACTIVE',
      headquarters: 'Godavari & Krishna Basins',
      lead: 'Vice President, Irrigation Infrastructure',
      sector: 'Lift Irrigation & Dam Spillways',
      description: 'Pioneering worlds largest lift irrigation pumping systems, intake tunnels, and barrage networks.',
      createdBy: 'SYSTEM',
      createdDate: '2026-04-01',
      lastModifiedBy: 'SYSTEM',
      lastModifiedDate: '2026-04-01',
    },
    {
      id: 'bu-ibd',
      name: 'International Business Development',
      type: 'Business Unit / Operational Vertical',
      level: 'business_unit',
      parentId: 'meil-parent',
      code: 'BU-IBD-08',
      location: 'Dubai',
      state: 'UAE',
      country: 'International',
      responsibleManager: 'Managing Director, International',
      esgOwner: 'T. Al-Mansoor',
      reportingBoundary: 'Global EPC projects in Middle East, Africa, Central Asia & Europe',
      financialYear: 'FY 2025–26',
      status: 'ACTIVE',
      headquarters: 'Dubai, UAE',
      lead: 'Head of International Markets',
      sector: 'Global Infrastructure EPC',
      description: 'Cross-border oil & gas, water supply, and civil engineering infrastructure contracts.',
      createdBy: 'SYSTEM',
      createdDate: '2026-04-01',
      lastModifiedBy: 'SYSTEM',
      lastModifiedDate: '2026-04-01',
    },
    {
      id: 'bu-heavy-eng',
      name: 'Heavy Engineering',
      type: 'Business Unit / Operational Vertical',
      level: 'business_unit',
      parentId: 'meil-parent',
      code: 'BU-HVY-09',
      location: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      responsibleManager: 'Head of Heavy Machinery & Fabrication',
      esgOwner: 'P. Nair',
      reportingBoundary: 'Fabrication yards, pressure vessels, heavy structural fabrication',
      financialYear: 'FY 2025–26',
      status: 'ACTIVE',
      headquarters: 'Jeedimetla, Hyderabad',
      lead: 'Chief Mechanical Engineer',
      sector: 'Heavy Engineering & Structural Steel',
      description: 'Design and manufacturing of massive radial gates, penstock pipes, and precision pressure vessels.',
      createdBy: 'SYSTEM',
      createdDate: '2026-04-01',
      lastModifiedBy: 'SYSTEM',
      lastModifiedDate: '2026-04-01',
    },
    {
      id: 'bu-manufacturing',
      name: 'Manufacturing',
      type: 'Business Unit / Operational Vertical',
      level: 'business_unit',
      parentId: 'meil-parent',
      code: 'BU-MFG-10',
      location: 'Medchal',
      state: 'Telangana',
      country: 'India',
      responsibleManager: 'VP Industrial Manufacturing',
      esgOwner: 'C. H. Reddy',
      reportingBoundary: 'Equipment manufacturing plants, electrical panels, high-spec engineering components',
      financialYear: 'FY 2025–26',
      status: 'ACTIVE',
      headquarters: 'Telangana Manufacturing Zone',
      lead: 'Director of Manufacturing',
      sector: 'Industrial Equipment & Assemblies',
      description: 'Indigenous manufacturing of high-capacity pumps, electrical switchgear, and modular units.',
      createdBy: 'SYSTEM',
      createdDate: '2026-04-01',
      lastModifiedBy: 'SYSTEM',
      lastModifiedDate: '2026-04-01',
    },
    {
      id: 'bu-communications',
      name: 'Strategic Communications',
      type: 'Business Unit / Operational Vertical',
      level: 'business_unit',
      parentId: 'meil-parent',
      code: 'BU-COM-11',
      location: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      responsibleManager: 'Director of Corporate Affairs',
      esgOwner: 'V. Raman',
      reportingBoundary: 'Stakeholder engagement, government liaison, public policy communications',
      financialYear: 'FY 2025–26',
      status: 'ACTIVE',
      headquarters: 'Hyderabad',
      lead: 'Chief Communications Officer',
      sector: 'Public Affairs & Communications',
      description: 'Strategic stakeholder dialogue, community outreach programs, and corporate transparency reporting.',
      createdBy: 'SYSTEM',
      createdDate: '2026-04-01',
      lastModifiedBy: 'SYSTEM',
      lastModifiedDate: '2026-04-01',
    },
    {
      id: 'bu-om',
      name: 'O&M',
      type: 'Business Unit / Operational Vertical',
      level: 'business_unit',
      parentId: 'meil-parent',
      code: 'BU-OM-12',
      location: 'Pan-India Operations',
      state: 'Pan-India',
      country: 'India',
      responsibleManager: 'Head of Operations & Asset Maintenance',
      esgOwner: 'Col. R. Menon',
      reportingBoundary: 'Post-commissioning asset management, plant lifecycle maintenance, facility safety',
      financialYear: 'FY 2025–26',
      status: 'ACTIVE',
      headquarters: 'Hyderabad & Regional Hubs',
      lead: 'Chief Operations Officer',
      sector: 'Asset Lifecycle Operations & Maintenance',
      description: 'Long-term operations, environmental compliance audits, and preventive maintenance of completed assets.',
      createdBy: 'SYSTEM',
      createdDate: '2026-04-01',
      lastModifiedBy: 'SYSTEM',
      lastModifiedDate: '2026-04-01',
    },

    // 4. GROUP COMPANIES / SUBSIDIARIES (EXACTLY 7 SUBSIDIARIES SPECIFIED ON PAGE 2)
    {
      id: 'sub-olectra',
      name: 'Olectra Greentech Limited',
      type: 'Subsidiary / Group Company',
      level: 'subsidiary',
      parentId: 'meil-group',
      code: 'MEIL-SUB-01',
      location: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      responsibleManager: 'Managing Director, Olectra',
      esgOwner: 'Head of EV Sustainability',
      reportingBoundary: 'Electric bus design, manufacturing, battery packs & polymer insulators',
      financialYear: 'FY 2025–26',
      status: 'ACTIVE',
      headquarters: 'Hyderabad, Telangana',
      lead: 'Chief Sustainability Officer',
      sector: 'Electric Clean Mobility & Insulators',
      description: 'Pioneering zero-emission electric buses and composite polymer high-voltage insulators.',
      createdBy: 'SYSTEM',
      createdDate: '2026-04-01',
      lastModifiedBy: 'SYSTEM',
      lastModifiedDate: '2026-04-01',
    },
    {
      id: 'sub-evey',
      name: 'Evey Trans Private Limited',
      type: 'Subsidiary / Group Company',
      level: 'subsidiary',
      parentId: 'meil-group',
      code: 'MEIL-SUB-02',
      location: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      responsibleManager: 'Chief Executive Officer',
      esgOwner: 'N. Anand',
      reportingBoundary: 'Electric bus fleet concession operations across Indian municipalities',
      financialYear: 'FY 2025–26',
      status: 'ACTIVE',
      headquarters: 'Hyderabad, Telangana',
      lead: 'Head of Fleet Operations',
      sector: 'Clean Transit Fleet Concessions',
      description: 'Indias largest electric public bus fleet operator driving zero-emission city transit.',
      createdBy: 'SYSTEM',
      createdDate: '2026-04-01',
      lastModifiedBy: 'SYSTEM',
      lastModifiedDate: '2026-04-01',
    },
    {
      id: 'sub-megha-gas',
      name: 'Megha Gas',
      type: 'Subsidiary / Group Company',
      level: 'subsidiary',
      parentId: 'meil-group',
      code: 'MEIL-SUB-03',
      location: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      responsibleManager: 'Director, City Gas Distribution',
      esgOwner: 'S. K. Gupta',
      reportingBoundary: 'Piped Natural Gas (PNG) and Compressed Natural Gas (CNG) stations',
      financialYear: 'FY 2025–26',
      status: 'ACTIVE',
      headquarters: 'Hyderabad & Multi-State License Areas',
      lead: 'Chief Operating Officer, Gas Division',
      sector: 'City Gas Distribution (CGD)',
      description: 'Delivering eco-friendly domestic piped natural gas and commercial CNG vehicle fueling networks.',
      createdBy: 'SYSTEM',
      createdDate: '2026-04-01',
      lastModifiedBy: 'SYSTEM',
      lastModifiedDate: '2026-04-01',
    },
    {
      id: 'sub-icomm',
      name: 'ICOMM Tele Limited',
      type: 'Subsidiary / Group Company',
      level: 'subsidiary',
      parentId: 'meil-group',
      code: 'MEIL-SUB-04',
      location: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      responsibleManager: 'President, Telecom & Defense',
      esgOwner: 'R. Sen',
      reportingBoundary: 'Telecom equipment, defense tactical communication, smart power towers',
      financialYear: 'FY 2025–26',
      status: 'ACTIVE',
      headquarters: 'Hyderabad, Telangana',
      lead: 'Head of Defense Electronics',
      sector: 'Telecom, Defense & Advanced Tech',
      description: 'High-precision wireless communication, tactical defense electronics, and power transmission towers.',
      createdBy: 'SYSTEM',
      createdDate: '2026-04-01',
      lastModifiedBy: 'SYSTEM',
      lastModifiedDate: '2026-04-01',
    },
    {
      id: 'sub-drillmec',
      name: 'Drillmec S.p.A.',
      type: 'Subsidiary / Group Company',
      level: 'subsidiary',
      parentId: 'meil-group',
      code: 'MEIL-SUB-05',
      location: 'Piacenza',
      state: 'Emilia-Romagna',
      country: 'Italy',
      responsibleManager: 'Chief Executive Officer, Drillmec',
      esgOwner: 'M. Rossi',
      reportingBoundary: 'Global oil, gas and geothermal drilling rig engineering and servicing',
      financialYear: 'FY 2025–26',
      status: 'ACTIVE',
      headquarters: 'Piacenza, Italy',
      lead: 'Global Managing Director',
      sector: 'Drilling Rig Technology & Engineering',
      description: 'Global leader in automated drilling rigs, automated pipe handling systems, and geothermal energy.',
      createdBy: 'SYSTEM',
      createdDate: '2026-04-01',
      lastModifiedBy: 'SYSTEM',
      lastModifiedDate: '2026-04-01',
    },
    {
      id: 'sub-sepc',
      name: 'SEPC Power Private Limited',
      type: 'Subsidiary / Group Company',
      level: 'subsidiary',
      parentId: 'meil-group',
      code: 'MEIL-SUB-06',
      location: 'Tuticorin',
      state: 'Tamil Nadu',
      country: 'India',
      responsibleManager: 'Plant Director',
      esgOwner: 'V. Sundaram',
      reportingBoundary: 'Thermal power generation and environmental emission control units',
      financialYear: 'FY 2025–26',
      status: 'ACTIVE',
      headquarters: 'Tuticorin, Tamil Nadu',
      lead: 'Director of Thermal Operations',
      sector: 'Power Generation & Flue Gas Desulfurization',
      description: 'Advanced supercritical thermal generation equipped with state-of-the-art FGD emissions scrubbers.',
      createdBy: 'SYSTEM',
      createdDate: '2026-04-01',
      lastModifiedBy: 'SYSTEM',
      lastModifiedDate: '2026-04-01',
    },
    {
      id: 'sub-fibre-glass',
      name: 'Megha Fibre Glass Industries Limited',
      type: 'Subsidiary / Group Company',
      level: 'subsidiary',
      parentId: 'meil-group',
      code: 'MEIL-SUB-07',
      location: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      responsibleManager: 'Managing Director, Fibre Glass',
      esgOwner: 'D. Srinivas',
      reportingBoundary: 'GRP, GRE & GRP pipe manufacturing for municipal water & chemical conveyance',
      financialYear: 'FY 2025–26',
      status: 'ACTIVE',
      headquarters: 'Hyderabad, Telangana',
      lead: 'Chief Technical Officer',
      sector: 'Advanced Composite Piping Solutions',
      description: 'Manufacturing of non-corrosive Glass-Reinforced Polymer (GRP) pipes for large-diameter water conduits.',
      createdBy: 'SYSTEM',
      createdDate: '2026-04-01',
      lastModifiedBy: 'SYSTEM',
      lastModifiedDate: '2026-04-01',
    },
  ];

  // 5. PROJECTS / SITES (EXACTLY BELONGING TO GROUP -> COMPANY -> BUSINESS UNIT)
  const initialProjects = [
    {
      id: 'proj-zojila',
      projectId: 'PRJ-ZOJ-01',
      name: 'Zojila Pass All-Weather Tunnel Project',
      projectType: 'Strategic Road Tunneling',
      parentCompanyId: 'meil-parent',
      parentCompanyName: 'MEIL – Parent Company',
      businessUnitId: 'bu-transportation',
      businessUnitName: 'Transportation',
      location: 'Baltal - Minamarg, Ladakh & J&K',
      state: 'UT of Ladakh & J&K',
      country: 'India',
      startDate: '2020-10-15',
      expectedCompletion: '2026-12-31',
      projectManager: 'H. C. Sharma',
      esgManager: 'Col. R. Menon',
      reportingBoundary: '14.15 km bi-directional tunnel, cut-and-cover portals, ventilation shafts',
      financialYear: 'FY 2025–26',
      period: 'FY 2025–26',
      completeness: 88,
      status: 'ACTIVE',
      projectStatus: 'ACTIVE',
      lastUpdated: '2026-09-14',
      environmentalScore: 92,
      socialScore: 86,
      governanceScore: 85,
      documentsCount: 4,
    },
    {
      id: 'proj-polavaram',
      projectId: 'PRJ-POL-02',
      name: 'Polavaram Major Irrigation Project Complex',
      projectType: 'National Irrigation & Spillway',
      parentCompanyId: 'meil-parent',
      parentCompanyName: 'MEIL – Parent Company',
      businessUnitId: 'bu-irrigation',
      businessUnitName: 'Irrigation',
      location: 'Godavari Basin, Eluru',
      state: 'Andhra Pradesh',
      country: 'India',
      startDate: '2019-11-01',
      expectedCompletion: '2026-06-30',
      projectManager: 'P. V. Krishna Rao',
      esgManager: 'A. Joshi',
      reportingBoundary: '48 spillway radial gates, approach channel, pilot canal, hydro foundation',
      financialYear: 'FY 2025–26',
      period: 'FY 2025–26',
      completeness: 82,
      status: 'ACTIVE',
      projectStatus: 'ACTIVE',
      lastUpdated: '2026-09-11',
      environmentalScore: 84,
      socialScore: 80,
      governanceScore: 82,
      documentsCount: 5,
    },
    {
      id: 'proj-kaleshwaram',
      projectId: 'PRJ-KAL-03',
      name: 'Kaleshwaram Lift Irrigation Pumping Package',
      projectType: 'Mega Submersible Lift Pumping',
      parentCompanyId: 'meil-parent',
      parentCompanyName: 'MEIL – Parent Company',
      businessUnitId: 'bu-irrigation',
      businessUnitName: 'Irrigation',
      location: 'Medigadda & Sundilla, Jayashankar Bhupalpally',
      state: 'Telangana',
      country: 'India',
      startDate: '2016-05-10',
      expectedCompletion: '2026-08-30',
      projectManager: 'T. Satyanarayana',
      esgManager: 'M. S. Murthy',
      reportingBoundary: 'Underground pump house packages 6, 8, 10, 11 and surge pools',
      financialYear: 'FY 2025–26',
      period: 'FY 2025–26',
      completeness: 94,
      status: 'ACTIVE',
      projectStatus: 'ACTIVE',
      lastUpdated: '2026-09-08',
      environmentalScore: 78,
      socialScore: 75,
      governanceScore: 72,
      documentsCount: 3,
    },
    {
      id: 'proj-solar-park',
      projectId: 'PRJ-SOL-04',
      name: '500MW Clean Solar PV Park',
      projectType: 'Utility Scale Solar',
      parentCompanyId: 'meil-parent',
      parentCompanyName: 'MEIL – Parent Company',
      businessUnitId: 'bu-renewables',
      businessUnitName: 'Renewable Energy',
      location: 'Bhadla Phase IV',
      state: 'Rajasthan',
      country: 'India',
      startDate: '2024-01-10',
      expectedCompletion: '2026-05-31',
      projectManager: 'N. R. Choudhary',
      esgManager: 'Dr. Ananya Ray',
      reportingBoundary: '2,200 acres tracking bifacial panels, 33/400kV substation, robotic waterless cleaning',
      financialYear: 'FY 2025–26',
      period: 'FY 2025–26',
      completeness: 90,
      status: 'ACTIVE',
      projectStatus: 'ACTIVE',
      lastUpdated: '2026-09-15',
      environmentalScore: 98,
      socialScore: 88,
      governanceScore: 90,
      documentsCount: 4,
    },
    {
      id: 'proj-ev-bus',
      projectId: 'PRJ-OLE-05',
      name: 'Electric Bus Fleet Delivery Program',
      projectType: 'Clean Transit Manufacturing',
      parentCompanyId: 'sub-olectra',
      parentCompanyName: 'Olectra Greentech Limited',
      businessUnitId: 'sub-olectra',
      businessUnitName: 'Olectra Clean Mobility',
      location: 'Dindigul & Pan-India Depot Fleets',
      state: 'Telangana',
      country: 'India',
      startDate: '2023-04-01',
      expectedCompletion: '2027-03-31',
      projectManager: 'K. V. Chary',
      esgManager: 'N. Anand',
      reportingBoundary: 'Manufacturing assembly, delivery to state transport undertakings, depot charging hubs',
      financialYear: 'FY 2025–26',
      period: 'FY 2025–26',
      completeness: 94,
      status: 'ACTIVE',
      projectStatus: 'ACTIVE',
      lastUpdated: '2026-09-18',
      environmentalScore: 98,
      socialScore: 90,
      governanceScore: 94,
      documentsCount: 6,
    },
    {
      id: 'proj-cgd-gas',
      projectId: 'PRJ-GAS-06',
      name: 'City Gas Distribution Network Phase 2',
      projectType: 'Natural Gas Reticulation',
      parentCompanyId: 'sub-megha-gas',
      parentCompanyName: 'Megha Gas',
      businessUnitId: 'sub-megha-gas',
      businessUnitName: 'Megha Gas Distribution',
      location: 'Krishna, Nalgonda & Warangal GA',
      state: 'Andhra Pradesh & Telangana',
      country: 'India',
      startDate: '2022-09-15',
      expectedCompletion: '2027-12-31',
      projectManager: 'G. Rama Rao',
      esgManager: 'S. K. Gupta',
      reportingBoundary: 'Steel trunk pipeline, MDPE city network, 28 daughter CNG stations',
      financialYear: 'FY 2025–26',
      period: 'FY 2025–26',
      completeness: 79,
      status: 'ACTIVE',
      projectStatus: 'ACTIVE',
      lastUpdated: '2026-09-16',
      environmentalScore: 86,
      socialScore: 82,
      governanceScore: 80,
      documentsCount: 3,
    },
  ];

  // 6. ESG RECORDS WITH WORKFLOW STATES (DRAFT, SUBMITTED, UNDER REVIEW, CHANGES REQUESTED, APPROVED, LOCKED)
  const initialMetrics = [
    // Approved Environmental: Energy
    {
      id: 'm-01',
      recordId: 'ESG-REC-001',
      metricName: 'Total Energy Consumption',
      category: 'Energy',
      pillar: 'environmental',
      value: 482500,
      reportedValue: 482500,
      unit: 'GJ',
      previousYearValue: 462000,
      reportingPeriod: 'FY 2025–26',
      financialYear: 'FY 2025–26',
      entityId: 'meil-parent',
      entityName: 'MEIL – Parent Company',
      entityLevel: 'parent',
      source: 'Consolidated Utility Bills & Heavy Fleet Diesel Registers',
      dataSource: 'Audited Utility Logs',
      status: 'reported',
      approvalStatus: 'APPROVED',
      verificationStatus: 'verified',
      responsiblePerson: 'S. K. Rao (ESG Lead)',
      submittedBy: 'S. K. Rao (ESG Lead)',
      reviewedBy: 'Chief Sustainability Officer',
      remarks: 'Includes direct diesel on heavy excavation machinery and grid power.',
      supportingDocName: 'MEIL_Energy_Audit_Summary_FY2526.pdf',
      evidenceDocument: 'MEIL_Energy_Audit_Summary_FY2526.pdf',
      isDemoData: true,
      lastUpdated: '2026-09-15',
      updatedBy: 'S. K. Rao (ESG Lead)',
      createdDate: '2026-08-01',
    },
    {
      id: 'm-02',
      recordId: 'ESG-REC-002',
      metricName: 'Renewable Electricity Generated / Consumed',
      category: 'Energy',
      pillar: 'environmental',
      value: 124300,
      reportedValue: 124300,
      unit: 'GJ',
      previousYearValue: 98000,
      reportingPeriod: 'FY 2025–26',
      financialYear: 'FY 2025–26',
      entityId: 'meil-parent',
      entityName: 'MEIL – Parent Company',
      entityLevel: 'parent',
      source: 'Solar Power Inverter Meter Readings',
      dataSource: 'Captive Solar Inverter Scada',
      status: 'reported',
      approvalStatus: 'APPROVED',
      verificationStatus: 'verified',
      responsiblePerson: 'R. Sharma (Energy Officer)',
      submittedBy: 'R. Sharma',
      reviewedBy: 'Chief Sustainability Officer',
      remarks: 'Captive rooftop solar at manufacturing yards and onsite arrays.',
      supportingDocName: 'Captive_Solar_Generation_Certificates.pdf',
      evidenceDocument: 'Captive_Solar_Generation_Certificates.pdf',
      isDemoData: true,
      lastUpdated: '2026-09-12',
      updatedBy: 'R. Sharma',
      createdDate: '2026-08-05',
    },
    // Approved Environmental: Scope 1 Emissions
    {
      id: 'm-04',
      recordId: 'ESG-REC-004',
      metricName: 'Scope 1 Direct GHG Emissions',
      category: 'Emissions',
      pillar: 'environmental',
      value: 32410,
      reportedValue: 32410,
      unit: 'tCO2e',
      previousYearValue: 34100,
      reportingPeriod: 'FY 2025–26',
      financialYear: 'FY 2025–26',
      entityId: 'meil-parent',
      entityName: 'MEIL – Parent Company',
      entityLevel: 'parent',
      source: 'DEFRA emission factors applied to fuel consumption logs',
      dataSource: 'Fleet Fuel Cards & Fuel Tank Meters',
      status: 'reported',
      approvalStatus: 'APPROVED',
      verificationStatus: 'verified',
      responsiblePerson: 'K. V. Reddy',
      submittedBy: 'K. V. Reddy',
      reviewedBy: 'Head of Quality Assurance',
      remarks: 'Stationary diesel generators and heavy earthmoving machinery fleet.',
      supportingDocName: 'Scope1_GHG_Inventory_Assessment.pdf',
      evidenceDocument: 'Scope1_GHG_Inventory_Assessment.pdf',
      isDemoData: true,
      lastUpdated: '2026-09-10',
      updatedBy: 'K. V. Reddy',
      createdDate: '2026-08-10',
    },
    // Approved Environmental: Scope 2 Emissions
    {
      id: 'm-05',
      recordId: 'ESG-REC-005',
      metricName: 'Scope 2 Indirect GHG Emissions (Location-based)',
      category: 'Emissions',
      pillar: 'environmental',
      value: 24890,
      reportedValue: 24890,
      unit: 'tCO2e',
      previousYearValue: 26200,
      reportingPeriod: 'FY 2025–26',
      financialYear: 'FY 2025–26',
      entityId: 'meil-parent',
      entityName: 'MEIL – Parent Company',
      entityLevel: 'parent',
      source: 'CEA CO2 Baseline Database Ver 19.0',
      dataSource: 'State DISCOM Substation Meters',
      status: 'reported',
      approvalStatus: 'APPROVED',
      verificationStatus: 'verified',
      responsiblePerson: 'K. V. Reddy',
      submittedBy: 'K. V. Reddy',
      reviewedBy: 'Head of Quality Assurance',
      remarks: 'Purchased grid electricity across all operational sites and offices.',
      supportingDocName: 'CEA_Grid_Emission_Factor_Calculations.pdf',
      evidenceDocument: 'CEA_Grid_Emission_Factor_Calculations.pdf',
      isDemoData: true,
      lastUpdated: '2026-09-08',
      updatedBy: 'K. V. Reddy',
      createdDate: '2026-08-10',
    },
    // Under Review Environmental: Scope 3
    {
      id: 'm-06',
      recordId: 'ESG-REC-006',
      metricName: 'Scope 3 Supply Chain & Transport Emissions',
      category: 'Emissions',
      pillar: 'environmental',
      value: 78500,
      reportedValue: 78500,
      unit: 'tCO2e',
      previousYearValue: null,
      reportingPeriod: 'FY 2025–26',
      financialYear: 'FY 2025–26',
      entityId: 'meil-parent',
      entityName: 'MEIL – Parent Company',
      entityLevel: 'parent',
      source: 'Tier 1 Steel and Cement supplier submissions',
      dataSource: 'Supplier Environmental Questionnaires',
      status: 'in_progress',
      approvalStatus: 'UNDER REVIEW',
      verificationStatus: 'needs_review',
      responsiblePerson: 'P. Nair (Procurement ESG)',
      submittedBy: 'P. Nair',
      reviewedBy: 'Pending Audit Reviewer',
      remarks: 'Submitted for management review. Pending auditor confirmation of cement clinker factor.',
      supportingDocName: 'Supplier_ESG_Due_Diligence_Tracker.pdf',
      evidenceDocument: 'Supplier_ESG_Due_Diligence_Tracker.pdf',
      isDemoData: true,
      lastUpdated: '2026-09-18',
      updatedBy: 'P. Nair',
      createdDate: '2026-08-15',
    },
    // Approved Environmental: Water
    {
      id: 'm-07',
      recordId: 'ESG-REC-007',
      metricName: 'Total Water Withdrawal',
      category: 'Water',
      pillar: 'environmental',
      value: 628400,
      reportedValue: 628400,
      unit: 'kL',
      previousYearValue: 642000,
      reportingPeriod: 'FY 2025–26',
      financialYear: 'FY 2025–26',
      entityId: 'meil-parent',
      entityName: 'MEIL – Parent Company',
      entityLevel: 'parent',
      source: 'Site Flowmeters & Municipal Water Invoices',
      dataSource: 'Calibrated Ultrasonic Flowmeters',
      status: 'reported',
      approvalStatus: 'APPROVED',
      verificationStatus: 'verified',
      responsiblePerson: 'A. Joshi',
      submittedBy: 'A. Joshi',
      reviewedBy: 'Executive VP Water Division',
      remarks: 'Concrete batching, dust suppression, camp facilities, and testing operations.',
      supportingDocName: 'Water_Abstraction_Permits_Consolidated.pdf',
      evidenceDocument: 'Water_Abstraction_Permits_Consolidated.pdf',
      isDemoData: true,
      lastUpdated: '2026-09-11',
      updatedBy: 'A. Joshi',
      createdDate: '2026-08-12',
    },
    // Approved Environmental: Waste
    {
      id: 'm-09',
      recordId: 'ESG-REC-009',
      metricName: 'Non-Hazardous Construction Waste Generated',
      category: 'Waste',
      pillar: 'environmental',
      value: 48920,
      reportedValue: 48920,
      unit: 'Metric Tonnes',
      previousYearValue: 52000,
      reportingPeriod: 'FY 2025–26',
      financialYear: 'FY 2025–26',
      entityId: 'meil-parent',
      entityName: 'MEIL – Parent Company',
      entityLevel: 'parent',
      source: 'Weighbridge Slips & Site Waste Registers',
      dataSource: 'Electronic Weighbridge Logs',
      status: 'reported',
      approvalStatus: 'APPROVED',
      verificationStatus: 'verified',
      responsiblePerson: 'M. Saxena',
      submittedBy: 'M. Saxena',
      reviewedBy: 'Environmental Compliance Officer',
      remarks: 'Includes excavated rock reused for road sub-base and embankment filling.',
      supportingDocName: 'Muck_Utilization_Compliance_Report.pdf',
      evidenceDocument: 'Muck_Utilization_Compliance_Report.pdf',
      isDemoData: true,
      lastUpdated: '2026-09-05',
      updatedBy: 'M. Saxena',
      createdDate: '2026-08-10',
    },
    // Approved Social: Workforce
    {
      id: 'm-11',
      recordId: 'ESG-REC-011',
      metricName: 'Total Workforce (Employees and Workers)',
      category: 'Workforce',
      pillar: 'social',
      value: 28450,
      reportedValue: 28450,
      unit: 'Persons',
      previousYearValue: 26800,
      reportingPeriod: 'FY 2025–26',
      financialYear: 'FY 2025–26',
      entityId: 'meil-parent',
      entityName: 'MEIL – Parent Company',
      entityLevel: 'parent',
      source: 'HR Central ERP (SAP SuccessFactors)',
      dataSource: 'Biometric Attendance & ERP Payroll',
      status: 'reported',
      approvalStatus: 'APPROVED',
      verificationStatus: 'verified',
      responsiblePerson: 'B. Narayan',
      submittedBy: 'B. Narayan',
      reviewedBy: 'Director Human Resources',
      remarks: 'Permanent technical engineers, site supervisors, and project skilled workforce.',
      supportingDocName: 'HR_Headcount_Audit_FY26.pdf',
      evidenceDocument: 'HR_Headcount_Audit_FY26.pdf',
      isDemoData: true,
      lastUpdated: '2026-09-18',
      updatedBy: 'B. Narayan',
      createdDate: '2026-08-01',
    },
    // Approved Social: Safety LTIFR
    {
      id: 'm-13',
      recordId: 'ESG-REC-013',
      metricName: 'Lost Time Injury Frequency Rate (LTIFR)',
      category: 'Health & Safety',
      pillar: 'social',
      value: 0.18,
      reportedValue: 0.18,
      unit: 'Per 1,000,000 Person-Hours',
      previousYearValue: 0.22,
      reportingPeriod: 'FY 2025–26',
      financialYear: 'FY 2025–26',
      entityId: 'meil-parent',
      entityName: 'MEIL – Parent Company',
      entityLevel: 'parent',
      source: 'Corporate HSE Incident Management System',
      dataSource: 'HSE Incident Portal (Zero Fatalities)',
      status: 'reported',
      approvalStatus: 'APPROVED',
      verificationStatus: 'verified',
      responsiblePerson: 'Col. R. Menon',
      submittedBy: 'Col. R. Menon',
      reviewedBy: 'Head of Quality & Safety',
      remarks: 'Zero reportable fatalities across all active tunnel and lift irrigation packages.',
      supportingDocName: 'Corporate_HSE_Performance_Audit_Q2.pdf',
      evidenceDocument: 'Corporate_HSE_Performance_Audit_Q2.pdf',
      isDemoData: true,
      lastUpdated: '2026-09-17',
      updatedBy: 'Col. R. Menon',
      createdDate: '2026-08-01',
    },
    // Approved Social: CSR Investment
    {
      id: 'm-16',
      recordId: 'ESG-REC-016',
      metricName: 'Corporate Social Responsibility (CSR) Investment',
      category: 'Community / CSR',
      pillar: 'social',
      value: 46.8,
      reportedValue: 46.8,
      unit: '₹ Crores',
      previousYearValue: 41.5,
      reportingPeriod: 'FY 2025–26',
      financialYear: 'FY 2025–26',
      entityId: 'meil-parent',
      entityName: 'MEIL – Parent Company',
      entityLevel: 'parent',
      source: 'MEIL Foundation Audited Financial Statements',
      dataSource: 'Audited Financial Statements',
      status: 'reported',
      approvalStatus: 'APPROVED',
      verificationStatus: 'verified',
      responsiblePerson: 'G. V. Subbarao',
      submittedBy: 'G. V. Subbarao',
      reviewedBy: 'CSR Committee Board',
      remarks: 'Drinking water purification kiosks, rural healthcare camps, skill institutes.',
      supportingDocName: 'MEIL_Foundation_CSR_Report_2026.pdf',
      evidenceDocument: 'MEIL_Foundation_CSR_Report_2026.pdf',
      isDemoData: true,
      lastUpdated: '2026-09-14',
      updatedBy: 'G. V. Subbarao',
      createdDate: '2026-08-01',
    },
    // Approved Governance: Board Independence
    {
      id: 'm-17',
      recordId: 'ESG-REC-017',
      metricName: 'Board Independent Directors Ratio',
      category: 'Corporate Governance',
      pillar: 'governance',
      value: 50.0,
      reportedValue: 50.0,
      unit: '%',
      previousYearValue: 50.0,
      reportingPeriod: 'FY 2025–26',
      financialYear: 'FY 2025–26',
      entityId: 'meil-parent',
      entityName: 'MEIL – Parent Company',
      entityLevel: 'parent',
      source: 'Company Secretarial Filings & MCA21 Disclosures',
      dataSource: 'Secretarial Form DIR-12',
      status: 'reported',
      approvalStatus: 'APPROVED',
      verificationStatus: 'verified',
      responsiblePerson: 'Adv. S. K. Verma',
      submittedBy: 'Adv. S. K. Verma',
      reviewedBy: 'Board Nomination Committee',
      remarks: 'Fully compliant with Companies Act 2013 and SEBI LODR corporate standards.',
      supportingDocName: 'Board_Composition_and_Charter_2026.pdf',
      evidenceDocument: 'Board_Composition_and_Charter_2026.pdf',
      isDemoData: true,
      lastUpdated: '2026-09-02',
      updatedBy: 'Adv. S. K. Verma',
      createdDate: '2026-08-01',
    },

    // Project-Level Records Participating in Hierarchical Lineage
    // Project Zojila (Under Transportation BU)
    {
      id: 'm-zoj-01',
      recordId: 'ESG-REC-Z01',
      metricName: 'Scope 1 Direct GHG Emissions',
      category: 'Emissions',
      pillar: 'environmental',
      value: 6240,
      reportedValue: 6240,
      unit: 'tCO2e',
      previousYearValue: 6800,
      reportingPeriod: 'FY 2025–26',
      financialYear: 'FY 2025–26',
      entityId: 'proj-zojila',
      entityName: 'Zojila Pass All-Weather Tunnel Project',
      parentEntityId: 'bu-transportation',
      entityLevel: 'project',
      source: 'Tunnel Vent Diesel Generators & Dumpers Log',
      dataSource: 'Site Fuel Delivery Meters',
      status: 'reported',
      approvalStatus: 'APPROVED',
      verificationStatus: 'verified',
      responsiblePerson: 'H. C. Sharma',
      submittedBy: 'H. C. Sharma',
      reviewedBy: 'Project Director',
      remarks: 'Heavy winter generator operations for portal ventilation and tunnel heaters.',
      supportingDocName: 'Zojila_Tunnel_Fuel_Emissions_Audit.pdf',
      evidenceDocument: 'Zojila_Tunnel_Fuel_Emissions_Audit.pdf',
      isDemoData: true,
      lastUpdated: '2026-09-14',
      updatedBy: 'H. C. Sharma',
      createdDate: '2026-08-20',
    },
    // Project Polavaram (Under Irrigation BU)
    {
      id: 'm-pol-01',
      recordId: 'ESG-REC-P01',
      metricName: 'Scope 1 Direct GHG Emissions',
      category: 'Emissions',
      pillar: 'environmental',
      value: 11450,
      reportedValue: 11450,
      unit: 'tCO2e',
      previousYearValue: 12100,
      reportingPeriod: 'FY 2025–26',
      financialYear: 'FY 2025–26',
      entityId: 'proj-polavaram',
      entityName: 'Polavaram Major Irrigation Project Complex',
      parentEntityId: 'bu-irrigation',
      entityLevel: 'project',
      source: 'Spillway Earthmoving Fleet Registers',
      dataSource: 'Site Central Fuel Dispenser',
      status: 'reported',
      approvalStatus: 'APPROVED',
      verificationStatus: 'verified',
      responsiblePerson: 'P. V. Krishna Rao',
      submittedBy: 'P. V. Krishna Rao',
      reviewedBy: 'Chief Engineer Site',
      remarks: 'Radial gate steel erection and batching plant diesel backup.',
      supportingDocName: 'Polavaram_Fleet_Emissions_Log.pdf',
      evidenceDocument: 'Polavaram_Fleet_Emissions_Log.pdf',
      isDemoData: true,
      lastUpdated: '2026-09-11',
      updatedBy: 'P. V. Krishna Rao',
      createdDate: '2026-08-20',
    },
    // Project Olectra EV Bus Fleet (Under Subsidiary Olectra)
    {
      id: 'm-ole-01',
      recordId: 'ESG-REC-O01',
      metricName: 'Scope 1 Direct GHG Emissions',
      category: 'Emissions',
      pillar: 'environmental',
      value: 1280,
      reportedValue: 1280,
      unit: 'tCO2e',
      previousYearValue: 1450,
      reportingPeriod: 'FY 2025–26',
      financialYear: 'FY 2025–26',
      entityId: 'sub-olectra',
      entityName: 'Olectra Greentech Limited',
      parentEntityId: 'meil-group',
      entityLevel: 'subsidiary',
      source: 'Manufacturing Paint Shop and Forklift Fuel Log',
      dataSource: 'Plant Utilities ERP',
      status: 'reported',
      approvalStatus: 'APPROVED',
      verificationStatus: 'verified',
      responsiblePerson: 'K. V. Chary',
      submittedBy: 'K. V. Chary',
      reviewedBy: 'Plant Head',
      remarks: 'Low direct footprint due to extensive rooftop captive solar generation.',
      supportingDocName: 'Olectra_Emissions_Statement.pdf',
      evidenceDocument: 'Olectra_Emissions_Statement.pdf',
      isDemoData: true,
      lastUpdated: '2026-09-18',
      updatedBy: 'K. V. Chary',
      createdDate: '2026-08-25',
    },
    // Pending Review Record for Review & Approval Center
    {
      id: 'm-pending-01',
      recordId: 'ESG-REC-PND01',
      metricName: 'Hazardous Waste Safely Disposed',
      category: 'Waste',
      pillar: 'environmental',
      value: 412,
      reportedValue: 412,
      unit: 'Metric Tonnes',
      previousYearValue: 435,
      reportingPeriod: 'FY 2025–26',
      financialYear: 'FY 2025–26',
      entityId: 'bu-hydrocarbons',
      entityName: 'Hydrocarbons',
      parentEntityId: 'meil-parent',
      entityLevel: 'business_unit',
      source: 'State Pollution Control Board Manifest Form 10 filings',
      dataSource: 'SPCB Hazardous Waste Manifests',
      status: 'in_progress',
      approvalStatus: 'SUBMITTED',
      verificationStatus: 'needs_review',
      responsiblePerson: 'K. Patel',
      submittedBy: 'K. Patel (Hydrocarbons HSE)',
      reviewedBy: 'Pending Reviewer Assignment',
      remarks: 'Lubrication oils and drilling mud treatment manifests submitted for quarterly sign-off.',
      supportingDocName: 'SPCB_Form10_Hazardous_Waste_Manifests.pdf',
      evidenceDocument: 'SPCB_Form10_Hazardous_Waste_Manifests.pdf',
      isDemoData: true,
      lastUpdated: '2026-09-19',
      updatedBy: 'K. Patel',
      createdDate: '2026-09-19',
    },
    // Changes Requested Record for Review & Approval Center
    {
      id: 'm-changes-01',
      recordId: 'ESG-REC-CHG01',
      metricName: 'Q2 Potable Water Recycled Onsite',
      category: 'Water',
      pillar: 'environmental',
      value: 45200,
      reportedValue: 45200,
      unit: 'kL',
      previousYearValue: 42000,
      reportingPeriod: 'FY 2025–26',
      financialYear: 'FY 2025–26',
      entityId: 'proj-kaleshwaram',
      entityName: 'Kaleshwaram Lift Irrigation Pumping Package',
      parentEntityId: 'bu-irrigation',
      entityLevel: 'project',
      source: 'Camp Effluent Treatment Plant Meter',
      dataSource: 'Daily ETP Log Book',
      status: 'in_progress',
      approvalStatus: 'CHANGES REQUESTED',
      verificationStatus: 'needs_review',
      responsiblePerson: 'T. Satyanarayana',
      submittedBy: 'T. Satyanarayana',
      reviewedBy: 'Col. R. Menon',
      remarks: 'Reviewer Note: Please attach lab calibration certificate for ETP meter 2 before approval.',
      supportingDocName: 'ETP_Water_Recycling_Log_Q2.pdf',
      evidenceDocument: 'ETP_Water_Recycling_Log_Q2.pdf',
      isDemoData: true,
      lastUpdated: '2026-09-17',
      updatedBy: 'Col. R. Menon',
      createdDate: '2026-09-12',
    },
  ];

  // 7. INITIAL EVIDENCE DOCUMENTS
  const initialDocuments = [
    {
      id: 'doc-01',
      name: 'MEIL_Group_Environmental_Policy_2026.pdf',
      category: 'Policy',
      reportingPeriod: 'FY 2025–26',
      entityName: 'MEIL – Parent Company',
      entityId: 'meil-parent',
      pillar: 'environmental',
      uploadDate: '2026-08-10',
      verificationStatus: 'verified',
      fileSize: '2.4 MB',
      fileFormat: 'PDF',
      uploadedBy: 'S. K. Rao',
    },
    {
      id: 'doc-02',
      name: 'ISO_14001_Environmental_Management_Certification.pdf',
      category: 'Certificate',
      reportingPeriod: 'FY 2025–26',
      entityName: 'MEIL – Parent Company',
      entityId: 'meil-parent',
      pillar: 'environmental',
      uploadDate: '2026-07-22',
      verificationStatus: 'verified',
      fileSize: '1.8 MB',
      fileFormat: 'PDF',
      uploadedBy: 'Quality Assurance Head',
    },
    {
      id: 'doc-03',
      name: 'ISO_45001_Occupational_Health_Safety_Audit.pdf',
      category: 'Audit',
      reportingPeriod: 'FY 2025–26',
      entityName: 'MEIL – Parent Company',
      entityId: 'meil-parent',
      pillar: 'social',
      uploadDate: '2026-08-14',
      verificationStatus: 'verified',
      fileSize: '3.6 MB',
      fileFormat: 'PDF',
      uploadedBy: 'Col. R. Menon',
    },
    {
      id: 'doc-04',
      name: 'MEIL_Foundation_CSR_Annual_Assurance_Report.pdf',
      category: 'Report',
      reportingPeriod: 'FY 2025–26',
      entityName: 'MEIL – Parent Company',
      entityId: 'meil-parent',
      pillar: 'social',
      uploadDate: '2026-09-02',
      verificationStatus: 'verified',
      fileSize: '4.1 MB',
      fileFormat: 'PDF',
      uploadedBy: 'G. V. Subbarao',
    },
    {
      id: 'doc-05',
      name: 'SPCB_Form10_Hazardous_Waste_Manifests.pdf',
      category: 'Environmental Evidence',
      reportingPeriod: 'FY 2025–26',
      entityName: 'Hydrocarbons',
      entityId: 'bu-hydrocarbons',
      pillar: 'environmental',
      uploadDate: '2026-09-04',
      verificationStatus: 'pending',
      fileSize: '1.2 MB',
      fileFormat: 'PDF',
      uploadedBy: 'K. Patel',
    },
    {
      id: 'doc-06',
      name: 'Zojila_Muck_Crushing_Utilization_Audit.pdf',
      category: 'Environmental Evidence',
      reportingPeriod: 'FY 2025–26',
      entityName: 'Zojila Pass All-Weather Tunnel Project',
      entityId: 'proj-zojila',
      pillar: 'environmental',
      uploadDate: '2026-09-14',
      verificationStatus: 'verified',
      fileSize: '3.1 MB',
      fileFormat: 'PDF',
      uploadedBy: 'H. C. Sharma',
    },
  ];

  // 8. DATA QUALITY ISSUES
  const initialIssues = [
    {
      id: 'iss-01',
      metricName: 'Scope 3 Supply Chain & Transport Emissions',
      entityName: 'MEIL – Parent Company',
      reportingPeriod: 'FY 2025–26',
      issueType: 'unverified',
      priority: 'HIGH',
      owner: 'P. Nair (Procurement ESG)',
      status: 'under_review',
      description: 'Tier 1 structural steel and cement supplier emissions reports are pending independent third-party assurance.',
      createdAt: '2026-09-15',
    },
    {
      id: 'iss-02',
      metricName: 'Q2 Potable Water Recycled Onsite',
      entityName: 'Kaleshwaram Lift Irrigation Pumping Package',
      reportingPeriod: 'FY 2025–26',
      issueType: 'incomplete',
      priority: 'MEDIUM',
      owner: 'T. Satyanarayana',
      status: 'open',
      description: 'Changes requested by HSE reviewer: ETP flowmeter calibration test certificate required.',
      createdAt: '2026-09-17',
    },
  ];

  // 9. REPORTING PERIODS
  const initialReportingPeriods = [
    { id: 'FY 2025–26', label: 'FY 2025–26', active: true, status: 'Active Reporting Cycle', currentYear: true },
    { id: 'FY 2024–25', label: 'FY 2024–25', active: true, status: 'Audited Prior Year', currentYear: false },
    { id: 'FY 2023–24', label: 'FY 2023–24', active: true, status: 'Historical Baseline', currentYear: false },
  ];

  return {
    users: [
      {
        userId: INITIAL_ADMIN.userId,
        name: INITIAL_ADMIN.name,
        email: INITIAL_ADMIN.email,
        department: INITIAL_ADMIN.department,
        role: INITIAL_ADMIN.role,
        salt,
        passwordHash,
        createdAt: new Date().toISOString(),
        lastLogin: null,
      },
    ],
    sessions: {},
    activeRole: 'SYSTEM ADMIN',
    entities: initialEntities,
    projects: initialProjects,
    metrics: initialMetrics,
    documents: initialDocuments,
    issues: initialIssues,
    reportingPeriods: initialReportingPeriods,
    auditLogs: [
      {
        id: 'log-sys-01',
        action: 'System Security Initialized',
        userId: 'SYSTEM',
        role: 'SYSTEM_SECURITY',
        module: 'Authentication & Access Control',
        entity: 'MEIL Group',
        recordId: 'SEC-INIT',
        previousValue: null,
        newValue: 'MANAGEMENT_ADMIN role enforcement enabled',
        date: new Date().toISOString().split('T')[0],
        time: '09:00 IST',
        timestamp: new Date().toISOString(),
        status: 'Completed',
        details: 'MEIL ESG & BRSR multi-user persistent database initialized with master organization schema.',
      },
    ],
    failedAttempts: {},
    lockouts: {},
  };
}

// Load or initialize DB from disk
function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      // Ensure all required collections exist
      if (parsed.entities && parsed.projects && parsed.metrics) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading database file:', err);
  }
  const initial = getInitialDatabase();
  saveDB(initial);
  return initial;
}

function saveDB(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database file:', err);
  }
}

let db = loadDB();

// Middleware: Authenticate Management Session
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: string;
    name: string;
  };
}

function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. No session token provided.' });
    return;
  }

  const token = authHeader.substring(7);
  const session = db.sessions[token];

  if (!session) {
    res.status(401).json({ error: 'Your session has expired. Please sign in again.' });
    return;
  }

  // Check expiration (30 minute inactivity timeout)
  const now = Date.now();
  if (session.expiresAt < now) {
    delete db.sessions[token];
    saveDB(db);
    res.status(401).json({ error: 'Your session has expired. Please sign in again.' });
    return;
  }

  // Slide expiration window
  session.expiresAt = now + 30 * 60 * 1000;
  db.sessions[token] = session;

  req.user = {
    userId: session.userId,
    role: session.role,
    name: session.name,
  };

  next();
}

// Helper: Add Audit Log
function logAudit(
  userId: string,
  role: string,
  action: string,
  module: string,
  entity: string,
  recordId: string,
  previousValue: any,
  newValue: any,
  details?: string
) {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} IST`;

  const logEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    action,
    userId,
    user: userId,
    role,
    module,
    entity,
    recordId,
    previousValue: previousValue !== undefined && previousValue !== null ? String(previousValue) : null,
    newValue: newValue !== undefined && newValue !== null ? String(newValue) : null,
    date: dateStr,
    time: timeStr,
    timestamp: now.toISOString(),
    status: 'Completed',
    details: details || `${userId} performed ${action} on ${entity} (${module}).`,
  };

  db.auditLogs.unshift(logEntry);
  if (db.auditLogs.length > 300) {
    db.auditLogs = db.auditLogs.slice(0, 300);
  }
  saveDB(db);
  return logEntry;
}

// -------------------------------------------------------------
// AUTHENTICATION API ROUTES
// -------------------------------------------------------------

// POST /api/auth/login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    res.status(400).json({ error: 'User ID and password are required.' });
    return;
  }

  const clientIP = req.ip || req.socket.remoteAddress || 'unknown';
  const lockoutKey = `${clientIP}_${userId}`;
  const now = Date.now();

  // Check lockout
  if (db.lockouts && db.lockouts[lockoutKey] && db.lockouts[lockoutKey] > now) {
    const remainingSecs = Math.ceil((db.lockouts[lockoutKey] - now) / 1000);
    res.status(429).json({
      error: `Too many failed login attempts. System locked for security. Please try again in ${remainingSecs} seconds.`,
    });
    return;
  }

  // Find user
  const user = db.users.find((u: any) => u.userId.toUpperCase() === userId.trim().toUpperCase());

  if (!user) {
    registerFailedAttempt(lockoutKey);
    logAudit(userId, 'UNKNOWN', 'Failed Login Attempt', 'Authentication', 'Portal Gate', 'AUTH', null, null, `Invalid user ID attempt from ${clientIP}`);
    res.status(401).json({ error: 'Invalid Management credentials.' });
    return;
  }

  // Verify password hash
  const computedHash = hashPassword(password, user.salt);
  if (computedHash !== user.passwordHash) {
    registerFailedAttempt(lockoutKey);
    logAudit(user.userId, user.role, 'Failed Login Attempt', 'Authentication', 'Portal Gate', 'AUTH', null, null, `Password mismatch for ${user.userId} from ${clientIP}`);
    res.status(401).json({ error: 'Invalid Management credentials.' });
    return;
  }

  // Verify MANAGEMENT_ADMIN role
  if (user.role !== 'MANAGEMENT_ADMIN') {
    logAudit(user.userId, user.role, 'Unauthorized Role Attempt', 'Authentication', 'Portal Gate', 'ROLE', user.role, 'MANAGEMENT_ADMIN', `User lacks required MANAGEMENT_ADMIN role`);
    res.status(403).json({ error: 'Unauthorized Management Access.' });
    return;
  }

  // Reset failed attempts on success
  if (db.failedAttempts && db.failedAttempts[lockoutKey]) {
    delete db.failedAttempts[lockoutKey];
  }

  // Create session
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = now + 30 * 60 * 1000; // 30 minutes

  db.sessions[token] = {
    userId: user.userId,
    name: user.name,
    role: user.role,
    department: user.department,
    createdAt: now,
    expiresAt,
  };

  user.lastLogin = new Date().toISOString();
  saveDB(db);

  logAudit(user.userId, user.role, 'Successful Management Login', 'Authentication', 'MEIL Group', 'SESSION', null, token.substring(0, 8) + '...', `Management Admin ${user.userId} authenticated successfully.`);

  res.json({
    message: 'Authentication successful',
    token,
    user: {
      userId: user.userId,
      name: user.name,
      role: user.role,
      department: user.department,
    },
    expiresAt,
  });
});

function registerFailedAttempt(lockoutKey: string) {
  if (!db.failedAttempts) db.failedAttempts = {};
  if (!db.lockouts) db.lockouts = {};

  const attempts = (db.failedAttempts[lockoutKey] || 0) + 1;
  db.failedAttempts[lockoutKey] = attempts;

  if (attempts >= 5) {
    db.lockouts[lockoutKey] = Date.now() + 5 * 60 * 1000; // 5 min lockout
    delete db.failedAttempts[lockoutKey];
  }
  saveDB(db);
}

// GET /api/auth/session
app.get('/api/auth/session', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    authenticated: true,
    user: req.user,
    activeRole: db.activeRole || 'SYSTEM ADMIN',
  });
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const session = db.sessions[token];
    if (session) {
      logAudit(session.userId, session.role, 'Management Logout', 'Authentication', 'Portal Gate', 'LOGOUT', null, null, `Session terminated for ${session.userId}.`);
      delete db.sessions[token];
      saveDB(db);
    }
  }
  res.json({ message: 'Session terminated successfully.' });
});

// POST /api/auth/change-password
app.post('/api/auth/change-password', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const user = db.users.find((u: any) => u.userId === req.user!.userId);

  if (!user) {
    res.status(404).json({ error: 'User not found.' });
    return;
  }

  const currentComputed = hashPassword(currentPassword, user.salt);
  if (currentComputed !== user.passwordHash) {
    res.status(400).json({ error: 'Current password does not match.' });
    return;
  }

  if (!newPassword || newPassword.length < 8) {
    res.status(400).json({ error: 'New password must be at least 8 characters with numbers and symbols.' });
    return;
  }

  const newSalt = crypto.randomBytes(16).toString('hex');
  user.salt = newSalt;
  user.passwordHash = hashPassword(newPassword, newSalt);
  saveDB(db);

  logAudit(user.userId, user.role, 'Password Rotated', 'Security', 'User Profile', user.userId, null, 'Updated password hash', `Management Administrator rotated credentials.`);

  res.json({ message: 'Password updated successfully.' });
});

// POST /api/auth/switch-role
app.post('/api/auth/switch-role', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { role } = req.body;
  db.activeRole = role || 'SYSTEM ADMIN';
  saveDB(db);
  logAudit(req.user!.userId, req.user!.role, 'Role Switched', 'RBAC', 'Session', 'ROLE', null, db.activeRole, `Demonstration role set to ${db.activeRole}.`);
  res.json({ success: true, activeRole: db.activeRole });
});

// ============================================================================
// FULL PERSISTENT DATA LAYER APIS (PAGES 16 & 17)
// ============================================================================

// GET /api/esg/state — Primary persistence read
app.get('/api/esg/state', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    entities: db.entities || [],
    projects: db.projects || [],
    metrics: db.metrics || [],
    documents: db.documents || [],
    issues: db.issues || [],
    reportingPeriods: db.reportingPeriods || [],
    auditLogs: db.auditLogs || [],
    activeRole: db.activeRole || 'SYSTEM ADMIN',
  });
});

// POST /api/esg/entities — Add organization entity
app.post('/api/esg/entities', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const entityData = req.body;

  if (!entityData.name || !entityData.name.trim()) {
    res.status(400).json({ error: 'Entity name cannot be empty.' });
    return;
  }

  const id = entityData.id || `ent-${Date.now()}`;

  // Check unique ID
  if (db.entities.some((e: any) => e.id === id)) {
    res.status(400).json({ error: `Entity ID "${id}" already exists.` });
    return;
  }

  // Prevent circular parent-child relationships
  if (entityData.parentId) {
    let currParent = entityData.parentId;
    while (currParent) {
      if (currParent === id) {
        res.status(400).json({ error: 'Circular parent-child relationship is prohibited.' });
        return;
      }
      const parentObj = db.entities.find((e: any) => e.id === currParent);
      currParent = parentObj ? parentObj.parentId : null;
    }
  }

  const nowStr = new Date().toISOString().split('T')[0];
  const newEntity = {
    ...entityData,
    id,
    name: entityData.name.trim(),
    status: entityData.status || 'ACTIVE',
    createdBy: req.user!.userId,
    createdDate: nowStr,
    lastModifiedBy: req.user!.userId,
    lastModifiedDate: nowStr,
  };

  db.entities.push(newEntity);
  saveDB(db);

  logAudit(
    req.user!.userId,
    req.user!.role,
    'Entity Created',
    'Organization Management',
    newEntity.name,
    newEntity.id,
    null,
    `${newEntity.type} (${newEntity.name})`,
    `Created ${newEntity.type} "${newEntity.name}" under parent "${newEntity.parentId || 'root'}".`
  );

  res.json({ success: true, entity: newEntity });
});

// PUT /api/esg/entities/:id — Edit entity, activate/deactivate, move entity
app.put('/api/esg/entities/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const idx = db.entities.findIndex((e: any) => e.id === id);
  if (idx === -1) {
    res.status(404).json({ error: `Entity with ID "${id}" not found.` });
    return;
  }

  const previous = { ...db.entities[idx] };

  // Circular parent check if moving entity
  if (updates.parentId && updates.parentId !== previous.parentId) {
    let curr = updates.parentId;
    while (curr) {
      if (curr === id) {
        res.status(400).json({ error: 'Cannot move entity inside its own child hierarchy (circular relationship).' });
        return;
      }
      const p = db.entities.find((e: any) => e.id === curr);
      curr = p ? p.parentId : null;
    }
  }

  db.entities[idx] = {
    ...db.entities[idx],
    ...updates,
    lastModifiedBy: req.user!.userId,
    lastModifiedDate: new Date().toISOString().split('T')[0],
  };

  saveDB(db);

  logAudit(
    req.user!.userId,
    req.user!.role,
    updates.status && updates.status !== previous.status ? `Entity Status ${updates.status}` : 'Entity Modified',
    'Organization Management',
    db.entities[idx].name,
    id,
    previous.parentId !== updates.parentId ? `Parent: ${previous.parentId}` : previous.status,
    updates.parentId ? `Parent: ${updates.parentId}` : updates.status,
    `Updated entity "${db.entities[idx].name}".`
  );

  res.json({ success: true, entity: db.entities[idx] });
});

// POST /api/esg/projects — Add project
app.post('/api/esg/projects', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const projectData = req.body;

  if (!projectData.name || !projectData.name.trim()) {
    res.status(400).json({ error: 'Project name is required.' });
    return;
  }

  const id = projectData.id || `proj-${Date.now()}`;
  const nowStr = new Date().toISOString().split('T')[0];

  const newProject = {
    ...projectData,
    id,
    projectId: projectData.projectId || `PRJ-${Math.floor(100 + Math.random() * 900)}`,
    status: projectData.status || 'ACTIVE',
    projectStatus: projectData.projectStatus || 'ACTIVE',
    completeness: projectData.completeness ?? 0,
    documentsCount: projectData.documentsCount ?? 0,
    lastUpdated: nowStr,
  };

  db.projects.push(newProject);

  // Also add to entities list as a Project / Site node so tree selector works seamlessly
  db.entities.push({
    id,
    name: newProject.name,
    type: 'Project / Site',
    level: 'project',
    parentId: newProject.businessUnitId || newProject.parentCompanyId || 'meil-parent',
    location: newProject.location || 'Site',
    state: newProject.state || 'India',
    country: newProject.country || 'India',
    responsibleManager: newProject.projectManager || 'Project Manager',
    esgOwner: newProject.esgManager || 'ESG Site Officer',
    reportingBoundary: newProject.reportingBoundary || 'Site Construction & Commissioning',
    financialYear: newProject.financialYear || 'FY 2025–26',
    status: 'ACTIVE',
    createdBy: req.user!.userId,
    createdDate: nowStr,
    lastModifiedBy: req.user!.userId,
    lastModifiedDate: nowStr,
  });

  saveDB(db);

  logAudit(
    req.user!.userId,
    req.user!.role,
    'Project Created',
    'Project Management',
    newProject.name,
    newProject.id,
    null,
    newProject.projectId,
    `Created project "${newProject.name}" under ${newProject.businessUnitName || 'MEIL Group'}.`
  );

  res.json({ success: true, project: newProject });
});

// PUT /api/esg/projects/:id — Update project
app.put('/api/esg/projects/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const idx = db.projects.findIndex((p: any) => p.id === id);
  if (idx === -1) {
    res.status(404).json({ error: `Project with ID "${id}" not found.` });
    return;
  }

  const previous = { ...db.projects[idx] };
  db.projects[idx] = {
    ...db.projects[idx],
    ...updates,
    lastUpdated: new Date().toISOString().split('T')[0],
  };

  saveDB(db);

  logAudit(
    req.user!.userId,
    req.user!.role,
    'Project Modified',
    'Project Management',
    db.projects[idx].name,
    id,
    previous.status,
    updates.status || 'Updated',
    `Updated project "${db.projects[idx].name}".`
  );

  res.json({ success: true, project: db.projects[idx] });
});

// POST /api/esg/metrics — Create ESG record
app.post('/api/esg/metrics', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const metricData = req.body;

  if (!metricData.metricName || !metricData.metricName.trim()) {
    res.status(400).json({ error: 'Metric name is required.' });
    return;
  }

  const id = metricData.id || `m-${Date.now()}`;
  const nowStr = new Date().toISOString().split('T')[0];

  const newMetric = {
    ...metricData,
    id,
    recordId: metricData.recordId || `ESG-REC-${Math.floor(100 + Math.random() * 900)}`,
    approvalStatus: metricData.approvalStatus || 'DRAFT',
    verificationStatus: metricData.verificationStatus || 'unverified',
    status: metricData.value !== null ? 'reported' : 'unreported',
    createdDate: nowStr,
    lastUpdated: nowStr,
    updatedBy: req.user!.userId,
  };

  db.metrics.push(newMetric);
  saveDB(db);

  logAudit(
    req.user!.userId,
    req.user!.role,
    'ESG Data Created',
    `${newMetric.pillar} / ${newMetric.category}`,
    newMetric.entityName,
    newMetric.recordId,
    null,
    `${newMetric.value} ${newMetric.unit}`,
    `${req.user!.userId} created ESG record for ${newMetric.metricName} (${newMetric.approvalStatus}).`
  );

  res.json({ success: true, metric: newMetric });
});

// PUT /api/esg/metrics/:id — Update ESG record
app.put('/api/esg/metrics/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  const idx = db.metrics.findIndex((m: any) => m.id === id);
  if (idx === -1) {
    res.status(404).json({ error: `Metric with ID "${id}" not found.` });
    return;
  }

  const previous = { ...db.metrics[idx] };

  // If locked, reject modification unless authorized
  if (previous.approvalStatus === 'LOCKED' && updates.approvalStatus !== 'UNLOCKED') {
    res.status(403).json({ error: 'Record is LOCKED. Controlled audit revision workflow required.' });
    return;
  }

  db.metrics[idx] = {
    ...db.metrics[idx],
    ...updates,
    status: (updates.value !== undefined ? updates.value !== null : previous.value !== null) ? 'reported' : 'unreported',
    lastUpdated: new Date().toISOString().split('T')[0],
    updatedBy: req.user!.userId,
  };

  saveDB(db);

  logAudit(
    req.user!.userId,
    req.user!.role,
    'ESG Data Modified',
    `${db.metrics[idx].pillar} / ${db.metrics[idx].category}`,
    db.metrics[idx].entityName,
    db.metrics[idx].recordId || id,
    `${previous.value} ${previous.unit}`,
    `${db.metrics[idx].value} ${db.metrics[idx].unit}`,
    `${req.user!.userId} modified ${db.metrics[idx].metricName} (${previous.value} -> ${db.metrics[idx].value} ${db.metrics[idx].unit}).`
  );

  res.json({ success: true, metric: db.metrics[idx] });
});

// POST /api/esg/metrics/:id/transition — Workflow transition (SUBMIT, REVIEW, APPROVE, REQUEST_CHANGES, REJECT, LOCK)
app.post('/api/esg/metrics/:id/transition', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { action, comments } = req.body; // 'SUBMIT' | 'REVIEW' | 'APPROVE' | 'REQUEST_CHANGES' | 'REJECT' | 'LOCK'

  const idx = db.metrics.findIndex((m: any) => m.id === id);
  if (idx === -1) {
    res.status(404).json({ error: `Metric with ID "${id}" not found.` });
    return;
  }

  const previousStatus = db.metrics[idx].approvalStatus;
  let newStatus = previousStatus;

  if (action === 'SUBMIT') newStatus = 'SUBMITTED';
  else if (action === 'REVIEW') newStatus = 'UNDER REVIEW';
  else if (action === 'APPROVE') newStatus = 'APPROVED';
  else if (action === 'REQUEST_CHANGES') newStatus = 'CHANGES REQUESTED';
  else if (action === 'REJECT') newStatus = 'CHANGES REQUESTED';
  else if (action === 'LOCK') newStatus = 'LOCKED';

  db.metrics[idx].approvalStatus = newStatus;
  if (comments) db.metrics[idx].comments = comments;
  if (action === 'APPROVE') db.metrics[idx].verificationStatus = 'verified';
  if (action === 'APPROVE' || action === 'REVIEW') db.metrics[idx].reviewedBy = req.user!.name || req.user!.userId;

  saveDB(db);

  logAudit(
    req.user!.userId,
    req.user!.role,
    `ESG Workflow: ${newStatus}`,
    `${db.metrics[idx].pillar} / ${db.metrics[idx].category}`,
    db.metrics[idx].entityName,
    db.metrics[idx].recordId || id,
    previousStatus,
    newStatus,
    `Status transitioned from "${previousStatus}" to "${newStatus}" by ${req.user!.userId}. Comments: ${comments || 'None'}`
  );

  res.json({ success: true, metric: db.metrics[idx] });
});

// POST /api/esg/documents — Register evidence document metadata
app.post('/api/esg/documents', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const doc = req.body;
  const id = `doc-${Date.now()}`;
  const nowStr = new Date().toISOString().split('T')[0];

  const newDoc = {
    ...doc,
    id,
    uploadDate: nowStr,
    uploadedBy: req.user!.userId,
    verificationStatus: doc.verificationStatus || 'verified',
  };

  db.documents.push(newDoc);
  saveDB(db);

  logAudit(
    req.user!.userId,
    req.user!.role,
    'Evidence Document Uploaded',
    'Evidence Management',
    newDoc.entityName || 'MEIL Group',
    id,
    null,
    newDoc.name,
    `Uploaded evidence document "${newDoc.name}" for ${newDoc.entityName}.`
  );

  res.json({ success: true, document: newDoc });
});

// POST /api/esg/reporting-periods — Add reporting period
app.post('/api/esg/reporting-periods', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { periodId } = req.body;
  if (!periodId || !periodId.trim()) {
    res.status(400).json({ error: 'Reporting period name is required.' });
    return;
  }

  if (db.reportingPeriods.some((p: any) => p.id === periodId.trim())) {
    res.status(400).json({ error: 'Reporting period already exists.' });
    return;
  }

  const newPeriod = {
    id: periodId.trim(),
    label: periodId.trim(),
    active: true,
    status: 'Active Reporting Cycle',
    currentYear: false,
  };

  db.reportingPeriods.push(newPeriod);
  saveDB(db);

  logAudit(
    req.user!.userId,
    req.user!.role,
    'Reporting Period Created',
    'System Configuration',
    'MEIL Group',
    newPeriod.id,
    null,
    newPeriod.id,
    `Created new financial reporting period: ${newPeriod.id}`
  );

  res.json({ success: true, period: newPeriod });
});

// GET /api/esg/consolidation — Hierarchical Consolidation Engine
app.get('/api/esg/consolidation', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { period = 'FY 2025–26', category } = req.query;

  // Filter only APPROVED and LOCKED metrics
  let approvedMetrics = db.metrics.filter(
    (m: any) =>
      m.reportingPeriod === period &&
      (m.approvalStatus === 'APPROVED' || m.approvalStatus === 'LOCKED') &&
      m.value !== null
  );

  if (category) {
    approvedMetrics = approvedMetrics.filter((m: any) => m.category === category);
  }

  // Calculate hierarchical contributions
  const consolidationMap: Record<string, any> = {};

  approvedMetrics.forEach((m: any) => {
    if (!consolidationMap[m.metricName]) {
      consolidationMap[m.metricName] = {
        metricName: m.metricName,
        category: m.category,
        pillar: m.pillar,
        unit: m.unit,
        financialYear: period,
        totalConsolidated: 0,
        approvedRecordsCount: 0,
        contributions: [],
      };
    }

    consolidationMap[m.metricName].totalConsolidated += Number(m.value) || 0;
    consolidationMap[m.metricName].approvedRecordsCount += 1;
    consolidationMap[m.metricName].contributions.push({
      recordId: m.recordId || m.id,
      entityId: m.entityId,
      entityName: m.entityName,
      entityLevel: m.entityLevel,
      value: m.value,
      unit: m.unit,
      source: m.source,
      evidenceDocument: m.evidenceDocument || m.supportingDocName,
      approvalStatus: m.approvalStatus,
      submittedBy: m.submittedBy,
      reviewedBy: m.reviewedBy,
    });
  });

  res.json({
    period,
    consolidatedMetrics: Object.values(consolidationMap),
    totalApprovedRecords: approvedMetrics.length,
  });
});

// POST /api/esg/reset-database
app.post('/api/esg/reset-database', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  db = getInitialDatabase();
  saveDB(db);
  logAudit(req.user!.userId, req.user!.role, 'Database Reset to Baseline', 'System Settings', 'MEIL Group', 'DB-RESET', null, 'Initial seed master data', `System restored to master seed state.`);
  res.json({ message: 'Database reset to master seed state.' });
});

// -------------------------------------------------------------
// SERVER & VITE INTEGRATION
// -------------------------------------------------------------

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Vite middleware in development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MEIL ESG & BRSR Server running on port ${PORT} [${isProd ? 'PRODUCTION' : 'DEVELOPMENT'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
