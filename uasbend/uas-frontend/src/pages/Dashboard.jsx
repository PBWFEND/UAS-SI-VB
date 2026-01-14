import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import FlightForm from "../components/FlightForm";
import api from "../services/api";
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

const getDepartureDateTime = (dateStr, timeStr) =>
  new Date(`${dateStr}T${timeStr}`);

const getDiffMs = (dateStr, timeStr) =>
  getDepartureDateTime(dateStr, timeStr) - new Date();

const getCountdown = (dateStr, timeStr) => {
  const diff = getDiffMs(dateStr, timeStr);

  if (diff <= 0) return "✈️ Sudah berangkat";

  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff / (1000 * 60)) % 60);

  return `🛫 ${h} jam ${m} menit lagi`;
};

export default function Dashboard() {
  const [flights, setFlights] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [user, setUser] = useState(null);
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");

  /* ================= PROFILE ================= */
  useEffect(() => {
    api.get("/users/profile")
      .then(res => setUser(res.data))
      .catch(() => alert("Gagal ambil data profil"));
  }, []);

  /* ================= FLIGHTS ================= */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("flights")) || [];
    setFlights(stored);
  }, []);

  /* ================= CLOCK ================= */
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* ================= NOTIFICATION PERMISSION ================= */
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  /* ================= WEATHER ================= */
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async pos => {
      const { latitude, longitude } = pos.coords;

      const w = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      ).then(r => r.json());

      setWeather(w.current_weather);

      const g = await fetch(
        `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}`
      ).then(r => r.json());

      setCity(g?.results?.[0]?.city || "");
    });
  }, []);

  /* ================= H-30 NOTIFICATION ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      flights.forEach(f => {
        const diff = getDiffMs(f.date, f.time);

        if (
          diff > 0 &&
          diff <= 30 * 60 * 1000 &&
          !f.notified &&
          Notification.permission === "granted"
        ) {
          new Notification("✈️ Penerbangan Sebentar Lagi!", {
            body: `${f.flightNumber} ${f.origin} → ${f.destination} (30 menit lagi)`
          });

          f.notified = true;
          localStorage.setItem("flights", JSON.stringify(flights));
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [flights]);

  /* ================= CRUD ================= */
  const handleCreate = (data) => {
    const depart = getDepartureDateTime(data.date, data.time);
    if (depart < new Date()) {
      alert("❌ Waktu penerbangan tidak boleh lewat");
      return;
    }

    const updated = [...flights, { id: Date.now(), notified: false, ...data }];
    setFlights(updated);
    localStorage.setItem("flights", JSON.stringify(updated));
    setShowForm(false);
  };

  const handleUpdate = (data) => {
    const depart = getDepartureDateTime(data.date, data.time);
    if (depart < new Date()) {
      alert("❌ Waktu penerbangan tidak boleh lewat");
      return;
    }

    const updated = flights.map(f =>
      f.id === editingFlight.id ? { ...f, ...data } : f
    );

    setFlights(updated);
    localStorage.setItem("flights", JSON.stringify(updated));
    setEditingFlight(null);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (!confirm("Hapus penerbangan ini?")) return;
    const updated = flights.filter(f => f.id !== id);
    setFlights(updated);
    localStorage.setItem("flights", JSON.stringify(updated));
  };

  if (!user) return <p>Loading...</p>;

  /* ================= SORT FLIGHT TERDEKAT ================= */
  const sortedFlights = [...flights].sort(
    (a, b) =>
      getDepartureDateTime(a.date, a.time) -
      getDepartureDateTime(b.date, b.time)
  );

  return (
    <div className="dashboard-container">

      <div className="sky-bg" />
      <div className="cloud cloud-1" />
      <div className="cloud cloud-2" />
      <div className="cloud cloud-3" />

      <header className="dashboard-header">
        <h2>✈ Jadwal Penerbangan Saya</h2>

        <div className="profile-area">
          <button
            className="profile-btn"
            onClick={() => setShowProfile(!showProfile)}
          >
            {user.name[0].toUpperCase()}
          </button>

          {showProfile && (
            <div className="profile-dropdown">
              <strong>{user.name}</strong>
              <p>{user.email}</p>
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

      <main className="dashboard-main">
        <section className="flights-section">
          <button className="add-btn" onClick={() => setShowForm(true)}>
            + Tambah Penerbangan
          </button>

          <div className="flight-list">
            {sortedFlights.map(f => {
              const diff = getDiffMs(f.date, f.time);
              const isWarning = diff > 0 && diff <= 60 * 60 * 1000;

              return (
                <div
                  key={f.id}
                  className="flight-card"
                  style={{
                    border: isWarning ? "2px solid #e74c3c" : "",
                    boxShadow: isWarning
                      ? "0 0 20px rgba(231,76,60,.6)"
                      : ""
                  }}
                >
                  <h3>{f.flightNumber}</h3>
                  <p>{f.origin} → {f.destination}</p>
                  <p>{f.date} | {toWIB(f.date, f.time)}</p>

                  <small
                    style={{
                      color: isWarning ? "#e74c3c" : "#1f2937",
                      fontWeight: 700
                    }}
                  >
                    {getCountdown(f.date, f.time)}
                  </small>

                  <div className="card-actions">
                    <button onClick={() => {
                      setEditingFlight(f);
                      setShowForm(true);
                    }}>Edit</button>
                    <button onClick={() => handleDelete(f.id)}>Hapus</button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="calendar-section">
          <Calendar value={date} onChange={setDate} />

          <div className="clock-box">
            <h4>🕒 Jam</h4>
            <p>{time.toLocaleTimeString("id-ID")} WIB</p>
          </div>

          {weather && (
            <div className="weather-box">
              <h4>🌦️ Cuaca</h4>
              <p>{city}</p>
              <p>{weather.temperature}°C</p>
            </div>
          )}
        </aside>
      </main>

      {showForm && (
        <div className="flight-form-container">
          <FlightForm
            initialData={editingFlight || {}}
            onSubmit={editingFlight ? handleUpdate : handleCreate}
            onCancel={() => {
              setEditingFlight(null);
              setShowForm(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
