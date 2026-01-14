import { useEffect, useState } from "react";
import api from "../../api/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import "../../styles/admin-crud.css";

export default function MahasiswaPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    npm: "",
    password: "",
  });

  const fetchMahasiswa = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/mahasiswa");
      setData(res.data);
    } catch {
      setError("Gagal memuat data mahasiswa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMahasiswa();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      if (editingId) {
        await api.put(`/admin/mahasiswa/${editingId}`, {
          name: form.name,
          email: form.email,
          npm: form.npm,
        });
        setSuccess("Data mahasiswa berhasil diperbarui");
      } else {
        await api.post("/admin/mahasiswa", form);
        setSuccess("Mahasiswa berhasil ditambahkan");
      }

      setShowModal(false);
      setEditingId(null);
      setForm({ name: "", email: "", npm: "", password: "" });
      fetchMahasiswa();
    } catch {
      setError("Gagal menyimpan data mahasiswa");
    }
  };

  const handleEdit = (m) => {
    setEditingId(m.id);
    setForm({ name: m.name, email: m.email, npm: m.npm, password: "" });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus mahasiswa ini?")) return;

    try {
      await api.delete(`/admin/mahasiswa/${id}`);
      setSuccess("Mahasiswa berhasil dihapus");
      fetchMahasiswa();
    } catch {
      setError("Gagal menghapus mahasiswa");
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-content">
        {/* HEADER */}
        <header className="crud-header">
          <div>
            <h1>Manajemen Mahasiswa</h1>
            <p>Kelola akun mahasiswa UNSAPresent</p>
          </div>
        </header>

        {/* TOTAL + TAMBAH (SEJAJAR) */}
        <section className="stat-action-row">
          <div className="mini-stat">
            <span>Total Mahasiswa</span>
            <h3>{data.length}</h3>
          </div>

          <button
            className="primary-btn"
            onClick={() => {
              setEditingId(null);
              setForm({ name: "", email: "", npm: "", password: "" });
              setShowModal(true);
            }}
          >
            + Tambah Mahasiswa
          </button>
        </section>

        {success && <div className="alert success">{success}</div>}
        {error && <div className="alert error">{error}</div>}

        {!loading && (
          <div className="crud-card">
             <div className="table-wrapper"></div>
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>NPM</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((m, i) => (
                  <tr key={m.id}>
                    <td>{i + 1}</td>
                    <td>{m.name}</td>
                    <td>{m.email}</td>
                    <td>{m.npm}</td>
                    <td className="action-cell">
                      <button
                        className="btn secondary-btn"
                        onClick={() => handleEdit(m)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn danger-btn"
                        onClick={() => handleDelete(m.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
             <div className="table-wrapper"></div>
          </div>
        )}

        {/* MODAL */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h3>{editingId ? "Edit Mahasiswa" : "Tambah Mahasiswa"}</h3>
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
                  placeholder="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  required
                />
                <input
                  placeholder="NPM"
                  value={form.npm}
                  onChange={(e) =>
                    setForm({ ...form, npm: e.target.value })
                  }
                  required
                />

                {!editingId && (
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
