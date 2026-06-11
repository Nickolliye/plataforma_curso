import { useState, useEffect } from "react";
import apiService from "../../services/api.service";

export const DashboardPage = () => {
  const [counts, setCounts] = useState({
    usuarios: 0,
    cursos: 0,
    matriculas: 0,
    trilhas: 0,
    assinaturas: 0,
    certificados: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [usuarios, cursos, matriculas, trilhas, assinaturas, certificados] = await Promise.all([
          apiService.getAll("usuarios"),
          apiService.getAll("cursos"),
          apiService.getAll("matriculas"),
          apiService.getAll("trilhas"),
          apiService.getAll("assinaturas"),
          apiService.getAll("certificados"),
        ]);

        setCounts({
          usuarios: usuarios.length,
          cursos: cursos.length,
          matriculas: matriculas.length,
          trilhas: trilhas.length,
          assinaturas: assinaturas.length,
          certificados: certificados.length,
        });
      } catch (err: any) {
        console.error("Erro ao carregar estatísticas:", err);
        setError("Erro ao se conectar ao backend (JSON Server). Certifique-se de executar 'npm run server'.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="alert alert-danger shadow-sm border-0 mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      <div className="row g-4">
        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card shadow-sm border-0 h-100 bg-white">
            <div className="card-body d-flex align-items-center p-4">
              <div className="bg-primary bg-opacity-10 rounded-3 p-3 me-3 text-primary">
                <i className="bi bi-people-fill fs-2"></i>
              </div>
              <div>
                <h6 className="text-muted fw-semibold mb-1">Total de Usuários</h6>
                <h3 className="fw-bold mb-0">{counts.usuarios}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card shadow-sm border-0 h-100 bg-white">
            <div className="card-body d-flex align-items-center p-4">
              <div className="bg-success bg-opacity-10 rounded-3 p-3 me-3 text-success">
                <i className="bi bi-book-half fs-2"></i>
              </div>
              <div>
                <h6 className="text-muted fw-semibold mb-1">Cursos Cadastrados</h6>
                <h3 className="fw-bold mb-0">{counts.cursos}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card shadow-sm border-0 h-100 bg-white">
            <div className="card-body d-flex align-items-center p-4">
              <div className="bg-info bg-opacity-10 rounded-3 p-3 me-3 text-info">
                <i className="bi bi-journal-check fs-2"></i>
              </div>
              <div>
                <h6 className="text-muted fw-semibold mb-1">Matrículas Realizadas</h6>
                <h3 className="fw-bold mb-0">{counts.matriculas}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card shadow-sm border-0 h-100 bg-white">
            <div className="card-body d-flex align-items-center p-4">
              <div className="bg-warning bg-opacity-10 rounded-3 p-3 me-3 text-warning">
                <i className="bi bi-diagram-3-fill fs-2"></i>
              </div>
              <div>
                <h6 className="text-muted fw-semibold mb-1">Trilhas de Estudo</h6>
                <h3 className="fw-bold mb-0">{counts.trilhas}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card shadow-sm border-0 h-100 bg-white">
            <div className="card-body d-flex align-items-center p-4">
              <div className="bg-danger bg-opacity-10 rounded-3 p-3 me-3 text-danger">
                <i className="bi bi-credit-card-2-front-fill fs-2"></i>
              </div>
              <div>
                <h6 className="text-muted fw-semibold mb-1">Assinaturas Ativas</h6>
                <h3 className="fw-bold mb-0">{counts.assinaturas}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-4">
          <div className="card shadow-sm border-0 h-100 bg-white">
            <div className="card-body d-flex align-items-center p-4">
              <div className="bg-secondary bg-opacity-10 rounded-3 p-3 me-3 text-secondary">
                <i className="bi bi-award-fill fs-2"></i>
              </div>
              <div>
                <h6 className="text-muted fw-semibold mb-1">Certificados Emitidos</h6>
                <h3 className="fw-bold mb-0">{counts.certificados}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
