import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await login(form.username, form.password);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 422
          ? 'Validasi gagal. Periksa input.'
          : 'Login gagal. Periksa username/password.');
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-bsm-card border border-bsm-border rounded-xl p-6 shadow-lg">
        <h1 className="text-xl font-semibold mb-1">Masuk</h1>
        <p className="text-xs text-bsm-muted mb-4">
          Gunakan akun sesuai peran: KONSUMEN / ADMIN / KARYAWAN.
        </p>

        <Alert
          type="error"
          message={errorMsg}
          onClose={() => setErrorMsg('')}
        />

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block mb-1">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-bsm-panel border border-bsm-border text-xs outline-none focus:ring-1 focus:ring-bsm-accent"
              autoComplete="username"
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
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-2 text-xs rounded-lg bg-gradient-to-br from-bsm-accent to-bsm-accent2 hover:brightness-110 disabled:opacity-60"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="text-[11px] text-bsm-muted mt-4">
          Belum punya akun?{' '}
          <Link to="/register" className="text-emerald-300 underline">
            Daftar sebagai konsumen
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
