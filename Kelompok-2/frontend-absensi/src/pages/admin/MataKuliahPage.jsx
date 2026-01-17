import { useEffect, useState } from "react";
import api from "../../api/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import "../../styles/admin-crud.css";

export default function MataKuliahPage() {
  const [courses, setCourses] = useState([]);
  const [dosenList, setDosenList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    code: "",
    name: "",
    dosenId: "",
  });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/courses");
      setCourses(res.data);
    } catch {
      setError("Gagal memuat data mata kuliah");
    } finally {
      setLoading(false);
    }
  };

  const fetchDosen = async () => {
    try {
      const res = await api.get("/admin/dosen");
      setDosenList(res.data);
    } catch {}
  };

  useEffect(() => {
    fetchCourses();
    fetchDosen();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSuccess("");
  setError("");

  const payload = {
    code: form.code,
    name: form.name,
    dosenId: Number(form.dosenId), 
  };

  try {
    if (editingId) {
      await api.put(`/admin/courses/${editingId}`, payload);
      setSuccess("Mata kuliah berhasil diperbarui");
    } else {
      await api.post("/admin/courses", payload);
      setSuccess("Mata kuliah berhasil ditambahkan");
    }

    setShowModal(false);
    setEditingId(null);
    setForm({ code: "", name: "", dosenId: "" });
    fetchCourses();
  } catch (err) {
    console.error(err);
    setError("Gagal menyimpan mata kuliah");
  }
};

  const handleEdit = (c) => {
    setEditingId(c.id);
    setForm({
      code: c.code,
      name: c.name,
      dosenId: c.dosenId,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus mata kuliah ini?")) return;

    try {
      await api.delete(`/admin/courses/${id}`);
      setSuccess("Mata kuliah berhasil dihapus");
      fetchCourses();
    } catch {
      setError("Gagal menghapus mata kuliah");
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-content">
        {/* HEADER */}
        <header className="crud-header">
          <div>
            <h1>Manajemen Mata Kuliah</h1>
            <p>Kelola data mata kuliah UNSAPresent</p>
          </div>
        </header>

        {/* TOTAL + TAMBAH */}
        <section className="stat-action-row">
          <div className="mini-stat">
            <span>Total Mata Kuliah</span>
            <h3>{courses.length}</h3>
          </div>

          <button
            className="primary-btn"
            onClick={() => {
              setEditingId(null);
              setForm({ code: "", name: "", dosenId: "" });
              setShowModal(true);
            }}
          >
            + Tambah Mata Kuliah
          </button>
        </section>

        {success && <div className="alert success">{success}</div>}
        {error && <div className="alert error">{error}</div>}

        {!loading && (
          <div className="crud-card">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Kode</th>
                  <th>Nama</th>
                  <th>Dosen</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c, i) => (
                  <tr key={c.id}>
                    <td>{i + 1}</td>
                    <td>{c.code}</td>
                    <td>{c.name}</td>
                    <td>{c.dosen?.name || "-"}</td>
                    <td className="action-cell">
                      <button
                        className="btn secondary-btn"
                        onClick={() => handleEdit(c)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn danger-btn"
                        onClick={() => handleDelete(c.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MODAL */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h3>
                {editingId ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}
              </h3>
              <br />
              <form onSubmit={handleSubmit}>
                <input
                  placeholder="Kode Mata Kuliah"
                  value={form.code}
                  onChange={(e) =>
                    setForm({ ...form, code: e.target.value })
                  }
                  required
                />

                <input
                  placeholder="Nama Mata Kuliah"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  required
                />

                <select
                  value={form.dosenId}
                  onChange={(e) =>
                    setForm({ ...form, dosenId: e.target.value })
                  }
                  required
                >
                  <option value="">Pilih Dosen</option>
                  {dosenList.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn cancel-btn"
                    onClick={() => setShowModal(false)}
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn primary-btn">
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
