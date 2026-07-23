import { useEffect, useRef } from 'react';
import './ConfirmDialog.css';

/**
 * Modal de confirmación/alerta estilizado para el panel Admin.
 *
 * Props:
 *  - isOpen: boolean
 *  - type: 'confirm' | 'alert' | 'danger'
 *  - title: string
 *  - message: string
 *  - confirmText: string (default "Aceptar")
 *  - cancelText: string (default "Cancelar")
 *  - onConfirm: () => void
 *  - onCancel: () => void
 *  - icon: 'warning' | 'info' | 'danger' | 'success'
 */
export default function ConfirmDialog({
  isOpen,
  type = 'confirm',
  title = '¿Estás seguro?',
  message = '',
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  icon = 'warning',
}) {
  const confirmBtnRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Pequeño delay para que la animación se vea
      const t = setTimeout(() => confirmBtnRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onCancel?.();
      if (e.key === 'Enter') onConfirm?.();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onConfirm, onCancel]);

  if (!isOpen) return null;

  const icons = {
    warning: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    danger: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    ),
    info: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    success: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  };

  return (
    <div className="cdialog-overlay" onClick={(e) => { if (e.target === e.currentTarget) onCancel?.(); }}>
      <div className={`cdialog-box cdialog-${icon}`}>
        {/* Icono decorativo */}
        <div className={`cdialog-icon-wrap cdialog-icon-${icon}`}>
          {icons[icon] || icons.warning}
        </div>

        {/* Contenido */}
        <div className="cdialog-content">
          <h3 className="cdialog-title">{title}</h3>
          {message && <p className="cdialog-message">{message}</p>}
        </div>

        {/* Botones */}
        <div className="cdialog-actions">
          {type !== 'alert' && (
            <button className="cdialog-btn cdialog-btn-cancel" onClick={onCancel}>
              {cancelText}
            </button>
          )}
          <button
            ref={confirmBtnRef}
            className={`cdialog-btn cdialog-btn-confirm cdialog-btn-confirm-${icon}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
