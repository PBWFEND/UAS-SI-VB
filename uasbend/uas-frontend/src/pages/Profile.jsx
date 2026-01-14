import { useEffect, useState } from "react";
import api from "../services/api";

export default function Profile({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/users/profile")
      .then(res => setUser(res.data))
      .catch(() => {
        alert("Session habis, login ulang");
        localStorage.clear();
        window.location.href = "/login";
      });
  }, []);

  if (!user) return <p>Loading profile...</p>;

  // kirim user ke children
  return children(user);
}
