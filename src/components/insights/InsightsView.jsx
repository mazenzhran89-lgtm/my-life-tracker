import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { TrendingUp, Flame, Award, PieChart, Sparkles, BarChart3 } from 'lucide-react';
import { formatPercentage, formatDateKey, parseDateKey } from '../../services/calculationEngine.js';
import { getLocalizedText } from '../../locales/index.js';
import { COLOR_MAP } from '../../constants/defaultData.js';

function InsightCard({ label, value, sub, icon }) {
  return (
    <div style={{
      padding: '1rem 1.125rem',
      borderRadius: '16px',
      background: 'var(--bg-card)',
      border: '1.5px solid var(--border-soft)',
      boxShadow: 'var(--shadow-xs)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.73rem', fontWeight: 600, color: 'var(--text-muted)' }}>{label}</span>
        {icon}
      </div>
      <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--text-muted)', marginTop: '0.25rem' }}>{sub}</div>}
    </div>
  );
}

export function InsightsView() {
  const { historyMap, masterSections, streaks, todayKey, settings, t } = useApp();

  const isArabic = settings.language === 'ar';
  const recordedDays = Object.values(historyMap);
  const totalDays = recordedDays.length;

  const totalProgressSum = recordedDays.reduce((acc, d) => acc + (d.dailyProgress || 0), 0);
  const averageProgress = totalDays > 0 ? totalProgressSum / totalDays : 0;

  let bestDay = null;
  if (totalDays > 0) {
    bestDay = [...recordedDays].sort((a, b) => (b.dailyProgress || 0) - (a.dailyProgress || 0))[0];
  }

  // Current week days
  const todayObj = parseDateKey(todayKey);
  const dayOfWeek = todayObj.getDay();
  const sunday = new Date(todayObj);
  sunday.setDate(todayObj.getDate() - dayOfWeek);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    const dKey = formatDateKey(d);
    const rec = historyMap[dKey];
    return {
      dateStr: dKey,
      dayName: isArabic
        ? ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'][i]
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
      progress: rec ? (rec.dailyProgress || 0) : 0,
      isToday: dKey === todayKey,
    };
  });

  // Section consistency
  const sectionStats = masterSections.map((mSec) => {
    let completedCount = 0;
    let totalOccurrences = 0;
    recordedDays.forEach((dayRec) => {
      const found = (dayRec.sections || []).find(s => s.id === mSec.id);
      if (found && found.active !== false) {
        totalOccurrences++;
        const tasks = found.tasks || [];
        const avg = tasks.length > 0
          ? tasks.reduce((s, tsk) => s + (tsk.progressPercentage || 0), 0) / tasks.length : 0;
        if (avg >= 80) completedCount++;
      }
    });
    return { section: mSec, rate: totalOccurrences > 0 ? (completedCount / totalOccurrences) * 100 : 0, totalOccurrences };
  });

  const sectionBox = {
    padding: '1.25rem 1.375rem',
    borderRadius: '20px',
    background: 'var(--bg-card)',
    border: '1.5px solid var(--border-soft)',
    boxShadow: 'var(--shadow-xs)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }} className="animate-fade-in">

      {/* Title */}
      <div>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>
          {t('insightsTitle')}
        </h2>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          {t('insightsSubtitle')}
        </p>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="responsive-stats-grid">
        <InsightCard
          label={t('averageDailyCompletion')}
          value={formatPercentage(averageProgress)}
          sub={`${totalDays} ${t('totalLoggedDays')}`}
          icon={<TrendingUp style={{ width: '1rem', height: '1rem', color: 'var(--brand-500)' }} />}
        />
        <InsightCard
          label={t('currentStreak')}
          value={<>{streaks.currentStreak} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t('days')}</span></>}
          sub={`${t('bestStreak')}: ${streaks.longestStreak} ${t('days')}`}
          icon={<Flame style={{ width: '1rem', height: '1rem', color: '#E05252' }} />}
        />
        <InsightCard
          label={t('bestDayRecorded')}
          value={bestDay ? formatPercentage(bestDay.dailyProgress) : '0%'}
          sub={bestDay ? bestDay.date : '—'}
          icon={<Award style={{ width: '1rem', height: '1rem', color: 'var(--amber-500)' }} />}
        />
        <InsightCard
          label={t('activeSectionsCount')}
          value={masterSections.filter(s => s.active !== false).length}
          sub={`${masterSections.reduce((acc, s) => acc + (s.tasks?.length || 0), 0)} ${t('completedTasks')}`}
          icon={<Sparkles style={{ width: '1rem', height: '1rem', color: '#3878A8' }} />}
        />
      </div>

      {/* Weekly Bar Chart */}
      <div style={sectionBox}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.375rem',
          paddingBottom: '0.75rem', borderBottom: '1.5px solid var(--border-soft)', marginBottom: '0.875rem',
        }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            <BarChart3 style={{ width: '0.95rem', height: '0.95rem', color: 'var(--brand-500)' }} />
            {t('weeklyTrend')}
          </h3>
          <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {weekDays[0].dateStr} — {weekDays[6].dateStr}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', alignItems: 'flex-end', height: '9rem', paddingTop: '0.75rem' }}>
          {weekDays.map((wd) => {
            const p = wd.progress;
            const barH = Math.max(6, p);
            const barBg = wd.isToday
              ? 'var(--brand-500)'
              : p >= 80 ? 'var(--brand-400)'
              : p >= 40 ? 'var(--amber-400)'
              : 'var(--bg-muted)';

            return (
              <div key={wd.dateStr} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {Math.round(p)}%
                </span>
                <div style={{
                  width: '100%', maxWidth: '2.25rem',
                  background: 'var(--bg-subtle)',
                  borderRadius: '6px', height: '100%',
                  display: 'flex', alignItems: 'flex-end',
                  padding: '0.15rem', overflow: 'hidden',
                  border: '1px solid var(--border-soft)',
                }}>
                  <div style={{
                    width: '100%', borderRadius: '4px',
                    background: barBg,
                    height: `${barH}%`,
                    transition: 'height 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                  }} />
                </div>
                <span style={{
                  fontSize: '0.625rem', fontWeight: wd.isToday ? 800 : 600,
                  color: wd.isToday ? 'var(--brand-500)' : 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                }}>
                  {wd.dayName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sections Consistency */}
      <div style={sectionBox}>
        <h3 style={{ margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          <PieChart style={{ width: '1rem', height: '1rem', color: 'var(--brand-500)' }} />
          {t('sectionsBalance')}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sectionStats.map(({ section, rate }) => {
            const colorTheme = COLOR_MAP[section.color || 'sage'] || COLOR_MAP.sage;
            const title = getLocalizedText(section.title, settings.language);

            return (
              <div
                key={section.id}
                style={{
                  padding: '0.875rem 1rem',
                  borderRadius: '12px',
                  background: 'var(--bg-subtle)',
                  border: '1.5px solid var(--border-soft)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: colorTheme.accentColor }}>
                    {formatPercentage(rate)} {isArabic ? 'استمرارية' : 'Consistency'}
                  </span>
                </div>
                {/* Progress bar */}
                <div style={{
                  width: '100%', height: '8px', borderRadius: '9999px',
                  background: 'var(--bg-muted)', overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', borderRadius: '9999px',
                    background: colorTheme.gradient,
                    width: `${Math.min(100, Math.max(0, rate))}%`,
                    transition: 'width 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Philosophical note */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '1rem 1.125rem', borderRadius: '14px',
        background: 'var(--brand-50)', border: '1.5px solid var(--brand-100)',
        fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', lineHeight: 1.65,
      }}>
        <Sparkles style={{ width: '1.1rem', height: '1.1rem', color: 'var(--brand-500)', flexShrink: 0 }} />
        <span>{t('consistencyInsight')}</span>
      </div>
    </div>
  );
}
