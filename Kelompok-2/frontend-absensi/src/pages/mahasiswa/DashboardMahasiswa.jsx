import { useEffect, useState } from "react";
import api from "../../api/api";
import MahasiswaSidebar from "../../components/mahasiswa/MahasiswaSidebar";
import ActiveSessionCard from "../../components/mahasiswa/ActiveSessionCard";
import "../../styles/mahasiswa.css";

import {
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Activity,
  Wifi,
  WifiOff,
} from "lucide-react";

/* STAT CARD */
function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="mhs-stat-card">
      <div className="mhs-stat-icon">
        <Icon size={22} />
      </div>
      <div className="mhs-stat-info">
        <span>{label}</span>
        <h3>{value}</h3>
      </div>
    </div>
  );
}

export default function DashboardMahasiswa() {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    totalMk: 0,
    hadir: 0,
    alfa: 0,
  });
  const [statMk, setStatMk] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const dashboardRes = await api.get("/mahasiswa/dashboard");

        setStats({
          totalMk: dashboardRes.data.totalMk,
          hadir: dashboardRes.data.hadir,
          alfa: dashboardRes.data.alfa,
        });

        setSessions(dashboardRes.data.activeSessions || []);

        try {
          const statMkRes = await api.get("/mahasiswa/statistik-mk");
          setStatMk(statMkRes.data.slice(0, 3));
        } catch {
          setStatMk([]);
        }
      } catch (err) {
        console.error("Gagal memuat dashboard mahasiswa", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="mahasiswa-layout">
        <MahasiswaSidebar />
        <main className="mahasiswa-content">
          <p className="empty">Memuat dashboard...</p>
        </main>
      </div>
    );
  }

  const isActive = sessions.length > 0;

  return (
    <div className="mahasiswa-layout">
      <MahasiswaSidebar />

      <main className="mahasiswa-content">
        {/* HEADER */}
        <header className="mhs-header">
          <div>
            <h1>Dashboard Mahasiswa</h1>
            <p>Ringkasan aktivitas akademik Anda</p>
          </div>
          <BarChart3 size={42} />
        </header>

        {/* STAT */}
        <section className="mhs-stats-grid">
          <StatCard icon={BookOpen} label="Mata Kuliah" value={stats.totalMk} />
          <StatCard icon={CheckCircle} label="Hadir" value={stats.hadir} />
          <StatCard icon={XCircle} label="Tidak Hadir" value={stats.alfa} />
          <StatCard icon={Clock} label="Sesi Aktif" value={sessions.length} />
        </section>

        {/* SESI AKTIF */}
        <section className="mhs-section">
          <div className="section-header">
            <div className="section-title">
              <Activity size={20} />
              <h2>Sesi Absensi</h2>
            </div>

            <div className={`session-status ${isActive ? "active" : "inactive"}`}>
              {isActive ? <Wifi size={16} /> : <WifiOff size={16} />}
              {isActive ? "Aktif" : "Tidak Aktif"}
            </div>
          </div>

          {sessions.length === 0 ? (
            <div className="empty-session-card">
              <WifiOff size={36} />
              <h4>Tidak Ada Sesi Aktif</h4>
              <p>Sesi absensi akan muncul sesuai jadwal perkuliahan</p>
            </div>
          ) : (
            <div className="active-session-grid">
              {sessions.map((s) => (
                <ActiveSessionCard key={s.sessionId} session={s} />
              ))}
            </div>
          )}
        </section>

        {/* STATISTIK MK */}
        <section className="mhs-section">
          <div className="section-header">
            <h1>Statistik Kehadiran</h1>
          </div>

          {statMk.length === 0 ? (
            <p className="empty">Belum ada data kehadiran</p>
          ) : (
            <div className="mhs-mk-grid">
              {statMk.map((mk) => (
                <div key={mk.courseId} className="mk-card">
                  <h4>{mk.namaMk}</h4>
                  <small>{mk.kodeMk}</small>

                  <div className="progress">
                    <div
                      className={`progress-bar ${
                        mk.persentase < 75 ? "danger" : ""
                      }`}
                      style={{ width: `${mk.persentase}%` }}
                    />
                  </div>

                  <p className="percentage">
                    {mk.hadir}/{mk.totalPertemuan} hadir ({mk.persentase}%)
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
