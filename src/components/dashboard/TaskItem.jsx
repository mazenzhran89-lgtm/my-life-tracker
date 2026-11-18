import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { Check, MoreHorizontal, Trash2, Edit3 } from 'lucide-react';
import { formatPercentage } from '../../services/calculationEngine.js';
import { getLocalizedText } from '../../locales/index.js';

const PERCENTAGE_PRESETS = [0, 10, 30, 50, 70, 100];

export function TaskItem({ task, sectionId, onEditTask }) {
  const { toggleTask, setTaskProgress, deleteTask, settings, t } = useApp();
  const [showOptions, setShowOptions] = useState(false);

  const isCompleted     = (task.progressPercentage || 0) >= 100;
  const isPartiallyDone = (task.progressPercentage || 0) > 0 && !isCompleted;
  const currentProgress = task.progressPercentage || 0;

  const taskTitle = getLocalizedText(task.title, settings.language);
  const taskDesc  = getLocalizedText(task.description, settings.language);

  const itemBg = isCompleted
    ? 'var(--bg-subtle)'
    : isPartiallyDone
    ? 'color-mix(in srgb, var(--warning-bg) 70%, var(--bg-card))'
    : 'var(--bg-surface)';

  const itemBorder = isCompleted
    ? 'var(--border-soft)'
    : isPartiallyDone
    ? 'color-mix(in srgb, var(--warning-border) 60%, var(--border-soft))'
    : 'var(--border-soft)';

  return (
    <div
      style={{
        background: itemBg,
        border: `1.5px solid ${itemBorder}`,
        borderRadius: '12px',
        padding: '0.75rem',
        transition: 'var(--transition-fast)',
        opacity: isCompleted ? 0.85 : 1,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>

        {/* Touch-friendly Checkbox */}
        <button
          type="button"
          onClick={() => toggleTask(sectionId, task.id)}
          style={{
            marginTop: '1px',
            width: '1.5rem',
            height: '1.5rem',
            borderRadius: '7px',
            border: isCompleted
              ? '1.5px solid var(--brand-500)'
              : isPartiallyDone
              ? '1.5px solid var(--amber-400)'
              : '1.5px solid var(--border-strong)',
            background: isCompleted
              ? 'var(--brand-500)'
              : isPartiallyDone
              ? 'var(--warning-bg)'
              : 'var(--bg-card)',
            color: isCompleted ? '#fff' : isPartiallyDone ? 'var(--amber-500)' : 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'var(--transition-fast)',
            fontSize: '0.65rem',
            fontWeight: 800,
          }}
          title={isCompleted ? t('completed') : t('notStarted')}
        >
          {isCompleted && <Check style={{ width: '0.85rem', height: '0.85rem', strokeWidth: 3 }} />}
          {isPartiallyDone && <span>{currentProgress}%</span>}
        </button>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
            <span
              onClick={() => toggleTask(sectionId, task.id)}
              style={{
                fontSize: '0.8375rem',
                fontWeight: 600,
                color: isCompleted ? 'var(--text-faint)' : 'var(--text-primary)',
                cursor: 'pointer',
                userSelect: 'none',
                textDecoration: isCompleted ? 'line-through' : 'none',
                lineHeight: 1.4,
                transition: 'var(--transition-fast)',
                wordBreak: 'break-word',
              }}
            >
              {taskTitle}
            </span>

            {/* Options */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
              <span style={{
                padding: '0.1rem 0.4rem',
                borderRadius: '5px',
                fontSize: '0.65rem',
                fontWeight: 700,
                background: 'var(--bg-muted)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-soft)',
              }}>
                {currentProgress}%
              </span>

              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setShowOptions(!showOptions)}
                  style={{
                    padding: '0.25rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'var(--transition-fast)',
                  }}
                  title={t('edit')}
                >
                  <MoreHorizontal style={{ width: '0.95rem', height: '0.95rem' }} />
                </button>

                {showOptions && (
                  <div
                    className="dropdown-menu"
                    style={{
                      [settings.language === 'ar' ? 'left' : 'right']: 0,
                      top: '100%',
                      marginTop: '0.25rem',
                      minWidth: '120px'
                    }}
                    onMouseLeave={() => setShowOptions(false)}
                  >
                    <button
                      className="dropdown-item"
                      onClick={() => { setShowOptions(false); onEditTask?.(task); }}
                    >
                      <Edit3 style={{ width: '0.8rem', height: '0.8rem' }} />
                      <span>{t('edit')}</span>
                    </button>
                    <div className="dropdown-divider" />
                    <button
                      className="dropdown-item danger"
                      onClick={() => { setShowOptions(false); deleteTask(sectionId, task.id); }}
                    >
                      <Trash2 style={{ width: '0.8rem', height: '0.8rem' }} />
                      <span>{t('delete')}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {taskDesc && (
            <p style={{
              margin: '0.25rem 0 0',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              lineHeight: 1.5,
              fontWeight: 400,
              wordBreak: 'break-word',
            }}>
              {taskDesc}
            </p>
          )}

          {/* Progress Presets */}
          <div style={{
            marginTop: '0.625rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.35rem',
          }}>
            {PERCENTAGE_PRESETS.map((pct) => {
              const isSelected = currentProgress === pct;
              const bgColor = isSelected
                ? pct === 100 ? 'var(--brand-500)'
                : pct === 0   ? 'var(--bg-muted)'
                : 'var(--amber-400)'
                : 'var(--bg-muted)';
              const textColor = isSelected
                ? pct === 100 ? '#fff'
                : pct === 0   ? 'var(--text-secondary)'
                : '#fff'
                : 'var(--text-secondary)';
              const borderColor = isSelected
                ? pct === 100 ? 'var(--brand-600)'
                : pct === 0   ? 'var(--border-medium)'
                : 'var(--amber-500)'
                : 'var(--border-soft)';

              return (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setTaskProgress(sectionId, task.id, pct)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px',
                    border: `1.5px solid ${borderColor}`,
                    background: bgColor,
                    color: textColor,
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                    minWidth: '2.25rem',
                  }}
                >
                  {pct}%
                </button>
              );
            })}
          </div>

          {/* Weight & Contribution */}
          <div style={{
            marginTop: '0.5rem',
            paddingTop: '0.5rem',
            borderTop: '1px solid var(--border-soft)',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: 'var(--text-faint)',
          }}>
            <span>{t('taskWeight')}: {formatPercentage(task.weight)}</span>
            <span>{t('taskContribution')}: {formatPercentage(task.contribution)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

