import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { inviteApi } from '../api/invite';
import { useAuth } from '../hooks/useAuth';
import RoleBadge from '../components/RoleBadge';
import { ArrowRight, AlertCircle, Loader2, Code2 } from 'lucide-react';

export default function JoinWorkspace() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading: isAuthLoading } = useAuth();

  const [invite, setInvite] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInviteDetails = async () => {
      try {
        const data = await inviteApi.getInvite(token);
        setInvite(data);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
          err.response?.data?.message ||
          'This invitation link is invalid or has expired.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchInviteDetails();
    }
  }, [token]);

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      const workspace = await inviteApi.acceptInvite(token);
      navigate(`/workspace/${workspace.id}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to accept invite.');
      setIsJoining(false);
    }
  };

  if (isLoading || isAuthLoading) {
    return (
      <div className="min-h-screen bg-surface-canvas flex items-center justify-center p-4">
        <Loader2 className="w-6 h-6 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-canvas flex items-center justify-center p-4 selection:bg-accent-subtle selection:text-accent-base">
      <div className="max-w-md w-full p-7 rounded-lg bg-surface-raised border border-border-default shadow-xl text-center">
        {error ? (
          <div>
            <div className="w-10 h-10 rounded-md bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-3 border border-red-500/20">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-text-primary mb-1.5">Invalid Invitation</h2>
            <p className="text-xs text-text-muted mb-5 leading-relaxed">{error}</p>
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-sm bg-surface-subtle hover:bg-surface-overlay border border-border-default text-text-primary text-xs font-medium transition-colors duration-120 inline-block"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div>
            <div className="w-10 h-10 rounded-md bg-surface-subtle text-accent flex items-center justify-center mx-auto mb-3 border border-border-subtle">
              <Code2 className="w-5 h-5" />
            </div>

            <h2 className="text-lg font-semibold text-text-primary tracking-tight">Workspace Invitation</h2>
            <p className="text-xs text-text-muted mt-1">
              You have been invited to join <span className="font-semibold text-text-primary font-mono">"{invite?.workspaceName}"</span>
            </p>

            <div className="my-5 p-3 rounded-md bg-surface-canvas border border-border-subtle flex items-center justify-between">
              <span className="text-xs text-text-muted font-mono">Assigned Role:</span>
              <RoleBadge role={invite?.role} size="md" />
            </div>

            {isAuthenticated ? (
              <div>
                <p className="text-[11px] text-text-muted mb-4 font-mono">
                  Signed in as <span className="text-text-secondary">{user?.displayName}</span> ({user?.email})
                </p>
                <button
                  onClick={handleJoin}
                  disabled={isJoining}
                  className="w-full py-2 px-4 rounded-sm bg-accent text-text-on-accent font-medium text-xs hover:opacity-90 active:scale-[0.99] transition-[opacity,transform] duration-120 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isJoining ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Joining Workspace...</span>
                    </>
                  ) : (
                    <>
                      <span>Accept Invitation & Join</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <p className="text-xs text-text-muted mb-2">
                  Please log in or create an account to accept this invite
                </p>
                <Link
                  to="/login"
                  state={{ from: { pathname: `/invite/${token}` } }}
                  className="block w-full py-2 px-4 rounded-sm bg-accent text-text-on-accent font-medium text-xs hover:opacity-90 transition-opacity duration-120"
                >
                  Sign In to Join
                </Link>
                <Link
                  to="/register"
                  state={{ from: { pathname: `/invite/${token}` } }}
                  className="block w-full py-2 px-4 rounded-sm bg-surface-canvas hover:bg-surface-subtle text-text-secondary font-medium text-xs border border-border-default transition-colors duration-120"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
