import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { INITIAL_NOTIFICATIONS } from '../data/unitData';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [items, setItems] = useState(INITIAL_NOTIFICATIONS);

  const setRead = useCallback(
    (id, read = true) => setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: !read } : n))),
    []
  );
  const markAllRead = useCallback(() => setItems((prev) => prev.map((n) => ({ ...n, unread: false }))), []);
  const remove = useCallback((id) => setItems((prev) => prev.filter((n) => n.id !== id)), []);

  const value = useMemo(
    () => ({ items, unreadCount: items.filter((n) => n.unread).length, setRead, markAllRead, remove }),
    [items, setRead, markAllRead, remove]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications harus dipakai di dalam NotificationProvider');
  return ctx;
}
