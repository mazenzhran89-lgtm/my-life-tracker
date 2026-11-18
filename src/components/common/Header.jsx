import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  Sun,
  Moon,
  Globe,
  Calendar,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { parseDateKey, formatDateKey } from '../../services/calculationEngine.js';

export function Header() {
  const {
    activeTab,
    setActiveTab,
    selectedDateStr,
    setSelectedDateStr,
    todayKey,
    settings,
    updateSettings,
    t
  } = useApp();

  const isToday = selectedDateStr === todayKey;
  const isArabic = settings.language === 'ar';
  // Derive isDark from reactive settings.theme, not DOM (avoids 2-click bug)
  const isDark = settings.theme === 'dark'
    || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const dateObj = parseDateKey(selectedDateStr);
  const formattedDate = new Intl.DateTimeFormat(isArabic ? 'ar-EG' : 'en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(dateObj);

  const toggleDarkLight = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
  };

  const toggleLanguage = () => {
    updateSettings({ language: settings.language === 'ar' ? 'en' : 'ar' });
  };

  const shiftDate = (days) => {
    const d = parseDateKey(selectedDateStr);
    d.setDate(d.getDate() + days);
    setSelectedDateStr(formatDateKey(d));
  };

  const tabs = [
    { id: 'today',    label: t('today'),    icon: CheckCircle2 },
    { id: 'history',  label: t('history'),  icon: Calendar },
    { id: 'insights', label: t('insights'), icon: TrendingUp },
    { id: 'settings', label: t('settings'), icon: SettingsIcon },
  ];

  return (
    <>
      <header className="site-header">
        <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 0.875rem' }}>

          {/* Top Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            padding: '0.625rem 0'
          }}>

            {/* Brand */}
            <div
              onClick={() => { setActiveTab('today'); setSelectedDateStr(todayKey); }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', userSelect: 'none' }}
            >
              <div style={{
                width: '2.125rem',
                height: '2.125rem',
                borderRadius: '10px',
                background: 'var(--brand-500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.15s ease',
                flexShrink: 0,
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Sparkles style={{ width: '1rem', height: '1rem', color: '#fff' }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <h1 style={{ margin: 0, fontSize: '0.925rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                  {t('appName')}
                </h1>
                <p style={{ margin: 0, fontSize: '0.6875rem', color: 'var(--text-muted)' }}
                  className="hidden sm:block">
                  {t('appSubtitle')}
                </p>
              </div>
            </div>

            {/* Top Desktop Nav Tabs */}
            <nav className="desktop-only-nav">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  id={`nav-tab-${id}`}
                  onClick={() => setActiveTab(id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: 'none',
                    transition: 'var(--transition-fast)',
                    background: activeTab === id ? 'var(--brand-500)' : 'transparent',
                    color: activeTab === id ? '#fff' : 'var(--text-muted)',
                    boxShadow: activeTab === id ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  <Icon style={{ width: '0.85rem', height: '0.85rem', flexShrink: 0 }} />
                  <span>{label}</span>
                </button>
              ))}
            </nav>

            {/* Controls (Theme & Lang) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexShrink: 0 }}>
              {/* Theme Toggle */}
              <button
                type="button"
                id="btn-theme-toggle"
                onClick={toggleDarkLight}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.35rem 0.6rem',
                  borderRadius: '9px',
                  background: 'var(--bg-subtle)',
                  border: '1.5px solid var(--border-medium)',
                  color: 'var(--text-primary)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                  whiteSpace: 'nowrap',
                }}
                title={isDark ? (isArabic ? 'الوضع النهاري' : 'Light Mode') : (isArabic ? 'الوضع الليلي' : 'Dark Mode')}
              >
                {isDark
                  ? <><Sun style={{ width: '0.85rem', height: '0.85rem', color: '#E8A820' }} /><span className="hidden xs:inline">{isArabic ? 'نهاري' : 'Light'}</span></>
                  : <><Moon style={{ width: '0.85rem', height: '0.85rem', color: 'var(--brand-500)' }} /><span className="hidden xs:inline">{isArabic ? 'ليلي' : 'Dark'}</span></>
                }
              </button>

              {/* Language Toggle */}
              <button
                type="button"
                id="btn-lang-toggle"
                onClick={toggleLanguage}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.35rem 0.55rem',
                  borderRadius: '9px',
                  background: 'var(--bg-subtle)',
                  border: '1.5px solid var(--border-medium)',
                  color: 'var(--text-primary)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                }}
                title={settings.language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
              >
                <Globe style={{ width: '0.8rem', height: '0.8rem', color: 'var(--text-muted)' }} />
                <span>{settings.language === 'ar' ? 'EN' : 'ع'}</span>
              </button>
            </div>
          </div>

          {/* Sub-bar: Date Selector (when on Today or History tab) */}
          {(activeTab === 'today' || activeTab === 'history') && (
            <div style={{
              borderTop: '1.5px solid var(--border-soft)',
              paddingTop: '0.4rem',
              paddingBottom: '0.45rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                background: 'var(--bg-subtle)',
                border: '1.5px solid var(--border-soft)',
                borderRadius: '10px',
                padding: '0.25rem 0.5rem',
                fontSize: '0.73rem',
                fontWeight: 700,
                maxWidth: '100%',
              }}>
                <button
                  onClick={() => shiftDate(isArabic ? 1 : -1)}
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
                  title={isArabic ? 'اليوم السابق' : 'Previous Day'}
                >
                  {isArabic
                    ? <ChevronRight style={{ width: '0.85rem', height: '0.85rem' }} />
                    : <ChevronLeft  style={{ width: '0.85rem', height: '0.85rem' }} />
                  }
                </button>

                <span style={{ color: 'var(--text-primary)', paddingInline: '0.25rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  {formattedDate}
                </span>

                {!isToday && (
                  <button
                    onClick={() => setSelectedDateStr(todayKey)}
                    style={{
                      padding: '0.125rem 0.4rem',
                      borderRadius: '6px',
                      border: '1px solid var(--warning-border)',
                      background: 'var(--warning-bg)',
                      color: 'var(--warning-text)',
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t('backToToday')}
                  </button>
                )}

                <button
                  onClick={() => shiftDate(isArabic ? -1 : 1)}
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
                  title={isArabic ? 'اليوم التالي' : 'Next Day'}
                >
                  {isArabic
                    ? <ChevronLeft  style={{ width: '0.85rem', height: '0.85rem' }} />
                    : <ChevronRight style={{ width: '0.85rem', height: '0.85rem' }} />
                  }
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (rendered on viewports < 768px) */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              id={`mobile-nav-${id}`}
              onClick={() => setActiveTab(id)}
              className={`mobile-nav-item${isActive ? ' active' : ''}`}
            >
              <div className="mobile-nav-icon-wrapper">
                <Icon style={{ width: '1.15rem', height: '1.15rem', strokeWidth: isActive ? 2.5 : 2 }} />
              </div>
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

