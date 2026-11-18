import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { CheckCircle2, Clock, Flame, Star, AlertTriangle, Award, Sparkles } from 'lucide-react';
import { formatPercentage } from '../../services/calculationEngine.js';
import { getLocalizedText } from '../../locales/index.js';

function StatItem({ icon, iconBg, iconColor, label, value }) {
  return (
    <div style={{
      padding: '0.875rem',
      borderRadius: '14px',
      background: 'var(--bg-subtle)',
      border: '1.5px solid var(--border-soft)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    }}>
      <div style={{
        padding: '0.5rem',
        borderRadius: '10px',
        background: iconBg,
        color: iconColor,
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>{label}</div>
        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.1rem' }}>{value}</div>
      </div>
    </div>
  );
}

export function DailySummaryCard() {
  const { dailyMetrics, streaks, settings, t } = useApp();

  const bestSectionTitle = dailyMetrics.bestSection
    ? getLocalizedText(dailyMetrics.bestSection.title, settings.language) : null;
  const needsAttentionTitle = dailyMetrics.needsAttentionSection
    ? getLocalizedText(dailyMetrics.needsAttentionSection.title, settings.language) : null;

  return (
    <div className="card" style={{ padding: '1rem 1.125rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '0.75rem',
        borderBottom: '1.5px solid var(--border-soft)',
        marginBottom: '0.875rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award style={{ width: '1rem', height: '1rem', color: 'var(--brand-500)' }} />
          <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {t('dailyReviewTitle')}
          </h3>
        </div>
        <span style={{
          padding: '0.2rem 0.65rem',
          borderRadius: '9999px',
          background: 'var(--brand-100)',
          color: 'var(--brand-600)',
          border: '1px solid var(--brand-200)',
          fontSize: '0.72rem',
          fontWeight: 800,
        }}>
          {formatPercentage(dailyMetrics.dailyProgress)}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="responsive-stats-grid">
        <StatItem
          icon={<CheckCircle2 style={{ width: '0.95rem', height: '0.95rem' }} />}
          iconBg="var(--brand-100)"
          iconColor="var(--brand-600)"
          label={t('completedTasks')}
          value={`${dailyMetrics.totalCompletedTasks} / ${dailyMetrics.totalTasksCount}`}
        />
        <StatItem
          icon={<Clock style={{ width: '0.95rem', height: '0.95rem' }} />}
          iconBg="var(--warning-bg)"
          iconColor="var(--warning-text)"
          label={t('remainingTasks')}
          value={dailyMetrics.remainingTasks}
        />
        <StatItem
          icon={<Flame style={{ width: '0.95rem', height: '0.95rem' }} />}
          iconBg="var(--error-bg)"
          iconColor="var(--error-text)"
          label={t('currentStreak')}
          value={`${streaks.currentStreak} ${t('days')}`}
        />
        <StatItem
          icon={<Sparkles style={{ width: '0.95rem', height: '0.95rem' }} />}
          iconBg="#EEF4FA"
          iconColor="#3B7EA8"
          label={t('activeSectionsCount')}
          value={`${dailyMetrics.activeSectionsCount} (${formatPercentage(dailyMetrics.sectionWeight)})`}
        />
      </div>

      {/* Highlights */}
      {(bestSectionTitle || needsAttentionTitle) && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
          gap: '0.5rem',
          marginTop: '0.75rem',
        }}>
          {bestSectionTitle && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 0.875rem',
              borderRadius: '12px',
              background: 'var(--brand-50)',
              border: '1.5px solid var(--brand-100)',
              fontSize: '0.75rem',
            }}>
              <Star style={{ width: '0.9rem', height: '0.9rem', color: 'var(--brand-500)', flexShrink: 0 }} />
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                {t('topSection')}: <strong style={{ color: 'var(--text-primary)' }}>{bestSectionTitle}</strong>
              </span>
            </div>
          )}
          {needsAttentionTitle && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 0.875rem',
              borderRadius: '12px',
              background: 'var(--warning-bg)',
              border: '1.5px solid var(--warning-border)',
              fontSize: '0.75rem',
            }}>
              <AlertTriangle style={{ width: '0.9rem', height: '0.9rem', color: 'var(--warning-text)', flexShrink: 0 }} />
              <span style={{ color: 'var(--warning-text)', fontWeight: 600 }}>
                {t('needsCare')}: <strong style={{ color: 'var(--text-primary)' }}>{needsAttentionTitle}</strong>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
