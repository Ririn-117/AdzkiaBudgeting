import { createContext, useContext, useEffect, useState, useMemo } from 'react';
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
import { api } from '../services/api';
import { formatShortDate } from '../services/unitService';

const YayasanContext = createContext(null);

export function YayasanProvider({ children }) {
  const [pending, setPending] = useState(INITIAL_PENDING);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [notifs, setNotifs] = useState(INITIAL_NOTIFICATIONS);
  const [categories] = useState(CATEGORIES_3_PILAR);
  const [summary, setSummary] = useState(INITIAL_SUMMARY);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    let active = true;
    api.get('/disbursements')
      .then((res) => {
        if (!active || !Array.isArray(res?.disbursements)) return;
        const dbPending = res.disbursements
          .filter((d) => d.status === 'proses')
          .map((d) => ({
            id: d.code,
            ref: d.ref || d.code,
            unit: d.unit_name || 'Prodi S1 PGMI',
            fakultas: 'Fakultas Tarbiyah & Keguruan',
            pilar: 'Pilar Pendidikan',
            program: d.activity || 'Kegiatan RKAT',
            pic: 'Kaprodi / PIC Unit',
            paguTotal: Number(d.approved_amount || d.amount || 0),
            nilaiDiminta: Number(d.amount || 0),
            termin: d.termin || 'Termin 1',
            rekening: `${d.bank_name || 'BSI VA'} (${d.bank_account || '8871092831'})`,
            tglMasuk: formatShortDate(d.requested_at || d.created_at),
            prioritas: 'Normal',
            status: 'Menunggu Otorisasi Yayasan',
          }));
        if (dbPending.length === 0) return;
        setPending((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newItems = dbPending.filter((d) => !existingIds.has(d.id));
          return [...newItems, ...prev];
        });
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  // Approve a request
  const approveRequest = (id, note = 'Disetujui Ketua Yayasan via TTE Digital.') => {
    const item = pending.find((p) => p.id === id);
    if (!item) return;

    api.post(`/disbursements/${encodeURIComponent(id)}/process`, {
      decision: 'cair',
      note: note || '',
      title: item.program,
      amount: item.nilaiDiminta,
    }).catch(() => {});

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

    api.post(`/disbursements/${encodeURIComponent(id)}/process`, {
      decision: 'ditolak',
      note: note || '',
      title: item.program,
      amount: item.nilaiDiminta,
    }).catch(() => {});

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
