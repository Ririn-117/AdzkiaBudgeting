import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { BASE, INITIAL_LOGS, INITIAL_LPJS, INITIAL_NOTIFS, INITIAL_SUBMISSIONS } from '../data/bkpuData';

const BkpuContext = createContext(null);

const stamp = () => {
  const d = new Date();
  return {
    date: d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':'),
    month: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
  };
};

export function BkpuProvider({ children }) {
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [lpjs, setLpjs] = useState(INITIAL_LPJS);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);

  // type: 'forward' | 'revise' | 'reject'
  const decideSubmission = useCallback((sub, type, note) => {
    const stage = { forward: 'wr2', revise: 'perbaikan', reject: 'ditolak' }[type];
    const result = { forward: 'lolos', revise: 'revisi', reject: 'tolak' }[type];
    const t = stamp();
    setSubmissions((prev) => prev.map((s) => (s.id === sub.id ? { ...s, stage, decisionNote: note, resubmit: false } : s)));
    setLogs((prev) => [
      {
        id: `USUL-${sub.id}`, ref: sub.id, kind: 'ANGGARAN', month: t.month, date: `${t.date} • ${t.time}`,
        title: sub.title, sub: sub.category, unit: sub.unit, amount: sub.amount, result,
        note: note || 'Dokumen lengkap dan sesuai SBM. Diteruskan ke Wakil Rektor II.', flag: null,
        verifier: 'Ahmad Zaky, S.E.', role: 'BKPU Anggaran', to: `${BASE}/pengajuan/${sub.id}`,
      },
      ...prev,
    ]);
  }, []);

  // type: 'approve' | 'revise'
  const decideLpj = useCallback((lpj, type, note) => {
    const stage = type === 'approve' ? 'sah' : 'revisi';
    const t = stamp();
    setLpjs((prev) => prev.map((l) => (l.id === lpj.id ? { ...l, stage, decisionNote: note } : l)));
    setLogs((prev) => [
      {
        id: lpj.id, ref: lpj.id, kind: 'AUDIT LPJ', month: t.month, date: `${t.date} • ${t.time}`,
        title: lpj.title, sub: lpj.cat, unit: lpj.unit, amount: lpj.real, result: type === 'approve' ? 'sah' : 'catatan',
        note: note || 'Bukti transaksi dan kepatuhan pajak lengkap. BAP diterbitkan.', flag: null,
        verifier: 'Ahmad Zaky, S.E.', role: 'BKPU Anggaran', to: `${BASE}/lpj/${lpj.id}`,
      },
      ...prev,
    ]);
  }, []);

  const setNotifRead = useCallback((id, read = true) => setNotifs((p) => p.map((n) => (n.id === id ? { ...n, unread: !read } : n))), []);
  const markAllNotifs = useCallback(() => setNotifs((p) => p.map((n) => ({ ...n, unread: false }))), []);
  const removeNotif = useCallback((id) => setNotifs((p) => p.filter((n) => n.id !== id)), []);

  const value = useMemo(() => ({
    submissions, lpjs, logs, notifs,
    queue: submissions.filter((s) => s.stage === 'antrean' || s.stage === 'ditelaah'),
    lpjQueue: lpjs.filter((l) => l.stage === 'antrean'),
    unreadCount: notifs.filter((n) => n.unread).length,
    decideSubmission, decideLpj, setNotifRead, markAllNotifs, removeNotif,
  }), [submissions, lpjs, logs, notifs, decideSubmission, decideLpj, setNotifRead, markAllNotifs, removeNotif]);

  return <BkpuContext.Provider value={value}>{children}</BkpuContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBkpu() {
  const ctx = useContext(BkpuContext);
  if (!ctx) throw new Error('useBkpu harus dipakai di dalam BkpuProvider');
  return ctx;
}