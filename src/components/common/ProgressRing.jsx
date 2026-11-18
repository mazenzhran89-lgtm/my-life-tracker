import React from 'react';
import { formatPercentage } from '../../services/calculationEngine.js';

export function ProgressRing({
  progress = 0,
  size = 130,
  strokeWidth = 10,
  className = '',
  label = '',
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, Number(progress) || 0));
  const offset = circumference - (clamped / 100) * circumference;

  // Color based on progress - uses updated vibrant palette
  const getColor = () => {
    if (clamped >= 80) return '#3D7D45'; // vibrant sage green
    if (clamped >= 50) return '#C98A0A'; // warm amber
    if (clamped >= 25) return '#A86344'; // terracotta
    return '#A09890';                     // faint warm grey
  };

  const trackColor = 'var(--bg-muted)';
  const fillColor  = getColor();

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} className={className}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'all 0.5s ease' }}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={fillColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
          style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.25, 1, 0.5, 1)' }}
        />
      </svg>

      {/* Center Text */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}>
        <span style={{
          fontSize: size > 100 ? '1.75rem' : '1.25rem',
          fontWeight: 900,
          color: fillColor,
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}>
          {formatPercentage(clamped)}
        </span>
        {label && (
          <span style={{
            fontSize: '0.65rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            marginTop: '0.25rem',
            maxWidth: `${size * 0.6}px`,
            lineHeight: 1.3,
          }}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
