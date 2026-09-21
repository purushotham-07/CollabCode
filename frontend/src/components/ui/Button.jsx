import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger'
    size = 'md', // 'sm' | 'md' | 'lg'
    isLoading = false,
    leftIcon,
    rightIcon,
    className = '',
    disabled,
    ...props
  },
  ref
) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium focus-ring select-none active:scale-[0.99] transition-[transform,opacity,background-color,border-color,box-shadow] duration-fast cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1 rounded-sm gap-1.5 h-7',
    md: 'text-xs px-3.5 py-1.5 rounded-sm gap-2 h-8',
    lg: 'text-sm px-5 py-2.5 rounded-md gap-2.5 h-10',
  };

  const variantStyles = {
    primary:
      'bg-accent text-text-on-accent font-semibold shadow-soft-sm hover:opacity-95 hover:shadow-soft-md active:bg-accent-active',
    secondary:
      'bg-surface-raised border border-border-default text-text-primary shadow-soft-sm hover:bg-surface-overlay hover:border-border-hover',
    ghost:
      'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-raised',
    danger:
      'bg-status-danger/10 border border-status-danger/30 text-status-danger hover:bg-status-danger/20 active:bg-status-danger/30',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
});

export default Button;
