import {
  Bell, ClipboardCheck, ClipboardList, FileText, FolderOpen, History, LayoutDashboard, UserCircle,
} from 'lucide-react';

const B = '/dashboard/bkpu';

// badge: 'queue' | 'lpj' | 'notif' dihitung dari data di BkpuContext
export const BKPU_MENU = [
  { heading: null, items: [{ label: 'Dashboard', to: B, icon: LayoutDashboard, end: true }] },
  {
    heading: 'Verifikasi Anggaran',
    items: [
      { label: 'Menunggu Verifikasi', to: `${B}/verifikasi`, icon: ClipboardList, badge: 'queue', end: true },
      { label: 'Semua Pengajuan', to: `${B}/pengajuan`, icon: FileText, end: true },
    ],
  },
  {
    heading: 'Verifikasi LPJ',
    items: [
      { label: 'Menunggu Pemeriksaan', to: `${B}/lpj/antrean`, icon: ClipboardCheck, badge: 'lpj' },
      { label: 'Semua LPJ', to: `${B}/lpj`, icon: FolderOpen, end: true },
    ],
  },
  { heading: 'Riwayat & Audit', items: [{ label: 'Riwayat Pemeriksaan', to: `${B}/riwayat`, icon: History }] },
  {
    heading: 'Sistem',
    items: [
      { label: 'Notifikasi', to: `${B}/notifikasi`, icon: Bell, badge: 'notif' },
      { label: 'Profil Saya', to: `${B}/profil`, icon: UserCircle },
    ],
  },
];