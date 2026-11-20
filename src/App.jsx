import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import DashboardPlaceholder from './pages/DashboardPlaceholder';
import ProtectedRoute from './routes/ProtectedRoute';
import { ROLES } from './constants/roles';

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
