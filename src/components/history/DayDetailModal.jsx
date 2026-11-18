import React from 'react';
import { Modal } from '../common/Modal.jsx';
import { ProgressRing } from '../common/ProgressRing.jsx';
import { IconRenderer } from '../common/IconRenderer.jsx';
import { formatPercentage, parseDateKey } from '../../services/calculationEngine.js';
import { COLOR_MAP } from '../../constants/defaultData.js';
import { getLocalizedText } from '../../locales/index.js';
import { useApp } from '../../context/AppContext.jsx';
import { Check, X } from 'lucide-react';

const PERCENTAGE_PRESETS = [0, 10, 30, 50, 70, 100];

export function DayDetailModal({ isOpen, onClose, dayRecord, onUpdateDaySections }) {
  const { settings, t } = useApp();

  if (!dayRecord) return null;

  const isArabic = settings.language === 'ar';
  const dateObj = parseDateKey(dayRecord.date);
  const formattedDate = new Intl.DateTimeFormat(isArabic ? 'ar-EG' : 'en-US', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  }).format(dateObj);

  const sections = dayRecord.sections || [];

  const handleSetTaskPct = (sectionId, taskId, pct) => {
    const updated = sections.map(sec => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        tasks: (sec.tasks || []).map(task =>
          task.id !== taskId ? task : { ...task, progressPercentage: pct }
        )
      };
    });
    onUpdateDaySections(dayRecord.date, updated);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={formattedDate}
      subtitle={isArabic ? 'عرض وتعديل إنجاز هذا اليوم' : 'View and edit completion for this day'}
      maxWidth="max-w-2xl"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* Summary row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
          padding: '1rem 1.125rem',
          borderRadius: '14px',
          background: 'var(--bg-subtle)',
          border: '1.5px solid var(--border-soft)',
        }}>
          <div>
            <span style={{ fontSize: '0.73rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              {t('completionRate')} — {dayRecord.date}
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.2, marginTop: '0.125rem' }}>
              {formatPercentage(dayRecord.dailyProgress)}
            </div>
            <p style={{ margin: '0.375rem 0 0', fontSize: '0.73rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {t('retroactiveEditNotice')}
            </p>
          </div>
          <ProgressRing progress={dayRecord.dailyProgress} size={80} strokeWidth={8} />
        </div>

        {/* Sections list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '55vh', overflowY: 'auto', paddingInlineEnd: '0.25rem' }}>
          {sections.map((section) => {
            const colorTheme = COLOR_MAP[section.color || 'sage'] || COLOR_MAP.sage;
            const title = getLocalizedText(section.title, settings.language);
            const tasks = section.tasks || [];
            const doneCount = tasks.filter(t => (t.progressPercentage || 0) >= 100).length;

            return (
              <div
                key={section.id}
                style={{
                  padding: '0.875rem 1rem',
                  borderRadius: '14px',
                  background: 'var(--bg-card)',
                  border: '1.5px solid var(--border-soft)',
                  boxShadow: 'var(--shadow-xs)',
                }}
              >
                {/* Section header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{
                      padding: '0.4rem', borderRadius: '8px',
                      background: colorTheme.accentBg,
                      border: `1.5px solid ${colorTheme.accentBorder}`,
                      color: colorTheme.accentColor,
                    }}>
                      <IconRenderer name={section.icon} style={{ width: '0.875rem', height: '0.875rem' }} />
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</span>
                  </div>
                  <span style={{
                    padding: '0.15rem 0.5rem', borderRadius: '6px',
                    background: 'var(--bg-subtle)', color: 'var(--text-secondary)',
                    border: '1px solid var(--border-soft)',
                    fontSize: '0.7rem', fontWeight: 700,
                  }}>
                    {doneCount} / {tasks.length} {t('completed')}
                  </span>
                </div>

                {/* Tasks */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', paddingTop: '0.625rem', borderTop: '1px solid var(--border-soft)' }}>
                  {tasks.map((task) => {
                    const taskTitle = getLocalizedText(task.title, settings.language);
                    const isDone = (task.progressPercentage || 0) >= 100;
                    const p = task.progressPercentage || 0;

                    return (
                      <div
                        key={task.id}
                        style={{
                          padding: '0.625rem 0.75rem',
                          borderRadius: '10px',
                          background: isDone ? 'var(--bg-subtle)' : 'var(--bg-surface)',
                          border: '1px solid var(--border-soft)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                          flexWrap: 'wrap',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0, flex: 1 }}>
                          <button
                            type="button"
                            onClick={() => handleSetTaskPct(section.id, task.id, isDone ? 0 : 100)}
                            style={{
                              width: '1.45rem', height: '1.45rem', flexShrink: 0,
                              borderRadius: '6px',
                              border: isDone ? '1.5px solid var(--brand-500)' : '1.5px solid var(--border-strong)',
                              background: isDone ? 'var(--brand-500)' : 'var(--bg-card)',
                              color: isDone ? '#fff' : 'transparent',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: 'pointer', transition: 'all 0.15s ease',
                            }}
                          >
                            <Check style={{ width: '0.8rem', height: '0.8rem', strokeWidth: 3 }} />
                          </button>
                          <span style={{
                            fontSize: '0.8rem', fontWeight: 600,
                            color: isDone ? 'var(--text-faint)' : 'var(--text-primary)',
                            textDecoration: isDone ? 'line-through' : 'none',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {taskTitle}
                          </span>
                        </div>

                        {/* Preset buttons */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', flexShrink: 0 }}>
                          {PERCENTAGE_PRESETS.map((pct) => {
                            const isSel = p === pct;
                            return (
                              <button
                                key={pct}
                                type="button"
                                onClick={() => handleSetTaskPct(section.id, task.id, pct)}
                                style={{
                                  padding: '0.2rem 0.4rem',
                                  borderRadius: '5px',
                                  border: `1.5px solid ${isSel ? 'var(--brand-500)' : 'var(--border-soft)'}`,
                                  background: isSel ? 'var(--brand-500)' : 'var(--bg-subtle)',
                                  color: isSel ? '#fff' : 'var(--text-secondary)',
                                  fontSize: '0.65rem', fontWeight: 700,
                                  cursor: 'pointer', transition: 'all 0.12s ease',
                                  minWidth: '2rem',
                                }}
                              >
                                {pct}%
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.75rem', borderTop: '1.5px solid var(--border-soft)' }}>
          <button
            onClick={onClose}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.55rem 1.25rem', borderRadius: '10px',
              background: 'var(--bg-subtle)', border: '1.5px solid var(--border-medium)',
              color: 'var(--text-secondary)', fontSize: '0.825rem', fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.15s ease',
            }}
          >
            <X style={{ width: '0.875rem', height: '0.875rem' }} />
            {t('closeHistoryModal')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
