import {
  Bell,
  ClipboardCheck,
  FilePlus2,
  FileSpreadsheet,
  LayoutDashboard,
  ListChecks,
  UserCircle,
  Wallet,
} from 'lucide-react';

const BASE = '/dashboard/unit-prodi';

export const UNIT_MENU = [
  {
    heading: 'Menu Utama',
    items: [{ label: 'Dashboard', to: BASE, icon: LayoutDashboard, end: true }],
  },
  {
    heading: 'Pengajuan Anggaran',
    items: [
      { label: 'Daftar Pengajuan RKAT', to: `${BASE}/pengajuan`, icon: ListChecks },
      { label: 'Buat Pengajuan Baru', to: `${BASE}/pengajuan/baru`, icon: FilePlus2 },
      { label: 'Import RAB dari Excel', to: `${BASE}/pengajuan/import`, icon: FileSpreadsheet },
    ],
  },
  {
    heading: 'Pencairan & Pelaporan',
    items: [
      { label: 'Pencairan Dana', to: `${BASE}/pencairan`, icon: Wallet },
      { label: 'Laporan SPJ', to: `${BASE}/laporan-spj`, icon: ClipboardCheck },
    ],
  },
  {
    heading: 'Akun',
    items: [
      { label: 'Notifikasi & Riwayat', to: `${BASE}/notifikasi`, icon: Bell },
      { label: 'Profil & Pengaturan', to: `${BASE}/profil`, icon: UserCircle },
    ],
  },
];