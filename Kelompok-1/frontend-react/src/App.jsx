import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import TaskPage from './components/TaskPage';
import './styles/main.css';
import { Toaster } from 'react-hot-toast';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <>
      <Toaster position="top-center" />
      
      {token ? (
        <TaskPage token={token} onLogout={() => { localStorage.removeItem('token'); setToken(null); }} />
      ) : (
        <div className="login-container">
          {isRegistering ? (
            <Register onSwitch={() => setIsRegistering(false)} />
          ) : (
            <Login onLogin={setToken} onSwitch={() => setIsRegistering(true)} />
          )}
        </div>
      )}
    </>
  );
}

export default App;