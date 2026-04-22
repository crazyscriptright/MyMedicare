import { useContext } from 'react';
import { ToastContext } from '@/context/ToastContext';
import { Toast } from './Toast';

/**
 * Renders all active toast notifications in the top-left fixed container.
 * Must be used inside a ToastProvider.
 */
export const ToastContainer = () => {
  const { toasts, removeToast } = useContext(ToastContext);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};
