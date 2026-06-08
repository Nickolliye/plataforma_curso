import { useState, useEffect } from "react";
import { type ITrilha } from "../TrilhasPage";

export interface ICurso {
  id: string;
  nome: string;
  descricao: string;
  cargaHoraria: number;
  trilhaId: string;
}

export const CursosPage = () => {
  const [cursos, setCursos] = useState<ICurso[]>([]);
  const [trilhas, setTrilhas] = useState<ITrilha[]>([]);
  
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [cargaHoraria, setCargaHoraria] = useState(20);
  const [trilhaId, setTrilhaId] = useState("");
  
  const [editingId, setEditingId] = useState<string | null>(null);

  // Carregar dados de trilhas e cursos
  useEffect(() => {
    // Trilhas
    const savedTrilhas = localStorage.getItem("sg_trilhas");
    let availableTrilhas: ITrilha[] = [];
    if (savedTrilhas) {
      availableTrilhas = JSON.parse(savedTrilhas);
      setTrilhas(availableTrilhas);
    }

    // Cursos
    const savedCursos = localStorage.getItem("sg_cursos");
    if (savedCursos) {
      setCursos(JSON.parse(savedCursos));
    } else {
      const defaultCursos: ICurso[] = [
        {
          id: "101",
          nome: "Introdução ao React",
          descricao: "Aprenda a criar interfaces reativas e modernas com React.js.",
          cargaHoraria: 40,
          trilhaId: availableTrilhas[0]?.id || "1"
        },
        {
          id: "102",
          nome: "Python Fundamentos",
          descricao: "Dê seus primeiros passos na linguagem de programação mais versátil.",
          cargaHoraria: 30,
          trilhaId: availableTrilhas[1]?.id || "2"
        }
      ];
      setCursos(defaultCursos);
      localStorage.setItem("sg_cursos", JSON.stringify(defaultCursos));
    }
  }, []);

  // Selecionar trilha padrão quando a lista de trilhas carregar
  useEffect(() => {
    if (trilhas.length > 0 && !trilhaId) {
      setTrilhaId(trilhas[0].id);
    }
  }, [trilhas, trilhaId]);

  const saveToLocalStorage = (data: ICurso[]) => {
    setCursos(data);
    localStorage.setItem("sg_cursos", JSON.stringify(data));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !descricao.trim() || !trilhaId) return;

    if (editingId) {
      const updated = cursos.map((c) =>
        c.id === editingId ? { ...c, nome, descricao, cargaHoraria, trilhaId } : c
      );
      saveToLocalStorage(updated);
      setEditingId(null);
    } else {
      const newCurso: ICurso = {
        id: Math.random().toString(36).substr(2, 9),
        nome,
        descricao,
        cargaHoraria: Number(cargaHoraria),
        trilhaId
      };
      saveToLocalStorage([...cursos, newCurso]);
    }

    setNome("");
    setDescricao("");
    setCargaHoraria(20);
    if (trilhas.length > 0) setTrilhaId(trilhas[0].id);
  };

  const handleEdit = (curso: ICurso) => {
    setEditingId(curso.id);
    setNome(curso.nome);
    setDescricao(curso.descricao);
    setCargaHoraria(curso.cargaHoraria);
    setTrilhaId(curso.trilhaId);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este curso?")) {
      const filtered = cursos.filter((c) => c.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setNome("");
    setDescricao("");
    setCargaHoraria(20);
    if (trilhas.length > 0) setTrilhaId(trilhas[0].id);
  };

  const getTrilhaNome = (id: string) => {
    const t = trilhas.find((t) => t.id === id);
    return t ? t.nome : "Sem Trilha";
  };

  return (
    <div>
      <div className="row">
        <div className="col-12 col-md-5">
          <div className="card shadow mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold text-primary">
                {editingId ? "Editar Curso" : "Novo Curso"}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="trilha" className="form-label fw-semibold">Selecione a Trilha</label>
                  <select
                    id="trilha"
                    className="form-select"
                    value={trilhaId}
                    onChange={(e) => setTrilhaId(e.target.value)}
                    required
                  >
                    {trilhas.length === 0 ? (
                      <option value="">Nenhuma trilha cadastrada</option>
                    ) : (
                      trilhas.map((trilha) => (
                        <option key={trilha.id} value={trilha.id}>
                          {trilha.nome}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="nome" className="form-label fw-semibold">Nome do Curso</label>
                  <input
                    type="text"
                    id="nome"
                    className="form-control"
                    placeholder="Ex: React Básico"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="cargaHoraria" className="form-label fw-semibold">Carga Horária (horas)</label>
                  <input
                    type="number"
                    id="cargaHoraria"
                    className="form-control"
                    min="1"
                    value={cargaHoraria}
                    onChange={(e) => setCargaHoraria(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="descricao" className="form-label fw-semibold">Descrição</label>
                  <textarea
                    id="descricao"
                    className="form-control"
                    rows={3}
                    placeholder="Descreva o conteúdo do curso..."
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary px-4" disabled={trilhas.length === 0}>
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
              <h5 className="mb-0 fw-bold text-dark">Cursos Disponíveis</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-striped table-hover mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="px-4">Nome</th>
                      <th>Trilha</th>
                      <th>Carga Horária</th>
                      <th className="text-end px-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cursos.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-muted">
                          Nenhum curso cadastrado.
                        </td>
                      </tr>
                    ) : (
                      cursos.map((curso) => (
                        <tr key={curso.id}>
                          <td className="px-4">
                            <div className="fw-semibold text-primary">{curso.nome}</div>
                            <small className="text-muted d-block text-truncate" style={{ maxWidth: "200px" }}>
                              {curso.descricao}
                            </small>
                          </td>
                          <td>
                            <span className="badge bg-secondary">{getTrilhaNome(curso.trilhaId)}</span>
                          </td>
                          <td>{curso.cargaHoraria} hrs</td>
                          <td className="text-end px-4">
                            <div className="d-flex gap-2 justify-content-end">
                              <button
                                className="btn btn-sm btn-outline-warning"
                                onClick={() => handleEdit(curso)}
                              >
                                <i className="bi bi-pencil-square"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(curso.id)}
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
