import "../styles/profile.css";

export default function ProfileCard() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return null;

  return (
    <div className="profile-card">
      <div className="avatar">
        {user.name.charAt(0).toUpperCase()}
      </div>

      <div className="profile-info">
        <h4>{user.name}</h4>
        <p>{user.email}</p>
      </div>
    </div>
  );
}
