import { useState } from "react";
import api from "../../api/api";
import MahasiswaSidebar from "../../components/mahasiswa/MahasiswaSidebar";
import "../../styles/mahasiswa.css";

export default function AbsenMahasiswa() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(""); // success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code) return;

    try {
      setLoading(true);
      setMessage(null);

      await api.post("/absence/attendance", {
        code: code.toUpperCase(),
      });

      setStatus("success");
      setMessage("Absen berhasil. Terima kasih 🙌");
      setCode("");
    } catch (err) {
      setStatus("error");
      setMessage(
        err.response?.data?.message ||
        "Kode tidak valid atau sesi tidak aktif"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mahasiswa-layout">
      <MahasiswaSidebar />

      <main className="mahasiswa-content">
        <header className="mahasiswa-header">
          <h1>Absen Kehadiran</h1>
          <p>Masukkan kode absensi dari dosen</p>
        </header>

        <section className="absen-card">
          <form onSubmit={handleSubmit}>
            <label>Kode Absensi</label>

            <input
              type="text"
              placeholder="Contoh: A7F9K2"
              value={code}
              maxLength={6}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />

            <button
              className="btn btn-primary"
              disabled={loading || !code}
            >
              {loading ? "Memproses..." : "Absen Sekarang"}
            </button>
          </form>

          {message && (
            <div className={`alert ${status}`}>
              {message}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
