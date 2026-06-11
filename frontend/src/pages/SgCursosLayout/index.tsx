import { Outlet, useLocation } from "react-router-dom";

export const SgCursosLayout = () => {
  const location = useLocation();

  const getHeaderTitle = (pathname: string) => {
    const path = pathname === "/" ? "/dashboard" : pathname;
    
    switch (path) {
      case "/dashboard":
        return "Dashboard";
      case "/usuarios":
        return "Usuários";
      case "/cursos":
        return "Cursos";
      case "/trilhas":
        return "Trilhas";
      case "/matriculas":
        return "Matrículas";
      case "/planos":
        return "Planos";
      case "/pagamentos":
        return "Pagamentos";
      case "/certificados":
        return "Certificados";
      default:
        return "DevTech";
    }
  };

  const title = getHeaderTitle(location.pathname);

  return (
    <div>
      <div className="sg-cursos-header" style={{ borderBottom: "2px solid #198754", paddingBottom: "10px", marginBottom: "1.5rem" }}>
        <h2 className="fw-bold mb-0 text-dark">{title}</h2>
      </div>

      <div className="mt-4 animate-fade-in">
        <Outlet />
      </div>
    </div>
  );
};
export default SgCursosLayout;
