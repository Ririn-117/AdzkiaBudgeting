import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import DashboardPlaceholder from './pages/DashboardPlaceholder';
import ProtectedRoute from './routes/ProtectedRoute';
import { ROLES } from './constants/roles';

import Wr2Layout from './layouts/Wr2Layout';
import Wr2Dashboard from './pages/wr2/Wr2Dashboard';
import Wr2Menunggu from './pages/wr2/Wr2Menunggu';
import Wr2Keputusan from './pages/wr2/Wr2Keputusan';
import Wr2Semua from './pages/wr2/Wr2Semua';
import Wr2Riwayat from './pages/wr2/Wr2Riwayat';
import Wr2Laporan from './pages/wr2/Wr2Laporan';
import Wr2UnitDetail from './pages/wr2/Wr2UnitDetail';
import Wr2Notifikasi from './pages/wr2/Wr2Notifikasi';
import Wr2Profil from './pages/wr2/Wr2Profil';
import BkpuLayout from './layouts/BkpuLayout';
import BkpuDashboard from './pages/bkpu/BkpuDashboard';
import Verifikasi from './pages/bkpu/Verifikasi';
import SemuaPengajuan from './pages/bkpu/SemuaPengajuan';
import TelaahPengajuan from './pages/bkpu/TelaahPengajuan';
import LpjList from './pages/bkpu/LpjList';
import TelaahLpj from './pages/bkpu/TelaahLpj';
import Riwayat from './pages/bkpu/Riwayat';
import BkpuNotifikasi from './pages/bkpu/BkpuNotifikasi';
import BkpuProfil from './pages/bkpu/BkpuProfil';
import MatriksSla from './pages/bkpu/MatriksSla';
import PanduanSbm from './pages/bkpu/PanduanSbm';
import UnitLayout from './layouts/UnitLayout';
import UnitDashboard from './pages/unit/UnitDashboard';
import PengajuanList from './pages/unit/PengajuanList';
import PengajuanCreate from './pages/unit/PengajuanCreate';
import PengajuanImport from './pages/unit/PengajuanImport';
import PengajuanDetail from './pages/unit/PengajuanDetail';
import Pencairan from './pages/unit/Pencairan';
import PencairanDetail from './pages/unit/PencairanDetail';
import Lpj from './pages/unit/Lpj';
import LpjDetail from './pages/unit/LpjDetail';
import Notifikasi from './pages/unit/Notifikasi';
import Profil from './pages/unit/Profil';
import AdminLayout from './layouts/AdminLayout';
import {
  AdminDashboard,
  AdminUsers,
  AdminRoles,
  AdminPeriods,
  AdminCategories,
  AdminUnits,
  AdminConfig,
  AdminAudit,
  AdminNotifications,
  AdminProfile,
} from './pages/admin/AdminPages';
import YayasanLayout from './layouts/YayasanLayout';
import YayasanDashboard from './pages/yayasan/YayasanDashboard';
import YayasanMenunggu from './pages/yayasan/YayasanMenunggu';
import YayasanSemua from './pages/yayasan/YayasanSemua';
import YayasanKeputusan from './pages/yayasan/YayasanKeputusan';
import YayasanMonitoring from './pages/yayasan/YayasanMonitoring';
import YayasanLaporan from './pages/yayasan/YayasanLaporan';
import YayasanRiwayat from './pages/yayasan/YayasanRiwayat';
import YayasanNotifikasi from './pages/yayasan/YayasanNotifikasi';
import YayasanProfil from './pages/yayasan/YayasanProfil';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Role Unit / Prodi */}
      <Route
        path="/dashboard/unit"
        element={
          <ProtectedRoute allowedRoles={[ROLES.UNIT_PRODI]}>
            <UnitLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<UnitDashboard />} />
        <Route path="pengajuan" element={<PengajuanList />} />
        <Route path="pengajuan/baru" element={<PengajuanCreate />} />
        <Route path="pengajuan/import" element={<PengajuanImport />} />
        <Route path="pengajuan/:id" element={<PengajuanDetail />} />
        <Route path="pencairan" element={<Pencairan />} />
        <Route path="pencairan/:id" element={<PencairanDetail />} />
        <Route path="laporan-spj" element={<Lpj />} />
        <Route path="laporan-spj/:id" element={<LpjDetail />} />
        <Route path="notifikasi" element={<Notifikasi />} />
        <Route path="profil" element={<Profil />} />
      </Route>

      {/* Role BKPU */}
      <Route
        path="/dashboard/bkpu"
        element={
          <ProtectedRoute allowedRoles={[ROLES.BKPU]}>
            <BkpuLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<BkpuDashboard />} />
        <Route path="verifikasi" element={<Verifikasi />} />
        <Route path="pengajuan" element={<SemuaPengajuan />} />
        <Route path="pengajuan/:id" element={<TelaahPengajuan />} />
        <Route path="lpj" element={<LpjList />} />
        <Route path="lpj/antrean" element={<LpjList initialTab="antrean" />} />
        <Route path="lpj/:id" element={<TelaahLpj />} />
        <Route path="riwayat" element={<Riwayat />} />
        <Route path="notifikasi" element={<BkpuNotifikasi />} />
        <Route path="profil" element={<BkpuProfil />} />
        <Route path="sla" element={<MatriksSla />} />
        <Route path="panduan-sbm" element={<PanduanSbm />} />
      </Route>

            {/* Role Wakil Rektor II */}
      <Route
        path="/dashboard/wakil-rektor-2"
        element={
          <ProtectedRoute allowedRoles={[ROLES.WAKIL_REKTOR_2]}>
            <Wr2Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Wr2Dashboard />} />
        <Route path="menunggu" element={<Wr2Menunggu />} />
        <Route path="pengajuan" element={<Wr2Semua />} />
        <Route path="pengajuan/:id" element={<Wr2Keputusan />} />
        <Route path="riwayat" element={<Wr2Riwayat />} />
        <Route path="laporan" element={<Wr2Laporan />} />
        <Route path="laporan/:code" element={<Wr2UnitDetail />} />
        <Route path="notifikasi" element={<Wr2Notifikasi />} />
        <Route path="profil" element={<Wr2Profil />} />
      </Route>
      
      {/* Role Administrator */}
      <Route
        path="/dashboard/administrator"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMINISTRATOR]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="pengguna" element={<AdminUsers />} />
        <Route path="role-hak-akses" element={<AdminRoles />} />
        <Route path="periode-anggaran" element={<AdminPeriods />} />
        <Route path="kategori-anggaran" element={<AdminCategories />} />
        <Route path="unit-prodi" element={<AdminUnits />} />
        <Route path="konfigurasi" element={<AdminConfig />} />
        <Route path="audit-log" element={<AdminAudit />} />
        <Route path="notifikasi" element={<AdminNotifications />} />
        <Route path="profil" element={<AdminProfile />} />
      </Route>

      {/* Role Yayasan */}
      <Route
        path="/dashboard/yayasan"
        element={
          <ProtectedRoute allowedRoles={[ROLES.YAYASAN]}>
            <YayasanLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<YayasanDashboard />} />
        <Route path="menunggu" element={<YayasanMenunggu />} />
        <Route path="menunggu/:id" element={<YayasanKeputusan />} />
        <Route path="permintaan" element={<YayasanSemua />} />
        <Route path="permintaan/:id" element={<YayasanKeputusan />} />
        <Route path="monitoring" element={<YayasanMonitoring />} />
        <Route path="laporan" element={<YayasanLaporan />} />
        <Route path="riwayat" element={<YayasanRiwayat />} />
        <Route path="notifikasi" element={<YayasanNotifikasi />} />
        <Route path="profil" element={<YayasanProfil />} />
      </Route>

      {/* Role lain: sementara masih placeholder */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardPlaceholder />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}