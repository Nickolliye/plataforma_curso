import { useState, useEffect } from "react";
import { type IModulo } from "../ModulosPage";

export interface IAula {
  id: string;
  nome: string;
  descricao: string;
  videoUrl: string;
  moduloId: string;
}

export const AulasPage = () => {
  const [aulas, setAulas] = useState<IAula[]>([]);
  const [modulos, setModulos] = useState<IModulo[]>([]);
  
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [moduloId, setModuloId] = useState("");
  
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const savedModulos = localStorage.getItem("sg_modulos");
    let availableModulos: IModulo[] = [];
    if (savedModulos) {
      availableModulos = JSON.parse(savedModulos);
      setModulos(availableModulos);
    }

    const savedAulas = localStorage.getItem("sg_aulas");
    if (savedAulas) {
      setAulas(JSON.parse(savedAulas));
    } else {
      const defaultAulas: IAula[] = [
        {
          id: "301",
          nome: "1.1 O que é o React?",
          descricao: "Entenda a história do React, o ecossistema e o DOM virtual.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          moduloId: availableModulos[0]?.id || "201"
        },
        {
          id: "302",
          nome: "1.2 Primeiro Componente",
          descricao: "Escrevendo seu primeiro componente funcional e usando JSX.",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          moduloId: availableModulos[0]?.id || "201"
        }
      ];
      setAulas(defaultAulas);
      localStorage.setItem("sg_aulas", JSON.stringify(defaultAulas));
    }
  }, []);

  useEffect(() => {
    if (modulos.length > 0 && !moduloId) {
      setModuloId(modulos[0].id);
    }
  }, [modulos, moduloId]);

  const saveToLocalStorage = (data: IAula[]) => {
    setAulas(data);
    localStorage.setItem("sg_aulas", JSON.stringify(data));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !descricao.trim() || !videoUrl.trim() || !moduloId) return;

    if (editingId) {
      const updated = aulas.map((a) =>
        a.id === editingId ? { ...a, nome, descricao, videoUrl, moduloId } : a
      );
      saveToLocalStorage(updated);
      setEditingId(null);
    } else {
      const newAula: IAula = {
        id: Math.random().toString(36).substr(2, 9),
        nome,
        descricao,
        videoUrl,
        moduloId
      };
      saveToLocalStorage([...aulas, newAula]);
    }

    setNome("");
    setDescricao("");
    setVideoUrl("");
    if (modulos.length > 0) setModuloId(modulos[0].id);
  };

  const handleEdit = (aula: IAula) => {
    setEditingId(aula.id);
    setNome(aula.nome);
    setDescricao(aula.descricao);
    setVideoUrl(aula.videoUrl);
    setModuloId(aula.moduloId);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta aula?")) {
      const filtered = aulas.filter((a) => a.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setNome("");
    setDescricao("");
    setVideoUrl("");
    if (modulos.length > 0) setModuloId(modulos[0].id);
  };

  const getModuloNome = (id: string) => {
    const m = modulos.find((m) => m.id === id);
    return m ? m.nome : "Sem Módulo";
  };

  return (
    <div>
      <div className="row">
        <div className="col-12 col-md-5">
          <div className="card shadow mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold text-primary">
                {editingId ? "Editar Aula" : "Nova Aula"}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="modulo" className="form-label fw-semibold">Selecione o Módulo</label>
                  <select
                    id="modulo"
                    className="form-select"
                    value={moduloId}
                    onChange={(e) => setModuloId(e.target.value)}
                    required
                  >
                    {modulos.length === 0 ? (
                      <option value="">Nenhum módulo cadastrado</option>
                    ) : (
                      modulos.map((modulo) => (
                        <option key={modulo.id} value={modulo.id}>
                          {modulo.nome}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="nome" className="form-label fw-semibold">Nome da Aula</label>
                  <input
                    type="text"
                    id="nome"
                    className="form-control"
                    placeholder="Ex: 1.1 - O que é JSX"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="videoUrl" className="form-label fw-semibold">URL do Vídeo (Embed/YouTube)</label>
                  <input
                    type="url"
                    id="videoUrl"
                    className="form-control"
                    placeholder="https://www.youtube.com/embed/..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="descricao" className="form-label fw-semibold">Descrição/Objetivo</label>
                  <textarea
                    id="descricao"
                    className="form-control"
                    rows={3}
                    placeholder="Descreva o conteúdo ou recursos desta aula..."
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary px-4" disabled={modulos.length === 0}>
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
              <h5 className="mb-0 fw-bold text-dark">Aulas Disponíveis</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-striped table-hover mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="px-4">Nome da Aula</th>
                      <th>Módulo Relacionado</th>
                      <th className="text-end px-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aulas.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center py-4 text-muted">
                          Nenhuma aula cadastrada.
                        </td>
                      </tr>
                    ) : (
                      aulas.map((aula) => (
                        <tr key={aula.id}>
                          <td className="px-4">
                            <div className="fw-semibold text-primary">{aula.nome}</div>
                            <small className="text-muted d-block text-truncate" style={{ maxWidth: "200px" }}>
                              {aula.descricao}
                            </small>
                          </td>
                          <td>
                            <span className="badge bg-dark text-light">{getModuloNome(aula.moduloId)}</span>
                          </td>
                          <td className="text-end px-4">
                            <div className="d-flex gap-2 justify-content-end">
                              <button
                                className="btn btn-sm btn-outline-warning"
                                onClick={() => handleEdit(aula)}
                              >
                                <i className="bi bi-pencil-square"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(aula.id)}
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
