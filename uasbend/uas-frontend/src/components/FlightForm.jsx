import { useState } from "react";
import "../styles/flightForm.css";

export default function FlightForm({ onSubmit, initialData, onCancel }) {
  const [flightNumber, setFlightNumber] = useState(initialData.flightNumber || "");
  const [origin, setOrigin] = useState(initialData.origin || "");
  const [destination, setDestination] = useState(initialData.destination || "");
  const [date, setDate] = useState(initialData.date || "");
  const [time, setTime] = useState(initialData.time || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ flightNumber, origin, destination, date, time });
  };

  return (
    <form className="flight-form animate-popup" onSubmit={handleSubmit}>
      <h3>{initialData?.id ? "Edit Penerbangan" : "Tambah Penerbangan"}</h3>
      <label>Nomor Penerbangan
        <input value={flightNumber} onChange={e => setFlightNumber(e.target.value)} />
      </label>
      <label>Bandara Asal
        <input value={origin} onChange={e => setOrigin(e.target.value)} />
      </label>
      <label>Bandara Tujuan
        <input value={destination} onChange={e => setDestination(e.target.value)} />
      </label>
      <label>Tanggal
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </label>
      <label>Waktu
        <input type="time" value={time} onChange={e => setTime(e.target.value)} />
      </label>
      <div className="form-actions">
        <button type="submit" className="save-btn">Simpan</button>
        <button type="button" className="cancel-btn" onClick={onCancel}>Batal</button>
      </div>
    </form>
  );
}
