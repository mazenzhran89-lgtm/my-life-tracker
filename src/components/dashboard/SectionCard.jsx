import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { IconRenderer } from '../common/IconRenderer.jsx';
import { TaskItem } from './TaskItem.jsx';
import { Plus, MoreVertical, Edit2, Trash2, Power, CheckCircle2 } from 'lucide-react';
import { formatPercentage } from '../../services/calculationEngine.js';
import { COLOR_MAP } from '../../constants/defaultData.js';
import { getLocalizedText } from '../../locales/index.js';

export function SectionCard({ section, onEditSection, onAddTask, onEditTask }) {
  const { toggleSectionActive, deleteSection, settings, t } = useApp();
  const [showMenu, setShowMenu] = useState(false);

  const isActive = section.active !== false;
  const colorKey = section.color || 'sage';
  const colorTheme = COLOR_MAP[colorKey] || COLOR_MAP.sage;

  const title = getLocalizedText(section.title, settings.language);
  const description = getLocalizedText(section.description, settings.language);
  const progress = section.progress || 0;
  const isAllDone = progress >= 100 && (section.tasks?.length || 0) > 0;

  return (
    <div
      className={`section-card${!isActive ? ' inactive' : ''}${isAllDone ? ' completed' : ''}`}
    >
      {/* Section Header */}
      <div style={{
        padding: '1rem 1.125rem',
        borderBottom: '1.5px solid var(--border-soft)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>

          {/* Icon & Title */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', minWidth: 0 }}>
            <div style={{
              padding: '0.5rem',
              borderRadius: '10px',
              background: isActive ? colorTheme.accentBg : 'var(--bg-muted)',
              border: `1.5px solid ${isActive ? colorTheme.accentBorder : 'var(--border-soft)'}`,
              color: isActive ? colorTheme.accentColor : 'var(--text-muted)',
              flexShrink: 0,
            }}>
              <IconRenderer name={section.icon} style={{ width: '1.1rem', height: '1.1rem' }} />
            </div>

            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h3 style={{
                  margin: 0,
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  lineHeight: 1.3,
                }}>
                  {title}
                </h3>
                {!isActive && (
                  <span style={{
                    padding: '0.1rem 0.45rem',
                    borderRadius: '6px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    background: 'var(--bg-muted)',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border-soft)',
                  }}>
                    {t('inactiveSection')}
                  </span>
                )}
                {isAllDone && (
                  <span style={{
                    padding: '0.1rem 0.45rem',
                    borderRadius: '6px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    background: 'var(--brand-100)',
                    color: 'var(--brand-600)',
                    border: '1px solid var(--brand-200)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}>
                    <CheckCircle2 style={{ width: '0.65rem', height: '0.65rem' }} />
                    100%
                  </span>
                )}
              </div>
              {description && (
                <p style={{
                  margin: '0.2rem 0 0',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Stats + Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <div style={{ textAlign: 'end' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {formatPercentage(section.contribution)} / {formatPercentage(section.weight)}
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {formatPercentage(progress)} {t('completed')}
              </div>
            </div>

            {/* Menu */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                id={`menu-${section.id}`}
                onClick={() => setShowMenu(!showMenu)}
                style={{
                  padding: '0.35rem',
                  borderRadius: '8px',
                  border: '1.5px solid var(--border-soft)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--transition-fast)',
                }}
              >
                <MoreVertical style={{ width: '0.9rem', height: '0.9rem' }} />
              </button>

              {showMenu && (
                <div
                  className="dropdown-menu"
                  style={{ [settings.language === 'ar' ? 'right' : 'left']: 0, top: '100%', marginTop: '0.25rem' }}
                  onMouseLeave={() => setShowMenu(false)}
                >
                  <button
                    className="dropdown-item"
                    onClick={() => { setShowMenu(false); toggleSectionActive(section.id); }}
                  >
                    <Power style={{ width: '0.85rem', height: '0.85rem' }} />
                    <span>{isActive ? t('inactiveSection') : t('activeSection')}</span>
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => { setShowMenu(false); onEditSection?.(section); }}
                  >
                    <Edit2 style={{ width: '0.85rem', height: '0.85rem' }} />
                    <span>{t('edit')}</span>
                  </button>
                  <div className="dropdown-divider" />
                  <button
                    className="dropdown-item danger"
                    onClick={() => { setShowMenu(false); deleteSection(section.id); }}
                  >
                    <Trash2 style={{ width: '0.85rem', height: '0.85rem' }} />
                    <span>{t('delete')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {isActive && (
          <div style={{ marginTop: '0.75rem' }}>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(100, Math.max(0, progress))}%`,
                  background: colorTheme.gradient,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tasks */}
      <div style={{ padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {(!section.tasks || section.tasks.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '1rem 0.5rem' }}>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              {t('noTasksYet')}
            </p>
            <button
              onClick={() => onAddTask?.(section.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                background: 'none',
                border: 'none',
                color: 'var(--brand-500)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Plus style={{ width: '0.875rem', height: '0.875rem' }} />
              {t('addTask')}
            </button>
          </div>
        ) : (
          section.computedTasks?.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              sectionId={section.id}
              sectionColor={section.color}
              onEditTask={(tObj) => onEditTask?.(section.id, tObj)}
            />
          ))
        )}

        {section.tasks && section.tasks.length > 0 && (
          <button
            type="button"
            id={`add-task-${section.id}`}
            onClick={() => onAddTask?.(section.id)}
            style={{
              width: '100%',
              padding: '0.625rem',
              borderRadius: '10px',
              border: '1.5px dashed var(--border-medium)',
              background: 'transparent',
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.375rem',
              transition: 'var(--transition-fast)',
              marginTop: '0.25rem',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--brand-400)';
              e.currentTarget.style.color = 'var(--brand-500)';
              e.currentTarget.style.background = 'var(--brand-50)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-medium)';
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <Plus style={{ width: '0.9rem', height: '0.9rem' }} />
            {t('addTask')}
          </button>
        )}
      </div>
    </div>
  );
}
