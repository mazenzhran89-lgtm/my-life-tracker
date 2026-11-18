import React from 'react';
import { AppProvider, useApp } from './context/AppContext.jsx';
import { Header } from './components/common/Header.jsx';
import { ToastContainer } from './components/common/ToastContainer.jsx';
import { TodayDashboard } from './components/dashboard/TodayDashboard.jsx';
import { HistoryView } from './components/history/HistoryView.jsx';
import { InsightsView } from './components/insights/InsightsView.jsx';
import { SettingsView } from './components/settings/SettingsView.jsx';

function MainContent() {
  const { activeTab, t } = useApp();

  return (
    <div className="page-container">
      <Header />

      <main className="content-wrapper">
        {activeTab === 'today'    && <TodayDashboard />}
        {activeTab === 'history'  && <HistoryView />}
        {activeTab === 'insights' && <InsightsView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      <footer style={{
        borderTop: '1.5px solid var(--border-soft)',
        padding: '1.25rem 0',
        textAlign: 'center',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        background: 'var(--bg-surface)',
      }}>
        {t('appName')} • {t('appSubtitle')}
      </footer>

      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
