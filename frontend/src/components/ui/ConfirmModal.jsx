import React, { useEffect } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDestructive = true,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter') {
        onConfirm();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onConfirm]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-sm rounded-3xl bg-surface-raised border border-border-default p-6 shadow-2xl text-center animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-text-muted hover:text-text-primary hover:bg-surface-overlay transition-colors"
          title="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 border ${
            isDestructive
              ? 'bg-[#ff3b30]/10 border-[#ff3b30]/20 text-[#ff3b30]'
              : 'bg-[#0071e3]/10 border-[#0071e3]/20 text-[#0071e3]'
          }`}
        >
          {isDestructive ? (
            <Trash2 className="w-5 h-5 stroke-[2.2]" />
          ) : (
            <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
          )}
        </div>

        {/* Title & Message */}
        <h3 className="text-base font-semibold text-text-primary tracking-tight">{title}</h3>
        <p className="text-xs text-text-secondary mt-1.5 leading-relaxed max-w-xs mx-auto">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-full bg-surface-canvas hover:bg-surface-active text-text-primary border border-border-default text-xs font-medium transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-2 px-4 rounded-full text-white text-xs font-medium transition-all active:scale-95 cursor-pointer shadow-sm ${
              isDestructive
                ? 'bg-[#ff3b30] hover:bg-[#e03429]'
                : 'bg-[#0071e3] hover:bg-[#0077ed]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
