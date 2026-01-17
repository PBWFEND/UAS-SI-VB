import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import logoUNSAP from "../../assets/UNSAP.png";
import "../../styles/admin.css";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="admin-layout">
      <AdminSidebar open={open} setOpen={setOpen} />

      {/* TOPBAR MOBILE */}
      <header className="admin-topbar">
        <button
          className="topbar-menu"
          onClick={() => setOpen(true)}
        >
          <Menu size={22} />
        </button>

        <div className="topbar-brand">
          <img src={logoUNSAP} alt="UNSAP" />
          <span>UNSAPresent</span>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="admin-content dashboard">
        <Outlet />
      </main>
    </div>
  );
}
