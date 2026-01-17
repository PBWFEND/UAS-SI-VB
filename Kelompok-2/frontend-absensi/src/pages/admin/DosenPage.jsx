import { useEffect, useState } from "react";
import api from "../../api/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import "../../styles/admin-crud.css";

export default function DosenPage() {
  const [dosen, setDosen] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const fetchDosen = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/dosen");
      setDosen(res.data);
    } catch {
      setError("Gagal memuat data dosen");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDosen();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      if (isEdit) {
        await api.put(`/admin/dosen/${selectedId}`, {
          name: form.name,
          email: form.email,
        });
        setSuccess("Data dosen berhasil diperbarui");
      } else {
        await api.post("/admin/dosen", form);
        setSuccess("Data dosen berhasil ditambahkan");
      }

      setShowModal(false);
      setIsEdit(false);
      setSelectedId(null);
      setForm({ name: "", email: "", password: "" });
      fetchDosen();
    } catch {
      setError("Gagal menyimpan data dosen");
    }
  };

  const handleEdit = (d) => {
    setIsEdit(true);
    setSelectedId(d.id);
    setForm({ name: d.name, email: d.email, password: "" });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus dosen ini?")) return;

    try {
      await api.delete(`/admin/dosen/${id}`);
      setSuccess("Data dosen berhasil dihapus");
      fetchDosen();
    } catch {
      setError("Gagal menghapus dosen");
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-content">
        {/* HEADER */}
        <header className="crud-header">
          <div>
            <h1>Manajemen Dosen</h1>
            <p>Kelola akun dosen sistem UNSAPresent</p>
          </div>
        </header>

        {/* TOTAL + TAMBAH */}
        <section className="stat-action-row">
          <div className="mini-stat">
            <span>Total Dosen</span>
            <h3>{dosen.length}</h3>
          </div>

          <button
            className="primary-btn"
            onClick={() => {
              setIsEdit(false);
              setSelectedId(null);
              setForm({ name: "", email: "", password: "" });
              setShowModal(true);
            }}
          >
            + Tambah Dosen
          </button>
        </section>

        {success && <div className="alert success">{success}</div>}
        {error && <div className="alert error">{error}</div>}
        {loading && <p>Memuat data...</p>}

        {!loading && (
          <div className="crud-card">
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dosen.map((d, i) => (
                  <tr key={d.id}>
                    <td>{i + 1}</td>
                    <td>{d.name}</td>
                    <td>{d.email}</td>
                    <td className="action-cell">
                      <button
                        className="btn secondary-btn"
                        onClick={() => handleEdit(d)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn danger-btn"
                        onClick={() => handleDelete(d.id)}
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
              <h3>{isEdit ? "Edit Dosen" : "Tambah Dosen"}</h3>
              <br/>
              <form onSubmit={handleSubmit}>
                <input
                  placeholder="Nama"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  required
                />

                {!isEdit && (
                  <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                )}

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
