import React from 'react';

export function Badge({
  children,
  variant = 'default', // 'default' | 'accent' | 'warning' | 'danger' | 'outline'
  size = 'md', // 'sm' | 'md'
  className = '',
}) {
  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.2 rounded-sm gap-1',
    md: 'text-[11px] px-2 py-0.5 rounded-sm gap-1.5',
  };

  const variantStyles = {
    default:
      'bg-surface-raised border border-border-default text-text-secondary font-mono uppercase tracking-wider',
    accent:
      'bg-accent-subtle border border-accent-border text-accent font-mono uppercase tracking-wider font-semibold',
    warning:
      'bg-status-warning/10 border border-status-warning/30 text-status-warning font-mono uppercase tracking-wider',
    danger:
      'bg-status-danger/10 border border-status-danger/30 text-status-danger font-mono uppercase tracking-wider',
    outline:
      'border border-border-default text-text-muted font-mono uppercase tracking-wider',
  };

  return (
    <span
      className={`inline-flex items-center font-medium select-none ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.default} ${className}`}
    >
      {children}
    </span>
  );
}

export function Kbd({ children, className = '' }) {
  return (
    <kbd
      className={`inline-flex items-center justify-center font-mono text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-sm bg-surface-subtle text-text-muted border border-border-default shadow-[inset_0_-1px_0_rgba(0,0,0,0.2)] ${className}`}
    >
      {children}
    </kbd>
  );
}

const PEER_COLORS = [
  { bg: 'bg-peer-1', border: 'border-peer-1', text: 'text-surface-canvas' },
  { bg: 'bg-peer-2', border: 'border-peer-2', text: 'text-surface-canvas' },
  { bg: 'bg-peer-3', border: 'border-peer-3', text: 'text-surface-canvas' },
  { bg: 'bg-peer-4', border: 'border-peer-4', text: 'text-white' },
  { bg: 'bg-peer-5', border: 'border-peer-5', text: 'text-white' },
  { bg: 'bg-peer-6', border: 'border-peer-6', text: 'text-surface-canvas' },
  { bg: 'bg-peer-7', border: 'border-peer-7', text: 'text-white' },
  { bg: 'bg-peer-8', border: 'border-peer-8', text: 'text-surface-canvas' },
];

export function Avatar({
  name = 'User',
  src,
  colorIndex = 0,
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
}) {
  const sizeStyles = {
    sm: 'w-5 h-5 text-[10px]',
    md: 'w-6 h-6 text-xs',
    lg: 'w-8 h-8 text-sm',
  };

  const peer = PEER_COLORS[Math.abs(colorIndex) % PEER_COLORS.length];
  const initial = name ? name.charAt(0).toUpperCase() : 'U';

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeStyles[size] || sizeStyles.md} rounded-sm object-cover border border-border-default ${className}`}
      />
    );
  }

  return (
    <div
      title={name}
      className={`inline-flex items-center justify-center rounded-sm font-mono font-bold select-none border border-border-subtle ${peer.bg} ${peer.text} ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {initial}
    </div>
  );
}

export function AvatarStack({ users = [], max = 4, size = 'sm', className = '' }) {
  const visible = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className={`flex items-center -space-x-1 overflow-hidden select-none ${className}`}>
      {visible.map((u, i) => (
        <Avatar
          key={u.id || u.userId || i}
          name={u.displayName || u.name}
          src={u.avatarUrl}
          colorIndex={i}
          size={size}
          className="ring-1 ring-surface-canvas"
        />
      ))}
      {remaining > 0 && (
        <div
          title={`${remaining} more collaborators`}
          className="w-5 h-5 rounded-sm bg-surface-raised border border-border-default text-text-muted text-[10px] font-mono font-medium flex items-center justify-center ring-1 ring-surface-canvas"
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
