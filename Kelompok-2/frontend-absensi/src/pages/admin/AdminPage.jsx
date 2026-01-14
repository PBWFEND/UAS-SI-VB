import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import api from "../../api/api";
import "../../styles/admin-crud.css";

export default function AdminPage() {
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [success, setSuccess] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin");
      setAdmins(res.data);
    } catch {
      setErrorMsg("Gagal memuat data admin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setErrorMsg("");

    try {
      if (editingId) {
        await api.put(`/admin/${editingId}`, {
          name: form.name,
          email: form.email,
        });
        setSuccess("Data admin berhasil diperbarui");
      } else {
        await api.post("/auth/register-admin", form);
        setSuccess("Data admin berhasil ditambahkan");
      }

      setShowModal(false);
      setEditingId(null);
      setForm({ name: "", email: "", password: "" });
      fetchAdmins();
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "Gagal menyimpan data admin"
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus admin ini?")) return;

    setSuccess("");
    setErrorMsg("");

    try {
      await api.delete(`/admin/${id}`);
      setSuccess("Data admin berhasil dihapus");
      fetchAdmins();
    } catch {
      setErrorMsg("Gagal menghapus admin");
    }
  };

  const handleEdit = (admin) => {
    setEditingId(admin.id);
    setForm({
      name: admin.name,
      email: admin.email,
      password: "",
    });
    setShowModal(true);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-content">
        {/* HEADER */}
        <header className="crud-header">
          <div>
            <h1>Manajemen Admin</h1>
            <p>Kelola akun admin sistem UNSAPresent</p>
          </div>
        </header>

        {/* TOTAL + TAMBAH (SEJAJAR & KONSISTEN) */}
        <section className="stat-action-row">
          <div className="mini-stat">
            <span>Total Admin</span>
            <h3>{admins.length}</h3>
          </div>

          <button
            className="primary-btn"
            onClick={() => {
              setEditingId(null);
              setForm({ name: "", email: "", password: "" });
              setShowModal(true);
            }}
          >
            + Tambah Admin
          </button>
        </section>

        {success && <div className="alert success">{success}</div>}
        {errorMsg && <div className="alert error">{errorMsg}</div>}

        {loading ? (
          <p>Memuat data...</p>
        ) : (
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
                {admins.map((a, i) => (
                  <tr key={a.id}>
                    <td>{i + 1}</td>
                    <td>{a.name}</td>
                    <td>{a.email}</td>
                    <td className="action-cell">
                      <button
                        className="btn secondary-btn"
                        onClick={() => handleEdit(a)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn danger-btn"
                        onClick={() => handleDelete(a.id)}
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
              <h3>{editingId ? "Edit Admin" : "Tambah Admin Baru"}</h3>
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
