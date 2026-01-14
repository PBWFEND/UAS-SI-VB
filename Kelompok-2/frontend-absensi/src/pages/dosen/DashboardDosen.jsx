import { useEffect, useState } from "react";
import api from "../../api/api";
import DosenSidebar from "../../components/dosen/DosenSidebar";
import "../../styles/dosen.css";

import {
  BookOpen,
  Radio,
  Users,
  CalendarCheck,
  GraduationCap,
} from "lucide-react";

/* ===== STAT CARD ===== */
function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon size={22} />
      </div>
      <div className="stat-info">
        <span>{label}</span>
        <h3>{value}</h3>
      </div>
    </div>
  );
}

export default function DashboardDosen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/dosen/dashboard")
      .then((res) => setData(res.data))
      .catch(() => alert("Gagal memuat dashboard dosen"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="empty">Memuat dashboard...</p>;
  }

  if (!data) {
    return <p className="empty">Data tidak tersedia</p>;
  }

  const { dosen, stats, courses } = data;

  /* ===== HITUNG PROGRESS ===== */
  const rawProgress =
    stats.maxMeetings > 0
      ? (stats.activeMeeting / stats.maxMeetings) * 100
      : 0;

  // 🔥 FIX VISUAL: Biar progress bar tetap kelihatan
  const progressPercent =
    rawProgress === 0 && stats.activeSessions > 0
      ? 2
      : Math.min(rawProgress, 100);

  return (
    <div className="dosen-layout">
      <DosenSidebar />

    <main className="dosen-content-wrapper">
      <div className="dosen-content">
        <div className="dosen-dashboard">
        {/* HEADER */}
        <header className="dosen-header">
          <h1>Dashboard Dosen</h1>
          <p>
            {dosen.name} • {dosen.email}
          </p>
        </header>

        {/* STATISTIK */}
        <section className="stats-grid">
          <StatCard
            icon={BookOpen}
            label="Mata Kuliah"
            value={stats.totalCourses}
          />
          <StatCard
            icon={Radio}
            label="Sesi Aktif"
            value={stats.activeSessions}
          />
          <StatCard
            icon={Users}
            label="Absensi Hari Ini"
            value={stats.absensiHariIni}
          />
          <StatCard
            icon={CalendarCheck}
            label="Pertemuan Ke"
            value={stats.activeMeeting}
          />
        </section>

        {/* PROGRESS */}
        <section className="progress-wrapper">
          <div className="progress-header">
            <div className="progress-title">
              <GraduationCap size={20} />
              <span>Progress Mengajar</span>
            </div>

            <span className="progress-count">
              {stats.activeMeeting} / {stats.maxMeetings} Pertemuan
            </span>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="progress-label">
            {Math.round(rawProgress)}% semester terpenuhi
          </p>

          {stats.activeMeeting >= stats.maxMeetings && (
            <p className="progress-done">
              ✔ Seluruh pertemuan semester telah terpenuhi
            </p>
          )}
        </section>

        {/* MATA KULIAH */}
        <section className="course-grid">
          {courses.length === 0 && (
            <div className="empty">Belum ada mata kuliah</div>
          )}

          {courses.map((c) => (
            <div className="course-card" key={c.id}>
              <h3>{c.name}</h3>
              <span>Kode: {c.code}</span>

              <span>
                Status:{" "}
                <span
                  className={`badge ${
                    c.activeSession ? "badge-open" : "badge-close"
                  }`}
                >
                  {c.activeSession ? "Sesi Aktif" : "Tidak Aktif"}
                </span>
              </span>

              <p className="hint">
                Kelola sesi absensi di menu <b>Sesi Absensi</b>
              </p>
            </div>
          ))}
        </section>
    </div>
    </div>
      </main>
    </div>
  );
}
