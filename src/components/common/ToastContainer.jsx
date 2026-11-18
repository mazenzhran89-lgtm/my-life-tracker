import React from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext.jsx';
import { CheckCircle, AlertCircle, Info, Sparkles } from 'lucide-react';

export function ToastContainer() {
  const { toasts } = useApp();

  if (!toasts || toasts.length === 0) return null;

  const toastEls = (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast ${
            toast.type === 'success' ? 'toast-success'
            : toast.type === 'error' ? 'toast-error'
            : toast.type === 'warning' ? 'toast-warning'
            : ''
          }`}
        >
          {toast.type === 'success' && <CheckCircle style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />}
          {toast.type === 'error'   && <AlertCircle style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />}
          {toast.type === 'info'    && <Sparkles    style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );

  return createPortal(toastEls, document.body);
}
