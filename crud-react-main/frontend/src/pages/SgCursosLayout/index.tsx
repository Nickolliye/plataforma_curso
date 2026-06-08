import { NavLink, Outlet } from "react-router-dom";

export const SgCursosLayout = () => {
  return (
    <div>
      <div className="sg-cursos-header">
        <h2 className="fw-bold mb-0">SG Cursos</h2>
      </div>

      <ul className="sg-tabs">
        <li className="sg-tab-item">
          <NavLink
            to="/sgcursos/trilhas"
            className={({ isActive }) => `sg-tab-link ${isActive ? "active" : ""}`}
          >
            Trilhas
          </NavLink>
        </li>
        <li className="sg-tab-item">
          <NavLink
            to="/sgcursos/cursos"
            className={({ isActive }) => `sg-tab-link ${isActive ? "active" : ""}`}
          >
            Cursos
          </NavLink>
        </li>
        <li className="sg-tab-item">
          <NavLink
            to="/sgcursos/modulos"
            className={({ isActive }) => `sg-tab-link ${isActive ? "active" : ""}`}
          >
            Módulos
          </NavLink>
        </li>
        <li className="sg-tab-item">
          <NavLink
            to="/sgcursos/aulas"
            className={({ isActive }) => `sg-tab-link ${isActive ? "active" : ""}`}
          >
            Aulas
          </NavLink>
        </li>
        <li className="sg-tab-item">
          <NavLink
            to="/sgcursos/usuarios"
            className={({ isActive }) => `sg-tab-link ${isActive ? "active" : ""}`}
          >
            Usuários
          </NavLink>
        </li>
        <li className="sg-tab-item">
          <NavLink
            to="/sgcursos/assinaturas"
            className={({ isActive }) => `sg-tab-link ${isActive ? "active" : ""}`}
          >
            Assinaturas
          </NavLink>
        </li>
        <li className="sg-tab-item">
          <NavLink
            to="/sgcursos/certificados"
            className={({ isActive }) => `sg-tab-link ${isActive ? "active" : ""}`}
          >
            Certificados
          </NavLink>
        </li>
      </ul>

      <div className="mt-4 animate-fade-in">
        <Outlet />
      </div>
    </div>
  );
};
