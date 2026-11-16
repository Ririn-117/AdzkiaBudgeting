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
import Pencairan from './pages/unit/Pencairan';
import Lpj from './pages/unit/Lpj';
import Notifikasi from './pages/unit/Notifikasi';
import Profil from './pages/unit/Profil';

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
        <Route path="pencairan" element={<Pencairan />} />
        <Route path="laporan-spj" element={<Lpj />} />
        <Route path="notifikasi" element={<Notifikasi />} />
        <Route path="profil" element={<Profil />} />
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
