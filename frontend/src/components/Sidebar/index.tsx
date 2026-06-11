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
          <span>DevTech</span>
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
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            <i className="bi bi-speedometer2"></i>
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink
            to="/usuarios"
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            <i className="bi bi-people-fill"></i>
            <span>Usuários</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink
            to="/cursos"
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            <i className="bi bi-book-half"></i>
            <span>Cursos</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink
            to="/trilhas"
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            <i className="bi bi-diagram-3-fill"></i>
            <span>Trilhas</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink
            to="/matriculas"
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            <i className="bi bi-journal-check"></i>
            <span>Matrículas</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink
            to="/planos"
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            <i className="bi bi-tags-fill"></i>
            <span>Planos</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink
            to="/pagamentos"
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            <i className="bi bi-credit-card-2-front-fill"></i>
            <span>Pagamentos</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <NavLink
            to="/certificados"
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            onClick={onClose}
          >
            <i className="bi bi-award-fill"></i>
            <span>Certificados</span>
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};
