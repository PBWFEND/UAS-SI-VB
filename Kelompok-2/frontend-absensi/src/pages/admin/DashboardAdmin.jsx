import { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  ShieldCheck,
  Menu,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import api from "../../api/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import "../../styles/admin.css";

export default function DashboardAdmin() {
  const [stats, setStats] = useState({
    mahasiswa: 0,
    dosen: 0,
    admin: 0,
  });

  useEffect(() => {
    api
      .get("/admin/dashboard/stats")
      .then((res) => setStats(res.data))
      .catch(() =>
        setStats({ mahasiswa: 3, dosen: 2, admin: 1 })
      );
  }, []);

  const pieData = [
    { name: "Mahasiswa", value: stats.mahasiswa },
    { name: "Dosen", value: stats.dosen },
  ];

  const COLORS = ["#2563eb", "#16a34a"];

  return (
    <div className="admin-layout">
      <AdminSidebar />


      <main className="admin-content dashboard">

        {/* HEADER */}
        <header className="dashboard-header-academic">
          <h1>Dashboard Administrator</h1>
          <p>Ringkasan data dan pemantauan sistem akademik UNSAPresent</p>
        </header>

        {/* STAT CARDS */}
        <section className="dashboard-stat-cards">
          <div className="stat-academic blue">
            <div>
              <span>Total Mahasiswa</span>
              <h2>{stats.mahasiswa}</h2>
            </div>
            <Users />
          </div>

          <div className="stat-academic green">
            <div>
              <span>Total Dosen</span>
              <h2>{stats.dosen}</h2>
            </div>
            <GraduationCap />
          </div>

          <div className="stat-academic purple">
            <div>
              <span>Total Admin</span>
              <h2>{stats.admin}</h2>
            </div>
            <ShieldCheck />
          </div>
        </section>

        {/* CHART */}
        <section className="dashboard-chart-card">
          <div className="chart-header">
            <h3>Distribusi Pengguna</h3>
            <p>Perbandingan peran dalam sistem</p>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={90}
                outerRadius={130}
                paddingAngle={5}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </main>
    </div>
  );
}
