import { SunIcon, MoonIcon } from '../icons';

/** SVG health-cross mark used as the brand logo. */
function MedLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="2" width="6" height="20" rx="2" fill="currentColor" />
      <rect x="2" y="9" width="20" height="6" rx="2" fill="currentColor" />
    </svg>
  );
}

/**
 * Top navigation bar with brand identity and theme toggle.
 *
 * @param {boolean}  isLight       - True when the light theme is active
 * @param {Function} onThemeToggle - Called when the user clicks the toggle button
 */
export default function Navbar({ isLight, onThemeToggle }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <div className="navbar-logo">
            <MedLogo />
          </div>
          <div>
            <span className="navbar-title">MyMedicare</span>
            <span className="navbar-subtitle">Patient Registration</span>
          </div>
        </div>

        <button
          className="theme-toggle"
          onClick={onThemeToggle}
          aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
          title={isLight ? 'Dark mode' : 'Light mode'}
        >
          {isLight
            ? <MoonIcon style={{ width: 16, height: 16 }} />
            : <SunIcon  style={{ width: 16, height: 16 }} />
          }
        </button>
      </div>
    </nav>
  );
}
