import {
  Bell,
  ClipboardCheck,
  FileBarChart2,
  Gauge,
  LayoutDashboard,
  UserCircle,
  Wallet,
} from 'lucide-react';

const BASE = '/dashboard/rektor';

export const REKTOR_MENU = [
  {
    heading: 'Menu Pengawasan',
    items: [
      { label: 'Dashboard Eksekutif', to: BASE, icon: LayoutDashboard, end: true },
      { label: 'Monitoring Anggaran', to: `${BASE}/monitoring-anggaran`, icon: Gauge },
      { label: 'Laporan Anggaran', to: `${BASE}/laporan-anggaran`, icon: FileBarChart2 },
      { label: 'Laporan Pencairan', to: `${BASE}/laporan-pencairan`, icon: Wallet },
      { label: 'Laporan LPJ', to: `${BASE}/laporan-lpj`, icon: ClipboardCheck },
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
