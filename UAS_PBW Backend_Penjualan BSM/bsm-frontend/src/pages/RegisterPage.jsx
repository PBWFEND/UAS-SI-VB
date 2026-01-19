import { useState } from 'react';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nama: '',
    username: '',
    password: '',
    alamat: '',
    no_hp: '',
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: 'info', text: '' });

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: 'info', text: '' });
    setLoading(true);
    try {
      const payload = {
        ...form,
        role: 'KONSUMEN',
      };
      const res = await register(payload);
      setMsg({
        type: 'success',
        text: res.data?.message || 'Registrasi berhasil',
      });
      setTimeout(() => navigate('/login', { replace: true }), 800);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 422) {
        const errors = err.response.data?.errors || [];
        const text = errors.map((e) => `- ${e.msg}`).join('\n');
        setMsg({ type: 'error', text: `Validasi gagal:\n${text}` });
      } else {
        setMsg({
          type: 'error',
          text: err.response?.data?.message || 'Registrasi gagal',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-bsm-card border border-bsm-border rounded-xl p-6 shadow-lg">
        <h1 className="text-xl font-semibold mb-1">Daftar Konsumen</h1>
        <p className="text-xs text-bsm-muted mb-4">
          Akun baru otomatis memiliki peran <b>KONSUMEN</b>.
        </p>

        <Alert
          type={msg.type}
          message={msg.text}
          onClose={() => setMsg({ type: 'info', text: '' })}
        />

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block mb-1">Nama</label>
            <input
              name="nama"
              value={form.nama}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-bsm-panel border border-bsm-border text-xs outline-none focus:ring-1 focus:ring-bsm-accent"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-bsm-panel border border-bsm-border text-xs outline-none focus:ring-1 focus:ring-bsm-accent"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-bsm-panel border border-bsm-border text-xs outline-none focus:ring-1 focus:ring-bsm-accent"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Alamat</label>
            <textarea
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-bsm-panel border border-bsm-border text-xs outline-none focus:ring-1 focus:ring-bsm-accent resize-y"
            />
          </div>
          <div>
            <label className="block mb-1">No HP</label>
            <input
              name="no_hp"
              value={form.no_hp}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-bsm-panel border border-bsm-border text-xs outline-none focus:ring-1 focus:ring-bsm-accent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-2 text-xs rounded-lg bg-gradient-to-br from-bsm-accent to-bsm-accent2 hover:brightness-110 disabled:opacity-60"
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p className="text-[11px] text-bsm-muted mt-4">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-emerald-300 underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
