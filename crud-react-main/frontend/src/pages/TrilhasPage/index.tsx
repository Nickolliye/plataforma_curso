import { useState, useEffect } from "react";

export interface ITrilha {
  id: string;
  nome: string;
  descricao: string;
}

export const TrilhasPage = () => {
  const [trilhas, setTrilhas] = useState<ITrilha[]>([]);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Carregar dados iniciais ou do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sg_trilhas");
    if (saved) {
      setTrilhas(JSON.parse(saved));
    } else {
      const defaultTrilhas = [
        { id: "1", nome: "Desenvolvimento Fullstack", descricao: "Formação completa de frontend e backend" },
        { id: "2", nome: "Ciência de Dados", descricao: "Análise de dados, Machine Learning e IA" }
      ];
      setTrilhas(defaultTrilhas);
      localStorage.setItem("sg_trilhas", JSON.stringify(defaultTrilhas));
    }
  }, []);

  const saveToLocalStorage = (data: ITrilha[]) => {
    setTrilhas(data);
    localStorage.setItem("sg_trilhas", JSON.stringify(data));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !descricao.trim()) return;

    if (editingId) {
      const updated = trilhas.map((t) =>
        t.id === editingId ? { ...t, nome, descricao } : t
      );
      saveToLocalStorage(updated);
      setEditingId(null);
    } else {
      const newTrilha: ITrilha = {
        id: Math.random().toString(36).substr(2, 9),
        nome,
        descricao,
      };
      saveToLocalStorage([...trilhas, newTrilha]);
    }

    setNome("");
    setDescricao("");
  };

  const handleEdit = (trilha: ITrilha) => {
    setEditingId(trilha.id);
    setNome(trilha.nome);
    setDescricao(trilha.descricao);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta trilha?")) {
      const filtered = trilhas.filter((t) => t.id !== id);
      saveToLocalStorage(filtered);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setNome("");
    setDescricao("");
  };

  return (
    <div>
      <div className="row">
        <div className="col-12 col-md-5">
          <div className="card shadow mb-4">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold text-primary">
                {editingId ? "Editar Trilha" : "Nova Trilha"}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nome" className="form-label fw-semibold">Nome da Trilha</label>
                  <input
                    type="text"
                    id="nome"
                    className="form-control"
                    placeholder="Ex: Desenvolvimento Web"
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
                    placeholder="Descreva os objetivos desta trilha..."
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary px-4">
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
              <h5 className="mb-0 fw-bold text-dark">Trilhas Disponíveis</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-striped table-hover mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="px-4">Nome</th>
                      <th>Descrição</th>
                      <th className="text-end px-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trilhas.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center py-4 text-muted">
                          Nenhuma trilha cadastrada.
                        </td>
                      </tr>
                    ) : (
                      trilhas.map((trilha) => (
                        <tr key={trilha.id}>
                          <td className="px-4 fw-semibold text-primary">{trilha.nome}</td>
                          <td className="text-truncate" style={{ maxWidth: "250px" }}>
                            {trilha.descricao}
                          </td>
                          <td className="text-end px-4">
                            <div className="d-flex gap-2 justify-content-end">
                              <button
                                className="btn btn-sm btn-outline-warning"
                                onClick={() => handleEdit(trilha)}
                              >
                                <i className="bi bi-pencil-square"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(trilha.id)}
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
