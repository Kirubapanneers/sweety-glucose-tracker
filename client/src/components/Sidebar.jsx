import { NavLink, useNavigate } from "react-router-dom";
import { Droplet, FileBarChart, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getInitials } from "../utils/glucose";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/reports", label: "Reports", icon: FileBarChart },
];

export default function Sidebar({ open, onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      id="app-sidebar"
      className={`sidebar ${open ? "open" : ""}`}
      aria-label="Main navigation"
    >
      <div className="brand">
        <div className="brand-mark">
          <Droplet size={22} fill="currentColor" aria-hidden="true" />
        </div>
        <div>
          <div className="brand-name">Sweety</div>
          <div className="brand-tag">Blood Glucose Tracker</div>
        </div>
      </div>

      <div className="nav-label">Menu</div>
      <nav className="nav">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={onNavigate}
          >
            <Icon size={19} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="avatar" aria-hidden="true">
            {getInitials(user?.name)}
          </div>
          <div className="user-meta">
            <div className="user-name">{user?.name || "User"}</div>
            <div className="user-role">Patient account</div>
          </div>
        </div>

        <button
          type="button"
          className="nav-button logout"
          onClick={handleLogout}
        >
          <LogOut size={19} aria-hidden="true" />
          Logout
        </button>
      </div>
    </aside>
  );
}
