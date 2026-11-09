import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import DashboardPlaceholder from './pages/DashboardPlaceholder';
import ProtectedRoute from './routes/ProtectedRoute';
import { ROLES } from './constants/roles';

import UnitLayout from './layouts/UnitLayout';
import UnitDashboard from './pages/unit/UnitDashboard';
import ComingSoon from './components/common/ComingSoon';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Role Unit / Prodi */}
      <Route
        path="/dashboard/unit-prodi"
        element={
          <ProtectedRoute allowedRoles={[ROLES.UNIT_PRODI]}>
            <UnitLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<UnitDashboard />} />
        <Route path="pengajuan" element={<ComingSoon title="Daftar Pengajuan Anggaran RKAT" />} />
        <Route path="pengajuan/baru" element={<ComingSoon title="Buat Pengajuan Anggaran Baru" />} />
        <Route path="pengajuan/import" element={<ComingSoon title="Import Rencana Anggaran dari File Excel" />} />
        <Route path="pencairan" element={<ComingSoon title="Pencairan Dana Anggaran" />} />
        <Route path="laporan-spj" element={<ComingSoon title="Laporan Pertanggungjawaban SPJ Kegiatan" />} />
        <Route path="notifikasi" element={<ComingSoon title="Pusat Notifikasi & Riwayat Aktivitas" />} />
        <Route path="profil" element={<ComingSoon title="Profil Pengguna & Pengaturan Akun" />} />
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