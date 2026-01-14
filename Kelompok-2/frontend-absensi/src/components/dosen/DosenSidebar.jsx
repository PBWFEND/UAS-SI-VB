import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import logoUNSAP from "../../assets/UNSAP.png";
import "../../styles/dosen.css";

export default function DosenSidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
    {/* MOBILE TOPBAR */}
    <div className="dosen-topbar">
      <button
        className="dosen-sidebar-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle sidebar"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      <div className="topbar-brand">
        <img src={logoUNSAP} alt="Logo UNSAP" />
        <span>UNSAPresent</span>
      </div>
    </div>

      {/* OVERLAY */}
      {open && (
        <div className="sidebar-overlay" onClick={() => setOpen(false)} />
      )}

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-top">
          {/* BRAND */}
          <div className="sidebar-brand with-logo desktop-only">
            <img src={logoUNSAP} alt="Logo UNSAP" />
            <div className="brand-text">
              <h1>UNSAPresent</h1>
              <p>Dosen</p>
            </div>
          </div>

          {/* MENU */}
          <nav className="sidebar-menu">
            <NavLink to="/dosen/dashboard" onClick={() => setOpen(false)}>
              <LayoutDashboard />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/dosen/matakuliah" onClick={() => setOpen(false)}>
              <BookOpen />
              <span>Mata Kuliah</span>
            </NavLink>

            <NavLink to="/dosen/absensi" onClick={() => setOpen(false)}>
              <ClipboardCheck />
              <span>Sesi Absensi</span>
            </NavLink>
          </nav>
        </div>

        {/* LOGOUT */}
        <button className="sidebar-logout" onClick={logout}>
          <LogOut />
          Logout
        </button>
      </aside>
    </>
  );
}
