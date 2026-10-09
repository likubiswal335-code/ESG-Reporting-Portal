/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { ChangePasswordModal } from './components/auth/ChangePasswordModal';

import { Sidebar, NavRoute } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { Footer } from './components/layout/Footer';

// Pages
import { OverviewPage } from './pages/OverviewPage';
import { DashboardPage } from './pages/DashboardPage';
import { EnvironmentalPage } from './pages/EnvironmentalPage';
import { SocialPage } from './pages/SocialPage';
import { GovernancePage } from './pages/GovernancePage';
import { EsgDataPage } from './pages/EsgDataPage';
import { DataQualityPage } from './pages/DataQualityPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { OrganizationPage } from './pages/OrganizationPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { BrsrReportingPage } from './pages/BrsrReportingPage';
import { ReportsPage } from './pages/ReportsPage';
import { AuditLogPage } from './pages/AuditLogPage';
import { SettingsPage } from './pages/SettingsPage';

// Modals & Assistant
import { DataEntryModal } from './components/modals/DataEntryModal';
import { AddEntityModal } from './components/modals/AddEntityModal';
import { AddDocumentModal } from './components/modals/AddDocumentModal';
import { SearchModal } from './components/modals/SearchModal';
import { EsgAssistantDrawer } from './components/assistant/EsgAssistantDrawer';

// Hook & Types
import { useESGData } from './hooks/useESGData';
import { ReportingPeriod, ESGMetricEntry } from './types/esg';
import { Loader2, ShieldCheck } from 'lucide-react';

export default function App() {
  return (
    <AuthProvider>
      <MainAppController />
    </AuthProvider>
  );
}

function MainAppController() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<NavRoute>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState<ReportingPeriod>('FY 2025–26');
  const [selectedEntityId, setSelectedEntityId] = useState<string>('meil-group');

  // UI States
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // Modal States
  const [isDataEntryOpen, setIsDataEntryOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<ESGMetricEntry | null>(null);
  const [isAddEntityOpen, setIsAddEntityOpen] = useState(false);
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  const [dataGridPillarFilter, setDataGridPillarFilter] = useState<string | undefined>(undefined);

  // ESG Reactive Data Store
  const {
    entities,
    metrics,
    allMetrics,
    issues,
    documents,
    projects,
    auditLogs,
    stats,
    store,
  } = useESGData(selectedPeriod, selectedEntityId);

  // Sync route in browser history
  useEffect(() => {
    if (!isAuthenticated) {
      if (window.location.pathname !== '/login') {
        window.history.replaceState({}, '', '/login');
      }
    } else {
      if (window.location.pathname === '/login' || window.location.pathname === '/') {
        window.history.replaceState({}, '', `/${currentRoute}`);
      }
    }
  }, [isAuthenticated, currentRoute]);

  // Loading screen while verifying management session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f0f7fd] flex flex-col items-center justify-center p-4 text-center select-none font-sans">
        <div className="w-16 h-16 rounded-2xl bg-white shadow-xl shadow-sky-900/10 border border-sky-100 flex items-center justify-center mb-4">
          <Loader2 size={32} className="text-[#0284c7] animate-spin" />
        </div>
        <h2 className="text-base font-serif font-bold text-[#0f284c]">
          Megha Engineering &amp; Infrastructures Limited
        </h2>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>Verifying Secure Management Session...</span>
        </p>
      </div>
    );
  }

  // 1. APPLICATION ENTRY POINT: If not authenticated, ALWAYS show LoginPage
  if (!isAuthenticated) {
    return <LoginPage onSuccess={() => setCurrentRoute('overview')} />;
  }

  // Handlers
  const handleOpenDataEntry = (metricToEdit?: ESGMetricEntry) => {
    setEditingMetric(metricToEdit || null);
    setIsDataEntryOpen(true);
  };

  const handleSaveMetric = (newMetric: Omit<ESGMetricEntry, 'id' | 'lastUpdated'>) => {
    store.addMetric(newMetric);
  };

  const handleUpdateMetric = (id: string, updates: Partial<ESGMetricEntry>) => {
    store.updateMetric(id, updates);
  };

  const handleDeleteMetric = (id: string) => {
    store.deleteMetric(id);
  };

  const handleResolveIssue = (issueId: string) => {
    store.resolveIssue(issueId);
  };

  const handleNavigateWithFilter = (route: NavRoute, filterParam?: string) => {
    if (filterParam) {
      setDataGridPillarFilter(filterParam);
    }
    setCurrentRoute(route);
  };

  const openIssuesCount = issues.filter((i) => i.status !== 'resolved').length;

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden text-slate-900 font-sans">
      {/* 8. Collapsible Sidebar */}
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={(route) => {
          setDataGridPillarFilter(undefined);
          setCurrentRoute(route);
        }}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* 9. Topbar with Management Admin Status and Logout */}
        <Topbar
          currentRoute={currentRoute}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          selectedEntityId={selectedEntityId}
          onEntityChange={setSelectedEntityId}
          entities={entities}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAssistant={() => setIsAssistantOpen(true)}
          openDataIssuesCount={openIssuesCount}
          user={user}
          onLogout={logout}
          onOpenChangePassword={() => setIsChangePasswordOpen(true)}
        />

        {/* Dynamic Route Content Body */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 scrollbar-thin">
          {currentRoute === 'overview' && (
            <OverviewPage
              onNavigate={setCurrentRoute}
              entities={entities}
              metrics={metrics}
              currentPeriod={selectedPeriod}
              completeness={stats}
            />
          )}

          {currentRoute === 'dashboard' && (
            <DashboardPage
              entities={entities}
              metrics={metrics}
              issues={issues}
              auditLogs={auditLogs}
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
              selectedEntityId={selectedEntityId}
              onEntityChange={setSelectedEntityId}
              onNavigate={setCurrentRoute}
              onOpenDataEntry={() => handleOpenDataEntry()}
              onResolveIssue={handleResolveIssue}
              completeness={stats}
            />
          )}

          {currentRoute === 'environmental' && (
            <EnvironmentalPage
              metrics={allMetrics}
              currentPeriod={selectedPeriod}
              selectedEntityId={selectedEntityId}
              entities={entities}
              onOpenDataEntry={handleOpenDataEntry}
              onNavigateDocuments={() => setCurrentRoute('documents')}
            />
          )}

          {currentRoute === 'social' && (
            <SocialPage
              metrics={allMetrics}
              currentPeriod={selectedPeriod}
              selectedEntityId={selectedEntityId}
              entities={entities}
              onOpenDataEntry={handleOpenDataEntry}
              onNavigateDocuments={() => setCurrentRoute('documents')}
            />
          )}

          {currentRoute === 'governance' && (
            <GovernancePage
              metrics={allMetrics}
              currentPeriod={selectedPeriod}
              selectedEntityId={selectedEntityId}
              entities={entities}
              onOpenDataEntry={handleOpenDataEntry}
              onNavigateDocuments={() => setCurrentRoute('documents')}
            />
          )}

          {currentRoute === 'esg-data' && (
            <EsgDataPage
              metrics={allMetrics}
              entities={entities}
              currentPeriod={selectedPeriod}
              onOpenDataEntry={handleOpenDataEntry}
              onDeleteMetric={handleDeleteMetric}
              initialPillarFilter={dataGridPillarFilter}
              onNavigateDocuments={() => setCurrentRoute('documents')}
            />
          )}

          {currentRoute === 'data-quality' && (
            <DataQualityPage
              issues={issues}
              metrics={allMetrics}
              currentPeriod={selectedPeriod}
              onResolveIssue={handleResolveIssue}
              onOpenDataEntry={handleOpenDataEntry}
            />
          )}

          {currentRoute === 'documents' && (
            <DocumentsPage
              documents={documents}
              currentPeriod={selectedPeriod}
              entities={entities}
              onOpenAddDocument={() => setIsAddDocumentOpen(true)}
            />
          )}

          {currentRoute === 'organization' && (
            <OrganizationPage
              entities={entities}
              metrics={allMetrics}
              currentPeriod={selectedPeriod}
              selectedEntityId={selectedEntityId}
              onEntityChange={setSelectedEntityId}
              onOpenAddEntity={() => setIsAddEntityOpen(true)}
              onNavigate={setCurrentRoute}
            />
          )}

          {currentRoute === 'projects' && (
            <ProjectsPage
              projects={projects}
              currentPeriod={selectedPeriod}
              entities={entities}
              onOpenAddEntity={() => setIsAddEntityOpen(true)}
              onNavigate={setCurrentRoute}
              onSelectProject={(pId) => {
                setSelectedEntityId(pId);
                setCurrentRoute('esg-data');
              }}
            />
          )}

          {currentRoute === 'brsr' && (
            <BrsrReportingPage
              metrics={allMetrics}
              currentPeriod={selectedPeriod}
              entities={entities}
              completeness={stats}
              onNavigate={setCurrentRoute}
            />
          )}

          {currentRoute === 'reports' && (
            <ReportsPage
              metrics={allMetrics}
              currentPeriod={selectedPeriod}
              entities={entities}
              completeness={stats}
            />
          )}

          {currentRoute === 'audit-log' && (
            <AuditLogPage
              auditLogs={auditLogs}
              currentPeriod={selectedPeriod}
            />
          )}

          {currentRoute === 'settings' && (
            <SettingsPage
              currentPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
            />
          )}
        </main>

        {/* 34. Enterprise Footer */}
        <Footer />
      </div>

      {/* Modals & Drawers */}
      <DataEntryModal
        isOpen={isDataEntryOpen}
        onClose={() => setIsDataEntryOpen(false)}
        onSave={handleSaveMetric}
        onUpdate={handleUpdateMetric}
        initialData={editingMetric}
        entities={entities}
        currentPeriod={selectedPeriod}
      />

      <AddEntityModal
        isOpen={isAddEntityOpen}
        onClose={() => setIsAddEntityOpen(false)}
        onSave={(newEntity) => store.addEntity(newEntity)}
        parentEntities={entities}
      />

      <AddDocumentModal
        isOpen={isAddDocumentOpen}
        onClose={() => setIsAddDocumentOpen(false)}
        onSave={(newDoc) => store.addDocument(newDoc)}
        entities={entities}
        currentPeriod={selectedPeriod}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        entities={entities}
        metrics={allMetrics}
        documents={documents}
        onNavigate={handleNavigateWithFilter}
      />

      {/* MEIL ESG Assistant Drawer */}
      <EsgAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        metrics={allMetrics}
        entities={entities}
        currentPeriod={selectedPeriod}
        completeness={stats}
      />

      {/* Rotate Management Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
}
