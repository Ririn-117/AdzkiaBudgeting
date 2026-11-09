import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { loginRequest } from '../services/authService';
import { saveSession, getSession, clearSession } from '../utils/authStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getSession());

  const login = useCallback(async ({ identifier, password, role, remember }) => {
    const result = await loginRequest({ identifier, password, role });
    saveSession(result, remember);
    setSession(result);
    return result.user;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token),
      login,
      logout,
    }),
    [session, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return ctx;
}