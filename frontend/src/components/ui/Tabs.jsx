import React, { useState, useRef, useEffect } from 'react';

export function Tabs({ tabs, activeTab, onChange, className = '' }) {
  return (
    <div
      role="tablist"
      className={`flex items-center gap-1 border-b border-border-subtle ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-colors duration-fast focus-ring flex items-center gap-1.5 ${
              isActive
                ? 'border-accent text-accent font-semibold'
                : 'border-transparent text-text-muted hover:text-text-primary hover:border-border-hover'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="ml-1 px-1.5 py-0.2 rounded-sm bg-surface-raised text-[10px] font-mono text-text-muted">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function Dropdown({ trigger, items, align = 'right', className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const alignStyles = align === 'left' ? 'left-0' : 'right-0';

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          role="menu"
          className={`absolute z-50 mt-1 w-44 rounded-md bg-surface-overlay border border-border-default p-1 shadow-soft-lg animate-in fade-in zoom-in-95 duration-fast ${alignStyles} ${className}`}
        >
          {items.map((item, idx) => {
            if (item.divider) {
              return <div key={idx} className="my-1 border-t border-border-subtle" />;
            }
            return (
              <button
                key={idx}
                role="menuitem"
                onClick={() => {
                  item.onClick?.();
                  setIsOpen(false);
                }}
                disabled={item.disabled}
                className={`w-full px-2.5 py-1.5 rounded-sm text-xs text-left flex items-center gap-2 transition-colors duration-fast ${
                  item.danger
                    ? 'text-status-danger hover:bg-status-danger/10'
                    : 'text-text-primary hover:bg-surface-raised'
                } disabled:opacity-40 disabled:pointer-events-none`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-sm bg-surface-raised/80 border border-border-subtle/50 ${className}`}
    />
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-10 text-center rounded-lg border border-dashed border-border-default bg-surface-subtle/30 ${className}`}
    >
      {icon && (
        <div className="w-10 h-10 rounded-md bg-surface-raised border border-border-default text-text-muted flex items-center justify-center mb-3">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-text-primary tracking-tight">{title}</h3>
      {description && (
        <p className="text-xs text-text-muted mt-1 max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
