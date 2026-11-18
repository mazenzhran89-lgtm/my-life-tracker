import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal.jsx';
import { IconRenderer } from '../common/IconRenderer.jsx';
import { COLOR_MAP } from '../../constants/defaultData.js';
import { useApp } from '../../context/AppContext.jsx';
import { Check } from 'lucide-react';

const TOP_ICONS = [
  'Activity', 'Heart', 'GraduationCap', 'Languages', 'Code', 'Dumbbell',
  'BookOpen', 'Sparkles', 'Flame', 'Trophy', 'Coffee', 'Briefcase'
];

export function SectionEditorModal({ isOpen, onClose, initialSection = null, onSave }) {
  const { t, settings } = useApp();
  const isArabic = settings.language === 'ar';

  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descAr,  setDescAr]  = useState('');
  const [descEn,  setDescEn]  = useState('');
  const [icon,    setIcon]    = useState('Sparkles');
  const [color,   setColor]   = useState('sage');

  useEffect(() => {
    if (initialSection) {
      setTitleAr(initialSection.title?.ar || '');
      setTitleEn(initialSection.title?.en || '');
      setDescAr(initialSection.description?.ar || '');
      setDescEn(initialSection.description?.en || '');
      setIcon(initialSection.icon || 'Sparkles');
      setColor(initialSection.color || 'sage');
    } else {
      setTitleAr(''); setTitleEn('');
      setDescAr('');  setDescEn('');
      setIcon('Sparkles'); setColor('sage');
    }
  }, [initialSection, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titleAr.trim() && !titleEn.trim()) return;
    onSave({
      title:       { ar: titleAr.trim() || titleEn.trim(), en: titleEn.trim() || titleAr.trim() },
      description: { ar: descAr.trim(), en: descEn.trim() },
      icon,
      color
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialSection ? t('editSection') : t('addNewSection')}
      subtitle={isArabic ? 'تخصيص اسم وأيقونة ولون القسم' : 'Customize section name, icon and color'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* Title Row */}
        <div className="responsive-form-grid">
          <div>
            <label className="form-label">
              {t('sectionNameAr')} <span style={{ color: 'var(--error-text)' }}>*</span>
            </label>
            <input
              type="text"
              required
              value={titleAr}
              onChange={(e) => setTitleAr(e.target.value)}
              placeholder="مثال: الرياضة والصحة"
              className="form-input"
              dir="rtl"
            />
          </div>
          <div>
            <label className="form-label">{t('sectionNameEn')}</label>
            <input
              type="text"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="e.g. Health & Fitness"
              className="form-input"
              dir="ltr"
            />
          </div>
        </div>

        {/* Description Row */}
        <div className="responsive-form-grid">
          <div>
            <label className="form-label">{t('sectionDescAr')}</label>
            <input
              type="text"
              value={descAr}
              onChange={(e) => setDescAr(e.target.value)}
              placeholder="الهدف (اختياري)..."
              className="form-input"
              dir="rtl"
            />
          </div>
          <div>
            <label className="form-label">{t('sectionDescEn')}</label>
            <input
              type="text"
              value={descEn}
              onChange={(e) => setDescEn(e.target.value)}
              placeholder="Goal (optional)..."
              className="form-input"
              dir="ltr"
            />
          </div>
        </div>

        {/* Color & Icon */}
        <div className="responsive-form-grid" style={{
          padding: '0.875rem',
          borderRadius: '14px',
          background: 'var(--bg-subtle)',
          border: '1.5px solid var(--border-soft)',
        }}>
          {/* Color Picker */}
          <div>
            <label className="form-label">{t('sectionColor')}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.375rem' }}>
              {Object.entries(COLOR_MAP).map(([cKey, c]) => {
                const isSelected = color === cKey;
                return (
                  <button
                    key={cKey}
                    type="button"
                    onClick={() => setColor(cKey)}
                    title={cKey}
                    style={{
                      width: '1.75rem',
                      height: '1.75rem',
                      borderRadius: '8px',
                      background: c.accent,
                      border: isSelected ? `2.5px solid var(--text-primary)` : '2px solid transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                      boxShadow: isSelected ? 'var(--shadow-md)' : 'none',
                      transition: 'var(--transition-fast)',
                      opacity: isSelected ? 1 : 0.75,
                    }}
                  >
                    {isSelected && <Check style={{ width: '0.85rem', height: '0.85rem', color: '#fff', strokeWidth: 3 }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Icon Picker */}
          <div>
            <label className="form-label">{t('sectionIcon')}</label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(2rem, 1fr))',
              gap: '0.35rem',
              marginTop: '0.375rem',
              padding: '0.45rem',
              background: 'var(--bg-card)',
              borderRadius: '10px',
              border: '1.5px solid var(--border-soft)',
            }}>
              {TOP_ICONS.map((iName) => {
                const isSelected = icon === iName;
                return (
                  <button
                    key={iName}
                    type="button"
                    onClick={() => setIcon(iName)}
                    title={iName}
                    style={{
                      padding: '0.35rem',
                      borderRadius: '7px',
                      border: isSelected ? '1.5px solid var(--brand-500)' : '1.5px solid transparent',
                      background: isSelected ? 'var(--brand-500)' : 'transparent',
                      color: isSelected ? '#fff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'var(--transition-fast)',
                    }}
                  >
                    <IconRenderer name={iName} style={{ width: '0.875rem', height: '0.875rem' }} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: '1.5px solid var(--border-soft)',
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '10px',
              background: 'var(--bg-subtle)',
              border: '1.5px solid var(--border-medium)',
              color: 'var(--text-secondary)',
              fontSize: '0.825rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
            }}
          >
            {t('close')}
          </button>
          <button
            type="submit"
            style={{
              padding: '0.55rem 1.5rem',
              borderRadius: '10px',
              background: 'var(--brand-500)',
              border: '1.5px solid var(--brand-600)',
              color: '#fff',
              fontSize: '0.825rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'var(--transition-fast)',
            }}
          >
            {t('save')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
