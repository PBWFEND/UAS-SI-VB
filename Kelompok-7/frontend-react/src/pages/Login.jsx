import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
      
      localStorage.setItem('token', res.data.token);
      const namaUser = res.data.user?.nama || res.data.nama || 'Pengguna';
      localStorage.setItem('userNama', namaUser);
      
      alert('Selamat Datang!');
      navigate('/dashboard'); 
      window.location.reload(); 
    } catch (err) {
      alert(err.response?.data?.message || 'Login Gagal');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      width: '100vw', 
      backgroundColor: '#ffffff', // Background putih
      fontFamily: "'Poppins', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Dekorasi Latar Belakang */}
      <div style={{
        position: 'absolute',
        bottom: '-100px',
        left: '-100px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(40, 167, 69, 0.08) 0%, rgba(255, 255, 255, 0) 100%)',
        zIndex: 0
      }}></div>

      <div style={{ 
        width: '100%', 
        maxWidth: '420px', 
        padding: '50px 40px', 
        backgroundColor: '#ffffff', 
        borderRadius: '24px', 
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)', 
        textAlign: 'center',
        zIndex: 1,
        border: '1px solid rgba(0,0,0,0.02)'
      }}>
        {/* Logo/Nama Aplikasi */}
        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#28a745', marginBottom: '10px' }}>
           💰 SAKU
        </div>
        <h2 style={{ color: '#333', marginBottom: '8px', fontSize: '24px' }}>Selamat Datang Kembali</h2>
        <p style={{ color: '#777', marginBottom: '35px', fontSize: '15px' }}>Silakan masuk untuk mengelola keuanganmu</p>
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#444', fontSize: '14px' }}>Email</label>
            <input 
              type="email" 
              placeholder="nama@email.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ 
                width: '100%', 
                padding: '14px 16px', 
                borderRadius: '12px', 
                border: '1.5px solid #eee', 
                boxSizing: 'border-box',
                fontSize: '15px',
                outlineColor: '#28a745',
                transition: '0.3s'
              }} 
            />
          </div>

          <div style={{ marginBottom: '30px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#444', fontSize: '14px' }}>Kata Sandi</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Masukkan kata sandi" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{ 
                  width: '100%', 
                  padding: '14px 16px', 
                  paddingRight: '50px', 
                  borderRadius: '12px', 
                  border: '1.5px solid #eee', 
                  boxSizing: 'border-box',
                  fontSize: '15px',
                  outlineColor: '#28a745'
                }} 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: 'absolute', 
                  right: '15px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '18px',
                  color: '#aaa'
                }}
              >
                {showPassword ? '🔒' : '👁️'}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              padding: '16px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '12px', 
              fontSize: '16px', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              boxShadow: '0 8px 15px rgba(40, 167, 69, 0.2)',
              transition: '0.3s'
            }}
          >
            Masuk Sekarang
          </button>
        </form>
        
        <p style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
          Belum punya akun? <Link to="/register" style={{ color: '#28a745', fontWeight: 'bold', textDecoration: 'none' }}>Daftar di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;