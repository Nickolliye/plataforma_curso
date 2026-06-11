import { Route, Routes, Navigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { SgCursosLayout } from "../pages/SgCursosLayout";
import { DashboardPage } from "../pages/DashboardPage";
import { UsuarioPages } from "../pages/UsuarioPages";
import { CursosPage } from "../pages/CursosPage";
import { TrilhasPage } from "../pages/TrilhasPage";
import { MatriculasPage } from "../pages/MatriculasPage";
import { PlanosPage } from "../pages/PlanosPage";
import { PagamentosPage } from "../pages/PagamentosPage";
import { CertificadosPage } from "../pages/CertificadosPage";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route element={<SgCursosLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="usuarios" element={<UsuarioPages />} />
          <Route path="cursos" element={<CursosPage />} />
          <Route path="trilhas" element={<TrilhasPage />} />
          <Route path="matriculas" element={<MatriculasPage />} />
          <Route path="planos" element={<PlanosPage />} />
          <Route path="pagamentos" element={<PagamentosPage />} />
          <Route path="certificados" element={<CertificadosPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
