import { useState, useEffect } from "react";
import apiService from "../../services/api.service";

interface IUser {
  id: string;
  nome: string;
  email: string;
}

interface ICourse {
  id: string;
  titulo: string;
}

interface IModulo {
  id: string;
  idCurso: string;
  titulo: string;
}

interface ILesson {
  id: string;
  idModulo: string;
  titulo: string;
}

interface IMatricula {
  id: string;
  idUsuario: string;
  idCurso: string;
  dataMatricula: string;
  dataConclusao: string | null;
}

interface IProgressoAula {
  id: string;
  idUsuario: string;
  idAula: string;
  dataConclusao: string;
  status: string;
}

export const MatriculasPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [matriculas, setMatriculas] = useState<IMatricula[]>([]);
  const [selectedMatricula, setSelectedMatricula] = useState<IMatricula | null>(null);

  const [modules, setModules] = useState<IModulo[]>([]);
  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [progressoAulas, setProgressoAulas] = useState<IProgressoAula[]>([]);

  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const [error, setError] = useState("");

  const [evalNota, setEvalNota] = useState(5);
  const [evalComentario, setEvalComentario] = useState("");
  const [evalSubmitted, setEvalSubmitted] = useState(false);

  const loadData = async () => {
    try {
      const [uData, cData, mData] = await Promise.all([
        apiService.getAll<IUser>("usuarios"),
        apiService.getAll<ICourse>("cursos"),
        apiService.getAll<IMatricula>("matriculas"),
      ]);
      setUsers(uData);
      setCourses(cData);
      setMatriculas(mData);

      if (mData.length > 0 && !selectedMatricula) {
        handleSelectMatricula(mData[0]);
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao se conectar ao banco local.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectMatricula = async (mat: IMatricula) => {
    setSelectedMatricula(mat);
    setEvalNota(5);
    setEvalComentario("");
    setEvalSubmitted(false);
    try {
      const [allMods, allLessons, allProg] = await Promise.all([
        apiService.getAll<IModulo>("modulos"),
        apiService.getAll<ILesson>("aulas"),
        apiService.getAll<IProgressoAula>("progresso_aulas"),
      ]);

      const courseModules = allMods.filter((m) => m.idCurso === mat.idCurso);
      const moduleIds = courseModules.map((m) => m.id);
      const courseLessons = allLessons.filter((l) => moduleIds.includes(l.idModulo));

      setModules(courseModules);
      setLessons(courseLessons);
      setProgressoAulas(allProg.filter((p) => p.idUsuario === mat.idUsuario));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMatricular = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !selectedCourseId) return;

    if (matriculas.some((m) => m.idUsuario === selectedUserId && m.idCurso === selectedCourseId)) {
      alert("Este aluno já está matriculado neste curso.");
      return;
    }

    try {
      const created = await apiService.create<IMatricula>("matriculas", {
        id: "mat" + Math.floor(1000 + Math.random() * 9000),
        idUsuario: selectedUserId,
        idCurso: selectedCourseId,
        dataMatricula: new Date().toISOString().split("T")[0],
        dataConclusao: null,
      });

      setMatriculas((prev) => [...prev, created]);
      setSelectedUserId("");
      setSelectedCourseId("");
      handleSelectMatricula(created);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleLesson = async (aulaId: string, isChecked: boolean) => {
    if (!selectedMatricula) return;

    try {
      const existingProg = progressoAulas.find((p) => p.idAula === aulaId);

      let updatedProg = [...progressoAulas];

      if (isChecked) {
        const created = await apiService.create<IProgressoAula>("progresso_aulas", {
          id: "prog" + Math.floor(1000 + Math.random() * 9000),
          idUsuario: selectedMatricula.idUsuario,
          idAula: aulaId,
          dataConclusao: new Date().toISOString().split("T")[0],
          status: "Concluído",
        });
        updatedProg.push(created);
      } else {
        if (existingProg) {
          await apiService.delete("progresso_aulas", existingProg.id);
          updatedProg = updatedProg.filter((p) => p.id !== existingProg.id);
        }
      }

      setProgressoAulas(updatedProg);

      const totalLessonsCount = lessons.length;
      const completedCount = lessons.filter((l) => updatedProg.some((p) => p.idAula === l.id)).length;

      const isCompletedNow = totalLessonsCount > 0 && completedCount === totalLessonsCount;

      if (isCompletedNow !== !!selectedMatricula.dataConclusao) {
        const dataConclusaoVal = isCompletedNow ? new Date().toISOString().split("T")[0] : null;
        const updatedMat = await apiService.update<IMatricula>("matriculas", selectedMatricula.id, {
          ...selectedMatricula,
          dataConclusao: dataConclusaoVal,
        });

        setMatriculas((prev) => prev.map((m) => (m.id === selectedMatricula.id ? updatedMat : m)));
        setSelectedMatricula(updatedMat);

        if (isCompletedNow) {
          try {
            const certs = await apiService.getAll<any>("certificados");
            const alreadyHasCert = certs.some(
              (c: any) => c.idUsuario === selectedMatricula.idUsuario && c.idCurso === selectedMatricula.idCurso
            );
            if (!alreadyHasCert) {
              await apiService.create("certificados", {
                id: "cer" + Math.floor(1000 + Math.random() * 9000),
                idUsuario: selectedMatricula.idUsuario,
                idCurso: selectedMatricula.idCurso,
                idTrilha: null,
                codigoVerificacao: "CERT-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
                dataEmissao: new Date().toISOString().split("T")[0],
              });
              alert("Parabéns! O curso foi concluído e o certificado foi emitido automaticamente.");
            }
          } catch (certErr) {
            console.error("Erro ao gerar certificado automático:", certErr);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatricula) return;

    try {
      await apiService.create("avaliacoes", {
        id: "av" + Math.floor(1000 + Math.random() * 9000),
        idUsuario: selectedMatricula.idUsuario,
        idCurso: selectedMatricula.idCurso,
        nota: Number(evalNota),
        comentario: evalComentario,
        dataAvaliacao: new Date().toISOString().split("T")[0],
      });
      setEvalSubmitted(true);
      setEvalComentario("");
    } catch (err) {
      console.error("Erro ao enviar avaliação:", err);
      alert("Erro ao salvar sua avaliação.");
    }
  };

  const getStudentName = (id: string) => {
    return users.find((u) => u.id === id)?.nome || "Aluno Excluído";
  };

  const getCourseName = (id: string) => {
    return courses.find((c) => c.id === id)?.titulo || "Curso Excluído";
  };

  const calculateProgress = () => {
    if (lessons.length === 0) return 0;
    const completedCount = lessons.filter((l) => progressoAulas.some((p) => p.idAula === l.id)).length;
    return Math.round((completedCount / lessons.length) * 100);
  };

  const getProgressBarVisual = (percent: number) => {
    const totalBlocks = 10;
    const filledBlocks = Math.round((percent / 100) * totalBlocks);
    const emptyBlocks = totalBlocks - filledBlocks;
    return "█".repeat(filledBlocks) + "░".repeat(emptyBlocks);
  };

  return (
    <div>
      {error && (
        <div className="alert alert-danger shadow-sm border-0 mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      <div className="row">
        {/* Left: Enrollment Form */}
        <div className="col-12 col-md-5 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold text-primary">Matricular Aluno</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleMatricular}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Selecionar Aluno</label>
                  <select
                    className="form-select"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    required
                  >
                    <option value="">Escolha um aluno...</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nome} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Selecionar Curso</label>
                  <select
                    className="form-select"
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    required
                  >
                    <option value="">Escolha um curso...</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.titulo}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">
                  <i className="bi bi-journal-plus me-2"></i> Matricular Curso
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right: Enrollment List Table */}
        <div className="col-12 col-md-7 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold text-dark">Matrículas Realizadas</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-striped table-hover mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="px-4">Aluno</th>
                      <th>Curso</th>
                      <th>Data Matrícula</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matriculas.map((mat) => (
                      <tr
                        key={mat.id}
                        onClick={() => handleSelectMatricula(mat)}
                        style={{ cursor: "pointer" }}
                        className={selectedMatricula?.id === mat.id ? "table-primary" : ""}
                      >
                        <td className="px-4 fw-semibold text-primary">{getStudentName(mat.idUsuario)}</td>
                        <td>{getCourseName(mat.idCurso)}</td>
                        <td>{mat.dataMatricula}</td>
                        <td>
                          {mat.dataConclusao ? (
                            <span className="badge bg-success">Concluído ({mat.dataConclusao})</span>
                          ) : (
                            <span className="badge bg-warning text-dark">Em Progresso</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      {selectedMatricula && (
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold text-dark">
                  Progresso Acadêmico: <span className="text-primary">{getStudentName(selectedMatricula.idUsuario)}</span>
                </h5>
                <small className="text-muted d-block mt-1">Curso: {getCourseName(selectedMatricula.idCurso)}</small>
              </div>
              <div className="card-body">
                <div className="bg-light p-4 rounded mb-4 shadow-sm border border-light">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold fs-5 text-dark">Porcentagem Concluída</span>
                    <span className="fw-bold text-primary fs-4">{calculateProgress()}%</span>
                  </div>
                  <div className="progress mb-3" style={{ height: "1.5rem" }}>
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{ width: `${calculateProgress()}%` }}
                      aria-valuenow={calculateProgress()}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                  </div>
                  <div className="text-center font-monospace fs-5 text-muted">
                    {getProgressBarVisual(calculateProgress())}
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-12 col-md-8">
                    <h6 className="fw-bold mb-3 text-dark">Checklist de Aulas do Curso</h6>
                    {modules.length === 0 ? (
                      <div className="text-muted small">Este curso não possui nenhuma aula cadastrada no momento.</div>
                    ) : (
                      modules.map((mod) => {
                        const modLessons = lessons.filter((l) => l.idModulo === mod.id);
                        return (
                          <div key={mod.id} className="mb-3">
                            <div className="fw-bold text-dark mb-2 bg-light p-2 rounded small">
                              {mod.titulo}
                            </div>
                            <div className="list-group list-group-flush ms-3 ps-2 border-start">
                              {modLessons.map((les) => {
                                const isCompleted = progressoAulas.some((p) => p.idAula === les.id);
                                return (
                                  <label
                                    key={les.id}
                                    className="list-group-item list-group-item-action border-0 d-flex align-items-center gap-3 py-2 px-3 rounded mb-1"
                                    style={{ cursor: "pointer" }}
                                  >
                                    <input
                                      className="form-check-input flex-shrink-0"
                                      type="checkbox"
                                      checked={isCompleted}
                                      onChange={(e) => handleToggleLesson(les.id, e.target.checked)}
                                    />
                                    <span className={isCompleted ? "text-decoration-line-through text-muted" : "fw-semibold"}>
                                      {les.titulo}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="card border-0 bg-light shadow-sm">
                      <div className="card-body">
                        <h6 className="fw-bold text-dark mb-3">
                          <i className="bi bi-star-fill text-warning me-2"></i>
                          Avaliar este Curso
                        </h6>
                        {evalSubmitted ? (
                          <div className="alert alert-success border-0 small mb-0">
                            <i className="bi bi-check-circle-fill me-2"></i>
                            Avaliação enviada com sucesso!
                          </div>
                        ) : (
                          <form onSubmit={handleSubmitEvaluation}>
                            <div className="mb-3">
                              <label className="form-label small fw-semibold">Nota</label>
                              <select
                                className="form-select form-select-sm"
                                value={evalNota}
                                onChange={(e) => setEvalNota(Number(e.target.value))}
                                required
                              >
                                <option value="5">5 estrelas (Excelente)</option>
                                <option value="4">4 estrelas (Muito Bom)</option>
                                <option value="3">3 estrelas (Regular)</option>
                                <option value="2">2 estrelas (Ruim)</option>
                                <option value="1">1 estrela (Péssimo)</option>
                              </select>
                            </div>
                            <div className="mb-3">
                              <label className="form-label small fw-semibold">Comentário</label>
                              <textarea
                                className="form-control form-control-sm"
                                rows={3}
                                placeholder="Deixe sua opinião sobre o curso..."
                                value={evalComentario}
                                onChange={(e) => setEvalComentario(e.target.value)}
                              />
                            </div>
                            <button type="submit" className="btn btn-sm btn-warning w-100 fw-bold">
                              Enviar Avaliação
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MatriculasPage;
