export default function Navbar({ title }) {
  const name = localStorage.getItem("name");
  return (
    <div className="navbar">
      <h3>{UNSAPresent}</h3>
      <span>{name}</span>
    </div>
  );
}
