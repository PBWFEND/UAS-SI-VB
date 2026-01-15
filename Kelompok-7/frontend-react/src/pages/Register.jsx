import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, { nama, email, password });
      alert('Pendaftaran Berhasil! Silakan Login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Pendaftaran Gagal');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      width: '100vw', 
      backgroundColor: '#ffffff', 
      fontFamily: "'Poppins', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Dekorasi Latar Belakang */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
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
        <h2 style={{ color: '#333', marginBottom: '8px', fontSize: '24px' }}>Buat Akun Baru</h2>
        <p style={{ color: '#777', marginBottom: '35px', fontSize: '15px' }}>Lengkapi data untuk mulai mengelola keuangan</p>
        
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#444', fontSize: '14px' }}>Nama Lengkap</label>
            <input 
              type="text" 
              placeholder="Nama lengkap Anda" 
              value={nama} 
              onChange={(e) => setNama(e.target.value)} 
              required 
              style={{ 
                width: '100%', 
                padding: '14px 16px', 
                borderRadius: '12px', 
                border: '1.5px solid #eee', 
                boxSizing: 'border-box',
                fontSize: '15px',
                outlineColor: '#28a745'
              }} 
            />
          </div>

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
                outlineColor: '#28a745'
              }} 
            />
          </div>

          <div style={{ marginBottom: '30px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#444', fontSize: '14px' }}>Kata Sandi</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Buat kata sandi aman" 
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
            Daftar Sekarang
          </button>
        </form>
        
        <p style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
          Sudah punya akun? <Link to="/login" style={{ color: '#28a745', fontWeight: 'bold', textDecoration: 'none' }}>Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;