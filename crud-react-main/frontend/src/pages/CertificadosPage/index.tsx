import { useState, useEffect } from "react";
import apiService from "../../services/api.service";

interface IUser {
  id: string;
  nome: string;
}

interface ICourse {
  id: string;
  titulo: string;
}

interface ICertificado {
  id: string;
  idUsuario: string;
  idCurso: string;
  codigoVerificacao: string;
  dataEmissao: string;
}

export const CertificadosPage = () => {
  const [certificados, setCertificados] = useState<ICertificado[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  
  const [selectedCert, setSelectedCert] = useState<ICertificado | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [cData, uData, crData] = await Promise.all([
        apiService.getAll<ICertificado>("certificados"),
        apiService.getAll<IUser>("usuarios"),
        apiService.getAll<ICourse>("cursos"),
      ]);
      setCertificados(cData);
      setUsers(uData);
      setCourses(crData);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar os certificados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStudentName = (id: string) => {
    return users.find((u) => u.id === id)?.nome || "Aluno Excluído";
  };

  const getCourseName = (id: string) => {
    return courses.find((c) => c.id === id)?.titulo || "Curso Excluído";
  };

  return (
    <div>
      {error && (
        <div className="alert alert-danger shadow-sm border-0 mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {selectedCert ? (
        <div className="card shadow-lg border-0 mb-4 overflow-hidden" style={{ background: "#fcfbf7", border: "10px solid #1a365d" }}>
          <div className="card-body p-5 text-center" style={{ border: "2px solid #b7791f", margin: "10px", minHeight: "400px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <i className="bi bi-award-fill text-warning fs-1"></i>
              <h1 className="fw-serif text-primary mt-3" style={{ fontSize: "2.5rem", fontFamily: "Georgia, serif" }}>CERTIFICADO</h1>
              <p className="text-muted text-uppercase mt-4">Certificamos que o aluno</p>
              
              <h2 className="fw-bold my-3 text-dark text-decoration-underline" style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>
                {getStudentName(selectedCert.idUsuario)}
              </h2>
              
              <p className="text-muted px-lg-5">
                concluiu com êxito todas as etapas de avaliação teórica e prática do curso oficial de
                <strong className="text-dark d-block fs-4 mt-2">{getCourseName(selectedCert.idCurso)}</strong>
              </p>
            </div>

            <div className="mt-5">
              <div className="row justify-content-center align-items-center">
                <div className="col-6 text-center">
                  <span className="text-muted small d-block">Código de Verificação:</span>
                  <strong className="fw-mono text-primary fs-5">{selectedCert.codigoVerificacao}</strong>
                </div>
                <div className="col-6 text-center">
                  <span className="text-muted small d-block">Data de Emissão:</span>
                  <strong className="text-dark fs-5">{selectedCert.dataEmissao}</strong>
                </div>
              </div>

              <button
                className="btn btn-outline-dark mt-4"
                onClick={() => setSelectedCert(null)}
              >
                <i className="bi bi-arrow-left me-2"></i> Voltar à Lista
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0 fw-bold text-dark">Certificados Emitidos</h5>
          </div>
          <div className="card-body p-0">
            {loading && certificados.length === 0 ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary"></div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="px-4">Aluno</th>
                      <th>Curso</th>
                      <th>Data Emissão</th>
                      <th>Código</th>
                      <th className="text-end px-4">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificados.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-muted">
                          Nenhum certificado emitido no momento. Conclua todas as aulas de um curso na aba de Matrículas.
                        </td>
                      </tr>
                    ) : (
                      certificados.map((cert) => (
                        <tr key={cert.id}>
                          <td className="px-4 fw-semibold text-primary">{getStudentName(cert.idUsuario)}</td>
                          <td>{getCourseName(cert.idCurso)}</td>
                          <td>{cert.dataEmissao}</td>
                          <td className="fw-mono small">{cert.codigoVerificacao}</td>
                          <td className="text-end px-4">
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => setSelectedCert(cert)}
                            >
                              Visualizar Certificado
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default CertificadosPage;
