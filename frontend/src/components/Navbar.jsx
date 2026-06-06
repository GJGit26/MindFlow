import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/journal", label: "Journal" },
  { path: "/insights", label: "Insights" },
];

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-logo">
        <span className="logo-dot" />
        MindFlow
      </Link>
      <div className="navbar-links">
        {NAV_LINKS.map((l) => (
          <Link key={l.path} to={l.path} className={`navbar-link ${location.pathname === l.path ? "active" : ""}`}>
            {l.label}
          </Link>
        ))}
      </div>
      <div className="navbar-user">
        <Link to="/profile" className="navbar-avatar" title={user?.name}>
          {user?.name?.[0]?.toUpperCase() || "U"}
        </Link>
      </div>
    </nav>
  );
}
