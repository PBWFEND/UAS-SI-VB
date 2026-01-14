import { useNavigate } from "react-router-dom";
import { Clock, Hash, User } from "lucide-react";
import "../../styles/mahasiswa.css";

export default function ActiveSessionCard({ session }) {
  const navigate = useNavigate();

  // 🔐 FALLBACK AMAN (INI KUNCI)
  const kodeMk =
    session.courseCode ||
    session.kodeMk ||
    session.kode_mk ||
    session.course?.kodeMk ||
    "-";

  return (
    <div className="active-session-card">
      <div className="badge">SESI AKTIF</div>

      <h3>{session.course}</h3>

      <div className="session-info">
        <div className="info-row">
          <Hash size={16} />
          <span className="label">Kode MK</span>
          <span className="separator">:</span>
          <span className="value">{kodeMk}</span>
        </div>

        <div className="info-row">
          <User size={16} />
          <span className="label">Dosen</span>
          <span className="separator">:</span>
          <span className="value">{session.dosen}</span>
        </div>

        <div className="info-row time">
          <Clock size={16} />
          <span className="label">Waktu</span>
          <span className="separator">:</span>
          <span className="value">
            {new Date(session.startTime).toLocaleTimeString()} –{" "}
            {new Date(session.endTime).toLocaleTimeString()}
          </span>
        </div>
      </div>

      <button
        className="btn btn-primary"
        onClick={() => navigate("/mahasiswa/absen")}
      >
        Absen Sekarang
      </button>
    </div>
  );
}
