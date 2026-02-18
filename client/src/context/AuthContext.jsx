import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, setAuthToken } from '../api/client';

const AuthCtx = createContext(null);

const LS_TOKEN = 'pf_token';
const LS_USER = 'pf_user';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(LS_TOKEN) || '');
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(LS_USER);
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  useEffect(() => {
    // Validate token on startup
    async function init() {
      try {
        if (!token) return;
        const res = await api.get('/auth/me');
        setUser(res.data.user);
        localStorage.setItem(LS_USER, JSON.stringify(res.data.user));
      } catch {
        // token invalid
        doLogout();
      } finally {
        setLoading(false);
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function doLogin(nextToken, nextUser) {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(LS_TOKEN, nextToken);
    localStorage.setItem(LS_USER, JSON.stringify(nextUser));
  }

  function doLogout() {
    setToken('');
    setUser(null);
    localStorage.removeItem(LS_TOKEN);
    localStorage.removeItem(LS_USER);
    setAuthToken('');
  }

  const value = useMemo(
    () => ({ token, user, loading, login: doLogin, logout: doLogout }),
    [token, user, loading]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
