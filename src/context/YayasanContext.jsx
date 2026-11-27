import { createContext, useContext, useState, useMemo } from 'react';
import {
  INITIAL_PENDING,
  INITIAL_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SUMMARY,
  CATEGORIES_3_PILAR,
  CHART_DATA,
  REKENING_KAS,
  YAYASAN,
} from '../data/yayasanData';

const YayasanContext = createContext(null);

export function YayasanProvider({ children }) {
  const [pending, setPending] = useState(INITIAL_PENDING);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [notifs, setNotifs] = useState(INITIAL_NOTIFICATIONS);
  const [categories, setCategories] = useState(CATEGORIES_3_PILAR);
  const [summary, setSummary] = useState(INITIAL_SUMMARY);
  const [selectedItem, setSelectedItem] = useState(null);

  // Approve a request
  const approveRequest = (id, note = 'Disetujui Ketua Yayasan via TTE Digital.') => {
    const item = pending.find((p) => p.id === id);
    if (!item) return;

    setPending((prev) => prev.filter((p) => p.id !== id));
    setLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        status: 'Disetujui Ketua',
        tone: 'green',
        time: 'Baru saja',
        title: item.program,
        ref: item.ref,
        nominal: item.nilaiDiminta,
        note: note || 'Disetujui untuk diteruskan ke kasir BSI Cash Management.',
      },
      ...prev,
    ]);

    setSummary((prev) => ({
      ...prev,
      menungguPersetujuan: Math.max(0, prev.menungguPersetujuan - 1),
      totalNilaiMenunggu: Math.max(0, prev.totalNilaiMenunggu - item.nilaiDiminta),
      telahDicairkan: prev.telahDicairkan + item.nilaiDiminta,
      alokasiKasBebas: Math.max(0, prev.alokasiKasBebas - item.nilaiDiminta),
    }));
  };

  // Reject / Return a request
  const rejectRequest = (id, note = 'Diminta perbaikan rincian anggaran.') => {
    const item = pending.find((p) => p.id === id);
    if (!item) return;

    setPending((prev) => prev.filter((p) => p.id !== id));
    setLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        status: 'Perlu Penyesuaian',
        tone: 'amber',
        time: 'Baru saja',
        title: item.program,
        ref: item.ref,
        nominal: item.nilaiDiminta,
        note: note,
      },
      ...prev,
    ]);

    setSummary((prev) => ({
      ...prev,
      menungguPersetujuan: Math.max(0, prev.menungguPersetujuan - 1),
      totalNilaiMenunggu: Math.max(0, prev.totalNilaiMenunggu - item.nilaiDiminta),
    }));
  };

  const markNotificationRead = (id) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const unreadNotifCount = useMemo(
    () => notifs.filter((n) => n.unread).length,
    [notifs]
  );

  const value = {
    yayasanInfo: YAYASAN,
    rekeningKas: REKENING_KAS,
    summary,
    categories,
    chartData: CHART_DATA,
    pending,
    logs,
    notifs,
    unreadNotifCount,
    selectedItem,
    setSelectedItem,
    approveRequest,
    rejectRequest,
    markNotificationRead,
    markAllNotificationsRead,
  };

  return (
    <YayasanContext.Provider value={value}>
      {children}
    </YayasanContext.Provider>
  );
}

export function useYayasan() {
  const ctx = useContext(YayasanContext);
  if (!ctx) {
    throw new Error('useYayasan must be used within YayasanProvider');
  }
  return ctx;
}
