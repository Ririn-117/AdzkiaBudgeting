import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { BASE, INITIAL_LOGS, INITIAL_LPJS, INITIAL_NOTIFS, INITIAL_SUBMISSIONS } from '../data/bkpuData';
import { api } from '../services/api';
import { formatShortDate } from '../services/unitService';

const BkpuContext = createContext(null);

const stamp = () => {
  const d = new Date();
  return {
    date: d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':'),
    month: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
  };
};

function mapDbSubmissionToBkpu(s) {
  let stage = 'antrean';
  if (s.workflow_stage === 'wr2_review' || s.status === 'disetujui') stage = 'wr2';
  else if (s.status === 'revisi') stage = 'perbaikan';
  else if (s.status === 'ditolak') stage = 'ditolak';

  return {
    id: s.code,
    unit: s.unit_name || 'Prodi S1 PGMI',
    faculty: 'Fak. Tarbiyah & Keguruan',
    title: s.title,
    pic: s.pic,
    category: s.category || 'Honor & Konsumsi',
    amount: Number(s.total_amount || 0),
    date: formatShortDate(s.submitted_at || s.created_at),
    time: '09:30',
    stage,
    slaDay: 1,
    docs: [3, 3],
    note: s.revision_note || s.position_label || '',
  };
}

export function BkpuProvider({ children }) {
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [lpjs, setLpjs] = useState(INITIAL_LPJS);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);

  useEffect(() => {
    let active = true;
    api.get('/submissions?size=200')
      .then((res) => {
        if (!active || !Array.isArray(res?.submissions)) return;
        const dbList = res.submissions
          .filter((s) => s.status !== 'draft')
          .map(mapDbSubmissionToBkpu);
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

  // type: 'forward' | 'revise' | 'reject'
  const decideSubmission = useCallback((sub, type, note) => {
    const stage = { forward: 'wr2', revise: 'perbaikan', reject: 'ditolak' }[type];
    const result = { forward: 'lolos', revise: 'revisi', reject: 'tolak' }[type];
    const decisionApi = { forward: 'approve', revise: 'revisi', reject: 'reject' }[type];
    const t = stamp();

    api.post(`/submissions/${encodeURIComponent(sub.id)}/verify`, {
      decision: decisionApi,
      note: note || '',
      title: sub.title,
      unit: sub.unit,
      pic: sub.pic,
      category: sub.category,
      amount: sub.amount,
    }).catch(() => {});

    setSubmissions((prev) => prev.map((s) => (s.id === sub.id ? { ...s, stage, decisionNote: note, resubmit: false } : s)));
    setLogs((prev) => [
      {
        id: `USUL-${sub.id}-${Date.now()}`, ref: sub.id, kind: 'ANGGARAN', month: t.month, date: `${t.date} • ${t.time}`,
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

    api.post(`/lpjs/${encodeURIComponent(lpj.id)}/verify`, {
      decision: type === 'approve' ? 'approve' : 'revisi',
      note: note || '',
      title: lpj.title,
      amount: lpj.real,
    }).catch(() => {});

    setLpjs((prev) => prev.map((l) => (l.id === lpj.id ? { ...l, stage, decisionNote: note } : l)));
    setLogs((prev) => [
      {
        id: `${lpj.id}-${Date.now()}`, ref: lpj.id, kind: 'AUDIT LPJ', month: t.month, date: `${t.date} • ${t.time}`,
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
