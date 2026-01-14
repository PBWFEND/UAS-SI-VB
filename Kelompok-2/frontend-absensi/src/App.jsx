import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";

/* ADMIN */
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import DosenPage from "./pages/admin/DosenPage";
import MahasiswaPage from "./pages/admin/MahasiswaPage";
import AdminPage from "./pages/admin/AdminPage";
import MataKuliahPage from "./pages/admin/MataKuliahPage";


/* DOSEN */
import DashboardDosen from "./pages/dosen/DashboardDosen";
import MataKuliahDosen from "./pages/dosen/MataKuliahDosen";
import SesiAbsensiDosen from "./pages/dosen/SesiAbsensiDosen";

/* MAHASISWA */
import DashboardMahasiswa from "./pages/mahasiswa/DashboardMahasiswa";
import AbsenMahasiswa from "./pages/mahasiswa/AbsenMahasiswa";
import RiwayatAbsensi from "./pages/mahasiswa/RiwayatAbsensi";

import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* DEFAULT ROUTE */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute allowedRoles={["ADMIN"]}>
              <DashboardAdmin />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/dosen"
          element={
            <PrivateRoute allowedRoles={["ADMIN"]}>
              <DosenPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/mahasiswa"
          element={
            <PrivateRoute allowedRoles={["ADMIN"]}>
              <MahasiswaPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/admin"
          element={
            <PrivateRoute allowedRoles={["ADMIN"]}>
              <AdminPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/mata-kuliah"
          element={
            <PrivateRoute allowedRoles={["ADMIN"]}>
              <MataKuliahPage />
            </PrivateRoute>
          }
        />

        {/* DOSEN */}
        <Route
          path="/dosen/dashboard"
          element={
            <PrivateRoute allowedRoles={["DOSEN"]}>
              <DashboardDosen />
            </PrivateRoute>
          }
        />

        <Route
          path="/dosen/matakuliah"
          element={
            <PrivateRoute allowedRoles={["DOSEN"]}>
              <MataKuliahDosen />
            </PrivateRoute>
          }
        />

        <Route
          path="/dosen/absensi"
          element={
            <PrivateRoute allowedRoles={["DOSEN"]}>
              <SesiAbsensiDosen />
            </PrivateRoute>
          }
        />

        {/* MAHASISWA */}
        <Route
          path="/mahasiswa/dashboard"
          element={
            <PrivateRoute allowedRoles={["MAHASISWA"]}>
              <DashboardMahasiswa />
            </PrivateRoute>
          }
        />

        <Route
          path="/mahasiswa/absen"
          element={
            <PrivateRoute allowedRoles={["MAHASISWA"]}>
              <AbsenMahasiswa />
            </PrivateRoute>
          }

        />
        <Route
          path="/mahasiswa/riwayat-absensi"
          element={
            <PrivateRoute allowedRoles={["MAHASISWA"]}>
              <RiwayatAbsensi />
            </PrivateRoute>
          }
        />

        {/* CATCH ALL (ANTI BLANK) */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
