import { createContext, useState, useCallback, useContext } from 'react';

export const ToastContext = createContext();

/**
 * Hook to access the toast notification system.
 * Must be used inside a ToastProvider.
 *
 * @returns {{ showToast: Function, removeToast: Function, toasts: Array }}
 */
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

/**
 * Provides toast state to the component tree.
 * Wrap the application root with this component to enable toast notifications globally.
 *
 * @param {React.ReactNode} children
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
    return id;
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
};
