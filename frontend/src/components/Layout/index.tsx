import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../Sidebar";

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (window.innerWidth < 992) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
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
        </header>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
