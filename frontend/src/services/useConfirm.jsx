import { useState, useCallback } from 'react';
import ConfirmDialog from '../pages/admin/ConfirmDialog';

/**
 * Hook para reemplazar window.confirm() y window.alert() con modales estilizados.
 *
 * Uso:
 *   const { confirmDialog, showConfirm, showAlert } = useConfirm();
 *
 *   // En el JSX: {confirmDialog}
 *
 *   // Para confirmación:
 *   const ok = await showConfirm({ title: '...', message: '...', icon: 'danger' });
 *   if (!ok) return;
 *
 *   // Para alerta simple:
 *   await showAlert({ title: '¡Éxito!', message: '...', icon: 'success' });
 */
export function useConfirm() {
  const [state, setState] = useState({
    isOpen: false,
    type: 'confirm',
    title: '',
    message: '',
    confirmText: 'Aceptar',
    cancelText: 'Cancelar',
    icon: 'warning',
    resolve: null,
  });

  const showConfirm = useCallback(({
    title = '¿Estás seguro?',
    message = '',
    confirmText = 'Aceptar',
    cancelText = 'Cancelar',
    icon = 'warning',
  } = {}) => {
    return new Promise((resolve) => {
      setState({ isOpen: true, type: 'confirm', title, message, confirmText, cancelText, icon, resolve });
    });
  }, []);

  const showAlert = useCallback(({
    title = 'Información',
    message = '',
    confirmText = 'Entendido',
    icon = 'info',
  } = {}) => {
    return new Promise((resolve) => {
      setState({ isOpen: true, type: 'alert', title, message, confirmText, cancelText: '', icon, resolve });
    });
  }, []);

  const handleConfirm = () => {
    state.resolve?.(true);
    setState(s => ({ ...s, isOpen: false }));
  };

  const handleCancel = () => {
    state.resolve?.(false);
    setState(s => ({ ...s, isOpen: false }));
  };

  const confirmDialog = (
    <ConfirmDialog
      isOpen={state.isOpen}
      type={state.type}
      title={state.title}
      message={state.message}
      confirmText={state.confirmText}
      cancelText={state.cancelText}
      icon={state.icon}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return { confirmDialog, showConfirm, showAlert };
}
