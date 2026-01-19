import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import RoleGuard from '../components/RoleGuard';

import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ConsumerDashboard from '../pages/ConsumerDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import KaryawanDashboard from '../pages/KaryawanDashboard';
import OwnerDashboard from '../pages/OwnerDashboard';
import ForbiddenPage from '../pages/ForbiddenPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        {/* public */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* protected */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/konsumen"
            element={
              <RoleGuard allowedRoles={['KONSUMEN']}>
                <ConsumerDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/admin"
            element={
              <RoleGuard allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/karyawan"
            element={
              <RoleGuard allowedRoles={['KARYAWAN']}>
                <KaryawanDashboard />
              </RoleGuard>
            }
          />
          <Route
            path="/owner"
            element={
              <RoleGuard allowedRoles={['OWNER']}>
                <OwnerDashboard />
              </RoleGuard>
            }
          />
        </Route>

        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;
