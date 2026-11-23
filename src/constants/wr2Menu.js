import { Bell, ClipboardCheck, FileText, History, LayoutDashboard, TrendingUp, UserCircle } from 'lucide-react';

const B = '/dashboard/wakil-rektor-2';

export const WR2_MENU = [
  { heading: 'Utama', items: [{ label: 'Dashboard', to: B, icon: LayoutDashboard, end: true }] },
  {
    heading: 'Persetujuan Anggaran',
    items: [
      { label: 'Menunggu Persetujuan', to: `${B}/menunggu`, icon: ClipboardCheck, badge: 'queue', end: true },
      { label: 'Semua Pengajuan', to: `${B}/pengajuan`, icon: FileText, end: true },
    ],
  },
  {
    heading: 'Riwayat & Laporan',
    items: [
      { label: 'Riwayat Keputusan', to: `${B}/riwayat`, icon: History },
      { label: 'Laporan Anggaran', to: `${B}/laporan`, icon: TrendingUp },
    ],
  },
  {
    heading: 'Sistem',
    items: [
      { label: 'Notifikasi', to: `${B}/notifikasi`, icon: Bell, badge: 'notif' },
      { label: 'Profil Saya', to: `${B}/profil`, icon: UserCircle },
    ],
  },
];