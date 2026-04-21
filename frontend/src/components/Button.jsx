/**
 * Button component.
 *
 * @param {'primary'|'secondary'|'ghost'|'danger'} [variant='primary'] - Visual style
 * @param {'sm'|'md'|'lg'}                         [size='md']         - Padding/font size preset
 * @param {React.ComponentType}                    [icon]              - Leading icon component
 * @param {boolean}                                [iconOnly=false]    - Use circular icon-only sizing
 * @param {string}                                 [className='']      - Extra CSS classes
 */
export default function Button({
  children,
  variant  = 'primary',
  size     = 'md',
  icon: Icon,
  iconOnly = false,
  className = '',
  ...rest
}) {
  const cls = ['btn', `btn-${variant}`, iconOnly ? 'btn-icon' : `btn-${size}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={cls} {...rest}>
      {Icon && <Icon style={{ width: 15, height: 15 }} />}
      {children}
    </button>
  );
}
