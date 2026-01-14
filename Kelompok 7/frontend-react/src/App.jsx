import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Welcome from './pages/Welcome';

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman pertama yang dibuka adalah Welcome */}
        <Route path="/" element={<Welcome />} />
        
        {/* Dashboard dipindah ke path /dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;