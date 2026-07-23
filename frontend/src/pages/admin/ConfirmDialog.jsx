import { useEffect, useRef } from 'react';
import { AlertTriangle, Info, CheckCircle, Trash2 } from 'lucide-react';
import './ConfirmDialog.css';

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

  const iconConfig = {
    warning: { icon: AlertTriangle, className: 'cdialog-icon-warning' },
    danger:  { icon: Trash2, className: 'cdialog-icon-danger' },
    info:    { icon: Info, className: 'cdialog-icon-info' },
    success: { icon: CheckCircle, className: 'cdialog-icon-success' },
  };

  const IconComponent = iconConfig[icon]?.icon || AlertTriangle;

  return (
    <div className="cdialog-overlay" onClick={(e) => { if (e.target === e.currentTarget) onCancel?.(); }}>
      <div className={`cdialog-card cdialog-${icon}`}>
        <div className={`cdialog-icon-circle ${iconConfig[icon]?.className || ''}`}>
          <IconComponent size={32} strokeWidth={1.5} />
        </div>

        <h3 className="cdialog-title">{title}</h3>
        {message && <p className="cdialog-message">{message}</p>}

        <div className="cdialog-actions">
          {type !== 'alert' && (
            <button className="cdialog-btn cdialog-btn-secondary" onClick={onCancel}>
              {cancelText}
            </button>
          )}
          <button
            ref={confirmBtnRef}
            className={`cdialog-btn cdialog-btn-primary cdialog-btn-${icon}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
