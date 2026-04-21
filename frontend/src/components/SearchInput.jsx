import { SearchIcon } from '../icons';

/**
 * Compact search input with a leading icon.
 *
 * @param {string}   value        - Controlled input value
 * @param {Function} onChange     - Change handler (receives the native event)
 * @param {string}   [placeholder='Search…'] - Placeholder text
 * @param {string}   [ariaLabel='Search']    - Accessible label for screen readers
 */
export default function SearchInput({ value, onChange, placeholder = 'Search…', ariaLabel = 'Search' }) {
  return (
    <div className="search-compact">
      <SearchIcon className="input-icon" style={{ width: 14, height: 14 }} />
      <input
        className="form-input has-icon"
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-label={ariaLabel}
      />
    </div>
  );
}
