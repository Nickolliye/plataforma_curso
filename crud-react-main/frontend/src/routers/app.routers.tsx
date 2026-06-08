import { Route, Routes, Navigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { HomePages } from "../pages/HomePages";
import { SgCursosLayout } from "../pages/SgCursosLayout";

import { TrilhasPage } from "../pages/TrilhasPage";
import { CursosPage } from "../pages/CursosPage";
import { ModulosPage } from "../pages/ModulosPage";
import { AulasPage } from "../pages/AulasPage";
import { UsuarioPages } from "../pages/UsuarioPages";
import { AssinaturasPage } from "../pages/AssinaturasPage";
import { CertificadosPage } from "../pages/CertificadosPage";

export const AppRouter = () => {
  return (
    <Routes>
      {/* Rota principal com Layout que inclui Sidebar e Header */}
      <Route path="/" element={<Layout />}>
        {/* Home Page */}
        <Route index element={<HomePages />} />

        {/* SG Cursos Layout e suas sub-abas */}
        <Route path="sgcursos" element={<SgCursosLayout />}>
          {/* Redirecionamento padrão para /sgcursos/trilhas */}
          <Route index element={<Navigate to="/sgcursos/trilhas" replace />} />
          
          <Route path="trilhas" element={<TrilhasPage />} />
          <Route path="cursos" element={<CursosPage />} />
          <Route path="modulos" element={<ModulosPage />} />
          <Route path="aulas" element={<AulasPage />} />
          <Route path="usuarios" element={<UsuarioPages />} />
          <Route path="assinaturas" element={<AssinaturasPage />} />
          <Route path="certificados" element={<CertificadosPage />} />
        </Route>
      </Route>

      {/* Rota Fallback para qualquer link inválido */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
