import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import DashboardPlaceholder from './pages/DashboardPlaceholder';
import ProtectedRoute from './routes/ProtectedRoute';
import { ROLES } from './constants/roles';

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
