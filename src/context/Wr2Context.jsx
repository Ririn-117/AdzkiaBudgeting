import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { INITIAL_LOGS, INITIAL_NOTIFS, INITIAL_SUBMISSIONS } from '../data/wr2Data';
import { api } from '../services/api';
import { formatShortDate } from '../services/unitService';

const Ctx = createContext(null);

const stamp = () => {
  const d = new Date();
  return {
    date: d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':'),
  };
};

function mapDbSubmissionToWr2(s) {
  let stage = 'menunggu';
  let result = undefined;
  if (s.status === 'disetujui') {
    stage = 'disetujui';
    result = 'setuju';
  } else if (s.status === 'revisi') {
    stage = 'revisi';
    result = 'revisi';
  } else if (s.status === 'ditolak') {
    stage = 'ditolak';
    result = 'tolak';
  }
  const dt = formatShortDate(s.submitted_at || s.created_at);
  return {
    id: s.code,
    unit: s.unit_name || 'Prodi S1 PGMI',
    faculty: 'Fakultas Tarbiyah (FTK)',
    fc: 'FTK',
    title: s.title,
    pic: s.pic,
    amount: Number(s.total_amount || 0),
    mak: 'MAK: 521211 (Bahan)',
    fund: s.source || 'Pagu RKAT Prodi',
    date: dt,
    time: '09:15',
    entry: dt,
    entryTime: '09:15 WIB',
    wait: 1,
    docs: [3, 3],
    category: s.category || 'Honor & Bahan',
    stage,
    result,
    sk: s.sk_number || null,
    decidedAt: s.approved_at ? `${formatShortDate(s.approved_at)} 09:00 WIB` : undefined,
    note: s.revision_note || s.position_label || 'Sesuai telaah BKPU.',
  };
}

export function Wr2Provider({ children }) {
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);
  const [logs, setLogs] = useState(INITIAL_LOGS);

  useEffect(() => {
    let active = true;
    api.get('/submissions?size=200')
      .then((res) => {
        if (!active || !Array.isArray(res?.submissions)) return;
        const dbList = res.submissions
          .filter((s) => s.workflow_stage === 'wr2_review' || s.status === 'disetujui')
          .map(mapDbSubmissionToWr2);
        if (dbList.length === 0) return;
        setSubmissions((prev) => {
          const byId = new Map(dbList.map((x) => [x.id, x]));
          const updatedPrev = prev.map((p) => (byId.has(p.id) ? { ...p, ...byId.get(p.id) } : p));
          const existingIds = new Set(prev.map((p) => p.id));
          const newOnes = dbList.filter((x) => !existingIds.has(x.id));
          return [...newOnes, ...updatedPrev];
        });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // type: 'setuju' | 'bertahap' | 'revisi' | 'tolak'
  const decide = useCallback((subs, type, note) => {
    const t = stamp();
    const approve = type === 'setuju' || type === 'bertahap';
    const decisionApi = approve ? 'approve' : type === 'revisi' ? 'revisi' : 'reject';
    const ids = subs.map((s) => s.id);

    subs.forEach((s) => {
      api.post(`/submissions/${encodeURIComponent(s.id)}/approve`, {
        decision: decisionApi,
        note: note || '',
        title: s.title,
        unit: s.unit,
        pic: s.pic,
        category: s.category,
        amount: s.amount,
      }).catch(() => {});
    });

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
