import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { loginRequest, logoutRequest, getMeRequest } from '../services/authService';
import { saveSession, getSession, clearSession } from '../utils/authStorage';

const AuthContext = createContext(null);

// Sesi lama dari versi mock (token palsu) tidak valid di backend -> buang.
function loadInitialSession() {
  const s = getSession();
  if (!s?.token || String(s.token).startsWith('mock-token-')) {
    clearSession();
    return null;
  }
  return s;
}

function isRemembered() {
  try {
    return Boolean(localStorage.getItem('ebudgeting_session'));
  } catch {
    return false;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadInitialSession);

  // Validasi token tersimpan ke backend saat aplikasi dibuka.
  useEffect(() => {
    const current = getSession();
    if (!current?.token) return undefined;
    let cancelled = false;

    getMeRequest()
      .then((data) => {
        if (cancelled || !data?.user) return;
        const next = { token: current.token, user: data.user };
        saveSession(next, isRemembered());
        setSession(next);
      })
      .catch((err) => {
        if (cancelled) return;
        // Hanya keluar jika token benar-benar ditolak (401/403), bukan saat server mati.
        if (err?.status === 401 || err?.status === 403) {
          clearSession();
          setSession(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async ({ identifier, password, role, remember }) => {
    const result = await loginRequest({ identifier, password, role });
    saveSession(result, remember);
    setSession(result);
    return result.user;
  }, []);

  const logout = useCallback(() => {
    // Nonaktifkan sesi di backend (tidak menunggu respons agar UI langsung keluar).
    if (getSession()?.token) {
      logoutRequest().catch(() => {});
    }
    // Header Authorization sudah dibaca secara sinkron oleh logoutRequest, aman dihapus.
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
