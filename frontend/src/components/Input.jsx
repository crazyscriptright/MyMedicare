/**
 * Form input or textarea with optional label, leading icon, and error message.
 *
 * @param {'text'|'email'|'tel'|'textarea'} [type='text'] - Input type; 'textarea' renders a multi-line field
 * @param {string}                          [label]       - Label text rendered above the input
 * @param {string}                          [error]       - Validation error message rendered below
 * @param {React.ComponentType}             [icon]        - Leading icon component
 * @param {boolean}                         [required=false] - Adds a red asterisk to the label
 * @param {string}                          [className='']   - Extra CSS classes on the wrapper
 */
export default function Input({
  type      = 'text',
  label,
  error,
  icon: Icon,
  required  = false,
  className = '',
  ...rest
}) {
  const inputCls = ['form-input', Icon ? 'has-icon' : '', error ? 'input-error' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      {type === 'textarea' ? (
        <div className="textarea-icon-wrapper">
          {Icon && <Icon className="input-icon" style={{ width: 14, height: 14 }} />}
          <textarea className={inputCls} rows={4} {...rest} />
        </div>
      ) : (
        <div className="input-wrapper">
          {Icon && <Icon className="input-icon" style={{ width: 14, height: 14 }} />}
          <input type={type} className={inputCls} {...rest} />
        </div>
      )}

      {error && <span className="form-error">{error}</span>}
    </div>
  );
}
