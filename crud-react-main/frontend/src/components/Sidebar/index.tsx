import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <aside className={`app-sidebar ${isOpen ? "" : "collapsed"}`}>
      <div className="sidebar-header">
        <NavLink to="/" className="sidebar-brand" onClick={onClose}>
          <i className="bi bi-mortarboard-fill text-primary"></i>
          <span>DevTech.EDU</span>
        </NavLink>
        <button
          className="sidebar-close-btn d-lg-none"
          onClick={onClose}
          aria-label="Fechar menu"
        >
          <i className="bi bi-x-lg"></i>
        </button>
      </div>

      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            onClick={onClose}
          >
            <i className="bi bi-house-door-fill"></i>
            <span>Home</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink
            to="/sgcursos"
            className={({ isActive }) =>
              `sidebar-link ${isActive || window.location.pathname.startsWith("/sgcursos") ? "active" : ""}`
            }
            onClick={onClose}
          >
            <i className="bi bi-journal-bookmark-fill"></i>
            <span>SG Cursos</span>
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};
