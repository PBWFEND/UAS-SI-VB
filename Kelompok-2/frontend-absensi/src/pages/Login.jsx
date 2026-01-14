import { useState } from "react";
import api from "../api/api";
import "../styles/login.css";
import logoUNSAP from "../assets/UNSAP.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("name", res.data.user.name);

      const role = res.data.user.role;
      if (role === "ADMIN") window.location.href = "/admin/dashboard";
      else if (role === "DOSEN") window.location.href = "/dosen/dashboard";
      else window.location.href = "/mahasiswa/dashboard";
    } catch {
      setError("Email atau password salah");
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <form className="login-glass" onSubmit={handleLogin}>
        {/* BRAND */}
        <div className="brand horizontal">
          <img src={logoUNSAP} alt="Logo UNSAP" />
          <div className="brand-text">
            <h1>UNSAPresent</h1>
            <p>Sistem Absensi Digital Kampus</p>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading} className="login-btn">
          {loading ? (
            <span className="spinner"></span>
          ) : (
            "Masuk"
          )}
        </button>

        <span className="footer">
          © {new Date().getFullYear()} Universitas Sebelas April
        </span>
      </form>
    </div>
  );
}
