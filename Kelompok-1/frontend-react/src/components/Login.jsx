import { useState } from 'react';
import { login } from '../api/api';

export default function Login({ onLogin, onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.token) {
      localStorage.setItem('token', res.token);
      onLogin(res.token);
    } else {
      alert(res.message || 'Login gagal');
    }
  };

  return (
    <div className="card">
      <h1 className="app-title">Blossom Tasks</h1>
      <span className="welcome-text">Welcome Back ✿ Please login to continue</span>
      
      <form onSubmit={handleSubmit}>
        <input 
          placeholder="Email Address" 
          type="email"
          onChange={e => setEmail(e.target.value)} 
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          onChange={e => setPassword(e.target.value)} 
          required
        />
        <button type="submit" className="main-btn">Login to Blossom</button>
      </form>

      <div className="switch-text">
        Don't have an account? 
        <span className="switch-link" onClick={onSwitch}>Register here</span>
      </div>
    </div>
  );
}