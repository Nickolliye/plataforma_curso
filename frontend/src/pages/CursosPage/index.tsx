import { useState, useEffect } from "react";
import apiService from "../../services/api.service";

interface ICategory {
  id: string;
  nome: string;
  descricao: string;
}

interface ICourse {
  id: string;
  titulo: string;
  descricao: string;
  idInstrutor: string;
  idCategoria: string;
  nivel: string;
  dataPublicacao: string;
  totalAulas: number;
  totalHoras: number;
}

interface IModule {
  id: string;
  idCurso: string;
  titulo: string;
  ordem: number;
}

interface ILesson {
  id: string;
  idModulo: string;
  titulo: string;
  tipoConteudo: string;
  urlConteudo: string;
  duracaoMinutos: number;
  ordem: number;
}

interface IUser {
  id: string;
  nome: string;
}

export const CursosPage = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  
  const [modules, setModules] = useState<IModule[]>([]);
  const [lessons, setLessons] = useState<ILesson[]>([]);

  const [cId, setCId] = useState("");
  const [cTitulo, setCTitulo] = useState("");
  const [cDescricao, setCDescricao] = useState("");
  const [cIdInstrutor, setCIdInstrutor] = useState("");
  const [cIdCategoria, setCIdCategoria] = useState("");
  const [cNivel, setCNivel] = useState("Iniciante");
  const [cTotalHoras, setCTotalHoras] = useState(10);

  const [catNome, setCatNome] = useState("");
  const [catDescricao, setCatDescricao] = useState("");
  const [showCatModal, setShowCatModal] = useState(false);

  const [mId, setMId] = useState("");
  const [mTitulo, setMTitulo] = useState("");
  const [mOrdem, setMOrdem] = useState(1);
  const [showModuleForm, setShowModuleForm] = useState(false);

  const [lId, setLId] = useState("");
  const [lIdModulo, setLIdModulo] = useState("");
  const [lTitulo, setLTitulo] = useState("");
  const [lTipoConteudo, setLTipoConteudo] = useState("Vídeo");
  const [lUrlConteudo, setLUrlConteudo] = useState("");
  const [lDuracao, setLDuracao] = useState(10);
  const [lOrdem, setLOrdem] = useState(1);
  const [showLessonForm, setShowLessonForm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [cData, catData, uData] = await Promise.all([
        apiService.getAll<ICourse>("cursos"),
        apiService.getAll<ICategory>("categorias"),
        apiService.getAll<IUser>("usuarios"),
      ]);
      setCourses(cData);
      setCategories(catData);
      setUsers(uData);

      if (cData.length > 0 && !selectedCourse) {
        handleSelectCourse(cData[0]);
      }
    } catch (err: any) {
      console.error("Erro ao carregar dados:", err);
      setError("Erro ao se conectar ao JSON Server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleSelectCourse = async (course: ICourse) => {
    setSelectedCourse(course);
    try {
      const [allMods, allLessons] = await Promise.all([
        apiService.getAll<IModule>("modulos"),
        apiService.getAll<ILesson>("aulas"),
      ]);
      setModules(allMods.filter((m) => m.idCurso === course.id).sort((a, b) => a.ordem - b.ordem));
      setLessons(allLessons.sort((a, b) => a.ordem - b.ordem));
    } catch (err) {
      console.error("Erro ao carregar estrutura do curso:", err);
    }
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cTitulo || !cIdInstrutor || !cIdCategoria) {
      alert("Por favor preencha todos os campos obrigatórios.");
      return;
    }

    const courseData = {
      titulo: cTitulo,
      descricao: cDescricao,
      idInstrutor: cIdInstrutor,
      idCategoria: cIdCategoria,
      nivel: cNivel,
      dataPublicacao: new Date().toISOString().split("T")[0],
      totalAulas: selectedCourse ? selectedCourse.totalAulas : 0,
      totalHoras: Number(cTotalHoras),
    };

    try {
      if (cId) {
        const updated = await apiService.update<ICourse>("cursos", cId, { ...courseData, id: cId });
        setCourses((prev) => prev.map((c) => (c.id === cId ? updated : c)));
        if (selectedCourse?.id === cId) {
          setSelectedCourse(updated);
        }
      } else {
        const created = await apiService.create<ICourse>("cursos", {
          ...courseData,
          id: "cur" + Math.floor(1000 + Math.random() * 9000),
        });
        setCourses((prev) => [...prev, created]);
        handleSelectCourse(created);
      }
      handleCancelCourse();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditCourse = (course: ICourse) => {
    setCId(course.id);
    setCTitulo(course.titulo);
    setCDescricao(course.descricao);
    setCIdInstrutor(course.idInstrutor);
    setCIdCategoria(course.idCategoria);
    setCNivel(course.nivel);
    setCTotalHoras(course.totalHoras);
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Excluir este curso apagará também seus módulos e aulas. Confirmar?")) return;
    try {
      await apiService.delete("cursos", id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
      if (selectedCourse?.id === id) {
        setSelectedCourse(null);
        setModules([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelCourse = () => {
    setCId("");
    setCTitulo("");
    setCDescricao("");
    setCIdInstrutor("");
    setCIdCategoria("");
    setCNivel("Iniciante");
    setCTotalHoras(10);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNome) return;
    try {
      const created = await apiService.create<ICategory>("categorias", {
        id: "cat" + Math.floor(1000 + Math.random() * 9000),
        nome: catNome,
        descricao: catDescricao,
      });
      setCategories((prev) => [...prev, created]);
      setCIdCategoria(created.id);
      setCatNome("");
      setCatDescricao("");
      setShowCatModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !mTitulo) return;

    const modData = {
      idCurso: selectedCourse.id,
      titulo: mTitulo,
      ordem: Number(mOrdem),
    };

    try {
      if (mId) {
        const updated = await apiService.update<IModule>("modulos", mId, { ...modData, id: mId });
        setModules((prev) => prev.map((m) => (m.id === mId ? updated : m)).sort((a, b) => a.ordem - b.ordem));
      } else {
        const created = await apiService.create<IModule>("modulos", {
          ...modData,
          id: "mod" + Math.floor(1000 + Math.random() * 9000),
        });
        setModules((prev) => [...prev, created].sort((a, b) => a.ordem - b.ordem));
      }
      handleCancelModule();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditModule = (mod: IModule) => {
    setMId(mod.id);
    setMTitulo(mod.titulo);
    setMOrdem(mod.ordem);
    setShowModuleForm(true);
  };

  const handleDeleteModule = async (id: string) => {
    if (!confirm("Deseja realmente remover este módulo?")) return;
    try {
      await apiService.delete("modulos", id);
      setModules((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelModule = () => {
    setMId("");
    setMTitulo("");
    setMOrdem(modules.length + 1);
    setShowModuleForm(false);
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lIdModulo || !lTitulo) return;

    const lesData = {
      idModulo: lIdModulo,
      titulo: lTitulo,
      tipoConteudo: lTipoConteudo,
      urlConteudo: lUrlConteudo,
      duracaoMinutos: Number(lDuracao),
      ordem: Number(lOrdem),
    };

    try {
      if (lId) {
        const updated = await apiService.update<ILesson>("aulas", lId, { ...lesData, id: lId });
        setLessons((prev) => prev.map((l) => (l.id === lId ? updated : l)).sort((a, b) => a.ordem - b.ordem));
      } else {
        const created = await apiService.create<ILesson>("aulas", {
          ...lesData,
          id: "aul" + Math.floor(1000 + Math.random() * 9000),
        });
        setLessons((prev) => [...prev, created].sort((a, b) => a.ordem - b.ordem));

        if (selectedCourse) {
          const updatedCourse = {
            ...selectedCourse,
            totalAulas: (selectedCourse.totalAulas || 0) + 1,
          };
          await apiService.update("cursos", selectedCourse.id, updatedCourse);
          setCourses((prev) => prev.map((c) => (c.id === selectedCourse.id ? updatedCourse : c)));
          setSelectedCourse(updatedCourse);
        }
      }
      handleCancelLesson();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditLesson = (les: ILesson) => {
    setLId(les.id);
    setLIdModulo(les.idModulo);
    setLTitulo(les.titulo);
    setLTipoConteudo(les.tipoConteudo);
    setLUrlConteudo(les.urlConteudo);
    setLDuracao(les.duracaoMinutos);
    setLOrdem(les.ordem);
    setShowLessonForm(true);
  };

  const handleDeleteLesson = async (id: string) => {
    if (!confirm("Deseja realmente remover esta aula?")) return;
    try {
      await apiService.delete("aulas", id);
      setLessons((prev) => prev.filter((l) => l.id !== id));

      if (selectedCourse && selectedCourse.totalAulas > 0) {
        const updatedCourse = {
          ...selectedCourse,
          totalAulas: selectedCourse.totalAulas - 1,
        };
        await apiService.update("cursos", selectedCourse.id, updatedCourse);
        setCourses((prev) => prev.map((c) => (c.id === selectedCourse.id ? updatedCourse : c)));
        setSelectedCourse(updatedCourse);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelLesson = () => {
    setLId("");
    setLIdModulo("");
    setLTitulo("");
    setLTipoConteudo("Vídeo");
    setLUrlConteudo("");
    setLDuracao(10);
    setLOrdem(1);
    setShowLessonForm(false);
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
                {cId ? "Editar Curso" : "Cadastrar Curso"}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSaveCourse}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Título do Curso</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ex: Curso de React Básico"
                    value={cTitulo}
                    onChange={(e) => setCTitulo(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Descrição</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Descrição dos tópicos..."
                    value={cDescricao}
                    onChange={(e) => setCDescricao(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Instrutor</label>
                  <select
                    className="form-select"
                    value={cIdInstrutor}
                    onChange={(e) => setCIdInstrutor(e.target.value)}
                    required
                  >
                    <option value="">Selecione um instrutor...</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold d-flex justify-content-between">
                    <span>Categoria</span>
                    <button
                      type="button"
                      className="btn btn-sm btn-link p-0 text-decoration-none"
                      onClick={() => setShowCatModal(true)}
                    >
                      + Nova Categoria
                    </button>
                  </label>
                  <select
                    className="form-select"
                    value={cIdCategoria}
                    onChange={(e) => setCIdCategoria(e.target.value)}
                    required
                  >
                    <option value="">Selecione uma categoria...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label fw-semibold">Nível</label>
                    <select
                      className="form-select"
                      value={cNivel}
                      onChange={(e) => setCNivel(e.target.value)}
                    >
                      <option value="Iniciante">Iniciante</option>
                      <option value="Intermediário">Intermediário</option>
                      <option value="Avançado">Avançado</option>
                    </select>
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label fw-semibold">Carga Horária (Horas)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={cTotalHoras}
                      onChange={(e) => setCTotalHoras(Number(e.target.value))}
                      min={1}
                      required
                    />
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary px-4">
                    {cId ? "Atualizar" : "Salvar"}
                  </button>
                  {cId && (
                    <button type="button" className="btn btn-secondary" onClick={handleCancelCourse}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-7 mb-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold text-dark">Cursos Ativos</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-striped table-hover mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="px-4">Curso</th>
                      <th>Categoria</th>
                      <th>Aulas / Carga</th>
                      <th className="text-end px-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr
                        key={course.id}
                        onClick={() => handleSelectCourse(course)}
                        style={{ cursor: "pointer" }}
                        className={selectedCourse?.id === course.id ? "table-primary" : ""}
                      >
                        <td className="px-4">
                          <div className="fw-semibold text-primary">{course.titulo}</div>
                          <small className="text-muted">{course.nivel}</small>
                        </td>
                        <td>
                          <span className="badge bg-secondary">{getCategoryName(course.idCategoria)}</span>
                        </td>
                        <td>
                          {course.totalAulas || 0} aulas / {course.totalHoras} hrs
                        </td>
                        <td className="text-end px-4" onClick={(e) => e.stopPropagation()}>
                          <div className="d-flex gap-2 justify-content-end">
                            <button
                              className="btn btn-sm btn-outline-warning"
                              onClick={() => handleEditCourse(course)}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteCourse(course.id)}
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
            </div>
          </div>
        </div>
      </div>

      {selectedCourse && (
        <div className="card shadow-sm border-0 mt-4">
          <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold text-dark">
              Estrutura de Conteúdo: <span className="text-primary">{selectedCourse.titulo}</span>
            </h5>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => {
                setMOrdem(modules.length + 1);
                setShowModuleForm(true);
              }}
            >
              + Adicionar Módulo
            </button>
          </div>
          <div className="card-body">
            {showModuleForm && (
              <div className="card bg-light border-0 mb-4">
                <div className="card-body">
                  <h6 className="fw-bold mb-3">{mId ? "Editar Módulo" : "Novo Módulo"}</h6>
                  <form onSubmit={handleSaveModule} className="row g-3 align-items-end">
                    <div className="col-12 col-sm-6">
                      <label className="form-label small fw-semibold">Título do Módulo</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={mTitulo}
                        onChange={(e) => setMTitulo(e.target.value)}
                        placeholder="Ex: Módulo 1 - Primeiros Passos"
                        required
                      />
                    </div>
                    <div className="col-6 col-sm-3">
                      <label className="form-label small fw-semibold">Ordem Sequencial</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={mOrdem}
                        onChange={(e) => setMOrdem(Number(e.target.value))}
                        min={1}
                        required
                      />
                    </div>
                    <div className="col-6 col-sm-3 d-flex gap-2">
                      <button type="submit" className="btn btn-sm btn-success flex-grow-1">
                        Salvar
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={handleCancelModule}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {showLessonForm && (
              <div className="card bg-light border-0 mb-4">
                <div className="card-body">
                  <h6 className="fw-bold mb-3">{lId ? "Editar Aula" : "Nova Aula"}</h6>
                  <form onSubmit={handleSaveLesson}>
                    <div className="row g-3">
                      <div className="col-12 col-sm-6">
                        <label className="form-label small fw-semibold">Título da Aula</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={lTitulo}
                          onChange={(e) => setLTitulo(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-6 col-sm-3">
                        <label className="form-label small fw-semibold">Tipo Conteúdo</label>
                        <select
                          className="form-select form-select-sm"
                          value={lTipoConteudo}
                          onChange={(e) => setLTipoConteudo(e.target.value)}
                        >
                          <option value="Vídeo">Vídeo</option>
                          <option value="Texto">Texto</option>
                          <option value="Quiz">Quiz</option>
                        </select>
                      </div>
                      <div className="col-6 col-sm-3">
                        <label className="form-label small fw-semibold">Ordem Sequencial</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={lOrdem}
                          onChange={(e) => setLOrdem(Number(e.target.value))}
                          min={1}
                          required
                        />
                      </div>
                      <div className="col-12 col-sm-8">
                        <label className="form-label small fw-semibold">URL / Recurso</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={lUrlConteudo}
                          onChange={(e) => setLUrlConteudo(e.target.value)}
                          placeholder="Ex: https://www.youtube.com/embed/..."
                        />
                      </div>
                      <div className="col-6 col-sm-2">
                        <label className="form-label small fw-semibold">Duração (Min)</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={lDuracao}
                          onChange={(e) => setLDuracao(Number(e.target.value))}
                          min={1}
                          required
                        />
                      </div>
                      <div className="col-6 col-sm-2 d-flex align-items-end gap-2">
                        <button type="submit" className="btn btn-sm btn-success w-100">
                          Salvar
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary w-100"
                          onClick={handleCancelLesson}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="bg-light p-3 rounded">
              {modules.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  Nenhum módulo cadastrado neste curso. Clique em "+ Adicionar Módulo" acima.
                </div>
              ) : (
                modules.map((mod) => {
                  const modLessons = lessons.filter((l) => l.idModulo === mod.id);
                  return (
                    <div key={mod.id} className="mb-4 bg-white rounded border p-3 shadow-sm">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold mb-0 text-dark">
                          {mod.titulo} <small className="text-muted">(Ordem: {mod.ordem})</small>
                        </h6>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary py-1"
                            onClick={() => {
                              setLIdModulo(mod.id);
                              setLOrdem(modLessons.length + 1);
                              setShowLessonForm(true);
                            }}
                          >
                            + Add Aula
                          </button>
                          <button
                            className="btn btn-sm btn-link text-warning p-0"
                            onClick={() => handleEditModule(mod)}
                          >
                            <i className="bi bi-pencil-square fs-5"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-link text-danger p-0"
                            onClick={() => handleDeleteModule(mod.id)}
                          >
                            <i className="bi bi-trash fs-5"></i>
                          </button>
                        </div>
                      </div>

                      <ul className="list-group list-group-flush ms-4 ps-2 border-start">
                        {modLessons.length === 0 ? (
                          <li className="list-group-item text-muted border-0 py-2 small">
                            Nenhuma aula cadastrada neste módulo.
                          </li>
                        ) : (
                          modLessons.map((les) => (
                            <li
                              key={les.id}
                              className="list-group-item d-flex justify-content-between align-items-center py-2 px-3 border-0 bg-light rounded mb-1"
                            >
                              <div>
                                <i className="bi bi-play-circle-fill text-info me-2"></i>
                                <span className="fw-semibold small">{les.titulo}</span>
                                <span className="badge bg-secondary ms-2 small">{les.tipoConteudo}</span>
                                <small className="text-muted ms-2">({les.duracaoMinutos} min)</small>
                              </div>
                              <div>
                                <button
                                  className="btn btn-sm btn-link text-warning p-0 me-2"
                                  onClick={() => handleEditLesson(les)}
                                >
                                  <i className="bi bi-pencil-square"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-link text-danger p-0"
                                  onClick={() => handleDeleteLesson(les.id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {showCatModal && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Cadastrar Categoria</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCatModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSaveCategory}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Nome da Categoria</label>
                    <input
                      type="text"
                      className="form-control"
                      value={catNome}
                      onChange={(e) => setCatNome(e.target.value)}
                      placeholder="Ex: Front-End, Design"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Descrição</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={catDescricao}
                      onChange={(e) => setCatDescricao(e.target.value)}
                      placeholder="Objetivo da categoria..."
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCatModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success">
                    Criar Categoria
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CursosPage;
