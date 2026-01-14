import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  History,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import logoUNSAP from "../../assets/UNSAP.png";
import "../../styles/mahasiswa.css";

export default function MahasiswaSidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* MOBILE TOPBAR */}
      <div className="mahasiswa-topbar">
        <button
          className="mahasiswa-sidebar-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle sidebar"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className="mahasiswa-topbar-brand">
          <img src={logoUNSAP} alt="Logo UNSAP" />
          <span>UNSAPresent</span>
        </div>
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          className="mahasiswa-sidebar-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`mahasiswa-sidebar ${open ? "open" : ""}`}>
        <div className="mahasiswa-sidebar-top">
          {/* BRAND DESKTOP ONLY */}
          <div className="mahasiswa-sidebar-brand desktop-only">
            <img src={logoUNSAP} alt="Logo UNSAP" />
            <div>
              <h1>UNSAPresent</h1>
              <p>Mahasiswa</p>
            </div>
          </div>

          <nav className="mahasiswa-sidebar-menu">
            <NavLink to="/mahasiswa/dashboard" onClick={() => setOpen(false)}>
              <LayoutDashboard />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/mahasiswa/absen" onClick={() => setOpen(false)}>
              <CheckSquare />
              <span>Absen</span>
            </NavLink>

            <NavLink
              to="/mahasiswa/riwayat-absensi"
              onClick={() => setOpen(false)}
            >
              <History />
              <span>Riwayat Absensi</span>
            </NavLink>
          </nav>
        </div>

        <button className="mahasiswa-sidebar-logout" onClick={logout}>
          <LogOut />
          Logout
        </button>
      </aside>
    </>
  );
}
