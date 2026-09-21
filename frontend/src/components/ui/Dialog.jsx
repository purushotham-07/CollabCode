import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-md',
  className = '',
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-fast"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className={`relative w-full ${maxWidth} rounded-lg bg-surface-raised border border-border-default p-6 shadow-soft-overlay animate-in zoom-in-95 duration-fast text-left ${className}`}
      >
        <div className="flex items-center justify-between pb-3.5 border-b border-border-subtle">
          <div>
            <h2 id="dialog-title" className="text-sm font-semibold text-text-primary tracking-tight">
              {title}
            </h2>
            {description && (
              <p className="text-xs text-text-muted mt-0.5 font-sans leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-sm text-text-muted hover:text-text-primary hover:bg-surface-overlay transition-colors duration-fast focus-ring"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

export function Tooltip({ content, children, side = 'top' }) {
  const sidePositions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
  };

  return (
    <div className="group relative inline-flex">
      {children}
      <div
        role="tooltip"
        className={`pointer-events-none absolute z-50 hidden group-hover:inline-block px-2 py-0.5 rounded-sm bg-surface-overlay border border-border-default text-text-primary text-[11px] font-sans whitespace-nowrap shadow-soft-md ${sidePositions[side]}`}
      >
        {content}
      </div>
    </div>
  );
}
