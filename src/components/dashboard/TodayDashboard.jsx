import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { ProgressRing } from '../common/ProgressRing.jsx';
import { MotivationalBanner } from '../common/MotivationalBanner.jsx';
import { SectionCard } from './SectionCard.jsx';
import { DailySummaryCard } from './DailySummaryCard.jsx';
import { SectionEditorModal } from '../settings/SectionEditorModal.jsx';
import { TaskEditorModal } from '../settings/TaskEditorModal.jsx';
import { Sparkles, PlusCircle, Layers, Info } from 'lucide-react';
import { formatPercentage } from '../../services/calculationEngine.js';

export function TodayDashboard() {
  const {
    dailyMetrics,
    streaks,
    selectedDateStr,
    todayKey,
    addSection,
    updateSection,
    addTask,
    updateTask,
    t
  } = useApp();

  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [activeSectionIdForTask, setActiveSectionIdForTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const isToday = selectedDateStr === todayKey;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5  && hour < 12) return t('greetings.morning');
    if (hour >= 12 && hour < 17) return t('greetings.afternoon');
    if (hour >= 17 && hour < 22) return t('greetings.evening');
    return t('greetings.night');
  };

  const handleOpenAddSection = () => { setEditingSection(null); setSectionModalOpen(true); };
  const handleOpenEditSection = (section) => { setEditingSection(section); setSectionModalOpen(true); };
  const handleOpenAddTask = (sectionId) => { setActiveSectionIdForTask(sectionId); setEditingTask(null); setTaskModalOpen(true); };
  const handleOpenEditTask = (sectionId, task) => { setActiveSectionIdForTask(sectionId); setEditingTask(task); setTaskModalOpen(true); };

  const handleSaveSection = (data) => {
    if (editingSection) { updateSection(editingSection.id, data); }
    else { addSection(data); }
  };
  const handleSaveTask = (data) => {
    if (editingTask) { updateTask(activeSectionIdForTask, editingTask.id, data); }
    else { addTask(activeSectionIdForTask, data); }
  };

  const sections = dailyMetrics.computedSections || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }} className="animate-fade-in">

      {/* Past Day Banner */}
      {!isToday && (
        <div style={{
          padding: '0.875rem 1rem',
          borderRadius: '14px',
          background: 'var(--warning-bg)',
          border: '1.5px solid var(--warning-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: 'var(--warning-text)',
        }}>
          <Info style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
          <span>{t('viewingPastDay')} ({selectedDateStr}) — {t('retroactiveEditNotice')}</span>
        </div>
      )}

      {/* Hero Card */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div className="hero-card-layout">

          {/* Left: Greeting & Stats */}
          <div className="hero-left-col">
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              background: 'var(--brand-100)',
              border: '1px solid var(--brand-200)',
              marginBottom: '0.625rem',
            }}>
              <Sparkles style={{ width: '0.8rem', height: '0.8rem', color: 'var(--brand-500)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-600)' }}>
                {isToday ? getGreeting() : selectedDateStr}
              </span>
            </div>

            <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              {t('todayProgress')}
            </h2>
            <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              {t('dailyGoalProgress')} — {dailyMetrics.activeSectionsCount} {t('activeSectionsCount')} ({formatPercentage(dailyMetrics.sectionWeight)} {t('sectionWeight')})
            </p>

            {/* Micro-stats */}
            <div className="hero-micro-stats">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--brand-500)', display: 'inline-block' }} />
                <span>{dailyMetrics.totalCompletedTasks} {t('tasksCompletedOf')} {dailyMetrics.totalTasksCount}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E05252', display: 'inline-block' }} />
                <span>{streaks.currentStreak} {t('days')} {t('currentStreak')}</span>
              </div>
            </div>
          </div>

          {/* Right: Progress Ring */}
          <div style={{ display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
            <ProgressRing
              progress={dailyMetrics.dailyProgress}
              size={120}
              strokeWidth={10}
              label={t('todayProgress')}
              colorClass="text-emerald-600 dark:text-emerald-400"
            />
          </div>
        </div>

        {/* Motivational Banner */}
        <div style={{ marginTop: '1rem', paddingTop: '0.875rem', borderTop: '1.5px solid var(--border-soft)' }}>
          <MotivationalBanner />
        </div>
      </div>

      {/* Sections Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {t('appName')}
          </h3>
          <p style={{ margin: '0.1rem 0 0', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {sections.length} {t('activeSectionsCount')}
          </p>
        </div>

        <button
          type="button"
          id="btn-add-section"
          onClick={handleOpenAddSection}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.45rem 0.875rem',
            borderRadius: '10px',
            background: 'var(--brand-500)',
            border: '1.5px solid var(--brand-600)',
            color: '#fff',
            fontSize: '0.775rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            transition: 'var(--transition-fast)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--brand-600)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--brand-500)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
        >
          <PlusCircle style={{ width: '0.9rem', height: '0.9rem' }} />
          <span>{t('addNewSection')}</span>
        </button>
      </div>

      {/* Sections Grid */}
      {sections.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '2.5rem 1.25rem',
          borderRadius: '20px',
          border: '2px dashed var(--border-medium)',
          background: 'var(--bg-surface)',
        }}>
          <Layers style={{ width: '2.25rem', height: '2.25rem', color: 'var(--text-faint)', margin: '0 auto 0.75rem' }} />
          <h4 style={{ margin: '0 0 0.375rem', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {t('noSectionsFound')}
          </h4>
          <p style={{ margin: '0 0 1rem', fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: '24rem', marginInline: 'auto' }}>
            {t('emptyDayDesc')}
          </p>
          <button
            onClick={handleOpenAddSection}
            style={{
              padding: '0.55rem 1.125rem',
              borderRadius: '10px',
              background: 'var(--brand-500)',
              border: 'none',
              color: '#fff',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {t('addNewSection')}
          </button>
        </div>
      ) : (
        <div className="sections-grid">
          {sections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              onEditSection={handleOpenEditSection}
              onAddTask={handleOpenAddTask}
              onEditTask={handleOpenEditTask}
            />
          ))}
        </div>
      )}

      <DailySummaryCard />

      <SectionEditorModal
        isOpen={sectionModalOpen}
        onClose={() => setSectionModalOpen(false)}
        initialSection={editingSection}
        onSave={handleSaveSection}
      />
      <TaskEditorModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        initialTask={editingTask}
        onSave={handleSaveTask}
      />
    </div>
  );
}
