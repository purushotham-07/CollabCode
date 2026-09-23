/**
 * Returns the WebSocket URL for real-time collaboration.
 * Supports both local development (proxied by Vite) and production on Render.
 */
export function getWebSocketUrl(workspaceId, user = null) {
  let envBase = (import.meta.env.VITE_API_BASE_URL || '').trim();

  let wsUrl = '';
  if (envBase.startsWith('https://')) {
    let clean = envBase.replace(/^https:\/\//, '').replace(/\/api\/?$/, '').replace(/\/$/, '');
    wsUrl = `wss://${clean}/ws`;
  } else if (envBase.startsWith('http://')) {
    let clean = envBase.replace(/^http:\/\//, '').replace(/\/api\/?$/, '').replace(/\/$/, '');
    wsUrl = `ws://${clean}/ws`;
  } else if (typeof window !== 'undefined') {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    wsUrl = `${protocol}//${window.location.host}/ws`;
  } else {
    wsUrl = 'ws://localhost:8080/ws';
  }

  const params = new URLSearchParams();
  if (workspaceId) {
    params.set('workspaceId', workspaceId);
  }
  if (user) {
    if (user.id) params.set('userId', user.id);
    if (user.displayName || user.name) {
      params.set('userName', user.displayName || user.name);
    }
    if (user.avatarUrl) {
      params.set('avatarUrl', user.avatarUrl);
    }
  }

  const queryString = params.toString();
  return queryString ? `${wsUrl}?${queryString}` : wsUrl;
}
