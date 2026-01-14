import { useEffect, useState } from "react";
import api from "../../api/api";
import DosenSidebar from "../../components/dosen/DosenSidebar";
import "../../styles/dosen.css";

export default function SesiAbsensiDosen() {
  const [courses, setCourses] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, activeSessionRes] = await Promise.all([
          api.get("/dosen/dashboard"),
          api.get("/dosen/session/active"),
        ]);

        setCourses(dashboardRes.data.courses);
        setActiveSession(activeSessionRes.data); // null / session aktif
      } catch (error) {
        alert("Gagal memuat data sesi absensi");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ================= CEK COURSE AKTIF ================= */
  const isActiveCourse = (courseId) => {
    return activeSession && activeSession.courseId === courseId;
  };

  /* ================= BUKA SESI ================= */
  const bukaSesi = async (courseId) => {
    try {
      const res = await api.post("/dosen/session", { courseId });
      setActiveSession(res.data.session);
      alert("Sesi absensi berhasil dibuka");
    } catch (err) {
      alert(err.response?.data?.message || "Gagal membuka sesi");
    }
  };

  /* ================= TUTUP SESI ================= */
  const tutupSesi = async (sessionId) => {
    try {
      await api.patch(`/dosen/session/${sessionId}/close`);
      setActiveSession(null);
      alert("Sesi absensi berhasil ditutup");
    } catch {
      alert("Gagal menutup sesi");
    }
  };

  /* ================= DOWNLOAD PDF ================= */
  const downloadPDF = async (sessionId) => {
    try {
      const res = await api.get(
        `/dosen/recap/session/${sessionId}/pdf`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute(
        "download",
        `rekap-absensi-session-${sessionId}.pdf`
      );

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Gagal download rekap PDF");
    }
  };

  if (loading) {
    return <p className="empty">Memuat sesi absensi...</p>;
  }

  return (
    <div className="dosen-layout">
      <DosenSidebar />

    <main className="dosen-content-wrapper">
      <div className="dosen-content">
        <div className="sesi-absensi">
        {/* ================= HEADER ================= */}
        <header className="dosen-header">
          <h1>Sesi Absensi</h1>
          <p>Kelola sesi absensi per mata kuliah</p>
        </header>

        {/* ================= SESI AKTIF ================= */}
        {activeSession && (
          <div className="active-session-card">
            <h3>Sesi Absensi Aktif</h3>

            <p>Kode Absensi</p>
            <div className="absence-code">
              {activeSession.code}
            </div>

            <div className="session-actions">
              <button
                className="btn btn-cancel"
                onClick={() => tutupSesi(activeSession.id)}
              >
                Tutup Sesi
              </button>

              <button
                className="btn btn-pdf"
                onClick={() => downloadPDF(activeSession.id)}
              >
              Unduh Rekap PDF
              </button>
            </div>
            
          </div>
        )}

        {/* ================= DAFTAR MATA KULIAH ================= */}
        <section className="course-grid">
          {courses.length === 0 && (
            <p className="empty">Belum ada mata kuliah</p>
          )}

          {courses.map((c) => (
            <div className="course-card" key={c.id}>
              <h3>{c.name}</h3>
              <span>Kode: {c.code}</span>

              <div className="progress-wrapper">
                <div className="progress-header">
                  <span>Pertemuan</span>
                  <span>{c.totalSessions} / 16</span>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(
                        (c.totalSessions / 16) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* ===== BUTTON ===== */}
              <button
                className={`btn ${
                  isActiveCourse(c.id)
                    ? "btn-active"
                    : activeSession
                    ? "btn-disabled"
                    : "btn-primary"
                }`}
                disabled={
                  c.totalSessions >= 16 ||
                  (activeSession && !isActiveCourse(c.id))
                }
                onClick={() => bukaSesi(c.id)}
              >
                {c.totalSessions >= 16
                  ? "Pertemuan Selesai"
                  : isActiveCourse(c.id)
                  ? "Sesi Sedang Aktif"
                  : "Buka Sesi Absensi"}
              </button>
            </div>
          ))}
        </section>
        </div>
        </div>
      </main>
    </div>
  );
}
