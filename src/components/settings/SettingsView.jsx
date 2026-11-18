import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext.jsx';
import { SectionEditorModal } from './SectionEditorModal.jsx';
import { TaskEditorModal } from './TaskEditorModal.jsx';
import { IconRenderer } from '../common/IconRenderer.jsx';
import {
  Sliders, Sun, Moon, Layers, Plus, Edit3, Trash2,
  ArrowUp, ArrowDown, Download, Upload, AlertTriangle
} from 'lucide-react';
import { COLOR_MAP } from '../../constants/defaultData.js';
import { getLocalizedText } from '../../locales/index.js';

/* ── Small helpers ─────────────────────────────────────── */
const sectionBox = {
  background: 'var(--bg-card)',
  border: '1.5px solid var(--border-soft)',
  borderRadius: '20px',
  padding: '1.25rem 1.375rem',
  boxShadow: 'var(--shadow-xs)',
  marginBottom: '0',
};

function SectionHeader({ icon, title, subtitle }) {
  return (
    <div style={{ paddingBottom: '0.875rem', borderBottom: '1.5px solid var(--border-soft)', marginBottom: '1rem' }}>
      <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
        {icon}
        {title}
      </h3>
      {subtitle && <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{subtitle}</p>}
    </div>
  );
}

function ChoiceBtn({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '0.6rem 0.75rem',
        borderRadius: '10px',
        border: `1.5px solid ${active ? 'var(--brand-500)' : 'var(--border-medium)'}`,
        background: active ? 'var(--brand-500)' : 'var(--bg-subtle)',
        color: active ? '#fff' : 'var(--text-secondary)',
        fontSize: '0.8rem',
        fontWeight: 700,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.375rem',
        transition: 'all 0.15s ease',
        boxShadow: active ? 'var(--shadow-sm)' : 'none',
      }}
    >
      {children}
    </button>
  );
}

function IconBtn({ onClick, disabled, danger, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        padding: '0.4rem',
        borderRadius: '8px',
        border: `1.5px solid ${danger ? 'var(--error-border)' : 'var(--border-soft)'}`,
        background: danger ? 'var(--error-bg)' : 'var(--bg-subtle)',
        color: danger ? 'var(--error-text)' : 'var(--text-secondary)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s ease',
      }}
    >
      {children}
    </button>
  );
}

function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }) {
  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem', background: 'rgba(28,24,20,0.55)',
        backdropFilter: 'blur(4px)', animation: 'fadeIn 0.18s ease-out',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          width: '100%', maxWidth: '22rem',
          background: 'var(--bg-card)',
          border: '1.5px solid var(--border-medium)',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-xl)',
          padding: '1.25rem',
          animation: 'popIn 0.22s cubic-bezier(0.16,1,0.3,1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
          <AlertTriangle style={{ width: '1rem', height: '1rem', color: 'var(--error-text)', flexShrink: 0 }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--error-text)' }}>{title}</span>
        </div>
        <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '0.45rem 1rem', borderRadius: '8px',
              border: '1.5px solid var(--border-medium)',
              background: 'var(--bg-subtle)', color: 'var(--text-secondary)',
              fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
            }}
          >
            إلغاء / Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '0.45rem 1rem', borderRadius: '8px',
              background: 'var(--error-text)', border: '1.5px solid var(--error-text)',
              color: '#fff', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ── Main Component ──────────────────────────────────────── */
export function SettingsView() {
  const {
    settings, updateSettings, masterSections,
    addSection, updateSection, deleteSection,
    addTask, updateTask, deleteTask,
    reorderSections, exportBackup, importBackup, resetSystem, t
  } = useApp();

  const fileInputRef = useRef(null);
  const [sectionModalOpen, setSectionModalOpen]     = useState(false);
  const [editingSection,   setEditingSection]       = useState(null);
  const [taskModalOpen,    setTaskModalOpen]         = useState(false);
  const [activeSecIdForTask, setActiveSecIdForTask] = useState(null);
  const [editingTask,      setEditingTask]           = useState(null);
  const [confirmDeleteSecId, setConfirmDeleteSecId] = useState(null);
  const [showResetConfirm,   setShowResetConfirm]   = useState(false);

  const isArabic = settings.language === 'ar';

  const handleMoveSection = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= masterSections.length) return;
    const reordered = [...masterSections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    reorderSections(reordered);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') importBackup(event.target.result);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleWeekendDay = (dayIndex) => {
    const current = settings.weekendDays || [];
    const updated = current.includes(dayIndex)
      ? current.filter(d => d !== dayIndex)
      : [...current, dayIndex].sort();
    updateSettings({ weekendDays: updated });
  };

  const dayNames = isArabic
    ? ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '4rem' }} className="animate-fade-in">

      {/* Page Title */}
      <div>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>
          {t('settingsTitle')}
        </h2>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          {t('settingsSubtitle')}
        </p>
      </div>

      {/* ── 1. General Preferences ── */}
      <div style={sectionBox}>
        <SectionHeader
          icon={<Sliders style={{ width: '1rem', height: '1rem', color: 'var(--brand-500)' }} />}
          title={t('generalSettings')}
        />
        <div className="responsive-form-grid">
          {/* Language */}
          <div>
            <label className="form-label">{t('language')}</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.375rem' }}>
              <ChoiceBtn active={settings.language === 'ar'} onClick={() => updateSettings({ language: 'ar' })}>
                العربية
              </ChoiceBtn>
              <ChoiceBtn active={settings.language === 'en'} onClick={() => updateSettings({ language: 'en' })}>
                English
              </ChoiceBtn>
            </div>
          </div>

          {/* Theme */}
          <div>
            <label className="form-label">{t('theme')}</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.375rem' }}>
              <ChoiceBtn active={settings.theme === 'light'} onClick={() => updateSettings({ theme: 'light' })}>
                <Sun style={{ width: '0.9rem', height: '0.9rem', color: settings.theme === 'light' ? '#fff' : '#E8A820' }} />
                {t('themeLight')}
              </ChoiceBtn>
              <ChoiceBtn active={settings.theme === 'dark'} onClick={() => updateSettings({ theme: 'dark' })}>
                <Moon style={{ width: '0.9rem', height: '0.9rem', color: settings.theme === 'dark' ? '#fff' : 'var(--text-muted)' }} />
                {t('themeDark')}
              </ChoiceBtn>
            </div>
          </div>
        </div>

        {/* Weekend Days */}
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1.5px solid var(--border-soft)' }}>
          <label className="form-label">{t('weekendDaysTitle')}</label>
          <p style={{ margin: '0.125rem 0 0.625rem', fontSize: '0.73rem', color: 'var(--text-muted)', fontWeight: 400 }}>
            {t('weekendDaysDesc')}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
            {dayNames.map((dayName, idx) => {
              const isWeekend = (settings.weekendDays || []).includes(idx);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleWeekendDay(idx)}
                  style={{
                    padding: '0.35rem 0.65rem',
                    borderRadius: '8px',
                    border: `1.5px solid ${isWeekend ? 'var(--brand-500)' : 'var(--border-medium)'}`,
                    background: isWeekend ? 'var(--brand-500)' : 'var(--bg-subtle)',
                    color: isWeekend ? '#fff' : 'var(--text-secondary)',
                    fontSize: '0.73rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {dayName}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 2. Sections & Tasks Manager ── */}
      <div style={sectionBox}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.625rem', paddingBottom: '0.75rem', borderBottom: '1.5px solid var(--border-soft)', marginBottom: '0.875rem' }}>
          <div>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              <Layers style={{ width: '1rem', height: '1rem', color: 'var(--brand-500)' }} />
              {t('masterSectionsTitle')}
            </h3>
            <p style={{ margin: '0.15rem 0 0', fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t('masterSectionsDesc')}</p>
          </div>
          <button
            type="button"
            id="settings-add-section"
            onClick={() => { setEditingSection(null); setSectionModalOpen(true); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.45rem 0.8rem', borderRadius: '10px',
              background: 'var(--brand-500)', border: '1.5px solid var(--brand-600)',
              color: '#fff', fontSize: '0.75rem', fontWeight: 700,
              cursor: 'pointer', flexShrink: 0, boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Plus style={{ width: '0.85rem', height: '0.85rem' }} />
            {t('addNewSection')}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {masterSections.map((sec, idx) => {
            const colorTheme = COLOR_MAP[sec.color || 'sage'] || COLOR_MAP.sage;
            const title = getLocalizedText(sec.title, settings.language);
            const desc  = getLocalizedText(sec.description, settings.language);
            const tasks = sec.tasks || [];

            return (
              <div
                key={sec.id}
                style={{
                  padding: '0.875rem',
                  borderRadius: '14px',
                  background: 'var(--bg-subtle)',
                  border: '1.5px solid var(--border-soft)',
                }}
              >
                {/* Section row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.625rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', minWidth: 0, flex: 1 }}>
                    <div style={{
                      padding: '0.4rem', borderRadius: '8px',
                      background: colorTheme.accentBg,
                      border: `1.5px solid ${colorTheme.accentBorder}`,
                      color: colorTheme.accentColor, flexShrink: 0,
                    }}>
                      <IconRenderer name={sec.icon} style={{ width: '0.95rem', height: '0.95rem' }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</span>
                        <span style={{
                          padding: '0.1rem 0.4rem', borderRadius: '5px',
                          background: 'var(--bg-muted)', color: 'var(--text-muted)',
                          fontSize: '0.625rem', fontWeight: 700, border: '1px solid var(--border-soft)',
                        }}>
                          {tasks.length} {isArabic ? 'مهمة' : 'tasks'}
                        </span>
                      </div>
                      {desc && <p style={{ margin: '0.15rem 0 0', fontSize: '0.72rem', color: 'var(--text-muted)', wordBreak: 'break-word' }}>{desc}</p>}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0, marginInlineStart: 'auto' }}>
                    <IconBtn onClick={() => handleMoveSection(idx, -1)} disabled={idx === 0} title={t('moveUp')}>
                      <ArrowUp style={{ width: '0.8rem', height: '0.8rem' }} />
                    </IconBtn>
                    <IconBtn onClick={() => handleMoveSection(idx, 1)} disabled={idx === masterSections.length - 1} title={t('moveDown')}>
                      <ArrowDown style={{ width: '0.8rem', height: '0.8rem' }} />
                    </IconBtn>
                    <IconBtn onClick={() => { setEditingSection(sec); setSectionModalOpen(true); }} title={t('edit')}>
                      <Edit3 style={{ width: '0.8rem', height: '0.8rem' }} />
                    </IconBtn>
                    <IconBtn danger onClick={() => setConfirmDeleteSecId(sec.id)} title={t('delete')}>
                      <Trash2 style={{ width: '0.8rem', height: '0.8rem' }} />
                    </IconBtn>
                  </div>
                </div>

                {/* Tasks inside section */}
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-soft)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.73rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      {isArabic ? 'المهام' : 'Tasks'}
                    </span>
                    <button
                      type="button"
                      onClick={() => { setActiveSecIdForTask(sec.id); setEditingTask(null); setTaskModalOpen(true); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.25rem',
                        background: 'none', border: 'none',
                        color: 'var(--brand-500)', fontSize: '0.73rem', fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <Plus style={{ width: '0.8rem', height: '0.8rem' }} />
                      {t('addNewTask')}
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    {tasks.map((task) => {
                      const taskTitle = getLocalizedText(task.title, settings.language);
                      return (
                        <div
                          key={task.id}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            gap: '0.5rem', padding: '0.5rem 0.75rem',
                            borderRadius: '8px', background: 'var(--bg-card)',
                            border: '1px solid var(--border-soft)',
                          }}
                        >
                          <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-primary)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {taskTitle}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                            <button
                              type="button"
                              onClick={() => { setActiveSecIdForTask(sec.id); setEditingTask(task); setTaskModalOpen(true); }}
                              style={{ padding: '0.3rem', borderRadius: '6px', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer' }}
                            >
                              <Edit3 style={{ width: '0.8rem', height: '0.8rem' }} />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteTask(sec.id, task.id)}
                              style={{ padding: '0.3rem', borderRadius: '6px', border: 'none', background: 'transparent', color: 'var(--error-text)', cursor: 'pointer' }}
                            >
                              <Trash2 style={{ width: '0.8rem', height: '0.8rem' }} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {tasks.length === 0 && (
                      <p style={{ margin: 0, fontSize: '0.73rem', color: 'var(--text-faint)', fontStyle: 'italic', padding: '0.375rem 0' }}>
                        {isArabic ? 'لا توجد مهام — أضف مهمة أعلاه' : 'No tasks — add one above'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 3. Data Backup ── */}
      <div style={sectionBox}>
        <SectionHeader
          icon={<Download style={{ width: '1rem', height: '1rem', color: 'var(--brand-500)' }} />}
          title={t('dataBackupTitle')}
          subtitle={t('dataBackupDesc')}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={exportBackup}
            style={{
              padding: '1rem', borderRadius: '14px',
              border: '1.5px solid var(--border-soft)',
              background: 'var(--bg-subtle)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              textAlign: 'start', transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand-400)'; e.currentTarget.style.background = 'var(--brand-50)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-soft)'; e.currentTarget.style.background = 'var(--bg-subtle)'; }}
          >
            <div style={{ padding: '0.6rem', borderRadius: '10px', background: 'var(--brand-100)', color: 'var(--brand-600)' }}>
              <Download style={{ width: '1rem', height: '1rem' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-primary)' }}>{t('exportData')}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                {isArabic ? 'تحميل ملف JSON' : 'Download JSON file'}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '1rem', borderRadius: '14px',
              border: '1.5px solid var(--border-soft)',
              background: 'var(--bg-subtle)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              textAlign: 'start', transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#A8C9E3'; e.currentTarget.style.background = '#EEF4FA'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-soft)'; e.currentTarget.style.background = 'var(--bg-subtle)'; }}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" style={{ display: 'none' }} />
            <div style={{ padding: '0.6rem', borderRadius: '10px', background: '#EEF4FA', color: '#3B7EA8' }}>
              <Upload style={{ width: '1rem', height: '1rem' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-primary)' }}>{t('importData')}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                {isArabic ? 'استعادة من ملف JSON' : 'Restore from JSON file'}
              </div>
            </div>
          </button>
        </div>

        {/* Reset */}
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1.5px solid var(--border-soft)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem',
            padding: '0.875rem 1rem', borderRadius: '12px',
            background: 'var(--error-bg)', border: '1.5px solid var(--error-border)',
          }}>
            <div>
              <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--error-text)' }}>{t('resetData')}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>{t('resetDataDesc')}</div>
            </div>
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              style={{
                padding: '0.45rem 1rem', borderRadius: '8px',
                background: 'var(--error-text)', border: 'none',
                color: '#fff', fontSize: '0.775rem', fontWeight: 700,
                cursor: 'pointer', flexShrink: 0,
              }}
            >
              {t('resetData')}
            </button>
          </div>
        </div>
      </div>

      {/* Confirm dialogs */}
      {confirmDeleteSecId && (
        <ConfirmDialog
          title={t('deleteConfirmTitle')}
          message={t('deleteSectionConfirmMsg')}
          confirmLabel={t('delete')}
          onConfirm={() => { deleteSection(confirmDeleteSecId); setConfirmDeleteSecId(null); }}
          onCancel={() => setConfirmDeleteSecId(null)}
        />
      )}
      {showResetConfirm && (
        <ConfirmDialog
          title={t('deleteConfirmTitle')}
          message={t('resetConfirmMsg')}
          confirmLabel={t('resetData')}
          onConfirm={() => { resetSystem(); setShowResetConfirm(false); }}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}

      {/* Modals */}
      <SectionEditorModal
        isOpen={sectionModalOpen}
        onClose={() => setSectionModalOpen(false)}
        initialSection={editingSection}
        onSave={(data) => {
          if (editingSection) updateSection(editingSection.id, data);
          else addSection(data);
        }}
      />
      <TaskEditorModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        initialTask={editingTask}
        onSave={(data) => {
          if (editingTask) updateTask(activeSecIdForTask, editingTask.id, data);
          else addTask(activeSecIdForTask, data);
        }}
      />
    </div>
  );
}
