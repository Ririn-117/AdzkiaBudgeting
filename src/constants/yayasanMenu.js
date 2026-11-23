import {
  LayoutDashboard,
  ClipboardCheck,
  FolderOpen,
  TrendingUp,
  FileSpreadsheet,
  History,
  Bell,
  UserCircle,
} from 'lucide-react';

const B = '/dashboard/yayasan';

export const YAYASAN_MENU = [
  {
    heading: 'UTAMA',
    items: [
      { label: 'Dashboard', to: B, icon: LayoutDashboard, end: true },
    ],
  },
  {
    heading: 'PERSETUJUAN PENCAIRAN',
    items: [
      {
        label: 'Menunggu Persetujuan',
        to: `${B}/menunggu`,
        icon: ClipboardCheck,
        badge: 'pending',
        end: true,
      },
      {
        label: 'Semua Permintaan',
        to: `${B}/permintaan`,
        icon: FolderOpen,
        end: true,
      },
    ],
  },
  {
    heading: 'MONITORING & KEUANGAN',
    items: [
      {
        label: 'Monitoring Anggaran',
        to: `${B}/monitoring`,
        icon: TrendingUp,
      },
      {
        label: 'Laporan Keuangan',
        to: `${B}/laporan`,
        icon: FileSpreadsheet,
      },
    ],
  },
  {
    heading: 'RIWAYAT & AUDIT',
    items: [
      {
        label: 'Riwayat Keputusan',
        to: `${B}/riwayat`,
        icon: History,
      },
    ],
  },
  {
    heading: 'SISTEM',
    items: [
      {
        label: 'Notifikasi',
        to: `${B}/notifikasi`,
        icon: Bell,
        badge: 'notif',
      },
      {
        label: 'Profil Saya',
        to: `${B}/profil`,
        icon: UserCircle,
      },
    ],
  },
];
