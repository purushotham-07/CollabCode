import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    type = 'text',
    leftIcon,
    rightIcon,
    className = '',
    id,
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const computedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[11px] font-mono uppercase tracking-wider text-text-secondary font-medium mb-1"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-text-muted">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={computedType}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`w-full py-1.5 rounded-sm bg-surface-canvas text-text-primary placeholder-text-muted text-xs border transition-colors duration-fast focus-ring ${
            leftIcon ? 'pl-8' : 'pl-3'
          } ${isPassword || rightIcon ? 'pr-8' : 'pr-3'} ${
            error
              ? 'border-status-danger text-status-danger focus:border-status-danger'
              : 'border-border-default focus:border-border-focus hover:border-border-hover'
          } ${className}`}
          {...props}
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-text-muted hover:text-text-primary transition-colors focus:outline-none"
            tabIndex={-1}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        ) : (
          rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-text-muted">
              {rightIcon}
            </div>
          )
        )}
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="mt-1 text-[11px] text-status-danger flex items-center gap-1">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          <span>{error}</span>
        </p>
      ) : (
        helperText && <p className="mt-1 text-[11px] text-text-muted">{helperText}</p>
      )}
    </div>
  );
});

export const Select = forwardRef(function Select(
  { label, error, children, className = '', id, ...props },
  ref
) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full text-left">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-[11px] font-mono uppercase tracking-wider text-text-secondary font-medium mb-1"
        >
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={`w-full px-3 py-1.5 rounded-sm bg-surface-canvas text-text-primary text-xs border border-border-default hover:border-border-hover focus-ring transition-colors duration-fast ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-[11px] text-status-danger">{error}</p>}
    </div>
  );
});

export default Input;
