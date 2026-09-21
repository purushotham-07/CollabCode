import React, { useState, useEffect, useRef } from 'react';
import { Search, Terminal, FileCode, Users, Plus, X, ArrowRight } from 'lucide-react';
import { Kbd } from './Badge';

export function CommandPalette({
  isOpen,
  onClose,
  actions = [],
  placeholder = 'Type a command or search...',
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase()) ||
    (a.category && a.category.toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].onSelect?.();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-fast"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-lg bg-surface-overlay border border-border-default shadow-soft-overlay overflow-hidden animate-in zoom-in-95 duration-fast text-left">
        {/* Search Input Bar */}
        <div className="flex items-center px-3.5 py-2.5 border-b border-border-subtle gap-2.5">
          <Search className="w-4 h-4 text-text-muted flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={placeholder}
            className="w-full bg-transparent text-xs text-text-primary placeholder-text-muted focus:outline-none"
          />
          <Kbd>ESC</Kbd>
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto p-1.5 space-y-0.5">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-text-muted">
              No matching commands or actions found
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id || idx}
                  onClick={() => {
                    item.onSelect?.();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-2.5 py-2 rounded-sm text-xs cursor-pointer flex items-center justify-between transition-colors duration-fast ${
                    isSelected
                      ? 'bg-surface-active text-text-primary font-medium'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.icon || <Terminal className="w-3.5 h-3.5 text-text-muted" />}
                    <span>{item.label}</span>
                  </div>
                  {item.shortcut && <Kbd>{item.shortcut}</Kbd>}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
