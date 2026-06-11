import { useState, useEffect } from "react";
import apiService from "../../services/api.service";

interface ICategory {
  id: string;
  nome: string;
}

interface ICourse {
  id: string;
  titulo: string;
}

interface ITrilha {
  id: string;
  titulo: string;
  descricao: string;
  idCategoria: string;
}

interface ITrilhaCurso {
  id: string;
  idTrilha: string;
  idCurso: string;
  ordem: number;
}

export const TrilhasPage = () => {
  const [trilhas, setTrilhas] = useState<ITrilha[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [selectedTrilha, setSelectedTrilha] = useState<ITrilha | null>(null);
  
  const [trilhaCursos, setTrilhaCursos] = useState<ITrilhaCurso[]>([]);

  const [tId, setTId] = useState("");
  const [tTitulo, setTTitulo] = useState("");
  const [tDescricao, setTDescricao] = useState("");
  const [tIdCategoria, setTIdCategoria] = useState("");

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [tcOrdem, setTcOrdem] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [tData, catData, cData] = await Promise.all([
        apiService.getAll<ITrilha>("trilhas"),
        apiService.getAll<ICategory>("categorias"),
        apiService.getAll<ICourse>("cursos"),
      ]);
      setTrilhas(tData);
      setCategories(catData);
      setCourses(cData);

      if (tData.length > 0 && !selectedTrilha) {
        handleSelectTrilha(tData[0]);
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar dados do banco.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectTrilha = async (trilha: ITrilha) => {
    setSelectedTrilha(trilha);
    try {
      const allTc = await apiService.getAll<ITrilhaCurso>("trilhas_cursos");
      setTrilhaCursos(allTc.filter((tc) => tc.idTrilha === trilha.id).sort((a, b) => a.ordem - b.ordem));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveTrilha = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tTitulo || !tIdCategoria) return;

    const data = {
      titulo: tTitulo,
      descricao: tDescricao,
      idCategoria: tIdCategoria,
    };

    try {
      if (tId) {
        const updated = await apiService.update<ITrilha>("trilhas", tId, { ...data, id: tId });
        setTrilhas((prev) => prev.map((t) => (t.id === tId ? updated : t)));
        if (selectedTrilha?.id === tId) {
          setSelectedTrilha(updated);
        }
      } else {
        const created = await apiService.create<ITrilha>("trilhas", {
          ...data,
          id: "tri" + Math.floor(1000 + Math.random() * 9000),
        });
        setTrilhas((prev) => [...prev, created]);
        handleSelectTrilha(created);
      }
      handleCancelTrilha();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditTrilha = (trilha: ITrilha) => {
    setTId(trilha.id);
    setTTitulo(trilha.titulo);
    setTDescricao(trilha.descricao);
    setTIdCategoria(trilha.idCategoria);
  };

  const handleDeleteTrilha = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta trilha?")) return;
    try {
      await apiService.delete("trilhas", id);
      setTrilhas((prev) => prev.filter((t) => t.id !== id));
      if (selectedTrilha?.id === id) {
        setSelectedTrilha(null);
        setTrilhaCursos([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelTrilha = () => {
    setTId("");
    setTTitulo("");
    setTDescricao("");
    setTIdCategoria("");
  };

  const handleLinkCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrilha || !selectedCourseId) return;

    if (trilhaCursos.some((tc) => tc.idCurso === selectedCourseId)) {
      alert("Este curso já está associado a esta trilha.");
      return;
    }

    try {
      const created = await apiService.create<ITrilhaCurso>("trilhas_cursos", {
        id: "tc" + Math.floor(1000 + Math.random() * 9000),
        idTrilha: selectedTrilha.id,
        idCurso: selectedCourseId,
        ordem: Number(tcOrdem),
      });
      setTrilhaCursos((prev) => [...prev, created].sort((a, b) => a.ordem - b.ordem));
      setSelectedCourseId("");
      setTcOrdem(trilhaCursos.length + 2);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnlinkCourse = async (id: string) => {
    if (!confirm("Remover este curso da trilha?")) return;
    try {
      await apiService.delete("trilhas_cursos", id);
      setTrilhaCursos((prev) => prev.filter((tc) => tc.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const getCourseName = (id: string) => {
    return courses.find((c) => c.id === id)?.titulo || "Curso Indisponível";
  };

  const getCategoryName = (id: string) => {
    return categories.find((c) => c.id === id)?.nome || "Sem Categoria";
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
        <div className="col-12 col-md-5 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold text-primary">
                {tId ? "Editar Trilha" : "Criar Trilha"}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSaveTrilha}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Título da Trilha</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ex: Trilha Front-End"
                    value={tTitulo}
                    onChange={(e) => setTTitulo(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Descrição</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Descreva o objetivo desta trilha..."
                    value={tDescricao}
                    onChange={(e) => setTDescricao(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Categoria Principal</label>
                  <select
                    className="form-select"
                    value={tIdCategoria}
                    onChange={(e) => setTIdCategoria(e.target.value)}
                    required
                  >
                    <option value="">Selecione a categoria...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary px-4">
                    {tId ? "Atualizar" : "Salvar"}
                  </button>
                  {tId && (
                    <button type="button" className="btn btn-secondary" onClick={handleCancelTrilha}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-7 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold text-dark">Trilhas de Aprendizado</h5>
            </div>
            <div className="card-body p-0">
              {loading && trilhas.length === 0 ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary"></div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th className="px-4">Trilha</th>
                        <th>Categoria</th>
                        <th className="text-end px-4">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trilhas.map((trilha) => (
                        <tr
                          key={trilha.id}
                          onClick={() => handleSelectTrilha(trilha)}
                          style={{ cursor: "pointer" }}
                          className={selectedTrilha?.id === trilha.id ? "table-primary" : ""}
                        >
                          <td className="px-4">
                            <div className="fw-semibold text-primary">{trilha.titulo}</div>
                            <small className="text-muted d-block text-truncate" style={{ maxWidth: "200px" }}>
                              {trilha.descricao}
                            </small>
                          </td>
                          <td>
                            <span className="badge bg-secondary">{getCategoryName(trilha.idCategoria)}</span>
                          </td>
                          <td className="text-end px-4" onClick={(e) => e.stopPropagation()}>
                            <div className="d-flex gap-2 justify-content-end">
                              <button
                                className="btn btn-sm btn-outline-warning"
                                onClick={() => handleEditTrilha(trilha)}
                              >
                                <i className="bi bi-pencil-square"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteTrilha(trilha.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedTrilha && (
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold text-dark">
                  Cursos na Trilha: <span className="text-primary">{selectedTrilha.titulo}</span>
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleLinkCourse} className="row g-3 align-items-end mb-4">
                  <div className="col-12 col-sm-6">
                    <label className="form-label small fw-semibold">Selecionar Curso</label>
                    <select
                      className="form-select form-select-sm"
                      value={selectedCourseId}
                      onChange={(e) => setSelectedCourseId(e.target.value)}
                      required
                    >
                      <option value="">Selecione o curso para adicionar...</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.titulo}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6 col-sm-3">
                    <label className="form-label small fw-semibold">Ordem na Trilha</label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={tcOrdem}
                      onChange={(e) => setTcOrdem(Number(e.target.value))}
                      min={1}
                      required
                    />
                  </div>
                  <div className="col-6 col-sm-3">
                    <button type="submit" className="btn btn-sm btn-success w-100">
                      Adicionar Curso
                    </button>
                  </div>
                </form>

                <div className="bg-light p-3 rounded">
                  <h6 className="fw-bold mb-3">Caminho de Aprendizado Sequencial</h6>
                  {trilhaCursos.length === 0 ? (
                    <div className="text-muted small py-2">
                      Nenhum curso adicionado nesta trilha ainda.
                    </div>
                  ) : (
                    <div className="list-group">
                      {trilhaCursos.map((tc, idx) => (
                        <div
                          key={tc.id}
                          className="list-group-item d-flex justify-content-between align-items-center bg-white rounded border mb-2 shadow-sm"
                        >
                          <div>
                            <span className="badge bg-primary rounded-circle me-2 p-2" style={{ width: "30px", height: "30px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                              {idx + 1}
                            </span>
                            <span className="fw-semibold text-dark">{getCourseName(tc.idCurso)}</span>
                            <small className="text-muted ms-2">(Ordem de Exibição: {tc.ordem})</small>
                          </div>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleUnlinkCourse(tc.id)}
                          >
                            Remover
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default TrilhasPage;
