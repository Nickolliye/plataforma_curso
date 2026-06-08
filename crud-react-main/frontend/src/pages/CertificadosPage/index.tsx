import { useState, useEffect } from "react";
import { usuariosService } from "../../services/usuario.service";
import type { IUsuario } from "../../models/usuario.model";
import { type ICurso } from "../CursosPage";

interface ICertificado {
  usuarioNome: string;
  cursoNome: string;
  cargaHoraria: number;
  dataEmissao: string;
  codigoVerificador: string;
}

export const CertificadosPage = () => {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [cursos, setCursos] = useState<ICurso[]>([]);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState("");
  const [selectedCursoId, setSelectedCursoId] = useState("");
  
  const [certificadoGerado, setCertificadoGerado] = useState<ICertificado | null>(null);

  // Carregar dados de usuários e cursos
  useEffect(() => {
    const fetchData = async () => {
      // Carregar usuários
      try {
        const uData = await usuariosService.findAll();
        setUsuarios(uData);
        if (uData.length > 0) {
          setSelectedUsuarioId(uData[0].id || "");
        }
      } catch (error) {
        console.error("Erro ao buscar usuários para certificados:", error);
        const mockUsers = [
          { id: "137c", nome: "MONICA J. SILVA", email: "monica@gmail.com", senha: "", status: "ativo" as const },
          { id: "0f1d", nome: "MIGUEL C.", email: "miguel@gmail.com", senha: "", status: "ativo" as const }
        ];
        setUsuarios(mockUsers);
        setSelectedUsuarioId(mockUsers[0].id);
      }

      // Carregar cursos
      const cSaved = localStorage.getItem("sg_cursos");
      if (cSaved) {
        const cData = JSON.parse(cSaved);
        setCursos(cData);
        if (cData.length > 0) {
          setSelectedCursoId(cData[0].id);
        }
      }
    };

    fetchData();
  }, []);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUsuarioId || !selectedCursoId) return;

    const user = usuarios.find((u) => u.id === selectedUsuarioId);
    const course = cursos.find((c) => c.id === selectedCursoId);

    if (!user || !course) return;

    const cert: ICertificado = {
      usuarioNome: user.nome,
      cursoNome: course.nome,
      cargaHoraria: course.cargaHoraria,
      dataEmissao: new Date().toLocaleDateString("pt-BR"),
      codigoVerificador: "CERT-" + Math.random().toString(36).substr(2, 9).toUpperCase()
    };

    setCertificadoGerado(cert);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {certificadoGerado ? (
        <div className="animate-fade-in">
          {/* Visual do Certificado Oficial Premium */}
          <div className="card shadow-lg border-0 mb-4 overflow-hidden" style={{ background: "#fcfbf7", border: "10px solid #1a365d" }}>
            <div className="card-body p-5 text-center" style={{ border: "2px solid #b7791f", margin: "10px", minHeight: "500px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <i className="bi bi-award-fill text-warning fs-1"></i>
                <h1 className="fw-serif text-primary mt-3" style={{ fontSize: "2.75rem", fontFamily: "Georgia, serif" }}>Certificado de Conclusão</h1>
                <p className="text-muted text-uppercase letter-spacing-1">Este certificado é outorgado a</p>
                
                <h2 className="fw-bold my-4 text-dark text-decoration-underline" style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}>
                  {certificadoGerado.usuarioNome}
                </h2>
                
                <p className="text-muted px-lg-5">
                  Por ter concluído com êxito todas as etapas de avaliação teórica e prática do curso
                  oficial de <strong className="text-dark">{certificadoGerado.cursoNome}</strong>, ministrado pela 
                  instituição de ensino continuado <strong>DevTech.EDU</strong>, totalizando uma carga horária
                  integralizada de <strong>{certificadoGerado.cargaHoraria} horas</strong> acadêmicas.
                </p>
              </div>

              <div>
                <div className="row mt-5 justify-content-center align-items-center">
                  <div className="col-4">
                    <hr className="border-dark w-75 mx-auto" />
                    <span className="text-muted small d-block">Diretoria Acadêmica</span>
                  </div>
                  <div className="col-4 text-center">
                    <div className="d-inline-block bg-white border border-warning rounded-circle p-2 shadow-sm" style={{ width: "80px", height: "80px" }}>
                      <i className="bi bi-patch-check-fill text-success fs-1"></i>
                    </div>
                  </div>
                  <div className="col-4">
                    <hr className="border-dark w-75 mx-auto" />
                    <span className="text-muted small d-block">Coordenador do Curso</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 bg-light rounded p-2 d-flex justify-content-between align-items-center text-start">
                  <div>
                    <small className="text-muted d-block">Data de Emissão: {certificadoGerado.dataEmissao}</small>
                    <small className="text-muted d-block fw-mono">Código de Autenticação: {certificadoGerado.codigoVerificador}</small>
                  </div>
                  <span className="badge bg-success px-3 py-2">ASSINATURA DIGITAL VÁLIDA</span>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex gap-3 justify-content-center mb-4">
            <button className="btn btn-secondary" onClick={() => setCertificadoGerado(null)}>
              <i className="bi bi-arrow-left me-2"></i> Emitir Outro
            </button>
            <button className="btn btn-primary px-4" onClick={handlePrint}>
              <i className="bi bi-printer-fill me-2"></i> Imprimir Certificado
            </button>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-12 col-md-6 mx-auto">
            <div className="card shadow mb-4">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold text-primary">Emissor de Certificados</h5>
              </div>
              <div className="card-body">
                <p className="text-muted">Selecione o aluno e o curso concluído para emitir digitalmente o certificado correspondente.</p>
                <form onSubmit={handleGenerate}>
                  <div className="mb-3">
                    <label htmlFor="usuarioSelect" className="form-label fw-semibold">Selecionar Usuário</label>
                    <select
                      id="usuarioSelect"
                      className="form-select"
                      value={selectedUsuarioId}
                      onChange={(e) => setSelectedUsuarioId(e.target.value)}
                      required
                    >
                      {usuarios.length === 0 ? (
                        <option value="">Nenhum usuário cadastrado</option>
                      ) : (
                        usuarios.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.nome}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="cursoSelect" className="form-label fw-semibold">Selecionar Curso Concluído</label>
                    <select
                      id="cursoSelect"
                      className="form-select"
                      value={selectedCursoId}
                      onChange={(e) => setSelectedCursoId(e.target.value)}
                      required
                    >
                      {cursos.length === 0 ? (
                        <option value="">Nenhum curso cadastrado no sistema</option>
                      ) : (
                        cursos.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nome} ({c.cargaHoraria} hrs)
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 py-2.5 fw-bold"
                    disabled={usuarios.length === 0 || cursos.length === 0}
                  >
                    <i className="bi bi-award-fill me-2"></i> Emitir Certificado de Conclusão
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
