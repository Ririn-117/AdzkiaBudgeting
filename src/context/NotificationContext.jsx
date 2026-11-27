import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { INITIAL_NOTIFICATIONS } from '../data/unitData';
import { api } from '../services/api';
import { mapNotificationRow } from '../services/unitService';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [items, setItems] = useState(INITIAL_NOTIFICATIONS);

  useEffect(() => {
    let active = true;
    api.get('/notifications')
      .then((data) => {
        if (active && Array.isArray(data?.notifications) && data.notifications.length > 0) {
          setItems(data.notifications.map((n, i) => mapNotificationRow(n, i)));
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const setRead = useCallback((id, read = true) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: !read } : n)));
    api.put(`/notifications/${encodeURIComponent(id)}/read`, { read }).catch(() => {});
  }, []);

  const markAllRead = useCallback(() => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
    api.put('/notifications/read-all').catch(() => {});
  }, []);

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    api.del(`/notifications/${encodeURIComponent(id)}`).catch(() => {});
  }, []);

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
