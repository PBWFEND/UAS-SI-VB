import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function FlightDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);

  useEffect(() => {
    api.get(`/flights/${id}`)
      .then(res => setFlight(res.data.data))
      .catch(() => alert("Flight not found"));
  }, [id]);

  if (!flight) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Flight Detail</h2>
      <p>Flight Number: {flight.flightNumber}</p>
      <p>From: {flight.origin}</p>
      <p>To: {flight.destination}</p>
      <p>Departure: {flight.departureTime}</p>
      <p>Arrival: {flight.arrivalTime}</p>
      <p>Airline: {flight.airline}</p>

      <button onClick={() => navigate("/dashboard")}>
        Back
      </button>
    </div>
  );
}
