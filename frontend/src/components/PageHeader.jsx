/**
 * Page-level header row.
 * Renders a left side (title + optional count badge) and a right side (optional slots for search and action button).
 *
 * @param {string}          title       - Primary heading text
 * @param {number}          [count]     - Total record count shown as a small badge next to the title
 * @param {React.ReactNode} [search]    - Slot for a search control (e.g. SearchInput)
 * @param {React.ReactNode} [action]    - Slot for a primary action button
 */
export default function PageHeader({ title, count, search, action }) {
  return (
    <div className="list-header">
      <div className="list-header-left">
        <h1 className="list-heading">{title}</h1>
        {count !== undefined && (
          <span className="section-count">{count}</span>
        )}
      </div>

      {(search || action) && (
        <div className="list-header-right">
          {search}
          {action}
        </div>
      )}
    </div>
  );
}
