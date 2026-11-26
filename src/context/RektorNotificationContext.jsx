import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { NOTIF_ARCHIVE, NOTIF_INITIAL } from '../data/rektorData';

const RektorNotificationContext = createContext(null);

export function RektorNotificationProvider({ children }) {
  const [items, setItems] = useState(NOTIF_INITIAL);
  const [archiveLoaded, setArchiveLoaded] = useState(false);

  const setRead = useCallback(
    (id, read = true) => setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: !read } : n))),
    []
  );
  const markAllRead = useCallback(() => setItems((prev) => prev.map((n) => ({ ...n, unread: false }))), []);
  const loadArchive = useCallback(() => {
    setItems((prev) => [...prev, ...NOTIF_ARCHIVE]);
    setArchiveLoaded(true);
  }, []);

  const value = useMemo(
    () => ({
      items,
      archiveLoaded,
      total: items.length + (archiveLoaded ? 0 : NOTIF_ARCHIVE.length),
      unreadCount: items.filter((n) => n.unread).length,
      setRead,
      markAllRead,
      loadArchive,
    }),
    [items, archiveLoaded, setRead, markAllRead, loadArchive]
  );

  return <RektorNotificationContext.Provider value={value}>{children}</RektorNotificationContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRektorNotifications() {
  const ctx = useContext(RektorNotificationContext);
  if (!ctx) throw new Error('useRektorNotifications harus dipakai di dalam RektorNotificationProvider');
  return ctx;
}
