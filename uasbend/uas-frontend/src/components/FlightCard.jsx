import "../styles/dashboard.css";

export default function FlightCard({ flight, onEdit, onDelete }) {
  return (
    <div className="flight-card compact">
      <div className="flight-info">
        <h4>{flight.flightNumber}</h4>
        <span>{flight.origin} → {flight.destination}</span>
      </div>

      <div className="card-actions">
        <button className="edit-btn" onClick={onEdit}>Edit</button>
        <button className="delete-btn" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}
