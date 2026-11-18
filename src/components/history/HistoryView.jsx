import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { DayDetailModal } from './DayDetailModal.jsx';
import { ProgressRing } from '../common/ProgressRing.jsx';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, CalendarCheck } from 'lucide-react';
import { parseDateKey, formatPercentage, calculateDailyMetrics } from '../../services/calculationEngine.js';
import { saveDayRecord, getOrCreateDayRecord } from '../../services/storageService.js';

/* ── Helpers for calendar cell color ── */
function getCellStyle(progress, isToday, hasActivity) {
  let bg, border, color;

  if (progress >= 95) {
    bg = 'var(--brand-100)'; border = 'var(--brand-400)'; color = 'var(--brand-700)';
  } else if (progress >= 60) {
    bg = 'var(--brand-50)'; border = 'var(--brand-200)'; color = 'var(--brand-600)';
  } else if (progress >= 30) {
    bg = 'var(--warning-bg)'; border = 'var(--warning-border)'; color = 'var(--warning-text)';
  } else if (progress > 0) {
    bg = 'var(--bg-subtle)'; border = 'var(--border-medium)'; color = 'var(--text-secondary)';
  } else {
    bg = 'var(--bg-surface)'; border = 'var(--border-soft)'; color = 'var(--text-muted)';
  }

  return {
    background: bg,
    border: `2px solid ${isToday ? 'var(--brand-500)' : border}`,
    color,
    outline: isToday ? '3px solid color-mix(in srgb, var(--brand-500) 30%, transparent)' : 'none',
    outlineOffset: '1px',
  };
}

export function HistoryView() {
  const {
    historyMap, masterSections, setSelectedDateStr,
    setActiveTab, todayKey, settings,
    setCurrentDaySectionsDirectly, addToast, t
  } = useApp();

  const isArabic = settings.language === 'ar';
  const today = parseDateKey(todayKey);

  const [currentMonthDate, setCurrentMonthDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedModalDay, setSelectedModalDay] = useState(null);

  const prevMonth = () => setCurrentMonthDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonthDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const monthName = new Intl.DateTimeFormat(isArabic ? 'ar-EG' : 'en-US', {
    month: 'long', year: 'numeric'
  }).format(currentMonthDate);

  const year  = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth   = new Date(year, month + 1, 0).getDate();

  const calendarCells = [];
  for (let i = 0; i < firstDayIndex; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(`${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
  }

  const handleSelectDay = (dStr) => {
    if (!dStr) return;
    setSelectedModalDay(getOrCreateDayRecord(dStr, masterSections));
  };

  const handleUpdateDaySections = (dateStr, updatedSections) => {
    const metrics = calculateDailyMetrics(updatedSections);
    const record = { date: dateStr, sections: updatedSections, dailyProgress: metrics.dailyProgress, lastModified: Date.now() };
    saveDayRecord(record);
    setSelectedModalDay(record);
    if (dateStr === todayKey) setCurrentDaySectionsDirectly(updatedSections);
    addToast(t('toastSaved'), 'success');
  };

  const recordedDaysList = Object.keys(historyMap).sort().reverse().map(k => historyMap[k]);
  const dayHeaders = isArabic
    ? ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navBtnStyle = {
    padding: '0.4rem',
    borderRadius: '8px',
    border: '1.5px solid var(--border-medium)',
    background: 'var(--bg-subtle)',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.15s ease',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }} className="animate-fade-in">

      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            {t('historyTitle')}
          </h2>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {t('historySubtitle')}
          </p>
        </div>
        <button
          onClick={() => { setSelectedDateStr(todayKey); setActiveTab('today'); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.5rem 1rem', borderRadius: '10px',
            background: 'var(--bg-card)', border: '1.5px solid var(--border-medium)',
            color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 700,
            cursor: 'pointer', boxShadow: 'var(--shadow-xs)', transition: 'all 0.15s ease',
          }}
        >
          <CalendarCheck style={{ width: '0.9rem', height: '0.9rem', color: 'var(--brand-500)' }} />
          {t('backToToday')}
        </button>
      </div>

      {/* Calendar Card */}
      <div className="card" style={{ padding: '1rem 1.125rem' }}>
        {/* Month header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingBottom: '0.75rem', borderBottom: '1.5px solid var(--border-soft)', marginBottom: '0.875rem',
        }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            <CalendarIcon style={{ width: '0.95rem', height: '0.95rem', color: 'var(--brand-500)' }} />
            {monthName}
          </h3>
          <div style={{ display: 'flex', gap: '0.375rem' }}>
            <button onClick={isArabic ? nextMonth : prevMonth} style={navBtnStyle} title={isArabic ? 'الشهر التالي' : 'Next Month'}>
              {isArabic ? <ChevronRight style={{ width: '0.85rem', height: '0.85rem' }} /> : <ChevronLeft style={{ width: '0.85rem', height: '0.85rem' }} />}
            </button>
            <button onClick={isArabic ? prevMonth : nextMonth} style={navBtnStyle} title={isArabic ? 'الشهر السابق' : 'Previous Month'}>
              {isArabic ? <ChevronLeft style={{ width: '0.85rem', height: '0.85rem' }} /> : <ChevronRight style={{ width: '0.85rem', height: '0.85rem' }} />}
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.2rem', textAlign: 'center', marginBottom: '0.375rem' }}>
          {dayHeaders.map((d, i) => (
            <div key={i} style={{ fontSize: '0.675rem', fontWeight: 700, color: 'var(--text-muted)', padding: '0.2rem 0' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="calendar-grid">
          {calendarCells.map((dStr, idx) => {
            if (!dStr) return <div key={`e-${idx}`} className="calendar-cell-btn" style={{ background: 'transparent', border: 'none', cursor: 'default' }} />;

            const dayNum  = parseInt(dStr.split('-')[2], 10);
            const isToday = dStr === todayKey;
            const record  = historyMap[dStr];
            const progress = record ? (record.dailyProgress || 0) : 0;
            const hasActivity = record && progress > 0;
            const cellStyle = getCellStyle(progress, isToday, hasActivity);

            return (
              <button
                key={dStr}
                type="button"
                onClick={() => handleSelectDay(dStr)}
                className="calendar-cell-btn"
                style={{
                  ...cellStyle,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span className="calendar-cell-day-num">{dayNum}</span>
                  {isToday && (
                    <span style={{
                      fontSize: '0.5rem', padding: '0.05rem 0.25rem', borderRadius: '3px',
                      background: 'var(--brand-500)', color: '#fff', fontWeight: 800,
                    }}>
                      •
                    </span>
                  )}
                </div>
                <div className="calendar-cell-pct">
                  {hasActivity ? formatPercentage(progress) : <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>—</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* History List */}
      <div className="card" style={{ padding: '1rem 1.125rem' }}>
        <h3 style={{ margin: '0 0 0.875rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {t('historyTitle')} ({recordedDaysList.length} {t('days')})
        </h3>

        {recordedDaysList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <Clock style={{ width: '1.75rem', height: '1.75rem', color: 'var(--text-faint)', margin: '0 auto 0.5rem' }} />
            <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{t('emptyHistoryTitle')}</p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t('emptyHistoryDesc')}</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 150px), 1fr))', gap: '0.5rem' }}>
            {recordedDaysList.map((rec) => {
              const formatted = new Intl.DateTimeFormat(isArabic ? 'ar-EG' : 'en-US', {
                weekday: 'short', day: 'numeric', month: 'short'
              }).format(parseDateKey(rec.date));

              const prog = rec.dailyProgress || 0;

              return (
                <div
                  key={rec.date}
                  onClick={() => handleSelectDay(rec.date)}
                  style={{
                    padding: '0.625rem 0.75rem',
                    borderRadius: '12px',
                    border: '1.5px solid var(--border-soft)',
                    background: 'var(--bg-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.375rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand-400)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-soft)'; e.currentTarget.style.background = 'var(--bg-subtle)'; }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {formatted}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.1rem', fontWeight: 500 }}>
                      {rec.sections?.length || 0} {t('activeSectionsCount')}
                    </div>
                  </div>
                  <ProgressRing progress={prog} size={38} strokeWidth={4} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <DayDetailModal
        isOpen={!!selectedModalDay}
        onClose={() => setSelectedModalDay(null)}
        dayRecord={selectedModalDay}
        onUpdateDaySections={handleUpdateDaySections}
      />
    </div>
  );
}
