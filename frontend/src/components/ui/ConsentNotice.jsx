import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Button } from './Button';

export function ConsentNotice() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('collabcode_cookie_consent');
    if (!consent) {
      // Show banner after brief delay
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('collabcode_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('collabcode_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 z-50 max-w-sm w-full p-4 rounded-lg bg-surface-overlay border border-border-default shadow-soft-overlay text-left animate-in slide-in-from-bottom-3 duration-normal"
    >
      <div className="flex items-start gap-2.5 mb-3">
        <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-semibold text-text-primary">Privacy & Session Cookies</h4>
          <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
            We use secure HTTP-only cookies to persist your collaborative session and authenticate WebSocket connections. No advertising trackers.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 gap-2">
        <Link
          to="/privacy"
          className="text-[11px] text-text-muted hover:text-text-primary underline"
        >
          Privacy Policy
        </Link>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="sm" onClick={handleDecline}>
            Decline
          </Button>
          <Button variant="primary" size="sm" onClick={handleAccept}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConsentNotice;
