import {
  Bell,
  Boxes,
  CalendarRange,
  LayoutDashboard,
  ListTree,
  Settings,
  UserRoundCog,
  UsersRound,
  UserCircle,
  ScrollText,
} from 'lucide-react';

const BASE = '/dashboard/administrator';

export const ADMIN_MENU = [
  {
    heading: null,
    items: [{ label: 'Dashboard', to: BASE, icon: LayoutDashboard, end: true }],
  },
  {
    heading: 'Manajemen Pengguna & Hak Akses',
    items: [
      { label: 'Manajemen Pengguna', to: `${BASE}/pengguna`, icon: UsersRound },
      { label: 'Role dan Hak Akses', to: `${BASE}/role-hak-akses`, icon: UserRoundCog },
    ],
  },
  {
    heading: 'Data Referensi',
    items: [
      { label: 'Periode Anggaran', to: `${BASE}/periode-anggaran`, icon: CalendarRange },
      { label: 'Kategori Anggaran', to: `${BASE}/kategori-anggaran`, icon: Boxes },
      { label: 'Data Unit / Prodi', to: `${BASE}/unit-prodi`, icon: ListTree },
    ],
  },
  {
    heading: 'Sistem & Audit',
    items: [
      { label: 'Konfigurasi Sistem', to: `${BASE}/konfigurasi`, icon: Settings },
      { label: 'Audit Log', to: `${BASE}/audit-log`, icon: ScrollText },
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
