import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { usuariosService } from "../../services/usuario.service";

export const HomePages = () => {
  const [trilhasCount, setTrilhasCount] = useState(0);
  const [cursosCount, setCursosCount] = useState(0);
  const [alunosCount, setAlunosCount] = useState(0);

  useEffect(() => {
    // Carregar contadores
    const trilhas = localStorage.getItem("sg_trilhas");
    if (trilhas) {
      setTrilhasCount(JSON.parse(trilhas).length);
    } else {
      setTrilhasCount(2);
    }

    const cursos = localStorage.getItem("sg_cursos");
    if (cursos) {
      setCursosCount(JSON.parse(cursos).length);
    } else {
      setCursosCount(2);
    }

    const loadAlunos = async () => {
      try {
        const u = await usuariosService.findAll();
        setAlunosCount(u.length);
      } catch {
        setAlunosCount(2);
      }
    };
    loadAlunos();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Welcome Banner */}
      <div className="p-5 mb-4 bg-white rounded-3 shadow-sm border border-light">
        <div className="container-fluid py-2">
          <h1 className="display-5 fw-bold text-primary">Painel de Aprendizado</h1>
          <p className="col-md-8 fs-5 text-muted">
            Bem-vindo ao <strong>DevTech.EDU</strong>, seu ambiente completo de capacitação tecnológica. 
            Crie trilhas, gerencie cursos, módulos, matricule alunos e emita certificados oficiais de conclusão.
          </p>
          <Link to="/sgcursos/trilhas" className="btn btn-primary btn-lg fw-bold px-4 mt-2">
            Começar a Navegar <i className="bi bi-arrow-right-short ms-1"></i>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-12 col-sm-6 col-xl-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body d-flex align-items-center p-4">
              <div className="bg-primary bg-opacity-10 rounded-3 p-3 me-3 text-primary">
                <i className="bi bi-diagram-3-fill fs-2"></i>
              </div>
              <div>
                <h6 className="text-muted fw-semibold mb-1">Trilhas de Estudo</h6>
                <h3 className="fw-bold mb-0">{trilhasCount}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body d-flex align-items-center p-4">
              <div className="bg-success bg-opacity-10 rounded-3 p-3 me-3 text-success">
                <i className="bi bi-journal-text fs-2"></i>
              </div>
              <div>
                <h6 className="text-muted fw-semibold mb-1">Cursos Ativos</h6>
                <h3 className="fw-bold mb-0">{cursosCount}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body d-flex align-items-center p-4">
              <div className="bg-warning bg-opacity-10 rounded-3 p-3 me-3 text-warning">
                <i className="bi bi-people-fill fs-2"></i>
              </div>
              <div>
                <h6 className="text-muted fw-semibold mb-1">Alunos Cadastrados</h6>
                <h3 className="fw-bold mb-0">{alunosCount}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="row">
        <div className="col-12 col-lg-4 mb-4">
          <div className="card shadow-sm bg-gradient bg-primary text-white h-100 border-0">
            <div className="card-body p-4 d-flex flex-column justify-content-between">
              <div>
                <h5 className="fw-bold mb-3">Atalho de Acesso Rápido</h5>
                <p className="text-white-50 small">Gerencie alunos no cadastro geral para simular assinaturas e emitir certificados.</p>
              </div>
              <div className="d-grid gap-2">
                <Link to="/sgcursos/usuarios" className="btn btn-light fw-bold text-primary">
                  <i className="bi bi-person-plus-fill me-2"></i> Adicionar Aluno
                </Link>
                <Link to="/sgcursos/certificados" className="btn btn-outline-light fw-bold">
                  <i className="bi bi-patch-check me-2"></i> Emitir Certificado
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};