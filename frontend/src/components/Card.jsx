/**
 * Card - Container with shadow and border styling
 * @param {boolean} [hover=false] - Enable hover scale animation
 * @param {string} [className] - Additional Tailwind classes
 */
export const Card = ({ children, className = '', hover = false }) => {
  const hoverClass = hover
    ? 'hover:shadow-lg hover:scale-105 transition-all duration-200'
    : '';

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 ${hoverClass} ${className}`}
    >
      {children}
    </div>
  );
};
