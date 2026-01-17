import { useEffect, useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, FileDown } from "lucide-react";
import api from "../../api/api";
import MahasiswaSidebar from "../../components/mahasiswa/MahasiswaSidebar";
import "../../styles/mahasiswa.css";

export default function RiwayatAbsensi() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMk, setFilterMk] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        const res = await api.get("/mahasiswa/riwayat-absensi");
        setData(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRiwayat();
  }, []);

  /* FILTER */
  const filteredData = useMemo(() => {
    if (filterMk === "ALL") return data;
    return data.filter((d) => d.mataKuliah === filterMk);
  }, [data, filterMk]);

  /* PAGINATION */
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  /* LIST MK */
  const mataKuliahList = useMemo(() => {
    return ["ALL", ...new Set(data.map((d) => d.mataKuliah))];
  }, [data]);

  /* EXPORT PDF */
  const exportPDF = async () => {
    try {
      const params =
        filterMk !== "ALL" ? `?mk=${encodeURIComponent(filterMk)}` : "";

      const res = await api.get(
        `/mahasiswa/riwayat-absensi/pdf${params}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = "riwayat-absensi.pdf";
      link.click();
    } catch {
      alert("Gagal export PDF");
    }
  };

  return (
    <div className="mahasiswa-layout">
      <MahasiswaSidebar />

      <main className="mahasiswa-content">
        <h2>Riwayat Absensi</h2>
        <p className="subtitle">Daftar kehadiran perkuliahan Anda</p>

        {loading ? (
          <p>Memuat data...</p>
        ) : (
          <>
            {/* ACTIONS */}
            <div className="table-actions">
              <select
                value={filterMk}
                onChange={(e) => {
                  setFilterMk(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {mataKuliahList.map((mk) => (
                  <option key={mk} value={mk}>
                    {mk}
                  </option>
                ))}
              </select>

              <button className="btn-export" onClick={exportPDF}>
                <FileDown size={16} />
                <span>Unduh PDF</span>
              </button>
            </div>

            {/* TABLE */}
            <div className="table-card">
              <table className="table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Mata Kuliah</th>
                    <th>Dosen</th>
                    <th>Tanggal</th>
                    <th>Jam</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item, i) => (
                    <tr key={i}>
                      <td>{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</td>
                      <td>
                        {item.mataKuliah}
                        <br />
                        <small>{item.kodeMk}</small>
                      </td>
                      <td>{item.dosen}</td>
                      <td>{item.tanggal}</td>
                      <td>{item.jam}</td>
                      <td>
                        <span
                          className={`badge ${
                            item.status === "HADIR"
                              ? "badge-success"
                              : "badge-danger"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="pagination">
              <button
                className="icon-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft size={18} />
              </button>

              <span>
                Page <strong>{currentPage}</strong> of {totalPages}
              </span>

              <button
                className="icon-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
