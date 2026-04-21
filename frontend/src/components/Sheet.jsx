import { CloseIcon } from '../icons';

/**
 * Slide-in panel from the right edge of the screen.
 * The backdrop overlay closes the sheet when clicked.
 *
 * @param {boolean}          isOpen   - Whether the sheet is visible
 * @param {Function}         onClose  - Called when the user closes the sheet
 * @param {string}           title    - Heading text displayed in the sheet header
 * @param {React.ReactNode}  children - Content rendered in the scrollable body
 */
export default function Sheet({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="sheet-overlay" onClick={onClose} aria-hidden="true" />

      <div className="sheet-panel" role="dialog" aria-modal="true" aria-label={title}>
        <div className="sheet-header">
          <h2 className="sheet-title">{title}</h2>
          <button className="sheet-close" onClick={onClose} aria-label="Close panel">
            <CloseIcon style={{ width: 16, height: 16 }} />
          </button>
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </>
  );
}
