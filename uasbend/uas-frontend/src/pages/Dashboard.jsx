import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import FlightForm from "../components/FlightForm";
import "../styles/dashboard.css";
import "../styles/flightForm.css";

/* ================= HELPER ================= */
const toWIB = (dateStr, timeStr) => {
  const d = new Date(`${dateStr}T${timeStr}`);
  return (
    d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta"
    }) + " WIB"
  );
};

const getDepartureDateTime = (d, t) => new Date(`${d}T${t}`);
const getDiffMs = (d, t) => getDepartureDateTime(d, t) - new Date();

const getCountdown = (d, t) => {
  const diff = getDiffMs(d, t);
  if (diff <= 0) return "✈️ Sudah berangkat";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff / 60000) % 60);
  return `🛫 ${h} jam ${m} menit lagi`;
};

export default function Dashboard() {
  const [flights, setFlights] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState(null);

  const user = { name: "Admin", email: "admin@mail.com" };

  /* ================= INIT ================= */
  useEffect(() => {
    setFlights(JSON.parse(localStorage.getItem("flights")) || []);
  }, []);

  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(async pos => {
      const { latitude, longitude } = pos.coords;
      const w = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      ).then(r => r.json());
      setWeather(w.current_weather);
    });
  }, []);

  /* ================= CRUD ================= */
  const save = data => {
    localStorage.setItem("flights", JSON.stringify(data));
    setFlights(data);
  };

  const handleCreate = d => {
    save([...flights, { id: Date.now(), ...d }]);
    setShowForm(false);
  };

  const handleUpdate = d => {
    save(
      flights.map(f =>
        f.id === editingFlight.id ? { ...f, ...d } : f
      )
    );
    setEditingFlight(null);
    setShowForm(false);
  };

  const handleDelete = id => {
    if (!confirm("Hapus jadwal ini?")) return;
    save(flights.filter(f => f.id !== id));
  };

  

  const sorted = [...flights].sort(
    (a, b) =>
      getDepartureDateTime(a.date, a.time) -
      getDepartureDateTime(b.date, b.time)
  );

  return (
    <div className="dashboard-container">
      {/* BACKGROUND */}
      <div className="sky-bg" />
      <div className="cloud cloud-1" />
      <div className="cloud cloud-2" />
      <div className="cloud cloud-3" />

      {/* HEADER */}
      <header className="dashboard-header">
        <h2>✈ Flight Dashboard</h2>

        <div className="profile-area">
          <button
            className="profile-btn"
            onClick={() => setShowProfile(!showProfile)}
          >
            {user.name[0]}
          </button>

          {showProfile && (
            <div className="profile-dropdown">
              <div className="profile-card">
                <div className="avatar">{user.name[0]}</div>
                <div>
                  <strong>{user.name}</strong>
                  <p>{user.email}</p>
                </div>
              </div>

              <button
                className="logout-btn"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/login";
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MAIN */}
      <main className="dashboard-main">
        <section className="flights-section">
          <button
            className="add-btn"
            onClick={() => {
              setEditingFlight(null);
              setShowForm(true);
            }}
          >
            + Tambah Penerbangan
          </button>

          {/* LIST TIDAK DIUBAH */}
          <div className="flight-list">
            {sorted.map(f => {
              const warn = getDiffMs(f.date, f.time) <= 3600000;
              return (
                <div
                  key={f.id}
                  className={`flight-card ${warn ? "warning" : ""}`}
                >
                  <h3>{f.flightNumber}</h3>
                  <p>{f.origin} → {f.destination}</p>
                  <p>{f.date} | {toWIB(f.date, f.time)}</p>
                  <small>{getCountdown(f.date, f.time)}</small>

                  <div className="card-actions">
                    <button
                      onClick={() => {
                        setEditingFlight(f);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete(f.id)}>
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="calendar-section">
          <Calendar value={date} onChange={setDate} />

          <div className="clock-box">
            {time.toLocaleTimeString("id-ID")} WIB
          </div>

          {weather && (
            <div className="weather-box">
              🌦 {weather.temperature}°C
            </div>
          )}
        </aside>
      </main>

      {/* ================= MODAL FORM (INI KUNCI) ================= */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <FlightForm
              initialData={editingFlight || {}}
              onSubmit={editingFlight ? handleUpdate : handleCreate}
              onCancel={() => {
                setEditingFlight(null);
                setShowForm(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}