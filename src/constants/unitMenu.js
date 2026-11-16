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

const BASE = '/dashboard/unit';

export const UNIT_MENU = [
  {
    heading: null,
    items: [{ label: 'Dashboard', to: BASE, icon: LayoutDashboard, end: true }],
  },
  {
    heading: 'Penganggaran',
    indent: true,
    items: [
      { label: 'Daftar Pengajuan', to: `${BASE}/pengajuan`, icon: ListChecks, end: true },
      { label: 'Buat Pengajuan', to: `${BASE}/pengajuan/baru`, icon: FilePlus2 },
      { label: 'Import Excel', to: `${BASE}/pengajuan/import`, icon: FileSpreadsheet },
    ],
  },
  {
    heading: 'Realisasi & Audit',
    items: [
      { label: 'Pencairan Dana', to: `${BASE}/pencairan`, icon: Wallet },
      { label: 'Laporan (LPJ)', to: `${BASE}/laporan-spj`, icon: ClipboardCheck },
    ],
  },
  {
    heading: 'Sistem',
    items: [
      { label: 'Notifikasi', to: `${BASE}/notifikasi`, icon: Bell, showBadge: true },
      { label: 'Profil Saya', to: `${BASE}/profil`, icon: UserCircle },
    ],
  },
];