import { useState } from 'react';
import { register } from '../api/api';

export default function Register({ onSwitch }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await register(name, email, password);
    if (res.data) {
      alert("Registration Successful!");
      onSwitch();
    } else {
      alert(res.message || "Registration failed");
    }
  };

  return (
    <div className="card">
      <h1 className="app-title">Blossom Tasks</h1>
      <span className="welcome-text">Create your account to start blooming 🌸</span>
      
      <form onSubmit={handleRegister}>
        <input 
          placeholder="Full Name" 
          onChange={e => setName(e.target.value)} 
          required 
        />
        <input 
          placeholder="Email Address" 
          type="email" 
          onChange={e => setEmail(e.target.value)} 
          required 
        />
        <input 
          placeholder="Create Password" 
          type="password" 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" className="main-btn">Create Account</button>
      </form>

      <div className="switch-text">
        Already have an account? 
        <span className="switch-link" onClick={onSwitch}>Login here</span>
      </div>
    </div>
  );
}