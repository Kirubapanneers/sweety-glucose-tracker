import { Droplet, Menu } from "lucide-react";

// Compact top bar shown on tablet and mobile, where the sidebar is a drawer.
export default function Navbar({ onMenuClick, menuOpen }) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark">
          <Droplet size={18} fill="currentColor" aria-hidden="true" />
        </div>
        <div className="brand-name">Sweety</div>
      </div>

      <button
        type="button"
        className="icon-btn"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        aria-expanded={menuOpen}
        aria-controls="app-sidebar"
      >
        <Menu size={20} />
      </button>
    </header>
  );
}
