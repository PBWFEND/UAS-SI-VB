import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="app-shell">
      <header className="sticky top-0 z-20 bg-bsm-bg/90 backdrop-blur border-b border-bsm-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-bsm-accent to-bsm-accent2 grid place-items-center font-bold">
              BSM
            </div>
            <div>
              <div className="font-semibold text-sm">Sistem Penjualan Beras</div>
              <div className="text-xs text-bsm-muted">Pabrik BSM</div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated && user && (
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-bsm-card grid place-items-center text-xs">
                  {user.nama?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()}
                </div>
                <div className="text-xs">
                  <div className="font-semibold">{user.nama || user.username}</div>
                  <div className="text-bsm-muted">
                    {user.role}
                  </div>
                </div>
              </div>
            )}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="text-xs px-3 py-1.5 rounded-lg border border-bsm-border hover:border-bsm-accent"
              >
                Keluar
              </button>
            ) : (
              <div className="flex gap-2 text-xs">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg border border-bsm-border hover:border-bsm-accent"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-lg bg-bsm-accent hover:bg-bsm-accent2"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main-container">{children}</main>

      <footer className="border-t border-bsm-border text-center text-xs text-bsm-muted py-4">
        Sistem Penjualan Beras Pabrik BSM — UAS Backend.
      </footer>
    </div>
  );
};

export default Layout;
