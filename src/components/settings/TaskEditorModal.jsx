import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal.jsx';
import { useApp } from '../../context/AppContext.jsx';

export function TaskEditorModal({ isOpen, onClose, initialTask = null, onSave }) {
  const { t, settings } = useApp();
  const isArabic = settings.language === 'ar';

  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descAr,  setDescAr]  = useState('');
  const [descEn,  setDescEn]  = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitleAr(initialTask.title?.ar || '');
      setTitleEn(initialTask.title?.en || '');
      setDescAr(initialTask.description?.ar || '');
      setDescEn(initialTask.description?.en || '');
    } else {
      setTitleAr(''); setTitleEn('');
      setDescAr('');  setDescEn('');
    }
  }, [initialTask, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titleAr.trim() && !titleEn.trim()) return;
    onSave({
      title:       { ar: titleAr.trim() || titleEn.trim(), en: titleEn.trim() || titleAr.trim() },
      description: { ar: descAr.trim(), en: descEn.trim() }
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialTask ? t('editTask') : t('addNewTask')}
      subtitle={isArabic ? 'تحديد عنوان المهمة وتفاصيلها' : 'Set task title and description'}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>

        {/* Titles Row */}
        <div className="responsive-form-grid">
          <div>
            <label className="form-label">
              {t('taskTitleAr')} <span style={{ color: 'var(--error-text)' }}>*</span>
            </label>
            <input
              type="text"
              required
              value={titleAr}
              onChange={(e) => setTitleAr(e.target.value)}
              placeholder="مثال: 30 دقيقة رياضة"
              className="form-input"
              dir="rtl"
            />
          </div>
          <div>
            <label className="form-label">{t('taskTitleEn')}</label>
            <input
              type="text"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="e.g. 30 Minutes Exercise"
              className="form-input"
              dir="ltr"
            />
          </div>
        </div>

        {/* Descriptions Row */}
        <div className="responsive-form-grid">
          <div>
            <label className="form-label">{t('taskDescAr')}</label>
            <input
              type="text"
              value={descAr}
              onChange={(e) => setDescAr(e.target.value)}
              placeholder="ملاحظة إضافية (اختياري)..."
              className="form-input"
              dir="rtl"
            />
          </div>
          <div>
            <label className="form-label">{t('taskDescEn')}</label>
            <input
              type="text"
              value={descEn}
              onChange={(e) => setDescEn(e.target.value)}
              placeholder="Additional note (optional)..."
              className="form-input"
              dir="ltr"
            />
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
