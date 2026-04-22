import { CheckIcon, CloseIcon } from '@/icons';

const TYPE_CLASS = {
  success: 'toast-success',
  error:   'toast-error',
  info:    'toast-info',
  warning: 'toast-info',
};

/**
 * Single toast notification.
 *
 * @param {string}   message  - Text to display
 * @param {'success'|'error'|'info'|'warning'} [type='info'] - Visual style
 * @param {Function} onClose  - Called when the dismiss button is clicked
 */
export const Toast = ({ message, type = 'info', onClose }) => (
  <div className={`toast ${TYPE_CLASS[type] ?? 'toast-info'}`}>
    <CheckIcon className="toast-icon" style={{ width: 14, height: 14 }} />
    <span className="toast-msg">{message}</span>
    <button className="toast-close" onClick={onClose} aria-label="Dismiss">
      <CloseIcon style={{ width: 13, height: 13 }} />
    </button>
  </div>
);
