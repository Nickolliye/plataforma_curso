import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../Sidebar";

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  // Fechar sidebar automaticamente em dispositivos móveis quando mudar de rota
  useEffect(() => {
    if (window.innerWidth < 992) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  // Lidar com o redimensionamento da janela
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    // Definir estado inicial correto
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="d-flex">
      <Sidebar isOpen={isSidebarOpen} onClose={() => {
        if (window.innerWidth < 992) {
          setIsSidebarOpen(false);
        }
      }} />

      <div className={`app-container flex-grow-1 ${isSidebarOpen ? "" : "full-width"}`}>
        <header className="app-header d-flex justify-content-between align-items-center">
          <button
            className="sidebar-toggle-btn"
            onClick={toggleSidebar}
            aria-label="Alternar menu"
          >
            <i className="bi bi-list"></i>
          </button>
          
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted d-none d-sm-inline">Versão Estudante</span>
            <div className="bg-light rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
              <i className="bi bi-person-circle text-primary fs-5"></i>
            </div>
          </div>
        </header>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
