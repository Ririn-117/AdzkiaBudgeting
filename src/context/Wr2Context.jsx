import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { INITIAL_LOGS, INITIAL_NOTIFS, INITIAL_SUBMISSIONS } from '../data/wr2Data';

const Ctx = createContext(null);

const stamp = () => {
  const d = new Date();
  return {
    date: d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':'),
  };
};

export function Wr2Provider({ children }) {
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);
  const [logs, setLogs] = useState(INITIAL_LOGS);

  // type: 'setuju' | 'bertahap' | 'revisi' | 'tolak'
  const decide = useCallback((subs, type, note) => {
    const t = stamp();
    const approve = type === 'setuju' || type === 'bertahap';
    const ids = subs.map((s) => s.id);
    setSubmissions((prev) => {
      let n = prev.filter((x) => x.sk).length;
      return prev.map((s) => {
        if (!ids.includes(s.id)) return s;
        n += 1;
        return {
          ...s, stage: approve ? 'disetujui' : type === 'revisi' ? 'revisi' : 'ditolak', result: type,
          sk: approve ? `${String(100 + n).padStart(3, '0')}/SK-ANGG/UA/2025` : null,
          decidedAt: `${t.date} ${t.time} WIB`, note: note || 'Sesuai telaah BKPU.',
        };
      });
    });
    setLogs((prev) => [
      ...subs.map((s) => ({
        id: `${s.id}-${Date.now()}`, tone: approve ? 'blue' : type === 'revisi' ? 'maroon' : 'red',
        title: approve ? 'Persetujuan Otorisasi' : type === 'revisi' ? 'Disposisi Catatan Revisi' : 'Penolakan Usulan', time: `${t.time} WIB`,
        text: `Usulan ${s.id} (${s.title}) senilai Rp ${new Intl.NumberFormat('id-ID').format(s.amount)} ${approve ? 'diterbitkan SK.' : type === 'revisi' ? 'dikembalikan ke unit.' : 'ditolak.'}`,
      })),
      ...prev,
    ]);
  }, []);

  const setRead = useCallback((id, read = true) => setNotifs((p) => p.map((n) => (n.id === id ? { ...n, unread: !read } : n))), []);
  const markAll = useCallback(() => setNotifs((p) => p.map((n) => ({ ...n, unread: false }))), []);
  const removeNotif = useCallback((id) => setNotifs((p) => p.filter((n) => n.id !== id)), []);

  const value = useMemo(() => ({
    submissions, notifs, logs, decide, setRead, markAll, removeNotif,
    queue: submissions.filter((s) => s.stage === 'menunggu'),
    unreadCount: notifs.filter((n) => n.unread).length,
  }), [submissions, notifs, logs, decide, setRead, markAll, removeNotif]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWr2() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useWr2 harus dipakai di dalam Wr2Provider');
  return ctx;
}