import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { Sparkles } from 'lucide-react';

export function MotivationalBanner() {
  const { motivationalQuote } = useApp();

  if (!motivationalQuote) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      padding: '0.875rem 1rem',
      borderRadius: '14px',
      background: 'var(--brand-50)',
      border: '1.5px solid var(--brand-100)',
    }}>
      <div style={{
        padding: '0.4rem',
        borderRadius: '8px',
        background: 'var(--bg-card)',
        border: '1.5px solid var(--brand-200)',
        color: 'var(--brand-500)',
        flexShrink: 0,
      }}>
        <Sparkles style={{ width: '0.9rem', height: '0.9rem' }} />
      </div>
      <p style={{
        margin: 0,
        fontSize: '0.825rem',
        fontWeight: 600,
        color: 'var(--text-secondary)',
        lineHeight: 1.6,
      }}>
        {motivationalQuote}
      </p>
    </div>
  );
}
