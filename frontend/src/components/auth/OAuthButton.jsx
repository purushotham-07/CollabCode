import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { authApi } from '../../api/auth';

export default function OAuthButton({ text = 'Continue with Google' }) {
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [authUrl, setAuthUrl] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  useEffect(() => {
    const fetchOAuthUrl = async () => {
      try {
        const data = await authApi.getGoogleAuthUrl();
        setConfigured(Boolean(data.configured));
        setAuthUrl(data.url || '');
      } catch (err) {
        setConfigured(false);
      }
    };
    fetchOAuthUrl();
  }, []);

  const handleGoogleLogin = () => {
    if (!configured || !authUrl) {
      setInfoMessage(
        'Google OAuth requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend/.env. You can also sign in or register directly with email & password!'
      );
      return;
    }
    setLoading(true);
    window.location.href = authUrl;
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full py-2.5 px-4 rounded-full bg-surface-canvas hover:bg-surface-active text-text-primary font-medium text-xs border border-border-default transition-all flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer shadow-sm disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-text-secondary" />
        ) : (
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.54 0 2.9.54 3.98 1.43l2.97-2.97C17.15 1.77 14.77 1 12 1 7.42 1 3.54 3.6 1.63 7.37l3.66 2.84C6.18 7.3 8.87 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.16-1.99 3.41-4.93 3.41-8.7z"
            />
            <path
              fill="#FBBC05"
              d="M5.29 14.79c-.23-.68-.36-1.41-.36-2.16s.13-1.48.36-2.16L1.63 7.63C.59 9.71 0 12 0 14.37c0 2.37.59 4.66 1.63 6.74l3.66-2.84z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.71-2.88c-1.08.72-2.45 1.16-4.22 1.16-3.13 0-5.82-2.3-6.71-5.21L1.63 16.5C3.54 20.27 7.42 23 12 23z"
            />
          </svg>
        )}
        <span>{loading ? 'Redirecting to Google...' : text}</span>
      </button>

      {infoMessage && (
        <div className="mt-2.5 p-2.5 rounded-xl bg-[#0071e3]/10 border border-[#0071e3]/20 text-text-primary text-[11px] leading-relaxed text-left">
          {infoMessage}
        </div>
      )}
    </div>
  );
}
