const KEY = 'ebudgeting_session';

// "Ingat saya" aktif -> localStorage (bertahan setelah browser ditutup)
// tidak aktif        -> sessionStorage (hilang saat tab/browser ditutup)
export function saveSession(session, remember) {
  clearSession();
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(KEY, JSON.stringify(session));
}

export function getSession() {
  try {
    const raw = localStorage.getItem(KEY) || sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(KEY);
  sessionStorage.removeItem(KEY);
}