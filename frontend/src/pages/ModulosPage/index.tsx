import { useState, useEffect } from "react";
import { type ICurso } from "../CursosPage";

export interface IModulo {
  id: string;
  nome: string;
  descricao: string;
  cursoId: string;
}

export const ModulosPage = () => {
  const [modulos, setModulos] = useState<IModulo[]>([]);
  const [cursos, setCursos] = useState<ICurso[]>([]);
  
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cursoId, setCursoId] = useState("");
  
  const [editingId, setEditingId] = useState<string | null>(null);

  // Carregar dados de cursos e módulos
  useEffect(() => {
    // Cursos
    const savedCursos = localStorage.getItem("sg_cursos");
    let availableCursos: ICurso[] = [];
    if (savedCursos) {
      availableCursos = JSON.parse(savedCursos);
      setCursos(availableCursos);
    }

    // Módulos
    const savedModulos = localStorage.getItem("sg_modulos");
    if (savedModulos) {
      setModulos(JSON.parse(savedModulos));
    } else {
      const defaultModulos: IModulo[] = [
        {
          id: "201",
          nome: "Módulo 1: Conceitos Básicos",
          descricao: "Aprenda sobre componentes, propriedades e estados no React.",
          cursoId: availableCursos[0]?.id || "101"
        },
        {
          id: "202",
          nome: "Módulo 2: Hooks Avançados",
          descricao: "Descubra o poder do useEffect, useContext e useMemo.",
          cursoId: availableCursos[0]?.id || "101"
        }
      ];
      setModulos(defaultModulos);
      localStorage.setItem("sg_modulos", JSON.stringify(defaultModulos));
    }
  }, []);

  // Selecionar curso padrão quando a lista de cursos carregar
  useEffect(() => {
    if (cursos.length > 0 && !cursoId) {
      setCursoId(cursos[0].id);
    }
  }, [cursos, cursoId]);

  const saveToLocalStorage = (data: IModulo[]) => {
    setModulos(data);
    localStorage.setItem("sg_modulos", JSON.stringify(data));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !descricao.trim() || !cursoId) return;

    if (editingId) {
      const updated = modulos.map((m) =>
        m.id === editingId ? { ...m, nome, descricao, cursoId } : m
      );
      saveToLocalStorage(updated);
      setEditingId(null);
    } else {
      const newModulo: IModulo = {
        id: Math.random().toString(36).substr(2, 9),
        nome,
        descricao,
        cursoId
      };
      saveToLocalStorage([...modulos, newModulo]);
    }

    setNome("");
    setDescricao("");
    if (cursos.length > 0) setCursoId(cursos[0].id);
  };

  const handleEdit = (modulo: IModulo) => {
    setEditingId(modulo.id);
    setNome(modulo.nome);
    setDescricao(modulo.descricao);
    setCursoId(modulo.cursoId);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este módulo?")) {
      const filtered = modulos.filter((m) => m.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setNome("");
    setDescricao("");
    if (cursos.length > 0) setCursoId(cursos[0].id);
  };

  const getCursoNome = (id: string) => {
    const c = cursos.find((c) => c.id === id);
    return c ? c.nome : "Sem Curso";
  };

  return (
    <div>
      <div className="row">
        <div className="col-12 col-md-5">
          <div className="card shadow mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold text-primary">
                {editingId ? "Editar Módulo" : "Novo Módulo"}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="curso" className="form-label fw-semibold">Selecione o Curso</label>
                  <select
                    id="curso"
                    className="form-select"
                    value={cursoId}
                    onChange={(e) => setCursoId(e.target.value)}
                    required
                  >
                    {cursos.length === 0 ? (
                      <option value="">Nenhum curso cadastrado</option>
                    ) : (
                      cursos.map((curso) => (
                        <option key={curso.id} value={curso.id}>
                          {curso.nome}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="nome" className="form-label fw-semibold">Nome do Módulo</label>
                  <input
                    type="text"
                    id="nome"
                    className="form-control"
                    placeholder="Ex: Módulo 1: Fundamentos"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="descricao" className="form-label fw-semibold">Descrição</label>
                  <textarea
                    id="descricao"
                    className="form-control"
                    rows={3}
                    placeholder="Descreva o conteúdo planejado para este módulo..."
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary px-4" disabled={cursos.length === 0}>
                    {editingId ? "Atualizar" : "Salvar"}
                  </button>
                  {editingId && (
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-7">
          <div className="card shadow">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold text-dark">Módulos Cadastrados</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-striped table-hover mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="px-4">Nome do Módulo</th>
                      <th>Curso Relacionado</th>
                      <th className="text-end px-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modulos.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center py-4 text-muted">
                          Nenhum módulo cadastrado.
                        </td>
                      </tr>
                    ) : (
                      modulos.map((modulo) => (
                        <tr key={modulo.id}>
                          <td className="px-4">
                            <div className="fw-semibold text-primary">{modulo.nome}</div>
                            <small className="text-muted d-block text-truncate" style={{ maxWidth: "250px" }}>
                              {modulo.descricao}
                            </small>
                          </td>
                          <td>
                            <span className="badge bg-info text-dark">{getCursoNome(modulo.cursoId)}</span>
                          </td>
                          <td className="text-end px-4">
                            <div className="d-flex gap-2 justify-content-end">
                              <button
                                className="btn btn-sm btn-outline-warning"
                                onClick={() => handleEdit(modulo)}
                              >
                                <i className="bi bi-pencil-square"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(modulo.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
