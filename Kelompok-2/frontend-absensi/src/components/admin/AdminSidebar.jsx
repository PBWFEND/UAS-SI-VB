import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  UserCog,
  BookOpen,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import logoUNSAP from "../../assets/UNSAP.png";
import "../../styles/admin.css";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* MOBILE TOPBAR */}
      <div className="admin-topbar">
        <button
          className="sidebar-toggle"
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
        <div
          className="sidebar-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-top">
          {/* BRAND DESKTOP ONLY */}
          <div className="sidebar-brand with-logo desktop-only">
            <img src={logoUNSAP} alt="Logo UNSAP" />
            <div className="brand-text">
              <h1>UNSAPresent</h1>
              <p>Administrator</p>
            </div>
          </div>

          <nav className="sidebar-menu">
            <NavLink to="/admin/dashboard" onClick={() => setOpen(false)}>
              <LayoutDashboard />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/admin/mahasiswa" onClick={() => setOpen(false)}>
              <GraduationCap />
              <span>Mahasiswa</span>
            </NavLink>
            <NavLink to="/admin/dosen" onClick={() => setOpen(false)}>
              <Users />
              <span>Dosen</span>
            </NavLink>
            <NavLink to="/admin/admin" onClick={() => setOpen(false)}>
              <UserCog />
              <span>Admin</span>
            </NavLink>
            <NavLink to="/admin/mata-kuliah" onClick={() => setOpen(false)}>
              <BookOpen />
              <span>Mata Kuliah</span>
            </NavLink>
          </nav>
        </div>

        <button className="sidebar-logout" onClick={handleLogout}>
          <LogOut />
          Logout
        </button>
      </aside>
    </>
  );
}
