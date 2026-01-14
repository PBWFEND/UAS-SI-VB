import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/auth.service";
import "../styles/auth.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      setError("Register gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Register</h2>

        {error && <p className="error">{error}</p>}

                <input
            className="auth-input"
            name="name"
            placeholder="Nama"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            className="auth-input"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            className="auth-input"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />


        <button disabled={loading}>
          {loading ? "Loading..." : "Register"}
        </button>

        <p>
          Sudah punya akun? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
