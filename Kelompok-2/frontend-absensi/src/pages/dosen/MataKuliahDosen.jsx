import { useEffect, useState } from "react";
import api from "../../api/api";
import DosenSidebar from "../../components/dosen/DosenSidebar";
import "../../styles/matakuliah.css";

export default function MataKuliahPage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api.get("/dosen/dashboard").then((res) => {
      setCourses(res.data.courses);
    });
  }, []);

  /* ===== DOWNLOAD REKAP PDF (SEMUA PERTEMUAN) ===== */
  const downloadRekapAbsensi = async (courseId, courseCode) => {
    try {
      const res = await api.get(
        `/dosen/recap/matakuliah/${courseId}/pdf`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = `rekap-absensi-${courseCode}.pdf`;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Gagal mengunduh rekap absensi");
    }
  };

  return (
    <div className="dosen-layout">
      <DosenSidebar />

    <main className="dosen-content-wrapper">
      <div className="dosen-content">
        <header className="wow-header">
          <h1>Mata Kuliah</h1>
          <p>Daftar mata kuliah yang Anda ampu pada semester aktif</p>
        </header>

        <section className="wow-grid">
          {courses.map((c) => {
            const percent = Math.min((c.totalSessions / 16) * 100, 100);

            return (
              <div className="wow-card" key={c.id}>
                <div className="wow-top">
                  <h3>{c.name}</h3>
                  <span>{c.code}</span>
                </div>

                {/* PROGRESS CIRCLE */}
                <div
                  className="progress-circle"
                  style={{
                    background: `conic-gradient(#2563eb ${percent}%, #e5e7eb 0)`,
                  }}
                >
                  <div className="inner-circle">
                    <b>{c.totalSessions}</b>
                    <span>/ 16</span>
                  </div>
                </div>

                <div className="wow-info">
                  <span
                    className={`status ${
                      percent >= 100 ? "done" : "active"
                    }`}
                  >
                    {percent >= 100
                      ? "Semester Selesai"
                      : "Perkuliahan Aktif"}
                  </span>

                  <p>
                    Total Pertemuan: <b>{c.totalSessions}</b>
                  </p>
                </div>

                {/* ⬇️ INI FIX UTAMANYA */}
                <button
                  className="btn-recap"
                  onClick={() =>
                    downloadRekapAbsensi(c.id, c.code)
                  }
                >
                  Unduh Rekap Absensi
                </button>
              </div>
            );
          })}
        </section>
        </div>
      </main>
    </div>
  );
}
